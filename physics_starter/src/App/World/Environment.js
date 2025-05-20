import * as THREE from 'three';
import App from '../App.js';
import Physics from './Physics.js';

export default class Environment {
    constructor() {
        this.app = new App()
        this.scene = this.app.scene
        this.pyhics = this.app.world.physics

        this.loadEnvironment()
        this.addMesh()
    }

    loadEnvironment() {

        // lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, 1);
        this.scene.add(ambientLight);

        this.directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        this.directionalLight.position.set(1, 1, 1);
        this.directionalLight.castShadow = true;
        this.scene.add(this.directionalLight);
    }

    addMesh() {
        //创建一个立方体
        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const material = new THREE.MeshStandardMaterial({ color: 0xff0000 });
        const cube = new THREE.Mesh(geometry, material);
        cube.position.y = 10

        //将立方体添加到场景中
        this.scene.add(cube);
        this.pyhics.add(cube, "dynamic", "cuboid")

        //创建一个地板
        const groundGeometry = new THREE.BoxGeometry(10, 0.1, 10);
        const groundMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff });
        const ground = new THREE.Mesh(groundGeometry, groundMaterial);
        this.scene.add(ground);

        this.pyhics.add(ground, "fixed", "cuboid")

        console.log(this.scene)
    }

}