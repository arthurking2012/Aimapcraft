/**
 * Geographic Tile & Satellite Relief Engine
 * რეალური გეოგრაფიული რუკების, სატელიტური ფოტოების, რელიეფისა და ფილების მართვა
 */

export class GeoTileEngine {
  constructor() {
    this.tileCache = new Map();
    this.customMapImage = null;
    this.customMapOpacity = 0.85;
    this.activeLayer = "satellite"; // "satellite", "topography", "carto_detailed", "parchment", "dark_tactical", "custom"

    // Geographic Tile Sources (High availability public Web Mercator tile servers)
    this.tileServers = {
      satellite: {
        name: "სატელიტური რუკა (Real Satellite Photos)",
        url: (x, y, z) => `https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/${z}/${y}/${x}`,
        maxZoom: 18,
        attribution: "ESRI / Satellite Imagery"
      },
      topography: {
        name: "ტოპოგრაფიული რელიეფი (Shaded Relief & Mountains)",
        url: (x, y, z) => `https://a.tile.opentopomap.org/${z}/${x}/${y}.png`,
        maxZoom: 17,
        attribution: "OpenTopoMap / Relief"
      },
      carto_detailed: {
        name: "დეტალური პოლიტიკური და გზების რუკა",
        url: (x, y, z) => `https://a.tile.openstreetmap.org/${z}/${x}/${y}.png`,
        maxZoom: 19,
        attribution: "OpenStreetMap Contributors"
      },
      dark_tactical: {
        name: "ტაქტიკური მუქი რუკა",
        url: (x, y, z) => `https://a.basemaps.cartocdn.com/dark_all/${z}/${x}/${y}.png`,
        maxZoom: 19,
        attribution: "CartoDB Dark"
      }
    };

    // Real world coordinate presets for geographic theaters
    this.theaterGeoBounds = {
      caucasus: { centerLat: 42.3, centerLng: 43.4, zoomLevel: 7, countryName: "საქართველო / GEORGIA", regionName: "კავკასიონი და შავი ზღვა" },
      abkhazia: { centerLat: 43.0, centerLng: 41.0, zoomLevel: 9, countryName: "საქართველო • აფხაზეთი", regionName: "შავიზღვისპირეთი" },
      american_civil_war: { centerLat: 38.5, centerLng: -77.5, zoomLevel: 6, countryName: "აშშ / USA", regionName: "ვირჯინია & პოტომაკი" },
      europe_napoleon: { centerLat: 49.0, centerLng: 15.0, zoomLevel: 6, countryName: "ცენტრალური ევროპა", regionName: "მორავია & დუნაი" },
      ww2_eastern_front: { centerLat: 48.7, centerLng: 44.5, zoomLevel: 6, countryName: "აღმოსავლეთ ევროპა", regionName: "ვოლგა & დონი" },
      ancient_mediterranean: { centerLat: 41.2, centerLng: 15.5, zoomLevel: 6, countryName: "იტალია & ხმელთაშუაზღვა", regionName: "აპულიის რეგიონი" },
      middle_east: { centerLat: 31.8, centerLng: 35.2, zoomLevel: 7, countryName: "ახლო აღმოსავლეთი", regionName: "ლევანტის რეგიონი" },
      general_plains: { centerLat: 45.0, centerLng: 20.0, zoomLevel: 6, countryName: "ისტორიული რეგიონი", regionName: "საბრძოლო თეატრი" }
    };
  }

  setLayer(layerKey) {
    if (this.tileServers[layerKey] || layerKey === "custom" || layerKey === "parchment") {
      this.activeLayer = layerKey;
    }
  }

  setCustomMap(imgElement, opacity = 0.85) {
    this.customMapImage = imgElement;
    this.customMapOpacity = opacity;
    this.activeLayer = "custom";
  }

  /**
   * Convert Latitude/Longitude to Tile coordinates
   */
  latLngToTile(lat, lng, zoom) {
    const n = Math.pow(2, zoom);
    const x = Math.floor(((lng + 180) / 360) * n);
    const latRad = (lat * Math.PI) / 180;
    const y = Math.floor(
      ((1 - Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI) / 2) * n
    );
    return { x, y, z: zoom };
  }

  /**
   * Load tile image with memory cache
   */
  getTileImage(x, y, z, layerKey) {
    const key = `${layerKey}_${z}_${x}_${y}`;
    if (this.tileCache.has(key)) {
      return this.tileCache.get(key);
    }

    const server = this.tileServers[layerKey];
    if (!server) return null;

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = server.url(x, y, z);
    img.onload = () => {
      img._loaded = true;
    };
    img.onerror = () => {
      img._error = true;
    };

    this.tileCache.set(key, img);
    return img;
  }

  /**
   * Render Geographic Base Map onto Canvas
   */
  renderGeoBackground(ctx, w, h, zoom, panX, panY, theaterKey) {
    // 1. If custom uploaded map image
    if (this.activeLayer === "custom" && this.customMapImage) {
      ctx.save();
      ctx.globalAlpha = this.customMapOpacity;
      ctx.drawImage(this.customMapImage, 0, 0, 1000, 650);
      ctx.restore();
      return;
    }

    // 2. If procedural parchment is selected
    if (this.activeLayer === "parchment") {
      return; // Handled by MapRenderer base procedural canvas
    }

    // 3. Render Real World Geographic Tiles
    const geoInfo = this.theaterGeoBounds[theaterKey] || this.theaterGeoBounds.general_plains;
    const baseZ = geoInfo.zoomLevel || 6;
    const effectiveZ = Math.max(1, Math.min(18, Math.round(baseZ + Math.log2(zoom))));

    const centerTile = this.latLngToTile(geoInfo.centerLat, geoInfo.centerLng, effectiveZ);
    const tileSize = 256;

    // Draw tile grid in virtual coordinate space (1000x650)
    ctx.save();
    
    // Slight vignette effect on satellite images
    const tilesAcross = 5;
    const tilesDown = 4;
    const startX = 500 - (tilesAcross / 2) * tileSize;
    const startY = 325 - (tilesDown / 2) * tileSize;

    for (let dx = -2; dx <= 2; dx++) {
      for (let dy = -2; dy <= 2; dy++) {
        const tx = centerTile.x + dx;
        const ty = centerTile.y + dy;
        const img = this.getTileImage(tx, ty, effectiveZ, this.activeLayer);

        const drawX = 500 + dx * tileSize - tileSize / 2;
        const drawY = 325 + dy * tileSize - tileSize / 2;

        if (img && img._loaded) {
          ctx.drawImage(img, drawX, drawY, tileSize, tileSize);
        } else {
          // Placeholder gradient while tile loads
          ctx.fillStyle = this.activeLayer === "dark_tactical" ? "#0f172a" : "#cbd5e1";
          ctx.fillRect(drawX, drawY, tileSize, tileSize);
        }
      }
    }

    // Real Country & Region Watermark Banner on the terrain
    ctx.font = "bold 13px 'Noto Sans Georgian', sans-serif";
    ctx.fillStyle = this.activeLayer === "dark_tactical" ? "rgba(255,255,255,0.7)" : "rgba(15,23,42,0.75)";
    ctx.textAlign = "left";
    ctx.fillText(`📍 ${geoInfo.countryName} • ${geoInfo.regionName}`, 30, 620);

    ctx.restore();
  }
}
