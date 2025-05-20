import * as THREE from 'three'

import App from '../App.js'
import Physics from './Physics.js'
import Environment from './Environment.js'
import { appStateStore } from '../Utils/Store.js'

export default class World {
    constructor() {
        this.app = new App()
        this.scene = this.app.scene

        // create world classes
        this.physics = new Physics()

        appStateStore.subscribe((state) => {
            if (state.pyhicsReady) {
                console.log("physics ready")
                this.environment = new Environment()
            }
        })
        this.loop()
    }



    loop(deltaTime, elapsedTime) {
        this.physics.loop()
    }
}