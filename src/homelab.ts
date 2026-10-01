import "./styles/main.css";
import { PortfolioScene } from "./three/PortfolioScene";
import { BrandCore } from "./three/BrandCore";
import { mountHomelabPage } from "./ui/mountHomelabPage";

const canvas = document.querySelector<HTMLCanvasElement>("#webgl");
const app = document.querySelector<HTMLDivElement>("#app");

if (!canvas || !app) {
  throw new Error("Application root not found.");
}

mountHomelabPage(app);

const hasWebGL = (() => {
  try {
    const testCanvas = document.createElement("canvas");
    return Boolean(
      window.WebGLRenderingContext &&
        (testCanvas.getContext("webgl2") || testCanvas.getContext("webgl"))
    );
  } catch {
    return false;
  }
})();

if (hasWebGL && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  const scene = new PortfolioScene(canvas);
  scene.start();

  const brandCanvas = document.querySelector<HTMLCanvasElement>("#brand-core");
  let brandCore: BrandCore | null = null;
  if (brandCanvas) {
    brandCore = new BrandCore(brandCanvas);
  }

  window.addEventListener("beforeunload", () => {
    scene.dispose();
    brandCore?.dispose();
  }, { once: true });
} else {
  document.documentElement.classList.add("no-webgl");
}
