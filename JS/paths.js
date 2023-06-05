
export const modelFolder = '/models/'

export const models = {
    grave1: "grave1.gltf",
    grave2: "grave2.gltf",
    grave3: "grave3.gltf",
}

let texturePaths = []

export function getTexturePaths() {
    texturePaths = [
        "/imgs/textures/marble.jpg",
        "/imgs/textures/gold.jpg",
        "/imgs/textures/silver.jpg",
        "/imgs/textures/wood.jpg"
    ]
   
    return texturePaths
}
