# 🌍 WebAR GPS-Anchored 3D Model Viewer

A web-based Augmented Reality application that displays a 3D model (from Blender) anchored at a real-world GPS location. Works fully in a browser—no app installation required!

## 📁 Files

| File | Purpose |
|------|---------|
| `index.html` | **Main GPS-anchored AR page** (A-Frame + AR.js) — use this for true geo-anchoring |
| `index_mv.html` | Alternative model-viewer approach (simplified, platform AR) |
| `script.js` | GPS distance helper for `index_mv.html` |
| `assets/` | Folder for your 3D models, HDRi, and other media |

## 🚀 Quick Start

### 1. Prepare Your 3D Model
- Export a `.glb` or `.gltf` file from Blender
- Place it in `assets/logo1.glb` (or update paths in `index.html`)
- Ensure the model is under ~5MB for fast loading

### 2. Set Your Target Location
Edit `index.html` (lines 79–84) and update:
```javascript
const TARGET_LAT = 6.8206;       // Your target latitude
const TARGET_LON = 80.0390;      // Your target longitude
const TRIGGER_RADIUS = 50;       // Show model when within 50 meters
```

Get coordinates from **Google Maps**: right-click on location → copy coordinates.

### 3. Test Locally
Serve files over HTTPS or via a local tunnel (AR + geolocation require HTTPS):

**Option A: Python HTTP server + ngrok**
```bash
python3 -m http.server 8000
# In another terminal:
ngrok http 8000
# Open the ngrok HTTPS URL on your phone
```

**Option B: VS Code Live Server** (with HTTPS tunnel)
- Install "Live Server" extension
- Right-click `index.html` → "Open with Live Server"
- Use ngrok to expose the local server over HTTPS

### 4. Deploy to Cloudflare Pages

1. **Push your repo to GitHub:**
   ```bash
   git add .
   git commit -m "Add WebAR GPS demo"
   git push origin main
   ```

2. **Create a Pages project:**
   - Go to [Cloudflare Dashboard](https://dash.cloudflare.com) → Pages → Create project
   - Connect your GitHub repo (`vishwathilina/arb`)
   - Select the `main` branch

3. **Configure build settings:**
   - **Framework preset:** None (Static)
   - **Build command:** (leave blank)
   - **Build output directory:** `/`
   - Click **Save and Deploy**

4. **Your app is live!** 🎉
   - Visit `https://<your-project>.pages.dev`
   - Open on your phone, allow location & camera permissions
   - Walk to your target location to see the model

## ⚙️ Customization

### Change the 3D Model
In `index.html`, update the `gltf-model` path:
```html
<a-entity gltf-model="/public/logo1.glb" ...></a-entity>
```
Or if storing in `assets/`:
```html
<a-entity gltf-model="/assets/my-model.glb" ...></a-entity>
```

### Adjust Model Size & Rotation
```html
<!-- Scale up 2x, rotate faster -->
<a-entity gltf-model="/public/logo1.glb" 
          scale="2 2 2" 
          animation="property: rotation; to: 0 360 0; loop: true; dur: 5000;">
</a-entity>
```

### Change Detection Radius
```javascript
const TRIGGER_RADIUS = 100;  // Show model when within 100 meters
```

### Add Position Offset
```html
<!-- Lift model 5 meters above ground -->
<a-entity position="0 5 0" gltf-model="/public/logo1.glb"></a-entity>
```

## 🧪 Testing Without GPS

Use the **Hiro marker** (QR-like pattern) included in the scene:
- Print or display the [Hiro marker](https://cdn.jsdelivr.net/gh/AR-js-org/AR.js@master/data/images/hiro.png)
- Point your camera at it to see the model in AR
- This works indoors without GPS

## 📱 Browser & Device Support

| Browser | OS | AR Support |
|---------|----|----|
| Chrome | Android | ✅ WebXR (ARCore) |
| Firefox | Android | ✅ WebXR (ARCore) |
| Safari | iOS | ✅ WebXR (ARKit) |
| Chrome | iOS | ⚠️ Limited (via redirect) |

**Note:** GPS and camera must be enabled for full functionality.

## 🐛 Troubleshooting

### "GPS Error: Location permission denied"
- Open browser settings → allow location access
- On iOS: Settings → Privacy → Location → Safari → Allow

### "Geolocation not supported"
- Use HTTPS (not HTTP)
- Some browsers require a secure context

### Model not appearing
- Check browser console for errors (F12 → Console)
- Ensure model file exists at the path specified
- Verify you're within `TRIGGER_RADIUS` meters of target
- Test with Hiro marker first to check AR generally works

### Model loads slowly
- Compress the GLB (Blender export settings)
- Use a CDN for static assets
- Check network tab in DevTools (F12)

## 🔗 Resources

- [A-Frame Documentation](https://aframe.io/docs/)
- [AR.js Geolocation](https://ar-js-org.github.io/AR.js-Docs/geolocation/)
- [Blender GLB Export Guide](https://docs.blender.org/manual/en/latest/addons/import_export/scene_gltf.html)
- [Cloudflare Pages Docs](https://developers.cloudflare.com/pages/)

## 💡 Next Steps

- **Add UI controls** to scale/rotate the model in real-time
- **Integrate a backend** for dynamic locations and models
- **Add sound effects** when model is triggered
- **Create multiple AR anchors** at different locations
- **Store location history** with timestamps

---

**Made with ❤️ for AR experiences**
