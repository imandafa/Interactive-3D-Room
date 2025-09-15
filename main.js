import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// --- Scene Setup ---
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0xabcdef, 1);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
camera.position.set(2, 2, 2);
controls.update();

// --- Lighting ---
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 5, 5);
scene.add(directionalLight);

// --- GLTF Loader ---
const loader = new GLTFLoader();
let roomModel; // Store the loaded model
loader.load(
    'path/to/your/mini_room.gltf', // Replace with your model path
    function (gltf) {
        roomModel = gltf.scene;
        scene.add(roomModel);
    },
    undefined,
    function (error) {
        console.error('An error occurred loading the model:', error);
    }
);

// --- Raycaster for Interaction ---
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
const infoPanel = document.getElementById('infoPanel');

function onMouseClick(event) {
    // Calculate mouse position in normalized device coordinates (-1 to +1)
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    // Update the raycaster with the camera and mouse position
    raycaster.setFromCamera(mouse, camera);

    // Find all objects the ray intersects
    const intersects = raycaster.intersectObjects(scene.children, true);

    // If there is an intersection
    if (intersects.length > 0) {
        const clickedObject = intersects[0].object;
        console.log('Clicked object name:', clickedObject.name);

        // Check if the clicked object is the photo
        if (clickedObject.name === 'PersonalPhoto') { // You must know the name of your object
            // Display information
            infoPanel.style.display = 'block';
            infoPanel.innerHTML = '<h2>My Personal Photo</h2><p>This is a photo of my family from our trip to the beach last summer!</p>';
        } else {
            // Hide the panel if another object is clicked
            infoPanel.style.display = 'none';
        }
    } else {
        // Hide the panel if nothing is clicked
        infoPanel.style.display = 'none';
    }
}

// --- Animation Loop ---
function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}
animate();

// --- Event Listeners ---
window.addEventListener('click', onMouseClick, false);
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}, false);
