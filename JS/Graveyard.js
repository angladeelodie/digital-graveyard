import * as THREE from 'three';
import {
    GLTFLoader
} from 'three/examples/jsm/loaders/GLTFLoader'
import {
    OrbitControls
} from 'three/examples/jsm/controls/OrbitControls.js';
import {
    getTexturePaths
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
        container,
        id
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
        this.models = [
            "paul-rand",
            "pierre-keller",
            "anthony-wilson"
        ];
        this.id = id;

        // this.modelPaths = modelPaths;
        // this.modelFolder = modelFolder;
        // this.getTexturePaths = getTexturePaths;
        // this.current = current;

        if (this.id === 1) {
            this.camPos = {
                x: 0,
                y: 0,
                z: 500
            }
        } else if (this.id === 2) {
            this.camPos = {
                x: 0,
                y: 0,
                z: 1000
            }
        }

        this.camAngle = {
            x: 0,
            y: 0,
            z: 0
        }

        this.init();
    }

    async init() {
        let texturePaths = getTexturePaths();
        this.textures = await this.loadTextures(texturePaths);
        this.initThreeScene();
        this.container.width = this.container.clientWidth;
        this.container.height = this.container.clientHeight;
        this.renderer.setClearColor(0xff00000, 0);
        this.container.appendChild(this.renderer.domElement);
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enablePan = false;
        this.controls.autoRotate = true;
        this.controls.enableDamping = true;


        switch (this.id) {
            case 1:
                this.controls.enableZoom = false;
                this.controls.autoRotateSpeed = 3;
                break;
            case 2:
                this.controls.enableZoom = true;
                this.controls.autoRotateSpeed = 1.5;
                break;

        }


        this.animate();


    }

    async loadTextures(pathArray) {
        const textureLoader = new THREE.TextureLoader();
        const promises = pathArray.map(((path, index) => {
            return new Promise((resolve, reject) => {
                textureLoader.load(
                    path,
                    (texture) => {
                        // texture.encoding = THREE.sRGBEncoding;
                        resolve(texture)
                    },

                    undefined, reject);
            })
        }))
        return await Promise.all(promises)
    }


    initThreeScene() {
        const {
            clientHeight,
            clientWidth
        } = this.container

        this.camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 1, 100000, 100000);
        this.camera.position.set(this.camPos.x, this.camPos.y, this.camPos.z);
        this.camera.rotation.set(this.camAngle.x, this.camAngle.y, this.camAngle.z);
        this.camera.layers.enable(0);
        this.camera.layers.enable(1);
        this.camera.layers.enable(2);
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

        if (this.id === 1) {
            this.initCustomGrave();
        } else if (this.id === 2) {
            this.initAllGraves();
        }
    }

    async initAllGraves() {
        // générer les tombes à partir de la base de données
        for (let i = 0; i < database.graves.length; i++) {
            this.graves.push(new Grave({
                position: {
                    x: random(-400, 400),
                    y: random(-10, 10),
                    z: random(-400, 400)
                },
                modelName: random(this.models),
                birth: database.graves[i].age,
                isVisible: true,
                birthDate: database.graves[i].birthDate,
                deathDate: database.graves[i].deathDate,
                texture: random(this.textures),
                textures: this.textures,

                name: database.graves[i].name,
                surname: database.graves[i].surname,
                models: this.models,
                scene: this.scene,
            }))
            // this.scene.add(this.graves[i].booleMesh)

        }
        console.log(this.graves)

    }

    async initCustomGrave() {
        let position = {
            x: 0,
            y: 0,
            z: 0,
        }
        let selectedModel = this.models[0]
        this.currentGrave = new Grave({
            position,
            modelName: selectedModel,
            scale: {
                x: 0.5,
                y: 0.5,
                z: 0.5
            },
            texture: this.textures[0],
            textures: this.textures,
            isVisible: true,
            id: 0,
            // text: "firstname \nlastname",
            text: "firstname \nlastname",
            name: "John",
            surname: "Doe",
            birthDate: new Date("1950-04-02"),
            deathDate: new Date("2023-06-05"),
            models: this.models,
            scene: this.scene,
        });
        // this.currentGrave.model
        // this.currentGrave.hide();
        // this.graves.push(this.currentGrave)
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

    switchView(view) {
        if (view === "editing") {
            console.log("editing")
            for (let i = 0; i < this.graves.length; i++) {
                this.graves[i].hide();
            }

            this.currentGrave.show();
            this.currentGrave.engraving.show();
        }

        if (view === "exploring") {
            console.log("exploring")
            for (let i = 0; i < this.graves.length; i++) {
                this.graves[i].show();

            }
            this.currentGrave.hide();
            this.currentGrave.engraving.hide();

        }
    }

    pushToGraveyard() {
        this.currentGrave.position = {
            x: random(-400, 400),
            y: random(-400, 400),
            z: 0,
        }
        this.currentGrave.updatePosition();
        // this.currentGrave.isVisible = true;
        // this.currentGrave.show();
        console.log(this.currentGrave)
        this.graves.push(this.currentGrave);
        this.initCustomGrave();
        this.switchView("exploring")

        console.log(this.graves)
    }
}