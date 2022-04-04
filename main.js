import * as THREE from "three";

import { OBJLoader } from "https://unpkg.com/three@0.139.0/examples/jsm/loaders/OBJLoader.js";
import { MTLLoader } from "https://unpkg.com/three@0.139.0/examples/jsm/loaders/MTLLoader.js";
import { OrbitControls } from "https://unpkg.com/three@0.139.0/examples/jsm/controls/OrbitControls.js";
import { RectAreaLightHelper } from "https://unpkg.com/three@0.139.0/examples/jsm/helpers/RectAreaLightHelper.js";

// Camera and Scene Creation

const canvas = document.querySelector("canvas.webgl");
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  10, //fov
  canvas.clientWidth / canvas.clientHeight, //aspect
  0.1, //near
  2000 //far
);
camera.position.set(0, -200, 200);

camera.rotation.x = (46 * Math.PI) / 180;

scene.add(camera);

// Rendering

const sizes = {
  width: canvas.clientWidth,
  height: canvas.clientHeight,
};

const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true });
renderer.setSize(sizes.width, sizes.height);

// const controls = new OrbitControls(camera, renderer.domElement);

scene.add(new THREE.AxesHelper(5));
scene.background = new THREE.Color(0xffffff);

renderer.outputEncoding = THREE.sRGBEncoding;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.25;

// Lights
{
  // var ambientLight = new THREE.AmbientLight(0xff96ad, 0.1);
  // scene.add(ambientLight);
  // Light 2
  const pointLight2 = new THREE.PointLight(0xfbff00, 0.1);
  pointLight2.position.set(50, 50, 20);
  pointLight2.intensity = 0.5;
  scene.add(pointLight2);
  const pointLightHelper2 = new THREE.PointLightHelper(pointLight2, 1);
  scene.add(pointLightHelper2);
  // Light 3
  const pointLight3 = new THREE.PointLight(0x3434eb, 0.5);
  pointLight3.position.set(50, -50, 20);
  pointLight3.intensity = 0.5;
  scene.add(pointLight3);
  const pointLightHelper3 = new THREE.PointLightHelper(pointLight3, 1);
  scene.add(pointLightHelper3);

  // Light 5
  const pointLight5 = new THREE.PointLight(0xc95cff, 0.1);
  pointLight5.position.set(-50, 50, 20);
  pointLight5.intensity = 0.5;
  scene.add(pointLight5);
  const pointLightHelper5 = new THREE.PointLightHelper(pointLight5, 1);
  scene.add(pointLightHelper5);
  // Light 6
  const pointLight6 = new THREE.PointLight(0x005eff, 0.5);
  pointLight6.position.set(-50, -50, 20);
  pointLight6.intensity = 1;
  scene.add(pointLight6);
  const pointLightHelper6 = new THREE.PointLightHelper(pointLight6, 1);
  scene.add(pointLightHelper6);

  // dirLight;
  // const dirLight = new THREE.DirectionalLight(0xffffff, 1);
  // dirLight.position.set(50, 0, 50);
  // dirLight.target.position.set(0, 0, 0);
  // dirLight.target.updateMatrixWorld();
  // scene.add(dirLight);
  // const directionalLightHelper = new THREE.DirectionalLightHelper(dirLight, 5);
  // scene.add(directionalLightHelper);

  //rectLight
  // const rectLight = new THREE.RectAreaLight(0xffffff, 100, 10, 100);
  // rectLight.position.set(50, 0, 0);
  // rectLight.lookAt(-50, 0, 0);
  // scene.add(rectLight);
  // const rectLightHelper = new RectAreaLightHelper(rectLight);
  // scene.add(rectLightHelper);
}

// Grid Creation

const gridSize = 100;
const cubeSize = 1;
const cubeDistance = 0;
const gridCube = new Array(gridSize);

const geometry = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);
// const geometry = new THREE.SphereGeometry(cubeSize, 32, 32);
const material = new THREE.MeshPhysicalMaterial({
  color: 0xffffff,
  // clearcoat: 0.4,
  transparent: true,
});
const cube = new THREE.Mesh(geometry, material);

