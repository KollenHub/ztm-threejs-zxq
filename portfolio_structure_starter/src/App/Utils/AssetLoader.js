import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
import assetStore from "./AssetStore.js"

export default class AssetLoader {

    constructor() {
        this.assetStore = assetStore.getState();

        this.assetsToLoad = this.assetStore.assetsToLoad;
        this.addLoadedAsset = this.assetStore.addLoadedAsset;

        this.instantiateLoaders();
        this.startLoading();

        console.log(this.assetStore.loadedAsset);

    }

    instantiateLoaders() {
        const dracoLoader = new DRACOLoader();
        dracoLoader.setDecoderPath("/draco/");
        this.gltfLoader = new GLTFLoader();
        this.gltfLoader.setDRACOLoader(dracoLoader);
        this.textureLoader = new THREE.TextureLoader();
    }

    startLoading() {
        this.assetsToLoad.forEach((asset) => {
            if (asset.type === "texture") {
                this.textureLoader.load(asset.path, (texture) => {
                    this.addLoadedAsset(texture, asset.id);
                }
                );
            }
        });
    }
}

