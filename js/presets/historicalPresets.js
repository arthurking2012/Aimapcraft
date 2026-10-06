/**
 * Preset Historical War Scenarios with Rich Prompts & Accurate Tactical Data
 * ისტორიული ომებისა და ბრძოლების მზა შაბლონები ქართულად
 */

export const HISTORICAL_PRESETS = [
  {
    id: "abkhazia_1992_1993",
    title: "აფხაზეთის ომი და სოხუმის ეპოპეა (1992–1993 წწ.)",
    period: "1992 წლის 14 აგვისტო – 1993 წლის 27 სექტემბერი",
    category: "საქართველოს უახლესი ისტორია",
    description: "საქართველოს ტერიტორიული მთლიანობისთვის ბრძოლის სრული ქრონიკა: ენგურის გადაკვეთა, გაგრის ტრაგედია, გუმისტის გმირული თავდაცვა, ტამიშის დესანტის განადგურება, სოჭის ზავის მუხანათური დარღვევა, სოხუმის 11-დღიანი ალყა და ჭუბერის დევნილთა გოლგოთა.",
    prompt: `1992 წლის 14 აგვისტო – 1993 წლის 27 სექტემბერი. აფხაზეთის ომი.
ვიდეოს ხანგრძლივობა: 3 წუთი.
1992 წლის 14 აგვისტოს საქართველოს ეროვნული გვარდიის შენაერთები გენერალ გია ყარყარაშვილის მეთაურობით რკინიგზისა და სატრანსპორტო დერეფნის დასაცავად გადავიდნენ ენგურზე, დაიკავეს გალი, ოჩამჩირე, გულრიფში და შევიდნენ სოხუმში. პარალელურად გაგრაში განხორციელდა საზღვაო დესანტი და კონტროლი დამყარდა ლესელიძემდე. არძინბას სეპარატისტული ძალები გუდაუთის რუსულ სამხედრო ბაზაზე გადაჯგუფდნენ.
1992 წლის 2-6 ოქტომბერი: რუსული ავიაციისა და ჩრდილოკავკასიელ კონფედერატთა (შამილ ბასაევის ბატალიონის, კაზაკების) მასირებული იერიშით გაგრა დაეცა. დაიწყო მშვიდობიანი ქართველი მოსახლეობის სასტიკი ეთნიკური წმენდა. ქართულმა ძალებმა გუმისტის ხაზზე დაიკავეს თავდაცვა.
1993 წლის 15-16 მარტი: სეპარატისტებმა და რუსეთის რეგულარულმა ნაწილებმა მდინარე გუმისტაზე განახორციელეს ფართომასშტაბიანი შტურმი სოხუმის ასაღებად. გენერალ გენო ადამიას 23-ე ბრიგადისა და ქართველი მებრძოლების გმირული თავდაცვით მტერს უმძიმესი მარცხი მიადგა.
1993 წლის 2-10 ივლისი: მტერმა ოჩამჩირის რაიონში, სოფელ ტამიშთან რუსული სამხედრო ხომალდებიდან გადმოსხა ელიტური საზღვაო დესანტი სოხუმის ზურგის მოსაჭრელად. ქართულმა შენაერთებმა კონტრშეტევით სრულად გაანადგურეს ტამიშის დესანტი და გახსნეს სტრატეგიული მაგისტრალი.
1993 წლის 27 ივლისი: რუსეთის შუამავლობით დაიდო სოჭის სამშვიდობო ზავი. ქართულმა მხარემ პირობა შეასრულა და სოხუმიდან გაიყვანა მძიმე ტექნიკა და არტილერია.
1993 წლის 16-27 სექტემბერი: მტერმა მუხანათურად დაარღვია სოჭის ზავი, მძიმე არტილერიით, ტანკებითა და ავიაციით სრული ალყა შემოარტყა განიარაღებულ სოხუმს. 11-დღიანი უთანასწორო გმირული ბრძოლის შემდეგ, 27 სექტემბერს სოხუმი დაეცა. მთავრობის თავმჯდომარე ჟიული შარტავა და მინისტრთა საბჭოს წევრები გმირულად დაიღუპნენ.
1993 წლის სექტემბრის ბოლო – ოქტომბერი: 300 000-მდე მშვიდობიანი დევნილი და მებრძოლები ჭუბერის თოვლიანი უღელტეხილითა და ენგურის მიმართულებით დაიძრნენ. აფხაზეთის ტერიტორია დროებით ოკუპირებულია.`,
    scenarioData: {
      id: "abkhazia_1992_1993",
      title: "აფხაზეთის ომი და სოხუმის ბრძოლა (1992–1993 წწ.)",
      period: "1992–1993 წწ.",
      theater: "abkhazia",
      mapBounds: { width: 1000, height: 650 },
      factions: [
        { id: "georgia_guard", name: "საქართველოს შეიარაღებული ძალები & გვარდია", primaryColor: "#2563eb", lightColor: "rgba(37, 99, 235, 0.28)", borderColor: "#1d4ed8" },
        { id: "abkhaz_coalition", name: "აფხაზური ფორმირებები & კონფედერატები", primaryColor: "#dc2626", lightColor: "rgba(220, 38, 38, 0.28)", borderColor: "#b91c1c" }
      ],
      cities: [
        { id: "leselidze", name: "ლესელიძე (სასაზღვრო ხაზი)", x: 130, y: 110, importance: "town", ownerFactionId: "georgia_guard", isBesieged: false, fortificationLevel: 1 },
        { id: "gagra", name: "გაგრა", x: 220, y: 155, importance: "fortress", ownerFactionId: "georgia_guard", isBesieged: false, fortificationLevel: 2 },
        { id: "pitsunda", name: "ბიჭვინთა", x: 270, y: 215, importance: "town", ownerFactionId: "abkhaz_coalition", isBesieged: false, fortificationLevel: 1 },
        { id: "gudauta", name: "გუდაუთა (სეპარატისტთა ბაზა)", x: 360, y: 220, importance: "fortress", ownerFactionId: "abkhaz_coalition", isBesieged: false, fortificationLevel: 3 },
        { id: "akhali_atoni", name: "ახალი ათონი", x: 420, y: 245, importance: "town", ownerFactionId: "abkhaz_coalition", isBesieged: false, fortificationLevel: 1 },
        { id: "gumista", name: "მდ. გუმისტის ფრონტის ხაზი", x: 475, y: 270, importance: "battlefield", ownerFactionId: "georgia_guard", isBesieged: false, fortificationLevel: 3 },
        { id: "sokhumi", name: "სოხუმი (დედაქალაქი & ციტადელი)", x: 530, y: 290, importance: "capital", ownerFactionId: "georgia_guard", isBesieged: false, fortificationLevel: 3 },
        { id: "gulripshi", name: "გულრიფში & ბაბუშერა", x: 600, y: 340, importance: "town", ownerFactionId: "georgia_guard", isBesieged: false, fortificationLevel: 2 },
        { id: "tamishi", name: "ტამიში & კინდღი", x: 670, y: 385, importance: "battlefield", ownerFactionId: "georgia_guard", isBesieged: false, fortificationLevel: 1 },
        { id: "ochamchire", name: "ოჩამჩირე", x: 720, y: 415, importance: "town", ownerFactionId: "georgia_guard", isBesieged: false, fortificationLevel: 2 },
        { id: "tkvarcheli", name: "ტყვარჩელი (ანკლავი)", x: 730, y: 295, importance: "fortress", ownerFactionId: "abkhaz_coalition", isBesieged: false, fortificationLevel: 2 },
        { id: "gali", name: "გალი", x: 810, y: 465, importance: "town", ownerFactionId: "georgia_guard", isBesieged: false, fortificationLevel: 1 },
        { id: "chuberi", name: "ჭუბერის უღელტეხილი (სვანეთი)", x: 875, y: 175, importance: "fortress", ownerFactionId: "georgia_guard", isBesieged: false, fortificationLevel: 1 },
        { id: "enguri", name: "ენგურის ხიდი & ზუგდიდი", x: 910, y: 510, importance: "capital", ownerFactionId: "georgia_guard", isBesieged: false, fortificationLevel: 3 }
      ],
      armies: [
        { id: "geo_main", name: "საქართველოს ეროვნული გვარდია", commander: "გენერალი გია ყარყარაშვილი", factionId: "georgia_guard", startX: 880, startY: 490, x: 880, y: 490, strength: 16000, maxStrength: 16000, unitType: "infantry_heavy", status: "ready" },
        { id: "geo_sokhumi_corps", name: "სოხუმის 23-ე ბრიგადა & მოხალისეები", commander: "გენერალი გენო ადამია", factionId: "georgia_guard", startX: 520, startY: 280, x: 520, y: 280, strength: 8500, maxStrength: 8500, unitType: "infantry_heavy", status: "ready" },
        { id: "geo_gagra", name: "გაგრის დაჯგუფება და „ავაზა“", commander: "გაგრის ბატალიონები", factionId: "georgia_guard", startX: 220, startY: 165, x: 220, y: 165, strength: 4200, maxStrength: 4200, unitType: "infantry_heavy", status: "ready" },
        { id: "geo_refugees", name: "მშვიდობიანი მოსახლეობა (დევნილები)", commander: "დევნილთა კოლონა", factionId: "georgia_guard", startX: 540, startY: 300, x: 540, y: 300, strength: 250000, maxStrength: 250000, unitType: "infantry_light", status: "ready" },
        { id: "abkhaz_gudauta", name: "გუდაუთის დაჯგუფება & რუსული ნაწილები", commander: "ვლადისლავ არძინბა / სოსნალიევი", factionId: "abkhaz_coalition", startX: 350, startY: 215, x: 350, y: 215, strength: 14000, maxStrength: 14000, unitType: "infantry_heavy", status: "ready" },
        { id: "basaev_batalion", name: "ჩრდილოკავკასიელთა კონფედერაცია (ბასაევი)", commander: "შამილ ბასაევი & კაზაკები", factionId: "abkhaz_coalition", startX: 190, startY: 110, x: 190, y: 110, strength: 7500, maxStrength: 7500, unitType: "cavalry", status: "ready" },
        { id: "russian_desant", name: "ტამიშის საზღვაო დესანტი", commander: "საზღვაო ელიტური დესანტი", factionId: "abkhaz_coalition", startX: 670, startY: 430, x: 670, y: 430, strength: 3500, maxStrength: 3500, unitType: "infantry_heavy", status: "ready" }
      ],
      keyframes: [
        {
          time: 0,
          date: "1992 წლის 14-18 აგვისტო",
          title: "ქართული ძალების შესვლა და კონტროლის დამყარება",
          description: "ეროვნული გვარდია გია ყარყარაშვილის მეთაურობით რკინიგზის დასაცავად გადადის ენგურზე, ათავისუფლებს გალს, ოჩამჩირესა და სოხუმს. გაგრაში ხორციელდება საზღვაო დესანტი ლესელიძემდე. სეპარატისტები გუდაუთის ბაზაზე იხევენ.",
          phase: "advance",
          armyPositions: {
            geo_main: { x: 550, y: 310, strength: 16000, status: "marching" },
            geo_sokhumi_corps: { x: 520, y: 280, strength: 8500, status: "ready" },
            geo_gagra: { x: 220, y: 160, strength: 4200, status: "ready" },
            geo_refugees: { x: 540, y: 300, strength: 250000, status: "ready" },
            abkhaz_gudauta: { x: 350, y: 215, strength: 14000, status: "ready" },
            basaev_batalion: { x: 190, y: 110, strength: 7500, status: "ready" },
            russian_desant: { x: 670, y: 450, strength: 0, status: "ready" }
          },
          arrows: [
            { fromX: 880, fromY: 490, toX: 550, toY: 310, color: "#2563eb", type: "advance", label: "ენგურის გადაკვეთა და სოხუმის დაკავება" }
          ],
          cityStates: [
            { id: "leselidze", ownerFactionId: "georgia_guard", isBesieged: false },
            { id: "gagra", ownerFactionId: "georgia_guard", isBesieged: false },
            { id: "pitsunda", ownerFactionId: "abkhaz_coalition", isBesieged: false },
            { id: "gudauta", ownerFactionId: "abkhaz_coalition", isBesieged: false },
            { id: "akhali_atoni", ownerFactionId: "abkhaz_coalition", isBesieged: false },
            { id: "gumista", ownerFactionId: "georgia_guard", isBesieged: false },
            { id: "sokhumi", ownerFactionId: "georgia_guard", isBesieged: false },
            { id: "gulripshi", ownerFactionId: "georgia_guard", isBesieged: false },
            { id: "tamishi", ownerFactionId: "georgia_guard", isBesieged: false },
            { id: "ochamchire", ownerFactionId: "georgia_guard", isBesieged: false },
            { id: "tkvarcheli", ownerFactionId: "abkhaz_coalition", isBesieged: false },
            { id: "gali", ownerFactionId: "georgia_guard", isBesieged: false },
            { id: "chuberi", ownerFactionId: "georgia_guard", isBesieged: false },
            { id: "enguri", ownerFactionId: "georgia_guard", isBesieged: false }
          ],
          tacticalNote: "საქართველოს ძალები აკონტროლებენ აფხაზეთის ტერიტორიის 85%-ს."
        },
        {
          time: 25,
          date: "1992 წლის 2-6 ოქტომბერი - გაგრის ტრაგედია",
          title: "გაგრის დაცემა და ჩრდილოეთის ფრონტის მოშლა",
          description: "რუსული ავიაციის, ტანკებისა და ჩრდილოკავკასიელი კონფედერატების (ბასაევის ბატალიონი) მასირებული იერიში გაგრაზე. გაგრა ეცემა; მტერი ახორციელებს მშვიდობიანი მოსახლეობის სასტიკ ეთნოწმენდას.",
          phase: "battle",
          armyPositions: {
            geo_main: { x: 500, y: 295, strength: 15500, status: "ready" },
            geo_sokhumi_corps: { x: 480, y: 275, strength: 8400, status: "ready" },
            geo_gagra: { x: 190, y: 190, strength: 1100, status: "retreating" },
            geo_refugees: { x: 540, y: 300, strength: 250000, status: "ready" },
            abkhaz_gudauta: { x: 300, y: 195, strength: 13500, status: "marching" },
            basaev_batalion: { x: 220, y: 155, strength: 7200, status: "in_combat" },
            russian_desant: { x: 670, y: 450, strength: 0, status: "ready" }
          },
          arrows: [
            { fromX: 190, fromY: 110, toX: 220, toY: 155, color: "#dc2626", type: "advance", label: "იერიში გაგრაზე" },
            { fromX: 220, fromY: 165, toX: 180, toY: 210, color: "#e11d48", type: "retreat", label: "გაგრის დაჯგუფების უკანდახევა" }
          ],
          battleClashes: [
            { x: 220, y: 155, intensity: 1.0, label: "გაგრის ბრძოლა" }
          ],
          cityStates: [
            { id: "leselidze", ownerFactionId: "abkhaz_coalition", isBesieged: false },
            { id: "gagra", ownerFactionId: "abkhaz_coalition", isBesieged: false },
            { id: "pitsunda", ownerFactionId: "abkhaz_coalition", isBesieged: false },
            { id: "gudauta", ownerFactionId: "abkhaz_coalition", isBesieged: false },
            { id: "akhali_atoni", ownerFactionId: "abkhaz_coalition", isBesieged: false },
            { id: "gumista", ownerFactionId: "georgia_guard", isBesieged: false },
            { id: "sokhumi", ownerFactionId: "georgia_guard", isBesieged: false },
            { id: "gulripshi", ownerFactionId: "georgia_guard", isBesieged: false },
            { id: "tamishi", ownerFactionId: "georgia_guard", isBesieged: false },
            { id: "ochamchire", ownerFactionId: "georgia_guard", isBesieged: false },
            { id: "tkvarcheli", ownerFactionId: "abkhaz_coalition", isBesieged: false },
            { id: "gali", ownerFactionId: "georgia_guard", isBesieged: false },
            { id: "chuberi", ownerFactionId: "georgia_guard", isBesieged: false },
            { id: "enguri", ownerFactionId: "georgia_guard", isBesieged: false }
          ],
          tacticalNote: "ჩრდილოეთის ფრონტი მოიშალა; მთავარი თავდაცვითი პოზიცია გუმისტის მდინარეზე გამაგრდა."
        },
        {
          time: 55,
          date: "1993 წლის 15-16 მარტი - გუმისტის ეპოპეა",
          title: "მდინარე გუმისტის გმირული თავდაცვა და მტრის მოგერიება",
          description: "სეპარატისტებმა და რუსეთის რეგულარულმა არმიამ სოხუმის ასაღებად გუმისტაზე მასირებული იერიში მიიტანეს. გენო ადამიას 23-ე ბრიგადამ მტერს გამანადგურებელი დარტყმა მიაყენა და უკუაქცია.",
          phase: "battle",
          armyPositions: {
            geo_main: { x: 490, y: 285, strength: 15000, status: "in_combat" },
            geo_sokhumi_corps: { x: 475, y: 270, strength: 8200, status: "in_combat" },
            geo_gagra: { x: 999, y: 999, strength: 0, status: "eliminated" },
            geo_refugees: { x: 540, y: 300, strength: 250000, status: "ready" },
            abkhaz_gudauta: { x: 450, y: 260, strength: 9500, status: "in_combat" },
            basaev_batalion: { x: 430, y: 240, strength: 5200, status: "in_combat" },
            russian_desant: { x: 670, y: 450, strength: 0, status: "ready" }
          },
          arrows: [
            { fromX: 360, fromY: 220, toX: 470, toY: 268, color: "#dc2626", type: "advance", label: "გუმისტის მასირებული შტურმი" }
          ],
          battleClashes: [
            { x: 475, y: 270, intensity: 1.0, label: "გუმისტის სასტიკი ბრძოლა" }
          ],
          cityStates: [
            { id: "leselidze", ownerFactionId: "abkhaz_coalition", isBesieged: false },
            { id: "gagra", ownerFactionId: "abkhaz_coalition", isBesieged: false },
            { id: "pitsunda", ownerFactionId: "abkhaz_coalition", isBesieged: false },
            { id: "gudauta", ownerFactionId: "abkhaz_coalition", isBesieged: false },
            { id: "akhali_atoni", ownerFactionId: "abkhaz_coalition", isBesieged: false },
            { id: "gumista", ownerFactionId: "georgia_guard", isBesieged: false },
            { id: "sokhumi", ownerFactionId: "georgia_guard", isBesieged: false },
            { id: "gulripshi", ownerFactionId: "georgia_guard", isBesieged: false },
            { id: "tamishi", ownerFactionId: "georgia_guard", isBesieged: false },
            { id: "ochamchire", ownerFactionId: "georgia_guard", isBesieged: false },
            { id: "tkvarcheli", ownerFactionId: "abkhaz_coalition", isBesieged: false },
            { id: "gali", ownerFactionId: "georgia_guard", isBesieged: false },
            { id: "chuberi", ownerFactionId: "georgia_guard", isBesieged: false },
            { id: "enguri", ownerFactionId: "georgia_guard", isBesieged: false }
          ],
          tacticalNote: "ქართველმა არტილერისტებმა და ქვეითებმა გუმისტის ხაზზე მტრის შეტევა სრულად ჩაახშეს."
        },
        {
          time: 90,
          date: "1993 წლის 2-10 ივლისი - ტამიშის დესანტის განადგურება",
          title: "ტამიშის საზღვაო დესანტის სრული ლიკვიდაცია",
          description: "მტერმა რუსული სამხედრო ხომალდებიდან ოჩამჩირეში, სოფელ ტამიშთან 600-კაციანი ელიტური დესანტი გადმოსხა სოხუმის ზურგის მოსაჭრელად. ქართულმა შენაერთებმა კონტრშეტევით დესანტი სრულად გაანადგურეს.",
          phase: "battle",
          armyPositions: {
            geo_main: { x: 490, y: 280, strength: 14800, status: "ready" },
            geo_sokhumi_corps: { x: 650, y: 375, strength: 7900, status: "in_combat" },
            geo_gagra: { x: 999, y: 999, strength: 0, status: "eliminated" },
            geo_refugees: { x: 540, y: 300, strength: 250000, status: "ready" },
            abkhaz_gudauta: { x: 440, y: 250, strength: 9200, status: "ready" },
            basaev_batalion: { x: 420, y: 235, strength: 5000, status: "ready" },
            russian_desant: { x: 670, y: 385, strength: 900, status: "in_combat" }
          },
          arrows: [
            { fromX: 600, fromY: 340, toX: 670, toY: 385, color: "#2563eb", type: "advance", label: "ტამიშის კონტრშეტევა" },
            { fromX: 670, fromY: 430, toX: 670, toY: 385, color: "#dc2626", type: "advance", label: "საზღვაო დესანტი" }
          ],
          battleClashes: [
            { x: 670, y: 385, intensity: 1.0, label: "ტამიშის სასტიკი ბრძოლა" }
          ],
          cityStates: [
            { id: "leselidze", ownerFactionId: "abkhaz_coalition", isBesieged: false },
            { id: "gagra", ownerFactionId: "abkhaz_coalition", isBesieged: false },
            { id: "pitsunda", ownerFactionId: "abkhaz_coalition", isBesieged: false },
            { id: "gudauta", ownerFactionId: "abkhaz_coalition", isBesieged: false },
            { id: "akhali_atoni", ownerFactionId: "abkhaz_coalition", isBesieged: false },
            { id: "gumista", ownerFactionId: "georgia_guard", isBesieged: false },
            { id: "sokhumi", ownerFactionId: "georgia_guard", isBesieged: false },
            { id: "gulripshi", ownerFactionId: "georgia_guard", isBesieged: false },
            { id: "tamishi", ownerFactionId: "georgia_guard", isBesieged: false },
            { id: "ochamchire", ownerFactionId: "georgia_guard", isBesieged: false },
            { id: "tkvarcheli", ownerFactionId: "abkhaz_coalition", isBesieged: false },
            { id: "gali", ownerFactionId: "georgia_guard", isBesieged: false },
            { id: "chuberi", ownerFactionId: "georgia_guard", isBesieged: false },
            { id: "enguri", ownerFactionId: "georgia_guard", isBesieged: false }
          ],
          tacticalNote: "სოხუმ-ოჩამჩირის ცენტრალური მაგისტრალი გაიხსნა; მტრის ჩანაფიქრი ჩაიშალა."
        },
        {
          time: 120,
          date: "1993 წლის 27 ივლისი - სოჭის ზავი და განიარაღება",
          title: "სოჭის სამშვიდობო ზავი და მძიმე ტექნიკის გაყვანა",
          description: "რუსეთის გარანტიებით დაიდო სოჭის ზავი. ქართულმა მხარემ პატიოსნად შეასრულა ხელშეკრულება და სოხუმიდან გაიყვანა მძიმე ტექნიკა და არტილერია. სეპარატისტები ფარულად მოემზადნენ მოღალატეობრივი დარტყმისთვის.",
          phase: "advance",
          armyPositions: {
            geo_main: { x: 700, y: 400, strength: 14000, status: "ready" },
            geo_sokhumi_corps: { x: 530, y: 290, strength: 6500, status: "ready" },
            geo_gagra: { x: 999, y: 999, strength: 0, status: "eliminated" },
            geo_refugees: { x: 540, y: 300, strength: 250000, status: "ready" },
            abkhaz_gudauta: { x: 440, y: 250, strength: 15000, status: "ready" },
            basaev_batalion: { x: 420, y: 235, strength: 6800, status: "ready" },
            russian_desant: { x: 999, y: 999, strength: 0, status: "eliminated" }
          },
          arrows: [],
          cityStates: [
            { id: "leselidze", ownerFactionId: "abkhaz_coalition", isBesieged: false },
            { id: "gagra", ownerFactionId: "abkhaz_coalition", isBesieged: false },
            { id: "pitsunda", ownerFactionId: "abkhaz_coalition", isBesieged: false },
            { id: "gudauta", ownerFactionId: "abkhaz_coalition", isBesieged: false },
            { id: "akhali_atoni", ownerFactionId: "abkhaz_coalition", isBesieged: false },
            { id: "gumista", ownerFactionId: "georgia_guard", isBesieged: false },
            { id: "sokhumi", ownerFactionId: "georgia_guard", isBesieged: false },
            { id: "gulripshi", ownerFactionId: "georgia_guard", isBesieged: false },
            { id: "tamishi", ownerFactionId: "georgia_guard", isBesieged: false },
            { id: "ochamchire", ownerFactionId: "georgia_guard", isBesieged: false },
            { id: "tkvarcheli", ownerFactionId: "abkhaz_coalition", isBesieged: false },
            { id: "gali", ownerFactionId: "georgia_guard", isBesieged: false },
            { id: "chuberi", ownerFactionId: "georgia_guard", isBesieged: false },
            { id: "enguri", ownerFactionId: "georgia_guard", isBesieged: false }
          ],
          tacticalNote: "ზავი დაიდო, თუმცა სოხუმი მძიმე არტილერიის გარეშე დარჩა."
        },
        {
          time: 145,
          date: "1993 წლის 16-27 სექტემბერი - ზავის დარღვევა და სოხუმის ალყა",
          title: "სოჭის ზავის მუხანათური დარღვევა და სოხუმის დაცემა",
          description: "16 სექტემბერს მტერმა მოულოდნელად დაარღვია ზავი, რუსული ავიაციისა და ტანკების მხარდაჭერით ალყა შემოარტყა განიარაღებულ სოხუმს. 11-დღიანი უთანასწორო ბრძოლის შემდეგ 27 სექტემბერს სოხუმი დაეცა.",
          phase: "retreat",
          armyPositions: {
            geo_main: { x: 760, y: 440, strength: 8500, status: "retreating" },
            geo_sokhumi_corps: { x: 530, y: 290, strength: 1800, status: "in_combat" },
            geo_gagra: { x: 999, y: 999, strength: 0, status: "eliminated" },
            geo_refugees: { x: 680, y: 270, strength: 220000, status: "retreating" },
            abkhaz_gudauta: { x: 520, y: 285, strength: 16500, status: "in_combat" },
            basaev_batalion: { x: 535, y: 300, strength: 7000, status: "in_combat" },
            russian_desant: { x: 999, y: 999, strength: 0, status: "eliminated" }
          },
          arrows: [
            { fromX: 450, fromY: 260, toX: 530, toY: 290, color: "#dc2626", type: "advance", label: "სოხუმის გენერალური შტურმი" },
            { fromX: 530, fromY: 300, toX: 760, toY: 440, color: "#e11d48", type: "retreat", label: "უკანდახევა ენგურისკენ" },
            { fromX: 540, fromY: 280, toX: 740, toY: 220, color: "#f59e0b", type: "retreat", label: "დევნილთა კოლონა ჭუბერისკენ" }
          ],
          battleClashes: [
            { x: 530, y: 290, intensity: 1.0, label: "სოხუმის უკანასკნელი თავდაცვა" }
          ],
          cityStates: [
            { id: "leselidze", ownerFactionId: "abkhaz_coalition", isBesieged: false },
            { id: "gagra", ownerFactionId: "abkhaz_coalition", isBesieged: false },
            { id: "pitsunda", ownerFactionId: "abkhaz_coalition", isBesieged: false },
            { id: "gudauta", ownerFactionId: "abkhaz_coalition", isBesieged: false },
            { id: "akhali_atoni", ownerFactionId: "abkhaz_coalition", isBesieged: false },
            { id: "gumista", ownerFactionId: "abkhaz_coalition", isBesieged: false },
            { id: "sokhumi", ownerFactionId: "abkhaz_coalition", isBesieged: true },
            { id: "gulripshi", ownerFactionId: "abkhaz_coalition", isBesieged: false },
            { id: "tamishi", ownerFactionId: "abkhaz_coalition", isBesieged: false },
            { id: "ochamchire", ownerFactionId: "abkhaz_coalition", isBesieged: false },
            { id: "tkvarcheli", ownerFactionId: "abkhaz_coalition", isBesieged: false },
            { id: "gali", ownerFactionId: "georgia_guard", isBesieged: false },
            { id: "chuberi", ownerFactionId: "georgia_guard", isBesieged: false },
            { id: "enguri", ownerFactionId: "georgia_guard", isBesieged: false }
          ],
          tacticalNote: "ჟიული შარტავა და მთავრობის წევრები გმირულად დახვრიტეს სოხუმის მთავრობის სახლთან."
        },
        {
          time: 175,
          date: "1993 წლის სექტემბრის ბოლო – ოქტომბერი",
          title: "ჭუბერის გოლგოთა და 300,000 დევნილის ტრაგედია",
          description: "სოხუმის დაცემის შემდეგ 300 000-მდე მშვიდობიანი ქართველი დევნილი გაუვალ, თოვლიან ჭუბერის უღელტეხილსა და ენგურის ხიდზე გადადის. აფხაზეთის მთლიანი ოკუპაცია და ეთნიკური წმენდა.",
          phase: "victory",
          armyPositions: {
            geo_main: { x: 910, y: 510, strength: 7500, status: "garrison" },
            geo_sokhumi_corps: { x: 875, y: 185, strength: 1200, status: "garrison" },
            geo_gagra: { x: 999, y: 999, strength: 0, status: "eliminated" },
            geo_refugees: { x: 875, y: 175, strength: 200000, status: "garrison" },
            abkhaz_gudauta: { x: 530, y: 290, strength: 16000, status: "garrison" },
            basaev_batalion: { x: 600, y: 340, strength: 6800, status: "garrison" },
            russian_desant: { x: 999, y: 999, strength: 0, status: "eliminated" }
          },
          arrows: [
            { fromX: 740, fromY: 220, toX: 875, toY: 175, color: "#f59e0b", type: "retreat", label: "ჭუბერის გოლგოთა" }
          ],
          cityStates: [
            { id: "leselidze", ownerFactionId: "abkhaz_coalition", isBesieged: false },
            { id: "gagra", ownerFactionId: "abkhaz_coalition", isBesieged: false },
            { id: "pitsunda", ownerFactionId: "abkhaz_coalition", isBesieged: false },
            { id: "gudauta", ownerFactionId: "abkhaz_coalition", isBesieged: false },
            { id: "akhali_atoni", ownerFactionId: "abkhaz_coalition", isBesieged: false },
            { id: "gumista", ownerFactionId: "abkhaz_coalition", isBesieged: false },
            { id: "sokhumi", ownerFactionId: "abkhaz_coalition", isBesieged: false },
            { id: "gulripshi", ownerFactionId: "abkhaz_coalition", isBesieged: false },
            { id: "tamishi", ownerFactionId: "abkhaz_coalition", isBesieged: false },
            { id: "ochamchire", ownerFactionId: "abkhaz_coalition", isBesieged: false },
            { id: "tkvarcheli", ownerFactionId: "abkhaz_coalition", isBesieged: false },
            { id: "gali", ownerFactionId: "abkhaz_coalition", isBesieged: false },
            { id: "chuberi", ownerFactionId: "georgia_guard", isBesieged: false },
            { id: "enguri", ownerFactionId: "georgia_guard", isBesieged: false }
          ],
          tacticalNote: "აფხაზეთი არის საქართველო. ისტორიული სიმართლე და ხსოვნა გმირებს."
        }
      ],
      duration: 180,
      terrain: {
        rivers: [
          [ { x: 110, y: 50 }, { x: 130, y: 110 } ], // Psou
          [ { x: 190, y: 70 }, { x: 220, y: 155 } ], // Bzipi
          [ { x: 440, y: 130 }, { x: 475, y: 270 } ], // Gumista River
          [ { x: 640, y: 180 }, { x: 670, y: 385 } ], // Kodori / Tamishi
          [ { x: 790, y: 260 }, { x: 850, y: 440 }, { x: 910, y: 510 }, { x: 940, y: 600 } ] // Enguri River
        ],
        mountains: [
          { x: 230, y: 100, radius: 50, label: "გაგრის ქედი" },
          { x: 460, y: 120, radius: 65, label: "აფხაზეთის კავკასიონი" },
          { x: 680, y: 160, radius: 60, label: "კოდორის ქედი" },
          { x: 860, y: 150, radius: 60, label: "სვანეთის კავკასიონი / ჭუბერი" }
        ],
        forests: [
          { x: 470, y: 210, radius: 45, label: "გუმისტის ხეობის ტყეები" },
          { x: 660, y: 320, radius: 50, label: "ტამიშისა და კოდორის ტყეები" },
          { x: 830, y: 210, radius: 45, label: "ჭუბერის უღელტეხილის ტყეები" }
        ]
      }
    }
  },

  {
    id: "didgori_1121",
    title: "დიდგორის ბრძოლა (1121 წ.) - „ძლევაჲ საკვირველი“",
    period: "1121 წლის 12 აგვისტო",
    category: "საქართველოს ისტორია",
    description: "დავით IV აღმაშენებლის ბრწყინვალე სამხედრო ტაქტიკა და სელჩუკთა კოალიციის სრული განადგურება დიდგორის ველზე.",
    prompt: `1121 წლის 12 აგვისტო. დიდგორის ბრძოლა.
დავით IV აღმაშენებლის გაერთიანებული არმია (40,000 ქართველი, 15,000 ყივჩაყი, 500 ალანი და 200 ევროპელი ჯვაროსანი) დაბანაკდა მანგლისისა და დიდგორის ვიწრო ხეობებში.
ილღაზისა და დუბაისის 300,000-იანი სელჩუკთა კოალიციური არმია დაიძრა თბილისის მისადგომებისკენ.
დავითმა უკანდასახევი გზები ხეებით ჩახერგა და 200 თავდადებული რაინდი მოჩვენებითი მოლაპარაკებით გაგზავნა მტრის ბანაკში.
მოულოდნელი იერიშით ქართველთა 200-მა მეომარმა მტრის ცენტრი არია.
დავით აღმაშენებლის ძირითადი ძალები დაესხნენ თავს სელჩუკთა მთავარ კორპუსს, ხოლო დემეტრე უფლისწულის რაზმმა ნიჩბისის ხეობიდან ფლანგური და ზურგის გამანადგურებელი დარტყმა განახორციელა.
სელჩუკთა რიგები პანიკამ მოიცვა, არმიამ დაიწყო ქაოტური უკანდახევა. ქართველებმა გაათავისუფლეს თბილისი.`,
    scenarioData: {
      id: "didgori_1121",
      title: "დიდგორის ბრძოლა (1121 წ.) - „ძლევაჲ საკვირველი“",
      period: "1121 წლის 12 აგვისტო",
      theater: "caucasus",
      mapBounds: { width: 1000, height: 650 },
      factions: [
        { id: "georgia", name: "საქართველოს სამეფო", primaryColor: "#2563eb", lightColor: "rgba(37, 99, 235, 0.25)", borderColor: "#1d4ed8" },
        { id: "seljuk", name: "სელჩუკთა კოალიცია", primaryColor: "#dc2626", lightColor: "rgba(220, 38, 38, 0.25)", borderColor: "#b91c1c" }
      ],
      cities: [
        { id: "didgori", name: "დიდგორის ველი", x: 450, y: 310, importance: "fortress", ownerFactionId: "georgia", isBesieged: false, fortificationLevel: 2 },
        { id: "manglisi", name: "მანგლისი", x: 340, y: 390, importance: "town", ownerFactionId: "georgia", isBesieged: false, fortificationLevel: 1 },
        { id: "tbilisi", name: "თბილისი (სამირო)", x: 700, y: 350, importance: "capital", ownerFactionId: "seljuk", isBesieged: false, fortificationLevel: 3 },
        { id: "nichbisi", name: "ნიჩბისის ხეობა", x: 440, y: 220, importance: "battlefield", ownerFactionId: "georgia", isBesieged: false, fortificationLevel: 1 }
      ],
      armies: [
        { id: "david_main", name: "დავით აღმაშენებლის სამეფო გვარდია", commander: "მეფე დავით IV", factionId: "georgia", startX: 350, startY: 310, x: 350, y: 310, strength: 40000, maxStrength: 40000, unitType: "infantry_heavy", status: "ready" },
        { id: "demetre_flank", name: "დემეტრე უფლისწულის კავალერია", commander: "დემეტრე უფლისწული", factionId: "georgia", startX: 430, startY: 190, x: 430, y: 190, strength: 15000, maxStrength: 15000, unitType: "cavalry", status: "ready" },
        { id: "crusaders", name: "200 ჯვაროსანი და ავანგარდი", commander: "ევროპელი რაინდები", factionId: "georgia", startX: 410, startY: 310, x: 410, y: 310, strength: 2000, maxStrength: 2000, unitType: "cavalry", status: "ready" },
        { id: "ilhazi_center", name: "ილღაზის სელჩუკთა ცენტრალური არმია", commander: "ნურ ად-დინ ილღაზი", factionId: "seljuk", startX: 620, startY: 310, x: 620, y: 310, strength: 180000, maxStrength: 180000, unitType: "infantry_heavy", status: "ready" },
        { id: "dubais_wing", name: "დუბაისის არაბულ-თურქმანული ფრთა", commander: "დუბაის იბნ სადაყა", factionId: "seljuk", startX: 630, startY: 410, x: 630, y: 410, strength: 120000, maxStrength: 120000, unitType: "cavalry", status: "ready" }
      ],
      keyframes: [
        {
          time: 0,
          date: "1121 წლის აგვისტოს დასაწყისი",
          title: "ძალთა განლაგება დიდგორისა და მანგლისის მიდამოებში",
          description: "დავით აღმაშენებელმა ქართული ლაშქარი ვიწრო ხეობებში განალაგა, რითაც სელჩუკთა რიცხობრივი უპირატესობა გაანეიტრალა. უკანდასახევი გზები ხეებით ჩაიხერგა.",
          phase: "mobilization",
          armyPositions: {
            david_main: { x: 350, y: 310, strength: 40000, status: "ready" },
            demetre_flank: { x: 430, y: 190, strength: 15000, status: "ready" },
            crusaders: { x: 410, y: 310, strength: 2000, status: "ready" },
            ilhazi_center: { x: 620, y: 310, strength: 180000, status: "ready" },
            dubais_wing: { x: 630, y: 410, strength: 120000, status: "ready" }
          },
          arrows: [],
          cityStates: [
            { id: "didgori", ownerFactionId: "georgia", isBesieged: false },
            { id: "manglisi", ownerFactionId: "georgia", isBesieged: false },
            { id: "tbilisi", ownerFactionId: "seljuk", isBesieged: false },
            { id: "nichbisi", ownerFactionId: "georgia", isBesieged: false }
          ],
          tacticalNote: "დავითის სტრატეგია: ბრძოლის ველის შეზღუდვა ვიწრო ხეობაში."
        },
        {
          time: 5,
          date: "12 აგვისტო, დილა - 200 მეომრის თავგანწირული იერიში",
          title: "მოჩვენებითი მოლაპარაკება და მტრის რიგების არევა",
          description: "200 ქართველი და ჯვაროსანი მეომარი მშვიდობიანი მოლაპარაკების ნიღბით მიუახლოვდა სელჩუკთა ბანაკს, მოულოდნელად იშიშვლა ხმლები და მტრის ცენტრი პანიკაში ჩააგდო.",
          phase: "advance",
          armyPositions: {
            david_main: { x: 390, y: 310, strength: 40000, status: "marching" },
            demetre_flank: { x: 450, y: 220, strength: 15000, status: "marching" },
            crusaders: { x: 570, y: 310, strength: 1950, status: "in_combat" },
            ilhazi_center: { x: 600, y: 310, strength: 175000, status: "in_combat" },
            dubais_wing: { x: 610, y: 400, strength: 120000, status: "marching" }
          },
          arrows: [
            { fromX: 410, fromY: 310, toX: 570, toY: 310, color: "#2563eb", type: "advance", label: "200 მეომრის მოულოდნელი იერიში" }
          ],
          battleClashes: [
            { x: 585, y: 310, intensity: 0.9, label: "ავანგარდის შეტაკება" }
          ],
          cityStates: [
            { id: "didgori", ownerFactionId: "georgia", isBesieged: false },
            { id: "manglisi", ownerFactionId: "georgia", isBesieged: false },
            { id: "tbilisi", ownerFactionId: "seljuk", isBesieged: false },
            { id: "nichbisi", ownerFactionId: "georgia", isBesieged: false }
          ],
          tacticalNote: "მოულოდნელობის ეფექტმა სელჩუკთა მართვის ცენტრი მოშალა."
        },
        {
          time: 11,
          date: "12 აგვისტო, შუადღე - ფრონტალური და ფლანგური შეტევა",
          title: "დავით აღმაშენებლისა და დემეტრეს შეთანხმებული დარტყმა",
          description: "დავით IV-ის მთავარი არმია ფრონტალურად დაესხა თავს სელჩუკთა ცენტრს, ხოლო დემეტრე უფლისწულმა ნიჩბისის ხეობიდან მოულოდნელად ზურგში დაარტყა მტერს.",
          phase: "battle",
          armyPositions: {
            david_main: { x: 490, y: 310, strength: 38500, status: "in_combat" },
            demetre_flank: { x: 560, y: 260, strength: 14700, status: "in_combat" },
            crusaders: { x: 550, y: 320, strength: 1800, status: "in_combat" },
            ilhazi_center: { x: 560, y: 310, strength: 110000, status: "in_combat" },
            dubais_wing: { x: 570, y: 390, strength: 85000, status: "in_combat" }
          },
          arrows: [
            { fromX: 390, fromY: 310, toX: 520, toY: 310, color: "#2563eb", type: "advance", label: "მეფის მთავარი იერიში" },
            { fromX: 450, fromY: 220, toX: 560, toY: 260, color: "#2563eb", type: "flank", label: "დემეტრეს ზურგის დარტყმა" }
          ],
          battleClashes: [
            { x: 525, y: 310, intensity: 1.0, label: "დიდგორის მთავარი ბრძოლა" },
            { x: 560, y: 270, intensity: 0.9, label: "ზურგის ალყა" }
          ],
          cityStates: [
            { id: "didgori", ownerFactionId: "georgia", isBesieged: false },
            { id: "manglisi", ownerFactionId: "georgia", isBesieged: false },
            { id: "tbilisi", ownerFactionId: "seljuk", isBesieged: false },
            { id: "nichbisi", ownerFactionId: "georgia", isBesieged: false }
          ],
          tacticalNote: "ორმხრივი ალყა: სელჩუკები ვერ იყენებენ რიცხობრივ უპირატესობას."
        },
        {
          time: 17,
          date: "12-14 აგვისტო - სელჩუკთა გაქცევა და 3-დღიანი დევნა",
          title: "სელჩუკთა კოალიციის სრული განადგურება",
          description: "ილღაზის არმია სრულად დაიშალა და პანიკურად დაიხია უკან. ქართველთა ცხენოსანმა რაზმებმა მტერი მდინარე არაქსამდე სდია.",
          phase: "retreat",
          armyPositions: {
            david_main: { x: 620, y: 320, strength: 37500, status: "pursuing" },
            demetre_flank: { x: 670, y: 280, strength: 14500, status: "pursuing" },
            crusaders: { x: 630, y: 350, strength: 1750, status: "pursuing" },
            ilhazi_center: { x: 860, y: 310, strength: 45000, status: "retreating" },
            dubais_wing: { x: 880, y: 440, strength: 30000, status: "disbanded" }
          },
          arrows: [
            { fromX: 560, fromY: 310, toX: 860, toY: 310, color: "#dc2626", type: "retreat", label: "სელჩუკთა პანიკური უკანდახევა" },
            { fromX: 520, fromY: 310, toX: 700, toY: 320, color: "#2563eb", type: "pursuit", label: "დევნა" }
          ],
          cityStates: [
            { id: "didgori", ownerFactionId: "georgia", isBesieged: false },
            { id: "manglisi", ownerFactionId: "georgia", isBesieged: false },
            { id: "tbilisi", ownerFactionId: "georgia", isBesieged: true },
            { id: "nichbisi", ownerFactionId: "georgia", isBesieged: false }
          ],
          tacticalNote: "მტრის კოალიცია დაიშალა და დატოვა საბრძოლო ალაფა."
        },
        {
          time: 22,
          date: "1122 წელი - თბილისის გათავისუფლება",
          title: "„ძლევაჲ საკვირველი“ - თბილისის შემოერთება დედაქალაქად",
          description: "დიდგორის ბრწყინვალე გამარჯვების შედეგად 1122 წელს დავით აღმაშენებელმა 400-წლიანი არაბული მმართველობისგან გაათავისუფლა თბილისი და საქართველოს სატახტო ქალაქად გამოაცხადა.",
          phase: "victory",
          armyPositions: {
            david_main: { x: 700, y: 340, strength: 37000, status: "garrison" },
            demetre_flank: { x: 690, y: 380, strength: 14500, status: "garrison" },
            crusaders: { x: 710, y: 320, strength: 1750, status: "garrison" },
            ilhazi_center: { x: 990, y: 310, strength: 15000, status: "disbanded" },
            dubais_wing: { x: 990, y: 440, strength: 0, status: "eliminated" }
          },
          arrows: [],
          cityStates: [
            { id: "didgori", ownerFactionId: "georgia", isBesieged: false },
            { id: "manglisi", ownerFactionId: "georgia", isBesieged: false },
            { id: "tbilisi", ownerFactionId: "georgia", isBesieged: false },
            { id: "nichbisi", ownerFactionId: "georgia", isBesieged: false }
          ],
          tacticalNote: "ისტორიული შედეგი: საქართველოს ოქროს ხანის დასაწყისი."
        }
      ],
      duration: 22,
      terrain: {
        rivers: [
          [ { x: 200, y: 150 }, { x: 420, y: 250 }, { x: 700, y: 350 }, { x: 950, y: 480 } ]
        ],
        mountains: [
          { x: 380, y: 140, radius: 55, label: "დიდგორის ქედი" },
          { x: 480, y: 130, radius: 60, label: "თრიალეთის მთაგრეხილი" },
          { x: 300, y: 470, radius: 50, label: "მანგლისის მთები" }
        ],
        forests: [
          { x: 430, y: 220, radius: 45, label: "ნიჩბისის ხეობა (ტყე)" }
        ]
      }
    }
  },

  {
    id: "stalingrad_1942",
    title: "სტალინგრადის ბრძოლა და ოპერაცია „ურანი“ (1942–1943 წწ.)",
    period: "1942 წლის 19 ნოემბერი – 1943 წლის 2 თებერვალი",
    category: "მეორე მსოფლიო ომი",
    description: "საბჭოთა წითელი არმიის ორმაგი ალყის ოპერაცია და ვერმახტის მე-6 არმიის კაპიტულაცია ვოლგის ნაპირებზე.",
    prompt: `1942 წლის 19 ნოემბერი. სტალინგრადის ბრძოლა - ოპერაცია „ურანი“.
ვერმახტის მე-6 არმია გენერალ პაულუსის მეთაურობით ქალაქ სტალინგრადში ქუჩის მძიმე ბრძოლებს აწარმოებდა.
საბჭოთა ჯარებმა გენერალ ჟუკოვის ხელმძღვანელობით შეიმუშავეს გრანდიოზული სტრატეგიული კონტრშეტევის გეგმა.
ჩრდილოეთით - სამხრეთ-დასავლეთის ფრონტი და დონის ფრონტი, ხოლო სამხრეთით - სტალინგრადის ფრონტი ერთდროულად გადავიდნენ შეტევაზე რუმინული და იტალიური ფლანგების წინააღმდეგ.
23 ნოემბერს ქალაქ კალაჩთან საბჭოთა ჯარების რკალი შეიკრა და მე-6 არმიის 300,000-იანი დაჯგუფება სრულ ალყაში (ქვაბში) მოექცა.
მანშტეინის განბლოკვის მცდელობა ჩაიშალა. 1943 წლის 2 თებერვალს პაულუსის არმიამ იარაღი დაყარა.`,
    scenarioData: {
      id: "stalingrad_1942",
      title: "სტალინგრადის ბრძოლა (ოპერაცია „ურანი“)",
      period: "1942–1943 წწ.",
      theater: "ww2_eastern_front",
      mapBounds: { width: 1000, height: 650 },
      factions: [
        { id: "soviet", name: "წითელი არმია (სსრკ)", primaryColor: "#dc2626", lightColor: "rgba(220, 38, 38, 0.25)", borderColor: "#991b1b" },
        { id: "germany", name: "ვერმახტი / ღერძი", primaryColor: "#2563eb", lightColor: "rgba(37, 99, 235, 0.25)", borderColor: "#1e40af" }
      ],
      cities: [
        { id: "stalingrad", name: "სტალინგრადი (ვოლგა)", x: 620, y: 320, importance: "capital", ownerFactionId: "germany", isBesieged: true, fortificationLevel: 3 },
        { id: "kalach", name: "კალაჩ-ნა-დონუ", x: 460, y: 320, importance: "fortress", ownerFactionId: "germany", isBesieged: false, fortificationLevel: 2 },
        { id: "sera", name: "სერაფიმოვიჩი (ჩრდ. პლაცდარმი)", x: 380, y: 170, importance: "town", ownerFactionId: "soviet", isBesieged: false, fortificationLevel: 1 },
        { id: "kotel", name: "კოტელნიკოვო (სამხრეთი)", x: 440, y: 480, importance: "town", ownerFactionId: "germany", isBesieged: false, fortificationLevel: 1 }
      ],
      armies: [
        { id: "soviet_north", name: "სამხრეთ-დასავლეთის ფრონტი (ვატუტინი)", commander: "გენერალი ვატუტინი", factionId: "soviet", startX: 380, startY: 170, x: 380, y: 170, strength: 400000, maxStrength: 400000, unitType: "infantry_heavy", status: "ready" },
        { id: "soviet_south", name: "სტალინგრადის ფრონტი (ერემენკო)", commander: "გენერალი ერემენკო", factionId: "soviet", startX: 520, startY: 480, x: 520, y: 480, strength: 350000, maxStrength: 350000, unitType: "infantry_heavy", status: "ready" },
        { id: "paulus_6th", name: "მე-6 არმია (პაულუსი)", commander: "გენერალ-ფელდმარშალი პაულუსი", factionId: "germany", startX: 620, startY: 320, x: 620, y: 320, strength: 300000, maxStrength: 300000, unitType: "infantry_heavy", status: "in_combat" },
        { id: "axis_flanks", name: "მე-3 და მე-4 რუმინული არმიები (ფლანგები)", commander: "ფლანგის კორპუსები", factionId: "germany", startX: 430, startY: 260, x: 430, y: 260, strength: 120000, maxStrength: 120000, unitType: "infantry_heavy", status: "ready" }
      ],
      keyframes: [
        {
          time: 0,
          date: "1942 წლის 18 ნოემბერი",
          title: "შეტევისწინა განლაგება და დაზვერვა",
          description: "მე-6 არმია ჩაფლულია სტალინგრადის ქუჩების ბრძოლებში. საბჭოთა სარდლობამ საიდუმლოდ მოამზადა უზარმაზარი ძალები ფლანგებზე.",
          phase: "mobilization",
          armyPositions: {
            soviet_north: { x: 380, y: 170, strength: 400000, status: "ready" },
            soviet_south: { x: 520, y: 480, strength: 350000, status: "ready" },
            paulus_6th: { x: 620, y: 320, strength: 300000, status: "in_combat" },
            axis_flanks: { x: 430, y: 260, strength: 120000, status: "ready" }
          },
          arrows: [],
          cityStates: [
            { id: "stalingrad", ownerFactionId: "germany", isBesieged: true },
            { id: "kalach", ownerFactionId: "germany", isBesieged: false },
            { id: "sera", ownerFactionId: "soviet", isBesieged: false },
            { id: "kotel", ownerFactionId: "germany", isBesieged: false }
          ],
          tacticalNote: "საბჭოთა ძალები მზად არიან ოპერაცია „ურანის“ დასაწყებად."
        },
        {
          time: 6,
          date: "19-20 ნოემბერი - საარტილერიო დარტყმა და გარღვევა",
          title: "ჩრდილოეთისა და სამხრეთის ფრონტების გარღვევა",
          description: "80-წუთიანი მძლავრი საარტილერიო დაბომბვის შემდეგ საბჭოთა ჯავშანსატანკო კორპუსებმა გაარღვიეს რუმინული დივიზიების პოზიციები.",
          phase: "advance",
          armyPositions: {
            soviet_north: { x: 420, y: 240, strength: 395000, status: "marching" },
            soviet_south: { x: 490, y: 400, strength: 345000, status: "marching" },
            paulus_6th: { x: 620, y: 320, strength: 295000, status: "in_combat" },
            axis_flanks: { x: 450, y: 270, strength: 60000, status: "in_combat" }
          },
          arrows: [
            { fromX: 380, fromY: 170, toX: 450, toY: 280, color: "#dc2626", type: "advance", label: "ჩრდილოეთის გარღვევა" },
            { fromX: 520, fromY: 480, toX: 470, toY: 360, color: "#dc2626", type: "advance", label: "სამხრეთის გარღვევა" }
          ],
          battleClashes: [
            { x: 440, y: 260, intensity: 1.0, label: "ფლანგის გარღვევა" }
          ],
          cityStates: [
            { id: "stalingrad", ownerFactionId: "germany", isBesieged: true },
            { id: "kalach", ownerFactionId: "germany", isBesieged: false },
            { id: "sera", ownerFactionId: "soviet", isBesieged: false },
            { id: "kotel", ownerFactionId: "germany", isBesieged: false }
          ],
          tacticalNote: "ფლანგები მოიშალა, საბჭოთა ტანკები კალაჩისკენ მიიწევენ."
        },
        {
          time: 12,
          date: "23 ნოემბერი 1942 - კალაჩთან შეერთება და ალყა",
          title: "სტალინგრადის ქვაბის (Kessel) შეკვრა",
          description: "საბჭოთა მე-4 და მე-26 სატანკო კორპუსები შეხვდნენ კალაჩ-ნა-დონუსთან. მე-6 არმია სრულ რკალში მოექცა.",
          phase: "battle",
          armyPositions: {
            soviet_north: { x: 460, y: 300, strength: 390000, status: "in_combat" },
            soviet_south: { x: 480, y: 340, strength: 340000, status: "in_combat" },
            paulus_6th: { x: 600, y: 320, strength: 260000, status: "in_combat" },
            axis_flanks: { x: 350, y: 320, strength: 15000, status: "disbanded" }
          },
          arrows: [
            { fromX: 420, fromY: 240, toX: 460, toY: 310, color: "#dc2626", type: "advance", label: "კალაჩთან შეერთება" },
            { fromX: 490, fromY: 400, toX: 470, toY: 330, color: "#dc2626", type: "advance", label: "ალყის რკალი" }
          ],
          battleClashes: [
            { x: 460, y: 320, intensity: 1.0, label: "კალაჩის ბრძოლა" },
            { x: 600, y: 320, intensity: 0.9, label: "სტალინგრადის ალყა" }
          ],
          cityStates: [
            { id: "stalingrad", ownerFactionId: "germany", isBesieged: true },
            { id: "kalach", ownerFactionId: "soviet", isBesieged: false },
            { id: "sera", ownerFactionId: "soviet", isBesieged: false },
            { id: "kotel", ownerFactionId: "germany", isBesieged: false }
          ],
          tacticalNote: "300,000 გერმანელი ჯარისკაცი მოექცა ალყაში."
        },
        {
          time: 20,
          date: "1943 წლის 2 თებერვალი - კაპიტულაცია",
          title: "მე-6 არმიის განადგურება და კაპიტულაცია",
          description: "ოპერაცია „კოლცოს“ შედეგად ალყაშემორტყმული არმია ორ ნაწილად გაიყო. ფელდმარშალმა პაულუსმა და მისმა შტაბმა იარაღი დაყარეს.",
          phase: "victory",
          armyPositions: {
            soviet_north: { x: 590, y: 300, strength: 380000, status: "garrison" },
            soviet_south: { x: 620, y: 350, strength: 335000, status: "garrison" },
            paulus_6th: { x: 620, y: 320, strength: 91000, status: "disbanded" },
            axis_flanks: { x: 200, y: 320, strength: 0, status: "eliminated" }
          },
          arrows: [],
          cityStates: [
            { id: "stalingrad", ownerFactionId: "soviet", isBesieged: false },
            { id: "kalach", ownerFactionId: "soviet", isBesieged: false },
            { id: "sera", ownerFactionId: "soviet", isBesieged: false },
            { id: "kotel", ownerFactionId: "soviet", isBesieged: false }
          ],
          tacticalNote: "მეორე მსოფლიო ომის გარდამტეხი ეტაპი და საბჭოთა სტრატეგიული გამარჯვება."
        }
      ],
      duration: 20,
      terrain: {
        rivers: [
          [ { x: 630, y: 50 }, { x: 620, y: 320 }, { x: 660, y: 600 } ],
          [ { x: 380, y: 80 }, { x: 450, y: 320 }, { x: 350, y: 550 } ]
        ],
        mountains: [],
        forests: [
          { x: 520, y: 220, radius: 40 }
        ]
      }
    }
  }
];
