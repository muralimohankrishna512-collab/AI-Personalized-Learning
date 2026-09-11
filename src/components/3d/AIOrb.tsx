import React, { useEffect, useRef } from "react";
import * as THREE from "three";

export type AIOrbState = "idle" | "listening" | "processing" | "responding";

interface AIOrbProps {
  state?: AIOrbState;
  size?: number;
  reducedMotion?: boolean;
}

export const AIOrb: React.FC<AIOrbProps> = ({
  state = "idle",
  size = 120,
  reducedMotion = false,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const stateRef = useRef<AIOrbState>(state);

  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.z = 6.5;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(size, size);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const orbGroup = new THREE.Group();
    scene.add(orbGroup);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const coreLight = new THREE.PointLight(0x38bdf8, 3, 20);
    orbGroup.add(coreLight);

    // Central Sphere / Intelligent Core
    const sphereGeom = new THREE.SphereGeometry(1.2, 32, 32);
    const sphereMat = new THREE.MeshStandardMaterial({
      color: 0x0284c7,
      emissive: 0x0369a1,
      emissiveIntensity: 0.8,
      roughness: 0.15,
      metalness: 0.85,
      wireframe: false,
    });
    const coreMesh = new THREE.Mesh(sphereGeom, sphereMat);
    orbGroup.add(coreMesh);

    // Outer wireframe shell
    const wireGeom = new THREE.IcosahedronGeometry(1.5, 2);
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      wireframe: true,
      transparent: true,
      opacity: 0.45,
    });
    const wireMesh = new THREE.Mesh(wireGeom, wireMat);
    orbGroup.add(wireMesh);

    // Orbital Rings for "processing" state
    const ring1Geom = new THREE.TorusGeometry(1.9, 0.04, 16, 48);
    const ring1Mat = new THREE.MeshBasicMaterial({ color: 0x818cf8, transparent: true, opacity: 0.7 });
    const ring1 = new THREE.Mesh(ring1Geom, ring1Mat);
    orbGroup.add(ring1);

    const ring2Geom = new THREE.TorusGeometry(2.1, 0.03, 16, 48);
    const ring2Mat = new THREE.MeshBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.6 });
    const ring2 = new THREE.Mesh(ring2Geom, ring2Mat);
    ring2.rotation.x = Math.PI / 2.5;
    orbGroup.add(ring2);

    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();
      const currentState = stateRef.current;

      if (!reducedMotion) {
        // State-based behaviors
        if (currentState === "idle") {
          // Slow floating & gentle breathing
          orbGroup.position.y = Math.sin(elapsed * 1.5) * 0.15;
          coreMesh.rotation.y = elapsed * 0.4;
          wireMesh.rotation.y = -elapsed * 0.3;
          ring1.rotation.x = elapsed * 0.3;
          ring1.rotation.y = elapsed * 0.2;
          ring2.rotation.z = -elapsed * 0.25;

          sphereMat.emissive.setHex(0x0284c7);
          sphereMat.emissiveIntensity = 0.6 + Math.sin(elapsed * 2) * 0.2;
        } else if (currentState === "listening") {
          // Pulsing rhythmic scale
          const pulse = 1 + Math.sin(elapsed * 4) * 0.18;
          coreMesh.scale.set(pulse, pulse, pulse);
          orbGroup.position.y = 0;
          ring1.rotation.z += 0.03;
          ring2.rotation.x += 0.03;

          sphereMat.emissive.setHex(0x06b6d4); // cyan listening
          sphereMat.emissiveIntensity = 1.0 + Math.sin(elapsed * 5) * 0.4;
        } else if (currentState === "processing") {
          // Fast animated rotating orbital rings
          coreMesh.scale.set(1, 1, 1);
          ring1.rotation.x += 0.08;
          ring1.rotation.y += 0.07;
          ring2.rotation.z += 0.09;
          ring2.rotation.x -= 0.05;
          wireMesh.rotation.y += 0.05;

          sphereMat.emissive.setHex(0x818cf8); // purple processing
          sphereMat.emissiveIntensity = 1.2;
        } else if (currentState === "responding") {
          // Warm gentle radiant glow
          orbGroup.position.y = Math.sin(elapsed * 2) * 0.08;
          const respondScale = 1.05 + Math.sin(elapsed * 3) * 0.06;
          coreMesh.scale.set(respondScale, respondScale, respondScale);
          ring1.rotation.y += 0.02;
          ring2.rotation.z -= 0.02;

          sphereMat.emissive.setHex(0x10b981); // emerald responding
          sphereMat.emissiveIntensity = 1.1 + Math.sin(elapsed * 3) * 0.3;
        }
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [size, reducedMotion]);

  return (
    <div
      ref={containerRef}
      style={{ width: `${size}px`, height: `${size}px` }}
      className="relative flex items-center justify-center shrink-0"
      aria-label={`AI Assistant Status: ${state}`}
    />
  );
};
