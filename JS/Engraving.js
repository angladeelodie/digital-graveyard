import * as THREE from 'three';
import { MeshPhysicalMaterial } from "three";

import {
    FontLoader
} from 'three/addons/loaders/FontLoader.js';
import {
    TextGeometry
} from 'three/addons/geometries/TextGeometry.js';

export default class Engraving {
    constructor(size,text, isVisible, scene, offset) {
        this.size = size;
        this.text = text;
        this.isVisible = isVisible;
        this.textMesh;
        this.font = null;
        this.fontPromise = this.loadFont();
        this.scene = scene;
        this.offset = offset;
    }

    loadFont(text) {
        const loader = new FontLoader();
        return new Promise((resolve, reject) => {
            loader.load('../fonts/444Graveyard-Regular-serif.json', function (font) {
                resolve(font);

                // console.log(textMesh)
                // this.createText(textMesh);
            }, undefined, reject);
        });
    }

    async addTextGeometry(text) {
        const font = await this.fontPromise;
        let textGeo = new TextGeometry(text, {
            font: font,
            size: this.size,
            height: 40,
            curveSegments: 5,
            bevelEnabled: false,
            // bevelThickness: 1,
            // bevelSize: 0.2,
            // bevelOffset: 0,
            // bevelSegments: 5
        });
        textGeo.computeBoundingBox();
        const textWidth = textGeo.boundingBox.max.x - textGeo.boundingBox.min.x;
        // const textHeight = textGeo.boundingBox.max.y - textGeo.boundingBox.min.y;
        const xOffset = -textWidth / 2;
        // const yOffset = -textHeight / 2;
        textGeo.translate(this.offset.x + xOffset, this.offset.y, this.offset.z);

        const material = new MeshPhysicalMaterial({
            color: 0xA0A0A0,
            roughness: 0.3,
            metalness: 0.1,
        });
        this.textMesh = new THREE.Mesh(textGeo, material);

    }

    async initialize() {
        await this.addTextGeometry(this.text);
    }

    async updateText(text) {
        this.scene.remove(this.textMesh);
        this.textMesh.geometry.dispose();
        this.textMesh.material.dispose();
        this.textMesh = null;
        
        await this.addTextGeometry(text);
    }



    show() {
        if(this.textMesh){
            this.isVisible = true;
            this.textMesh.layers.set(1)
        }
    }
    hide(){
        if(this.textMesh){
            this.isVisible = false;
            this.textMesh.layers.set(1)
        }
    }


}