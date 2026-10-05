/**
 * Scenario Visual Editor & Undo/Redo Manager
 * სცენარის ვიზუალური რედაქტორი და ცვლილებების ისტორია (Undo/Redo)
 */

export class ScenarioEditor {
  constructor(app) {
    this.app = app;
    this.undoStack = [];
    this.redoStack = [];
    this.maxHistory = 50;
  }

  pushState(scenario, actionName = "ცვლილება") {
    if (!scenario) return;
    const clone = JSON.parse(JSON.stringify(scenario));
    this.undoStack.push({ scenario: clone, actionName });
    if (this.undoStack.length > this.maxHistory) {
      this.undoStack.shift();
    }
    this.redoStack = [];
    this.updateUndoRedoButtons();
  }

  undo() {
    if (this.undoStack.length <= 1) return null;
    
    const current = this.undoStack.pop();
    this.redoStack.push(current);

    const prev = this.undoStack[this.undoStack.length - 1];
    this.updateUndoRedoButtons();
    return JSON.parse(JSON.stringify(prev.scenario));
  }

  redo() {
    if (this.redoStack.length === 0) return null;
    
    const next = this.redoStack.pop();
    this.undoStack.push(next);
    this.updateUndoRedoButtons();
    return JSON.parse(JSON.stringify(next.scenario));
  }

  canUndo() {
    return this.undoStack.length > 1;
  }

  canRedo() {
    return this.redoStack.length > 0;
  }

  updateUndoRedoButtons() {
    const btnUndo = document.getElementById("btnUndo");
    const btnRedo = document.getElementById("btnRedo");
    if (btnUndo) btnUndo.disabled = !this.canUndo();
    if (btnRedo) btnRedo.disabled = !this.canRedo();
  }

  renderEditorUI(scenario) {
    if (!scenario) return;
    
    this.renderFactionsTab(scenario);
    this.renderArmiesTab(scenario);
    this.renderCitiesTab(scenario);
    this.renderKeyframesTab(scenario);
  }

  renderFactionsTab(scenario) {
    const container = document.getElementById("editorFactionsList");
    if (!container) return;

    const listHtml = scenario.factions.map((f, idx) => `
      <div class="editor-card p-3 rounded-lg border border-slate-700 bg-slate-800/80 mb-3" data-faction-id="${f.id}">
        <div class="flex items-center justify-between gap-3 mb-2">
          <span class="text-xs font-semibold text-slate-400">მხარე #${idx + 1}</span>
          <input type="color" value="${f.primaryColor}" class="w-8 h-8 rounded border-0 cursor-pointer faction-color-input" data-idx="${idx}">
        </div>
        <div class="space-y-2">
          <label class="text-xs text-slate-300">მხარის სახელწოდება:</label>
          <input type="text" value="${f.name}" class="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-sm text-white faction-name-input" data-idx="${idx}">
        </div>
      </div>
    `).join("");

    container.innerHTML = `
      ${listHtml}
      <button id="btnAddFaction" class="w-full py-2 bg-slate-800 hover:bg-slate-700 border border-dashed border-slate-600 rounded-lg text-xs font-bold text-sky-400 flex items-center justify-center gap-1.5">
        <i class="fa-solid fa-plus"></i>
        <span>ახალი მხარის დამატება</span>
      </button>
    `;

    container.querySelectorAll(".faction-name-input").forEach(input => {
      input.addEventListener("input", (e) => {
        const idx = parseInt(e.target.getAttribute("data-idx"), 10);
        if (scenario.factions[idx]) {
          scenario.factions[idx].name = e.target.value;
          this.app.updateLegend(scenario);
        }
      });
    });

    container.querySelectorAll(".faction-color-input").forEach(input => {
      input.addEventListener("input", (e) => {
        const idx = parseInt(e.target.getAttribute("data-idx"), 10);
        if (scenario.factions[idx]) {
          scenario.factions[idx].primaryColor = e.target.value;
          scenario.factions[idx].lightColor = e.target.value + "40";
          this.app.updateLegend(scenario);
        }
      });
    });

    document.getElementById("btnAddFaction")?.addEventListener("click", () => {
      const colors = ["#2563eb", "#dc2626", "#d97706", "#16a34a", "#7c3aed", "#ec4899"];
      const newColor = colors[scenario.factions.length % colors.length];
      const newF = {
        id: "faction_" + Date.now(),
        name: `ახალი მხარე ${scenario.factions.length + 1}`,
        primaryColor: newColor,
        lightColor: newColor + "40",
        borderColor: newColor
      };
      scenario.factions.push(newF);
      this.pushState(scenario, "მხარის დამატება");
      this.renderFactionsTab(scenario);
      this.app.updateLegend(scenario);
    });
  }

