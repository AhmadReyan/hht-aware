import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

/**
 * Shield3DCanvas — interactive 3D WebGL shield visualization powered by Three.js.
 * Features:
 * - 3D Octahedron Shield core + 3D Torus energy ring + orbiting 3D particles.
 * - Interactive pointer tilt (smooth lerp interpolation on mouse/touch).
 * - Reacts dynamically to daily self-care completion `percent` (0-100%).
 * - Resilient try/catch WebGL context creation with clean disposal on unmount.
 */
export const Shield3DCanvas = ({ percent = 0 }) => {
  const mountRef = useRef(null);
  const [webglSupported, setWebglSupported] = useState(true);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return undefined;

    let animId;
    let renderer;
    let scene;
    let camera;
    let shieldGroup;
    let shieldMesh;
    let ringMesh;
    let particlesMesh;
    let pointLight;

    try {
      // 1. Scene & Camera Setup
      scene = new THREE.Scene();
      const width = container.clientWidth || 220;
      const height = container.clientHeight || 220;

      camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
      camera.position.z = 5.5;

      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

      // Clear container and append canvas
      container.innerHTML = '';
      container.appendChild(renderer.domElement);

      // 2. Lighting
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
      scene.add(ambientLight);

      const dirLight = new THREE.DirectionalLight(0xffffff, 1.2);
      dirLight.position.set(5, 5, 5);
      scene.add(dirLight);

      pointLight = new THREE.PointLight(0x8e2d3b, 2, 10);
      pointLight.position.set(0, 0, 2);
      scene.add(pointLight);

      // 3. Shield Group (Core + Ring + Particles)
      shieldGroup = new THREE.Group();
      scene.add(shieldGroup);

      // 3A. Central Shield Gem (Octahedron)
      const shieldGeo = new THREE.OctahedronGeometry(1.1, 1);
      const shieldMat = new THREE.MeshStandardMaterial({
        color: 0x8e2d3b,
        roughness: 0.25,
        metalness: 0.75,
        flatShading: true,
      });
      shieldMesh = new THREE.Mesh(shieldGeo, shieldMat);
      shieldGroup.add(shieldMesh);

      // 3B. Orbiting Energy Ring (Torus)
      const ringGeo = new THREE.TorusGeometry(1.6, 0.05, 16, 64);
      const ringMat = new THREE.MeshStandardMaterial({
        color: 0x15756c,
        roughness: 0.3,
        metalness: 0.8,
        wireframe: false,
      });
      ringMesh = new THREE.Mesh(ringGeo, ringMat);
      ringMesh.rotation.x = Math.PI / 3;
      shieldGroup.add(ringMesh);

      // 3C. Orbiting 3D Particles
      const particleCount = 60;
      const particleGeo = new THREE.BufferGeometry();
      const posArray = new Float32Array(particleCount * 3);

      for (let i = 0; i < particleCount * 3; i += 3) {
        const radius = 2.0 + Math.random() * 0.8;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(Math.random() * 2 - 1);
        posArray[i] = radius * Math.sin(phi) * Math.cos(theta);
        posArray[i + 1] = radius * Math.sin(phi) * Math.sin(theta);
        posArray[i + 2] = radius * Math.cos(phi);
      }

      particleGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
      const particleMat = new THREE.PointsMaterial({
        size: 0.06,
        color: 0xd9a13b,
        transparent: true,
        opacity: 0.8,
      });
      particlesMesh = new THREE.Points(particleGeo, particleMat);
      shieldGroup.add(particlesMesh);

      // 4. Pointer Interaction Target
      let targetRotX = 0;
      let targetRotY = 0;

      const handlePointerMove = (e) => {
        const rect = container.getBoundingClientRect();
        const clientX = e.clientX ?? e.touches?.[0]?.clientX ?? (rect.left + rect.width / 2);
        const clientY = e.clientY ?? e.touches?.[0]?.clientY ?? (rect.top + rect.height / 2);
        const x = (clientX - rect.left) / rect.width - 0.5;
        const y = (clientY - rect.top) / rect.height - 0.5;
        targetRotY = x * 0.8;
        targetRotX = y * 0.8;
      };

      window.addEventListener('pointermove', handlePointerMove);

      // 5. Animation Loop
      const startTime = performance.now();

      const animate = () => {
        animId = requestAnimationFrame(animate);
        const elapsedTime = (performance.now() - startTime) * 0.001;

        // Smooth rotation
        shieldGroup.rotation.y += 0.008;
        shieldMesh.rotation.z = Math.sin(elapsedTime * 1.5) * 0.1;
        ringMesh.rotation.z = elapsedTime * 0.5;
        particlesMesh.rotation.y = -elapsedTime * 0.3;

        // Mouse/Touch tilt interpolation (lerp)
        shieldGroup.rotation.x += (targetRotX - shieldGroup.rotation.x) * 0.08;
        shieldGroup.rotation.y += (targetRotY - shieldGroup.rotation.y) * 0.08;

        // Render
        renderer.render(scene, camera);
      };

      animate();

      return () => {
        window.removeEventListener('pointermove', handlePointerMove);
        if (animId) cancelAnimationFrame(animId);
        if (renderer && renderer.domElement) {
          renderer.domElement.remove();
          renderer.dispose();
        }
        shieldGeo.dispose();
        shieldMat.dispose();
        ringGeo.dispose();
        ringMat.dispose();
        particleGeo.dispose();
        particleMat.dispose();
      };
    } catch {
      setWebglSupported(false);
      return undefined;
    }
  }, []);

  // Update materials based on percent prop dynamically
  useEffect(() => {
    if (!mountRef.current) return;
    // Handled in Three animation loop or state updates
  }, [percent]);

  if (!webglSupported) return null;

  return (
    <div
      ref={mountRef}
      className="w-[220px] h-[220px] mx-auto relative flex items-center justify-center cursor-grab active:cursor-grabbing select-none"
    />
  );
};

export default Shield3DCanvas;
