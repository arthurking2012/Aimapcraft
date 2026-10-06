/**
 * Generic Natural Language War Prompt Interpreter
 * ბუნებრივი ენის უნივერსალური ისტორიული და ტაქტიკური ანალიზატორი
 *
 * Handles ANY war prompt (Ancient, Medieval, Napoleonic, Civil War, Modern, Fictional)
 * Extracts Geography, Factions, Armies, Cities, Tactical Actions, and Timeline.
 */

export class GenericPromptInterpreter {
  constructor() {
    // Geo-thematic geographic presets for common historical theaters
    this.regionKeywords = {
      caucasus: ["აფხაზეთ", "საქართველო", "კავკასია", "თბილისი", "სოხუმი", "გაგრა", "ოჩამჩირე", "ტყვარჩელი", "ენგური", "გუდაუთა", "დიდგორი", "კრწანისი", "შავი ზღვა", "abkhazia", "georgia", "caucasus", "black sea"],
      american_civil_war: ["ამერიკა", "სამოქალაქო ომი", "კონფედერაცია", "კავშირი", "გეტისბურგი", "რიჩმონდი", "ვაშინგტონი", "ლი", "გრანტი", "civil war", "confederate", "union", "gettysburg", "richmond", "potomac"],
      europe_napoleon: ["ნაპოლეონ", "საფრანგეთ", "აუსტერლიცი", "ვატერლოო", "ბოროდინო", "პრუსია", "ავსტრია", "napoleon", "france", "austerlitz", "waterloo", "europe"],
      ww2_eastern_front: ["სტალინგრადი", "მოსკოვი", "კურსკი", "ვერმახტი", "წითელი არმია", "სსრკ", "ბერლინი", "დონი", "ვოლგა", "stalingrad", "kursk", "ussr", "eastern front"],
      ancient_mediterranean: ["რომი", "კართაგენი", "ჰანიბალი", "კანე", "სპარტა", "ათენი", "საბერძნეთი", "სპარსეთი", "გავგამელა", "rome", "carthage", "sparta", "greece", "persia"],
      middle_east: ["იერუსალიმი", "ჯვაროსნები", "სალადინი", "სელჩუკ", "ბაღდადი", "დამასკო", "crusade", "saladin", "jerusalem"],
      medieval_feudal: ["სამეფო", "ციხესიმაგრე", "რაინდ", "მეფე", "თავადი", "ციტადელი", "ალყა", "kingdom", "castle", "knight", "siege", "feudal"]
    };

    // Tactical battle types dictionary
    this.battleTypeKeywords = {
      siege: ["ალყა", "გარემოცვა", "ციხის აღება", "ბლოკადა", "შემოარტყა", "დაბომბვა", "siege", "besieged", "blockade", "surrounded", "encircled city"],
      river_crossing: ["მდინარეზე გადასვლა", "მდინარე", "ხიდი", "გადალახა", "crossing", "river", "bridge", "ford"],
      mountain_pass: ["უღელტეხილი", "ხეობა", "მთიანეთი", "მთა", "ვიწრო გასასვლელი", "mountain pass", "gorge", "valley", "pass", "highland"],
      encirclement: ["ქვაბში მოაქცია", "ორმაგი ალყა", "შემოვლა", "ჩაკეტვა", "ზურგიდან დარტყმა", "encirclement", "pincer", "double envelopment", "pocket", "flanked"],
      retreat_rout: ["უკანდახევა", "პანიკური გაქცევა", "დამარცხდა", "დაიშალა", "დატოვა", "retreat", "routed", "withdrew", "fled", "evacuated"],
      open_field: ["ღია ველზე ბრძოლა", "შეჯახება", "ფრონტალური შეტევა", "მთავარი ბრძოლა", "დაესხა", "pitch battle", "clash", "frontal assault", "battle", "charge"],
      defensive_stand: ["თავდაცვა", "პოზიციების გამაგრება", "მოიგერია", "შეაკავა", "defense", "entrenched", "repelled", "held the line"]
    };

    // Faction color palettes (accessible, high contrast)
    this.palette = [
      { primary: "#2563eb", light: "rgba(37, 99, 235, 0.28)", name: "ლურჯი (მხარე 1)" },
      { primary: "#dc2626", light: "rgba(220, 38, 38, 0.28)", name: "წითელი (მხარე 2)" },
      { primary: "#d97706", light: "rgba(217, 119, 6, 0.28)", name: "ოქროსფერი (მხარე 3)" },
      { primary: "#16a34a", light: "rgba(22, 163, 74, 0.28)", name: "მწვანე (მხარე 4)" },
      { primary: "#7c3aed", light: "rgba(124, 58, 237, 0.28)", name: "იისფერი (მხარე 5)" },
      { primary: "#0891b2", light: "rgba(8, 145, 178, 0.28)", name: "ცისფერი (მხარე 6)" }
    ];
  }

