import App from "../App.js";
import * as THREE from "three";
export default class World {
    constructor() {
        this.app = new App();
        this.scene = this.app.scene;
        this.setCube();
    }

    setCube() {
        const geometry = new THREE.BoxGeometry(10, 10, 10);
        const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
        this.cube = new THREE.Mesh(geometry, material);
        this.scene.add(this.cube);
    }

    loop() {
        this.cube.rotation.y += 0.01;
    }
}