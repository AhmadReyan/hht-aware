import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export const AiAvatar3DCanvas = ({ pending = false, streaming = false, onClick }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let animId = null;
    let scene, camera, renderer;
    let botGroup, headMesh, visorMesh, leftEyeMesh, rightEyeMesh, antennaTip, ringMesh, particlesMesh;
    let targetRotX = 0;
    let targetRotY = 0;

    try {
      const width = container.clientWidth || 160;
      const height = container.clientHeight || 160;

      // 1. Scene & Camera
      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
      camera.position.z = 4.2;

      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

      container.innerHTML = '';
      container.appendChild(renderer.domElement);

      // 2. Lighting
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.95);
      scene.add(ambientLight);

      const dirLight = new THREE.DirectionalLight(0xffe082, 1.6);
      dirLight.position.set(4, 5, 4);
      scene.add(dirLight);

      const rimLight = new THREE.PointLight(0x8e2d3b, 3, 10);
      rimLight.position.set(-3, -2, 2);
      scene.add(rimLight);

      // 3. Bot Group
      botGroup = new THREE.Group();
      scene.add(botGroup);

      // 3A. Metallic Rounded Robot Head
      const headGeo = new THREE.SphereGeometry(0.95, 32, 32);
      headGeo.scale(1, 0.92, 0.95);
      const headMat = new THREE.MeshStandardMaterial({
        color: 0x8e2d3b,
        roughness: 0.25,
        metalness: 0.75,
      });
      headMesh = new THREE.Mesh(headGeo, headMat);
      botGroup.add(headMesh);

      // 3B. Obsidian Curved Visor Screen
      const visorGeo = new THREE.SphereGeometry(0.86, 32, 16, 0, Math.PI * 2, 0.45, 0.7);
      visorGeo.scale(1.02, 0.7, 0.5);
      const visorMat = new THREE.MeshStandardMaterial({
        color: 0x111827,
        roughness: 0.1,
        metalness: 0.9,
      });
      visorMesh = new THREE.Mesh(visorGeo, visorMat);
      visorMesh.position.set(0, 0.05, 0.52);
      botGroup.add(visorMesh);

      // 3C. Twin LED Visor Eyes
      const eyeGeo = new THREE.SphereGeometry(0.12, 16, 16);
      const eyeMat = new THREE.MeshStandardMaterial({
        color: 0xd9a13b,
        emissive: 0xd9a13b,
        emissiveIntensity: 0.9,
        roughness: 0.1,
      });
      leftEyeMesh = new THREE.Mesh(eyeGeo, eyeMat);
      leftEyeMesh.position.set(-0.32, 0.08, 0.88);

      rightEyeMesh = new THREE.Mesh(eyeGeo, eyeMat);
      rightEyeMesh.position.set(0.32, 0.08, 0.88);

      botGroup.add(leftEyeMesh);
      botGroup.add(rightEyeMesh);

      // 3D. Antenna & Signal Orb
      const antennaStemGeo = new THREE.CylinderGeometry(0.025, 0.035, 0.4, 16);
      const antennaStemMat = new THREE.MeshStandardMaterial({ color: 0x4a5568, metalness: 0.8, roughness: 0.2 });
      const stemMesh = new THREE.Mesh(antennaStemGeo, antennaStemMat);
      stemMesh.position.set(0, 1.05, 0);
      botGroup.add(stemMesh);

      const tipGeo = new THREE.SphereGeometry(0.11, 16, 16);
      const tipMat = new THREE.MeshStandardMaterial({
        color: 0x15756c,
        emissive: 0x15756c,
        emissiveIntensity: 0.8,
      });
      antennaTip = new THREE.Mesh(tipGeo, tipMat);
      antennaTip.position.set(0, 1.25, 0);
      botGroup.add(antennaTip);

      // 3E. Left & Right Ear Pods
      const earGeo = new THREE.CylinderGeometry(0.18, 0.18, 0.15, 16);
      const earMat = new THREE.MeshStandardMaterial({ color: 0xd9a13b, metalness: 0.7, roughness: 0.3 });
      const leftEar = new THREE.Mesh(earGeo, earMat);
      leftEar.rotation.z = Math.PI / 2;
      leftEar.position.set(-0.95, 0, 0);

      const rightEar = new THREE.Mesh(earGeo, earMat);
      rightEar.rotation.z = Math.PI / 2;
      rightEar.position.set(0.95, 0, 0);

      botGroup.add(leftEar);
      botGroup.add(rightEar);

      // 3F. Orbiting Halo Ring
      const ringGeo = new THREE.TorusGeometry(1.4, 0.025, 16, 64);
      const ringMat = new THREE.MeshStandardMaterial({
        color: 0xd9a13b,
        metalness: 0.8,
        roughness: 0.2,
      });
      ringMesh = new THREE.Mesh(ringGeo, ringMat);
      ringMesh.rotation.x = Math.PI / 2.3;
      botGroup.add(ringMesh);

      // 3G. Ambient Particles
      const particleCount = 35;
      const particleGeo = new THREE.BufferGeometry();
      const posArray = new Float32Array(particleCount * 3);

      for (let i = 0; i < particleCount * 3; i += 3) {
        const rad = 1.5 + Math.random() * 0.6;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(Math.random() * 2 - 1);
        posArray[i] = rad * Math.sin(phi) * Math.cos(theta);
        posArray[i + 1] = rad * Math.sin(phi) * Math.sin(theta);
        posArray[i + 2] = rad * Math.cos(phi);
      }

      particleGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

      const particleMat = new THREE.PointsMaterial({
        size: 0.035,
        color: 0xffe082,
        transparent: true,
        opacity: 0.75,
      });

      particlesMesh = new THREE.Points(particleGeo, particleMat);
      botGroup.add(particlesMesh);

      // 4. Pointer Interaction
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

        const speedMultiplier = pending || streaming ? 2.5 : 1.0;

        // Bobbing & Rotations
        botGroup.position.y = Math.sin(elapsedTime * 2.2) * 0.07;
        ringMesh.rotation.z = elapsedTime * 0.5 * speedMultiplier;
        particlesMesh.rotation.y = -elapsedTime * 0.3 * speedMultiplier;

        // Eye & Antenna pulse
        const pulse = Math.sin(elapsedTime * 5 * speedMultiplier) * 0.3 + 0.9;
        antennaTip.material.emissiveIntensity = pulse * 1.2;
        leftEyeMesh.material.emissiveIntensity = pulse;
        rightEyeMesh.material.emissiveIntensity = pulse;

        // Smooth Pointer Tilt
        botGroup.rotation.x += (targetRotX - botGroup.rotation.x) * 0.08;
        botGroup.rotation.y += (targetRotY - botGroup.rotation.y) * 0.08;

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
        headGeo.dispose();
        headMat.dispose();
        visorGeo.dispose();
        visorMat.dispose();
        eyeGeo.dispose();
        eyeMat.dispose();
        antennaStemGeo.dispose();
        antennaStemMat.dispose();
        tipGeo.dispose();
        tipMat.dispose();
        earGeo.dispose();
        earMat.dispose();
        ringGeo.dispose();
        ringMat.dispose();
        particleGeo.dispose();
        particleMat.dispose();
      };
    } catch {
      return undefined;
    }
  }, [pending, streaming]);

  return (
    <div
      ref={containerRef}
      onClick={onClick}
      className="relative w-[160px] h-[160px] mx-auto cursor-pointer active:scale-95 transition-transform flex items-center justify-center select-none"
      title="AURA 3D Animated Bot — Tap to meet AURA!"
    />
  );
};

export default AiAvatar3DCanvas;
