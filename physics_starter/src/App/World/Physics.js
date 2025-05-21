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
        if (type === "dynamic") {
            rigidBodyType = this.rapier.RigidBodyDesc.dynamic();
        }
        else
            rigidBodyType = this.rapier.RigidBodyDesc.fixed();

        const rigidBody = this.world.createRigidBody(rigidBodyType);

        //设置碰撞盒子
        let colliderType;
        switch (colliderTypeName) {
            case "cuboid":
                const size = this.computeCuboidDimensions(mesh)
                colliderType = this.rapier.ColliderDesc.cuboid(
                    size.x / 2,
                    size.y / 2,
                    size.z / 2
                );
                break;
            case "ball":
                const radius = this.computeBallDimensions(mesh)
                colliderType = this.rapier.ColliderDesc.ball(radius);
                break;
            case "trimesh":
                const { vertices, indices } = this.computeTrimeshDimensions(mesh)
                colliderType = this.rapier.ColliderDesc.trimesh(
                    vertices,
                    indices
                )
                break;
        }

        //创建碰撞器
        this.world.createCollider(colliderType, rigidBody);

        //设置世界位置
        const worldPosition = mesh.getWorldPosition(new THREE.Vector3())
        const worldRotation = mesh.getWorldQuaternion(new THREE.Quaternion())

        rigidBody.setTranslation(worldPosition, true)
        rigidBody.setRotation(worldRotation, true)

        this.meshMap.set(mesh, rigidBody);
    }

    /*
     * 计算mesh的Box碰撞盒子大小
     * @param {THREE.Mesh} mesh
     * @return {THREE.Vector3}
     */
    computeCuboidDimensions(mesh) {
        //计算mesh的包围盒
        mesh.geometry.computeBoundingBox()
        const box = mesh.geometry.boundingBox
        const size = new THREE.Vector3()
        box.getSize(size)
        //获取全局缩放
        const worldScale = mesh.getWorldScale(new THREE.Vector3())
        size.multiply(worldScale)
        return size
    }

    /*
     *计算mesh的包络球半径
    */
    computeBallDimensions(mesh) {
        //计算mehs的包围球
        mesh.geometry.computeBoundingSphere()
        const sphere = mesh.geometry.boundingSphere
        const radius = sphere.radius
        //获取全局缩放
        const worldScale = mesh.getWorldScale(new THREE.Vector3())
        const scaledRadius = radius * Math.max(worldScale.x, worldScale.y, worldScale.z)
        return scaledRadius
    }

    /*
    * 计算复杂体的trimesh
    */
    computeTrimeshDimensions(mesh) {
        //获取mesh的顶点数据
        const vertices = mesh.geometry.attributes.position.array;
        //获取索引
        const indices = mesh.geometry.index.array;

        //获取绝对缩放
        const worldScale = mesh.getWorldScale(new THREE.Vector3())

        //缩放顶点数据
        const scaleVertices = vertices.map((vertex, index) => {
            return vertex * worldScale.getComponent(index % 3)
        })

        return {
            vertices: scaleVertices,
            indices: indices
        }
    }


    loop() {
        if (!this.rapierLoaded) return
        //更新物理世界
        this.world.step()

        this.meshMap.forEach((rigidBody, mesh) => {

            //获取刚体的位置和旋转
            const position = new THREE.Vector3().copy(rigidBody.translation());
            const rotation =new THREE.Quaternion().copy(rigidBody.rotation());

            //将父节点的平移矩阵逆转
            position.applyMatrix4(mesh.parent.matrixWorld.clone().invert());

            //将父节点的旋转矩阵逆转
            const inverseParentMatrix = new THREE.Matrix4().extractRotation(mesh.parent.matrixWorld).invert();
            
            const inverseParentRoation=new THREE.Quaternion().setFromRotationMatrix(inverseParentMatrix)
            rotation.premultiply(inverseParentRoation)

            //将刚体的位置和旋转应用到mesh
            mesh.position.set(position.x, position.y, position.z)
            mesh.quaternion.set(rotation.x, rotation.y, rotation.z, rotation.w)

        })

    }
}