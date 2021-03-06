import * as BABYLON from '@babylonjs/core/Legacy/legacy';
import "@babylonjs/loaders/glTF";
import { TerrainMaterial } from '@babylonjs/materials/terrain';

export class App {
    private _canvas: HTMLCanvasElement;
    private _engine: BABYLON.Engine;
    private _scene: BABYLON.Scene;
    private _camera: BABYLON.UniversalCamera;
    private _light: BABYLON.Light;

    constructor(canvasElement: string) {
        this._canvas = document.getElementById(canvasElement) as HTMLCanvasElement;
        this._engine = new BABYLON.Engine(this._canvas, true);
        this._scene = new BABYLON.Scene(this._engine);
        this._camera = new BABYLON.UniversalCamera('UniversalCamera', new BABYLON.Vector3(10, 0, -250), this._scene);
        this._light = new BABYLON.HemisphericLight('HemisphericLight', new BABYLON.Vector3(1, 1, 0), this._scene);
    }

    run() {
        this._canvas.width = window.innerWidth;
        this._canvas.height = window.innerHeight;
        this.createScene();
        this.doRender();
    }

    private createScene(): void {
        this._scene.clearColor = new BABYLON.Color4(0.92, 0.96, 0.97);

        this._camera.setTarget(new BABYLON.Vector3(0, 0, 0));
        this._camera.speed = 5;
        this._camera.attachControl(this._canvas, false);

        //new BABYLON.AxesViewer(this._scene, 5,1);

        const ground = BABYLON.MeshBuilder.CreateGround('ground', { width: 10000, height: 10000, subdivisions: 1 }, this._scene);
        ground.position = new BABYLON.Vector3(0, 0, 0);
        ground.renderingGroupId = 1

        var terrainMaterial = new TerrainMaterial("terrainMaterial", this._scene);
        terrainMaterial.specularColor = new BABYLON.Color3(0.5, 0.5, 0.5);
        terrainMaterial.specularPower = 64;
        terrainMaterial.mixTexture = new BABYLON.Texture('https://raw.githubusercontent.com/yashendra-gupta/public/master/assets/3d/envs/terrains/green-ground-with-pathways/stencil.png', this._scene);
        terrainMaterial.diffuseTexture1 = new BABYLON.Texture('https://raw.githubusercontent.com/yashendra-gupta/public/master/assets/3d/envs/terrains/green-ground-with-pathways/grass.png', this._scene);
        terrainMaterial.diffuseTexture2 = new BABYLON.Texture('https://raw.githubusercontent.com/yashendra-gupta/public/master/assets/3d/envs/terrains/green-ground-with-pathways/pathway-sand.png', this._scene);
        terrainMaterial.diffuseTexture3 = new BABYLON.Texture('https://raw.githubusercontent.com/yashendra-gupta/public/master/assets/3d/envs/terrains/green-ground-with-pathways/grass-pathway-sand-overlap.png', this._scene);
        terrainMaterial.diffuseTexture1.uScale = terrainMaterial.diffuseTexture1.vScale = 10;
        terrainMaterial.diffuseTexture2.uScale = terrainMaterial.diffuseTexture2.vScale = 10;
        terrainMaterial.diffuseTexture3.uScale = terrainMaterial.diffuseTexture3.vScale = 10;

        ground.material = terrainMaterial;

        BABYLON.SceneLoader.ImportMeshAsync('', 'https://raw.githubusercontent.com/yashendra-gupta/public/master/assets/3d/models/low-poly/character/basic/', 'basic-animated.glb').then((character) => {
            character.meshes.forEach((mesh) => mesh.renderingGroupId = 1);
            const roll = 0;
            const yaw = 0;
            const pitch = 0;
            character.meshes[0].rotate(BABYLON.Axis.Y, roll, BABYLON.Space.LOCAL);
            character.meshes[0].rotate(BABYLON.Axis.X, pitch, BABYLON.Space.LOCAL);
            character.meshes[0].rotate(BABYLON.Axis.Z, roll, BABYLON.Space.LOCAL);
            character.meshes[0].rotation = new BABYLON.Vector3(pitch, yaw, roll);
        });

        var skybox = BABYLON.Mesh.CreateBox("skyBox", 100, this._scene);
        skybox.position = new BABYLON.Vector3(0, 49, 0);
        var skyboxMaterial = new BABYLON.StandardMaterial("skyBox", this._scene);
        skyboxMaterial.backFaceCulling = false;
        skyboxMaterial.disableLighting = true;
        skybox.material = skyboxMaterial;
        skybox.infiniteDistance = true;
        skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture('https://raw.githubusercontent.com/yashendra-gupta/public/master/assets/3d/envs/skyboxes/green-mountains/', this._scene);
        skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
        skybox.renderingGroupId = 0;
    }

    private doRender(): void {
        this._engine.runRenderLoop(() => {
            this._scene.render();

            if (this._camera.position.y < 10) this._camera.position.y = 10;
            if (this._camera.position.y > 100) this._camera.position.y = 100;
            if (this._camera.position.x > 550) this._camera.position.x = 550;
            if (this._camera.position.x < -550) this._camera.position.x = -550;
            if (this._camera.position.z > 550) this._camera.position.z = 550;
            if (this._camera.position.z < -550) this._camera.position.z = -550;

        });

        window.addEventListener('resize', () => {
            this._canvas.width = window.innerWidth;
            this._canvas.height = window.innerHeight;
            this._engine.resize();
        });
    }
}