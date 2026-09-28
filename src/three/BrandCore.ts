import * as THREE from "three";

export class BrandCore {
  private canvas: HTMLCanvasElement;
  private scene = new THREE.Scene();
  private camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
  private renderer: THREE.WebGLRenderer;
  private mainGroup = new THREE.Group();

  private centralCrystal!: THREE.Mesh<THREE.IcosahedronGeometry, THREE.MeshStandardMaterial>;
  private innerSpark!: THREE.Mesh<THREE.OctahedronGeometry, THREE.MeshBasicMaterial>;
  private geodesicCage!: THREE.Mesh<THREE.IcosahedronGeometry, THREE.MeshStandardMaterial>;
  private cageEdges!: THREE.LineSegments<THREE.EdgesGeometry, THREE.LineBasicMaterial>;

  private ringA!: THREE.Mesh<THREE.TorusGeometry, THREE.MeshStandardMaterial>;
  private ringB!: THREE.Mesh<THREE.TorusGeometry, THREE.MeshStandardMaterial>;

  private satellites: { mesh: THREE.Mesh; radius: number; angle: number; speed: number }[] = [];

  private pGeo!: THREE.BufferGeometry;
  private pData: { radius: number; theta: number; phi: number; speed: number; drift: number }[] = [];
  private pCount = 85;

  private coreLight!: THREE.PointLight;
  private coreMat!: THREE.MeshStandardMaterial;

  private animationFrame = 0;
  private clock = new THREE.Clock();
  private isHovered = false;
  private mouseDrag = false;
  private prevMouse = { x: 0, y: 0 };
  private targetRot = { x: 0.2, y: 0.3 };
  private shockwaveScale = 1.0;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.camera.position.z = 4.2;

