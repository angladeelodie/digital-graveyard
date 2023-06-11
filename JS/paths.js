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
            diffuseMap: "/imgs/maps/gold.jpg",
            // displacementMap: "/imgs/displacementMaps/gold_displacement.jpg",
        },
        {
            diffuseMap: "/imgs/maps/silver.jpg",
            // displacementMap: "/imgs/displacementMaps/silver_displacement.jpg",
        },
        {
            diffuseMap: "/imgs/maps/wood.jpg",
            normalMap: "/imgs/maps/wood_normal.jpg",
            specularMap: "/imgs/maps/wood_specular.jpg",
        },
    ]

    return texturePaths
}