import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { Pane } from "tweakpane";
import { TextureLoader } from "three";

// initialize pane
const pane = new Pane();

// initialize the scene
const scene = new THREE.Scene();

//添加纹理
const texLoader = new TextureLoader()
const sunTexture = texLoader.load('/textures/2k_sun.jpg')
const earthTexture = texLoader.load('/textures/2k_earth_daymap.jpg')
const marsTexture = texLoader.load('/textures/2k_mars.jpg')
const mercuryTexture = texLoader.load('/textures/2k_mercury.jpg')
const moonTexture = texLoader.load('/textures/2k_moon.jpg')
const venusTexture = texLoader.load('/textures/2k_venus_surface.jpg')

const cubeTextureLoader = new THREE.CubeTextureLoader()
cubeTextureLoader.setPath('/textures/cubeMap/')
const spaceTexture = cubeTextureLoader.load([
  'px.png',
  'nx.png',
  'py.png',
  'ny.png',
  'pz.png',
  'nz.png',
]);
scene.background = spaceTexture;
console.log(spaceTexture);
//基础几何
const sphereGeometry = new THREE.SphereGeometry(1, 30, 30)

//材质
const sunMaterial = new THREE.MeshBasicMaterial({ map: sunTexture });

const earthMaterial = new THREE.MeshStandardMaterial({ map: earthTexture });
const marsMaterial = new THREE.MeshStandardMaterial({ map: marsTexture });
const mercuryMaterial = new THREE.MeshStandardMaterial({ map: mercuryTexture });
const moonMaterial = new THREE.MeshStandardMaterial({ map: moonTexture });
const venusMaterial = new THREE.MeshStandardMaterial({ map: venusTexture });

//创建太阳
const sun = new THREE.Mesh(sphereGeometry, sunMaterial)
scene.add(sun)
sun.scale.setScalar(5)

//行星数据
const planets = [
  {
    name: "Mercury",
    radius: 0.5,
    distance: 10,
    speed: 0.01,
    material: mercuryMaterial,
    moons: [],
  },
  {
    name: "Venus",
    radius: 0.8,
    distance: 15,
    speed: 0.007,
    material: venusMaterial,
    moons: [],
  },
  {
    name: "Earth",
    radius: 1,
    distance: 20,
    speed: 0.005,
    material: earthMaterial,
    moons: [
      {
        name: "Moon",
        radius: 0.3,
        distance: 3,
        speed: 0.015,
      },
    ],
  },
  {
    name: "Mars",
    radius: 0.7,
    distance: 25,
    speed: 0.003,
    material: marsMaterial,
    moons: [
      {
        name: "Phobos",
        radius: 0.1,
        distance: 2,
        speed: 0.02,
      },
      {
        name: "Deimos",
        radius: 0.2,
        distance: 3,
        speed: 0.015,
        color: 0xffffff,
      },
    ],
  },
];

const CreatePlanet = (planet) => {
  const planetMesh = new THREE.Mesh(sphereGeometry, planet.material)
  planetMesh.scale.setScalar(planet.radius*1.5)
  planetMesh.position.x = planet.distance
  scene.add(planetMesh)
  return planetMesh;
}

const CreateMoon = (moon) => {
  const moonMesh = new THREE.Mesh(sphereGeometry, moonMaterial)
  moonMesh.scale.setScalar(moon.radius)
  moonMesh.position.x = moon.distance
  return moonMesh;
}

const planetArray = planets.map((planet) => {

  console.log(planet);
  const planetMesh = CreatePlanet(planet);
  planet.moons.forEach((moon) => {
    const moonMesh = CreateMoon(moon);
    planetMesh.add(moonMesh)
  })
  return planetMesh

});

//添加灯光(MeshStandardMaterial需要灯光)
const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
scene.add(ambientLight);

//添加点光源
const pointLight = new THREE.PointLight(0xffffff, 1000);
scene.add(pointLight);

//添加帮助类
// const pointlightHelper = new THREE.PointLightHelper(pointLight, 10);
// scene.add(pointlightHelper);

// initialize the camera
const camera = new THREE.PerspectiveCamera(
  35,
  window.innerWidth / window.innerHeight,
  0.1,
  400
);
camera.position.z = 100;
camera.position.y = 5;

// initialize the renderer
const canvas = document.querySelector("canvas.threejs");
const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// add controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.maxDistance = 200;
controls.minDistance = 20

// add resize listener
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// render loop
const renderloop = () => {

  planetArray.forEach((planet, index) => {
    planet.rotation.y += planets[index].speed;
    planet.position.x = Math.sin(planet.rotation.y)*planets[index].distance;
    planet.position.z = Math.cos(planet.rotation.y)*planets[index].distance;
    planet.children.forEach((moon, moonIndex) => {
      moon.rotation.y += planets[index].moons[moonIndex].speed;
      moon.position.x = Math.sin(moon.rotation.y)*planets[index].moons[moonIndex].distance;
      moon.position.z = Math.cos(moon.rotation.y)*planets[index].moons[moonIndex].distance;
    })

  })

  controls.update();
  renderer.render(scene, camera);
  window.requestAnimationFrame(renderloop);
};


renderloop();
