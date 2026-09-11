import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { SkillGapItem } from "../../types";

interface SkillGapTowerProps {
  skillGaps: SkillGapItem[];
  onSelectSkill: (skillName: string) => void;
  selectedSkill?: string | null;
  reducedMotion?: boolean;
}

export const SkillGapTower: React.FC<SkillGapTowerProps> = ({
  skillGaps,
  onSelectSkill,
  selectedSkill,
  reducedMotion = false,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoveredSkill, setHoveredSkill] = useState<{
    name: string;
    current: number;
    required: number;
    gap: number;
    priority: string;
    x: number;
    y: number;
  } | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth || 500;
    const height = container.clientHeight || 420;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 16, 32);
    camera.lookAt(0, 4, 0);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const group = new THREE.Group();
    scene.add(group);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0x38bdf8, 2.2);
    dirLight.position.set(15, 30, 20);
    scene.add(dirLight);

    const pointLight = new THREE.PointLight(0x6366f1, 1.5, 40);
    pointLight.position.set(-10, 10, -10);
    scene.add(pointLight);

    // Circular ground platform
    const platformGeom = new THREE.CylinderGeometry(18, 19, 0.8, 48);
    const platformMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      roughness: 0.5,
      metalness: 0.8,
    });
    const platform = new THREE.Mesh(platformGeom, platformMat);
    platform.position.y = -0.4;
    group.add(platform);

    // Concentric level marker rings on platform (Levels 1 to 5)
    for (let lvl = 1; lvl <= 5; lvl++) {
      const ringGeom = new THREE.RingGeometry(lvl * 3.2 - 0.05, lvl * 3.2 + 0.05, 48);
      const ringMat = new THREE.MeshBasicMaterial({
        color: 0x1e293b,
        side: THREE.DoubleSide,
      });
      const ring = new THREE.Mesh(ringGeom, ringMat);
      ring.rotation.x = -Math.PI / 2;
      ring.position.y = 0.02;
      group.add(ring);
    }

    const interactableObjects: THREE.Object3D[] = [];
    const displayedSkills = skillGaps.slice(0, 7); // Display top 7 skills with gaps

    const spacing = 4.2;
    const startX = -((displayedSkills.length - 1) * spacing) / 2;

    displayedSkills.forEach((item, index) => {
      const xPos = startX + index * spacing;
      const towerGroup = new THREE.Group();
      towerGroup.position.set(xPos, 0, 0);

      // Height units: 1 level = 2.4 units
      const unitHeight = 2.4;
      const currentH = Math.max(0.4, item.currentLevel * unitHeight);
      const requiredH = item.requiredLevel * unitHeight;
      const gapH = Math.max(0, requiredH - currentH);

      // 1. Current Competency Solid Cylinder (Lower base)
      const currentGeom = new THREE.CylinderGeometry(1.2, 1.2, currentH, 24);
      let currentMatColor = 0x0284c7; // sky
      if (item.currentLevel >= item.requiredLevel) {
        currentMatColor = 0x10b981; // green
      } else if (item.gap >= 2) {
        currentMatColor = 0xf43f5e; // rose
      } else if (item.gap === 1) {
        currentMatColor = 0xf59e0b; // amber
      }

      const currentMat = new THREE.MeshStandardMaterial({
        color: currentMatColor,
        roughness: 0.3,
        metalness: 0.6,
      });
      const currentMesh = new THREE.Mesh(currentGeom, currentMat);
      currentMesh.position.y = currentH / 2;
      currentMesh.userData = {
        name: item.name,
        current: item.currentLevel,
        required: item.requiredLevel,
        gap: item.gap,
        priority: item.priority,
      };
      towerGroup.add(currentMesh);
      interactableObjects.push(currentMesh);

      // 2. Required Competency Ghost / Translucent Cylinder (Top Gap segment)
      if (gapH > 0) {
        const gapGeom = new THREE.CylinderGeometry(1.18, 1.18, gapH, 24);
        const gapMat = new THREE.MeshStandardMaterial({
          color: 0x64748b,
          transparent: true,
          opacity: 0.35,
          roughness: 0.8,
          wireframe: false,
        });
        const gapMesh = new THREE.Mesh(gapGeom, gapMat);
        gapMesh.position.y = currentH + gapH / 2;
        gapMesh.userData = currentMesh.userData;
        towerGroup.add(gapMesh);
        interactableObjects.push(gapMesh);

        // Gap Target Cap Ring
        const capGeom = new THREE.TorusGeometry(1.22, 0.08, 12, 24);
        const capMat = new THREE.MeshBasicMaterial({
          color: 0x38bdf8,
        });
        const capMesh = new THREE.Mesh(capGeom, capMat);
        capMesh.rotation.x = Math.PI / 2;
        capMesh.position.y = requiredH;
        towerGroup.add(capMesh);

        // Delta marker line/ring at transition point
        const deltaRingGeom = new THREE.TorusGeometry(1.26, 0.09, 12, 24);
        const deltaRingMat = new THREE.MeshBasicMaterial({
          color: 0xf43f5e,
        });
        const deltaRing = new THREE.Mesh(deltaRingGeom, deltaRingMat);
        deltaRing.rotation.x = Math.PI / 2;
        deltaRing.position.y = currentH;
        towerGroup.add(deltaRing);
      }

      // Base pedestal badge
      const basePedestalGeom = new THREE.CylinderGeometry(1.4, 1.5, 0.3, 24);
      const basePedestalMat = new THREE.MeshStandardMaterial({
        color: 0x1e293b,
        metalness: 0.8,
      });
      const pedestal = new THREE.Mesh(basePedestalGeom, basePedestalMat);
      pedestal.position.y = 0.15;
      towerGroup.add(pedestal);

      group.add(towerGroup);
    });

    // Mouse Interaction
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
        group.rotation.y += deltaX * 0.007;
        prevMouse = { x: e.clientX, y: e.clientY };
      }

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(interactableObjects);

      if (intersects.length > 0) {
        const hit = intersects[0].object;
        if (hit.userData && hit.userData.name) {
          container.style.cursor = "pointer";
          setHoveredSkill({
            name: hit.userData.name,
            current: hit.userData.current,
            required: hit.userData.required,
            gap: hit.userData.gap,
            priority: hit.userData.priority,
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
          });
          return;
        }
      }
      container.style.cursor = isDragging ? "grabbing" : "default";
      setHoveredSkill(null);
    };

    const onPointerUp = () => {
      isDragging = false;
    };

    const onClick = () => {
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(interactableObjects);
      if (intersects.length > 0) {
        const hit = intersects[0].object;
        if (hit.userData?.name) {
          onSelectSkill(hit.userData.name);
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

      if (!reducedMotion && !isDragging) {
        group.rotation.y = Math.sin(elapsed * 0.25) * 0.15;
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
  }, [skillGaps, onSelectSkill, selectedSkill, reducedMotion]);

  return (
    <div className="relative w-full h-[430px] rounded-2xl bg-slate-950/70 border border-slate-800/80 shadow-2xl overflow-hidden backdrop-blur-md">
      <div ref={containerRef} className="w-full h-full touch-none cursor-grab active:cursor-grabbing" />

      {/* Header */}
      <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none">
        <div className="flex items-center space-x-2">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-400 animate-pulse" />
          <span className="text-xs font-semibold tracking-wider uppercase text-slate-300">
            3D Skill Gap Competency Towers
          </span>
        </div>
        <div className="text-[11px] text-slate-400 bg-slate-900/80 px-2.5 py-1 rounded-full border border-slate-800 pointer-events-auto">
          Solid: Current Level • Translucent: Target Gap
        </div>
      </div>

      {/* Hover Tooltip */}
      {hoveredSkill && (
        <div
          className="absolute z-20 pointer-events-none -translate-x-1/2 -translate-y-full mb-3 bg-slate-900/95 border border-slate-700 rounded-xl px-3.5 py-2.5 shadow-2xl backdrop-blur-md min-w-[210px]"
          style={{
            left: `${hoveredSkill.x}px`,
            top: `${hoveredSkill.y}px`,
          }}
        >
          <div className="flex items-center justify-between mb-1.5">
            <span className="font-semibold text-white text-sm">{hoveredSkill.name}</span>
            <span
              className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                hoveredSkill.gap >= 2
                  ? "bg-rose-500/20 text-rose-300 border border-rose-500/40"
                  : hoveredSkill.gap === 1
                  ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                  : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
              }`}
            >
              Gap: {hoveredSkill.gap} ({hoveredSkill.priority})
            </span>
          </div>
          <div className="space-y-1 text-xs text-slate-300">
            <div className="flex justify-between">
              <span className="text-slate-400">Current Level:</span>
              <span className="font-bold text-sky-400">Level {hoveredSkill.current} / 5</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Required Level:</span>
              <span className="font-bold text-indigo-400">Level {hoveredSkill.required} / 5</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-1.5 mt-1 overflow-hidden">
              <div
                className="bg-sky-400 h-1.5 rounded-full"
                style={{ width: `${(hoveredSkill.current / 5) * 100}%` }}
              />
            </div>
          </div>
          <div className="mt-2 text-[10px] text-sky-300 text-center font-medium">
            Click to view recommended courses
          </div>
        </div>
      )}

      {/* Legend & Scale */}
      <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-xs text-slate-400 bg-slate-900/80 px-3.5 py-2 rounded-xl border border-slate-800 pointer-events-none">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1.5">
            <span className="w-2 h-2 rounded-full bg-sky-400" />
            <span className="text-[11px]">Current Competency</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-2 h-2 rounded-full bg-slate-500 border border-dashed border-slate-300" />
            <span className="text-[11px]">Required Level (Gap)</span>
          </div>
        </div>
        <span className="font-mono text-[11px] text-slate-400">Drag to swivel angle</span>
      </div>
    </div>
  );
};
