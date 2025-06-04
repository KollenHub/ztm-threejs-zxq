import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/Addons.js'
import { CubeTextureLoader } from 'three'
import { RGBELoader } from 'three/examples/jsm/Addons.js'
import GUI from 'lil-gui'

/**
 * Base
 */
// Debug
const gui = new GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()


// 方式一 加载天空盒 LDR Cube Texture
// const cubeTexLoader = new CubeTextureLoader()
// cubeTexLoader.setPath('/environmentMaps/0/')
// const texture = cubeTexLoader.load([
//     'px.png',
//     'nx.png',
//     'py.png',
//     'ny.png',
//     'pz.png',
//     'nz.png'
// ])
// scene.background = texture
// scene.environment = texture
// //调节整体光照
// scene.environmentIntensity = 1

// 方式二 加载高动态范围图片，比普通图片多了图像基照明，比较亮
// const hdrLoader = new RGBELoader()
// hdrLoader.load('/environmentMaps/0/2k.hdr', (texture) => {
//     //需要设置mapping为等距矩形反射贴图，不然是不识别的
//     texture.mapping = THREE.EquirectangularReflectionMapping
//     scene.background = texture
//     scene.environment  = texture
// })


// 方式三 动态实时环境贴图
//基础环境贴图
const textureLoader = new THREE.TextureLoader()
const environmentMap = textureLoader.load('/environmentMaps/blockadesLabsSkybox/interior_views_cozy_wood_cabin_with_cauldron_and_p.jpg')
environmentMap.mapping = THREE.EquirectangularReflectionMapping
environmentMap.colorSpace = THREE.SRGBColorSpace
scene.background = environmentMap


//添加环提供照明
const holyDonut = new THREE.Mesh(
    new THREE.TorusGeometry(8, 0.5),
    new THREE.MeshBasicMaterial({
        color: new THREE.Color(10, 10, 10)
    })
)

scene.add(holyDonut)
//TODO 启用图层，避免渲染目标捕获到其他东西
holyDonut.layers.enable(1)
holyDonut.position.y = 3.5
holyDonut.position.x = -2

//cube render target
const cubeRenderTarget = new THREE.WebGLCubeRenderTarget(256
    , {
        type: THREE.HalfFloatType
    }
)

scene.environment=cubeRenderTarget.texture

//立方体相机
const cubeCamera=new THREE.CubeCamera(0.1,100,cubeRenderTarget)
//TODO 设置相机所在图层，避免捕获到其他东西
cubeCamera.layers.set(1)


const setting = {
    globalIntensity: 1
}
gui.add(setting, 'globalIntensity', 0, 100, 1).onFinishChange(value => {
    UpdateIntensity()
})


const UpdateIntensity = () => {
    scene.traverse((child) => {
        if (child.isMesh && child.material instanceof THREE.MeshStandardMaterial) {
            child.material.envMapIntensity = setting.globalIntensity
        }
    })
}


//加载模型
const gltfLoader = new GLTFLoader()
gltfLoader.load('/models/FlightHelmet/glTF/FlightHelmet.gltf', (gltf) => {
    console.log('gltf loaded')
    const gltfScene = gltf.scene
    gltfScene.position.y = 2.5
    gltfScene.position.x = -4
    gltfScene.scale.setScalar(5)
    scene.add(gltf.scene)
})

/**
 * Torus Knot
 */
const torusKnot = new THREE.Mesh(
    new THREE.TorusKnotGeometry(1, 0.4, 100, 16),
    new THREE.MeshStandardMaterial(
        {
            metalness: 0.8,
            roughness: 0.1
        }
    )
)
torusKnot.position.y = 4
scene.add(torusKnot)

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
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.set(4, 5, 4)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.target.y = 3.5
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()
const tick = () => {
    // Time
    const elapsedTime = clock.getElapsedTime()


    if(holyDonut)
    {
        holyDonut.rotation.x = Math.sin(elapsedTime)*2

        //更新相机
        cubeCamera.update(renderer, scene)
    }


    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()