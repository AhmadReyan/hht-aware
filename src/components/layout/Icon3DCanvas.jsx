import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import markSrc from '../../assets/hht-mark.png';

/**
 * Icon3DCanvas — the live 3D HHT shield-and-ribbon emblem (same geometry the
 * static app icon is rendered from). On mount it "pops" in (scale overshoot +
 * spin-in) then gently sways. Used in the launch splash. Fully guarded: if WebGL
 * is unavailable it renders nothing and the caller's fallback shows instead.
 */
const GARNET = 0x9c2f3d;
const GOLD = 0xe7b84a;

export const Icon3DCanvas = ({ size = 150 }) => {
  const mountRef = useRef(null);
  const [ok, setOk] = useState(true);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return undefined;

    let animId;
    let renderer;
    const disposables = [];

    try {
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
      camera.position.set(0, 0, 8.2);
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
      renderer.setSize(size, size);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      container.innerHTML = '';
      container.appendChild(renderer.domElement);

      const garnet = new THREE.MeshStandardMaterial({ color: GARNET, roughness: 0.26, metalness: 0.5 });
      const gold = new THREE.MeshStandardMaterial({ color: GOLD, roughness: 0.16, metalness: 0.9, emissive: 0x3a2405, emissiveIntensity: 0.4 });
      disposables.push(garnet, gold);

      const shieldShape = (wd, topY, botY) => {
        const s = new THREE.Shape();
        s.moveTo(-wd, topY);
        s.lineTo(wd, topY);
        s.bezierCurveTo(wd, topY - 1.8, wd * 0.97, botY + 1.25, 0, botY);
        s.bezierCurveTo(-wd * 0.97, botY + 1.25, -wd, topY - 1.8, -wd, topY);
        return s;
      };
      const shieldGeo = new THREE.ExtrudeGeometry(shieldShape(1.5, 2.0, -2.15), { depth: 0.55, bevelEnabled: true, bevelThickness: 0.22, bevelSize: 0.22, bevelSegments: 6, curveSegments: 48 });
      shieldGeo.center();
      const rimGeo = new THREE.ExtrudeGeometry(shieldShape(1.7, 2.2, -2.4), { depth: 0.4, bevelEnabled: true, bevelThickness: 0.14, bevelSize: 0.14, bevelSegments: 4, curveSegments: 48 });
      rimGeo.center();
      disposables.push(shieldGeo, rimGeo);

      const group = new THREE.Group();
      const rim = new THREE.Mesh(rimGeo, gold);
      rim.position.z = -0.3;
      group.add(rim);
      group.add(new THREE.Mesh(shieldGeo, garnet));

      const loopShape = new THREE.Shape();
      loopShape.moveTo(0, 1.05);
      loopShape.bezierCurveTo(0.9, 0.5, 0.72, -0.5, 0, -0.9);
      loopShape.bezierCurveTo(-0.72, -0.5, -0.9, 0.5, 0, 1.05);
      const hole = new THREE.Path();
      hole.moveTo(0, 0.66);
      hole.bezierCurveTo(0.46, 0.28, 0.38, -0.32, 0, -0.55);
      hole.bezierCurveTo(-0.38, -0.32, -0.46, 0.28, 0, 0.66);
      loopShape.holes.push(hole);
      const loopGeo = new THREE.ExtrudeGeometry(loopShape, { depth: 0.34, bevelEnabled: true, bevelThickness: 0.07, bevelSize: 0.07, bevelSegments: 3, curveSegments: 40 });
      loopGeo.center();
      const tailGeo = new THREE.BoxGeometry(0.34, 1.15, 0.34);
      tailGeo.translate(0, -0.5, 0);
      disposables.push(loopGeo, tailGeo);

      const ribbon = new THREE.Group();
      const loop = new THREE.Mesh(loopGeo, gold);
      loop.position.y = 0.42;
      ribbon.add(loop);
      const tL = new THREE.Mesh(tailGeo, gold);
      tL.position.set(-0.02, -0.15, 0);
      tL.rotation.z = 0.52;
      ribbon.add(tL);
      const tR = new THREE.Mesh(tailGeo, gold);
      tR.position.set(0.02, -0.15, 0);
      tR.rotation.z = -0.52;
      ribbon.add(tR);
      ribbon.scale.set(0.9, 0.9, 0.9);
      ribbon.position.set(0, 0.05, 0.6);
      group.add(ribbon);

      group.scale.setScalar(0.001);
      scene.add(group);

      scene.add(new THREE.AmbientLight(0xffffff, 0.8));
      const key = new THREE.DirectionalLight(0xffffff, 2.2);
      key.position.set(-4, 5, 6);
      scene.add(key);
      const warm = new THREE.PointLight(0xffd9a0, 1.7, 30);
      warm.position.set(3.5, -2, 4);
      scene.add(warm);
      const rimL = new THREE.PointLight(0xff7a90, 1.3, 30);
      rimL.position.set(-4, -3, 2);
      scene.add(rimL);

      const start = performance.now();
      const heroY = -0.26;
      const heroX = -0.11;
      const animate = () => {
        animId = requestAnimationFrame(animate);
        const t = (performance.now() - start) / 1000;
        // Pop: scale 0 -> 0.82 with an ease-out-back overshoot.
        const p = Math.min(1, t / 0.55);
        const c1 = 1.7;
        const eob = 1 + (c1 + 1) * Math.pow(p - 1, 3) + c1 * Math.pow(p - 1, 2);
        group.scale.setScalar(Math.max(0.001, 0.82 * (p < 1 ? eob : 1)));
        // Spin-in: settle to the hero angle, then a gentle sway.
        const sp = Math.min(1, t / 0.9);
        const easeSp = 1 - Math.pow(1 - sp, 3);
        const sway = t > 0.9 ? Math.sin((t - 0.9) * 1.1) * 0.06 : 0;
        group.rotation.y = -2.2 * (1 - easeSp) + heroY * easeSp + sway;
        group.rotation.x = heroX + (t > 0.9 ? Math.sin((t - 0.9) * 0.9) * 0.03 : 0);
        renderer.render(scene, camera);
      };
      animate();

      return () => {
        if (animId) cancelAnimationFrame(animId);
        if (renderer && renderer.domElement) {
          renderer.domElement.remove();
          renderer.dispose();
        }
        disposables.forEach((d) => d.dispose && d.dispose());
      };
    } catch {
      setOk(false);
      return undefined;
    }
  }, [size]);

  if (!ok) return <img src={markSrc} width={size} height={size} alt="" className="mx-auto" />;
  return <div ref={mountRef} style={{ width: size, height: size }} className="mx-auto" />;
};

export default Icon3DCanvas;
