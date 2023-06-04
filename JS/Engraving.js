import * as THREE from 'three';
import { MeshPhysicalMaterial } from "three";


import {
    FontLoader
} from 'three/addons/loaders/FontLoader.js';
import {
    TextGeometry
} from 'three/addons/geometries/TextGeometry.js';

export default class Engraving {
    constructor(size,text, isVisible) {
        this.size = size;
        this.text = text;
        this.isVisible = isVisible;
        this.textMesh;
        this.font = null;
        this.fontPromise = this.loadFont();
    }

    loadFont(text) {
        const loader = new FontLoader();
        return new Promise((resolve, reject) => {
            loader.load('../fonts/helvetiker.json', function (font) {
                resolve(font);

                // console.log(textMesh)
                // this.createText(textMesh);
            }, undefined, reject);
        });
    }

    async addTextGeometry(model, text) {
        const font = await this.fontPromise;
        let textGeo = new TextGeometry(text, {
            font: font,
            size: this.size*2,
            height: 2,
            curveSegments: 12,
            bevelEnabled: true,
            bevelThickness: 1,
            bevelSize: 0.2,
            bevelOffset: 0,
            bevelSegments: 5
        });
        textGeo.computeBoundingBox();
        const textWidth = textGeo.boundingBox.max.x - textGeo.boundingBox.min.x;
        // const textHeight = textGeo.boundingBox.max.y - textGeo.boundingBox.min.y;

        const xOffset = -textWidth / 2;
        // const yOffset = -textHeight / 2;

        textGeo.translate(xOffset, 0, 0);



        const material = new MeshPhysicalMaterial({
            color: 0xA0A0A0,
            roughness: 0.3,
            metalness: 0.1,
        });
        this.textMesh = new THREE.Mesh(textGeo, material);
        if(this.isVisible === true){
           this.show();

        } else {
            this.hide();
        }
        this.textMesh.scale.set(1, 1, 1);
        // model.add(this.textMesh);
        // console.log(scene)
    }

    async initialize(model) {
        await this.addTextGeometry(model, this.text);
        console.log("initialize engraving")
    }

    updateText(model, text) {
        this.textMesh.parent.remove(this.textMesh);

        // this.textMesh.geometry.dispose();
        this.addTextGeometry(model, text);
    }



    show() {
        console.log(this.textMesh)
        if(this.textMesh){
            this.isVisible = true;
            this.textMesh.layers.set(1)
        }
    }
    hide(){
        console.log(this.textMesh)
        if(this.textMesh){
            this.isVisible = false;
            this.textMesh.layers.set(1)
        }
    }


}