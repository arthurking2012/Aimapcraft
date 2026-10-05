/**
 * Screen Recording & Video Rendering Engine
 * რუკის ანიმაციის ვიდეო რენდერინგი და ფაილის ჩამოტვირთვა
 */

export class VideoExporter {
  constructor(mapRenderer, animationEngine) {
    this.mapRenderer = mapRenderer;
    this.animationEngine = animationEngine;
    
    this.isRendering = false;
    this.isLiveRecording = false;
    this.mediaRecorder = null;
    this.recordedChunks = [];
    this.renderedBlob = null;
    this.renderedUrl = null;
  }

  getSupportedMimeType(preferredFormat = "webm") {
    if (typeof MediaRecorder === "undefined") {
      return "video/webm";
    }

    const types = preferredFormat === "mp4" 
      ? ["video/mp4;codecs=avc1", "video/mp4", "video/webm;codecs=vp9", "video/webm;codecs=vp8", "video/webm"]
      : ["video/webm;codecs=vp9", "video/webm;codecs=vp8", "video/webm", "video/mp4"];

    for (const type of types) {
      if (MediaRecorder.isTypeSupported && MediaRecorder.isTypeSupported(type)) {
        return type;
      }
    }
    return "video/webm";
  }

  /**
   * Deterministic Frame-by-Frame Video Renderer
   */
  async renderVideo(options = {}, onProgress = null) {
    if (this.isRendering) return;
    this.isRendering = true;
    this.recordedChunks = [];

    const {
      width = 1920,
      height = 1080,
      fps = 30,
      format = "webm",
      bitrate = 8000000
    } = options;

    const scenario = this.animationEngine.scenario;
    if (!scenario) {
      this.isRendering = false;
      throw new Error("სცენარი არ არის ჩატვირთული.");
    }

    const duration = scenario.duration || 15;
    const totalFrames = Math.ceil(duration * fps);
    const mimeType = this.getSupportedMimeType(format);

    // Create Offscreen Virtual Canvas
    const exportCanvas = document.createElement("canvas");
    exportCanvas.width = width;
    exportCanvas.height = height;
    const exportCtx = exportCanvas.getContext("2d");

    // MapRenderer instance with explicit width & height
    const tempRenderer = new this.mapRenderer.constructor(exportCanvas);
    tempRenderer.width = width;
    tempRenderer.height = height;
    tempRenderer.theme = this.mapRenderer.theme;
    tempRenderer.showTerritory = this.mapRenderer.showTerritory;
    tempRenderer.showTacticalDetails = this.mapRenderer.showTacticalDetails;
    tempRenderer.showLabels = this.mapRenderer.showLabels;
    tempRenderer.showGrid = this.mapRenderer.showGrid;
    tempRenderer.zoom = 1.0;
    tempRenderer.panX = 0;
    tempRenderer.panY = 0;

    // Check browser captureStream support
    if (!exportCanvas.captureStream) {
      this.isRendering = false;
      throw new Error("თქვენს ბრაუზერს არ აქვს Canvas captureStream მხარდაჭერა.");
    }

    const stream = exportCanvas.captureStream(fps);
    this.mediaRecorder = new MediaRecorder(stream, {
      mimeType: mimeType,
      videoBitsPerSecond: bitrate
    });

    this.mediaRecorder.ondataavailable = (e) => {
      if (e.data && e.data.size > 0) {
        this.recordedChunks.push(e.data);
      }
    };

    const completionPromise = new Promise((resolve, reject) => {
      this.mediaRecorder.onstop = () => {
        try {
          const extension = mimeType.includes("mp4") ? "mp4" : "webm";
          this.renderedBlob = new Blob(this.recordedChunks, { type: mimeType });
          if (this.renderedUrl) {
            URL.revokeObjectURL(this.renderedUrl);
          }
          this.renderedUrl = URL.createObjectURL(this.renderedBlob);
          this.isRendering = false;
          resolve({
            blob: this.renderedBlob,
            url: this.renderedUrl,
            extension: extension,
            sizeMB: (this.renderedBlob.size / (1024 * 1024)).toFixed(2)
          });
        } catch (err) {
          this.isRendering = false;
          reject(err);
        }
      };

      this.mediaRecorder.onerror = (e) => {
        this.isRendering = false;
        reject(e.error || new Error("ვიდეოს ჩაწერის შეცდომა"));
      };
    });

    this.mediaRecorder.start(100);

    // Step through time frames
    for (let frame = 0; frame <= totalFrames; frame++) {
      if (!this.isRendering) {
        this.mediaRecorder.stop();
        throw new Error("რენდერინგი გაუქმდა.");
      }

      const simTime = (frame / totalFrames) * duration;
      const state = this.animationEngine.getInterpolatedState(simTime);

      // Render map frame
      tempRenderer.render(scenario, state);

      // Render documentary top header banner in the video
      this.renderVideoHUDOverlay(exportCtx, width, height, scenario, state);

      const percent = Math.round((frame / totalFrames) * 100);
      if (onProgress) {
        onProgress(percent, frame, totalFrames);
      }

      // Small tick delay to allow media stream buffer intake
      await new Promise(r => setTimeout(r, 1000 / fps / 2));
    }

    this.mediaRecorder.stop();
    return await completionPromise;
  }