  renderArmiesTab(scenario) {
    const container = document.getElementById("editorArmiesList");
    if (!container) return;

    const listHtml = scenario.armies.map((army, idx) => `
      <div class="editor-card p-3 rounded-lg border border-slate-700 bg-slate-800/80 mb-3" data-army-id="${army.id}">
        <div class="flex items-center justify-between mb-2">
          <span class="text-xs font-bold text-sky-400">არმია #${idx + 1} (${army.id})</span>
          <span class="text-xs text-slate-400 font-mono">${(army.strength || 0).toLocaleString()} მეომარი</span>
        </div>
        <div class="grid grid-cols-2 gap-2 text-xs">
          <div>
            <label class="text-slate-300">სახელი:</label>
            <input type="text" value="${army.name}" class="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-white army-name-input" data-idx="${idx}">
          </div>
          <div>
            <label class="text-slate-300">სარდალი:</label>
            <input type="text" value="${army.commander || ''}" class="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-white army-commander-input" data-idx="${idx}">
          </div>
          <div>
            <label class="text-slate-300">რაოდენობა:</label>
            <input type="number" value="${army.strength}" step="1000" class="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-white army-strength-input" data-idx="${idx}">
          </div>
          <div>
            <label class="text-slate-300">შენაერთის ტიპი:</label>
            <select class="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-white army-type-select" data-idx="${idx}">
              <option value="infantry_heavy" ${army.unitType === 'infantry_heavy' ? 'selected' : ''}>ქვეითი / მთავარი</option>
              <option value="cavalry" ${army.unitType === 'cavalry' ? 'selected' : ''}>კავალერია / მხედრები</option>
              <option value="archers" ${army.unitType === 'archers' ? 'selected' : ''}>მშვილდოსნები</option>
            </select>
          </div>
        </div>
      </div>
    `).join("");

    container.innerHTML = `
      ${listHtml}
      <button id="btnAddArmy" class="w-full py-2 bg-slate-800 hover:bg-slate-700 border border-dashed border-slate-600 rounded-lg text-xs font-bold text-sky-400 flex items-center justify-center gap-1.5">
        <i class="fa-solid fa-plus"></i>
        <span>ახალი არმიის დამატება</span>
      </button>
    `;

    container.querySelectorAll(".army-name-input").forEach(input => {
      input.addEventListener("input", (e) => {
        const idx = parseInt(e.target.getAttribute("data-idx"), 10);
        if (scenario.armies[idx]) scenario.armies[idx].name = e.target.value;
      });
    });

    container.querySelectorAll(".army-commander-input").forEach(input => {
      input.addEventListener("input", (e) => {
        const idx = parseInt(e.target.getAttribute("data-idx"), 10);
        if (scenario.armies[idx]) scenario.armies[idx].commander = e.target.value;
      });
    });

    container.querySelectorAll(".army-strength-input").forEach(input => {
      input.addEventListener("input", (e) => {
        const idx = parseInt(e.target.getAttribute("data-idx"), 10);
        const val = parseInt(e.target.value, 10) || 0;
        if (scenario.armies[idx]) {
          scenario.armies[idx].strength = val;
          scenario.armies[idx].maxStrength = val;
          this.app.updateLegend(scenario);
        }
      });
    });

    container.querySelectorAll(".army-type-select").forEach(select => {
      select.addEventListener("change", (e) => {
        const idx = parseInt(e.target.getAttribute("data-idx"), 10);
        if (scenario.armies[idx]) scenario.armies[idx].unitType = e.target.value;
      });
    });

    document.getElementById("btnAddArmy")?.addEventListener("click", () => {
      const f = scenario.factions[0] || { id: "side_a" };
      const newArmy = {
        id: "army_" + Date.now(),
        name: `შენაერთი #${scenario.armies.length + 1}`,
        commander: "სარდალი",
        factionId: f.id,
        startX: 450 + (Math.random() - 0.5) * 200,
        startY: 320 + (Math.random() - 0.5) * 200,
        x: 450,
        y: 320,
        strength: 25000,
        maxStrength: 25000,
        unitType: "infantry_heavy",
        status: "ready"
      };
      scenario.armies.push(newArmy);

      // Add to keyframes
      scenario.keyframes.forEach(kf => {
        if (!kf.armyPositions) kf.armyPositions = {};
        kf.armyPositions[newArmy.id] = { x: newArmy.startX, y: newArmy.startY, strength: newArmy.strength, status: "ready" };
      });

      this.pushState(scenario, "არმიის დამატება");
      this.renderArmiesTab(scenario);
      this.app.updateLegend(scenario);
    });
  }

