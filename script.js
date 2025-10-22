// Simple GPS + model-viewer helper
const TARGET_LAT = 6.8206; // change to your target
const TARGET_LON = 80.0390;
const TRIGGER_RADIUS = 50; // meters

const latEl = document.getElementById('lat');
const lonEl = document.getElementById('lon');
const distEl = document.getElementById('distance');
const statusEl = document.getElementById('status');
const mv = document.getElementById('mv');

function toFixedOrDash(v, n=4){ return (typeof v === 'number') ? v.toFixed(n) : '--'; }

function calculateDistance(lat1, lon1, lat2, lon2){
  const R = 6371e3;
  const φ1 = lat1 * Math.PI/180;
  const φ2 = lat2 * Math.PI/180;
  const Δφ = (lat2-lat1) * Math.PI/180;
  const Δλ = (lon2-lon1) * Math.PI/180;
  const a = Math.sin(Δφ/2)*Math.sin(Δφ/2) + Math.cos(φ1)*Math.cos(φ2)*Math.sin(Δλ/2)*Math.sin(Δλ/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

if(navigator.geolocation){
  navigator.geolocation.watchPosition(pos => {
    const uLat = pos.coords.latitude;
    const uLon = pos.coords.longitude;
    const distance = calculateDistance(uLat,uLon,TARGET_LAT,TARGET_LON);
    latEl.textContent = toFixedOrDash(uLat,4);
    lonEl.textContent = toFixedOrDash(uLon,4);
    distEl.textContent = (distance).toFixed(1);
    if(distance <= TRIGGER_RADIUS){
      statusEl.textContent = 'Within range — tap AR button to view';
      statusEl.style.color = '#0f0';
      // Optionally auto-enter AR: mv.enterAR(); // experimental
    } else {
      statusEl.textContent = `Get closer (within ${TRIGGER_RADIUS}m)`;
      statusEl.style.color = '#fa0';
    }
  }, err => {
    statusEl.textContent = 'GPS error: '+err.message;
    statusEl.style.color = '#f66';
  },{enableHighAccuracy:true, maximumAge: 0, timeout:5000});
} else {
  statusEl.textContent = 'Geolocation not supported';
}
