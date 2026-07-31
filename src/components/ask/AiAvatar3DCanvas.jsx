import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export const AiAvatar3DCanvas = ({ pending = false, streaming = false }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let animId = null;
    let scene, camera, renderer;
    let orbGroup, orbMesh, coreMesh, ringMesh, particlesMesh;
    let targetRotX = 0;
    let targetRotY = 0;

    try {
      const width = container.clientWidth || 160;
      const height = container.clientHeight || 160;

      // 1. Scene & Camera Setup
      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
      camera.position.z = 4.2;

      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

      container.innerHTML = '';
      container.appendChild(renderer.domElement);

      // 2. Lighting
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
      scene.add(ambientLight);

      const dirLight = new THREE.DirectionalLight(0xffe082, 1.5);
      dirLight.position.set(4, 4, 4);
      scene.add(dirLight);

      const pointLight = new THREE.PointLight(0xc0392b, 2.5, 8);
      pointLight.position.set(0, 0, 2);
      scene.add(pointLight);

      // 3. AI Orb Group
      orbGroup = new THREE.Group();
      scene.add(orbGroup);

      // 3A. Outer Wireframe AI Neural Shell
      const orbGeo = new THREE.IcosahedronGeometry(1.0, 2);
      const orbMat = new THREE.MeshStandardMaterial({
        color: 0xc0392b,
        wireframe: true,
        roughness: 0.2,
        metalness: 0.8,
      });
      orbMesh = new THREE.Mesh(orbGeo, orbMat);
      orbGroup.add(orbMesh);

      // 3B. Luminous Glowing Core
      const coreGeo = new THREE.IcosahedronGeometry(0.65, 2);
      const coreMat = new THREE.MeshStandardMaterial({
        color: 0xd9a13b,
        roughness: 0.1,
        metalness: 0.3,
        transparent: true,
        opacity: 0.85,
        flatShading: true,
      });
      coreMesh = new THREE.Mesh(coreGeo, coreMat);
      orbGroup.add(coreMesh);

      // 3C. Orbiting Halo Ring
      const ringGeo = new THREE.TorusGeometry(1.4, 0.03, 16, 64);
      const ringMat = new THREE.MeshStandardMaterial({
        color: 0x15756c,
        roughness: 0.3,
        metalness: 0.7,
      });
      ringMesh = new THREE.Mesh(ringGeo, ringMat);
      ringMesh.rotation.x = Math.PI / 2.5;
      orbGroup.add(ringMesh);

      // 3D. Ambient Particles Wave
      const particleCount = 45;
      const particleGeo = new THREE.BufferGeometry();
      const posArray = new Float32Array(particleCount * 3);

      for (let i = 0; i < particleCount * 3; i += 3) {
        const rad = 1.5 + Math.random() * 0.7;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(Math.random() * 2 - 1);
        posArray[i] = rad * Math.sin(phi) * Math.cos(theta);
        posArray[i + 1] = rad * Math.sin(phi) * Math.sin(theta);
        posArray[i + 2] = rad * Math.cos(phi);
      }

      particleGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

      const particleMat = new THREE.PointsMaterial({
        size: 0.04,
        color: 0xffe082,
        transparent: true,
        opacity: 0.75,
      });

      particlesMesh = new THREE.Points(particleGeo, particleMat);
      orbGroup.add(particlesMesh);

      // 4. Pointer Interaction
      const handlePointerMove = (e) => {
        const rect = container.getBoundingClientRect();
        const clientX = e.clientX ?? e.touches?.[0]?.clientX ?? (rect.left + rect.width / 2);
        const clientY = e.clientY ?? e.touches?.[0]?.clientY ?? (rect.top + rect.height / 2);
        const x = (clientX - rect.left) / rect.width - 0.5;
        const y = (clientY - rect.top) / rect.height - 0.5;
        targetRotY = x * 0.9;
        targetRotX = y * 0.9;
      };

      window.addEventListener('pointermove', handlePointerMove);

      // 5. Animation Loop
      const startTime = performance.now();

      const animate = () => {
        animId = requestAnimationFrame(animate);
        const elapsedTime = (performance.now() - startTime) * 0.001;

        const speedMultiplier = pending || streaming ? 2.5 : 1.0;

        // Rotations
        orbMesh.rotation.y += 0.012 * speedMultiplier;
        orbMesh.rotation.x += 0.006 * speedMultiplier;
        coreMesh.rotation.y -= 0.015 * speedMultiplier;
        ringMesh.rotation.z = elapsedTime * 0.6 * speedMultiplier;
        particlesMesh.rotation.y = -elapsedTime * 0.4 * speedMultiplier;

        // Pulse scale when thinking
        const pulse = Math.sin(elapsedTime * 4 * speedMultiplier) * 0.08;
        coreMesh.scale.set(1 + pulse, 1 + pulse, 1 + pulse);

        // Smooth Mouse/Touch tilt
        orbGroup.rotation.x += (targetRotX - orbGroup.rotation.x) * 0.08;
        orbGroup.rotation.y += (targetRotY - orbGroup.rotation.y) * 0.08;

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
        orbGeo.dispose();
        orbMat.dispose();
        coreGeo.dispose();
        coreMat.dispose();
        ringGeo.dispose();
        ringMat.dispose();
        particleGeo.dispose();
        particleMat.dispose();
      };
    } catch {
      // Graceful fallback if WebGL fails
      return undefined;
    }
  }, [pending, streaming]);

  return (
    <div
      ref={containerRef}
      className="relative w-[150px] h-[150px] mx-auto cursor-grab active:cursor-grabbing flex items-center justify-center"
      title="AURA 3D Interactive AI Specialist — Hover to rotate"
    />
  );
};

export default AiAvatar3DCanvas;
