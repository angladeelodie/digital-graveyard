import { MeshPhysicalMaterial } from "three";

export default class Grave {
    constructor({
        position,
        model,
        scale,
        id
    }) {
        this.model = model.clone();
        this.graveId = id
        this.scale = scale

        this.model.children.forEach(child => {

            if (child.isMesh) {
                const material = new MeshPhysicalMaterial({
                    color: 0xff0000,
                    roughness: 0.3,
                    metalness: 0.1,
                });
                
                child.material = material
                // this.meshes.push(child)
            }
        });

        this.model.scale.set(this.scale, this.scale, this.scale);
        this.model.position.copy(position)
        // console.log(this.model.position)
        // this.model.rotation.set(random(-1.0, 1.0), random(-1.0, 1.0), random(-1.0, 1.0))
        this.show()
    }

    show() {
        // this.model.children.forEach(child => {
        //     if (child.isMesh) {
        //         // child.layers.set( 0 );
        //     }
        // })
    }

    


   
}