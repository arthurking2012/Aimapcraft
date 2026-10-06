/**
 * Main Application Orchestrator & UI Controller
 * მთავარი მმართველი კონტროლერი
 */

import { I18N } from "./i18n/georgian.js";
import { PromptParser } from "./parser/promptParser.js";
import { HISTORICAL_PRESETS } from "./presets/historicalPresets.js";
import { MapRenderer } from "./engine/mapRenderer.js";
import { AnimationEngine } from "./engine/animationEngine.js";
import { VideoExporter } from "./engine/videoExporter.js";
import { ScenarioEditor } from "./editor/scenarioEditor.js";

class WarMapApp {
  constructor() {
    this.canvas = document.getElementById("warMapCanvas");
    this.mapRenderer = new MapRenderer(this.canvas);
    this.animationEngine = new AnimationEngine();
    this.promptParser = new PromptParser();
    this.videoExporter = new VideoExporter(this.mapRenderer, this.animationEngine);
    this.scenarioEditor = new ScenarioEditor(this);

    this.currentScenario = null;
    this.isDraggingTimeline = false;
    this.isPanning = false;
    this.hasMovedMouse = false;
    this.lastMousePos = { x: 0, y: 0 };
    this.mouseDownPos = { x: 0, y: 0 };

    // Voice Narration & Speech Synthesis
    this.voiceEnabled = true;
    this.lastNarratedKeyframeIdx = -1;
    this.georgianVoice = null;
    this.initVoice();

    this.init();
  }

