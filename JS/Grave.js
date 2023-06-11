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
        color,
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
        this.color = color;
        this.textures = textures;
        this.isVisible = isVisible;
        this.engraving;
        this.models = models;
        this.scene = scene;
        this.graveMesh;
        this.booleMesh;
        this.name = name;
        this.surname = surname;
        this.birthDate = birthDate;
        this.deathDate = deathDate;
        this.age;
        this.offset = {
            x: 0,
            y: 0,
            z: 0
        };
        this.sizeFactor;
        this.createGrave();
    }


    createGrave() {
        this.calculateAge();
        // this.age = 100
        this.remapAgeToGraveSize();
        // console.log(this.age)
        // console.log(this.sizeFactor)
        const material = new THREE.MeshStandardMaterial({
            roughness: 0.3,
            metalness: 0.1,
            map: this.texture.diffuseMap
        });
        // console.log(this.texture.diffuseMap)
        if (this.modelName === "paul-rand") {
            this.graveMesh = new THREE.Mesh(
                // new RoundedBoxGeometry(150, 150, 150, 1, 10),
                new THREE.BoxGeometry(this.sizeFactor, this.sizeFactor, this.sizeFactor),
                material
            );
            const yOffset = this.sizeFactor / 2; // Half of the size factor
            this.graveMesh.geometry.translate(0, yOffset, 0);

            this.offset.y = yOffset;
            this.offset.z = this.sizeFactor/2 - 5;
        } else if (this.modelName === "pierre-keller") {
            this.graveMesh = new THREE.Mesh(
                new THREE.BoxGeometry(100, this.sizeFactor, 45),
                material
            );
            // this.graveMesh = new THREE.Mesh(
            //     new RoundedBoxGeometry(120, 200, 45, 1, 10),
            //     material
            // );
            const yOffset = this.sizeFactor / 2; // Half of the size factor
            this.graveMesh.geometry.translate(0, yOffset, 0);

            this.offset.y = this.sizeFactor / 2;
            this.offset.z = 21.5-5;


        } else if (this.modelName === "anthony-wilson") {
            this.graveMesh = new THREE.Mesh(
                new THREE.CylinderGeometry(30, 30, this.sizeFactor, 20),
                material
            );
            this.graveMesh.rotation.z = Math.PI / 2;
            //les axes sont inversés à cuase de la rotation, donc pour baisser la forme il faut faire une translation sur l'axe X au lieu de Y
            this.graveMesh.geometry.translate(30, 0, 0);
            // const yOffset = this.sizeFactor / 2; // Half of the size factor
            // this.graveMesh.geometry.translate(0, yOffset, 0);

            this.offset.z = 15;
            this.offset.y = 30;



        }
        this.age = map(this.age, 0, 100, 0, 1.5);
        this.graveMesh.scale.y = this.age;

        this.graveMesh.updateMatrix();

        this.graveMesh.position.copy(this.position);
        if (this.modelName === "anthony-wilson") {
            this.graveMesh.position.setY(-200);
        }

        this.text = this.name + " \n" + this.surname;
        this.addEngraving(this.text);

    }
    async addEngraving() {

        this.engraving = new Engraving(15, this.text, this.isVisible, this.scene, this.offset);
        await this.engraving.initialize();
        this.createBooleMesh()
    }

    createBooleMesh() {
        let material = this.createMaterial();
        this.booleMesh = CSG.subtract(this.graveMesh, this.engraving.textMesh);
        this.booleMesh.material = material;
        this.booleMesh.position.copy(this.position);

        this.scene.add(this.booleMesh)
    }

    createMaterial() {
        let material = new MeshPhysicalMaterial({
            map: this.texture.diffuseMap,
            roughness: 0.3,
            metalness: 0.1,
            transparent: true,
            opacity: 1,
        });
        if (this.texture.normalMap) {
            material.normalMap = this.texture.normalMap;
            material.normalScale.set(0.5, 0.5);
        }

        if (this.texture.specular) {
            material.specular = this.texture.specular;
        }

        if (this.texture.displacementMap) {
            material.displacementMap = this.texture.displacementMap;
        }

        if (this.color != null) {
            material.map = null;
            material.needsUpdate = true;
            material.color = new THREE.Color(this.color);
        }



        return material;
    }

    async updateBoolMesh() {
        // let material = this.createMaterial();
        this.scene.remove(this.booleMesh);
        this.booleMesh.geometry.dispose();
        this.booleMesh.material.dispose();
        this.createBooleMesh();
        // await this.engraving.updateName(this.name)
        // await this.engraving.updateSurname(this.surname)

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
        if (textureIndex == "0" || textureIndex == "1" || textureIndex == "2" || textureIndex == "3") {
            textureIndex = parseInt(textureIndex)
            this.texture = this.textures[textureIndex];
            let material = this.createMaterial();
            this.color = null;
            this.booleMesh.material.color = null;
            this.booleMesh.material = material;


        } else {
            console.log(this.booleMesh.material)
            this.booleMesh.material.map = null;
            this.booleMesh.material.displacementMap = null;
            this.booleMesh.material.normalMap = null;
            this.booleMesh.material.specularMap = null;
            this.booleMesh.material.needsUpdate = true;
            this.color = textureIndex
            this.booleMesh.material.color = new THREE.Color(textureIndex);
        }
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


    calculateAge() {
        // console.log(this.deathDate)
        this.deathDate = new Date(this.deathDate)
        this.birthDate = new Date(this.birthDate)
        let timeDiff = this.deathDate.getTime() - this.birthDate.getTime();
        this.age = timeDiff / (1000 * 3600 * 24 * 365.25);
    }

    resize() {
        this.deleteGrave()
        this.createGrave()
        // this.age = map(this.age, 0, 100, 0, 1.5);
        // this.booleMesh.scale.y = this.age;

    }

    remapAgeToGraveSize() {

        if (this.modelName === "paul-rand") {
            //taile du cube peut aller de 100 à 180 selon l'age	
            this.sizeFactor = map(this.age, 0, 100, 100, 180);

        } else if (this.modelName === "pierre-keller") {
            //hauteur de la pierre peut aller de 150 à 200 selon l'age
            this.sizeFactor = map(this.age, 0, 100, 150, 200);


        } else if (this.modelName === "anthony-wilson") {
            //longueur du cylindre peut aller de 150 à 200 selon l'age
            this.sizeFactor = map(this.age, 0, 100, 150, 200);
        }
    }
}