import * as THREE from "three";
import App from "./App.js";
import { sizesStore } from "./Utils/Store.js";
export default class Renderer {
    constructor() {
        this.app=new App();
        this.camera = this.app.camera;
        this.canvas = this.app.canvas;
        this.scene = this.app.scene;

        this.store=sizesStore;
        this.storeState=this.store.getState();
        this.setInst();
        this.setResizeListener();
    }

    setInst() {
        this.inst= new THREE.WebGLRenderer({ canvas: this.canvas, antialias: true });
        this.inst.setSize(this.storeState.width, this.storeState.height);
        this.inst.setPixelRatio(this.storeState.pixelRatio);
    }

    setResizeListener() {
        this.store.subscribe((state) => {
            this.inst.setSize(state.width, state.height);
            this.inst.setPixelRatio(state.pixelRatio);
        })
    }

    loop(){
        // console.log("renderer loop");
        this.inst.render(this.scene, this.camera.inst);
    }
}