    this.renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: "high-performance"
    });
    this.renderer.setSize(38, 38, false);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    this.scene.add(this.mainGroup);

    // Multi-chromatic Studio Lighting
    const amb = new THREE.AmbientLight(0x0f172a, 1.6);
    this.scene.add(amb);

    // Soft non-flashy cyan core point light
    this.coreLight = new THREE.PointLight(0x0ea5e9, 2.0, 12);
    this.scene.add(this.coreLight);

    const rimLight1 = new THREE.DirectionalLight(0x10b981, 1.8);
    rimLight1.position.set(3, 4, 3);
    this.scene.add(rimLight1);

    const rimLight2 = new THREE.DirectionalLight(0x38bdf8, 1.6);
    rimLight2.position.set(-3, -4, 2);
    this.scene.add(rimLight2);

    // 1. Central Crystalline Faceted Core (Refined Soft Saphir Cyan)
    const coreGeo = new THREE.IcosahedronGeometry(0.70, 0);
    this.coreMat = new THREE.MeshStandardMaterial({
      color: 0x0369a1,
      roughness: 0.12,
      metalness: 0.9,
      emissive: 0x0284c7,
      emissiveIntensity: 0.55,
      flatShading: true
    });
    this.centralCrystal = new THREE.Mesh(coreGeo, this.coreMat);
    this.mainGroup.add(this.centralCrystal);

    // 1b. Inner Spark Octahedron
    const sparkGeo = new THREE.OctahedronGeometry(0.38, 0);
    const sparkMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      wireframe: true,
      transparent: true,
      opacity: 0.85
    });
    this.innerSpark = new THREE.Mesh(sparkGeo, sparkMat);
    this.mainGroup.add(this.innerSpark);

    // 2. High-Visibility Icosahedron Outer Wireframe Cage (Gris Inox Sombre / Gunmetal Anthracite)
    const cageGeo = new THREE.IcosahedronGeometry(1.18, 0);
    const cageMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      wireframe: false,
      transparent: true,
      opacity: 0.35,
      metalness: 0.95,
      roughness: 0.25
    });
    this.geodesicCage = new THREE.Mesh(cageGeo, cageMat);

    // Darker gunmetal / inox sombre wireframe lines (#64748b / #475569)
    const cageEdgesGeo = new THREE.EdgesGeometry(cageGeo);
    const cageEdgesMat = new THREE.LineBasicMaterial({
      color: 0x64748b,
      transparent: true,
      opacity: 0.9
    });
    this.cageEdges = new THREE.LineSegments(cageEdgesGeo, cageEdgesMat);
    this.geodesicCage.add(this.cageEdges);
    this.mainGroup.add(this.geodesicCage);

    // 3. Counter-Rotating Quantum Gimbal Rings (Soft Cyan & Emerald)
    const ringAGeo = new THREE.TorusGeometry(1.72, 0.032, 12, 48);
    const ringAMat = new THREE.MeshStandardMaterial({
      color: 0x0284c7,
      emissive: 0x0284c7,
      emissiveIntensity: 0.5,
      roughness: 0.15,
      metalness: 0.85
    });
    this.ringA = new THREE.Mesh(ringAGeo, ringAMat);
    this.ringA.rotation.x = Math.PI / 4;
    this.mainGroup.add(this.ringA);

    const ringBGeo = new THREE.TorusGeometry(1.50, 0.024, 12, 48);
    const ringBMat = new THREE.MeshStandardMaterial({
      color: 0x059669,
      emissive: 0x10b981,
      emissiveIntensity: 0.45,
      roughness: 0.15,
      metalness: 0.85
    });
    this.ringB = new THREE.Mesh(ringBGeo, ringBMat);
    this.ringB.rotation.y = Math.PI / 3;
    this.mainGroup.add(this.ringB);

    // 4. Orbital Satellites / Quantum Node Markers
    const satGroup = new THREE.Group();
    this.mainGroup.add(satGroup);
    const satGeo = new THREE.IcosahedronGeometry(0.065, 0);
    const satMat = new THREE.MeshBasicMaterial({ color: 0x7dd3fc });

    const satCount = 4;
    for (let i = 0; i < satCount; i++) {
      const sat = new THREE.Mesh(satGeo, satMat);
      satGroup.add(sat);
      this.satellites.push({
        mesh: sat,
        radius: 1.72,
        angle: (i * Math.PI * 2) / satCount,
        speed: 0.65 + i * 0.18
      });
    }

    // 5. Swirling Quantum Particle Vortex
    this.pGeo = new THREE.BufferGeometry();
    const pPos = new Float32Array(this.pCount * 3);
    this.pData = [];

    for (let p = 0; p < this.pCount; p++) {
      const pRad = 0.8 + Math.random() * 1.1;
      const pTheta = Math.random() * Math.PI * 2;
      const pPhi = (Math.random() - 0.5) * Math.PI;

      pPos[p * 3] = pRad * Math.cos(pTheta) * Math.cos(pPhi);
      pPos[p * 3 + 1] = pRad * Math.sin(pPhi);
      pPos[p * 3 + 2] = pRad * Math.sin(pTheta) * Math.cos(pPhi);

      this.pData.push({
        radius: pRad,
        theta: pTheta,
        phi: pPhi,
        speed: 0.35 + Math.random() * 0.55,
        drift: (Math.random() - 0.5) * 0.2
      });
    }

    this.pGeo.setAttribute("position", new THREE.BufferAttribute(pPos, 3));
    const pMat = new THREE.PointsMaterial({
      color: 0x38bdf8,
      size: 0.055,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    const particles = new THREE.Points(this.pGeo, pMat);
    this.mainGroup.add(particles);

    this.bindEvents();
    this.clock.start();
    this.animate();
  }

  private bindEvents() {
    const parent = this.canvas.parentElement;
    if (parent) {
      parent.addEventListener("mouseenter", () => (this.isHovered = true));
      parent.addEventListener("mouseleave", () => (this.isHovered = false));
      parent.addEventListener("mousedown", (e) => {
        this.mouseDrag = true;
        this.prevMouse.x = e.clientX;
        this.prevMouse.y = e.clientY;
        this.shockwaveScale = 1.35;
      });
    }

    window.addEventListener("mouseup", () => (this.mouseDrag = false));
    window.addEventListener("mousemove", (e) => {
      if (this.mouseDrag) {
        const dx = e.clientX - this.prevMouse.x;
        const dy = e.clientY - this.prevMouse.y;
        this.targetRot.y += dx * 0.012;
        this.targetRot.x += dy * 0.012;
        this.prevMouse.x = e.clientX;
        this.prevMouse.y = e.clientY;
      }
    });
  }

  private animate = () => {
    const dt = this.clock.getDelta();
    const time = this.clock.getElapsedTime();
    const speedMultiplier = this.isHovered ? 1.8 : 1.0;

    // Smooth Euler damping
    this.mainGroup.rotation.x += (this.targetRot.x - this.mainGroup.rotation.x) * 0.08;
    this.mainGroup.rotation.y += (this.targetRot.y - this.mainGroup.rotation.y) * 0.08;

    if (!this.mouseDrag) {
      this.targetRot.y += 0.22 * dt * speedMultiplier;
      this.targetRot.x = Math.sin(time * 0.3) * 0.1;
    }

    // Individual component rotations (Smooth and calm)
    this.centralCrystal.rotation.y -= 0.38 * dt * speedMultiplier;
    this.centralCrystal.rotation.x += 0.18 * dt * speedMultiplier;
    this.innerSpark.rotation.y += 0.7 * dt * speedMultiplier;

    this.geodesicCage.rotation.y += 0.14 * dt * speedMultiplier;
    this.geodesicCage.rotation.z -= 0.09 * dt * speedMultiplier;

    this.ringA.rotation.x += 0.28 * dt * speedMultiplier;
    this.ringA.rotation.z += 0.18 * dt * speedMultiplier;

    this.ringB.rotation.y -= 0.32 * dt * speedMultiplier;
    this.ringB.rotation.x -= 0.14 * dt * speedMultiplier;

    // Pulsing Core & Shockwave recovery
    const pulse = 0.75 + Math.sin(time * 2.0) * 0.25;
    this.coreMat.emissiveIntensity = pulse * (this.isHovered ? 0.75 : 0.5);
    this.coreLight.intensity = pulse * 1.8;

    this.shockwaveScale += (1.0 - this.shockwaveScale) * 0.08;
    this.ringA.scale.setScalar(this.shockwaveScale);
    this.ringB.scale.setScalar(this.shockwaveScale);

    // Satellites motion
    for (let s = 0; s < this.satellites.length; s++) {
      const satObj = this.satellites[s];
      satObj.angle += satObj.speed * dt * speedMultiplier;
      satObj.mesh.position.set(
        Math.cos(satObj.angle) * satObj.radius,
        Math.sin(satObj.angle) * Math.sin(time * 0.6 + s) * 0.5,
        Math.sin(satObj.angle) * satObj.radius
      );
    }

    // Swirling Quantum Particles update
    const pArray = this.pGeo.attributes.position.array as Float32Array;
    for (let pt = 0; pt < this.pCount; pt++) {
      const pd = this.pData[pt];
      pd.theta += pd.speed * dt * 0.35 * speedMultiplier;
      pd.phi += pd.drift * dt;
      pArray[pt * 3] = pd.radius * Math.cos(pd.theta) * Math.cos(pd.phi);
      pArray[pt * 3 + 1] = pd.radius * Math.sin(pd.phi);
      pArray[pt * 3 + 2] = pd.radius * Math.sin(pd.theta) * Math.cos(pd.phi);
    }
    this.pGeo.attributes.position.needsUpdate = true;

    this.renderer.render(this.scene, this.camera);
    this.animationFrame = requestAnimationFrame(this.animate);
  };

  dispose() {
    cancelAnimationFrame(this.animationFrame);
    this.scene.traverse((obj) => {
      if (obj instanceof THREE.Mesh || obj instanceof THREE.Points || obj instanceof THREE.LineSegments) {
        obj.geometry?.dispose();
        if (Array.isArray(obj.material)) {
          obj.material.forEach((m) => m.dispose());
        } else {
          obj.material?.dispose();
        }
      }
    });
    this.renderer.dispose();
  }
}