  parse(rawPrompt, options = {}) {
    return this.interpret(rawPrompt, options);
  }

  /**
   * Main interpretation entry point
   * Generates a complete, unique, dynamic simulation from arbitrary user prompt.
   */
  interpret(rawPrompt, options = {}) {
    if (!rawPrompt || rawPrompt.trim().length === 0) {
      throw new Error("გთხოვთ შეიყვანოთ ომის აღწერა.");
    }

    const text = rawPrompt.trim();
    const paragraphs = text.split(/\n+/).map(p => p.trim()).filter(p => p.length > 0);
    const sentences = text.split(/[.!?\n]+/).map(s => s.trim()).filter(s => s.length > 3);

    // 1. Detect Conflict Epoch & Geographic Theater
    const theater = this.detectTheater(text);
    const title = this.extractTitle(text, paragraphs[0]);
    const period = this.extractPeriod(text);

    // 2. Dynamically Extract Opposing Factions
    const factions = this.extractFactions(text, sentences);

    // 3. Dynamically Extract / Generate Cities & Key Strategic Locations
    const cities = this.extractLocations(text, sentences, factions, theater);

    // 4. Dynamically Extract / Generate Armies & Formations
    const armies = this.extractArmies(text, sentences, factions, cities, theater);

    // 5. Dynamically Generate Chronological Keyframe Events with Tactical Behavior
    const keyframes = this.generateDynamicKeyframes(text, sentences, factions, cities, armies, theater);

    // 6. Dynamically Generate Landscape/Terrain matching the geography
    const terrain = this.generateDynamicTerrain(theater, cities, armies);

    // 7. Calculate dynamic video & animation duration based on complexity
    const calculatedDuration = Math.max(16, Math.min(90, keyframes.length * 4.2));

    // Determine final duration (seconds)
    let finalDuration = calculatedDuration;
    // Override from options if provided
    if (options && options.durationMinutes && !isNaN(options.durationMinutes)) {
      finalDuration = Math.max(5, Math.min(options.durationMinutes * 60, 3600));
    } else {
      // Also check for inline duration specification in prompt (e.g., "ვიდეოს ხანგრძლივობა: 5 წუთი", "ხანგრძლივობა: 10 წუთი")
      const durationMatch = text.match(/(?:ვიდეოს\s*)?ხანგრძლივობა\s*[:]?\s*(\d+)\s*წუთ/i);
      if (durationMatch) {
        const minutes = parseInt(durationMatch[1], 10);
        finalDuration = Math.max(5, Math.min(minutes * 60, 3600));
      }
    }

    // 8. Voiceover preference detection (Speech narration)
    let voiceEnabled = true;
    const lower = text.toLowerCase();
    if (lower.includes("გახმოვანება არ უნდა") || lower.includes("უხმოდ") || lower.includes("ხმის გარეშე") || lower.includes("ტექსტის ხმა: არია") || lower.includes("არ წაიკითხო") || lower.includes("ხმა არ უნდა")) {
      voiceEnabled = false;
    }

    // 9. Overlay text extraction (Custom introduction or dramatic narrative banner)
    const overlayMatch = text.match(/(?:ტექსტი|ტექსტის\s*ჩვენება|შესავალი)\s*[:]\s*([^\n]+)/i);
    const overlayText = overlayMatch ? overlayMatch[1].trim() : null;

    // 10. Compute counts for summary
    const armyCount = armies.length;
    const cityCount = cities.length;
    const retreatCount = keyframes.filter(k => k.phase === 'retreat' || (k.arrows && k.arrows.some(a => a.type === 'retreat'))).length;
    const siegeCount = keyframes.filter(k => k.phase === 'siege' || (k.cityStates && k.cityStates.some(c => c.isBesieged))).length;
    const summary = `📊 შეჯამება: ჯარები: ${armyCount}, ქალაქები: ${cityCount}, უკანდახევები: ${retreatCount}, ალყები: ${siegeCount}, ხანგრძლივობა: ${Math.round(finalDuration/60) || 1} წუთი (${Math.round(finalDuration)} წმ), გახმოვანება: ${voiceEnabled ? 'ჩართულია' : 'გამორთულია'}.`;

    return {
      id: "sim_" + Date.now() + "_" + Math.floor(Math.random() * 1000),
      title: title,
      period: period,
      rawPrompt: text,
      theater: theater,
      factions: factions,
      cities: cities,
      armies: armies,
      keyframes: keyframes,
      duration: finalDuration,
      terrain: terrain,
      mapBounds: { width: 1000, height: 650 },
      voiceEnabled: voiceEnabled,
      overlayText: overlayText,
      summary: summary
    };
  }

