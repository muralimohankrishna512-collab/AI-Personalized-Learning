import React, { useEffect, useRef } from "react";
import * as THREE from "three";

interface ProcessingPipeline3DProps {
  currentStageIndex: number; // 0 to 5
  reducedMotion?: boolean;
}

export const ProcessingPipeline3D: React.FC<ProcessingPipeline3DProps> = ({
  currentStageIndex = 2,
  reducedMotion = false,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef(currentStageIndex);

  useEffect(() => {
    stageRef.current = currentStageIndex;
  }, [currentStageIndex]);

  const stages = [
    { label: "Document", icon: "📄" },
    { label: "Text Extraction", icon: "🔍" },
    { label: "Semantic Analysis", icon: "🧠" },
    { label: "LLM", icon: "✨" },
    { label: "Question Generation", icon: "📝" },
    { label: "Assessment", icon: "🎯" },
  ];

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth || 600;
    const height = 180;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 2, 16);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const pipelineGroup = new THREE.Group();
    scene.add(pipelineGroup);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0x38bdf8, 2.5, 30);
    pointLight.position.set(0, 4, 8);
    scene.add(pointLight);

    const nodeCount = stages.length;
    const spacing = 3.6;
    const startX = -((nodeCount - 1) * spacing) / 2;

    const nodeMeshes: THREE.Mesh[] = [];
    const haloMeshes: THREE.Mesh[] = [];

    // Create 3D Nodes
    for (let i = 0; i < nodeCount; i++) {
      const x = startX + i * spacing;

      // Sphere Node
      const geom = new THREE.SphereGeometry(0.85, 24, 24);
      const mat = new THREE.MeshStandardMaterial({
        color: 0x1e293b,
        roughness: 0.3,
        metalness: 0.8,
      });
      const mesh = new THREE.Mesh(geom, mat);
      mesh.position.set(x, 0, 0);
      pipelineGroup.add(mesh);
      nodeMeshes.push(mesh);

      // Pulsing Halo Ring
      const haloGeom = new THREE.RingGeometry(1.05, 1.25, 24);
      const haloMat = new THREE.MeshBasicMaterial({
        color: 0x38bdf8,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0,
      });
      const halo = new THREE.Mesh(haloGeom, haloMat);
      halo.position.set(x, 0, 0);
      pipelineGroup.add(halo);
      haloMeshes.push(halo);

      // Connecting tube to next node
      if (i < nodeCount - 1) {
        const nextX = startX + (i + 1) * spacing;
        const lineGeom = new THREE.CylinderGeometry(0.08, 0.08, spacing, 12);
        const lineMat = new THREE.MeshStandardMaterial({
          color: 0x334155,
          metalness: 0.8,
        });
        const line = new THREE.Mesh(lineGeom, lineMat);
        line.rotation.z = Math.PI / 2;
        line.position.set((x + nextX) / 2, 0, 0);
        pipelineGroup.add(line);
      }
    }

    // Energy packet traveling particle
    const packetGeom = new THREE.SphereGeometry(0.25, 16, 16);
    const packetMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
    const packet = new THREE.Mesh(packetGeom, packetMat);
    pipelineGroup.add(packet);

    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();
      const currentIdx = stageRef.current;

      nodeMeshes.forEach((mesh, idx) => {
        const mat = mesh.material as THREE.MeshStandardMaterial;
        const haloMat = haloMeshes[idx].material as THREE.MeshBasicMaterial;

        if (idx < currentIdx) {
          // Completed
          mat.color.setHex(0x10b981);
          mat.emissive.setHex(0x047857);
          mat.emissiveIntensity = 0.5;
          haloMat.opacity = 0;
          mesh.scale.set(1, 1, 1);
        } else if (idx === currentIdx) {
          // Active
          mat.color.setHex(0x0284c7);
          mat.emissive.setHex(0x38bdf8);
          mat.emissiveIntensity = 0.8 + Math.sin(elapsed * 5) * 0.3;

          const pulse = 1.1 + Math.sin(elapsed * 4) * 0.12;
          mesh.scale.set(pulse, pulse, pulse);

          haloMat.opacity = 0.8;
          haloMeshes[idx].rotation.z = elapsed * 2;
        } else {
          // Pending
          mat.color.setHex(0x334155);
          mat.emissive.setHex(0x0f172a);
          mat.emissiveIntensity = 0;
          haloMat.opacity = 0;
          mesh.scale.set(0.9, 0.9, 0.9);
        }
      });

      // Packet animation
      if (!reducedMotion) {
        const targetX = startX + currentIdx * spacing;
        packet.position.x = targetX + Math.sin(elapsed * 6) * 0.5;
        packet.position.y = Math.cos(elapsed * 6) * 0.2;
      }

      renderer.render(scene, camera);
    };

    animate();

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width: w } = entry.contentRect;
        if (w === 0) continue;
        camera.aspect = w / height;
        camera.updateProjectionMatrix();
        renderer.setSize(w, height);
      }
    });
    resizeObserver.observe(container);

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [reducedMotion]);

  return (
    <div className="w-full bg-slate-950/80 rounded-2xl border border-slate-800 p-4 relative overflow-hidden backdrop-blur-md">
      <div className="text-center mb-1">
        <span className="text-[11px] font-semibold text-slate-400 tracking-wider uppercase">
          AI Assessment Generation Pipeline
        </span>
      </div>

      <div ref={containerRef} className="w-full h-[120px] pointer-events-none" />

      <div className="grid grid-cols-6 gap-1 text-center mt-1">
        {stages.map((stage, idx) => {
          const isPassed = idx < currentStageIndex;
          const isActive = idx === currentStageIndex;
          return (
            <div key={stage.label} className="flex flex-col items-center">
              <span className="text-sm mb-0.5">{stage.icon}</span>
              <span
                className={`text-[10px] font-medium leading-tight ${
                  isActive
                    ? "text-sky-400 font-bold"
                    : isPassed
                    ? "text-emerald-400"
                    : "text-slate-500"
                }`}
              >
                {stage.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
