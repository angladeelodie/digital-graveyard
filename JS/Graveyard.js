import * as THREE from 'three';
import {
    GLTFLoader
} from 'three/examples/jsm/loaders/GLTFLoader'
import {
    TrackballControls
} from 'three/examples/jsm/controls/TrackballControls.js';
import {
    models as modelPaths,
    modelFolder,
    // getTexturePaths
} from './paths.js'
// import mainBus from './MyEventEmitter';
// import current from "./currentStates";
import Grave from './Grave.js'

export class Graveyard {
    constructor({
        container
    }) {
        this.container = container;
        this.scene = new THREE.Scene();
        this.camera;
        this.renderer = new THREE.WebGLRenderer();
        this.loader = new GLTFLoader();
        this.controls;
        this.clock = new THREE.Clock();


        console.log(this.controls)

        this.graves = [];
        this.textures = [];
        this.models = {}; // {name: gltfmodel}

        // this.modelPaths = modelPaths;
        // this.modelFolder = modelFolder;
        // this.getTexturePaths = getTexturePaths;
        // this.current = current;

        this.camPos = {
            x: 0,
            y: 0,
            z: 100
        }
        this.camAngle = {
            x: 0,
            y: 0,
            z: 0
        }

        this.init();
    }

    async init() {
        this.models = await this.loadModels(modelPaths, modelFolder);
        console.log(this.models);
        console.log("new scene")

        this.initThreeScene();
        this.container.width = this.container.clientWidth;
        this.container.height = this.container.clientHeight;
        // this.renderer.setClearColor(0xff00000, 0);
        this.container.appendChild(this.renderer.domElement);
        this.controls = new TrackballControls(this.camera, this.renderer.domElement);
        this.animate();


    }

    loadModels(paths, folder) {
        const loadedModels = {}
        return new Promise((resolve, reject) => {
            const manager = new THREE.LoadingManager();

            manager.onLoad = () => {
                // console.log('Loading complete!');
                resolve(loadedModels)
            };

            manager.onError = (url) => {
                console.log(`There was an error loading ${url}`);
            };

            const loader = new GLTFLoader(manager);
            loader.setPath(folder);

            Object.entries(paths).forEach(([key, path]) => {

                loader.load(path, (object) => {

                    const scaleFactor = 10
                    const model = object.scene;
                    const [firstChild] = model.children // destructuring

                    model.scale.set(scaleFactor, scaleFactor, scaleFactor);
                    model.castShadow = true;
                    model.receiveShadow = true;

                    loadedModels[key] = model

                }, undefined, (e) => {
                    console.error(e);
                });
            })

        })
    }

    initThreeScene() {
        const {
            clientHeight,
            clientWidth
        } = this.container

        this.camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 1, 100000, 100000);
        this.camera.position.set(this.camPos.x, this.camPos.y, this.camPos.z);
        this.camera.rotation.set(this.camAngle.x, this.camAngle.y, this.camAngle.z);

        this.camera.aspect = clientWidth / clientHeight;
        this.camera.updateProjectionMatrix();

        this.renderer.setSize(clientWidth, clientHeight);

        let directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
        directionalLight.position.set(6, 18, 9)
        this.scene.add(directionalLight);

        let ambientLight = new THREE.AmbientLight(0x222222, 4);
        this.scene.add(ambientLight);

        let spotLight = new THREE.SpotLight(0xffffff, 0.5);
        spotLight.position.set(10, 7, 10)
        this.scene.add(spotLight);

        // this.scene.background = new THREE.Color(0xffffff);
        this.initCustomGrave();

    }

    initCustomGrave() {
        let position = {
            x: 0,
            y: 0,
            z: 0
        }
        console.log(this.models)
        let selectedModel = Object.values(this.models)[0]
        console.log(selectedModel)
        const grave = new Grave({
            position,
            model: selectedModel,
            scale: 1,
            id: 0,
        })
        this.graves.push(grave)
        this.scene.add(grave.model);
        console.log(this.scene)


        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const material = new THREE.MeshBasicMaterial({
            color: 0x00ff00
        });
        const cube = new THREE.Mesh(geometry, material);
        this.scene.add(cube);

    }

    async animate() {
        const deltaTime = this.clock.getDelta();

        this.controls.update(deltaTime);
        requestAnimationFrame(this.animate.bind(this));
        this.renderer.render(this.scene, this.camera);
    }


}