import {
    MeshPhysicalMaterial
} from "three";
import * as THREE from 'three';
import {
    RoundedBoxGeometry
} from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';



import Engraving from './Engraving.js';
import {
    CSG
} from 'three-csg-ts';

import {
    map
} from '/JS/utils'
export default class Grave {
    constructor({
        position,
        modelName,
        scale,
        texture,
        textures,
        isVisible,
        id,
        text,
        name,
        surname,
        birthDate,
        deathDate,
        models,
        scene
    }) {
        this.position = position;
        this.modelName = modelName;
        this.graveId = id;
        this.text = text;
        this.scale = scale;
        this.texture = texture;
        this.textures = textures;
        this.isVisible = isVisible;
        this.engraving;
        this.models = models;
        this.scene = scene;
        this.graveMesh;
        this.booleMesh;
        this.name = name,
        this.surname = surname,
        this.birthDate = birthDate;
        this.deathDate = deathDate;
        this.age;
        this.zOffset;
        this.createGrave()
    }


    createGrave() {
        this.calculateAge()
        const material = new THREE.MeshStandardMaterial({
            roughness: 0.3,
            metalness: 0.1,
            map: this.texture
        });
        if (this.modelName === "paul-rand") {
            this.graveMesh = new THREE.Mesh(
                new RoundedBoxGeometry(150, 150, 150, 1, 10),
                material
            );
            this.zOffset = 70;

        } else if (this.modelName === "pierre-keller") {
            // this.graveMesh = new THREE.Mesh(
            //     new THREE.BoxGeometry(100, 200, 45),
            //     material
            // );
            this.graveMesh = new THREE.Mesh(
                new RoundedBoxGeometry(120, 200, 45, 1, 10),
                material
            );
            this.zOffset = 20;



        } else if (this.modelName === "anthony-wilson") {
            this.graveMesh = new THREE.Mesh(
                new THREE.CylinderGeometry(30, 30, 200, 20),
                material
            );
            this.zOffset = 20;
            this.graveMesh.rotation.z = Math.PI / 2;



        }
        this.age = map(this.age, 0, 100, 0, 1.5);
        this.graveMesh.scale.y = this.age;

        this.graveMesh.updateMatrix();

        this.graveMesh.position.copy(this.position);
        this.text = this.name + " \n" + this.surname;
        this.addEngraving(this.text);

    }
    async addEngraving() {
        
        this.engraving = new Engraving(15, this.text, this.isVisible, this.scene, this.zOffset);
        await this.engraving.initialize();
        this.createBooleMesh()
    }

    createBooleMesh() {
        const material = new MeshPhysicalMaterial({
            map: this.texture,
            roughness: 0.3,
            metalness: 0.1,
        });

        this.booleMesh = CSG.subtract(this.graveMesh, this.engraving.textMesh);
        this.booleMesh.material = material;
        this.booleMesh.position.copy(this.position);

        this.scene.add(this.booleMesh)
    }

    async updateBoolMesh() {
        const material = new MeshPhysicalMaterial({
            map: this.texture,
            roughness: 0.3,
            metalness: 0.1,
        });
        this.scene.remove(this.booleMesh);
        this.booleMesh.geometry.dispose();
        this.booleMesh.material.dispose();

        this.createBooleMesh();
    }


    async updateName(name) {
        this.name = name;
        this.text = this.name + " \n" + this.surname;
        this.engraving.text = this.text;
        await this.engraving.updateText(this.text)
        await this.updateBoolMesh();
    }

    async updateSurname(surname) {
        this.surname = surname;
        this.text = this.name + " \n" + this.surname;
        this.engraving.text = this.text;
        await this.engraving.updateText(this.text)
        await this.updateBoolMesh();
    }

    updateMaterial(textureIndex) {
        textureIndex = parseInt(textureIndex)
        this.texture = this.textures[textureIndex];
        this.booleMesh.material.map = this.texture;
    }

    updatePosition() {
        this.model.position.copy(this.position);
    }

    updateModel(modelIndex) {
        this.deleteGrave()
        let selectedModel = this.models[modelIndex];
        this.modelName = selectedModel;
        this.createGrave(this.modelName)
    }

    deleteGrave() {
        this.scene.remove(this.booleMesh);
        this.booleMesh.geometry.dispose();
        this.booleMesh.material.dispose();
    }


    // hide() {
    //     this.isVisible = false;
    //     this.model.children.forEach(child => {
    //         if (child.isMesh) {
    //             // this.engraving.hide();
    //             child.layers.set(1)
    //         }
    //     });
    // }

    // show() {
    //     console.log("doing show function")
    //     this.isVisible = true;
    //     this.model.children.forEach(child => {
    //         if (child.isMesh) {
    //             // this.engraving.show();
    //             child.layers.set(0)
    //         }
    //     });
    // }

    calculateAge() {
        console.log(this.deathDate)
        this.deathDate = new Date(this.deathDate)
        this.birthDate = new Date(this.birthDate)
        let timeDiff = this.deathDate.getTime() - this.birthDate.getTime();
        this.age = timeDiff / (1000 * 3600 * 24 * 365.25);
    }

    resize() {
        this.age = map(this.age, 0, 100, 0, 1.5);
        this.booleMesh.scale.y = this.age;

    }
}