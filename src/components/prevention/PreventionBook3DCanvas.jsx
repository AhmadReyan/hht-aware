import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export const PreventionBook3DCanvas = ({ categoryId = 'nasal-care', pageIndex = 0 }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let animId = null;
    let scene, camera, renderer;
    let bookGroup, leftCover, rightCover, pagesMesh, floatingIconMesh;

    try {
      const width = container.clientWidth || 280;
      const height = container.clientHeight || 200;

      // 1. Scene & Camera
      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
      camera.position.set(0, 1.2, 4.0);
      camera.lookAt(0, 0, 0);

      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

      container.innerHTML = '';
      container.appendChild(renderer.domElement);

      // 2. Lighting
      const ambientLight = new THREE.AmbientLight(0xffffff, 1.0);
      scene.add(ambientLight);

      const dirLight = new THREE.DirectionalLight(0xffe082, 1.4);
      dirLight.position.set(3, 5, 4);
      scene.add(dirLight);

      const pointLight = new THREE.PointLight(0x8e2d3b, 2, 8);
      pointLight.position.set(0, 1, 2);
      scene.add(pointLight);

      // 3. 3D Book Group
      bookGroup = new THREE.Group();
      scene.add(bookGroup);

      // Left Cover
      const coverMat = new THREE.MeshStandardMaterial({
        color: 0x8e2d3b,
        roughness: 0.3,
        metalness: 0.4,
      });
      const pageMat = new THREE.MeshStandardMaterial({
        color: 0xf6efeb,
        roughness: 0.5,
        metalness: 0.1,
      });

      const coverGeo = new THREE.BoxGeometry(1.2, 1.6, 0.08);

      leftCover = new THREE.Mesh(coverGeo, coverMat);
      leftCover.position.set(-0.6, 0, 0);
      leftCover.rotation.y = Math.PI * 0.15;
      bookGroup.add(leftCover);

      // Right Cover
      rightCover = new THREE.Mesh(coverGeo, coverMat);
      rightCover.position.set(0.6, 0, 0);
      rightCover.rotation.y = -Math.PI * 0.15;
      bookGroup.add(rightCover);

      // Open Pages Center Block
      const pagesGeo = new THREE.BoxGeometry(2.2, 1.5, 0.15);
      pagesMesh = new THREE.Mesh(pagesGeo, pageMat);
      pagesMesh.position.set(0, -0.02, 0.05);
      bookGroup.add(pagesMesh);

      // 3D Category Floating Glyph/Object
      let glyphGeo;
      if (categoryId === 'first-aid' || categoryId === 'emergency') {
        glyphGeo = new THREE.OctahedronGeometry(0.4, 0);
      } else if (categoryId === 'diet' || categoryId === 'nutrition') {
        glyphGeo = new THREE.DodecahedronGeometry(0.38, 0);
      } else if (categoryId === 'environment' || categoryId === 'humidity') {
        glyphGeo = new THREE.TorusGeometry(0.35, 0.1, 16, 32);
      } else {
        glyphGeo = new THREE.IcosahedronGeometry(0.38, 0);
      }

      const glyphMat = new THREE.MeshStandardMaterial({
        color: 0xd9a13b,
        roughness: 0.2,
        metalness: 0.8,
      });
      floatingIconMesh = new THREE.Mesh(glyphGeo, glyphMat);
      floatingIconMesh.position.set(0, 0.8, 0.3);
      bookGroup.add(floatingIconMesh);

      // 4. Animation Loop
      const startTime = performance.now();

      const animate = () => {
        animId = requestAnimationFrame(animate);
        const elapsedTime = (performance.now() - startTime) * 0.001;

        // Subtle book float & turn
        bookGroup.rotation.y = Math.sin(elapsedTime * 0.8) * 0.15;
        bookGroup.rotation.x = Math.cos(elapsedTime * 0.6) * 0.05;

        // Floating glyph rotation & pulse
        if (floatingIconMesh) {
          floatingIconMesh.rotation.y += 0.02;
          floatingIconMesh.rotation.x += 0.01;
          floatingIconMesh.position.y = 0.8 + Math.sin(elapsedTime * 2.5 + pageIndex) * 0.08;
        }

        // Page turn angle shift
        const targetOpen = 0.15 + (pageIndex % 2) * 0.05;
        leftCover.rotation.y += (Math.PI * targetOpen - leftCover.rotation.y) * 0.05;

        renderer.render(scene, camera);
      };

      animate();

      return () => {
        if (animId) cancelAnimationFrame(animId);
        if (renderer && renderer.domElement) {
          renderer.domElement.remove();
          renderer.dispose();
        }
        coverGeo.dispose();
        coverMat.dispose();
        pagesGeo.dispose();
        pageMat.dispose();
        if (glyphGeo) glyphGeo.dispose();
        glyphMat.dispose();
      };
    } catch {
      return undefined;
    }
  }, [categoryId, pageIndex]);

  return (
    <div
      ref={containerRef}
      className="relative w-[280px] h-[200px] mx-auto flex items-center justify-center pointer-events-none"
    />
  );
};

export default PreventionBook3DCanvas;
