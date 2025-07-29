import * as THREE from 'three'
import GUI from 'lil-gui'
import gsap from 'gsap'

/**
 * Debug
 */
const gui = new GUI()

const parameters = {
    materialColor: '#ffeded'
}

gui
    .addColor(parameters, 'materialColor')
    .onChange(() => {
        material.color.set(parameters.materialColor)
        particalMaterial.color.set(parameters.materialColor)
    })
/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()


/*
 对象
*/

//纹理,段落式纹理
const textureLoader = new THREE.TextureLoader()
const gradientTexture = textureLoader.load('textures/gradients/3.jpg')
//取最近一个像素的值，不做线性插值
gradientTexture.magFilter = THREE.NearestFilter


//材质
const material = new THREE.MeshToonMaterial({
    color: parameters.materialColor,
    //梯度贴图
    gradientMap: gradientTexture,
    roughness: 0.4,
})

//对象
const mesh1 = new THREE.Mesh(
    new THREE.TorusGeometry(1, 0.4, 16, 60),
    material
)

const mesh2 = new THREE.Mesh(
    new THREE.BoxGeometry(1.5, 1.5,1.5),
    material
)

const mesh3 = new THREE.Mesh(
    new THREE.TorusKnotGeometry(0.8, 0.3, 100, 16),
    material
)


//设置移动距离
mesh1.position.x = 2;
mesh2.position.x = -2;
mesh3.position.x = 2;


const objectsDistance = 4;

//设置移动高度
mesh1.position.y = -objectsDistance * 0;
mesh2.position.y = -objectsDistance * 1;
mesh3.position.y = -objectsDistance * 2;

scene.add(mesh1, mesh2, mesh3)
const sectionMeshes = [mesh1, mesh2, mesh3]

// 灯光

const light = new THREE.DirectionalLight(0xffffff, 1)
light.position.set(1, 1, 0)
scene.add(light)



/*
* 粒子
*/

const particalCount = 200;
const postiions = new Float32Array(particalCount * 3)

for (let i = 0; i < particalCount; i++) {
    postiions[i * 3 + 0] = (Math.random() - 0.5) * 10
    postiions[i * 3 + 1] = objectsDistance * 0.5 - Math.random() * objectsDistance * sectionMeshes.length
    postiions[i * 3 + 2] = (Math.random() - 0.5) * 10
}

const particalGeometry = new THREE.BufferGeometry()
particalGeometry.setAttribute('position', new THREE.BufferAttribute(postiions, 3))

const particalMaterial = new THREE.PointsMaterial({
    size: 0.03,
    sizeAttenuation: true,
    //颜色
    color: parameters.materialColor
})

//points
const particals = new THREE.Points(particalGeometry, particalMaterial)
scene.add(particals)



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
const camera = new THREE.PerspectiveCamera(35, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 6

//增加鼠标指针滑动左右上下动的时候移动
let cameraGroup = new THREE.Group()
scene.add(cameraGroup)
cameraGroup.add(camera)
// scene.add(camera)

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/*
* 滚动
*/

let scrollY = window.scrollY
let currentSection = 0;

window.addEventListener('scroll', () => {

    scrollY = window.scrollY

    const newSection = Math.round(scrollY / sizes.height)

    //做一个动画有鼠标旋转的效果
    if (currentSection !== newSection) {
        currentSection = newSection

        gsap.to(sectionMeshes[currentSection].rotation, {
            duration: 1.5,
            ease: 'power2.inOut',
            x: '+=6',
            y: '+=3',
            z: '+=1.5'
        })
    }


})



/**
 * Cursor
 */
const cursor = {}
cursor.x = 0
cursor.y = 0

window.addEventListener('mousemove', (event) => {
    //将鼠标移动，格式化为-0.5 ~ 0.5
    cursor.x = event.clientX / sizes.width - 0.5
    cursor.y = event.clientY / sizes.height - 0.5
})



/**
 * Animate
 */
const clock = new THREE.Clock()

//上一帧时间
let previousTime = 0

const tick = () => {
    const elapsedTime = clock.getElapsedTime()

    const deltaTime = elapsedTime - previousTime
    previousTime = elapsedTime

    //相机随着滚动切换位置
    camera.position.y = -scrollY / sizes.height * objectsDistance


    const parallaxX = cursor.x * 0.5;
    const parallaxY = cursor.y * 0.5;

    //类似于lerp
    cameraGroup.position.x += (parallaxX - cameraGroup.position.x) * deltaTime * 5;
    cameraGroup.position.y += (parallaxY - cameraGroup.position.y) * deltaTime * 5;


    //mesh旋转
    for (const mesh of sectionMeshes) {
        mesh.rotation.y += deltaTime * 0.1
        mesh.rotation.x += deltaTime * 0.12
    }


    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()