import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function JarvisOrb({ isListening, isSpeaking }) {
  const mountRef = useRef(null);
  const materialRef = useRef(null);
  const orbRef = useRef(null);

  useEffect(() => {
    // 1. Configuração Básica do Three.js
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(300, 300);
    mountRef.current.appendChild(renderer.domElement);

    // 2. A Esfera Central
    const geometry = new THREE.SphereGeometry(1, 32, 32);
    const material = new THREE.MeshBasicMaterial({
      color: 0x00ffff, // Ciano
      wireframe: true,
      transparent: true,
      opacity: 0.8,
    });
    materialRef.current = material;

    const sphere = new THREE.Mesh(geometry, material);
    orbRef.current = sphere;
    scene.add(sphere);

    // 3. As Linhas Esféricas (Giroscópio)
    const rings = [];
    const colors = [0x0088ff, 0x00ffff, 0x00ccff];

    for (let i = 0; i < 3; i++) {
      const ringGeo = new THREE.SphereGeometry(1.1 + i * 0.2, 32, 32);
      const ringMat = new THREE.MeshBasicMaterial({
        color: colors[i],
        wireframe: true,
        transparent: true,
        opacity: 0.3 - i * 0.05,
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);

      ring.rotation.x = Math.random() * Math.PI;
      ring.rotation.y = Math.random() * Math.PI;

      rings.push(ring);
      scene.add(ring);
    }

    // 4. Loop de Animação
    let animationFrameId;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      sphere.rotation.y += 0.005;
      sphere.rotation.x += 0.002;

      rings.forEach((ring, index) => {
        const speed = 0.005 + index * 0.002;
        ring.rotation.x += speed;
        ring.rotation.y += speed * 0.8;
        ring.rotation.z += speed * 0.5;
      });

      renderer.render(scene, camera);
    };
    animate();

    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      renderer.dispose();
      if (mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
    };
  }, []);

  // 5. Reagir ao Áudio
  useEffect(() => {
    if (!materialRef.current || !orbRef.current) return;

    if (isListening) {
      materialRef.current.color.setHex(0x00ffff);
      materialRef.current.opacity = 1;
      orbRef.current.scale.set(1.1, 1.1, 1.1);
    } else if (isSpeaking) {
      materialRef.current.color.setHex(0x0088ff);
      materialRef.current.opacity = 0.9;

      let scale = 1;
      let direction = 1;
      const pulseInterval = setInterval(() => {
        scale += 0.05 * direction;
        if (scale > 1.2 || scale < 0.9) direction *= -1;
        orbRef.current.scale.set(scale, scale, scale);
      }, 50);

      return () => clearInterval(pulseInterval);
    } else {
      materialRef.current.color.setHex(0x004488);
      materialRef.current.opacity = 0.4;
      orbRef.current.scale.set(1, 1, 1);
    }
  }, [isListening, isSpeaking]);

  return (
    <div
      ref={mountRef}
      style={{ width: 300, height: 300, cursor: "pointer" }}
    />
  );
}
