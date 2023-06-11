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
import TWEEN from '@tweenjs/tween.js'


export class Graveyard {
    constructor({
        container,
        id
    }) {
        this.container = container;
        this.scene = new THREE.Scene();
        this.camera;
        this.renderer = new THREE.WebGLRenderer({
            antialias: true
        });
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
        this.scene.fog = new THREE.FogExp2(0xa67854, 0.0005);





        this.id = id;

        // this.modelPaths = modelPaths;
        // this.modelFolder = modelFolder;
        // this.getTexturePaths = getTexturePaths;
        // this.current = current;

        if (this.id === 1) {
            this.camPos = {
                x: 0,
                y: 0,
                z: 400
            }
        } else if (this.id === 2) {
            this.camPos = {
                x: 0,
                y: 50,
                z: 800
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
        console.log(this.textures)
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
                this.controls.autoRotateSpeed = 2;
                break;
            case 2:
                this.controls.enableZoom = true;
                this.controls.autoRotateSpeed = .8;
                this.controls.minPolarAngle = Math.PI / 4; // Minimum angle (in radians)
                this.controls.maxPolarAngle = Math.PI / 2; // Maximum angle (in radians)
                this.controls.minDistance = -3000; // Minimum distance in units
                this.controls.maxDistance = 3000; // Maximum distance in units
                // this.controls.minAzimuthAngle = -Math.PI / 4; // Minimum angle (in radians)
                // this.controls.maxAzimuthAngle = Math.PI / 4; // Maximum angle (in radians)
                break;

        }

        // HERBE

        this.loader.load(
            '/models/grass.gltf',
            (gltf) => {
                const model = gltf.scene;

                // Modify position
                model.position.set(0, -350, 0);

                // Modify scale
                model.scale.set(2, 2, 2);

                model.traverse((child) => {
                    if (child.isMesh) {
                        // Check if the material is a MeshStandardMaterial
                        if (child.material.isMeshStandardMaterial) {
                            // Modify the reflectance properties
                            child.material.metalness = 0.5; // Adjust metalness value (0 to 1)
                            child.material.roughness = 2; // Adjust roughness value (0 to 1)
                            child.material.diffuseMap = "/imgs/Maps/grass_diffuse.jpg";
                            // child.material.displacementMap = "/imgs/Maps/grass_displacement.jpg";
                            child.material.diffuseMap = "/imgs/Maps/grass_diffuse.jpg";
                            // child.material.normalMap = "/imgs/Maps/grass_normal.jpg";
                            // child.material.specularMap = "/imgs/Maps/marble_specular.jpg";
                        }
                    }
                });

                this.scene.add(model);
            },
            undefined,
            (error) => {
                console.error('Error loading GLTF model:', error);
            }
        );
        this.animate();
    }

    // async loadTextures(pathArray) {
    //     const textureLoader = new THREE.TextureLoader();
    //     const promises = pathArray.map((path) => {
    //       return new Promise((resolve, reject) => {
    //         const texture = textureLoader.load(path.texture, (texture) => {
    //           // Set texture properties or perform other operations
    //           resolve(texture);
    //         }, undefined, reject);
    //       
    //     });

    //     return await Promise.all(promises);
    //   }


    async loadTextures(textures) {
        const textureLoader = new THREE.TextureLoader();
        const promises = textures.map(textureObject => {
            return new Promise((resolve, reject) => {
                const {
                    diffuseMap,
                    displacementMap,
                    normalMap,
                    specularMap,
                    normal,
                    specular
                } = textureObject;

                const loadedTextureObject = {};

                if (diffuseMap) {
                    const diffuseTexture = this.loadTexture(diffuseMap);
                    loadedTextureObject.diffuseMap = diffuseTexture;
                }

                if (displacementMap) {
                    const displacementTexture = this.loadTexture(displacementMap);
                    loadedTextureObject.displacementMap = displacementTexture;
                }

                if (normalMap) {
                    const normalTexture = this.loadTexture(normalMap);
                    loadedTextureObject.normalMap = normalTexture;
                }

                if (specularMap) {
                    const specularTexture = this.loadTexture(specularMap);
                    loadedTextureObject.specularMap = specularTexture;
                }

                if (normal) {
                    const normalTexture = this.loadTexture(normal);
                    loadedTextureObject.normal = normalTexture;
                }

                if (specular) {
                    const specularTexture = this.loadTexture(specular);
                    loadedTextureObject.specular = specularTexture;
                }

                Promise.all(Object.values(loadedTextureObject))
                    .then(textures => {
                        Object.keys(loadedTextureObject).forEach((key, index) => {
                            loadedTextureObject[key] = textures[index];
                        });

                        resolve(loadedTextureObject);
                    })
                    .catch(reject);
            });
        });

        return Promise.all(promises);
    }

    loadTexture(path) {
        return new Promise((resolve, reject) => {
            const textureLoader = new THREE.TextureLoader();
            textureLoader.load(path, resolve, undefined, reject);
        });
    }


    initThreeScene() {
        const {
            clientHeight,
            clientWidth
        } = this.container

        this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 100000, 100000);
        this.camera.position.set(this.camPos.x, this.camPos.y, this.camPos.z);
        this.camera.rotation.set(this.camAngle.x, this.camAngle.y, this.camAngle.z);
        this.camera.layers.enable(0);
        this.camera.layers.enable(1);
        this.camera.layers.enable(2);
        this.camera.aspect = clientWidth / clientHeight;
        this.camera.updateProjectionMatrix();

        this.renderer.setSize(clientWidth, clientHeight);

        const resetCameraButton = document.getElementById('resetCameraButton');
        resetCameraButton.addEventListener('click', () => {
            let targetCameraPosition;
            if (this.id === 1) {
                targetCameraPosition = new THREE.Vector3(0, 0, 400);
            } else if (this.id === 2) {
                targetCameraPosition = new THREE.Vector3(0, 50, 800);
            }

            const targetCameraRotation = new THREE.Euler(this.camAngle.x, this.camAngle.y, this.camAngle.z);
            const duration = 2000;

            new TWEEN.Tween(this.camera.position)
                .to(targetCameraPosition, duration)
                .easing(TWEEN.Easing.Quadratic.InOut)
                .onUpdate(() => {
                    this.controls.target.set(this.camera.position.x, this.camera.position.y, this.camera.position.z);
                })
                .start();

            new TWEEN.Tween(this.camera.rotation)
                .to({
                    x: targetCameraRotation.x,
                    y: targetCameraRotation.y,
                    z: targetCameraRotation.z
                }, duration)
                .easing(TWEEN.Easing.Quadratic.InOut)
                .onUpdate(() => {
                    this.camera.rotation.set(this.camera.rotation.x, this.camera.rotation.y, this.camera.rotation.z);
                })
                .start();
        });






        // LIGHTS


        let directionalLight = new THREE.DirectionalLight(0xF5D3B3, .1);
        directionalLight.position.set(300, 10, 800)

        const targetObject = new THREE.Object3D();
        targetObject.position.set(-100, 10, 80);
        this.scene.add(directionalLight);
        this.scene.add(targetObject);
        directionalLight.target = targetObject;

        const helper = new THREE.DirectionalLightHelper(directionalLight, 3);
        // this.scene.add(helper);

        let ambientLight = new THREE.AmbientLight(0xF5D3B3, .1);
        this.scene.add(ambientLight);

        let spotLight = new THREE.SpotLight(0xF5D3B3, 1);
        spotLight.position.set(0, 450, -16000)
        this.scene.add(spotLight);
        // const spotLightHelper = new THREE.SpotLightHelper( spotLight );
        // this.scene.add( spotLightHelper );


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
                    x: random(-2000, 2000),
                    y: random(-10, -10),
                    z: random(-2000, 2000)
                },
                modelName: random(this.models),
                birth: database.graves[i].age,
                isVisible: true,
                birthDate: database.graves[i].birthDate,
                deathDate: database.graves[i].deathDate,
                texture: random(this.textures),
                textures: this.textures,
                color: database.graves[i].color,
                name: database.graves[i].name,
                surname: database.graves[i].surname,
                models: this.models,
                scene: this.scene,
            }))

        }
        // console.log(this.graves)

    }

    async initCustomGrave() {
        console.log(this.textures)
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
            text: "firstname \nlastname",
            name: "John",
            surname: "Doe",
            birthDate: new Date("1950-04-02"),
            deathDate: new Date("2023-06-05"),
            models: this.models,
            scene: this.scene,
        });
    }

    async pushToGraveyard(grave) {
        new TWEEN.Tween(grave.booleMesh.material)
            .to({
                opacity: 0
            }, 2000).easing(TWEEN.Easing.Quadratic.InOut).onUpdate(() => {
                grave.booleMesh.material.needsUpdate = true;
            }).start().onComplete(() => {
                this.scene.add(grave.booleMesh)
                document.getElementById("section7").scrollIntoView({
                    behavior: 'smooth'
                });
                setTimeout(() => {
                    new TWEEN.Tween(grave.booleMesh.material)
                        .to({
                            opacity: 1
                        }, 1000).easing(TWEEN.Easing.Quadratic.InOut).onUpdate(() => {
                            grave.booleMesh.material.needsUpdate = true;
                        }).start();
                }, 500);
            });







    }

    async animate() {
        const deltaTime = this.clock.getDelta();

        this.controls.update(deltaTime);
        requestAnimationFrame(() => this.animate());
        this.renderer.render(this.scene, this.camera);
        TWEEN.update();
    }

    onWindowResize() {
        const {
            clientHeight,
            clientWidth
        } = this.container;

        const pixelRatio = window.devicePixelRatio;
        this.camera.aspect = clientWidth / clientHeight;
        this.camera.updateProjectionMatrix();

        this.renderer.setSize(clientWidth * pixelRatio, clientHeight * pixelRatio);
    }

    switchView(view) {
        if (view === "editing") {
            console.log("editing");
            for (let i = 0; i < this.graves.length; i++) {
                this.graves[i].hide();
            }

            this.currentGrave.show();
            this.currentGrave.engraving.show();
        }

        if (view === "exploring") {
            console.log("exploring");
            for (let i = 0; i < this.graves.length; i++) {
                this.graves[i].show();
            }
            this.currentGrave.hide();
            this.currentGrave.engraving.hide();
        }
    }

};