import * as THREE from 'three';
import App from '../App.js';
import Physics from './Physics.js';

export default class Environment {
    constructor() {
        this.app = new App()
        this.scene = this.app.scene
        this.pyhics = this.app.world.physics

        this.loadEnvironment()
        this.addMeshes()
    }

    loadEnvironment() {

        // lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, 1);
        this.scene.add(ambientLight);

        this.directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        this.directionalLight.position.set(1, 1, 1);
        this.directionalLight.castShadow = true;
        this.scene.add(this.directionalLight);

        //添加地板
        this.addGround()

        //初始化mesh选项
        this.initMeshOptions()

        setInterval(() => {
            
            this.addMeshes()

        }, 1000);
        
    }

    addGround() {
        //创建一个地板
        const groundGeometry = new THREE.BoxGeometry(100, 0.1, 100);
        const groundMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff });
        const ground = new THREE.Mesh(groundGeometry, groundMaterial);
        this.scene.add(ground);

        this.pyhics.add(ground, "fixed", "cuboid")
    }

    initMeshOptions() {
        this.colliderTypes=['cuboid','ball']    
        
        
        //创建基础几何
        const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
        const sphereGeometry = new THREE.SphereGeometry(1, 32, 32);
        const cylinderGeometry = new THREE.CylinderGeometry(1, 1, 1, 32);
        const coneGeometry = new THREE.ConeGeometry(1, 1, 32);
        const torusGeometry = new THREE.TorusGeometry(1, 0.4, 16, 100);
        const torusKnotGeometry = new THREE.TorusKnotGeometry(0.8, 0.35, 100, 16);
        const icosahedronGeometry = new THREE.IcosahedronGeometry(1, 0);
        const octahedronGeometry = new THREE.OctahedronGeometry(1, 0);
        const dodecahedronGeometry = new THREE.DodecahedronGeometry(1, 0);
        const tetrahedronGeometry = new THREE.TetrahedronGeometry(1, 0);
        const planeGeometry = new THREE.PlaneGeometry(1, 1, 32, 32);
        const ringGeometry = new THREE.RingGeometry(0.5, 1, 32);


        this.geometryTypes=[
            boxGeometry,
            sphereGeometry,
            cylinderGeometry,
            coneGeometry,
            torusGeometry,
            torusKnotGeometry,
            icosahedronGeometry,
            octahedronGeometry,
            dodecahedronGeometry,
            tetrahedronGeometry,
            planeGeometry,
            ringGeometry
        ]

        //创建基础材质
        const redMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000 });
        const greenMaterial = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
        const blueMaterial = new THREE.MeshStandardMaterial({ color: 0x0000ff });
        const yellowMaterial = new THREE.MeshStandardMaterial({ color: 0xffff00 });
        const cyanMaterial = new THREE.MeshStandardMaterial({ color: 0x00ffff });
        const magentaMaterial = new THREE.MeshStandardMaterial({ color: 0xff00ff });
        const whiteMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff });
        const blackMaterial = new THREE.MeshStandardMaterial({ color: 0x000000 });

        this.materials=[
            redMaterial,
            greenMaterial,
            blueMaterial,
            yellowMaterial,
            cyanMaterial,
            magentaMaterial,
            whiteMaterial,
            blackMaterial
        ]
    }
    

    addMeshes() {
        // 随机生成10个mesh
        for(let i=0;i<5;i++){
            // 随机选择几何体
            const geoIdx = Math.floor(Math.random() * this.geometryTypes.length);
            const geometry = this.geometryTypes[geoIdx];
            // 随机选择材质
            const matIdx = Math.floor(Math.random() * this.materials.length);
            const material = this.materials[matIdx];
            // 随机选择碰撞体类型
            const colIdx = Math.floor(Math.random() * this.colliderTypes.length);
            const colliderType = this.colliderTypes[colIdx];
            // 创建mesh
            const mesh = new THREE.Mesh(geometry, material);
            mesh.scale.setScalar(Math.random() * 2 + 0.5);

            // 随机位置
            mesh.position.set(
                (Math.random() - 0.5) * 8,
                Math.random() * 5 + 50,
                (Math.random() - 0.5) * 8
            );
            mesh.castShadow = true;
            mesh.receiveShadow = true;
            this.scene.add(mesh);
            // 添加物理
            this.pyhics.add(mesh, "dynamic", colliderType);
        }
    }
}