import * as THREE from "three";

export class PortfolioScene {
  private readonly canvas: HTMLCanvasElement;
  private readonly scene = new THREE.Scene();
  private readonly camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
  private readonly renderer: THREE.WebGLRenderer;
  private readonly clock = new THREE.Clock();

  private animationFrame = 0;
  private pointer = new THREE.Vector2();
  private targetPointer = new THREE.Vector2();
  private scrollProgress = 0;

  // IT Systems & Automation 3D Hierarchy
  private mainGroup = new THREE.Group();
  private innerCore!: THREE.Mesh<THREE.IcosahedronGeometry, THREE.MeshStandardMaterial>;
  private coreWire!: THREE.LineSegments<THREE.EdgesGeometry, THREE.LineBasicMaterial>;
  private outerShell!: THREE.Mesh<THREE.IcosahedronGeometry, THREE.MeshStandardMaterial>;
  private shellWire!: THREE.LineSegments<THREE.EdgesGeometry, THREE.LineBasicMaterial>;

  // Network Topology & Data Routing Graph
  private networkGroup = new THREE.Group();
  private nodePoints!: THREE.Points<THREE.BufferGeometry, THREE.PointsMaterial>;
  private connectionLines!: THREE.LineSegments<THREE.BufferGeometry, THREE.LineBasicMaterial>;
  private packetParticles!: THREE.Points<THREE.BufferGeometry, THREE.PointsMaterial>;
  private packetPositions!: Float32Array;
  private packetTargets: { startIdx: number; endIdx: number; progress: number; speed: number }[] = [];
  private nodeCoords: THREE.Vector3[] = [];

  // Precision Telemetry Gimbal Rings
  private gimbalGroup = new THREE.Group();
  private rings: { mesh: THREE.Mesh; rotSpeed: { x: number; y: number; z: number } }[] = [];
  private ringNodes: THREE.Mesh[] = [];

  // Deep Field
  private backgroundGrid!: THREE.GridHelper;
  private ambientDust!: THREE.Points<THREE.BufferGeometry, THREE.PointsMaterial>;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;