  initVoice() {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      const loadVoices = () => {
        const voices = window.speechSynthesis.getVoices();
        this.georgianVoice = voices.find(v => v.lang.startsWith("ka") || v.name.toLowerCase().includes("georgian")) || null;
      };
      loadVoices();
      if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = loadVoices;
      }
    }
  }

  init() {
    this.bindUIEvents();
    this.bindCanvasInteractions();
    this.bindKeyboardShortcuts();
    this.populatePresetsUI();

    // Setup Animation Engine callbacks
    this.animationEngine.onTick = (time, state) => this.onAnimationTick(time, state);
    this.animationEngine.onStateChange = (isPlaying) => {
      this.updatePlayPauseButton(isPlaying);
      if (!isPlaying) {
        this.stopVoice();
      }
    };
    this.animationEngine.onComplete = () => {
      this.onAnimationComplete();
      this.stopVoice();
    };

    // Load initial scenario (Abkhazia preset)
    this.loadPreset(HISTORICAL_PRESETS[0].id);

    // Initial render tick
    this.renderLoop();
  }

  renderLoop() {
    const render = () => {
      if (this.currentScenario) {
        const state = this.animationEngine.getInterpolatedState(this.animationEngine.currentTime);
        this.mapRenderer.render(this.currentScenario, state);
      }
      requestAnimationFrame(render);
    };
    requestAnimationFrame(render);
  }

  loadScenario(scenario, pushHistory = true) {
    this.currentScenario = scenario;
    this.animationEngine.loadScenario(scenario);
    
    if (pushHistory) {
      this.scenarioEditor.pushState(scenario, scenario.title);
    }

    // Update voice preference based on scenario
    this.voiceEnabled = scenario.voiceEnabled !== false;
    this.lastNarratedKeyframeIdx = -1;
    this.stopVoice();
    this.updateVoiceButtonUI();

    this.updateHUD(scenario, this.animationEngine.getInterpolatedState(0));
    this.updateLegend(scenario);
    this.updateChronicleSidebar(scenario);
    this.updateTimelineTicks(scenario);
    this.scenarioEditor.renderEditorUI(scenario);
    this.mapRenderer.resetView();
    this.hideEntityInspector();
  }

  loadPreset(presetId) {
    const preset = HISTORICAL_PRESETS.find(p => p.id === presetId);
    if (!preset) return;

    const promptInput = document.getElementById("promptTextInput");
    if (promptInput) {
      promptInput.value = preset.prompt;
    }

    if (preset.scenarioData) {
      this.loadScenario(preset.scenarioData);
    } else {
      const generated = this.promptParser.parse(preset.prompt);
      this.loadScenario(generated);
    }
  }

  generateFromPrompt(promptText) {
    try {
      this.showToast("მიმდინარეობს ტექსტის ანალიზი და რუკის აგება...", "info");
      
      // 1. Pause and destroy previous simulation state
      this.animationEngine.pause();
      this.currentScenario = null;
      this.mapRenderer.selectedEntity = null;
      this.hideEntityInspector();

      // 2. Parse new prompt dynamically
      const durationInput = parseInt(document.getElementById('promptVideoDuration')?.value, 10);
const parseOptions = {};
if (!isNaN(durationInput) && durationInput > 0) {
  parseOptions.durationMinutes = durationInput;
}
const newScenario = this.promptParser.parse(promptText, parseOptions);

      // 3. Load newly generated scenario
      this.loadScenario(newScenario);
            // Update prompt textarea with summary for user visibility
      const promptInput = document.getElementById('promptTextInput');
      if (promptInput && newScenario.summary) {
        promptInput.value = `${newScenario.rawPrompt}\n${newScenario.summary}`;
      }

      this.showToast("ახალი რუკა წარმატებით აიგო! დააჭირეთ დაკვრას.", "success");
      
      // 4. Auto-play new simulation
      setTimeout(() => this.animationEngine.play(), 400);
    } catch (err) {
      this.showToast(err.message || "შეცდომა ტექსტის ანალიზისას", "error");
    }
  }

  onAnimationTick(time, state) {
    const duration = this.animationEngine.duration || 15;
    const progressPct = (time / duration) * 100;
    
    const scrubber = document.getElementById("timelineScrubber");
    const progressFill = document.getElementById("timelineProgressFill");
    const timeDisplay = document.getElementById("currentTimeDisplay");
    
    if (scrubber && !this.isDraggingTimeline) {
      scrubber.value = progressPct;
    }
    if (progressFill) {
      progressFill.style.width = `${progressPct}%`;
    }
    if (timeDisplay) {
      const formatTime = (sec) => {
        const m = Math.floor(sec / 60);
        const s = Math.floor(sec % 60);
        return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
      };
      timeDisplay.textContent = `${formatTime(time)} / ${formatTime(duration)}`;
    }

    this.updateHUD(this.currentScenario, state);
    this.highlightActiveChronicleEvent(time);

    // Voice Narration trigger when passing keyframes
    if (this.voiceEnabled && this.animationEngine.isPlaying && this.currentScenario?.keyframes) {
      const activeIdx = this.getActiveKeyframeIndex(time);
      if (activeIdx !== this.lastNarratedKeyframeIdx && activeIdx >= 0) {
        this.lastNarratedKeyframeIdx = activeIdx;
        this.speakEvent(this.currentScenario.keyframes[activeIdx]);
      }
    }
  }

  getActiveKeyframeIndex(time) {
    if (!this.currentScenario?.keyframes) return -1;
    const kfs = this.currentScenario.keyframes;
    let idx = 0;
    for (let i = 0; i < kfs.length; i++) {
      if (time >= kfs[i].time - 0.2) {
        idx = i;
      }
    }
    return idx;
  }

  speakEvent(keyframe) {
    if (!this.voiceEnabled || typeof window === "undefined" || !("speechSynthesis" in window)) return;
    if (this.currentScenario && this.currentScenario.voiceEnabled === false) return;

    window.speechSynthesis.cancel();

    const textToSpeak = `${keyframe.title}. ${keyframe.description || ""}`;
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    if (this.georgianVoice) {
      utterance.voice = this.georgianVoice;
      utterance.lang = this.georgianVoice.lang;
    } else {
      utterance.lang = "ka-GE";
    }
    utterance.rate = 1.05;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;

    window.speechSynthesis.speak(utterance);
  }

  stopVoice() {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
  }

  toggleVoice() {
    this.voiceEnabled = !this.voiceEnabled;
    if (!this.voiceEnabled) {
      this.stopVoice();
      this.showToast("🔇 გახმოვანება გამორთულია", "info");
    } else {
      this.showToast("🔊 გახმოვანება ჩართულია (Georgian Voiceover)", "success");
      const activeIdx = this.getActiveKeyframeIndex(this.animationEngine.currentTime);
      if (activeIdx >= 0 && this.currentScenario?.keyframes) {
        this.speakEvent(this.currentScenario.keyframes[activeIdx]);
      }
    }
    this.updateVoiceButtonUI();
  }

  updateVoiceButtonUI() {
    const btn = document.getElementById("btnFsVoiceToggle");
    if (!btn) return;
    if (this.voiceEnabled) {
      btn.className = "p-2 bg-slate-800 hover:bg-slate-700 text-amber-400 rounded-xl text-xs";
      btn.innerHTML = `<i class="fa-solid fa-volume-high"></i>`;
    } else {
      btn.className = "p-2 bg-slate-800 hover:bg-slate-700 text-slate-400 rounded-xl text-xs";
      btn.innerHTML = `<i class="fa-solid fa-volume-xmark"></i>`;
    }
  }

  updateHUD(scenario, state) {
    if (!scenario || !state) return;

    const titleEl = document.getElementById("hudCampaignTitle");
    const dateEl = document.getElementById("hudCurrentDate");
    const eventTitleEl = document.getElementById("hudEventTitle");
    const descEl = document.getElementById("hudEventDescription");
    const statusBadge = document.getElementById("hudStatusBadge");

    if (titleEl) titleEl.textContent = scenario.title || "ისტორიული ომის რუკა";
    if (dateEl) dateEl.textContent = state.date || scenario.period || "თარიღი";
    if (eventTitleEl) eventTitleEl.textContent = state.title || "";
    if (descEl) descEl.textContent = state.description || "";

    if (statusBadge) {
      const phase = state.currentKeyframe?.phase || "mobilization";
      let text = "აქტიური მოძრაობა";
      let bgClass = "bg-sky-500/20 text-sky-400 border-sky-500/40";

      if (phase === "battle") {
        text = "მიმდინარეობს ბრძოლა!";
        bgClass = "bg-rose-500/20 text-rose-400 border-rose-500/40 animate-pulse";
      } else if (phase === "retreat") {
        text = "ტაქტიკური უკანდახევა";
        bgClass = "bg-amber-500/20 text-amber-400 border-amber-500/40";
      } else if (phase === "victory") {
        text = "კამპანიის დასასრული";
        bgClass = "bg-emerald-500/20 text-emerald-400 border-emerald-500/40";
      }

      statusBadge.className = `px-2.5 py-1 rounded-full text-xs font-semibold border ${bgClass}`;
      statusBadge.textContent = text;
    }
  }

  updateLegend(scenario) {
    const container = document.getElementById("factionsLegendList");
    if (!container || !scenario.factions) return;

    container.innerHTML = scenario.factions.map(f => {
      const armies = scenario.armies.filter(a => a.factionId === f.id);
      const totalStrength = armies.reduce((sum, a) => sum + (a.strength || 0), 0);

      return `
        <div class="flex items-center justify-between p-2 rounded bg-slate-800/60 border border-slate-700/50 mb-1.5">
          <div class="flex items-center gap-2.5">
            <span class="w-3.5 h-3.5 rounded-sm shadow-sm" style="background-color: ${f.primaryColor}"></span>
            <span class="text-xs font-bold text-slate-200">${f.name}</span>
          </div>
          <span class="text-[11px] font-mono text-slate-400">${totalStrength.toLocaleString()} კაცი</span>
        </div>
      `;
    }).join("");
  }

  updateChronicleSidebar(scenario) {
    const list = document.getElementById("chronicleEventsList");
    if (!list || !scenario.keyframes) return;

    list.innerHTML = scenario.keyframes.map((kf, idx) => `
      <div class="chronicle-card p-3 rounded-lg border border-slate-700/70 bg-slate-800/50 hover:bg-slate-700/60 transition-all cursor-pointer mb-2" data-time="${kf.time}">
        <div class="flex items-center justify-between gap-2 mb-1">
          <span class="text-[11px] font-bold text-sky-400">📅 ${kf.date}</span>
          <span class="text-[10px] font-mono text-slate-400 bg-slate-900/60 px-1.5 py-0.5 rounded">${kf.time} წმ</span>
        </div>
        <h4 class="text-xs font-semibold text-white mb-1">${kf.title}</h4>
        <p class="text-[11px] text-slate-300 leading-relaxed">${kf.description}</p>
      </div>
    `).join("");

    list.querySelectorAll(".chronicle-card").forEach(card => {
      card.addEventListener("click", () => {
        const time = parseFloat(card.getAttribute("data-time"));
        this.animationEngine.seek(time);
      });
    });
  }

  highlightActiveChronicleEvent(time) {
    const cards = document.querySelectorAll(".chronicle-card");
    if (!cards || cards.length === 0 || !this.currentScenario?.keyframes) return;

    const kfs = this.currentScenario.keyframes;
    let activeIdx = 0;
    for (let i = 0; i < kfs.length; i++) {
      if (time >= kfs[i].time - 0.2) {
        activeIdx = i;
      }
    }

    cards.forEach((card, idx) => {
      if (idx === activeIdx) {
        card.classList.add("border-amber-500", "bg-slate-700/90", "ring-1", "ring-amber-500/50");
      } else {
        card.classList.remove("border-amber-500", "bg-slate-700/90", "ring-1", "ring-amber-500/50");
      }
    });
  }

  updateTimelineTicks(scenario) {
    const container = document.getElementById("timelineKeyframeTicks");
    if (!container || !scenario.keyframes) return;

    const duration = scenario.duration || 15;
    container.innerHTML = scenario.keyframes.map(kf => {
      const leftPct = (kf.time / duration) * 100;
      return `
        <div class="absolute top-0 bottom-0 w-1.5 bg-amber-400/70 hover:bg-amber-300 rounded-full cursor-pointer group" style="left: ${leftPct}%" title="${kf.date}: ${kf.title}" data-time="${kf.time}">
          <div class="opacity-0 group-hover:opacity-100 transition-opacity absolute bottom-5 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] px-2 py-1 rounded shadow pointer-events-none whitespace-nowrap z-30">
            ${kf.date} - ${kf.title}
          </div>
        </div>
      `;
    }).join("");

    container.querySelectorAll("[data-time]").forEach(el => {
      el.addEventListener("click", (e) => {
        e.stopPropagation();
        const time = parseFloat(el.getAttribute("data-time"));
        this.animationEngine.seek(time);
      });
    });
  }

  updatePlayPauseButton(isPlaying) {
    const btn = document.getElementById("btnPlayPause");
    if (!btn) return;
    const icon = btn.querySelector("i");
    const text = btn.querySelector("span");

    if (isPlaying) {
      if (icon) icon.className = "fa-solid fa-pause text-amber-400";
      if (text) text.textContent = I18N.pause;
    } else {
      if (icon) icon.className = "fa-solid fa-play text-emerald-400";
      if (text) text.textContent = I18N.play;
    }
  }

  onAnimationComplete() {
    this.updatePlayPauseButton(false);
  }

  populatePresetsUI() {
    const presetSelect = document.getElementById("presetSelector");
    const presetsGrid = document.getElementById("presetsModalGrid");

    if (presetSelect) {
      presetSelect.innerHTML = HISTORICAL_PRESETS.map(p => `
        <option value="${p.id}">${p.title}</option>
      `).join("");

      presetSelect.addEventListener("change", (e) => {
        this.loadPreset(e.target.value);
      });
    }

    if (presetsGrid) {
      presetsGrid.innerHTML = HISTORICAL_PRESETS.map(p => `
        <div class="preset-card p-4 rounded-xl border border-slate-700 bg-slate-800/90 hover:border-sky-500 hover:bg-slate-700/80 transition-all cursor-pointer flex flex-col justify-between" data-preset-id="${p.id}">
          <div>
            <div class="flex items-center justify-between gap-2 mb-2">
              <span class="badge bg-sky-500/20 text-sky-400 text-[10px] font-semibold px-2 py-0.5 rounded">${p.category}</span>
              <span class="text-xs text-amber-400 font-semibold">${p.period}</span>
            </div>
            <h3 class="text-sm font-bold text-white mb-1.5">${p.title}</h3>
            <p class="text-xs text-slate-300 leading-relaxed mb-3">${p.description}</p>
          </div>
          <button class="w-full mt-2 py-1.5 bg-sky-600 hover:bg-sky-500 text-white rounded text-xs font-semibold flex items-center justify-center gap-1.5">
            <i class="fa-solid fa-map"></i>
            <span>ამ რუკის ჩატვირთვა</span>
          </button>
        </div>
      `).join("");

      presetsGrid.querySelectorAll(".preset-card").forEach(card => {
        card.addEventListener("click", () => {
          const id = card.getAttribute("data-preset-id");
          this.loadPreset(id);
          this.closeModal("presetsModal");
          this.showToast("შაბლონი ჩაიტვირთა!", "success");
        });
      });
    }
  }

  bindUIEvents() {
    document.getElementById("btnPlayPause")?.addEventListener("click", () => {
      this.animationEngine.togglePlay();
    });

    document.getElementById("btnRewind")?.addEventListener("click", () => {
      this.stopVoice();
      this.lastNarratedKeyframeIdx = -1;
      this.animationEngine.prevKeyframe();
    });
    document.getElementById("btnFastForward")?.addEventListener("click", () => {
      this.stopVoice();
      this.lastNarratedKeyframeIdx = -1;
      this.animationEngine.nextKeyframe();
    });
    document.getElementById("btnStepBack")?.addEventListener("click", () => {
      this.stopVoice();
      this.lastNarratedKeyframeIdx = -1;
      this.animationEngine.stepBack(3);
    });
    document.getElementById("btnStepForward")?.addEventListener("click", () => {
      this.stopVoice();
      this.lastNarratedKeyframeIdx = -1;
      this.animationEngine.stepForward(3);
    });

    document.getElementById("speedSelector")?.addEventListener("change", (e) => {
      this.animationEngine.setSpeed(parseFloat(e.target.value));
    });

    // Timeline Scrubber & Direct Track Click
    const scrubber = document.getElementById("timelineScrubber");
    if (scrubber) {
      scrubber.addEventListener("input", (e) => {
        this.isDraggingTimeline = true;
        this.stopVoice();
        this.lastNarratedKeyframeIdx = -1;
        const ratio = parseFloat(e.target.value) / 100;
        this.animationEngine.seekNormalized(ratio);
      });
      scrubber.addEventListener("change", () => {
        this.isDraggingTimeline = false;
      });
    }

    const trackContainer = document.querySelector(".timeline-track-container");
    if (trackContainer) {
      trackContainer.addEventListener("click", (e) => {
        this.stopVoice();
        this.lastNarratedKeyframeIdx = -1;
        const rect = trackContainer.getBoundingClientRect();
        const clickRatio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
        this.animationEngine.seekNormalized(clickRatio);
      });
    }

    // Zoom & Pan Buttons
    document.getElementById("btnZoomIn")?.addEventListener("click", () => {
      this.mapRenderer.zoomBy(1.25);
    });
    document.getElementById("btnZoomOut")?.addEventListener("click", () => {
      this.mapRenderer.zoomBy(0.8);
    });
    document.getElementById("btnResetView")?.addEventListener("click", () => {
      this.mapRenderer.resetView();
      this.hideEntityInspector();
    });

    document.getElementById("mapThemeSelector")?.addEventListener("change", (e) => {
      this.mapRenderer.setTheme(e.target.value);
    });

    document.getElementById("chkSatelliteRelief")?.addEventListener("change", (e) => {
      this.mapRenderer.showSatelliteRelief = e.target.checked;
    });

    document.getElementById("chkTerritory")?.addEventListener("change", (e) => {
      this.mapRenderer.showTerritory = e.target.checked;
    });
    document.getElementById("chkTacticalView")?.addEventListener("change", (e) => {
      this.mapRenderer.showTacticalDetails = e.target.checked;
    });
    document.getElementById("chkLabels")?.addEventListener("change", (e) => {
      this.mapRenderer.showLabels = e.target.checked;
    });
    document.getElementById("chkGrid")?.addEventListener("change", (e) => {
      this.mapRenderer.showGrid = e.target.checked;
    });

    // Map Manager Modal & Custom Upload
    document.getElementById("btnOpenMapManagerModal")?.addEventListener("click", () => {
      this.openModal("mapManagerModal");
    });

    document.querySelectorAll(".btn-map-type-choice").forEach(btn => {
      btn.addEventListener("click", () => {
        const type = btn.getAttribute("data-map-type");
        this.mapRenderer.setTheme(type);
        const sel = document.getElementById("mapThemeSelector");
        if (sel) sel.value = type;
        this.closeModal("mapManagerModal");
        this.showToast(`რუკის სტილი შეიცვალა!`, "success");
      });
    });

    const fileInput = document.getElementById("customMapFileInput");
    if (fileInput) {
      fileInput.addEventListener("change", (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (evt) => {
          const img = new Image();
          img.onload = () => {
            const opacity = parseFloat(document.getElementById("customMapOpacityInput")?.value || "0.85");
            this.mapRenderer.geoEngine.setCustomMap(img, opacity);
            this.mapRenderer.setTheme("custom");
            const sel = document.getElementById("mapThemeSelector");
            if (sel) sel.value = "custom";
            this.closeModal("mapManagerModal");
            this.showToast("საკუთარი რუკის ფოტო წარმატებით ჩაიტვირთა!", "success");
          };
          img.src = evt.target.result;
        };
        reader.readAsDataURL(file);
      });
    }

    document.getElementById("customMapOpacityInput")?.addEventListener("input", (e) => {
      if (this.mapRenderer.geoEngine) {
        this.mapRenderer.geoEngine.customMapOpacity = parseFloat(e.target.value);
      }
    });

    // Undo / Redo
    document.getElementById("btnUndo")?.addEventListener("click", () => {
      const prev = this.scenarioEditor.undo();
      if (prev) {
        this.loadScenario(prev, false);
        this.showToast("ცვლილება გაუქმდა (Undo)", "info");
      }
    });
    document.getElementById("btnRedo")?.addEventListener("click", () => {
      const next = this.scenarioEditor.redo();
      if (next) {
        this.loadScenario(next, false);
        this.showToast("ცვლილება აღდგა (Redo)", "info");
      }
    });

    // Modals
    document.getElementById("btnOpenPromptModal")?.addEventListener("click", () => {
      this.openModal("promptModal");
    });
    document.getElementById("btnGenerateMap")?.addEventListener("click", () => {
      const text = document.getElementById("promptTextInput")?.value;
      if (text) {
        this.generateFromPrompt(text);
      } else {
        this.showToast(I18N.errorInvalidPrompt, "error");
      }
    });
    document.getElementById("btnClearPrompt")?.addEventListener("click", () => {
      const el = document.getElementById("promptTextInput");
      if (el) el.value = "";
    });
    document.getElementById("btnLoadExamplePrompt")?.addEventListener("click", () => {
      const el = document.getElementById("promptTextInput");
      if (el) el.value = I18N.promptPlaceholder;
    });

    document.getElementById("btnOpenPresetsModal")?.addEventListener("click", () => {
      this.openModal("presetsModal");
    });

    document.getElementById("btnOpenEditorModal")?.addEventListener("click", () => {
      this.scenarioEditor.renderEditorUI(this.currentScenario);
      this.openModal("editorModal");
    });

    document.getElementById("btnOpenExportModal")?.addEventListener("click", () => {
      this.openModal("exportModal");
    });

    document.getElementById("btnStartRender")?.addEventListener("click", async () => {
      await this.handleStartRender();
    });

    document.getElementById("btnDownloadVideo")?.addEventListener("click", () => {
      try {
        const format = document.getElementById("exportFormat")?.value || "webm";
        const filename = `istoriuli_rukis_animacia_${Date.now()}.${format}`;
        this.videoExporter.downloadVideo(filename);
        this.showToast("ვიდეო ფაილის ჩამოტვირთვა დაიწყო!", "success");
      } catch (err) {
        this.showToast(err.message, "error");
      }
    });

    // Fullscreen War Map & Floating Controls
    document.getElementById("btnToggleFullscreen")?.addEventListener("click", () => {
      this.toggleFullscreen();
    });
    document.getElementById("btnFsExit")?.addEventListener("click", () => {
      this.toggleFullscreen();
    });
    document.getElementById("btnFsPlayPause")?.addEventListener("click", () => {
      this.animationEngine.togglePlay();
    });
    document.getElementById("btnFsVoiceToggle")?.addEventListener("click", () => {
      this.toggleVoice();
    });
    document.getElementById("btnFsRecord")?.addEventListener("click", () => {
      this.handleToggleLiveRecording();
    });
    document.getElementById("btnFsWatchVideo")?.addEventListener("click", () => {
      this.openVideoPreview();
    });
    document.getElementById("btnFsDownloadVideo")?.addEventListener("click", () => {
      this.downloadRecordedVideo();
    });
    document.getElementById("btnDownloadFromPreview")?.addEventListener("click", () => {
      this.downloadRecordedVideo();
    });

    document.getElementById("btnLiveScreenRecord")?.addEventListener("click", () => {
      this.handleToggleLiveRecording();
    });

    document.querySelectorAll(".modal-close-btn").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const modal = e.target.closest(".modal-backdrop");
        if (modal) modal.classList.add("hidden");
        const videoEl = document.getElementById("previewVideoElement");
        if (videoEl && modal?.id === "videoPreviewModal") {
          videoEl.pause();
        }
      });
    });
  }

  toggleFullscreen() {
    const isFs = document.body.classList.toggle("fullscreen-map-active");
    this.mapRenderer.resize();
    const btn = document.getElementById("btnToggleFullscreen");
    if (btn) {
      btn.innerHTML = isFs ? `<i class="fa-solid fa-compress"></i>` : `<i class="fa-solid fa-expand"></i>`;
    }
    if (isFs) {
      this.showToast("🔍 სრული ეკრანის რეჟიმი გააქტიურდა. გასასვლელად დააჭირეთ Esc ან F", "info");
    }
  }

  openVideoPreview() {
    if (!this.videoExporter.renderedUrl) {
      this.showToast("ვიდეო ჯერ არ არის ჩაწერილი.", "error");
      return;
    }
    const videoEl = document.getElementById("previewVideoElement");
    if (videoEl) {
      videoEl.src = this.videoExporter.renderedUrl;
      videoEl.play().catch(() => {});
    }
    this.openModal("videoPreviewModal");
  }

  downloadRecordedVideo() {
    try {
      const filename = `istoriuli_omisa_animacia_${Date.now()}.webm`;
      this.videoExporter.downloadVideo(filename);
      this.showToast("📥 ვიდეოს ჩამოტვირთვა დაიწყო!", "success");
    } catch (err) {
      this.showToast(err.message, "error");
    }
  }

  async handleStartRender() {
    const resValue = document.getElementById("exportResolution")?.value || "1080";
    const fps = parseInt(document.getElementById("exportFps")?.value || "30", 10);
    const format = document.getElementById("exportFormat")?.value || "webm";

    let width = 1920;
    let height = 1080;
    if (resValue === "720") {
      width = 1280;
      height = 720;
    } else if (resValue === "4k") {
      width = 3840;
      height = 2160;
    }

    const progressContainer = document.getElementById("renderProgressSection");
    const progressBar = document.getElementById("renderProgressBar");
    const progressText = document.getElementById("renderProgressText");
    const downloadSection = document.getElementById("renderDownloadSection");
    const btnRender = document.getElementById("btnStartRender");

    if (progressContainer) progressContainer.classList.remove("hidden");
    if (downloadSection) downloadSection.classList.add("hidden");
    if (btnRender) btnRender.disabled = true;

    try {
      this.animationEngine.pause();
      const result = await this.videoExporter.renderVideo(
        { width, height, fps, format },
        (percent, frame, total) => {
          if (progressBar) progressBar.style.width = `${percent}%`;
          if (progressText) progressText.textContent = `${I18N.renderingProgress} ${percent}% (${frame}/${total} კადრი)`;
        }
      );

      if (progressText) progressText.textContent = `${I18N.renderComplete} (ზომა: ${result.sizeMB} MB)`;
      if (downloadSection) downloadSection.classList.remove("hidden");
      this.showToast("ვიდეო მზადაა ჩამოსატვირთად!", "success");
    } catch (err) {
      if (progressText) progressText.textContent = `შეცდომა: ${err.message}`;
      this.showToast(err.message || I18N.errorRenderFailed, "error");
    } finally {
      if (btnRender) btnRender.disabled = false;
    }
  }

  handleToggleLiveRecording() {
    const btnLive = document.getElementById("btnLiveScreenRecord");
    const btnFs = document.getElementById("btnFsRecord");
    const btnFsText = document.getElementById("btnFsRecordText");
    const btnFsWatch = document.getElementById("btnFsWatchVideo");
    const btnFsDownload = document.getElementById("btnFsDownloadVideo");

    if (!this.videoExporter.isLiveRecording) {
      try {
        if (btnFsWatch) btnFsWatch.classList.add("hidden");
        if (btnFsDownload) btnFsDownload.classList.add("hidden");

        this.videoExporter.startLiveRecording((blob, url, extension) => {
          // Restore record buttons UI
          if (btnLive) {
            btnLive.innerHTML = `<i class="fa-solid fa-circle-dot text-rose-500"></i> <span>${I18N.startScreenRecordBtn}</span>`;
          }
          if (btnFs) {
            btnFs.className = "px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg shadow-rose-600/30 transition-all";
            btnFs.innerHTML = `<i class="fa-solid fa-circle text-[10px] animate-pulse"></i> <span>ვიდეოს ჩაწერა</span>`;
          }
          if (btnFsWatch) btnFsWatch.classList.remove("hidden");
          if (btnFsDownload) btnFsDownload.classList.remove("hidden");

          const downloadSection = document.getElementById("renderDownloadSection");
          if (downloadSection) downloadSection.classList.remove("hidden");

          this.showToast("🎬 ჩაწერა დასრულდა! ვიდეო მზადაა სანახავად და ჩამოსატვირთად.", "success");
          this.openVideoPreview();
        });

        if (btnLive) {
          btnLive.innerHTML = `<i class="fa-solid fa-stop text-rose-400 animate-pulse"></i> <span>${I18N.stopScreenRecordBtn}</span>`;
        }
        if (btnFs) {
          btnFs.className = "px-3 py-1.5 bg-rose-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg shadow-rose-700/50 transition-all animate-pulse";
          btnFs.innerHTML = `<i class="fa-solid fa-stop text-rose-200"></i> <span>ჩაწერის შეწყვეტა (Stop)</span>`;
        }

        this.showToast("🔴 მხოლოდ რუკის პირდაპირი ჩაწერა დაიწყო (60 FPS)...", "info");
        this.animationEngine.play();
      } catch (err) {
        this.showToast(err.message || "ჩაწერის შეცდომა", "error");
      }
    } else {
      this.videoExporter.stopLiveRecording();
    }
  }

  bindCanvasInteractions() {
    this.canvas.addEventListener("wheel", (e) => {
      e.preventDefault();
      const rect = this.canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      const zoomFactor = e.deltaY < 0 ? 1.15 : 0.85;
      this.mapRenderer.zoomBy(zoomFactor, mouseX, mouseY);
    }, { passive: false });

    this.canvas.addEventListener("mousedown", (e) => {
      this.isPanning = true;
      this.hasMovedMouse = false;
      this.mouseDownPos = { x: e.clientX, y: e.clientY };
      this.lastMousePos = { x: e.clientX, y: e.clientY };
      this.canvas.style.cursor = "grabbing";
    });

    window.addEventListener("mousemove", (e) => {
      if (!this.isPanning) return;
      const dx = e.clientX - this.lastMousePos.x;
      const dy = e.clientY - this.lastMousePos.y;
      if (Math.abs(e.clientX - this.mouseDownPos.x) > 3 || Math.abs(e.clientY - this.mouseDownPos.y) > 3) {
        this.hasMovedMouse = true;
      }
      this.lastMousePos = { x: e.clientX, y: e.clientY };
      this.mapRenderer.panBy(dx, dy);
    });

    window.addEventListener("mouseup", (e) => {
      if (this.isPanning) {
        this.isPanning = false;
        this.canvas.style.cursor = "crosshair";

        // If it was a click (not a drag), perform Entity Hit-Testing!
        if (!this.hasMovedMouse && this.currentScenario) {
          const rect = this.canvas.getBoundingClientRect();
          const screenX = e.clientX - rect.left;
          const screenY = e.clientY - rect.top;
          const state = this.animationEngine.getInterpolatedState(this.animationEngine.currentTime);
          const entity = this.mapRenderer.findEntityAt(screenX, screenY, this.currentScenario, state);
          
          if (entity) {
            this.mapRenderer.selectedEntity = entity;
            this.showEntityInspector(entity);
          } else {
            this.mapRenderer.selectedEntity = null;
            this.hideEntityInspector();
          }
        }
      }
    });

    // Touch Support
    let touchDist = 0;
    this.canvas.addEventListener("touchstart", (e) => {
      if (e.touches.length === 1) {
        this.isPanning = true;
        this.lastMousePos = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      } else if (e.touches.length === 2) {
        touchDist = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY
        );
      }
    });

    this.canvas.addEventListener("touchmove", (e) => {
      if (e.touches.length === 1 && this.isPanning) {
        const dx = e.touches[0].clientX - this.lastMousePos.x;
        const dy = e.touches[0].clientY - this.lastMousePos.y;
        this.lastMousePos = { x: e.touches[0].clientX, y: e.touches[0].clientY };
        this.mapRenderer.panBy(dx, dy);
      } else if (e.touches.length === 2) {
        const newDist = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY
        );
        if (touchDist > 0) {
          const factor = newDist / touchDist;
          this.mapRenderer.zoomBy(factor);
        }
        touchDist = newDist;
      }
    });

    this.canvas.addEventListener("touchend", () => {
      this.isPanning = false;
      touchDist = 0;
    });
  }

  showEntityInspector(entity) {
    let inspector = document.getElementById("entityInspectorCard");
    if (!inspector) {
      inspector = document.createElement("div");
      inspector.id = "entityInspectorCard";
      inspector.className = "absolute bottom-5 left-72 bg-slate-900/95 border border-sky-500/60 rounded-xl p-3.5 shadow-2xl backdrop-blur-md z-30 max-w-xs text-xs text-white transition-all";
      document.querySelector(".main-viewport").appendChild(inspector);
    }

    if (entity.type === "army") {
      const army = entity.army;
      const pos = entity.pos;
      const faction = this.currentScenario.factions.find(f => f.id === army.factionId);
      inspector.innerHTML = `
        <div class="flex items-center justify-between border-b border-slate-700/80 pb-2 mb-2">
          <div class="flex items-center gap-2">
            <span class="w-3 h-3 rounded-sm" style="background-color: ${faction?.primaryColor || '#2563eb'}"></span>
            <span class="font-bold text-sky-300">${army.name}</span>
          </div>
          <button id="btnCloseInspector" class="text-slate-400 hover:text-white"><i class="fa-solid fa-xmark"></i></button>
        </div>
        <div class="space-y-1 text-slate-300">
          <div><strong>სარდალი:</strong> ${army.commander || "არ არის მითითებული"}</div>
          <div><strong>რაოდენობა:</strong> ${(pos.strength || 0).toLocaleString()} მეომარი</div>
          <div><strong>სტატუსი:</strong> <span class="text-amber-400 font-semibold">${pos.status || 'აქტიური'}</span></div>
          <div><strong>მხარე:</strong> ${faction?.name || ''}</div>
        </div>
      `;
    } else if (entity.type === "city") {
      const city = entity.city;
      const state = entity.state;
      const faction = this.currentScenario.factions.find(f => f.id === state.ownerFactionId);
      inspector.innerHTML = `
        <div class="flex items-center justify-between border-b border-slate-700/80 pb-2 mb-2">
          <div class="flex items-center gap-2">
            <i class="fa-solid fa-fort-awesome text-amber-400"></i>
            <span class="font-bold text-amber-300">${city.name}</span>
          </div>
          <button id="btnCloseInspector" class="text-slate-400 hover:text-white"><i class="fa-solid fa-xmark"></i></button>
        </div>
        <div class="space-y-1 text-slate-300">
          <div><strong>ტიპი:</strong> ${city.importance === 'capital' ? 'დედაქალაქი / ციტადელი' : city.importance === 'fortress' ? 'ციხესიმაგრე' : 'დასახლება'}</div>
          <div><strong>აკონტროლებს:</strong> <span class="text-sky-400">${faction?.name || 'უცნობი'}</span></div>
          <div><strong>ალყის მდგომარეობა:</strong> <span class="${state.isBesieged ? 'text-rose-400 font-bold' : 'text-emerald-400'}">${state.isBesieged ? 'ალყაშია!' : 'თავისუფალი'}</span></div>
        </div>
      `;
    }

    inspector.classList.remove("hidden");
    document.getElementById("btnCloseInspector")?.addEventListener("click", () => {
      this.hideEntityInspector();
      this.mapRenderer.selectedEntity = null;
    });
  }

  hideEntityInspector() {
    const inspector = document.getElementById("entityInspectorCard");
    if (inspector) inspector.classList.add("hidden");
  }

  bindKeyboardShortcuts() {
    window.addEventListener("keydown", (e) => {
      if (["INPUT", "TEXTAREA", "SELECT"].includes(document.activeElement.tagName)) {
        return;
      }

      if (e.code === "Space") {
        e.preventDefault();
        this.animationEngine.togglePlay();
      } else if (e.code === "ArrowLeft") {
        e.preventDefault();
        this.animationEngine.stepBack(3);
      } else if (e.code === "ArrowRight") {
        e.preventDefault();
        this.animationEngine.stepForward(3);
      } else if (e.code === "KeyZ" && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        if (e.shiftKey) {
          const next = this.scenarioEditor.redo();
          if (next) this.loadScenario(next, false);
        } else {
          const prev = this.scenarioEditor.undo();
          if (prev) this.loadScenario(prev, false);
        }
      } else if (e.code === "KeyY" && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        const next = this.scenarioEditor.redo();
        if (next) this.loadScenario(next, false);
      } else if (e.key === "+" || e.key === "=") {
        this.mapRenderer.zoomBy(1.2);
      } else if (e.key === "-" || e.key === "_") {
        this.mapRenderer.zoomBy(0.8);
      } else if (e.code === "KeyR") {
        this.mapRenderer.resetView();
        this.hideEntityInspector();
      } else if (e.code === "KeyF") {
        e.preventDefault();
        this.toggleFullscreen();
      } else if (e.code === "KeyV") {
        e.preventDefault();
        this.toggleVoice();
      }
    });
  }

  openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.classList.remove("hidden");
  }

  closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.classList.add("hidden");
  }

  showToast(message, type = "info") {
    const container = document.getElementById("toastContainer");
    if (!container) return;

    const toast = document.createElement("div");
    const bgClass = type === "success" ? "bg-emerald-600 text-white" : type === "error" ? "bg-rose-600 text-white" : "bg-slate-800 text-sky-300 border border-sky-500/40";
    toast.className = `px-4 py-2.5 rounded-lg shadow-xl text-xs font-semibold flex items-center gap-2 transform transition-all duration-300 translate-y-2 opacity-0 ${bgClass}`;
    toast.innerHTML = `<i class="fa-solid ${type === 'success' ? 'fa-check' : type === 'error' ? 'fa-triangle-exclamation' : 'fa-info-circle'}"></i> <span>${message}</span>`;
    
    container.appendChild(toast);
    setTimeout(() => {
      toast.classList.remove("translate-y-2", "opacity-0");
    }, 10);

    setTimeout(() => {
      toast.classList.add("opacity-0", "translate-y-2");
      setTimeout(() => {
        if (container.contains(toast)) container.removeChild(toast);
      }, 300);
    }, 3500);
  }
}

// Instantiate on DOM load
window.addEventListener("DOMContentLoaded", () => {
  window.app = new WarMapApp();
});