  renderVideoHUDOverlay(ctx, w, h, scenario, state) {
    ctx.save();
    
    // Top banner gradient
    const bannerH = 75;
    const grad = ctx.createLinearGradient(0, 0, 0, bannerH + 20);
    grad.addColorStop(0, "rgba(15, 23, 42, 0.95)");
    grad.addColorStop(0.8, "rgba(15, 23, 42, 0.88)");
    grad.addColorStop(1, "rgba(15, 23, 42, 0)");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, bannerH + 20);

    // Scenario Title & Date
    ctx.font = "bold 22px 'Noto Sans Georgian', sans-serif";
    ctx.fillStyle = "#facc15";
    ctx.textAlign = "left";
    ctx.fillText(scenario.title || "ისტორიული ომის რუკა", 30, 34);

    ctx.font = "600 16px 'Noto Sans Georgian', sans-serif";
    ctx.fillStyle = "#ffffff";
    ctx.fillText(`📅 ${state.date || scenario.period || ""}`, 30, 60);

    // Event Title & Note (Right aligned)
    if (state.title) {
      ctx.font = "bold 17px 'Noto Sans Georgian', sans-serif";
      ctx.fillStyle = "#38bdf8";
      ctx.textAlign = "right";
      ctx.fillText(state.title, w - 30, 34);

      if (state.tacticalNote) {
        ctx.font = "italic 13px 'Noto Sans Georgian', sans-serif";
        ctx.fillStyle = "#cbd5e1";
        ctx.fillText(state.tacticalNote, w - 30, 60);
      }
    }

    // Watermark
    ctx.font = "12px 'Noto Sans Georgian', sans-serif";
    ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
    ctx.textAlign = "right";
    ctx.fillText("შექმნილია 2D ომების რუკის გენერატორით", w - 25, h - 20);

    ctx.restore();
  }

  startLiveRecording(onStop = null) {
    if (this.isLiveRecording) return;
    this.isLiveRecording = true;
    this.recordedChunks = [];

    if (!this.mapRenderer.canvas.captureStream) {
      this.isLiveRecording = false;
      throw new Error("Canvas captureStream მხარდაჭერილი არ არის.");
    }

    const stream = this.mapRenderer.canvas.captureStream(60);
    const mimeType = this.getSupportedMimeType("webm");

    this.mediaRecorder = new MediaRecorder(stream, { mimeType });

    this.mediaRecorder.ondataavailable = (e) => {
      if (e.data && e.data.size > 0) {
        this.recordedChunks.push(e.data);
      }
    };

    this.mediaRecorder.onstop = () => {
      this.isLiveRecording = false;
      const extension = mimeType.includes("mp4") ? "mp4" : "webm";
      this.renderedBlob = new Blob(this.recordedChunks, { type: mimeType });
      if (this.renderedUrl) URL.revokeObjectURL(this.renderedUrl);
      this.renderedUrl = URL.createObjectURL(this.renderedBlob);
      if (onStop) onStop(this.renderedBlob, this.renderedUrl, extension);
    };

    this.mediaRecorder.start(250);
  }

  stopLiveRecording() {
    if (!this.isLiveRecording || !this.mediaRecorder) return;
    this.mediaRecorder.stop();
  }

  downloadVideo(filename = "istoriuli_rukis_animacia.webm") {
    if (!this.renderedUrl) {
      throw new Error("ჩამოსატვირთი ვიდეო ვერ მოიძებნა. გთხოვთ ჯერ გაუშვათ რენდერინგი ან ეკრანის ჩაწერა.");
    }

    const a = document.createElement("a");
    a.style.display = "none";
    a.href = this.renderedUrl;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
    }, 250);
  }

  cancelRender() {
    this.isRendering = false;
  }
}
