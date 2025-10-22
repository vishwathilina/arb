/**
 * WebAR GPS-Anchored 3D Model Viewer
 * Uses Three.js + WebXR for GPS-based augmented reality
 */

// ============ CONFIGURATION ============
const CONFIG = {
  targetLat: 6.821,        // Target latitude
  targetLon: 80.040,       // Target longitude
  triggerRadius: 50,        // Distance in meters
  modelPath: 'assets/logo2.glb',
  modelScale: 1,
  rotationSpeed: 0.005
};

// ============ GLOBAL VARS ============
let scene, camera, renderer, model;
let currentLat = null, currentLon = null, currentDistance = null;
let latEl, lonEl, distEl, statusEl, arButton;

// ============ WAIT FOR DOM ============
document.addEventListener('DOMContentLoaded', () => {
  // Get DOM elements
  latEl = document.getElementById('lat');
  lonEl = document.getElementById('lon');
  distEl = document.getElementById('distance');
  statusEl = document.getElementById('status');
  arButton = document.getElementById('arButton');
  
  console.log('DOM ready. Initializing...');
  
  // Initialize Three.js
  initThreeJS();
  
  // Start GPS tracking
  startGPS();
});

// ============ THREE.JS SETUP ============
function initThreeJS() {
  console.log('Initializing Three.js...');
  
  // Scene
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x000000);
  
  // Camera
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 3;
  
  // Renderer
  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.xr.enabled = true;
  document.body.appendChild(renderer.domElement);
  
  // Lighting
  const light = new THREE.DirectionalLight(0xffffff, 0.8);
  light.position.set(5, 10, 7);
  scene.add(light);
  
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
  scene.add(ambientLight);
  
  // Load 3D model
  loadModel();
  
  // Handle window resize
  window.addEventListener('resize', onWindowResize);
  
  // Start render loop
  renderer.setAnimationLoop((time, frame) => {
    if (model) {
      model.rotation.y += CONFIG.rotationSpeed;
    }
    renderer.render(scene, camera);
  });
  
  console.log('Three.js initialized');
}

function loadModel() {
  console.log('Loading model...');
  // Create a simple rotating cube for now
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshStandardMaterial({ 
    color: 0x0084ff,
    metalness: 0.5,
    roughness: 0.5
  });
  model = new THREE.Mesh(geometry, material);
  model.scale.set(CONFIG.modelScale, CONFIG.modelScale, CONFIG.modelScale);
  scene.add(model);
  
  console.log('Model loaded (cube placeholder)');
  
  // TODO: Load actual GLB model when ready
  // const loader = new THREE.GLTFLoader();
  // loader.load(CONFIG.modelPath, (gltf) => {
  //   model = gltf.scene;
  //   model.scale.set(CONFIG.modelScale, CONFIG.modelScale, CONFIG.modelScale);
  //   scene.add(model);
  //   console.log('GLB model loaded');
  // }, undefined, (error) => {
  //   console.error('Error loading model:', error);
  // });
}

function onWindowResize() {
  const w = window.innerWidth;
  const h = window.innerHeight;
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
  renderer.setSize(w, h);
}

// ============ GPS & DISTANCE CALCULATION ============
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371e3; // Earth radius in meters
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;
  
  const a = 
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  
  return R * c; // Distance in meters
}

function updateUI(lat, lon, distance) {
  latEl.textContent = lat.toFixed(4);
  lonEl.textContent = lon.toFixed(4);
  distEl.textContent = distance.toFixed(1);
  
  const inRange = distance <= CONFIG.triggerRadius;
  
  if (inRange) {
    statusEl.innerHTML = '✓ <b>Within range!</b><br><small>AR ready</small>';
    statusEl.style.color = '#00ff00';
    arButton.classList.add('active');
  } else {
    const remaining = (distance - CONFIG.triggerRadius).toFixed(1);
    statusEl.innerHTML = `⚠ Get closer<br><small>${remaining}m more</small>`;
    statusEl.style.color = '#ffaa00';
    arButton.classList.remove('active');
  }
}

function startGPS() {
  console.log('Starting GPS tracking...');
  
  if (!navigator.geolocation) {
    statusEl.textContent = '❌ Geolocation not supported';
    statusEl.style.color = '#ff4444';
    console.error('Geolocation not available');
    return;
  }
  
  statusEl.textContent = '📍 Requesting location...';
  statusEl.style.color = '#aaf';
  
  navigator.geolocation.watchPosition(
    (position) => {
      currentLat = position.coords.latitude;
      currentLon = position.coords.longitude;
      currentDistance = calculateDistance(currentLat, currentLon, CONFIG.targetLat, CONFIG.targetLon);
      updateUI(currentLat, currentLon, currentDistance);
    },
    (error) => {
      let msg = 'GPS Error';
      if (error.code === 1) msg = 'Location permission denied';
      else if (error.code === 2) msg = 'Location unavailable';
      else if (error.code === 3) msg = 'Location timeout';
      
      statusEl.textContent = '❌ ' + msg;
      statusEl.style.color = '#ff4444';
      console.error('Geolocation error:', error);
    },
    {
      enableHighAccuracy: true,
      maximumAge: 0,
      timeout: 5000
    }
  );
}

// ============ WEBXR AR MODE ============
async function enterARMode() {
  console.log('Entering AR mode...');
  
  if (!navigator.xr) {
    alert('WebXR not supported on this device');
    console.error('WebXR not available');
    return;
  }
  
  try {
    const session = await navigator.xr.requestSession('immersive-ar', {
      requiredFeatures: ['dom-overlay'],
      domOverlay: { root: document.body }
    });
    renderer.xr.setSession(session);
    console.log('AR session started');
  } catch (err) {
    console.error('AR session error:', err);
    alert('Could not start AR session: ' + err.message);
  }
}

// ============ EVENT LISTENERS ============
document.addEventListener('DOMContentLoaded', () => {
  if (arButton) {
    arButton.addEventListener('click', enterARMode);
  }
});
