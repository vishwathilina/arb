# 🎓 University Campus Logo AR Project

An augmented reality application that displays your university logo on a building roof using GPS-based AR.

## 📋 Setup Instructions

### 1. Add Your Logo

Place your university logo as `logo.png` in this directory. For best results:

- Use a **PNG file with transparent background**
- Recommended size: 512x512px or 1024x1024px
- Name it exactly: `logo.png`

### 2. Get Building Coordinates

1. Open [Google Maps](https://maps.google.com)
2. Find your building
3. Right-click on the roof → Click the coordinates
4. Copy the latitude and longitude values
5. Update in `index.html` at line 19:
   ```html
   <a-entity
     gps-entity-place="latitude: YOUR_LAT; longitude: YOUR_LNG;"
   ></a-entity>
   ```

### 3. Adjust Logo Position & Size

In `index.html`, modify the `<a-plane>` properties:

- **Height above ground** (roof level):

  ```html
  position="0 15 0"
  <!-- Change 15 to match building height in meters -->
  ```

- **Logo size**:

  ```html
  width="10" height="10"
  <!-- Adjust size in meters -->
  ```

- **Rotation** (if logo appears upside down):
  ```html
  rotation="-90 0 0"
  <!-- Try: 90 0 0, or 0 0 0 -->
  ```

## 🚀 Testing

### Option 1: GPS Testing (Outdoor)

1. Serve the project over HTTPS (required for GPS)
   ```bash
   npx http-server -S -p 8080
   ```
2. Open on your phone: `https://YOUR_IP:8080`
3. Allow camera and location permissions
4. Walk near the building

### Option 2: Marker Testing (Indoor)

1. Print a [Hiro marker](https://raw.githubusercontent.com/AR-js-org/AR.js/master/data/images/hiro.png)
2. Open `index.html` in browser
3. Point camera at the marker
4. Logo should appear on the marker

## 📱 Running on Mobile

### Using Local Network (Recommended for Testing):

```bash
# Install http-server if needed
npm install -g http-server

# Serve with SSL
npx http-server -S -p 8080

# Or use Python (Python 3)
python -m http.server 8080
```

Then access from phone: `https://YOUR_COMPUTER_IP:8080`

### Using GitHub Pages (For Production):

1. Create a GitHub repository
2. Push this project
3. Enable GitHub Pages in Settings
4. Access via `https://yourusername.github.io/repository-name`

## 🔧 Troubleshooting

### Logo not appearing?

- Ensure `logo.png` exists in the project folder
- Check browser console for errors (F12)
- Verify GPS coordinates are correct
- Try increasing the logo size or adjusting position

### GPS not working?

- **HTTPS is required** for GPS/camera access
- Allow location permissions in browser
- GPS accuracy may vary (try outdoor/clear sky)
- Test distance from building (start 10-50 meters away)

### Camera not starting?

- Allow camera permissions
- Use HTTPS (not HTTP)
- Try different browser (Chrome/Safari recommended)

## 🎨 Customization Ideas

1. **Multiple Logos**: Add more `<a-entity gps-entity-place>` blocks for different buildings
2. **Animated Effects**: Modify the `animation` property for different effects
3. **Add Text**: Include university name below the logo:
   ```html
   <a-text value="University Name" position="0 12 0" align="center"></a-text>
   ```
4. **Interactive**: Add click events to show information about the building

## 📚 Resources

- [AR.js Documentation](https://ar-js-org.github.io/AR.js-Docs/)
- [A-Frame Documentation](https://aframe.io/docs/)
- [Hiro Marker Download](https://raw.githubusercontent.com/AR-js-org/AR.js/master/data/images/hiro.png)

## 🎯 Quick Start Checklist

- [ ] Add `logo.png` to project folder
- [ ] Update GPS coordinates in `index.html`
- [ ] Adjust logo height to match building
- [ ] Test with Hiro marker first
- [ ] Serve over HTTPS
- [ ] Test on mobile device at location

---

**Note**: For NSBM Green University, example coordinates are already set (6.8211, 79.9617). Adjust to your specific building!
