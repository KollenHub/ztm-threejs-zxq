import * as THREE from 'three'
import App from '../App.js'
import { appStateStore } from '../Utils/Store.js'

export default class Physics {
    constructor() {
        this.app = new App()
        this.scene = this.app.scene

        // setting the physics map
        this.meshMap = new Map();

        // setting the physics world
        import("@dimforge/rapier3d").then((RAPIER) => {
            const gravity = { x: 0, y: -9.81, z: 0 };
            this.world = new RAPIER.World(gravity);
            this.rapier = RAPIER;
            this.rapierLoaded = true;
            appStateStore.setState({ pyhicsReady: true })

        });
    }

    /*
     *添加mesh对应的物理刚体
     * @param {THREE.Mesh} mesh 
     * @param {string} type 物理类型 ("dynamic" or "static")
     * @param {string} coliderTypeName 碰撞器类型 ("cuboid","ball" or "trimesh")
    */
    add(mesh, type, colliderTypeName) {
        let rigidBodyType;
        if (type === "dynamic")
        {
            rigidBodyType = this.rapier.RigidBodyDesc.dynamic();
        }
        else
            rigidBodyType = this.rapier.RigidBodyDesc.fixed();

        const rigidBody = this.world.createRigidBody(rigidBodyType);
        rigidBody.setTranslation(mesh.position);
        rigidBody.setRotation(mesh.quaternion);

        //设置碰撞盒子
        let colliderType;
        switch (colliderTypeName) {
            case "cuboid":
                const size = this.compouteCuboidDimensions(mesh)
                colliderType = this.rapier.ColliderDesc.cuboid(
                    size.x / 2,
                    size.y / 2,
                    size.z / 2
                );
                break;
            case "ball":
                colliderType = this.rapier.ColliderDesc.ball(1);
                break;
            case "trimesh":
                colliderType = this.rapier.ColliderDesc.trimesh(
                    new Float32Array([0, 0, 0, 1])
                )
        }

        //创建碰撞器
        this.world.createCollider(colliderType, rigidBody);

        this.meshMap.set(mesh, rigidBody);
    }

    /*
     * 计算mesh的Box碰撞盒子大小
     * @param {THREE.Mesh} mesh
     * @return {THREE.Vector3}
     */
    compouteCuboidDimensions(mesh) {
        const box = new THREE.Box3().setFromObject(mesh)
        const size = new THREE.Vector3()
        box.getSize(size)
        //获取全局缩放
        const worldScale = mesh.getWorldScale(new THREE.Vector3())
        size.multiply(worldScale)
        return size
    }


    loop() {
        if (!this.rapierLoaded) return
        //更新物理世界
        this.world.step()

        this.meshMap.forEach((rigidBody, mesh) => {
             
            //获取刚体的位置和旋转
            const position = rigidBody.translation()
            const rotation = rigidBody.rotation()

            //将刚体的位置和旋转应用到mesh
            mesh.position.set(position.x, position.y, position.z)
            mesh.quaternion.set(rotation.x, rotation.y, rotation.z, rotation.w)

        })

    }
}