const resetMap = () => {
  for (let i = 0; i < gridSize; i++) {
    gridCube[i] = new Array(gridSize);
  }
};

const fillMap = () => {
  for (let i = 0; i < gridSize; i++) {
    for (let j = 0; j < gridSize; j++) {
      // let material = new THREE.MeshPhysicalMaterial({
      //   color: 0x0011a8,
      // });
      // gridCube[i][j] = new THREE.Mesh(geometry, material);
      gridCube[i][j] = cube.clone();
      gridCube[i][j].translateX(
        (i + 0.5 - gridSize / 2) * (cubeSize + cubeDistance)
      );
      gridCube[i][j].translateY(
        (j + 0.5 - gridSize / 2) * (cubeSize + cubeDistance)
      );
      scene.add(gridCube[i][j]);
    }
  }
};

// wave creation

let wl = 10; // wavelength
let ap = 1; // amplitude
let sp = 0.5; // speed
let spr = 0.005; // speed of box rotation
let dc1 = new THREE.Vector3(Math.random() * 2 - 1, Math.random() * 2 - 1, 0);
let dc2 = new THREE.Vector3(Math.random() * 2 - 1, Math.random() * 2 - 1, 0);
dc1.normalize();
dc2.normalize();
const temp1 = dc1;
const temp2 = dc2;
let zAxis = new THREE.Vector3(0, 0, -1);
let dc2Perp = dc2.cross(zAxis);
let dc1Perp = dc1.cross(zAxis);
dc2 = temp1;
dc1 = temp2;

const createWave = (t) => {
  let zv1, zv2, zvSum;
  for (let i = 0; i < gridSize; i++) {
    for (let j = 0; j < gridSize; j++) {
      zv1 =
        ap * Math.sin(((i * dc1.x + j * dc1.y) * 2) / wl + (t * sp * 2) / wl);
      zv2 =
        ap * Math.sin(((i * dc2.x + j * dc2.y) * 2) / wl + (t * sp * 2) / wl);
      zvSum = zv1 + zv2;

      // gridCube[i][j].position.set(
      //   gridCube[i][j].position.x,
      //   gridCube[i][j].position.y,
      //   2 * zvSum + 6
      // );
      gridCube[i][j].scale.set(1, 1, 2 * zvSum + 8);
      gridCube[i][j].rotateOnAxis(dc1Perp, -zv1 * spr);
      gridCube[i][j].rotateOnAxis(dc2Perp, -zv2 * spr);
      // gridCube[i][j].material.color.setRGB(
      //   0.1 * (zvSum + 2),
      //   0.4 * (zvSum + 2),
      //   0.8 * (zvSum + 2)
      // );
    }
  }
};

// mouse event listening

document.addEventListener("mousemove", onDocumentMouseMove);

let currentMouseX = 0;
let currentMouseY = 0;
let mouseDiffX = 0;
let mouseDiffY = 0;
let mouseMovement = 0;

function onDocumentMouseMove(event) {
  mouseDiffX = Math.abs(event.clientX - currentMouseX) / window.innerWidth;
  mouseDiffY = Math.abs(event.clientY - currentMouseY) / window.innerHeight;
  currentMouseY = event.clientX;
  currentMouseX = event.clientY;
  if (mouseMovement < 2) {
    mouseMovement += mouseDiffX + mouseDiffY;
  }
}

let t = 1;

function animate() {
  requestAnimationFrame(animate);
  t += 0.1;
  t %= 10000;
  createWave(t);

  dc1.applyAxisAngle(zAxis, 0.0001);
  dc1Perp.applyAxisAngle(zAxis, 0.0001);
  dc2.applyAxisAngle(zAxis, 0.0002);
  dc2Perp.applyAxisAngle(zAxis, 0.0002);

  if (mouseMovement > 1) mouseMovement -= 0.01;

  if (wl > 11 - mouseMovement) {
    wl -= 0.003;
  } else {
    wl += 0.003;
  }

  console.log(wl);

  renderer.render(scene, camera);
}

resetMap();
fillMap();
animate();

console.log(gridCube[1][1].material.color);
