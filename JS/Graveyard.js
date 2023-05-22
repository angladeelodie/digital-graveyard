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
import {
    database
} from '/JS/database.js'
import {
    random
} from '/JS/utils'
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
        this.currentGrave;



        this.graves = [];
        this.engravings = [];
        this.textures = [];
        this.models = {}; // {name: gltfmodel}

        // this.modelPaths = modelPaths;
        // this.modelFolder = modelFolder;
        // this.getTexturePaths = getTexturePaths;
        // this.current = current;

        this.camPos = {
            x: 0,
            y: 0,
            z: 1000
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
        spotLight.position.set(100, 100, 10)
        this.scene.add(spotLight);

        // this.scene.background = new THREE.Color(0xffffff);
        this.initAllGraves();
        this.initCustomGrave();

    }

    async initAllGraves() {
        // générer les tombes à partir de la base de données
        for (let i = 0; i < database.graves.length; i++) {
            let selectedModel = random(this.models);
            this.graves.push(new Grave({
                position: {
                    x: database.graves[i].position.x,
                    y: database.graves[i].position.y,
                    z: database.graves[i].position.z
                },
                model: selectedModel,
                scale: {
                    x: 0.5,
                    y: 0.5,
                    z: 0.5
                },
                id: i,
                text: database.graves[i].text,
                models: this.models,
                scene: this.scene,
            }))
        }

    }

    async initCustomGrave() {
        let position = {
            x: 0,
            y: 0,
            z: 0,
        }
        let selectedModel = Object.values(this.models)[0]
        this.currentGrave = new Grave({
            position,
            model: selectedModel,
            scale: {x: 2, y: 2, z: 2},
            id: 0,
            text: "test",
            models: this.models,
            scene: this.scene,
        });
        this.graves.push(this.currentGrave)
    }

    async animate() {
        const deltaTime = this.clock.getDelta();

        this.controls.update(deltaTime);
        requestAnimationFrame(this.animate.bind(this));
        this.renderer.render(this.scene, this.camera);
    }


    onWindowResize() {
        const {
            clientHeight,
            clientWidth
        } = this.container

        this.camera.aspect = clientWidth / clientHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(clientWidth, clientHeight);
    }


}