  renderCitiesTab(scenario) {
    const container = document.getElementById("editorCitiesList");
    if (!container) return;

    const listHtml = scenario.cities.map((city, idx) => `
      <div class="editor-card p-3 rounded-lg border border-slate-700 bg-slate-800/80 mb-3" data-city-id="${city.id}">
        <div class="flex items-center justify-between mb-2">
          <span class="text-xs font-bold text-amber-400">ქალაქი / ციხე: ${city.name}</span>
          <span class="text-xs text-slate-400 font-mono">X:${city.x}, Y:${city.y}</span>
        </div>
        <div class="grid grid-cols-2 gap-2 text-xs">
          <div>
            <label class="text-slate-300">სახელწოდება:</label>
            <input type="text" value="${city.name}" class="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-white city-name-input" data-idx="${idx}">
          </div>
          <div>
            <label class="text-slate-300">მნიშვნელობა:</label>
            <select class="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-white city-imp-select" data-idx="${idx}">
              <option value="capital" ${city.importance === 'capital' ? 'selected' : ''}>დედაქალაქი / ციტადელი</option>
              <option value="fortress" ${city.importance === 'fortress' ? 'selected' : ''}>ციხესიმაგრე</option>
              <option value="battlefield" ${city.importance === 'battlefield' ? 'selected' : ''}>ბრძოლის ველი</option>
              <option value="town" ${city.importance === 'town' ? 'selected' : ''}>დასახლება</option>
            </select>
          </div>
        </div>
      </div>
    `).join("");

    container.innerHTML = `
      ${listHtml}
      <button id="btnAddCity" class="w-full py-2 bg-slate-800 hover:bg-slate-700 border border-dashed border-slate-600 rounded-lg text-xs font-bold text-amber-400 flex items-center justify-center gap-1.5">
        <i class="fa-solid fa-plus"></i>
        <span>ახალი ქალაქის / ციხის დამატება</span>
      </button>
    `;

    container.querySelectorAll(".city-name-input").forEach(input => {
      input.addEventListener("input", (e) => {
        const idx = parseInt(e.target.getAttribute("data-idx"), 10);
        if (scenario.cities[idx]) scenario.cities[idx].name = e.target.value;
      });
    });

    container.querySelectorAll(".city-imp-select").forEach(select => {
      select.addEventListener("change", (e) => {
        const idx = parseInt(e.target.getAttribute("data-idx"), 10);
        if (scenario.cities[idx]) scenario.cities[idx].importance = e.target.value;
      });
    });

    document.getElementById("btnAddCity")?.addEventListener("click", () => {
      const f = scenario.factions[0] || { id: "side_a" };
      const newCity = {
        id: "city_" + Date.now(),
        name: `სტრატეგიული პუნქტი ${scenario.cities.length + 1}`,
        x: Math.round(300 + Math.random() * 400),
        y: Math.round(200 + Math.random() * 250),
        importance: "fortress",
        ownerFactionId: f.id,
        isBesieged: false,
        fortificationLevel: 2
      };
      scenario.cities.push(newCity);
      this.pushState(scenario, "ქალაქის დამატება");
      this.renderCitiesTab(scenario);
    });
  }

  renderKeyframesTab(scenario) {
    const container = document.getElementById("editorKeyframesList");
    if (!container) return;

    const listHtml = scenario.keyframes.map((kf, idx) => `
      <div class="editor-card p-3 rounded-lg border border-slate-700 bg-slate-800/80 mb-3 cursor-pointer hover:border-sky-500 transition-colors" data-kf-idx="${idx}">
        <div class="flex items-center justify-between mb-1">
          <span class="text-xs font-bold text-emerald-400">კადრი #${idx + 1} (${kf.time} წმ)</span>
          <span class="badge bg-slate-700 text-slate-300 text-[10px] px-2 py-0.5 rounded">${kf.phase}</span>
        </div>
        <p class="text-xs font-semibold text-white mb-1">${kf.title}</p>
        <p class="text-[11px] text-slate-400 line-clamp-2">${kf.description}</p>
      </div>
    `).join("");

    container.innerHTML = `
      ${listHtml}
      <button id="btnAddKeyframe" class="w-full py-2 bg-slate-800 hover:bg-slate-700 border border-dashed border-slate-600 rounded-lg text-xs font-bold text-emerald-400 flex items-center justify-center gap-1.5">
        <i class="fa-solid fa-plus"></i>
        <span>ახალი მოვლენის / კადრის დამატება</span>
      </button>
    `;

    container.querySelectorAll(".editor-card[data-kf-idx]").forEach(card => {
      card.addEventListener("click", () => {
        const idx = parseInt(card.getAttribute("data-kf-idx"), 10);
        if (scenario.keyframes[idx]) {
          this.app.animationEngine.seek(scenario.keyframes[idx].time);
          this.app.closeModal("editorModal");
        }
      });
    });

    document.getElementById("btnAddKeyframe")?.addEventListener("click", () => {
      const lastKf = scenario.keyframes[scenario.keyframes.length - 1] || { time: 0 };
      const newTime = lastKf.time + 4;
      const newKf = {
        time: newTime,
        date: `ახალი ფაზა (${newTime} წმ)`,
        title: "სტრატეგიული მანევრირება",
        description: "არმიები აგრძელებენ მოქმედებას და იკავებენ ახალ პოზიციებს.",
        phase: "advance",
        armyPositions: JSON.parse(JSON.stringify(lastKf.armyPositions || {})),
        arrows: [],
        cityStates: JSON.parse(JSON.stringify(lastKf.cityStates || [])),
        tacticalNote: "ახალი ტაქტიკური ეტაპი"
      };
      scenario.keyframes.push(newKf);
      scenario.duration = Math.max(scenario.duration, newTime);
      this.pushState(scenario, "კადრის დამატება");
      this.renderKeyframesTab(scenario);
      this.app.updateTimelineTicks(scenario);
      this.app.updateChronicleSidebar(scenario);
    });
  }
}
