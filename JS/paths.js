let texturePaths = []

export function getTexturePaths() {
    texturePaths = [
        // "/imgs/textures/marble.jpg",
        // "/imgs/textures/gold.jpg",
        // "/imgs/textures/silver.jpg",
        // "/imgs/textures/wood.jpg"

        {
            diffuseMap: "/imgs/maps/marble.jpg",
            displacementMap: "/imgs/maps/marble_displacement.jpg",
            normalMap: "/imgs/maps/marble_normal.jpg",
            specularMap: "/imgs/maps/marble_specular.jpg",
        },
        {
            colorMap: "/imgs/textures/gold/gold_color.jpg",
            normalMap: "/imgs/textures/gold/gold_normal.jpg",
            diffuseMap: "/imgs/textures/gold/gold_diffuse.png",
            displacementMap: "/imgs/textures/gold/gold_roughness.jpg",
        },
        {
            colorMap: "/imgs/textures/gold/silver_color.jpg",
            normalMap: "/imgs/textures/gold/gold_normal.png",
            diffuseMap: "/imgs/textures/gold/silver_diffuse.png",
            displacementMap: "/imgs/textures/gold/silver_roughness.png",
            metalness: 1,
        },
        {
            diffuseMap: "/imgs/maps/wood.jpg",
            normalMap: "/imgs/maps/wood_normal.jpg",
            specularMap: "/imgs/maps/wood_specular.jpg",
            roughnessMap: "/imgs/maps/wood_specular.jpg",
        },
    ]

    return texturePaths
}