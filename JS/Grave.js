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

        this.createGrave(this.model)
    }

    createGrave(model) {
        // console.log(model)
        // model.children.forEach(child => {
        //     if (child.isMesh) {

        const material = new MeshPhysicalMaterial({
            color: 0xA0A0A0,
            roughness: 0.3,
            metalness: 0.1,
        });

        //         child.material = material
        //     }

        // });

        // model.scale.set(this.scale.x, this.scale.y, this.scale.z);
        // model.position.copy(this.position);

        model = new THREE.Mesh(
            new THREE.BoxGeometry(200, 200, 5),
            material
        );
        console.log(this.model)
        // this.scene.add(model);
        // this.scene.add(model)
        // console.log(model)
        this.addEngraving(this.text)

    }
    async addEngraving() {
        console.log("adding engraving with" + this.text)
        this.engraving = new Engraving(15, this.text, this.isVisible);
        const material = new MeshPhysicalMaterial({
            color: 0xF0F000,
            roughness: 0.3,
            metalness: 0.1,
        });
        await this.engraving.initialize(this.model);

        console.log(this.engraving.textMesh)
        //   this.scene.add(this.engraving)
        // this.engraving.isVisible = true

        // this.engraving.show()

        // this.model.add()

        const material2 = new THREE.MeshNormalMaterial()

        const box = new THREE.Mesh(
            new THREE.BoxGeometry(200, 200, 3),
            new THREE.MeshNormalMaterial()
          );
        box.updateMatrix();

        // const modelCSG = CSG.fromGeometry(box)
        // const textCSG = CSG.fromGeometry(
        //     this.engraving.textMesh.geometry,
        //     material
        // )

        const subRes = CSG.subtract(box, this.engraving.textMesh);
        // const subtractCSG = modelCSG.subtract(textCSG)

        // const finalMesh = CSG.toMesh(
        //     subtractCSG,
        //     new THREE.Matrix4()
        // )
        // finalMesh.material =material2
        this.scene.add(subRes)
    }


    updateText(text) {
        this.text = text;
        this.engraving.updateText(this.model, text)
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