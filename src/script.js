import * as THREE from "three";
import "./style.css";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

import ANIMFBX from "../static/models/anim.fbx";

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);
scene.fog = new THREE.Fog(0x000000, 1, 20);

const clock = new THREE.Clock();

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.z = 4;
camera.position.y = 2;

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;

// const controls = new OrbitControls(camera, renderer.domElement);
// controls.target.set(0, 3, 0);
// controls.update();

document.body.appendChild(renderer.domElement);

const geometry = new THREE.PlaneGeometry(50, 50);
const material = new THREE.MeshPhongMaterial({
  color: 0x999999,
  side: THREE.DoubleSide,
  depthWrite: false,
});

//90 deg in radians = 1.5708
const cube = new THREE.Mesh(geometry, material);
cube.receiveShadow = true;
cube.rotation.x = 1.5708;
scene.add(cube);

const grid = new THREE.GridHelper(20, 20, 0x000000, 0x000000);
grid.material.opacity = 0.2;
grid.material.transparent = true;
scene.add(grid);

const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, 1.5);
hemiLight.position.set(0, 200, 0);
scene.add(hemiLight);

const dirLight = new THREE.DirectionalLight(0xffffff, 1.5);
dirLight.position.set(0, 200, 100);
dirLight.castShadow = true;
dirLight.shadow.camera.top = 5;
dirLight.shadow.camera.bottom = -5;
dirLight.shadow.camera.left = -5;
dirLight.shadow.camera.right = 5;
scene.add(dirLight);

const loader = new FBXLoader();
let mixer;

const loadingDom = document.getElementById("loading");

loader.load(ANIMFBX, function (object) {
  loadingDom.style.display = "none";
  mixer = new THREE.AnimationMixer(object);
  const action = mixer.clipAction(object.animations[0]);
  action.play();

  object.scale.x = 0.02;
  object.scale.y = 0.02;
  object.scale.z = 0.02;

  //castShadow

  object.traverse(function (child) {
    if (child.isMesh) {
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });

  scene.add(object);
});

const animate = function () {
  requestAnimationFrame(animate);
  const delta = clock.getDelta();
  renderer.render(scene, camera);
  // if (mixer) mixer.setTime(2);
};

animate();

onscroll = function () {
  console.log("anan");
  console.log(window.scrollY);
  if (mixer) mixer.setTime(Math.abs(this.window.scrollY / 500));
};
