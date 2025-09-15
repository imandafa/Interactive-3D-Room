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

// --- Global Variables ---
let roomModel = null;
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
const infoPanel = document.getElementById('infoPanel');

// --- Functions ---
async function loadModel() {
    const loader = new GLTFLoader();
    try {
        const gltf = await loader.loadAsync('https://raw.githubusercontent.com/your-username/your-repo/main/assets/models/mini_room.gltf');
        roomModel = gltf.scene;
        scene.add(roomModel);
        console.log('Model loaded successfully!');
    } catch (error) {
        console.error('An error occurred loading the model:', error);
    }
}

function onMouseClick(event) {
    if (!roomModel) return; // Exit if the model hasn't loaded yet

    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);

    // Check for intersections with all children of the loaded model
    const intersects = raycaster.intersectObjects(roomModel.children, true);

    if (intersects.length > 0) {
        const clickedObject = intersects[0].object;
        console.log('Clicked object name:', clickedObject.name);

        // *** IMPORTANT: Change 'PersonalPhoto' to the exact name of your 3D object in the glTF file. ***
        if (clickedObject.name === 'PersonalPhoto') {
            infoPanel.style.display = 'block';
            infoPanel.innerHTML = '<h2>My Personal Photo</h2><p>This is a photo of a memorable trip!</p>';
        } else {
            // Hide the panel if another object is clicked
            infoPanel.style.display = 'none';
        }
    } else {
        // Hide the panel if nothing is clicked
        infoPanel.style.display = 'none';
    }
}

function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// --- Main execution ---
loadModel();
animate();

// --- Event Listeners ---
window.addEventListener('click', onMouseClick, false);
window.addEventListener('resize', onWindowResize, false);
