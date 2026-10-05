/**
 * Canvas 2D Documentary War Map Renderer
 * 2D ანიმაციური ისტორიული რუკის გრაფიკული ძრავა (Satellite, Topo Relief & Tactical 2D)
 */

import { GeoTileEngine } from "./geoTileEngine.js";

export class MapRenderer {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    
    // Viewport transform (Zoom & Pan)
    this.zoom = 1.0;
    this.panX = 0;
    this.panY = 0;
    this.minZoom = 0.4;
    this.maxZoom = 5.0;
    
    // Canvas dimensions (ensure safe defaults even if offscreen)
    this.width = canvas.width || 1000;
    this.height = canvas.height || 650;

    // Geographic Tile Engine (Satellite, Topo Relief, OSM, Custom Upload)
    this.geoEngine = new GeoTileEngine();

    // Display options
    this.theme = "satellite"; // "satellite", "topography", "carto_detailed", "parchment", "dark_tactical", "custom"
    this.showTerritory = true;
    this.showTacticalDetails = true;
    this.showLabels = true;
    this.showGrid = true;
    this.showSatelliteRelief = true;

    // Selection & Inspection
    this.selectedEntity = null;
    this.hoveredEntity = null;

    // Animation & FX states
    this.animTime = 0;
    this.sparks = [];

