import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { DepartmentAnalytics } from "../../types";

interface AnalyticsScene3DProps {
  departments: DepartmentAnalytics[];
  reducedMotion?: boolean;
}

export const AnalyticsScene3D: React.FC<AnalyticsScene3DProps> = ({
  departments,
  reducedMotion = false,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoveredData, setHoveredData] = useState<{
    department: string;
    skill: string;
    value: number;
    gapPercent: number;
    x: number;
    y: number;
  } | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth || 600;
    const height = container.clientHeight || 460;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(22, 24, 32);
    camera.lookAt(0, 4, 0);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const chartGroup = new THREE.Group();
    scene.add(chartGroup);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0x38bdf8, 2.2);
    dirLight.position.set(20, 30, 20);
    scene.add(dirLight);

    const pointLight = new THREE.PointLight(0x6366f1, 1.5, 50);
    pointLight.position.set(-15, 15, -15);
    scene.add(pointLight);

    // Base Grid Platform
    const grid = new THREE.GridHelper(30, 10, 0x334155, 0x1e293b);
    grid.position.y = 0;
    chartGroup.add(grid);

    // Skills on Z-axis
    const skills = ["Python", "Sampling", "AI/ML", "Cloud", "Data Viz"];
    const deptList = departments.slice(0, 5);

    const interactableBars: THREE.Mesh[] = [];

    const xSpacing = 4.8;
    const zSpacing = 4.8;
    const startX = -((deptList.length - 1) * xSpacing) / 2;
    const startZ = -((skills.length - 1) * zSpacing) / 2;

    deptList.forEach((dept, xIdx) => {
      const x = startX + xIdx * xSpacing;

      skills.forEach((skill, zIdx) => {
        const z = startZ + zIdx * zSpacing;

        // Calculate skill level & gap from data
        const gapFound = dept.skillGaps.find(
          (g) => g.skill.toLowerCase().includes(skill.toLowerCase()) || skill.toLowerCase().includes(g.skill.toLowerCase())
        );
        const gapPercent = gapFound ? gapFound.gapPercent : Math.max(20, 70 - dept.avgCompetency * 0.6);
        
        // Competency height from 1.5 to 11 units
        const baseScore = Math.max(1.5, (100 - gapPercent) * 0.11);
        const barHeight = baseScore;

        const barGeom = new THREE.BoxGeometry(2.0, barHeight, 2.0);

        // Color mapped by gap severity
        let barColor = 0x0284c7; // sky
        if (gapPercent >= 55) {
          barColor = 0xf43f5e; // rose (high gap)
        } else if (gapPercent >= 40) {
          barColor = 0xf59e0b; // amber
        } else {
          barColor = 0x10b981; // emerald
        }

        const barMat = new THREE.MeshStandardMaterial({
          color: barColor,
          roughness: 0.3,
          metalness: 0.6,
        });

        const barMesh = new THREE.Mesh(barGeom, barMat);
        barMesh.position.set(x, barHeight / 2, z);
        barMesh.userData = {
          department: dept.department,
          skill,
          value: Math.round((100 - gapPercent) * 0.8 + 20),
          gapPercent,
        };

        chartGroup.add(barMesh);
        interactableBars.push(barMesh);

        // Glowing Cap on top of bar
        const capGeom = new THREE.PlaneGeometry(2.0, 2.0);
        const capMat = new THREE.MeshBasicMaterial({
          color: 0xffffff,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.4,
        });
        const cap = new THREE.Mesh(capGeom, capMat);
        cap.rotation.x = Math.PI / 2;
        cap.position.set(x, barHeight + 0.01, z);
        chartGroup.add(cap);
      });
    });

    // Raycasting & Drag Rotation
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
        chartGroup.rotation.y += deltaX * 0.007;
        prevMouse = { x: e.clientX, y: e.clientY };
      }

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(interactableBars);

      if (intersects.length > 0) {
        const hit = intersects[0].object as THREE.Mesh;
        if (hit.userData) {
          container.style.cursor = "pointer";
          setHoveredData({
            department: hit.userData.department,
            skill: hit.userData.skill,
            value: hit.userData.value,
            gapPercent: hit.userData.gapPercent,
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
          });
          return;
        }
      }
      container.style.cursor = isDragging ? "grabbing" : "default";
      setHoveredData(null);
    };

    const onPointerUp = () => {
      isDragging = false;
    };

    container.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);

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
        chartGroup.rotation.y = Math.sin(elapsed * 0.15) * 0.12;
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      container.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [departments, reducedMotion]);

  return (
    <div className="relative w-full h-[470px] rounded-2xl bg-slate-950/70 border border-slate-800/80 shadow-2xl overflow-hidden backdrop-blur-md">
      <div ref={containerRef} className="w-full h-full touch-none cursor-grab active:cursor-grabbing" />

      {/* Header Overlay */}
      <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none">
        <div className="flex items-center space-x-2">
          <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
          <span className="text-xs font-semibold tracking-wider uppercase text-slate-300">
            3D Departmental Workforce Competency Landscape
          </span>
        </div>
        <div className="text-[11px] text-slate-400 bg-slate-900/80 px-2.5 py-1 rounded-full border border-slate-800 pointer-events-auto">
          X: Departments • Z: Skills • Y: Competency
        </div>
      </div>

      {/* Hover Tooltip */}
      {hoveredData && (
        <div
          className="absolute z-20 pointer-events-none -translate-x-1/2 -translate-y-full mb-3 bg-slate-900/95 border border-slate-700 rounded-xl px-3.5 py-2.5 shadow-2xl backdrop-blur-md min-w-[210px]"
          style={{
            left: `${hoveredData.x}px`,
            top: `${hoveredData.y}px`,
          }}
        >
          <div className="text-xs font-bold text-white mb-0.5">{hoveredData.department}</div>
          <div className="text-[11px] text-sky-400 font-semibold mb-1.5">{hoveredData.skill}</div>
          <div className="grid grid-cols-2 gap-2 text-xs text-slate-300">
            <div>
              <span className="text-slate-400 text-[10px]">Readiness:</span>
              <div className="font-bold text-white">{hoveredData.value}%</div>
            </div>
            <div>
              <span className="text-slate-400 text-[10px]">Workforce Gap:</span>
              <div
                className={`font-bold ${
                  hoveredData.gapPercent >= 50
                    ? "text-rose-400"
                    : hoveredData.gapPercent >= 40
                    ? "text-amber-400"
                    : "text-emerald-400"
                }`}
              >
                {hoveredData.gapPercent}%
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Axis Labels */}
      <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-xs text-slate-400 bg-slate-900/80 px-3.5 py-2 rounded-xl border border-slate-800 pointer-events-none">
        <div className="flex items-center space-x-3">
          <span className="flex items-center space-x-1">
            <span className="w-2 h-2 rounded bg-rose-500" />
            <span className="text-[11px]">High Gap (&gt;50%)</span>
          </span>
          <span className="flex items-center space-x-1">
            <span className="w-2 h-2 rounded bg-amber-500" />
            <span className="text-[11px]">Medium Gap (40-50%)</span>
          </span>
          <span className="flex items-center space-x-1">
            <span className="w-2 h-2 rounded bg-sky-500" />
            <span className="text-[11px]">Good Readiness (&lt;40%)</span>
          </span>
        </div>
        <span className="font-mono text-[11px]">Click & Drag to rotate</span>
      </div>
    </div>
  );
};
