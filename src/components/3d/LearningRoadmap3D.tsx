import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { LearningRoadmapNode } from "../../types";
import { CheckCircle2, PlayCircle, Lock, ArrowRight, ExternalLink, Clock, Award } from "lucide-react";

interface LearningRoadmap3DProps {
  nodes: LearningRoadmapNode[];
  onStartCourse?: (courseId: string) => void;
  reducedMotion?: boolean;
}

export const LearningRoadmap3D: React.FC<LearningRoadmap3DProps> = ({
  nodes,
  onStartCourse,
  reducedMotion = false,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedNode, setSelectedNode] = useState<LearningRoadmapNode | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth || 600;
    const height = container.clientHeight || 440;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
    camera.position.set(0, 14, 30);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const roadmapGroup = new THREE.Group();
    scene.add(roadmapGroup);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
    scene.add(ambientLight);

    const mainLight = new THREE.DirectionalLight(0x38bdf8, 2.5);
    mainLight.position.set(10, 20, 15);
    scene.add(mainLight);

    const accentLight = new THREE.PointLight(0x6366f1, 2, 40);
    accentLight.position.set(-10, 10, 5);
    scene.add(accentLight);

    // Spline curve coordinates for 3D trajectory
    const curvePoints: THREE.Vector3[] = [];
    const stepCount = nodes.length;
    const xSpan = 26;

    nodes.forEach((_, idx) => {
      const x = -xSpan / 2 + (idx / (stepCount - 1)) * xSpan;
      const z = Math.sin((idx / (stepCount - 1)) * Math.PI * 2) * 5;
      const y = Math.cos(idx * 0.8) * 2;
      curvePoints.push(new THREE.Vector3(x, y, z));
    });

    const curve = new THREE.CatmullRomCurve3(curvePoints);

    // Render 3D pathway tube
    const tubeGeom = new THREE.TubeGeometry(curve, 64, 0.35, 12, false);
    const tubeMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      roughness: 0.4,
      metalness: 0.8,
    });
    const tubeMesh = new THREE.Mesh(tubeGeom, tubeMat);
    roadmapGroup.add(tubeMesh);

    // Render milestone spheres along the curve
    const interactableObjects: THREE.Mesh[] = [];
    const activeRings: THREE.Mesh[] = [];

    nodes.forEach((node, idx) => {
      const pos = curvePoints[idx];

      let nodeColor = 0x64748b; // upcoming / locked: slate
      let emissiveColor = 0x0f172a;
      let radius = 1.3;

      if (node.status === "completed") {
        nodeColor = 0x10b981; // emerald
        emissiveColor = 0x047857;
      } else if (node.status === "in-progress") {
        nodeColor = 0x0284c7; // sky
        emissiveColor = 0x0369a1;
        radius = 1.6;
      } else if (idx === nodes.length - 1) {
        nodeColor = 0x8b5cf6; // purple target role milestone
        emissiveColor = 0x6d28d9;
        radius = 1.7;
      }

      const sphereGeom = new THREE.SphereGeometry(radius, 24, 24);
      const sphereMat = new THREE.MeshStandardMaterial({
        color: nodeColor,
        emissive: emissiveColor,
        emissiveIntensity: 0.6,
        roughness: 0.2,
        metalness: 0.7,
      });
      const sphereMesh = new THREE.Mesh(sphereGeom, sphereMat);
      sphereMesh.position.copy(pos);
      sphereMesh.userData = { node };
      roadmapGroup.add(sphereMesh);
      interactableObjects.push(sphereMesh);

      // Add pulsing ring for active node
      if (node.status === "in-progress") {
        const ringGeom = new THREE.RingGeometry(2.0, 2.3, 32);
        const ringMat = new THREE.MeshBasicMaterial({
          color: 0x38bdf8,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.7,
        });
        const ringMesh = new THREE.Mesh(ringGeom, ringMat);
        ringMesh.position.copy(pos);
        ringMesh.rotation.x = Math.PI / 3;
        roadmapGroup.add(ringMesh);
        activeRings.push(ringMesh);
      }
    });

    // Raycasting for clicking nodes
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    let isDragging = false;
    let prevMouse = { x: 0, y: 0 };

    const onPointerDown = (e: PointerEvent) => {
      isDragging = true;
      prevMouse = { x: e.clientX, y: e.clientY };
    };

    const onPointerMove = (e: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      if (isDragging && !reducedMotion) {
        const deltaX = e.clientX - prevMouse.x;
        roadmapGroup.rotation.y += deltaX * 0.006;
        prevMouse = { x: e.clientX, y: e.clientY };
      }

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(interactableObjects);
      container.style.cursor = intersects.length > 0 ? "pointer" : isDragging ? "grabbing" : "default";
    };

    const onPointerUp = () => {
      isDragging = false;
    };

    const onClick = () => {
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(interactableObjects);
      if (intersects.length > 0) {
        const hit = intersects[0].object as THREE.Mesh;
        if (hit.userData && hit.userData.node) {
          setSelectedNode(hit.userData.node);
        }
      }
    };

    container.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
    container.addEventListener("click", onClick);

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width: w, height: h } = entry.contentRect;
        if (w === 0 || h === 0) continue;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
      }
    });
    resizeObserver.observe(container);

    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      if (!reducedMotion) {
        if (!isDragging) {
          roadmapGroup.rotation.y = Math.sin(elapsed * 0.2) * 0.12;
        }

        activeRings.forEach((ring) => {
          ring.rotation.z = elapsed * 1.2;
          const scale = 1 + Math.sin(elapsed * 3) * 0.12;
          ring.scale.set(scale, scale, scale);
        });
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      container.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      container.removeEventListener("click", onClick);
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [nodes, reducedMotion]);

  return (
    <div className="relative w-full h-[450px] rounded-2xl bg-slate-950/70 border border-slate-800/80 shadow-2xl overflow-hidden backdrop-blur-md">
      <div ref={containerRef} className="w-full h-full touch-none cursor-grab active:cursor-grabbing" />

      {/* Header Overlay */}
      <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none">
        <div className="flex items-center space-x-2">
          <span className="w-2.5 h-2.5 rounded-full bg-indigo-400 animate-pulse" />
          <span className="text-xs font-semibold tracking-wider uppercase text-slate-300">
            Interactive 3D Personalized Learning Roadmap
          </span>
        </div>
        <div className="text-[11px] text-slate-400 bg-slate-900/80 px-2.5 py-1 rounded-full border border-slate-800 pointer-events-auto">
          Click nodes to open milestone details
        </div>
      </div>

      {/* Timeline Quick Strip at Bottom */}
      <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between overflow-x-auto gap-2 py-2 px-3 bg-slate-900/85 rounded-xl border border-slate-800 backdrop-blur-sm">
        {nodes.map((n, i) => (
          <button
            key={n.id}
            onClick={() => setSelectedNode(n)}
            className={`flex items-center space-x-2 px-2.5 py-1 rounded-lg text-left transition-all shrink-0 ${
              selectedNode?.id === n.id
                ? "bg-sky-500/20 border border-sky-400/50 text-white"
                : n.status === "completed"
                ? "bg-emerald-950/40 border border-emerald-800/40 text-emerald-300 hover:bg-emerald-900/30"
                : n.status === "in-progress"
                ? "bg-sky-950/60 border border-sky-600/50 text-sky-200 ring-1 ring-sky-500/40"
                : "bg-slate-800/50 border border-slate-700/40 text-slate-400 hover:bg-slate-800"
            }`}
          >
            {n.status === "completed" ? (
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            ) : n.status === "in-progress" ? (
              <PlayCircle className="w-3.5 h-3.5 text-sky-400 animate-pulse shrink-0" />
            ) : (
              <Lock className="w-3.5 h-3.5 text-slate-500 shrink-0" />
            )}
            <div className="truncate max-w-[120px]">
              <div className="text-[10px] text-slate-400 font-mono">Stage {n.stage}</div>
              <div className="text-xs font-medium truncate">{n.title}</div>
            </div>
          </button>
        ))}
      </div>

      {/* Modal / Card overlay for selected milestone (Section 67) */}
      {selectedNode && (
        <div className="absolute inset-0 z-30 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in zoom-in-95 duration-200">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative">
            <button
              onClick={() => setSelectedNode(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg bg-slate-800 hover:bg-slate-700 transition"
              aria-label="Close"
            >
              ✕
            </button>

            <div className="flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider mb-2 text-sky-400">
              <span>Stage {selectedNode.stage} Roadmap Milestone</span>
              <span>•</span>
              <span className="text-indigo-400">{selectedNode.provider}</span>
            </div>

            <h3 className="text-xl font-bold text-white mb-2">{selectedNode.title}</h3>
            <p className="text-sm text-slate-300 leading-relaxed mb-4">{selectedNode.description}</p>

            <div className="grid grid-cols-2 gap-3 mb-5 text-xs">
              <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700/60">
                <div className="flex items-center space-x-1.5 text-slate-400 mb-1">
                  <Award className="w-3.5 h-3.5 text-amber-400" />
                  <span>Competency Target</span>
                </div>
                <div className="font-semibold text-white">{selectedNode.skillGained}</div>
              </div>
              <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700/60">
                <div className="flex items-center space-x-1.5 text-slate-400 mb-1">
                  <Clock className="w-3.5 h-3.5 text-sky-400" />
                  <span>Duration & Match</span>
                </div>
                <div className="font-semibold text-white flex items-center justify-between">
                  <span>{selectedNode.duration}</span>
                  <span className="text-emerald-400 font-bold">{selectedNode.matchScore}% Match</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-800">
              <button
                onClick={() => setSelectedNode(null)}
                className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white transition"
              >
                Close View
              </button>

              <button
                onClick={() => {
                  if (onStartCourse) onStartCourse(selectedNode.courseId);
                  setSelectedNode(null);
                }}
                className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold shadow-lg shadow-sky-600/30 transition active:scale-95"
              >
                <span>{selectedNode.status === "completed" ? "Review Course" : "Start Course"}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
