import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import GUI from "lil-gui";
import { TextureLoader } from "three";
import vertexShader from "./shaders/vertex.glsl";
import fragmentShader from "./shaders/fragment.glsl";

// initialize pane
const pane = new GUI();

// initialize the scene
const scene = new THREE.Scene();

//添加纹理
const texLoader = new TextureLoader()
const sunTexture = texLoader.load('/textures/2.png')

const material= new THREE.ShaderMaterial({
    vertexShader: vertexShader,
    fragmentShader: fragmentShader,
    side: THREE.DoubleSide,
    uniforms: {
      "uTex": {
        value: sunTexture,
      },
      "uInterval": {
        value:0.1
      },
      "uLineWidth":{
        value:0.5
      }
    },
  })

const plane=new THREE.Mesh(
  new THREE.PlaneGeometry(1920, 1080),
  material
);
scene.add(plane);

//添加灯光(MeshStandardMaterial需要灯光)
const ambientLight = new THREE.AmbientLight(0xffffff, 1.0);
scene.add(ambientLight);

pane.add(material.uniforms.uLineWidth, 'value').min(0.1).max(10).step(0.1).name('lineWidth').onChange(()=>{
  material.needsUpdate = true;
})

//添加点光源
// const pointLight = new THREE.PointLight(0xffffff, 1000);
// scene.add(pointLight);

//添加帮助类
// const pointlightHelper = new THREE.PointLightHelper(pointLight, 10);
// scene.add(pointlightHelper);

// initialize the camera
const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.1,
  10000
);
camera.position.z = 2000;
camera.position.y = 5;

// initialize the renderer
const canvas = document.querySelector("canvas.threejs");
const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// add controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.maxDistance = 5000;
controls.minDistance = 20

// add resize listener
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// render loop
const renderloop = () => {

  controls.update();
  renderer.render(scene, camera);
  window.requestAnimationFrame(renderloop);
};


renderloop();
