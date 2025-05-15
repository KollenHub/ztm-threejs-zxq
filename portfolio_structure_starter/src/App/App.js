import * as THREE from "three";
import Camera from "./Camera.js";
import Renderer from "./Renderer.js";
import Loop from "./Utils/Loop.js";
import World from "./World/World.js";
import Resize from "./Utils/Resize.js";
import AssetLoader from "./Utils/AssetLoader.js";

let inst = null;
export default class App {
    constructor() {
        if (inst) {
            return inst;
        }
        inst = this;
        this.canvas = document.querySelector("canvas.threejs");
        this.scene = new THREE.Scene();

        //加载
        this.assetLoader = new AssetLoader();

        this.world = new World();

        //摄像机
        this.camera = new Camera();
        this.renderer = new Renderer();
        
        //循环队列
        this.loop = new Loop();
        this.resize=new Resize();
    }
}