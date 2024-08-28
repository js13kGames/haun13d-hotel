const fs = require('fs');
const path = require('path');

function r(num) {
    return Math.floor(num * 100) / 100;
}

function parseOBJ(objData) {
    const vertices = [];
    const uvs = [];
    let currentMaterial = '';
    const materials = {};

    const lines = objData.split('\n');

    lines.forEach(line => {
        const parts = line.trim().split(' ');

        switch (parts[0]) {
            case 'v':
                vertices.push(r(parseFloat(parts[1])), r(parseFloat(parts[2])), r(parseFloat(parts[3])));
                break;
            case 'vt':
                uvs.push(parseFloat(r(parts[1])), parseFloat(r(parts[2])));
                break;
            case 'usemtl':
                currentMaterial = parts[1];
                if (!materials[currentMaterial]) {
                    materials[currentMaterial] = {
                        vertices: [],
                        uv: [],
                        faces: []
                    };
                }
                break;
            case 'f':
                const face = parts.slice(1).map(part => {
                    const [vIndex, vtIndex] = part.split('/').map(str => parseInt(str, 10) - 1);
                    return { vIndex, vtIndex };
                });

                // Triangulate if the face has 4 vertices
                if (face.length === 4) {
                    materials[currentMaterial].faces.push([face[0], face[1], face[2]]);
                    materials[currentMaterial].faces.push([face[0], face[2], face[3]]);
                } else {
                    materials[currentMaterial].faces.push(face);
                }
                break;
        }
    });

    Object.values(materials).forEach(material => {
        material.faces.forEach(face => {
            face.forEach(({ vIndex, vtIndex }) => {
                material.vertices.push(vertices[vIndex * 3], vertices[vIndex * 3 + 1], vertices[vIndex * 3 + 2]);
                material.uv.push(uvs[vtIndex * 2], uvs[vtIndex * 2 + 1]);
            });
        });
    });

    return materials;
}

// Get the file path from command-line arguments
const filePath = process.argv[2];

if (!filePath) {
    console.error('Please provide the path to the .obj file as an argument.');
    process.exit(1);
}

// Read the .obj file
fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
        console.error('Error reading the file:', err);
        process.exit(1);
    }

    const materials = parseOBJ(data);
    const outputLines = Object.entries(materials).map(([material, { vertices, uv }]) => {
        return `this.WebXR.add('${material}', {vertices: [${vertices.join(',')}], uv: [${uv.join(',')}]});`;
    });

    // Write output to console, or could be written to a file
    console.log(outputLines.join('\n'));
});

// const fs = require('fs');
// const path = require('path');

// function parseOBJ(objData) {
//     const vertices = [];
//     const uvs = [];
//     const faces = [];

//     const lines = objData.split('\n');

//     lines.forEach(line => {
//         const parts = line.trim().split(' ');

//         switch (parts[0]) {
//             case 'v':
//                 vertices.push(parseFloat(parts[1]), parseFloat(parts[2]), parseFloat(parts[3]));
//                 break;
//             case 'vt':
//                 uvs.push(parseFloat(parts[1]), parseFloat(parts[2]));
//                 break;
//             case 'f':
//                 const face = parts.slice(1).map(part => {
//                     const [vIndex, vtIndex] = part.split('/').map(str => parseInt(str, 10) - 1);
//                     return { vIndex, vtIndex };
//                 });

//                 // Triangulate if the face has 4 vertices
//                 if (face.length === 4) {
//                     faces.push([face[0], face[1], face[2]]);
//                     faces.push([face[0], face[2], face[3]]);
//                 } else {
//                     faces.push(face);
//                 }
//                 break;
//         }
//     });

//     const customVertices = [];
//     const customUVs = [];

//     faces.forEach(face => {
//         face.forEach(({ vIndex, vtIndex }) => {
//             customVertices.push(vertices[vIndex * 3], vertices[vIndex * 3 + 1], vertices[vIndex * 3 + 2]);
//             customUVs.push(uvs[vtIndex * 2], uvs[vtIndex * 2 + 1]);
//         });
//     });

//     return {
//         vertices: customVertices,
//         uv: customUVs
//     };
// }

// // Get the file path from command-line arguments
// const filePath = process.argv[2];

// if (!filePath) {
//     console.error('Please provide the path to the .obj file as an argument.');
//     process.exit(1);
// }
// // Read the .obj file
// fs.readFile(filePath, 'utf8', (err, data) => {
//     if (err) {
//         console.error('Error reading the file:', err);
//         process.exit(1);
//     }

//     const result = parseOBJ(data);
//     console.log(JSON.stringify(result));
// });