import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'
import testVertexGLSL from './shader/test/vertex.glsl'
import testFragGLSL from './shader/test/frament.glsl'
import lineVertexGLSL from './shader/test/lineVertex.glsl'
import lineFragGLSL from './shader/test/lineFrament.glsl'


/**
 * Base
 */
// Debug
const gui = new GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()

const texture = textureLoader.load('/textures/flag-china.png')

const lineTexture = textureLoader.load('/textures/line.jpg')

const floorTex=textureLoader.load('/textures/floor/armani-marble_albedo.png')
const floortNomalTex=textureLoader.load('/textures/floor/armani-marble_normal-ogl.png')
const floortRoughnessTex=textureLoader.load('/textures/floor/armani-marble_roughness.png')
const floortMetallicTex=textureLoader.load('/textures/floor/armani-marble_metallic.png')

const floorMat=new THREE.MeshStandardMaterial({
    map:floorTex,
    normalMap:floortNomalTex,
    roughnessMap:floortRoughnessTex,
    metalnessMap:floortMetallicTex,
    color:0x1e0000
})

/**
 * Test mesh
 */
// Geometry
const geometry = new THREE.PlaneGeometry(15, 10, 128, 128)

const lineGeometry = new THREE.PlaneGeometry(0.2, 62, 32, 128)

//旗杆
const flagpoleGeometry = new THREE.CylinderGeometry(0.5, 0.5, 60,128);

// Material
const material = new THREE.RawShaderMaterial(
    {

        vertexShader: testVertexGLSL,
        fragmentShader: testFragGLSL,
        // wireframe:true ,
        side: THREE.DoubleSide,
        uniforms: {
            uFrequency: {
                value: new THREE.Vector2(0.5,1)
            },
            uTime: {
                value: 0.0
            },
            uTexture: {
                value: texture
            }
        }
    }
)

const lineMaterial = new THREE.RawShaderMaterial(
    {

        vertexShader: lineVertexGLSL,
        fragmentShader: lineFragGLSL,
        // wireframe:true ,
        side: THREE.DoubleSide,
        uniforms: {
            uFrequency: {
                value: new THREE.Vector2(0.5, 1)
            },
            uTime: {
                value: 0.0
            },
            uTexture: {
                value: lineTexture
            }
        }
    }
)



// Mesh
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)


const lineMesh = new THREE.Mesh(lineGeometry, lineMaterial)

lineMesh.position.x = -7.5
lineMesh.position.y = -24.5

scene.add(lineMesh)


//旗杆
const cylinder = new THREE.Mesh(flagpoleGeometry, new THREE.MeshBasicMaterial({ color: 0xffffff }));
cylinder.position.y = -24;
cylinder.position.x=-8.1
scene.add(cylinder);


//顶部球
const sphereGeometry = new THREE.SphereGeometry( 1.2, 32, 16 ); 
const sphereMaterial = new THREE.MeshBasicMaterial( { color: 0xffffff } ); 
const sphere = new THREE.Mesh( sphereGeometry, sphereMaterial ); 
sphere.position.x=-8.1
sphere.position.y=6.4
scene.add( sphere );

//台
const cubeGeometry = new THREE.BoxGeometry( 15, 4, 10 );

const cube = new THREE.Mesh( cubeGeometry, floorMat ); 
cube.position.x=-8.1
cube.position.y=-54
scene.add( cube );


//添加控制
gui.add(material.uniforms.uFrequency.value, 'x').min(0).max(10).step(0.01).name('frequencyX')
gui.add(material.uniforms.uFrequency.value, 'y').min(0).max(10).step(0.01).name('frequencyY')

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () => {
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 200)
camera.position.set(0, -70, 100)

scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    antialias: true, // 启用抗锯齿（默认是 false）
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))


//light

const light = new THREE.AmbientLight(0xffffff, 3);
scene.add(light);


/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () => {
    const elapsedTime = clock.getElapsedTime()


    if (material) {
        material.uniforms.uTime.value = elapsedTime
        lineMaterial.uniforms.uTime.value = elapsedTime
    }

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()