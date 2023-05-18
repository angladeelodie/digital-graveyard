import * as THREE from 'three';

import {
    FontLoader
} from 'three/addons/loaders/FontLoader.js';
import {
    TextGeometry
} from 'three/addons/geometries/TextGeometry.js';

export default class Engraving {
    constructor(size,text) {
        this.size = size;
        this.text = text;
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


 
    async addTextGeometry(scene) {
        const font = await this.fontPromise;
        let textGeo = new TextGeometry(this.text, {
            font: font,
            size: 10,
            height: 2,
            curveSegments: 12,
            bevelEnabled: true,
            bevelThickness: 1,
            bevelSize: 0.2,
            bevelOffset: 0,
            bevelSegments: 5
        });
        console.log(textGeo)

        const material = new THREE.MeshPhysicalMaterial({ color: 0xffffff });
        this.textMesh = new THREE.Mesh(textGeo, material);
        this.textMesh.scale.set(10, 10, 10);
        console.log(this.textMesh.position)

        scene.add(this.textMesh);
        console.log(scene)
    }

    async initialize(scene) {
        await this.addTextGeometry(scene);
    }


}