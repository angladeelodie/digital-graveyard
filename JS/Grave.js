import {
    MeshPhysicalMaterial
} from "three";
import * as THREE from 'three';

import Engraving from './Engraving.js';
import {
    CSG
} from 'three-csg-ts';



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
        this.name = "John",
        this.surname =  "Doe",
        this.createGrave()
    }

    createGrave() {
        const material = new THREE.MeshStandardMaterial({
            roughness: 0.3,
            metalness: 0.1,
            map : this.texture
        });
        if(this.modelName === "paul-rand"){
            this.graveMesh = new THREE.Mesh(
                new THREE.BoxGeometry(200, 200, 200),
                material
            );
        } 
        else if(this.modelName === "pierre-keller"){
            this.graveMesh = new THREE.Mesh(
                new THREE.BoxGeometry(100, 200, 45),
                material
            );

        }
        else if(this.modelName === "anthony-wilson"){
            this.graveMesh = new THREE.Mesh(
                new THREE.CylinderGeometry(20, 20, 150, 20),
                material
            );
        } 

        // this.graveMesh.updateMatrix();
        // this.graveMesh.scale.set(this.scale.x, this.scale.y, this.scale.z);
        // this.graveMesh.position.copy(this.position);
        this.text = this.name + " \n" + this.surname;
        console.log(this.text)
        this.addEngraving(this.text);

    }
    async addEngraving() {
        this.engraving = new Engraving(15, this.text, this.isVisible, this.scene);
        
        await this.engraving.initialize();
        // this.scene.add(this.engraving.textMesh);
        this.engraving.textMesh.layers.set(0);
        this.engraving.isVisible = true;
        // this.engraving.show()

        this.createBooleMesh()
    }

    createBooleMesh() {
        const material = new MeshPhysicalMaterial({
            map : this.texture,
            roughness: 0.3,
            metalness: 0.1,
        });

        this.booleMesh = CSG.subtract(this.graveMesh, this.engraving.textMesh);
        this.booleMesh.material = material;

        this.scene.add(this.booleMesh)
    }

    async updateBoolMesh() {
        const material = new MeshPhysicalMaterial({
            map : this.texture,
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
        console.log(this.text)
        this.engraving.text = this.text;
        await this.engraving.updateText(this.text)
        console.log(this.engraving.textMesh)
        await this.updateBoolMesh();
    }

    async updateSurname(surname) {
        this.surname = surname;
        this.text = this.name + " \n" + this.surname;
        console.log(this.text)
        this.engraving.text = this.text;
        await this.engraving.updateText(this.text)
        console.log(this.engraving.textMesh)
        await this.updateBoolMesh();
    }

    updateMaterial(textureIndex) {
        textureIndex = parseInt(textureIndex)
        this.texture = this.textures[textureIndex];

        this.booleMesh.material.map = this.texture;
        console.log(this.texture)
    }

    updatePosition() {
        this.model.position.copy(this.position);
    }

    updateModel(modelIndex) {
        this.deleteGrave()
       
        let selectedModel = this.models[modelIndex];
        this.modelName = selectedModel;
        console.log(this.modelName)
        this.createGrave(this.modelName)
        
    }
    deleteGrave() {
        // this.model.parent.remove(this.model);
        // this.graveMesh.remove(this.graveMesh);

        this.scene.remove(this.booleMesh);
        this.booleMesh.geometry.dispose();
        this.booleMesh.material.dispose();
    }


    hide() {
        this.isVisible = false;
        this.model.children.forEach(child => {
            if (child.isMesh) {
                // this.engraving.hide();
                child.layers.set(1)
            }
        });
    }

    show() {
        console.log("doing show function")
        this.isVisible = true;
        this.model.children.forEach(child => {
            if (child.isMesh) {
                // this.engraving.show();
                child.layers.set(0)
            }
        });
    }
}