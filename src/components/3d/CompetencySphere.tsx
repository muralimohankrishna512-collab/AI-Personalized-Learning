import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { UserSkill, RoleSkillRequirement, SkillGapItem, Course, Language } from "../../types";
import { translations } from "../../translations";
import { Search, ArrowRight, BookOpen, ExternalLink, Sparkles, CheckCircle2 } from "lucide-react";

interface CompetencySphereProps {
  userSkills: UserSkill[];
  requirements: RoleSkillRequirement[];
  skillGaps: SkillGapItem[];
  courses?: Course[];
  onSelectSkill: (skillName: string) => void;
  onStartCourse?: (courseId: string) => void;
  selectedSkill?: string | null;
  overallScore?: number;
  reducedMotion?: boolean;
  language?: Language;
}

export const CompetencySphere: React.FC<CompetencySphereProps> = ({
  userSkills,
  requirements,
  skillGaps,
  courses = [],
  onSelectSkill,
  onStartCourse,
  selectedSkill,
  overallScore = 72,
  reducedMotion = false,
  language = "en",
}) => {
  const t = translations[language] || translations.en;
  const containerRef = useRef<HTMLDivElement>(null);
  const [typedQuery, setTypedQuery] = useState<string>("");
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
  const [activeCourseInfo, setActiveCourseInfo] = useState<{
    skillName: string;
    courseId?: string;
    courseTitle?: string;
    provider?: string;
    level: number;
    required: number;
    gap: number;
    matchScore?: number;
  } | null>(null);

  const [hoveredNode, setHoveredNode] = useState<{
    name: string;
    level: number;
    required: number;
    gap: number;
    priority: string;
    category: string;
    x: number;
    y: number;
  } | null>(null);

  // Map each skill to an official course
  const skillToCourseMap: Record<string, { id: string; title: string; provider: string; match: number }> = {
    "Python": {
      id: "CRS-IGOT-PY-401",
      title: "Python for Data Analysis & Official Microdata Processing",
      provider: "iGOT Karmayogi",
      match: 94,
    },
    "Sampling": {
      id: "CRS-NSSTA-SMP-502",
      title: "Advanced Sampling Techniques & Complex Variance Estimation",
      provider: "NSSTA / TPAC",
      match: 91,
    },
    "Statistics": {
      id: "CRS-NSSTA-SMP-502",
      title: "Statistical Inference, Sample Weighing & Small Area Estimation",
      provider: "NSSTA / TPAC",
      match: 93,
    },
    "SQL": {
      id: "CRS-IGOT-SQL-202",
      title: "SQL & Relational Microdata Warehousing for Official Registries",
      provider: "iGOT Karmayogi",
      match: 89,
    },
    "AI/ML": {
      id: "CRS-NSSTA-AIML-301",
      title: "Applied Machine Learning for Official Statistics & Survey Analytics",
      provider: "NSSTA / TPAC",
      match: 88,
    },
    "Data Visualization": {
      id: "CRS-IGOT-VIZ-204",
      title: "Official Statistical Data Storytelling & Interactive Visualizations",
      provider: "iGOT Karmayogi",
      match: 84,
    },
    "Cybersecurity": {
      id: "CRS-IGOT-CYB-105",
      title: "Data Protection, Microdata Confidentiality & Cyber Governance",
      provider: "iGOT Karmayogi",
      match: 81,
    },
    "GIS": {
      id: "CRS-NSSTA-GIS-403",
      title: "Spatial Statistics & Thematic GIS Mapping using ISRO Bhuvan",
      provider: "NSSTA / TPAC",
      match: 86,
    },
    "Cloud": {
      id: "CRS-IGOT-CLD-304",
      title: "Government Cloud Infrastructure & High-Performance Survey Tabulations",
      provider: "iGOT Karmayogi",
      match: 82,
    },
    "National Accounts": {
      id: "CRS-IGOT-NAC-305",
      title: "System of National Accounts (SNA 2008) & GVA Estimation",
      provider: "iGOT Karmayogi",
      match: 85,
    },
    "Price Statistics": {
      id: "CRS-IGOT-CPI-210",
      title: "Consumer Price Index (CPI) & Inflation Dynamics Methodology",
      provider: "iGOT Karmayogi",
      match: 92,
    },
    "Leadership": {
      id: "CRS-NSSTA-LDR-601",
      title: "Leadership & Statistical Project Management for Division Heads",
      provider: "NSSTA / TPAC",
      match: 74,
    },
    "Communication": {
      id: "CRS-IGOT-VIZ-204",
      title: "Statistical Communication & Public Flash Reporting",
      provider: "iGOT Karmayogi",
      match: 83,
    },
  };

  // Find course info helper
  const getCourseInfoForSkill = (skillName: string) => {
    const direct = skillToCourseMap[skillName];
    if (direct) return direct;
    const fromCourses = courses.find(c => 
      c.skillsCovered.some(s => s.toLowerCase() === skillName.toLowerCase()) ||
      c.targetGapSkill.toLowerCase() === skillName.toLowerCase()
    );
    if (fromCourses) {
      return {
        id: fromCourses.id,
        title: fromCourses.title,
        provider: fromCourses.provider,
        match: fromCourses.matchScore,
      };
    }
    return {
      id: "CRS-IGOT-PY-401",
      title: `${skillName} Official Competency Programme`,
      provider: "iGOT Karmayogi",
      match: 85,
    };
  };

  // Handle typing to search & navigate
  const handleSelectAndGo = (skillName: string) => {
    onSelectSkill(skillName);
    const cInfo = getCourseInfoForSkill(skillName);
    const uSkill = userSkills.find(s => s.name.toLowerCase() === skillName.toLowerCase());
    const rReq = requirements.find(r => r.name.toLowerCase() === skillName.toLowerCase());
    const sGap = skillGaps.find(g => g.name.toLowerCase() === skillName.toLowerCase());

    const curLevel = uSkill ? uSkill.level : 1;
    const reqLevel = rReq ? rReq.requiredLevel : 3;
    const gap = sGap ? sGap.gap : Math.max(0, reqLevel - curLevel);

    setActiveCourseInfo({
      skillName,
      courseId: cInfo.id,
      courseTitle: cInfo.title,
      provider: cInfo.provider,
      matchScore: cInfo.match,
      level: curLevel,
      required: reqLevel,
      gap,
    });
    setTypedQuery(skillName);
    setShowSuggestions(false);
  };

  // Launch course
  const handleLaunchCourse = (courseId?: string) => {
    if (courseId && onStartCourse) {
      onStartCourse(courseId);
    }
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth || 500;
    const height = container.clientHeight || 450;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
    camera.position.set(0, 0, 36);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Group for rotation
    const networkGroup = new THREE.Group();
    scene.add(networkGroup);

    // Ambient and Point lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambientLight);

    const centerPointLight = new THREE.PointLight(0x38bdf8, 3.0, 60);
    centerPointLight.position.set(0, 0, 0);
    scene.add(centerPointLight);

    const accentLight1 = new THREE.PointLight(0x818cf8, 2.0, 70);
    accentLight1.position.set(18, 18, 18);
    scene.add(accentLight1);

    const accentLight2 = new THREE.PointLight(0xec4899, 1.4, 70);
    accentLight2.position.set(-18, -14, -18);
    scene.add(accentLight2);

    // Subtle cosmic starfield background
    const starCount = 320;
    const starGeometry = new THREE.BufferGeometry();
    const starPositions = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount; i++) {
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      const r = 32 + Math.random() * 18;
      starPositions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      starPositions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      starPositions[i * 3 + 2] = r * Math.cos(phi);
    }
    starGeometry.setAttribute("position", new THREE.BufferAttribute(starPositions, 3));
    const starMaterial = new THREE.PointsMaterial({
      color: 0x93c5fd,
      size: 0.35,
      transparent: true,
      opacity: 0.65,
    });
    const starField = new THREE.Points(starGeometry, starMaterial);
    scene.add(starField);

    // Central Node: "Overall Competency" Celestial Command Core
    const centerGeometry = new THREE.SphereGeometry(3.6, 40, 40);
    const centerMaterial = new THREE.MeshStandardMaterial({
      color: 0x0284c7,
      emissive: 0x0369a1,
      emissiveIntensity: 0.95,
      roughness: 0.14,
      metalness: 0.88,
    });
    const centerMesh = new THREE.Mesh(centerGeometry, centerMaterial);
    (centerMesh as any).userData = { isCenter: true, name: "Overall Competency", score: overallScore };
    networkGroup.add(centerMesh);

    // Central radiant glowing aura
    const centerAuraGeom = new THREE.SphereGeometry(4.4, 32, 32);
    const centerAuraMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      emissive: 0x38bdf8,
      emissiveIntensity: 0.65,
      transparent: true,
      opacity: 0.28,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const centerAura = new THREE.Mesh(centerAuraGeom, centerAuraMat);
    networkGroup.add(centerAura);

    // Central white-hot energetic heart
    const centerKernelGeom = new THREE.SphereGeometry(1.6, 24, 24);
    const centerKernelMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.85,
    });
    const centerKernel = new THREE.Mesh(centerKernelGeom, centerKernelMat);
    networkGroup.add(centerKernel);

    // Central gyroscopic celestial rings
    const ring1Geom = new THREE.TorusGeometry(5.4, 0.08, 16, 64);
    const ring1Mat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      emissive: 0x0284c7,
      emissiveIntensity: 0.85,
      roughness: 0.2,
      metalness: 0.8,
    });
    const centerRing1 = new THREE.Mesh(ring1Geom, ring1Mat);
    centerRing1.rotation.x = Math.PI / 3;
    centerRing1.rotation.y = Math.PI / 6;
    networkGroup.add(centerRing1);

    const ring2Geom = new THREE.TorusGeometry(6.6, 0.06, 16, 64);
    const ring2Mat = new THREE.MeshStandardMaterial({
      color: 0x818cf8,
      emissive: 0x6366f1,
      emissiveIntensity: 0.75,
      roughness: 0.2,
      metalness: 0.8,
    });
    const centerRing2 = new THREE.Mesh(ring2Geom, ring2Mat);
    centerRing2.rotation.x = -Math.PI / 4;
    centerRing2.rotation.z = Math.PI / 4;
    networkGroup.add(centerRing2);

    // Competency Nodes representing courses to plot around sphere
    const keySkills = [
      "Python",
      "Statistics",
      "Sampling",
      "SQL",
      "AI/ML",
      "GIS",
      "Cloud",
      "Cybersecurity",
      "Communication",
      "Leadership",
      "Price Statistics",
      "National Accounts"
    ];

    const nodesData: {
      name: string;
      mesh: THREE.Mesh;
      auraMesh: THREE.Mesh;
      planetaryRing: THREE.Mesh;
      pulseBead: THREE.Mesh;
      initialPos: THREE.Vector3;
      phi: number;
      theta: number;
      radius: number;
      level: number;
      required: number;
      gap: number;
      priority: string;
      category: string;
    }[] = [];

    const lineMeshes: THREE.Line[] = [];
    const interactableMeshes: THREE.Mesh[] = [centerMesh];

    const numNodes = keySkills.length;

    keySkills.forEach((skillName, index) => {
      const userSkill = userSkills.find((s) => s.name.toLowerCase() === skillName.toLowerCase());
      const req = requirements.find((r) => r.name.toLowerCase() === skillName.toLowerCase());
      const gapItem = skillGaps.find((g) => g.name.toLowerCase() === skillName.toLowerCase());

      const currentLevel = userSkill ? userSkill.level : 1;
      const reqLevel = req ? req.requiredLevel : 3;
      const gap = gapItem ? gapItem.gap : Math.max(0, reqLevel - currentLevel);
      const priority = gapItem ? gapItem.priority : (gap >= 2 ? "High" : "Low");
      const category = userSkill ? userSkill.category : "Technical";

      const sphereRadius = 0.9 + currentLevel * 0.35;

      // Spherical distribution
      const phi = Math.acos(-1 + (2 * index) / numNodes);
      const theta = Math.sqrt(numNodes * Math.PI) * phi;
      const orbitDist = 14.0 + (index % 3) * 1.6;

      const x = orbitDist * Math.sin(phi) * Math.cos(theta);
      const y = orbitDist * Math.sin(phi) * Math.sin(theta);
      const z = orbitDist * Math.cos(phi);

      // Color coding preserved strictly:
      // Red/Rose: critical gap (gap >= 2)
      // Amber/Gold: medium gap (gap === 1)
      // Sky Blue / Emerald: on target or mastered
      let nodeColor = 0x10b981; // emerald
      let emissiveColor = 0x059669;
      if (gap >= 2) {
        nodeColor = 0xf43f5e; // red / rose
        emissiveColor = 0xe11d48;
      } else if (gap === 1) {
        nodeColor = 0xf59e0b; // amber
        emissiveColor = 0xd97706;
      } else if (currentLevel >= reqLevel) {
        nodeColor = 0x38bdf8; // sky blue
        emissiveColor = 0x0284c7;
      }

      // 1. Glossy Jewel Sphere Core
      const nodeGeometry = new THREE.SphereGeometry(sphereRadius, 32, 32);
      const nodeMaterial = new THREE.MeshStandardMaterial({
        color: nodeColor,
        emissive: emissiveColor,
        emissiveIntensity: 0.85,
        roughness: 0.15,
        metalness: 0.85,
      });

      const nodeMesh = new THREE.Mesh(nodeGeometry, nodeMaterial);
      nodeMesh.position.set(x, y, z);
      nodeMesh.userData = {
        name: skillName,
        level: currentLevel,
        required: reqLevel,
        gap,
        priority,
        category,
      };

      // 2. Outer Holographic Atmospheric Aura Shell
      const auraGeom = new THREE.SphereGeometry(sphereRadius * 1.36, 24, 24);
      const auraMat = new THREE.MeshStandardMaterial({
        color: nodeColor,
        emissive: emissiveColor,
        emissiveIntensity: 0.6,
        transparent: true,
        opacity: 0.32,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });
      const auraMesh = new THREE.Mesh(auraGeom, auraMat);
      nodeMesh.add(auraMesh);

      // 3. Inner Energetic Core
      const innerCoreGeom = new THREE.SphereGeometry(sphereRadius * 0.4, 16, 16);
      const innerCoreMat = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.8,
      });
      const innerCore = new THREE.Mesh(innerCoreGeom, innerCoreMat);
      nodeMesh.add(innerCore);

      // 4. Orbiting Planetary Celestial Ring
      const ringGeom = new THREE.TorusGeometry(sphereRadius * 1.65, 0.045, 12, 36);
      const ringMat = new THREE.MeshStandardMaterial({
        color: nodeColor,
        emissive: emissiveColor,
        emissiveIntensity: 0.85,
        roughness: 0.2,
        metalness: 0.8,
        transparent: true,
        opacity: 0.78,
      });
      const planetaryRing = new THREE.Mesh(ringGeom, ringMat);
      planetaryRing.rotation.x = Math.PI / 3 + index * 0.45;
      planetaryRing.rotation.y = index * 0.3;
      nodeMesh.add(planetaryRing);

      networkGroup.add(nodeMesh);
      interactableMeshes.push(nodeMesh);

      // 5. Energy Waypoint Pulse Bead traveling along the connection beam
      const pulseGeom = new THREE.SphereGeometry(0.24, 12, 12);
      const pulseMat = new THREE.MeshBasicMaterial({
        color: nodeColor,
        transparent: true,
        opacity: 0.9,
      });
      const pulseBead = new THREE.Mesh(pulseGeom, pulseMat);
      networkGroup.add(pulseBead);

      nodesData.push({
        name: skillName,
        mesh: nodeMesh,
        auraMesh,
        planetaryRing,
        pulseBead,
        initialPos: new THREE.Vector3(x, y, z),
        phi,
        theta,
        radius: orbitDist,
        level: currentLevel,
        required: reqLevel,
        gap,
        priority,
        category,
      });

      // Luminous Connecting line from Center to Node
      const lineMaterial = new THREE.LineBasicMaterial({
        color: gap >= 2 ? 0xf43f5e : 0x0284c7,
        transparent: true,
        opacity: gap >= 2 ? 0.75 : 0.4,
        linewidth: 1,
      });
      const points = [new THREE.Vector3(0, 0, 0), new THREE.Vector3(x, y, z)];
      const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
      const line = new THREE.Line(lineGeometry, lineMaterial);
      networkGroup.add(line);
      lineMeshes.push(line);
    });

    // Inter-node network connections
    const interConnections = [
      ["Python", "Statistics"],
      ["Python", "SQL"],
      ["Python", "AI/ML"],
      ["Statistics", "Sampling"],
      ["GIS", "Statistics"],
      ["Cloud", "Cybersecurity"],
      ["Leadership", "Communication"],
      ["Statistics", "Price Statistics"],
      ["Statistics", "National Accounts"]
    ];

    interConnections.forEach(([fromName, toName]) => {
      const fromNode = nodesData.find((n) => n.name === fromName);
      const toNode = nodesData.find((n) => n.name === toName);
      if (fromNode && toNode) {
        const edgeMaterial = new THREE.LineBasicMaterial({
          color: 0x6366f1,
          transparent: true,
          opacity: 0.28,
        });
        const edgePoints = [fromNode.initialPos, toNode.initialPos];
        const edgeGeom = new THREE.BufferGeometry().setFromPoints(edgePoints);
        const edgeLine = new THREE.Line(edgeGeom, edgeMaterial);
        networkGroup.add(edgeLine);
      }
    });

    // Mouse Interaction
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };

    const onPointerDown = (e: PointerEvent) => {
      isDragging = true;
      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const onPointerMove = (e: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      if (isDragging && !reducedMotion) {
        const deltaX = e.clientX - previousMousePosition.x;
        const deltaY = e.clientY - previousMousePosition.y;

        networkGroup.rotation.y += deltaX * 0.006;
        networkGroup.rotation.x += deltaY * 0.006;

        previousMousePosition = { x: e.clientX, y: e.clientY };
      }

      // Raycast for hover
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(interactableMeshes);

      if (intersects.length > 0) {
        const hit = intersects[0].object as THREE.Mesh;
        if (hit.userData && !hit.userData.isCenter) {
          container.style.cursor = "pointer";
          setHoveredNode({
            name: hit.userData.name,
            level: hit.userData.level,
            required: hit.userData.required,
            gap: hit.userData.gap,
            priority: hit.userData.priority,
            category: hit.userData.category,
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
          });
          return;
        }
      }
      container.style.cursor = isDragging ? "grabbing" : "default";
      setHoveredNode(null);
    };

    const onPointerUp = () => {
      isDragging = false;
    };

    const onClick = () => {
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(interactableMeshes);
      if (intersects.length > 0) {
        const hit = intersects[0].object as THREE.Mesh;
        if (hit.userData && hit.userData.name) {
          handleSelectAndGo(hit.userData.name);
        }
      }
    };

    container.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
    container.addEventListener("click", onClick);

    // Resize observer
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width: newW, height: newH } = entry.contentRect;
        if (newW === 0 || newH === 0) continue;
        camera.aspect = newW / newH;
        camera.updateProjectionMatrix();
        renderer.setSize(newW, newH);
      }
    });
    resizeObserver.observe(container);

    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      if (!reducedMotion) {
        // Continuous slow roaming orbit rotation
        if (!isDragging) {
          networkGroup.rotation.y += 0.0032;
          networkGroup.rotation.x = Math.sin(elapsed * 0.2) * 0.08;
        }

        // Dual gyroscopic rings rotating in counter-directions
        centerRing1.rotation.z = elapsed * 0.6;
        centerRing2.rotation.y = -elapsed * 0.45;

        // Subtle cosmic starfield drift
        starField.rotation.y = elapsed * 0.012;

        // Subtle organic breathing of node meshes and spinning rings
        nodesData.forEach((node, i) => {
          const wobble = Math.sin(elapsed * 1.6 + i * 0.8) * 0.32;
          node.mesh.position.y = node.initialPos.y + wobble;

          // Rotate local planetary ring around each sphere
          node.planetaryRing.rotation.z = elapsed * 0.8 + i;

          // Pulse traveling waypoint bead along line from center to node
          const pulseT = ((elapsed * 0.7 + i * 0.2) % 1.0);
          node.pulseBead.position.lerpVectors(
            new THREE.Vector3(0, 0, 0),
            node.mesh.position,
            pulseT
          );

          // Pulse selected node
          if (selectedSkill && selectedSkill.toLowerCase() === node.name.toLowerCase()) {
            const pulse = 1 + Math.sin(elapsed * 4.5) * 0.22;
            node.mesh.scale.set(pulse, pulse, pulse);
            node.auraMesh.scale.set(1.2, 1.2, 1.2);
          } else {
            node.mesh.scale.set(1, 1, 1);
            node.auraMesh.scale.set(1, 1, 1);
          }
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
  }, [userSkills, requirements, skillGaps, selectedSkill, overallScore, reducedMotion]);

  // Filter skills based on user input
  const allAvailableSkills = [
    "Python", "Sampling", "Statistics", "SQL", "AI/ML", "GIS", 
    "Cloud", "Cybersecurity", "Communication", "Leadership", 
    "Price Statistics", "National Accounts", "Data Quality Frameworks"
  ];

  const matchedSkills = allAvailableSkills.filter(s => 
    s.toLowerCase().includes(typedQuery.toLowerCase())
  );

  return (
    <div className="relative w-full h-[520px] rounded-2xl bg-slate-950/80 border border-slate-800 shadow-2xl overflow-hidden backdrop-blur-md">
      {/* 3D Canvas Mount */}
      <div ref={containerRef} className="w-full h-full touch-none cursor-grab active:cursor-grabbing" />

      {/* Top Header & Search Bar Overlay (Section 61 & User Request: Type course to go to course) */}
      <div className="absolute top-4 left-4 right-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pointer-events-none z-30">
        <div className="flex items-center space-x-2">
          <span className="w-2.5 h-2.5 rounded-full bg-sky-400 animate-pulse" />
          <span className="text-xs font-bold tracking-wider uppercase text-white drop-shadow">
            {t.sphereTitle}
          </span>
        </div>

        {/* Live Course Search & Direct Navigation Input */}
        <div className="relative pointer-events-auto w-full sm:w-80">
          <div className="relative flex items-center">
            <Search className="w-3.5 h-3.5 text-sky-400 absolute left-3 pointer-events-none" />
            <input
              type="text"
              value={typedQuery}
              onChange={(e) => {
                setTypedQuery(e.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && matchedSkills.length > 0) {
                  handleSelectAndGo(matchedSkills[0]);
                }
              }}
              placeholder={t.typeCoursePrompt}
              className="w-full bg-slate-900/90 hover:bg-slate-900 focus:bg-slate-900 text-white text-xs pl-8 pr-8 py-2 rounded-xl border border-sky-500/40 focus:border-sky-400 focus:ring-2 focus:ring-sky-500/20 shadow-lg outline-none backdrop-blur-md placeholder-slate-400 transition"
            />
            {typedQuery && (
              <button
                onClick={() => {
                  setTypedQuery("");
                  setShowSuggestions(false);
                }}
                className="absolute right-2.5 text-slate-400 hover:text-white text-xs"
              >
                ✕
              </button>
            )}
          </div>

          {/* Autocomplete Suggestions Dropdown */}
          {showSuggestions && typedQuery.trim().length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1.5 bg-slate-900/95 border border-slate-700 rounded-xl shadow-2xl backdrop-blur-md overflow-hidden max-h-56 overflow-y-auto z-40">
              {matchedSkills.length > 0 ? (
                matchedSkills.map((skill) => {
                  const cInfo = getCourseInfoForSkill(skill);
                  return (
                    <button
                      key={skill}
                      onClick={() => handleSelectAndGo(skill)}
                      className="w-full px-3 py-2 text-left text-xs text-slate-200 hover:bg-sky-600/30 hover:text-white flex items-center justify-between border-b border-slate-800/60 transition group"
                    >
                      <div>
                        <div className="font-semibold text-sky-300 group-hover:text-white">{skill}</div>
                        <div className="text-[10px] text-slate-400 truncate max-w-[200px]">{cInfo.title}</div>
                      </div>
                      <span className="text-[10px] bg-sky-950 text-sky-400 px-2 py-0.5 rounded border border-sky-800 shrink-0">
                        {t.goToCourse} →
                      </span>
                    </button>
                  );
                })
              ) : (
                <div className="p-3 text-xs text-slate-400 text-center">
                  No courses matching &quot;{typedQuery}&quot;
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Selected Course Floating Action Card (User Request: Taking directly to the course) */}
      {activeCourseInfo && (
        <div className="absolute top-16 left-4 right-4 sm:left-auto sm:right-4 sm:w-96 z-20 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-sky-950/80 border border-sky-500/50 rounded-2xl p-4 shadow-2xl backdrop-blur-md">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-sky-400 flex items-center space-x-1">
                <Sparkles className="w-3 h-3 text-sky-400" />
                <span>Selected Course</span>
              </span>
              <button
                onClick={() => setActiveCourseInfo(null)}
                className="text-slate-400 hover:text-white text-xs p-1"
              >
                ✕
              </button>
            </div>

            <h4 className="text-sm font-bold text-white mb-1 leading-snug">
              {activeCourseInfo.courseTitle}
            </h4>

            <div className="flex items-center space-x-2 text-xs text-slate-400 mb-3">
              <span className="text-sky-300 font-semibold">{activeCourseInfo.provider}</span>
              <span>•</span>
              <span className="text-emerald-400 font-bold">{activeCourseInfo.matchScore}% Match</span>
              <span>•</span>
              <span className="text-amber-400">
                {activeCourseInfo.gap > 0 ? `Target: Level ${activeCourseInfo.level} → ${activeCourseInfo.required}` : "Mastered"}
              </span>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => handleLaunchCourse(activeCourseInfo.courseId)}
                className="flex-1 flex items-center justify-center space-x-1.5 py-2 px-4 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-bold text-xs shadow-lg shadow-sky-600/30 transition active:scale-95"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>{t.launchCourse}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Interactive Hover Tooltip */}
      {hoveredNode && !activeCourseInfo && (
        <div
          className="absolute z-20 pointer-events-none -translate-x-1/2 -translate-y-full mb-3 bg-slate-900/95 border border-slate-700 rounded-xl px-3.5 py-2.5 shadow-2xl backdrop-blur-md min-w-[200px]"
          style={{
            left: `${hoveredNode.x}px`,
            top: `${hoveredNode.y}px`,
          }}
        >
          <div className="flex items-center justify-between mb-1.5">
            <span className="font-semibold text-white text-sm">{hoveredNode.name}</span>
            <span
              className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                hoveredNode.gap >= 2
                  ? "bg-rose-500/20 text-rose-300 border border-rose-500/40"
                  : hoveredNode.gap === 1
                  ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                  : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
              }`}
            >
              {hoveredNode.gap > 0 ? `Gap: ${hoveredNode.gap}` : "On Target"}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs text-slate-300">
            <div>
              <span className="text-slate-400 text-[11px]">{t.currentAssessed}</span>{" "}
              <span className="font-bold text-sky-400">{hoveredNode.level}/5</span>
            </div>
            <div>
              <span className="text-slate-400 text-[11px]">{t.requiredForRole}</span>{" "}
              <span className="font-bold text-indigo-400">{hoveredNode.required}/5</span>
            </div>
          </div>
          <div className="mt-2 pt-1.5 border-t border-slate-800 text-[10px] text-slate-400 flex items-center justify-between">
            <span>{hoveredNode.category}</span>
            <span className="text-sky-300 font-medium">{t.clickToInspect} →</span>
          </div>
        </div>
      )}

      {/* Bottom Controls & Legend */}
      <div className="absolute bottom-3 left-4 right-4 flex flex-wrap items-center justify-between text-xs text-slate-300 bg-slate-900/80 px-3.5 py-2 rounded-xl border border-slate-800/80 backdrop-blur-sm pointer-events-none">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
            <span className="text-[11px] text-slate-300">{t.criticalGap}</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <span className="text-[11px] text-slate-300">{t.mediumGap}</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-sky-400" />
            <span className="text-[11px] text-slate-300">{t.mastered}</span>
          </div>
        </div>
        <div className="text-[11px] text-slate-400 font-mono hidden sm:block">
          {t.orbitHint}
        </div>
      </div>
    </div>
  );
};
