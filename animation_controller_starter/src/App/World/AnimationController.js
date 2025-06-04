import * as THREE from 'three';

import App from '../App';
import { inputStore } from '../Utils/Store';

export default class AnimationController {
    constructor() {
        this.app = new App();
        this.scene = this.app.scene;
        this.avatar = this.app.world.character.avatar;

        //监控输入
        inputStore.subscribe((input) => {
            this.OnInput(input);
        });

        //初始化动画
        this.instaniateAnimations();
    }

    instaniateAnimations() {
        this.mixer = new THREE.AnimationMixer(this.avatar.scene);

        this.animations = new Map();

        this.avatar.animations.forEach((clip) => {
            const action = this.mixer.clipAction(clip);
            this.animations.set(clip.name, action);
        })

        this.currentAnimation = this.animations.get('idle');
        this.currentAnimation.play();

    }

    playAnimation(name) {
        if (this.currentAnimation === this.animations.get(name)) return;
        const newAnimation = this.animations.get(name);
        newAnimation.reset()
        newAnimation.play()
        newAnimation.crossFadeFrom(this.currentAnimation, 0.2);
        this.currentAnimation = newAnimation;
    }

    OnInput(input) {

        if (input.forward ||
            input.backward ||
            input.left ||
            input.right
        ) {

            this.playAnimation('run');
        } else {
            this.playAnimation('idle');
        }
    }

    loop(delta) {
        this.mixer.update(delta);
    }
}