  /**
   * Detect Theater of War & Cartographic context
   */
  detectTheater(text) {
    const lower = text.toLowerCase();

    for (const [theaterKey, keywords] of Object.entries(this.regionKeywords)) {
      if (keywords.some(k => lower.includes(k.toLowerCase()))) {
        return theaterKey;
      }
    }

    // Default to general procedural historical theater
    if (lower.includes("ზღვა") || lower.includes("sea") || lower.includes("coast") || lower.includes("სანაპირო")) {
      return "coastal_theater";
    }
    if (lower.includes("მთა") || lower.includes("mountain") || lower.includes("pass") || lower.includes("ხეობა")) {
      return "mountain_theater";
    }

    return "general_plains";
  }

  extractTitle(text, firstPara) {
    if (firstPara && firstPara.length < 90 && !firstPara.includes(".")) {
      return firstPara.replace(/^#+\s*/, "");
    }
    const match = text.match(/^([^\n.]+)(?:-ის|ის)?\s*(?:ომი|ბრძოლა|კამპანია|ოპერაცია|War|Battle|Campaign)/i);
    if (match) return match[0];
    return firstPara.slice(0, 55) + "...";
  }

  extractPeriod(text) {
    // Extract dates like: 1992-1993, 1121 წელი, 1861–1865, ძვ. წ. 216, 12 აგვისტო, 1942 etc.
    const yearMatch = text.match(/(?:ძვ\.\s*წ\.\s*)?\d{1,4}(?:\s*[-–—]\s*\d{1,4})?\s*(?:წ(?:ელი|წ\.|ლის)?|BC|AD|years?)?/i);
    return yearMatch ? yearMatch[0] : "ისტორიული ეპოქა";
  }

  /**
   * Generic Faction Extractor
   */
  extractFactions(text, sentences) {
    const lower = text.toLowerCase();
    const detected = [];

    // Common faction entity detection patterns in Georgian & English
    const candidateEntities = [
      // Abkhazian War
      { match: ["ქართული", "საქართველო", "ქართველთა", "ეროვნული გვარდია"], name: "საქართველოს ძალები / გვარდია", colorIdx: 0 },
      { match: ["აფხაზური", "აფხაზეთის", "სეპარატისტ", "კონფედერატთა რაზმები", "ბოევიკ"], name: "აფხაზური შენაერთები & მოკავშირეები", colorIdx: 1 },
      // American Civil War
      { match: ["კავშირი", "ჩრდილოეთი", "იუნიონი", "union", "federals", "north"], name: "კავშირის არმია (Union)", colorIdx: 0 },
      { match: ["კონფედერაცია", "სამხრეთი", "confederate", "rebels", "south"], name: "კონფედერაციის არმია (Confederacy)", colorIdx: 1 },
      // Medieval / Kingdoms
      { match: ["სამეფო a", "ჩრდილოეთის სამეფო", "პირველი სამეფო", "kingdom 1", "kingdom a"], name: "ჩრდილოეთის სამეფო", colorIdx: 0 },
      { match: ["სამეფო b", "სამხრეთის სამეფო", "მეორე სამეფო", "kingdom 2", "kingdom b"], name: "სამხრეთის სამეფო", colorIdx: 1 },
      { match: ["შემტევი", "თავდამსხმელი", "ინვაზია", "მტრის არმია", "invaders", "attacking"], name: "შემტევი კოალიცია", colorIdx: 1 },
      { match: ["დამცველები", "ციხის გარნიზონი", "მეფის ლაშქარი", "defenders"], name: "დამცველი სამეფო", colorIdx: 0 }
    ];

    candidateEntities.forEach(item => {
      if (item.match.some(m => lower.includes(m)) && !detected.some(d => d.name === item.name)) {
        const pal = this.palette[detected.length % this.palette.length];
        detected.push({
          id: "faction_" + detected.length,
          name: item.name,
          primaryColor: pal.primary,
          lightColor: pal.light,
          borderColor: pal.primary
        });
      }
    });

    // If less than 2 factions extracted, synthesize 2 opposing sides dynamically
    if (detected.length < 2) {
      if (detected.length === 0) {
        detected.push({
          id: "faction_0",
          name: "მხარე A (დამცველები / კოალიცია)",
          primaryColor: this.palette[0].primary,
          lightColor: this.palette[0].light,
          borderColor: this.palette[0].primary
        });
      }
      detected.push({
        id: "faction_1",
        name: "მხარე B (შემტევები / მოწინააღმდეგე)",
        primaryColor: this.palette[1].primary,
        lightColor: this.palette[1].light,
        borderColor: this.palette[1].primary
      });
    }

    return detected;
  }

  /**
   * Generic City & Location Extractor & Coordinate Layout
   */
  extractLocations(text, sentences, factions, theater) {
    const lower = text.toLowerCase();
    const cities = [];

    // Dictionary of known geo-points across multiple world theaters
    const geoDB = {
      // აფხაზეთი & დასავლეთ საქართველო
      "სოხუმი": { x: 500, y: 280, imp: "capital", name: "სოხუმი" },
      "გაგრა": { x: 260, y: 170, imp: "fortress", name: "გაგრა" },
      "ოჩამჩირე": { x: 670, y: 380, imp: "town", name: "ოჩამჩირე" },
      "გუდაუთა": { x: 380, y: 210, imp: "fortress", name: "გუდაუთა" },
      "ტყვარჩელი": { x: 660, y: 270, imp: "town", name: "ტყვარჩელი" },
      "გალი": { x: 780, y: 440, imp: "town", name: "გალი" },
      "ლეჩეფსიფსე": { x: 220, y: 140, imp: "town", name: "ლესელიძე" },
      "გუმისტა": { x: 450, y: 250, imp: "battlefield", name: "მდ. გუმისტის ხაზი" },
      
      // ამერიკის სამოქალაქო ომი
      "ვაშინგტონი": { x: 650, y: 220, imp: "capital", name: "ვაშინგტონი (DC)" },
      "რიჩმონდი": { x: 650, y: 390, imp: "capital", name: "რიჩმონდი (Confederate Capital)" },
      "გეტისბურგი": { x: 580, y: 160, imp: "battlefield", name: "გეტისბურგი" },
      "ბულ-რანი": { x: 610, y: 270, imp: "battlefield", name: "მანასასი / ბულ-რანი" },
      "ვიქსბურგი": { x: 340, y: 480, imp: "fortress", name: "ვიქსბურგი (მისისიპი)" },
      "ატლანტა": { x: 460, y: 460, imp: "fortress", name: "ატლანტა" },

      // ევროპა / ნაპოლეონი / მსოფლიო
      "პარიზი": { x: 320, y: 280, imp: "capital", name: "პარიზი" },
      "ლონდონი": { x: 300, y: 180, imp: "capital", name: "ლონდონი" },
      "ბერლინი": { x: 560, y: 220, imp: "capital", name: "ბერლინი" },
      "მოსკოვი": { x: 800, y: 180, imp: "capital", name: "მოსკოვი" },
      "სტალინგრადი": { x: 720, y: 320, imp: "fortress", name: "სტალინგრადი" },
      "კურსკი": { x: 640, y: 260, imp: "battlefield", name: "კურსკის რკალი" },
      "რომი": { x: 450, y: 420, imp: "capital", name: "რომი" },
      "კართაგენი": { x: 410, y: 550, imp: "capital", name: "კართაგენი" },
      "კანი": { x: 540, y: 390, imp: "battlefield", name: "კანი" }
    };

    // Match locations from text
    Object.keys(geoDB).forEach(key => {
      if (lower.includes(key)) {
        const item = geoDB[key];
        if (!cities.some(c => c.name === item.name)) {
          cities.push({
            id: "loc_" + cities.length,
            name: item.name,
            x: item.x,
            y: item.y,
            importance: item.imp,
            ownerFactionId: factions[0].id,
            isBesieged: false,
            fortificationLevel: item.imp === "capital" ? 3 : item.imp === "fortress" ? 2 : 1
          });
        }
      }
    });

    // If theater is generic medieval / fantasy or custom, generate layout
    if (cities.length < 3) {
      if (theater === "mountain_theater" || lower.includes("უღელტეხილი") || lower.includes("mountain pass") || lower.includes("castle")) {
        cities.push(
          { id: "loc_0", name: "ჩრდილოეთის ციტადელი", x: 280, y: 200, importance: "capital", ownerFactionId: factions[0].id, isBesieged: false, fortificationLevel: 3 },
          { id: "loc_1", name: "მთის უღელტეხილის ციხე", x: 500, y: 320, importance: "fortress", ownerFactionId: factions[0].id, isBesieged: true, fortificationLevel: 2 },
          { id: "loc_2", name: "სამხრეთის სატახტო ქალაქი", x: 740, y: 440, importance: "capital", ownerFactionId: factions[1].id, isBesieged: false, fortificationLevel: 3 },
          { id: "loc_3", name: "ხეობის დასახლება", x: 420, y: 460, importance: "town", ownerFactionId: factions[1].id, isBesieged: false, fortificationLevel: 1 }
        );
      } else if (theater === "coastal_theater" || lower.includes("ზღვა") || lower.includes("coast")) {
        cities.push(
          { id: "loc_0", name: "ჩრდილო-დასავლეთის პორტი", x: 260, y: 220, importance: "fortress", ownerFactionId: factions[1].id, isBesieged: false, fortificationLevel: 2 },
          { id: "loc_1", name: "ცენტრალური საპორტო დედაქალაქი", x: 520, y: 300, importance: "capital", ownerFactionId: factions[0].id, isBesieged: true, fortificationLevel: 3 },
          { id: "loc_2", name: "სამხრეთ-აღმოსავლეთის ქალაქი", x: 760, y: 420, importance: "town", ownerFactionId: factions[0].id, isBesieged: false, fortificationLevel: 1 }
        );
      } else {
        cities.push(
          { id: "loc_0", name: "დასავლეთის ფორპოსტი", x: 280, y: 300, importance: "fortress", ownerFactionId: factions[0].id, isBesieged: false, fortificationLevel: 2 },
          { id: "loc_1", name: "სტრატეგიული ცენტრი", x: 510, y: 320, importance: "capital", ownerFactionId: factions[0].id, isBesieged: false, fortificationLevel: 3 },
          { id: "loc_2", name: "აღმოსავლეთის ციხესიმაგრე", x: 740, y: 330, importance: "capital", ownerFactionId: factions[1].id, isBesieged: false, fortificationLevel: 2 }
        );
      }
    }

    return cities;
  }

  /**
   * Generic Armies & Military Formations Extractor
   */
  extractArmies(text, sentences, factions, cities, theater) {
    const armies = [];
    const f1 = factions[0];
    const f2 = factions[1] || factions[0];

    const cLeft = cities[0] || { x: 300, y: 300 };
    const cRight = cities[cities.length - 1] || { x: 700, y: 350 };

    // Faction 1 Armies
    armies.push({
      id: "army_f1_main",
      name: `${f1.name} (მთავარი დაჯგუფება)`,
      commander: "მთავარსარდალი A",
      factionId: f1.id,
      startX: cLeft.x - 30,
      startY: cLeft.y + 10,
      x: cLeft.x - 30,
      y: cLeft.y + 10,
      strength: 45000,
      maxStrength: 45000,
      unitType: "infantry_heavy",
      status: "ready"
    });

    armies.push({
      id: "army_f1_support",
      name: `${f1.name} (მხარდამჭერი / ფლანგი)`,
      commander: "ფლანგის მეთაური",
      factionId: f1.id,
      startX: cLeft.x + 20,
      startY: cLeft.y - 60,
      x: cLeft.x + 20,
      y: cLeft.y - 60,
      strength: 20000,
      maxStrength: 20000,
      unitType: "cavalry",
      status: "ready"
    });

    // Faction 2 Armies
    armies.push({
      id: "army_f2_main",
      name: `${f2.name} (დარტყმითი ძალები)`,
      commander: "მთავარსარდალი B",
      factionId: f2.id,
      startX: cRight.x + 40,
      startY: cRight.y - 20,
      x: cRight.x + 40,
      y: cRight.y - 20,
      strength: 55000,
      maxStrength: 55000,
      unitType: "infantry_heavy",
      status: "ready"
    });

    armies.push({
      id: "army_f2_flank",
      name: `${f2.name} (ავანგარდი / მობილური შენაერთი)`,
      commander: "ავანგარდის სარდალი",
      factionId: f2.id,
      startX: cRight.x - 20,
      startY: cRight.y + 60,
      x: cRight.x - 20,
      y: cRight.y + 60,
      strength: 25000,
      maxStrength: 25000,
      unitType: "cavalry",
      status: "ready"
    });

    return armies;
  }

  /**
   * Generate Keyframe Sequence with Dynamic Battle Behaviors
   */
  generateDynamicKeyframes(text, sentences, factions, cities, armies, theater) {
    const keyframes = [];
    const f1Main = armies[0];
    const f1Sub = armies[1];
    const f2Main = armies[2];
    const f2Sub = armies[3];
    const centerCity = cities[Math.floor(cities.length / 2)] || { x: 500, y: 320 };

    // Detect primary battle theme in prompt
    let battleType = "open_field";
    for (const [typeKey, keywords] of Object.entries(this.battleTypeKeywords)) {
      if (keywords.some(k => text.toLowerCase().includes(k))) {
        battleType = typeKey;
        break;
      }
    }

    // Step 0: Initial concentration
    keyframes.push({
      time: 0,
      date: "კამპანიის დასაწყისი - ძალთა კონცენტრაცია",
      title: "საწყისი პოზიციების დაკავება და მობილიზაცია",
      description: "დაპირისპირებული მხარეები აგროვებენ ძალებს სასტარტო პოზიციებზე. სტრატეგიული გზები და სიმაღლეები კონტროლის ქვეშაა.",
      phase: "mobilization",
      armyPositions: {
        [f1Main.id]: { x: f1Main.startX, y: f1Main.startY, strength: f1Main.strength, status: "ready" },
        [f1Sub.id]: { x: f1Sub.startX, y: f1Sub.startY, strength: f1Sub.strength, status: "ready" },
        [f2Main.id]: { x: f2Main.startX, y: f2Main.startY, strength: f2Main.strength, status: "ready" },
        [f2Sub.id]: { x: f2Sub.startX, y: f2Sub.startY, strength: f2Sub.strength, status: "ready" }
      },
      arrows: [],
      cityStates: cities.map(c => ({ id: c.id, ownerFactionId: c.ownerFactionId, isBesieged: false })),
      tacticalNote: "მხარეები იწყებენ საომარი გეგმის განხორციელებას."
    });

    // Step 1: March / Mountain Crossing / River Approach
    let step1Title = "არმიების წინსვლა და მარში";
    let step1Desc = "მთავარი დამრტყმელი შენაერთები იწყებენ მოძრაობას საკვანძო პოზიციებისკენ.";
    if (battleType === "mountain_pass") {
      step1Title = "მთის უღელტეხილის გადალახვა";
      step1Desc = "შემტევი არმია ვიწრო ხეობებითა და მთის უღელტეხილებით მიიწევს მოწინააღმდეგის ციტადელისკენ.";
    } else if (battleType === "siege") {
      step1Title = "ქალაქის მისადგომებთან მიახლოება";
      step1Desc = "საალყო კორპუსები უახლოვდებიან ციტადელს და იწყებენ გარემოცვის პოზიციების მოწყობას.";
    }

    keyframes.push({
      time: 4.5,
      date: "ფაზა I - შეტევითი მანევრი",
      title: step1Title,
      description: step1Desc,
      phase: "advance",
      armyPositions: {
        [f1Main.id]: { x: (f1Main.startX + centerCity.x) / 2 - 30, y: (f1Main.startY + centerCity.y) / 2, strength: f1Main.strength, status: "marching" },
        [f1Sub.id]: { x: centerCity.x - 70, y: centerCity.y - 60, strength: f1Sub.strength, status: "marching" },
        [f2Main.id]: { x: centerCity.x + 60, y: centerCity.y, strength: f2Main.strength, status: "marching" },
        [f2Sub.id]: { x: centerCity.x + 80, y: centerCity.y + 60, strength: f2Sub.strength, status: "marching" }
      },
      arrows: [
        { fromX: f1Main.startX, fromY: f1Main.startY, toX: centerCity.x - 30, toY: centerCity.y, color: factions[0].primaryColor, type: "advance", label: "მარში" },
        { fromX: f2Main.startX, fromY: f2Main.startY, toX: centerCity.x + 60, toY: centerCity.y, color: factions[1].primaryColor, type: "advance", label: "წინსვლა" }
      ],
      cityStates: cities.map(c => ({ id: c.id, ownerFactionId: c.ownerFactionId, isBesieged: battleType === "siege" && c.id === centerCity.id })),
      tacticalNote: "დაპირისპირებული ძალები საბრძოლო დისტანციაზე გადიან."
    });

    // Step 2: Epic Battle / Encirclement / Siege Assault
    let step2Title = "გადამწყვეტი შეტაკება";
    let step2Desc = "ფრონტის მთელ ხაზზე იწყება სასტიკი ბრძოლა. ცენტრალური შეჯახება და ფლანგური მანევრები.";
    if (battleType === "siege") {
      step2Title = "ციხესიმაგრის ალყა და შტურმი";
      step2Desc = "არმიამ სრულ რკალში მოაქცია ციტადელი. არტილერია/საალყო იარაღი უტევს კედლებს, დამცველები იგერიებენ იერიშს.";
    } else if (battleType === "encirclement") {
      step2Title = "ორმაგი ფლანგური ალყა (ქვაბი)";
      step2Desc = "მოწინააღმდეგის ფლანგები გაირღვა და ცენტრალური დაჯგუფება სრულ გარემოცვაში მოექცა.";
    }

    keyframes.push({
      time: 9.5,
      date: "ფაზა II - ბრძოლის კულმინაცია",
      title: step2Title,
      description: step2Desc,
      phase: "battle",
      armyPositions: {
        [f1Main.id]: { x: centerCity.x - 25, y: centerCity.y - 10, strength: Math.round(f1Main.strength * 0.85), status: "in_combat" },
        [f1Sub.id]: { x: centerCity.x + 20, y: centerCity.y - 45, strength: Math.round(f1Sub.strength * 0.90), status: "in_combat" },
        [f2Main.id]: { x: centerCity.x + 35, y: centerCity.y - 10, strength: Math.round(f2Main.strength * 0.58), status: "in_combat" },
        [f2Sub.id]: { x: centerCity.x + 55, y: centerCity.y + 40, strength: Math.round(f2Sub.strength * 0.50), status: "in_combat" }
      },
      arrows: [
        { fromX: centerCity.x - 70, fromY: centerCity.y - 60, toX: centerCity.x + 20, toY: centerCity.y - 45, color: factions[0].primaryColor, type: "flank", label: "ფლანგური დარტყმა" }
      ],
      battleClashes: [
        { x: centerCity.x, y: centerCity.y - 10, intensity: 1.0, label: "მთავარი შეტაკება" }
      ],
      cityStates: cities.map(c => ({ id: c.id, ownerFactionId: c.ownerFactionId, isBesieged: c.id === centerCity.id })),
      tacticalNote: "კრიტიკული მომენტი: დანაკარგები იზრდება, თავდაცვა ირღვევა."
    });

    // Step 3: Enemy Collapse / Tactical Retreat
    keyframes.push({
      time: 14.0,
      date: "ფაზა III - მოწინააღმდეგის უკანდახევა და დევნა",
      title: "ფრონტის გარღვევა და ტაქტიკური უკანდახევა",
      description: "მოწინააღმდეგის რიგები იშლება. ნაწილები ტოვებენ ბრძოლის ველს და იხევენ უკან.",
      phase: "retreat",
      armyPositions: {
        [f1Main.id]: { x: centerCity.x + 20, y: centerCity.y - 10, strength: Math.round(f1Main.strength * 0.80), status: "pursuing" },
        [f1Sub.id]: { x: centerCity.x + 50, y: centerCity.y + 10, strength: Math.round(f1Sub.strength * 0.85), status: "pursuing" },
        [f2Main.id]: { x: f2Main.startX + 70, y: f2Main.startY, strength: Math.round(f2Main.strength * 0.25), status: "retreating" },
        [f2Sub.id]: { x: f2Sub.startX + 80, y: f2Sub.startY + 40, strength: Math.round(f2Sub.strength * 0.20), status: "disbanded" }
      },
      arrows: [
        { fromX: centerCity.x + 35, fromY: centerCity.y - 10, toX: f2Main.startX + 70, toY: f2Main.startY, color: "#e11d48", type: "retreat", label: "უკანდახევა" },
        { fromX: centerCity.x, fromY: centerCity.y, toX: centerCity.x + 60, toY: centerCity.y, color: factions[0].primaryColor, type: "pursuit", label: "დევნა" }
      ],
      cityStates: cities.map((c, i) => ({
        id: c.id,
        ownerFactionId: i <= Math.floor(cities.length / 2) ? factions[0].id : c.ownerFactionId,
        isBesieged: false
      })),
      tacticalNote: "მოწინააღმდეგე ტოვებს პოზიციებს; დანაყოფის დაშლა არ ნიშნავს ყველა მეომრის დაღუპვას."
    });

    // Step 4: Complete Victory & Territorial Hegemony
    keyframes.push({
      time: 18.0,
      date: "ფაზა IV - კამპანიის დასასრული და ტერიტორიული კონტროლი",
      title: "სრული გამარჯვება და სტრატეგიული პუნქტების დაკავება",
      description: "სამხედრო კამპანია დასრულდა. ქალაქები და ტერიტორიები სრულად გადავიდა გამარჯვებული მხარის კონტროლქვეშ.",
      phase: "victory",
      armyPositions: {
        [f1Main.id]: { x: centerCity.x + 60, y: centerCity.y, strength: Math.round(f1Main.strength * 0.78), status: "garrison" },
        [f1Sub.id]: { x: (cities[cities.length - 1]?.x || 700), y: (cities[cities.length - 1]?.y || 350), strength: Math.round(f1Sub.strength * 0.82), status: "garrison" },
        [f2Main.id]: { x: 960, y: f2Main.startY, strength: Math.round(f2Main.strength * 0.15), status: "disbanded" },
        [f2Sub.id]: { x: 980, y: f2Sub.startY + 50, strength: 0, status: "eliminated" }
      },
      arrows: [],
      cityStates: cities.map(c => ({ id: c.id, ownerFactionId: factions[0].id, isBesieged: false })),
      tacticalNote: "საბოლოო ისტორიული შედეგი: ახალი ტერიტორიული რეალობის დამყარება."
    });

    return keyframes;
  }

  /**
   * Procedural Landscape Generator matching the theater
   */
  generateDynamicTerrain(theater, cities, armies) {
    if (theater === "coastal_theater" || theater === "caucasus") {
      return {
        rivers: [
          [ { x: 250, y: 120 }, { x: 300, y: 240 }, { x: 450, y: 320 }, { x: 670, y: 390 }, { x: 850, y: 520 } ]
        ],
        mountains: [
          { x: 200, y: 100, radius: 55, label: "კავკასიონის ქედი / მთიანეთი" },
          { x: 380, y: 110, radius: 60 },
          { x: 580, y: 130, radius: 65 },
          { x: 780, y: 150, radius: 70 }
        ],
        forests: [
          { x: 340, y: 260, radius: 45 },
          { x: 620, y: 340, radius: 50 }
        ]
      };
    }

    if (theater === "american_civil_war") {
      return {
        rivers: [
          [ { x: 550, y: 80 }, { x: 620, y: 220 }, { x: 650, y: 390 }, { x: 700, y: 550 } ], // Potomac & James Rivers
          [ { x: 300, y: 150 }, { x: 340, y: 480 }, { x: 360, y: 600 } ] // Mississippi
        ],
        mountains: [
          { x: 420, y: 180, radius: 60, label: "აპალაჩების მთები (Appalachians)" },
          { x: 460, y: 340, radius: 65 }
        ],
        forests: [
          { x: 590, y: 310, radius: 40, label: "უილდერნესი (Wilderness)" }
        ]
      };
    }

    if (theater === "mountain_theater") {
      return {
        rivers: [
          [ { x: 150, y: 150 }, { x: 480, y: 320 }, { x: 850, y: 480 } ]
        ],
        mountains: [
          { x: 280, y: 180, radius: 70, label: "ჩრდილოეთის მაღალმთიანეთი" },
          { x: 500, y: 160, radius: 80, label: "უღელტეხილი (Pass)" },
          { x: 720, y: 200, radius: 75 },
          { x: 350, y: 520, radius: 65, label: "სამხრეთის მასივი" }
        ],
        forests: [
          { x: 480, y: 420, radius: 55 }
        ]
      };
    }

    // Default procedural landscape
    return {
      rivers: [
        [ { x: 100, y: 180 }, { x: 350, y: 240 }, { x: 520, y: 340 }, { x: 750, y: 390 }, { x: 950, y: 520 } ]
      ],
      mountains: [
        { x: 220, y: 110, radius: 50, label: "ჩრდილოეთის ქედი" },
        { x: 540, y: 90, radius: 60, label: "მთიანი მასივი" },
        { x: 800, y: 120, radius: 55 }
      ],
      forests: [
        { x: 400, y: 260, radius: 45 },
        { x: 680, y: 440, radius: 50 }
      ]
    };
  }
}

export const PromptParser = GenericPromptInterpreter;
