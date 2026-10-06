/**
 * Timeline and Keyframe Interpolation Animation Engine
 * დროის ხაზისა და კადრების გლუვი ინტერპოლაციის ძრავა
 */

export class AnimationEngine {
  constructor() {
    this.scenario = null;
    this.currentTime = 0;
    this.isPlaying = false;
    this.playbackSpeed = 1.0;
    this.duration = 15; // default seconds
    this.lastTimestamp = null;
    this.rafId = null;

    // Callbacks
    this.onTick = null;
    this.onStateChange = null;
    this.onComplete = null;
  }

  loadScenario(scenario) {
    this.scenario = scenario;
    this.duration = scenario.duration || 15;
    this.currentTime = 0;
    this.isPlaying = false;
    if (this.onTick) this.onTick(this.currentTime, this.getInterpolatedState(0));
  }

  play() {
    if (this.isPlaying) return;
    if (this.currentTime >= this.duration) {
      this.currentTime = 0;
    }
    this.isPlaying = true;
    this.lastTimestamp = performance.now();
    this.startLoop();
    if (this.onStateChange) this.onStateChange(this.isPlaying);
  }

  pause() {
    if (!this.isPlaying) return;
    this.isPlaying = false;
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
    if (this.onStateChange) this.onStateChange(this.isPlaying);
  }

  togglePlay() {
    if (this.isPlaying) {
      this.pause();
    } else {
      this.play();
    }
  }

  setSpeed(speed) {
    this.playbackSpeed = Math.max(0.1, Math.min(10, speed));
  }

  seek(time) {
    this.currentTime = Math.max(0, Math.min(this.duration, time));
    const state = this.getInterpolatedState(this.currentTime);
    if (this.onTick) this.onTick(this.currentTime, state);
  }

  seekNormalized(ratio) {
    this.seek(ratio * this.duration);
  }

  stepBack(seconds = 5) {
    this.seek(this.currentTime - seconds);
  }

  stepForward(seconds = 5) {
    this.seek(this.currentTime + seconds);
  }

  prevKeyframe() {
    if (!this.scenario || !this.scenario.keyframes) return;
    const kfs = this.scenario.keyframes;
    for (let i = kfs.length - 1; i >= 0; i--) {
      if (kfs[i].time < this.currentTime - 0.2) {
        this.seek(kfs[i].time);
        return;
      }
    }
    this.seek(0);
  }

  nextKeyframe() {
    if (!this.scenario || !this.scenario.keyframes) return;
    const kfs = this.scenario.keyframes;
    for (let i = 0; i < kfs.length; i++) {
      if (kfs[i].time > this.currentTime + 0.2) {
        this.seek(kfs[i].time);
        return;
      }
    }
    this.seek(this.duration);
  }

  startLoop() {
    const loop = (now) => {
      if (!this.isPlaying) return;
      
      const delta = (now - this.lastTimestamp) / 1000;
      this.lastTimestamp = now;

      this.currentTime += delta * this.playbackSpeed;

      if (this.currentTime >= this.duration) {
        this.currentTime = this.duration;
        this.pause();
        if (this.onComplete) this.onComplete();
      }

      const state = this.getInterpolatedState(this.currentTime);
      if (this.onTick) this.onTick(this.currentTime, state);

      if (this.isPlaying) {
        this.rafId = requestAnimationFrame(loop);
      }
    };

    this.rafId = requestAnimationFrame(loop);
  }

  /**
   * Calculate interpolated map state at exact timestamp
   * @param {number} time - Current time in seconds
   * @returns {Object} Interpolated state with unit coordinates, strengths, and active arrows
   */
  getInterpolatedState(time) {
    if (!this.scenario || !this.scenario.keyframes || this.scenario.keyframes.length === 0) {
      return { armyPositions: {}, arrows: [], cityStates: [], battleClashes: [] };
    }

    const kfs = this.scenario.keyframes;

    // 1. Find keyframe interval with exact boundary protection
    let prevKf = kfs[0];
    let nextKf = kfs[0];
    let progress = 0;

    if (time <= kfs[0].time) {
      prevKf = kfs[0];
      nextKf = kfs[0];
      progress = 0;
    } else if (time >= kfs[kfs.length - 1].time) {
      prevKf = kfs[kfs.length - 1];
      nextKf = kfs[kfs.length - 1];
      progress = 1;
    } else {
      for (let i = 0; i < kfs.length - 1; i++) {
        if (time >= kfs[i].time && time <= kfs[i + 1].time) {
          prevKf = kfs[i];
          nextKf = kfs[i + 1];
          const span = Math.max(0.001, nextKf.time - prevKf.time);
          progress = Math.max(0, Math.min(1, (time - prevKf.time) / span));
          break;
        }
      }
    }

    // Smooth easeInOutSine interpolation
    const easeProgress = -(Math.cos(Math.PI * progress) - 1) / 2;

    // 2. Interpolate Army Positions and Strengths with safe defaults
    const armyPositions = {};
    const armies = this.scenario.armies || [];
    armies.forEach(army => {
      const pPos = prevKf.armyPositions?.[army.id] || { x: army.startX ?? 500, y: army.startY ?? 325, strength: army.strength ?? 1000, status: "ready" };
      const nPos = nextKf.armyPositions?.[army.id] || pPos;

      armyPositions[army.id] = {
        x: pPos.x + (nPos.x - pPos.x) * easeProgress,
        y: pPos.y + (nPos.y - pPos.y) * easeProgress,
        strength: Math.round(pPos.strength + (nPos.strength - pPos.strength) * easeProgress),
        status: progress < 0.5 ? pPos.status : nPos.status
      };
    });

    // 3. Current City States (ownership & siege)
    const cityStates = nextKf.cityStates || prevKf.cityStates || [];

    // 4. Current Active Arrows
    const activeArrows = (prevKf.arrows || []).concat(nextKf.arrows || []);

    // 5. Current Combat Clashes with intensity fade
    const battleClashes = (prevKf.battleClashes || []).concat(nextKf.battleClashes || []);

    return {
      currentKeyframe: prevKf,
      nextKeyframe: nextKf,
      progress: progress,
      date: progress < 0.5 ? prevKf.date : nextKf.date,
      title: progress < 0.5 ? prevKf.title : nextKf.title,
      description: progress < 0.5 ? prevKf.description : nextKf.description,
      tacticalNote: progress < 0.5 ? prevKf.tacticalNote : nextKf.tacticalNote,
      armyPositions: armyPositions,
      cityStates: cityStates,
      arrows: activeArrows,
      battleClashes: battleClashes
    };
  }
}
