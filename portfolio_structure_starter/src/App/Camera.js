import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import * as THREE from "three";
import App from './App.js';
import { sizesStore } from './Utils/Store.js';
export default class Camera {
    constructor() {
        this.app=new App();
        this.canvas = this.app.canvas;
        this.store=sizesStore;
        this.storeState=this.store.getState();
        this.setInst()
        this.setControls()
        this.setResizeListener();
    }

    setInst() {
        this.inst = new THREE.PerspectiveCamera(
            45,
            this.storeState.width / this.storeState.height,
            0.1,
            400
        );
        this.inst.position.z = 100;
        this.inst.position.y = 5;
    }

    setResizeListener() {
        this.store.subscribe((state) => {
            //更新相机
            this.inst.aspect = state.width / state.height;
            this.inst.updateProjectionMatrix();
        })
    }

    setControls() {
        this.controls = new OrbitControls(this.inst, this.canvas);
        this.controls.enableDamping = true;
        this.controls.maxDistance = 200;
        this.controls.minDistance = 20
    }

    loop() {
        // console.log("camera loop");
        this.controls.update();
    }
}