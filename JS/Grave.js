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
        model,
        scale,
        isVisible,
        id,
        text,
        models,
        scene
    }) {
        this.position = position;
        this.model = model.clone();
        this.graveId = id;
        this.text = text;
        this.scale = scale;
        this.isVisible = isVisible;
        this.engraving;
        this.models = models;
        this.scene = scene;
        this.graveMesh;
        this.booleMesh;
        this.createGrave(this.model)
    }

    createGrave(model) {
        const material = new MeshPhysicalMaterial({
            color: 0xA0A0A0,
            roughness: 0.3,
            metalness: 0.1,
        });
        this.graveMesh = new THREE.Mesh(
            new THREE.BoxGeometry(200, 200, 45),
            material
        );

        this.graveMesh.updateMatrix();
        // this.graveMesh.scale.set(this.scale.x, this.scale.y, this.scale.z);
        // this.graveMesh.position.copy(this.position);
        this.addEngraving(this.text);

    }
    async addEngraving() {
        console.log("adding engraving with" + this.text)
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
            color: 0xA0A0A0,
            roughness: 0.3,
            metalness: 0.1,
        });
        this.booleMesh = CSG.subtract(this.graveMesh, this.engraving.textMesh);
        this.booleMesh.material = material;
        
        this.scene.add(this.booleMesh)
    }

    async updateBoolMesh() {
        const material = new MeshPhysicalMaterial({
            color: 0xA0FFFF,
            roughness: 0.3,
            metalness: 0.1,
        });
        this.scene.remove(this.booleMesh);
        this.booleMesh.geometry.dispose();
        this.booleMesh.material.dispose();
        
        this.createBooleMesh();
    }


    async updateText(text) {
        this.text = text;
        console.log(this.text)
        this.engraving.text = this.text;
        await this.engraving.updateText(this.text)
        console.log(this.engraving.textMesh)
        await this.updateBoolMesh();
    }

    updatePosition() {
        this.model.position.copy(this.position);
    }

    updateModel(modelIndex) {
        this.deleteGrave()
        // console.log(modelIndex)
        // console.log(this.models)
        let selectedModel = Object.values(this.models)[modelIndex];
        this.model = selectedModel.clone();
        // console.log(selectedModel)

        this.createGrave(this.model)
        // this.model = selectedModel.clone();
        // this.model.scale.set(this.scale, this.scale, this.scale);
        // this.model.position.copy(25,25,0)
    }

    deleteGrave() {
        // this.model.parent.remove(this.model);
        this.model.remove(this.model);
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