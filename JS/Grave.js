import { MeshPhysicalMaterial } from "three";
import Engraving from './Engraving.js';


export default class Grave {
    constructor({
        position,
        model,
        scale,
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
        this.engraving;
        this.models = models;
        this.scene = scene;

        this.createGrave(this.model)
    }

    createGrave(model) {
        // console.log(model)
        model.children.forEach(child => {

            if (child.isMesh) {
                const material = new MeshPhysicalMaterial({
                    color: 0xA0A0A0,
                    roughness: 0.3,
                    metalness: 0.1,
                });
                
                child.material = material
                // this.meshes.push(child)
            }
        });

        model.scale.set(this.scale.x, this.scale.y, this.scale.z);
        model.position.copy(this.position);
        this.scene.add(model);
        this.addEngraving(this.text)

    }
    addEngraving(){
        console.log(this.text)
        this.engraving = new Engraving(15, this.text);
        this.engraving.initialize(this.model);

        // this.model.add()
    }


    updateText(text) {
        this.text = text;
        this.engraving.updateText(this.model, text)
    }

    updateModel(modelIndex){
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

    deleteGrave(){
        this.model.parent.remove(this.model);
    }

    

    


   
}