    this.renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: "high-performance"
    });

    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setSize(window.innerWidth, window.innerHeight, false);
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.08;

    this.camera.position.set(0, 0, 7.2);

    this.createEnvironment();
    this.bindEvents();
    this.resize();
  }

  private createEnvironment() {
    this.scene.fog = new THREE.FogExp2(0x07090f, 0.075);

    // Balanced IT Studio Lighting
    const ambientLight = new THREE.AmbientLight(0xdbeafe, 1.1);
    this.scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0x38bdf8, 3.2);
    keyLight.position.set(4, 5, 4);
    this.scene.add(keyLight);

    const rimLight = new THREE.PointLight(0x0284c7, 18, 25, 2);
    rimLight.position.set(-4, -2.5, 3);
    this.scene.add(rimLight);

    const softFill = new THREE.PointLight(0x64748b, 8, 20, 2);
    softFill.position.set(0, -4, 2);
    this.scene.add(softFill);

    // 1. Central Precision Server / Compute Node Core
    this.createCentralCore();

    // 2. Network Topology Graph & Pulsing Data Packets
    this.createNetworkTopology();

    // 3. Precision Gyroscopic Telemetry Rings
    this.createGimbalRings();

    // 4. Background Infrastructure Grid & Ambient Data Dust
    this.createBackgroundElements();

    this.mainGroup.position.set(2.1, 0.15, 0);
    this.scene.add(this.mainGroup);
  }

  private createCentralCore() {
    // A. Solid Obsidian / Titanium Inner Processor Node
    const innerGeo = new THREE.IcosahedronGeometry(0.88, 1);
    const innerMat = new THREE.MeshStandardMaterial({
      color: 0x060b14,
      metalness: 0.95,
      roughness: 0.15,
      emissive: 0x0369a1,
      emissiveIntensity: 0.45
    });

    this.innerCore = new THREE.Mesh(innerGeo, innerMat);
    this.mainGroup.add(this.innerCore);

    // Inner wireframe edge accents
    const innerEdges = new THREE.EdgesGeometry(innerGeo);
    this.coreWire = new THREE.LineSegments(
      innerEdges,
      new THREE.LineBasicMaterial({
        color: 0x38bdf8,
        transparent: true,
        opacity: 0.65
      })
    );
    this.innerCore.add(this.coreWire);

    // B. Outer Dark Glass / Protective Translucent Shield Layer
    const outerGeo = new THREE.IcosahedronGeometry(1.42, 2);
    const outerMat = new THREE.MeshStandardMaterial({
      color: 0x0b1320,
      metalness: 0.85,
      roughness: 0.18,
      transparent: true,
      opacity: 0.35
    });

    this.outerShell = new THREE.Mesh(outerGeo, outerMat);
    this.mainGroup.add(this.outerShell);

    const outerEdges = new THREE.EdgesGeometry(outerGeo);
    this.shellWire = new THREE.LineSegments(
      outerEdges,
      new THREE.LineBasicMaterial({
        color: 0x0ea5e9,
        transparent: true,
        opacity: 0.28
      })
    );
    this.outerShell.add(this.shellWire);
  }

  private createNetworkTopology() {
    // Generate geodesic network nodes around the infrastructure
    const nodeCount = 38;
    const positions = new Float32Array(nodeCount * 3);
    this.nodeCoords = [];

    for (let i = 0; i < nodeCount; i++) {
      const theta = (i / nodeCount) * Math.PI * 2 + Math.sin(i * 1.5) * 0.4;
      const phi = Math.acos(1 - (2 * (i + 0.5)) / nodeCount);
      const r = 1.75 + Math.sin(i * 3.2) * 0.18;

      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.cos(phi);
      const z = r * Math.sin(phi) * Math.sin(theta);

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;

      this.nodeCoords.push(new THREE.Vector3(x, y, z));
    }

    const nodeGeo = new THREE.BufferGeometry();
    nodeGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));

    const nodeMat = new THREE.PointsMaterial({
      color: 0x7dd3fc,
      size: 0.038,
      transparent: true,
      opacity: 0.85,
      depthWrite: false
    });

    this.nodePoints = new THREE.Points(nodeGeo, nodeMat);
    this.networkGroup.add(this.nodePoints);

    // Build network connections (routing graph)
    const lineIndices: number[] = [];
    const maxDist = 1.35;

    for (let i = 0; i < nodeCount; i++) {
      for (let j = i + 1; j < nodeCount; j++) {
        const dist = this.nodeCoords[i].distanceTo(this.nodeCoords[j]);
        if (dist < maxDist) {
          lineIndices.push(
            this.nodeCoords[i].x, this.nodeCoords[i].y, this.nodeCoords[i].z,
            this.nodeCoords[j].x, this.nodeCoords[j].y, this.nodeCoords[j].z
          );
        }
      }
    }

    const lineGeo = new THREE.BufferGeometry();
    lineGeo.setAttribute("position", new THREE.Float32BufferAttribute(lineIndices, 3));

    const lineMat = new THREE.LineBasicMaterial({
      color: 0x0284c7,
      transparent: true,
      opacity: 0.22,
      depthWrite: false
    });

    this.connectionLines = new THREE.LineSegments(lineGeo, lineMat);
    this.networkGroup.add(this.connectionLines);

    // Continuous Data Packets flowing through the network routes
    const packetCount = 24;
    this.packetPositions = new Float32Array(packetCount * 3);
    this.packetTargets = [];

    for (let p = 0; p < packetCount; p++) {
      const start = Math.floor(Math.random() * nodeCount);
      let end = (start + 1 + Math.floor(Math.random() * 4)) % nodeCount;

      this.packetTargets.push({
        startIdx: start,
        endIdx: end,
        progress: Math.random(),
        speed: 0.008 + Math.random() * 0.012
      });

      this.packetPositions[p * 3] = this.nodeCoords[start].x;
      this.packetPositions[p * 3 + 1] = this.nodeCoords[start].y;
      this.packetPositions[p * 3 + 2] = this.nodeCoords[start].z;
    }

    const packetGeo = new THREE.BufferGeometry();
    packetGeo.setAttribute("position", new THREE.BufferAttribute(this.packetPositions, 3));

    const packetMat = new THREE.PointsMaterial({
      color: 0xe0f2fe,
      size: 0.045,
      transparent: true,
      opacity: 0.95,
      depthWrite: false
    });

    this.packetParticles = new THREE.Points(packetGeo, packetMat);
    this.networkGroup.add(this.packetParticles);

    this.mainGroup.add(this.networkGroup);
  }

  private createGimbalRings() {
    const ringSpecs = [
      { radius: 2.18, tube: 0.007, rot: [0.45, 0.25, 0.0], color: 0x38bdf8, opacity: 0.45, speed: { x: 0.0006, y: 0.0009, z: 0.0004 } },
      { radius: 2.52, tube: 0.006, rot: [-0.35, 0.50, 0.2], color: 0x0284c7, opacity: 0.35, speed: { x: -0.0005, y: 0.0007, z: -0.0006 } },
      { radius: 2.86, tube: 0.005, rot: [0.65, -0.35, 0.4], color: 0x64748b, opacity: 0.25, speed: { x: 0.0008, y: -0.0004, z: 0.0005 } }
    ];

    ringSpecs.forEach((spec) => {
      const geo = new THREE.TorusGeometry(spec.radius, spec.tube, 24, 200);
      const mat = new THREE.MeshStandardMaterial({
        color: 0x0f172a,
        emissive: spec.color,
        emissiveIntensity: 0.35,
        metalness: 0.9,
        roughness: 0.2,
        transparent: true,
        opacity: spec.opacity
      });

      const ringMesh = new THREE.Mesh(geo, mat);
      ringMesh.rotation.set(spec.rot[0], spec.rot[1], spec.rot[2]);

      // Telemetry micro-satellite node on ring
      const nodeGeo = new THREE.SphereGeometry(0.024, 12, 12);
      const nodeMat = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        emissive: 0x38bdf8,
        emissiveIntensity: 1.2
      });
      const node = new THREE.Mesh(nodeGeo, nodeMat);
      node.position.set(spec.radius, 0, 0);
      ringMesh.add(node);
      this.ringNodes.push(node);

      this.rings.push({ mesh: ringMesh, rotSpeed: spec.speed });
      this.gimbalGroup.add(ringMesh);
    });

    this.mainGroup.add(this.gimbalGroup);
  }

  private createBackgroundElements() {
    // 1. Sleek Infrastructure Floor Grid
    this.backgroundGrid = new THREE.GridHelper(32, 64, 0x1e3a5f, 0x0a1626);
    this.backgroundGrid.position.y = -3.2;
    (this.backgroundGrid.material as THREE.Material).transparent = true;
    (this.backgroundGrid.material as THREE.Material).opacity = 0.32;
    this.scene.add(this.backgroundGrid);

    // 2. Ambient Micro Data Dust
    const dustCount = 450;
    const positions = new Float32Array(dustCount * 3);

    for (let i = 0; i < dustCount; i++) {
      const r = 4.0 + Math.random() * 12;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);
    }

    const dustGeo = new THREE.BufferGeometry();
    dustGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));

    const dustMat = new THREE.PointsMaterial({
      color: 0x60a5fa,
      size: 0.016,
      transparent: true,
      opacity: 0.35,
      depthWrite: false
    });

    this.ambientDust = new THREE.Points(dustGeo, dustMat);
    this.scene.add(this.ambientDust);
  }

  private bindEvents() {
    window.addEventListener("resize", this.resize);
    window.addEventListener("pointermove", this.onPointerMove, { passive: true });
    window.addEventListener("scroll", this.onScroll, { passive: true });
  }

  private onPointerMove = (event: PointerEvent) => {
    this.targetPointer.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.targetPointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
  };

  private onScroll = () => {
    const maxScroll = Math.max(
      document.documentElement.scrollHeight - window.innerHeight,
      1
    );

    this.scrollProgress = window.scrollY / maxScroll;
  };

  private resize = () => {
    const width = window.innerWidth;
    const height = window.innerHeight;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(width, height, false);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    if (width < 900) {
      this.mainGroup.position.x = 0.6;
      this.mainGroup.position.y = -1.25;
    } else {
      this.mainGroup.position.x = 2.1;
      this.mainGroup.position.y = 0.15;
    }
  };

  start() {
    this.clock.start();
    this.animate();
  }

  private animate = () => {
    const elapsed = this.clock.getElapsedTime();

    this.pointer.lerp(this.targetPointer, 0.045);

    // 1. Central Core Rotations (Steady, precision engineering)
    this.innerCore.rotation.y = elapsed * 0.12;
    this.innerCore.rotation.x = elapsed * 0.06;

    this.outerShell.rotation.y = -elapsed * 0.07;
    this.outerShell.rotation.z = elapsed * 0.04;

    // 2. Network Topology & Packet Pulses
    this.networkGroup.rotation.y = elapsed * 0.05 + this.pointer.x * 0.12;
    this.networkGroup.rotation.x = -this.pointer.y * 0.08;

    if (this.packetParticles && this.nodeCoords.length > 0) {
      const pos = this.packetParticles.geometry.attributes.position.array as Float32Array;

      for (let p = 0; p < this.packetTargets.length; p++) {
        const item = this.packetTargets[p];
        item.progress += item.speed;

        if (item.progress >= 1.0) {
          item.progress = 0.0;
          item.startIdx = item.endIdx;
          item.endIdx = (item.endIdx + 1 + Math.floor(Math.random() * 5)) % this.nodeCoords.length;
        }

        const p1 = this.nodeCoords[item.startIdx];
        const p2 = this.nodeCoords[item.endIdx];

        pos[p * 3] = THREE.MathUtils.lerp(p1.x, p2.x, item.progress);
        pos[p * 3 + 1] = THREE.MathUtils.lerp(p1.y, p2.y, item.progress);
        pos[p * 3 + 2] = THREE.MathUtils.lerp(p1.z, p2.z, item.progress);
      }
      this.packetParticles.geometry.attributes.position.needsUpdate = true;
    }

    // 3. Gimbal Telemetry Rings Rotation
    this.rings.forEach((ring) => {
      ring.mesh.rotation.x += ring.rotSpeed.x;
      ring.mesh.rotation.y += ring.rotSpeed.y;
      ring.mesh.rotation.z += ring.rotSpeed.z;
    });

    // 4. Subtle Breathing Float & Parallax
    const basePosY = window.innerWidth < 900 ? -1.25 : 0.15;
    this.mainGroup.position.y +=
      (Math.sin(elapsed * 0.6) * 0.07 + basePosY - this.mainGroup.position.y) * 0.025;

    // 5. Ambient Dust Cosmic Motion
    if (this.ambientDust) {
      this.ambientDust.rotation.y = elapsed * 0.006;
      this.ambientDust.rotation.x = this.scrollProgress * 0.22;
    }

    // 6. Camera Parallax Tracking
    this.camera.position.x +=
      (this.pointer.x * 0.22 - this.camera.position.x) * 0.025;
    this.camera.position.y +=
      (-this.pointer.y * 0.12 - this.scrollProgress * 0.42 - this.camera.position.y) * 0.02;

    this.camera.lookAt(0, -this.scrollProgress * 0.6, 0);

    this.renderer.render(this.scene, this.camera);
    this.animationFrame = requestAnimationFrame(this.animate);
  };

  dispose() {
    cancelAnimationFrame(this.animationFrame);

    window.removeEventListener("resize", this.resize);
    window.removeEventListener("pointermove", this.onPointerMove);
    window.removeEventListener("scroll", this.onScroll);

    this.scene.traverse((object) => {
      if (object instanceof THREE.Mesh || object instanceof THREE.Points || object instanceof THREE.LineSegments) {
        object.geometry?.dispose();

        const material = object.material;
        if (Array.isArray(material)) {
          material.forEach((item) => item.dispose());
        } else {
          material?.dispose();
        }
      }
    });

    this.renderer.dispose();
  }
}






