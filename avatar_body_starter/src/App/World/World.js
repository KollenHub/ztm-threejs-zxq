import * as THREE from "three";

import App from "../App.js";
import Physics from "./Physics.js";
import Environment from "./Environment.js";
import Character from "./Character.js";
import CharacterController from "./CharacterController.js";
import AssetLoader from "../Utils/AssetLoader.js";

import { appStateStore } from "../Utils/Store.js";

export default class World {
  constructor() {
    this.app = new App();
    this.scene = this.app.scene;

    this.physics = new Physics();

    // create world classes
    appStateStore.subscribe((state) => {
      //物理引擎和资源加载完成后再创建世界
      if (state.physicsReady&&state.assetLoaded) {
        this.environment = new Environment();
        this.character = new Character();
        this.characterController = new CharacterController();
      }
    });

    this.loop();
  }

  loop(deltaTime, elapsedTime) {
    this.physics.loop();
    if(this.characterController) this.characterController.loop();
  }
}
