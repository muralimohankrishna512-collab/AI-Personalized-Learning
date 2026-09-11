import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { UploadCloud, FileText, CheckCircle2 } from "lucide-react";

interface DocumentUpload3DProps {
  onFileSelect: (fileName: string, content: string) => void;
  isProcessing?: boolean;
  reducedMotion?: boolean;
}

export const DocumentUpload3D: React.FC<DocumentUpload3DProps> = ({
  onFileSelect,
  isProcessing = false,
  reducedMotion = false,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadedName, setUploadedName] = useState<string | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth || 300;
    const height = container.clientHeight || 180;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 9);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0x38bdf8, 2);
    dirLight.position.set(5, 5, 5);
    scene.add(dirLight);

    // 3D Document Mesh: Layered Sheet/Binder
    const docGroup = new THREE.Group();
    scene.add(docGroup);

    // Paper Sheet
    const sheetGeom = new THREE.BoxGeometry(3.2, 4.4, 0.12);
    const sheetMat = new THREE.MeshStandardMaterial({
      color: 0x0284c7,
      roughness: 0.3,
      metalness: 0.5,
    });
    const sheet = new THREE.Mesh(sheetGeom, sheetMat);
    docGroup.add(sheet);

    // Border line accents on sheet
    const line1Geom = new THREE.BoxGeometry(2.2, 0.14, 0.14);
    const lineMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
    const line1 = new THREE.Mesh(line1Geom, lineMat);
    line1.position.set(0, 1.0, 0.08);
    docGroup.add(line1);

    const line2 = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.14, 0.14), lineMat);
    line2.position.set(0, 0.4, 0.08);
    docGroup.add(line2);

    const line3 = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.14, 0.14), lineMat);
    line3.position.set(-0.3, -0.2, 0.08);
    docGroup.add(line3);

    // Corner Fold
    const foldGeom = new THREE.BufferGeometry();
    const foldVertices = new Float32Array([
      1.1, 2.2, 0.08,
      1.6, 1.7, 0.08,
      1.1, 1.7, 0.08,
    ]);
    foldGeom.setAttribute("position", new THREE.BufferAttribute(foldVertices, 3));
    const foldMat = new THREE.MeshBasicMaterial({ color: 0x0369a1, side: THREE.DoubleSide });
    const fold = new THREE.Mesh(foldGeom, foldMat);
    docGroup.add(fold);

    docGroup.rotation.set(0.15, -0.3, 0.08);

    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      if (!reducedMotion) {
        // Floating levitation
        docGroup.position.y = Math.sin(elapsed * 2) * 0.25;
        docGroup.rotation.y = -0.3 + Math.sin(elapsed * 1.5) * 0.12;

        if (isProcessing) {
          docGroup.rotation.z = Math.sin(elapsed * 4) * 0.1;
          sheetMat.color.setHex(0x6366f1);
        } else {
          sheetMat.color.setHex(0x0284c7);
        }
      }

      renderer.render(scene, camera);
    };

    animate();

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

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [isProcessing, reducedMotion]);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setUploadedName(file.name);
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string || "Statistical guideline content extracted.";
        onFileSelect(file.name, content);
      };
      reader.readAsText(file);
    }
  };

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragOver(true);
      }}
      onDragLeave={() => setIsDragOver(false)}
      onDrop={handleDrop}
      className={`relative w-full rounded-2xl border-2 border-dashed p-6 transition-all flex flex-col md:flex-row items-center justify-between gap-6 bg-slate-900/60 backdrop-blur-md ${
        isDragOver
          ? "border-sky-400 bg-sky-950/40 shadow-xl shadow-sky-500/20"
          : "border-slate-700/80 hover:border-slate-500"
      }`}
    >
      {/* 3D Floating Document Canvas */}
      <div
        ref={containerRef}
        className="w-48 h-36 shrink-0 pointer-events-none flex items-center justify-center"
      />

      {/* Upload Zone Details */}
      <div className="flex-1 text-center md:text-left">
        <div className="flex items-center justify-center md:justify-start space-x-2 mb-2">
          <UploadCloud className="w-5 h-5 text-sky-400" />
          <h4 className="text-base font-bold text-white">
            {uploadedName ? `Uploaded: ${uploadedName}` : "Upload Official Statistical Document / Manual"}
          </h4>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed mb-4">
          Drop PDF, DOCX, PPTX, or TXT manual. The AI Assessment Pipeline will extract text, perform semantic chunking, and generate 10 verified assessment questions.
        </p>

        <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
          <label className="cursor-pointer px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold shadow-lg shadow-sky-600/30 transition active:scale-95">
            <span>Browse File</span>
            <input
              type="file"
              accept=".pdf,.docx,.pptx,.txt"
              className="hidden"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  const file = e.target.files[0];
                  setUploadedName(file.name);
                  const reader = new FileReader();
                  reader.onload = (event) => {
                    const content = event.target?.result as string || "Statistical text excerpt";
                    onFileSelect(file.name, content);
                  };
                  reader.readAsText(file);
                }
              }}
            />
          </label>
          <span className="text-[11px] text-slate-400">Supported: PDF, DOCX, PPTX, TXT (Max 20MB)</span>
        </div>
      </div>
    </div>
  );
};