    this.resize();
    if (typeof window !== "undefined") {
      window.addEventListener("resize", () => this.resize());
    }
  }

  resize() {
    const dpr = (typeof window !== "undefined" && window.devicePixelRatio) ? window.devicePixelRatio : 1;
    const rect = this.canvas.getBoundingClientRect ? this.canvas.getBoundingClientRect() : null;
    
    if (rect && rect.width > 0 && rect.height > 0) {
      this.width = rect.width;
      this.height = rect.height;
      this.canvas.width = Math.round(rect.width * dpr);
      this.canvas.height = Math.round(rect.height * dpr);
    } else {
      this.width = this.canvas.width || 1000;
      this.height = this.canvas.height || 650;
    }
  }

  screenToWorld(screenX, screenY) {
    const w = this.width;
    const h = this.height;
    const worldX = (screenX - (w / 2 + this.panX)) / this.zoom + 500;
    const worldY = (screenY - (h / 2 + this.panY)) / this.zoom + 325;
    return { x: worldX, y: worldY };
  }

  worldToScreen(worldX, worldY) {
    const w = this.width;
    const h = this.height;
    const screenX = (worldX - 500) * this.zoom + (w / 2 + this.panX);
    const screenY = (worldY - 325) * this.zoom + (h / 2 + this.panY);
    return { x: screenX, y: screenY };
  }

  findEntityAt(screenX, screenY, scenario, currentState) {
    if (!scenario || !currentState) return null;
    const world = this.screenToWorld(screenX, screenY);

    if (scenario.armies && currentState.armyPositions) {
      for (const army of scenario.armies) {
        const pos = currentState.armyPositions[army.id];
        if (pos && pos.status !== "eliminated") {
          const dist = Math.hypot(world.x - pos.x, world.y - pos.y);
          if (dist <= 35 / Math.min(1, this.zoom * 0.8)) {
            return { type: "army", id: army.id, army: army, pos: pos };
          }
        }
      }
    }

    if (scenario.cities) {
      for (const city of scenario.cities) {
        const dist = Math.hypot(world.x - city.x, world.y - city.y);
        if (dist <= 30 / Math.min(1, this.zoom * 0.8)) {
          const state = currentState.cityStates?.find(s => s.id === city.id) || city;
          return { type: "city", id: city.id, city: city, state: state };
        }
      }
    }

    return null;
  }

  render(scenario, currentState) {
    if (!scenario || !currentState) return;

    this.animTime += 0.016;
    const ctx = this.ctx;
    const w = this.width;
    const h = this.height;
    const dpr = (typeof window !== "undefined" && window.devicePixelRatio) ? window.devicePixelRatio : 1;

    // 1. Clear Screen Canvas
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(dpr, dpr);
    this.renderBaseBackground(ctx, w, h);
    ctx.restore();

    // 2. World Transform (Zoom & Pan)
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(dpr, dpr);
    ctx.translate(w / 2 + this.panX, h / 2 + this.panY);
    ctx.scale(this.zoom, this.zoom);
    ctx.translate(-500, -325);

    // 3. Real-World Geographic Satellite / Topographic Relief Tiles
    if (this.showSatelliteRelief && this.theme !== "parchment") {
      this.geoEngine.renderGeoBackground(ctx, w, h, this.zoom, this.panX, this.panY, scenario.theater || "general_plains");
    }

    // 4. Cartographic Grid & Coordinates
    if (this.showGrid) {
      this.renderGrid(ctx);
    }

    // 5. Procedural Terrain (Rivers, Mountain Ridges, Forests)
    this.renderTerrain(ctx, scenario.terrain);

    // 6. Dynamic Territory Control Shading (Frontlines)
    if (this.showTerritory) {
      this.renderTerritoryControl(ctx, scenario, currentState);
    }

    // 7. Tactical Arrows
    this.renderArrows(ctx, currentState.arrows || []);

    // 8. Cities, Fortresses, Capitals
    this.renderCities(ctx, scenario.cities, currentState.cityStates, scenario.factions);

    // 9. 2D Square/Rectangular Military Formations
    this.renderUnits(ctx, scenario.armies, currentState.armyPositions, scenario.factions);

    // 10. Combat Clashes & Flashes
    this.renderCombatFX(ctx, currentState.battleClashes || []);

    // 11. Selection Highlight
    if (this.selectedEntity) {
      this.renderSelectionHighlight(ctx, scenario, currentState);
    }

    ctx.restore();

    // 12. Screen HUD (Scale bar, Compass)
    this.renderHUD(ctx, w, h, scenario);
  }

  renderBaseBackground(ctx, w, h) {
    if (this.theme === "parchment") {
      const bgGrad = ctx.createRadialGradient(w / 2, h / 2, 80, w / 2, h / 2, Math.max(w, h));
      bgGrad.addColorStop(0, "#fbf6ea");
      bgGrad.addColorStop(0.7, "#f2e6cb");
      bgGrad.addColorStop(1, "#decba4");
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, w, h);

      ctx.fillStyle = "rgba(139, 94, 60, 0.035)";
      for (let i = 0; i < h; i += 7) {
        ctx.fillRect(0, i, w, 1.5);
      }
    } else if (this.theme === "dark_tactical") {
      ctx.fillStyle = "#090d16";
      ctx.fillRect(0, 0, w, h);
    } else {
      ctx.fillStyle = "#1e293b";
      ctx.fillRect(0, 0, w, h);
    }
  }

  renderGrid(ctx) {
    ctx.save();
    ctx.strokeStyle = this.theme === "parchment" ? "rgba(120, 90, 40, 0.1)" : "rgba(255, 255, 255, 0.1)";
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 6]);

    for (let x = 0; x <= 1000; x += 100) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, 650);
      ctx.stroke();
    }
    for (let y = 0; y <= 650; y += 100) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(1000, y);
      ctx.stroke();
    }
    ctx.restore();
  }

  renderTerrain(ctx, terrain) {
    if (!terrain) return;
    ctx.save();

    // Rivers
    if (terrain.rivers) {
      terrain.rivers.forEach(pts => {
        if (pts.length < 2) return;
        ctx.strokeStyle = "#38bdf8";
        ctx.lineWidth = 4;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.beginPath();
        ctx.moveTo(pts[0].x, pts[0].y);
        for (let i = 1; i < pts.length; i++) {
          ctx.lineTo(pts[i].x, pts[i].y);
        }
        ctx.stroke();

        ctx.strokeStyle = "rgba(56, 189, 248, 0.35)";
        ctx.lineWidth = 8;
        ctx.stroke();
      });
    }

    // Mountain Ridges with elevation labels
    if (terrain.mountains) {
      terrain.mountains.forEach(m => {
        ctx.fillStyle = this.theme === "parchment" ? "rgba(168, 140, 100, 0.35)" : "rgba(100, 116, 139, 0.4)";
        ctx.strokeStyle = this.theme === "parchment" ? "#8b7355" : "#94a3b8";
        ctx.lineWidth = 1.8;

        ctx.beginPath();
        ctx.moveTo(m.x - m.radius, m.y + m.radius * 0.4);
        ctx.lineTo(m.x, m.y - m.radius * 0.6);
        ctx.lineTo(m.x + m.radius, m.y + m.radius * 0.4);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(m.x, m.y - m.radius * 0.6);
        ctx.lineTo(m.x - m.radius * 0.2, m.y + m.radius * 0.4);
        ctx.stroke();

        if (m.label && this.showLabels) {
          ctx.font = "italic 11px 'Noto Sans Georgian', serif";
          ctx.fillStyle = this.theme === "parchment" ? "#6b4f2c" : "#e2e8f0";
          ctx.textAlign = "center";
          ctx.fillText(`⛰️ ${m.label}`, m.x, m.y + m.radius * 0.85);
        }
      });
    }

    // Forests
    if (terrain.forests) {
      terrain.forests.forEach(f => {
        ctx.fillStyle = "rgba(34, 197, 94, 0.22)";
        ctx.strokeStyle = "rgba(34, 197, 94, 0.5)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(f.x, f.y, f.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      });
    }

    ctx.restore();
  }

  renderTerritoryControl(ctx, scenario, currentState) {
    ctx.save();
    ctx.globalCompositeOperation = "screen";

    scenario.factions.forEach(faction => {
      const factionCities = scenario.cities.filter(c => {
        const cs = currentState.cityStates?.find(s => s.id === c.id);
        return (cs ? cs.ownerFactionId : c.ownerFactionId) === faction.id;
      });

      const factionArmies = scenario.armies.filter(a => a.factionId === faction.id);

      factionCities.forEach(c => {
        const grad = ctx.createRadialGradient(c.x, c.y, 10, c.x, c.y, 180);
        grad.addColorStop(0, faction.lightColor || "rgba(37, 99, 235, 0.3)");
        grad.addColorStop(0.7, faction.lightColor || "rgba(37, 99, 235, 0.12)");
        grad.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(c.x, c.y, 180, 0, Math.PI * 2);
        ctx.fill();
      });

      factionArmies.forEach(a => {
        const pos = currentState.armyPositions[a.id];
        if (pos && pos.status !== "eliminated" && pos.status !== "disbanded") {
          const grad = ctx.createRadialGradient(pos.x, pos.y, 10, pos.x, pos.y, 140);
          grad.addColorStop(0, faction.lightColor || "rgba(37, 99, 235, 0.25)");
          grad.addColorStop(1, "rgba(0,0,0,0)");
          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(pos.x, pos.y, 140, 0, Math.PI * 2);
          ctx.fill();
        }
      });
    });

    ctx.restore();
  }

  renderCities(ctx, cities, cityStates, factions) {
    if (!cities) return;
    ctx.save();

    cities.forEach(city => {
      const state = cityStates?.find(s => s.id === city.id) || { ownerFactionId: city.ownerFactionId, isBesieged: city.isBesieged };
      const faction = factions.find(f => f.id === state.ownerFactionId) || factions[0];
      const isBesieged = state.isBesieged;

      if (isBesieged) {
        ctx.save();
        ctx.strokeStyle = "#dc2626";
        ctx.lineWidth = 2.5;
        ctx.setLineDash([6, 6]);
        ctx.lineDashOffset = -this.animTime * 15;
        ctx.beginPath();
        ctx.arc(city.x, city.y, 24 + Math.sin(this.animTime * 4) * 2, 0, Math.PI * 2);
        ctx.stroke();

        ctx.font = "bold 10px 'Noto Sans Georgian', sans-serif";
        ctx.fillStyle = "#dc2626";
        ctx.textAlign = "center";
        ctx.fillText("ალყა (Siege)", city.x, city.y - 28);
        ctx.restore();
      }

      ctx.fillStyle = faction.primaryColor;
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 2;

      if (city.importance === "capital") {
        ctx.beginPath();
        ctx.rect(city.x - 12, city.y - 12, 24, 24);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = "#ffffff";
        ctx.fillRect(city.x - 5, city.y - 5, 10, 10);
      } else if (city.importance === "fortress") {
        ctx.beginPath();
        ctx.moveTo(city.x, city.y - 12);
        ctx.lineTo(city.x + 12, city.y);
        ctx.lineTo(city.x, city.y + 12);
        ctx.lineTo(city.x - 12, city.y);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      } else {
        ctx.beginPath();
        ctx.arc(city.x, city.y, 7, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      }

      if (this.showLabels) {
        ctx.font = "600 12px 'Noto Sans Georgian', sans-serif";
        ctx.textAlign = "center";
        const textWidth = ctx.measureText(city.name).width;

        ctx.fillStyle = "rgba(15, 23, 42, 0.9)";
        ctx.strokeStyle = faction.primaryColor;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.roundRect(city.x - textWidth / 2 - 6, city.y + 15, textWidth + 12, 18, 4);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = "#ffffff";
        ctx.fillText(city.name, city.x, city.y + 28);
      }
    });

    ctx.restore();
  }

  renderUnits(ctx, armies, armyPositions, factions) {
    if (!armies || !armyPositions) return;
    ctx.save();

    const isTacticalZoom = this.zoom >= 1.6 && this.showTacticalDetails;

    armies.forEach(army => {
      const pos = armyPositions[army.id];
      if (!pos || pos.status === "eliminated") return;

      const faction = factions.find(f => f.id === army.factionId) || factions[0];
      const isDisbanded = pos.status === "disbanded";
      const isInCombat = pos.status === "in_combat";

      ctx.save();
      ctx.translate(pos.x, pos.y);

      if (isDisbanded) {
        ctx.globalAlpha = 0.45;
      }

      if (!isTacticalZoom) {
        const unitW = 54;
        const unitH = 34;

        ctx.fillStyle = "rgba(0, 0, 0, 0.35)";
        ctx.fillRect(-unitW / 2 + 3, -unitH / 2 + 3, unitW, unitH);

        ctx.fillStyle = faction.primaryColor;
        ctx.fillRect(-unitW / 2, -unitH / 2, unitW, unitH);

        ctx.strokeStyle = isInCombat ? (Math.sin(this.animTime * 15) > 0 ? "#facc15" : "#ffffff") : "#ffffff";
        ctx.lineWidth = isInCombat ? 2.5 : 1.5;
        ctx.strokeRect(-unitW / 2, -unitH / 2, unitW, unitH);

        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        if (army.unitType === "cavalry") {
          ctx.moveTo(-unitW / 2 + 8, unitH / 2 - 6);
          ctx.lineTo(unitW / 2 - 8, -unitH / 2 + 6);
        } else {
          ctx.moveTo(-unitW / 2 + 10, -unitH / 2 + 8);
          ctx.lineTo(unitW / 2 - 10, unitH / 2 - 8);
          ctx.moveTo(unitW / 2 - 10, -unitH / 2 + 8);
          ctx.lineTo(-unitW / 2 + 10, unitH / 2 - 8);
        }
        ctx.stroke();

        const strengthPct = Math.max(0, Math.min(1, (pos.strength || 0) / (army.maxStrength || army.strength || 1)));
        const barW = unitW;
        const barH = 5;
        
        ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
        ctx.fillRect(-unitW / 2, -unitH / 2 - 8, barW, barH);
        
        ctx.fillStyle = strengthPct > 0.5 ? "#22c55e" : strengthPct > 0.25 ? "#f59e0b" : "#ef4444";
        ctx.fillRect(-unitW / 2, -unitH / 2 - 8, barW * strengthPct, barH);
        
        ctx.strokeStyle = "rgba(255,255,255,0.4)";
        ctx.lineWidth = 0.5;
        ctx.strokeRect(-unitW / 2, -unitH / 2 - 8, barW, barH);

        if (this.showLabels) {
          ctx.font = "bold 11px 'Noto Sans Georgian', sans-serif";
          ctx.textAlign = "center";
          
          ctx.fillStyle = "#0f172a";
          ctx.fillText(army.name, 0, unitH / 2 + 15);
          ctx.fillStyle = "#ffffff";
          ctx.fillText(army.name, 0, unitH / 2 + 14);

          ctx.font = "600 10px 'Noto Sans Georgian', sans-serif";
          ctx.fillStyle = strengthPct > 0.3 ? "#e2e8f0" : "#fca5a5";
          ctx.fillText(`${(pos.strength || 0).toLocaleString()} მეომარი`, 0, unitH / 2 + 27);
        }

      } else {
        const subW = 16;
        const subH = 10;
        
        for (let row = 0; row < 2; row++) {
          for (let col = 0; col < 3; col++) {
            const sx = (col - 1) * (subW + 6);
            const sy = (row - 0.5) * (subH + 6);

            ctx.fillStyle = faction.primaryColor;
            ctx.fillRect(sx - subW / 2, sy - subH / 2, subW, subH);
            ctx.strokeStyle = "#ffffff";
            ctx.lineWidth = 1;
            ctx.strokeRect(sx - subW / 2, sy - subH / 2, subW, subH);
          }
        }

        ctx.font = "bold 11px 'Noto Sans Georgian', sans-serif";
        ctx.fillStyle = "#ffffff";
        ctx.textAlign = "center";
        ctx.fillText(army.commander || army.name, 0, -22);
        
        ctx.font = "10px 'Noto Sans Georgian', sans-serif";
        ctx.fillStyle = "#22c55e";
        ctx.fillText(`ტაქტიკური შენაერთი: ${(pos.strength || 0).toLocaleString()}`, 0, 28);
      }

      ctx.restore();
    });

    ctx.restore();
  }

  renderArrows(ctx, arrows) {
    if (!arrows || arrows.length === 0) return;
    ctx.save();

    arrows.forEach(arrow => {
      const isRetreat = arrow.type === "retreat";
      const isFlank = arrow.type === "flank";

      ctx.strokeStyle = arrow.color || "#2563eb";
      ctx.fillStyle = arrow.color || "#2563eb";
      ctx.lineWidth = isRetreat ? 3.5 : 4.5;
      ctx.lineCap = "round";

      if (isRetreat) {
        ctx.setLineDash([8, 6]);
        ctx.lineDashOffset = -this.animTime * 20;
      } else {
        ctx.setLineDash([]);
      }

      const dx = arrow.toX - arrow.fromX;
      const dy = arrow.toY - arrow.fromY;
      const angle = Math.atan2(dy, dx);

      ctx.beginPath();
      if (isFlank) {
        const midX = (arrow.fromX + arrow.toX) / 2 - dy * 0.35;
        const midY = (arrow.fromY + arrow.toY) / 2 + dx * 0.35;
        ctx.moveTo(arrow.fromX, arrow.fromY);
        ctx.quadraticCurveTo(midX, midY, arrow.toX, arrow.toY);
        ctx.stroke();

        const curveAngle = Math.atan2(arrow.toY - midY, arrow.toX - midX);
        this.drawArrowHead(ctx, arrow.toX, arrow.toY, curveAngle, 14);
      } else {
        ctx.moveTo(arrow.fromX, arrow.fromY);
        ctx.lineTo(arrow.toX, arrow.toY);
        ctx.stroke();

        this.drawArrowHead(ctx, arrow.toX, arrow.toY, angle, 14);
      }

      if (arrow.label && this.showLabels) {
        const midX = (arrow.fromX + arrow.toX) / 2;
        const midY = (arrow.fromY + arrow.toY) / 2;
        ctx.font = "italic bold 11px 'Noto Sans Georgian', sans-serif";
        ctx.textAlign = "center";
        
        ctx.fillStyle = "rgba(15, 23, 42, 0.9)";
        const tw = ctx.measureText(arrow.label).width;
        ctx.fillRect(midX - tw / 2 - 4, midY - 18, tw + 8, 16);
        ctx.strokeRect(midX - tw / 2 - 4, midY - 18, tw + 8, 16);

        ctx.fillStyle = isRetreat ? "#e11d48" : "#ffffff";
        ctx.fillText(arrow.label, midX, midY - 6);
      }
    });

    ctx.restore();
  }

  drawArrowHead(ctx, x, y, angle, size) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);
    ctx.setLineDash([]);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(-size, -size * 0.6);
    ctx.lineTo(-size * 0.7, 0);
    ctx.lineTo(-size, size * 0.6);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  renderCombatFX(ctx, clashes) {
    if (!clashes || clashes.length === 0) return;
    ctx.save();

    clashes.forEach(c => {
      const pulse = (this.animTime * 3) % 1;
      ctx.strokeStyle = `rgba(239, 68, 68, ${1 - pulse})`;
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.arc(c.x, c.y, pulse * 45, 0, Math.PI * 2);
      ctx.stroke();

      ctx.strokeStyle = "#e11d48";
      ctx.fillStyle = "#ffffff";
      ctx.lineWidth = 2.5;
      
      ctx.beginPath();
      ctx.moveTo(c.x - 14, c.y - 14);
      ctx.lineTo(c.x + 14, c.y + 14);
      ctx.moveTo(c.x + 14, c.y - 14);
      ctx.lineTo(c.x - 14, c.y + 14);
      ctx.stroke();

      for (let i = 0; i < 4; i++) {
        const angle = this.animTime * 5 + (i * Math.PI) / 2;
        const sparkDist = 18 + Math.sin(this.animTime * 10 + i) * 6;
        ctx.fillStyle = "#facc15";
        ctx.beginPath();
        ctx.arc(c.x + Math.cos(angle) * sparkDist, c.y + Math.sin(angle) * sparkDist, 2.5, 0, Math.PI * 2);
        ctx.fill();
      }
    });

    ctx.restore();
  }

  renderSelectionHighlight(ctx, scenario, currentState) {
    if (!this.selectedEntity) return;
    ctx.save();

    let x = 0;
    let y = 0;

    if (this.selectedEntity.type === "city") {
      const city = scenario.cities?.find(c => c.id === this.selectedEntity.id);
      if (city) {
        x = city.x;
        y = city.y;
      }
    } else if (this.selectedEntity.type === "army") {
      const pos = currentState.armyPositions?.[this.selectedEntity.id];
      if (pos) {
        x = pos.x;
        y = pos.y;
      }
    }

    if (x && y) {
      ctx.strokeStyle = "#38bdf8";
      ctx.lineWidth = 2.5;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.arc(x, y, 38 + Math.sin(this.animTime * 6) * 3, 0, Math.PI * 2);
      ctx.stroke();
    }

    ctx.restore();
  }

  renderHUD(ctx, w, h, scenario) {
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    const dpr = (typeof window !== "undefined" && window.devicePixelRatio) ? window.devicePixelRatio : 1;
    ctx.scale(dpr, dpr);

    // Compass Rose
    const compassX = w - 45;
    const compassY = 45;
    ctx.strokeStyle = "#94a3b8";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(compassX, compassY, 20, 0, Math.PI * 2);
    ctx.stroke();

    ctx.fillStyle = "#dc2626";
    ctx.beginPath();
    ctx.moveTo(compassX, compassY - 18);
    ctx.lineTo(compassX - 5, compassY);
    ctx.lineTo(compassX + 5, compassY);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = "#cbd5e1";
    ctx.beginPath();
    ctx.moveTo(compassX, compassY + 18);
    ctx.lineTo(compassX - 5, compassY);
    ctx.lineTo(compassX + 5, compassY);
    ctx.closePath();
    ctx.fill();

    ctx.font = "bold 10px 'Noto Sans Georgian', sans-serif";
    ctx.fillStyle = "#dc2626";
    ctx.textAlign = "center";
    ctx.fillText("N (ჩრდ)", compassX, compassY - 22);

    // Scale Bar
    const scaleX = 25;
    const scaleY = h - 25;
    const barPx = 80 * this.zoom;
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(scaleX, scaleY);
    ctx.lineTo(scaleX + barPx, scaleY);
    ctx.moveTo(scaleX, scaleY - 5);
    ctx.lineTo(scaleX, scaleY + 5);
    ctx.moveTo(scaleX + barPx, scaleY - 5);
    ctx.lineTo(scaleX + barPx, scaleY + 5);
    ctx.stroke();

    ctx.font = "10px 'Noto Sans Georgian', sans-serif";
    ctx.fillStyle = "#ffffff";
    ctx.textAlign = "center";
    ctx.fillText("5 კმ (მასშტაბი)", scaleX + barPx / 2, scaleY - 8);

    ctx.restore();
  }

  setTheme(themeKey) {
    this.theme = themeKey;
    this.geoEngine.setLayer(themeKey);
  }

  zoomBy(factor) {
    this.zoom = Math.max(this.minZoom, Math.min(this.maxZoom, this.zoom * factor));
  }

  setZoom(value) {
    this.zoom = Math.max(this.minZoom, Math.min(this.maxZoom, value));
  }

  panBy(dx, dy) {
    this.panX += dx;
    this.panY += dy;
  }

  resetView() {
    this.zoom = 1.0;
    this.panX = 0;
    this.panY = 0;
    this.selectedEntity = null;
  }
}
