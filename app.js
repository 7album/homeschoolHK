(function () {
  "use strict";

  var KEY = "homeschool-hk-private-v1";
  var LEARNING_KINDS = [
    { id: "learning-read", label: "閱讀" },
    { id: "learning-video", label: "影音" },
    { id: "learning-sport", label: "運動" },
    { id: "learning-game", label: "遊戲" },
    { id: "learning-trip", label: "外遊" },
    { id: "learning-digital", label: "數位" },
    { id: "learning-course", label: "課程" },
    { id: "learning-other", label: "其他" }
  ];
  var OLD_LEARNING_TO_NEW = {
    "learning-movie": "learning-video",
    "learning-media": "learning-video",
    "learning-book": "learning-read",
    "learning-outing": "learning-trip",
    "learning-activity": "learning-other",
    "learning-music": "learning-other"
  };
  var PUBLIC_KIND_TO_ID = {
    "書": "learning-read",
    "閱讀": "learning-read",
    "電影": "learning-video",
    "影音或網上學習": "learning-video",
    "影音": "learning-video",
    "參觀或外出": "learning-trip",
    "外遊": "learning-trip",
    "課程": "learning-course",
    "音樂": "learning-other",
    "活動": "learning-other",
    "其他": "learning-other",
    "運動": "learning-sport",
    "遊戲": "learning-game",
    "數位": "learning-digital"
  };
  var LEGACY_DIARY_AREAS = [
    {
      id: "sleep",
      label: "睡眠",
      kinds: [
        { id: "sleep-onset", label: "入睡情況" },
        { id: "sleep-nightwake", label: "夜間醒來" },
        { id: "sleep-nap", label: "日間小睡" },
        { id: "sleep-wake", label: "起床與精神" }
      ]
    },
    {
      id: "eating",
      label: "進食",
      kinds: [
        { id: "eating-main", label: "正餐" },
        { id: "eating-snack", label: "小食" },
        { id: "eating-milk", label: "奶類或配方奶" },
        { id: "eating-refusal", label: "拒食或挑食" },
        { id: "eating-self", label: "自行用匙或手取" }
      ]
    },
    {
      id: "mood",
      label: "情緒",
      kinds: [
        { id: "mood-calm", label: "平穩或愉快" },
        { id: "mood-distress", label: "哭鬧或不安" },
        { id: "mood-tantrum", label: "大發脾氣" },
        { id: "mood-soothe", label: "安撫後回復" }
      ]
    },
    {
      id: "language",
      label: "語言",
      kinds: [
        { id: "language-receptive", label: "明白別人說話" },
        { id: "language-expressive", label: "自己說話或發音" },
        { id: "language-gesture", label: "手勢或指物" },
        { id: "language-reading", label: "親子閱讀或講故事" }
      ]
    },
    {
      id: "play",
      label: "遊戲",
      kinds: [
        { id: "play-free", label: "自由玩耍" },
        { id: "play-guided", label: "大人陪玩或引導" },
        { id: "play-sensory", label: "感官或操作性玩耍" },
        { id: "play-pretend", label: "扮演或想象遊戲" }
      ]
    },
    {
      id: "movement",
      label: "活動",
      kinds: [
        { id: "movement-gross", label: "跑跳攀爬等大肌肉" },
        { id: "movement-fine", label: "砌積木、畫畫等小肌肉" },
        { id: "movement-outdoor", label: "戶外活動" },
        { id: "movement-quiet", label: "靜態活動或休息" }
      ]
    },
    {
      id: "social",
      label: "社交",
      kinds: [
        { id: "social-family", label: "與家人互動" },
        { id: "social-peer", label: "與同齡小孩" },
        { id: "social-turn", label: "分享、輪候或合作" },
        { id: "social-stranger", label: "面對陌生人或新場所" }
      ]
    },
    {
      id: "other",
      label: "其他",
      kinds: [
        { id: "other-selfcare", label: "自理（洗手、穿脫等）" },
        { id: "other-health", label: "不適或健康觀察" },
        { id: "other-misc", label: "其他" }
      ]
    }
  ];
  var LEGACY_TOP_TO_KIND = {
    sleep: "sleep-onset",
    eating: "eating-main",
    mood: "mood-calm",
    language: "language-expressive",
    play: "play-free",
    movement: "movement-outdoor",
    social: "social-family",
    other: "other-misc"
  };
  var LEGACY_KIND_TO_LEARNING = {
    "language-reading": "learning-book",
    "play-free": "learning-activity",
    "play-guided": "learning-activity",
    "play-sensory": "learning-activity",
    "play-pretend": "learning-activity",
    "movement-gross": "learning-activity",
    "movement-fine": "learning-activity",
    "movement-outdoor": "learning-outing",
    "movement-quiet": "learning-activity",
    "social-family": "learning-activity",
    "social-peer": "learning-activity",
    "social-turn": "learning-activity",
    "social-stranger": "learning-outing",
    "language-receptive": "learning-course",
    "language-expressive": "learning-course",
    "language-gesture": "learning-course",
    "sleep-onset": "learning-other",
    "sleep-nightwake": "learning-other",
    "sleep-nap": "learning-other",
    "sleep-wake": "learning-other",
    "eating-main": "learning-other",
    "eating-snack": "learning-other",
    "eating-milk": "learning-other",
    "eating-refusal": "learning-other",
    "eating-self": "learning-other",
    "mood-calm": "learning-other",
    "mood-distress": "learning-other",
    "mood-tantrum": "learning-other",
    "mood-soothe": "learning-other",
    "other-selfcare": "learning-other",
    "other-health": "learning-other",
    "other-misc": "learning-other"
  };
  var LEGACY_TOP_TO_LEARNING = {
    sleep: "learning-other",
    eating: "learning-other",
    mood: "learning-other",
    language: "learning-course",
    play: "learning-activity",
    movement: "learning-activity",
    social: "learning-activity",
    other: "learning-other"
  };
  var LEGACY_CONTEXT = {
    "瞓覺": "sleep",
    "食": "eating",
    "心情": "mood",
    "語言": "language",
    "玩": "play",
    "郁動": "movement",
    "同人": "social",
    "其他": "other",
    "睡眠": "sleep",
    "進食": "eating",
    "情緒": "mood",
    "遊戲": "play",
    "活動": "movement",
    "社交": "social"
  };
  var SUMMARY_AGE_UNSET = "未標年齡";
  var INTENSITY = [
    { id: "", label: "可不填" },
    { id: "light", label: "輕微" },
    { id: "usual", label: "普通" },
    { id: "strong", label: "明顯" }
  ];
  var AGE_BANDS = ["0–6", "6–12", "12–18", ">18"];
  var GITHUB_REPO = "7album/homeschoolHK";

  var seed = [];
  var communityCards = [];
  var activeTopics = [];
  var activeAges = [];
  var query = "";
  var logChild = "all";
  var logContext = "all";
  var logLimit = 20;
  var logPickKind = "";

  function $(id) { return document.getElementById(id); }

  function on(id, type, handler, useCapture) {
    var el = $(id);
    if (el) el.addEventListener(type, handler, !!useCapture);
  }

  function uid() {
    return Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4);
  }

  function todayISO() {
    var d = new Date();
    var local = new Date(d.getTime() - d.getTimezoneOffset() * 60000);
    return local.toISOString().slice(0, 10);
  }

  function defaultState() {
    return {
      version: 1,
      children: [
        { id: uid(), name: "小孩", birthYm: "", legacyAge: "", note: "" }
      ],
      logs: [],
      personalCards: []
    };
  }

  function parseBirthYm(value) {
    if (value == null || value === "") return "";
    var v = String(value).trim();
    var m = v.match(/^(\d{4})-(\d{1,2})$/);
    if (!m) return "";
    var y = parseInt(m[1], 10);
    var mo = parseInt(m[2], 10);
    if (!Number.isFinite(y) || !Number.isFinite(mo) || y < 1900 || y > 2100 || mo < 1 || mo > 12) return "";
    return String(y) + "-" + String(mo).padStart(2, "0");
  }

  function parseLegacyAgeValue(value) {
    if (value == null || value === "") return "";
    if (typeof value === "number" && value >= 0 && value <= 99 && Number.isFinite(value)) {
      return Math.floor(value);
    }
    var n = parseInt(String(value).trim(), 10);
    if (!isNaN(n) && n >= 0 && n <= 99) return n;
    return "";
  }

  function parseLegacyAge(source) {
    if (!source) return "";
    var fromField = parseLegacyAgeValue(source.legacyAge);
    if (fromField !== "") return fromField;
    if (parseBirthYm(source.birthYm || source.birthMonth)) return "";
    return parseLegacyAgeValue(source.age);
  }

  function ageFromBirthYm(birthYm, refDate) {
    var ym = parseBirthYm(birthYm);
    if (!ym) return "";
    var parts = ym.split("-");
    var birthYear = parseInt(parts[0], 10);
    var birthMonth = parseInt(parts[1], 10);
    var now = refDate || new Date();
    var nowYear = now.getFullYear();
    var nowMonth = now.getMonth() + 1;
    if (nowYear < birthYear || (nowYear === birthYear && nowMonth < birthMonth)) return 0;
    var age = nowYear - birthYear;
    if (nowMonth < birthMonth) age -= 1;
    if (age < 0) age = 0;
    if (age > 99) age = 99;
    return age;
  }

  function childAgeForNewLog(child) {
    if (!child) return "";
    var birth = parseBirthYm(child.birthYm);
    if (birth) return ageFromBirthYm(birth);
    return parseLegacyAge(child);
  }

  function parseLogChildAge(log) {
    if (!log) return "";
    if (typeof log.childAge === "number" && log.childAge >= 0 && log.childAge <= 99) {
      return Math.floor(log.childAge);
    }
    if (log.childAge !== undefined && log.childAge !== null && log.childAge !== "") {
      var n = parseInt(String(log.childAge).trim(), 10);
      if (!isNaN(n) && n >= 0 && n <= 99) return n;
    }
    return "";
  }

  function numericAgeToBand(age) {
    if (age === "" || age == null) return "";
    var n = Number(age);
    if (!Number.isFinite(n)) return "";
    if (n < 6) return "0–6";
    if (n < 12) return "6–12";
    if (n < 18) return "12–18";
    return ">18";
  }

  function logAgeBand(log) {
    var band = normalizeAgeBand(log.ageBand);
    if (band) return band;
    return numericAgeToBand(parseLogChildAge(log)) || "";
  }

  function formatLogAge(log) {
    var n = parseLogChildAge(log);
    if (n !== "") return String(n) + " 歲";
    if (log.ageBand) return log.ageBand;
    return "";
  }

  function normalizeChild(raw) {
    if (typeof raw === "string") {
      return { id: uid(), name: String(raw).trim().slice(0, 40) || "小孩", birthYm: "", legacyAge: "", note: "" };
    }
    var c = raw || {};
    var id = String(c.id || "").trim();
    if (!id) id = uid();
    var name = String(c.name || "小孩").trim().slice(0, 40) || "小孩";
    var birthYm = parseBirthYm(c.birthYm || c.birthMonth);
    var legacyAge = birthYm ? parseLegacyAgeValue(c.legacyAge) : parseLegacyAge(c);
    return {
      id: id,
      name: name,
      birthYm: birthYm,
      legacyAge: legacyAge,
      note: String(c.note || "").slice(0, 240),
      updatedAt: (c && typeof c.updatedAt === "string") ? c.updatedAt : ""
    };
  }

  function migrateChildren(children, logs) {
    var list = Array.isArray(children) ? children : [];
    var out = [];
    list.forEach(function (item) {
      if (item == null) return;
      out.push(normalizeChild(item));
    });
    var byId = {};
    out.forEach(function (c) { byId[c.id] = c; });
    (logs || []).forEach(function (log) {
      var cid = String(log.childId || "").trim();
      if (!cid) return;
      if (byId[cid]) return;
      var byName = null;
      for (var i = 0; i < out.length; i++) {
        if (out[i].name === cid) { byName = out[i]; break; }
      }
      if (byName) {
        log.childId = byName.id;
        return;
      }
      var created = normalizeChild({ id: uid(), name: cid.slice(0, 40), birthYm: "", legacyAge: "", note: "" });
      out.push(created);
      byId[created.id] = created;
      log.childId = created.id;
    });
    return out;
  }

  function learningKindById(kindId) {
    for (var i = 0; i < LEARNING_KINDS.length; i++) {
      if (LEARNING_KINDS[i].id === kindId) return LEARNING_KINDS[i];
    }
    return null;
  }

  function legacyDiaryKindById(kindId) {
    for (var a = 0; a < LEGACY_DIARY_AREAS.length; a++) {
      var kinds = LEGACY_DIARY_AREAS[a].kinds;
      for (var k = 0; k < kinds.length; k++) {
        if (kinds[k].id === kindId) return { area: LEGACY_DIARY_AREAS[a], kind: kinds[k] };
      }
    }
    return null;
  }

  function legacyContextLabel(raw) {
    var v = raw == null ? "" : String(raw).trim();
    if (!v) return "";
    var hit = legacyDiaryKindById(v);
    if (hit) return hit.area.label + " · " + hit.kind.label;
    var top = LEGACY_CONTEXT[v] || (LEGACY_TOP_TO_KIND[v] ? v : "");
    if (top) {
      for (var i = 0; i < LEGACY_DIARY_AREAS.length; i++) {
        if (LEGACY_DIARY_AREAS[i].id === top) return LEGACY_DIARY_AREAS[i].label;
      }
    }
    return v;
  }

  function normalizeLegacyKindId(value) {
    var v = value == null ? "" : String(value).trim();
    if (!v) return "";
    if (legacyDiaryKindById(v)) return v;
    var top = LEGACY_CONTEXT[v] || (LEGACY_TOP_TO_KIND[v] ? v : "");
    if (top && LEGACY_TOP_TO_KIND[top]) return LEGACY_TOP_TO_KIND[top];
    return "";
  }

  function normalizeContext(value) {
    var v = value == null ? "" : String(value).trim();
    if (!v) return "learning-other";
    if (learningKindById(v)) return v;
    if (OLD_LEARNING_TO_NEW[v]) return v;
    var legacyKind = normalizeLegacyKindId(v);
    if (legacyKind && LEGACY_KIND_TO_LEARNING[legacyKind]) return LEGACY_KIND_TO_LEARNING[legacyKind];
    var top = LEGACY_CONTEXT[v] || (LEGACY_TOP_TO_KIND[v] ? v : "");
    if (top && LEGACY_TOP_TO_LEARNING[top]) return LEGACY_TOP_TO_LEARNING[top];
    return v;
  }

  function kindGroup(id) {
    var normalized = normalizeContext(id);
    if (OLD_LEARNING_TO_NEW[normalized]) return OLD_LEARNING_TO_NEW[normalized];
    return normalized;
  }

  function normalizeAgeBand(value) {
    var v = value == null ? "" : String(value).trim().replace(/-/g, "–").replace(/－/g, "–");
    if (AGE_BANDS.indexOf(v) !== -1) return v;
    var mapped = legacyAges(v);
    if (mapped.length === 1) return mapped[0];
    return "";
  }

  function load() {
    try {
      var raw = localStorage.getItem(KEY);
      if (!raw) return defaultState();
      var data = JSON.parse(raw);
      if (!data || data.version !== 1) return defaultState();
      data.logs = Array.isArray(data.logs) ? data.logs.map(function (log) {
        var copy = {};
        for (var k in log) if (Object.prototype.hasOwnProperty.call(log, k)) copy[k] = log[k];
        var rawContext = log.context;
        copy.context = normalizeContext(rawContext);
        copy.title = String(copy.title || "").trim().slice(0, 120);
        if (!copy.title) {
          var legacyTitle = legacyContextLabel(rawContext);
          if (legacyTitle) copy.title = legacyTitle.slice(0, 120);
        }
        copy.childAge = parseLogChildAge(copy);
        copy.ageBand = normalizeAgeBand(copy.ageBand);
        if (!copy.ageBand && copy.childAge !== "") copy.ageBand = numericAgeToBand(copy.childAge);
        return copy;
      }) : [];
      data.children = migrateChildren(data.children, data.logs);
      data.personalCards = Array.isArray(data.personalCards) ? data.personalCards.map(function (card) {
        var copy = {};
        for (var k in card) if (Object.prototype.hasOwnProperty.call(card, k)) copy[k] = card[k];
        if (!Array.isArray(copy.ages)) copy.ages = [];
        return copy;
      }) : [];
      return data;
    } catch (e) {
      return defaultState();
    }
  }

  var state = load();

  function save() {
    localStorage.setItem(KEY, JSON.stringify(state));
  }

  function touch(item) {
    if (item) item.updatedAt = new Date().toISOString();
    return item;
  }

  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function safeUrl(u) {
    try {
      var x = new URL(String(u).trim());
      if (x.protocol === "https:" || x.protocol === "http:") return x.href;
    } catch (e) {}
    return "";
  }

  function fold(s) {
    return String(s == null ? "" : s).toLowerCase().replace(/-/g, "–").replace(/－/g, "–");
  }

  function contextLabel(id) {
    var raw = id == null ? "" : String(id);
    var normalized = normalizeContext(raw);
    var grouped = kindGroup(normalized);
    var hit = learningKindById(grouped);
    if (hit) return hit.label;
    var legacy = legacyContextLabel(raw);
    if (legacy) return legacy;
    return raw;
  }

  function logHeadline(log) {
    var title = String(log.title || "").trim();
    if (title) return title;
    return contextLabel(log.context);
  }

  function intensityLabel(id) {
    for (var i = 0; i < INTENSITY.length; i++) {
      if (INTENSITY[i].id === id) return INTENSITY[i].label;
    }
    return "";
  }

  function childById(id) {
    for (var i = 0; i < state.children.length; i++) {
      if (state.children[i].id === id) return state.children[i];
    }
    return null;
  }

  function legacyAges(s) {
    if (s === "0–1歲" || s === "1–2歲" || s === "2–3歲" || s === "3–6歲" || s === "0–6歲") return ["0–6"];
    if (s === "6–12歲") return ["6–12"];
    if (s === "12–18歲") return ["12–18"];
    if (s === "6–15歲") return ["6–12", "12–18"];
    if (s === "全年齡") return ["0–6", "6–12", "12–18"];
    if (s === "18歲以上" || s === "18+" || s === "18歲+") return [">18"];
    if (AGE_BANDS.indexOf(s) !== -1) return [s];
    return [];
  }

  function cleanAges(list) {
    if (!Array.isArray(list)) return [];
    var out = [];
    list.forEach(function (item) {
      var s = String(item).trim().replace(/-/g, "–").replace(/－/g, "–");
      legacyAges(s).forEach(function (band) {
        if (out.indexOf(band) === -1) out.push(band);
      });
    });
    return out;
  }

  function setMode(mode) {
    var pub = mode === "public";
    $("panel-public").hidden = !pub;
    $("panel-private").hidden = pub;
    $("tab-public").setAttribute("aria-selected", pub ? "true" : "false");
    $("tab-private").setAttribute("aria-selected", pub ? "false" : "true");
    document.body.classList.toggle("mode-private", !pub);
    try { history.replaceState(null, "", pub ? "#info" : "#records"); } catch (e) {}
  }

  function allTags() {
    var map = {};
    seed.forEach(function (c) { (c.tags || []).forEach(function (t) { map[t] = true; }); });
    communityCards.forEach(function (c) { (c.tags || []).forEach(function (t) { map[t] = true; }); });
    state.personalCards.forEach(function (c) { (c.tags || []).forEach(function (t) { map[t] = true; }); });
    return Object.keys(map);
  }

  function has(list, value) {
    return list.indexOf(value) !== -1;
  }

  function ageMatch(card) {
    if (!activeAges.length) return true;
    var ages = card.ages || [];
    for (var i = 0; i < activeAges.length; i++) {
      if (has(ages, activeAges[i])) return true;
    }
    return false;
  }

  function topicMatch(card) {
    if (!activeTopics.length) return true;
    var tags = card.tags || [];
    for (var i = 0; i < activeTopics.length; i++) {
      if (has(tags, activeTopics[i])) return true;
    }
    return false;
  }

  function cardMatches(card) {
    if (!ageMatch(card) || !topicMatch(card)) return false;
    if (!query) return true;
    var blob = fold([
      card.title,
      (card.paragraphs || []).join(" "),
      card.summary || "",
      (card.tags || []).join(" "),
      (card.ages || []).join(" "),
      (card.sources || []).map(function (s) { return s.title + " " + s.url; }).join(" ")
    ].join(" "));
    return blob.indexOf(fold(query)) !== -1;
  }

  function toggleIn(list, value) {
    var i = list.indexOf(value);
    if (i === -1) list.push(value);
    else list.splice(i, 1);
  }

  function renderChipRow(host, values, selected, onToggle) {
    host.innerHTML = "";
    values.forEach(function (value) {
      var b = document.createElement("button");
      b.type = "button";
      b.textContent = value;
      b.setAttribute("aria-pressed", has(selected, value) ? "true" : "false");
      b.addEventListener("click", function () {
        onToggle(value);
        renderAges();
        renderTags();
        renderCards();
      });
      host.appendChild(b);
    });
  }

  function renderAges() {
    renderChipRow($("age-list"), AGE_BANDS, activeAges, function (value) {
      toggleIn(activeAges, value);
    });
  }

  function renderTags() {
    renderChipRow($("tag-list"), allTags(), activeTopics, function (value) {
      toggleIn(activeTopics, value);
    });
  }

  function sourceList(sources) {
    if (!sources || !sources.length) return "";
    return "<ul class='sources'>" + sources.map(function (s) {
      var href = safeUrl(s.url);
      var link = href
        ? "<a href='" + esc(href) + "' rel='noopener noreferrer'>" + esc(s.title || href) + "</a>"
        : esc(s.title || "來源");
      return "<li>" + link + "<span class='src-date'>" + esc(s.date || "") + "</span></li>";
    }).join("") + "</ul>";
  }

  function chipRow(ages, tags, extra) {
    var chips = (ages || []).map(function (a) { return "<span class='tag age'>" + esc(a) + "</span>"; }).join("");
    chips += (tags || []).map(function (t) { return "<span class='tag'>" + esc(t) + "</span>"; }).join("");
    chips += extra || "";
    if (!chips) return "";
    return "<div class='meta'>" + chips + "</div>";
  }

  var CARD_VOTE_KEY = "homeschool-hk-card-votes-v1";
  var CARD_VOTED_KEY = "homeschool-hk-card-voted-v1";
  var cardVoteMap = loadCardVoteMap();
  var cardVotedMap = loadCardVotedMap();
  var expandedCardIds = {};

  function loadJsonObject(key) {
    try {
      var raw = localStorage.getItem(key);
      var data = raw ? JSON.parse(raw) : {};
      if (!data || typeof data !== "object" || Array.isArray(data)) return {};
      return data;
    } catch (e) {
      return {};
    }
  }

  function loadCardVoteMap() {
    var data = loadJsonObject(CARD_VOTE_KEY);
    var out = {};
    for (var k in data) {
      if (!Object.prototype.hasOwnProperty.call(data, k)) continue;
      var n = data[k];
      if (typeof n === "number" && isFinite(n) && n >= 0) out[k] = Math.floor(n);
    }
    return out;
  }

  function loadCardVotedMap() {
    var data = loadJsonObject(CARD_VOTED_KEY);
    var out = {};
    for (var k in data) {
      if (Object.prototype.hasOwnProperty.call(data, k) && data[k]) out[k] = true;
    }
    return out;
  }

  var cardVotesShared = null;
  var cardVotesReq = 0;

  function voteCount(id) {
    if (!id) return 0;
    if (cardVotesShared) {
      var shared = cardVotesShared[id];
      return typeof shared === "number" ? shared : 0;
    }
    var n = cardVoteMap[id];
    return typeof n === "number" ? n : 0;
  }

  function applySharedVotes(votes) {
    if (!votes || typeof votes !== "object" || Array.isArray(votes)) return false;
    var out = {};
    for (var k in votes) {
      if (!Object.prototype.hasOwnProperty.call(votes, k)) continue;
      var n = votes[k];
      if (typeof n === "number" && isFinite(n) && n >= 0) out[k] = Math.floor(n);
    }
    cardVotesShared = out;
    return true;
  }

  function fetchCardVotes() {
    var req = ++cardVotesReq;
    var url = PUBLIC_EXEC + "?action=cardvotes&t=" + Date.now();
    return fetch(url, { cache: "no-store" })
      .then(function (r) { if (!r.ok) throw new Error("bad"); return r.json(); })
      .then(function (data) {
        if (req !== cardVotesReq) return;
        if (!data || data.ok !== true || !data.votes || typeof data.votes !== "object" || Array.isArray(data.votes)) throw new Error("bad");
        applySharedVotes(data.votes);
        renderCards();
      })
      .catch(function () {
        if (req !== cardVotesReq) return;
      });
  }

  function saveCardVotes() {
    localStorage.setItem(CARD_VOTE_KEY, JSON.stringify(cardVoteMap));
  }

  function saveCardVoted() {
    localStorage.setItem(CARD_VOTED_KEY, JSON.stringify(cardVotedMap));
  }

  function tagOnlyRow(tags) {
    var chips = (tags || []).map(function (t) { return "<span class='tag'>" + esc(t) + "</span>"; }).join("");
    if (!chips) return "";
    return "<div class='meta'>" + chips + "</div>";
  }

  function voteButton(id) {
    var n = voteCount(id);
    var voted = !!(id && cardVotedMap[id]);
    return "<button type='button' class='vote-btn' data-card-vote='" + esc(id) + "' aria-pressed='" + (voted ? "true" : "false") + "' aria-label='支持這張資訊'>" +
      "<span class='vote-arrow' aria-hidden='true'>↑</span> <span class='vote-count'>" + String(n) + "</span></button>";
  }

  function foldCard(card, detailHtml) {
    var id = card.id || "";
    var open = !!(id && expandedCardIds[id]);
    return "<article class='card card-fold" + (open ? " is-open" : "") + "' data-card-id='" + esc(id) + "' aria-expanded='" + (open ? "true" : "false") + "'>" +
      "<div class='card-summary'>" +
        tagOnlyRow(card.tags) +
        "<div class='card-title-row'>" +
          "<h2>" + esc(card.title) + "</h2>" +
          voteButton(id) +
        "</div>" +
      "</div>" +
      "<div class='card-detail'" + (open ? "" : " hidden") + ">" + detailHtml + "</div>" +
      "</article>";
  }

  function renderSeedCard(card) {
    var paras = (card.paragraphs || []).map(function (p) { return "<p>" + esc(p) + "</p>"; }).join("");
    var detail = chipRow(card.ages, []) + paras + sourceList(card.sources);
    return foldCard(card, detail);
  }

  function renderPersonalCard(card) {
    var href = safeUrl(card.url);
    var link = href ? "<p><a href='" + esc(href) + "' rel='noopener noreferrer'>" + esc(href) + "</a></p>" : "";
    var detail = chipRow(card.ages, [], "<span class='badge mine'>自行新增 · 只在這部瀏覽器</span>") +
      "<p>" + esc(card.summary || "") + "</p>" +
      link +
      "<div class='actions'><button type='button' class='danger' data-del-card='" + esc(card.id) + "'>刪除這張</button></div>";
    return foldCard(card, detail);
  }

  function renderCommunityCard(card) {
    var href = safeUrl(card.url);
    var link = href ? "<p><a href='" + esc(href) + "' rel='noopener noreferrer'>" + esc(href) + "</a></p>" : "";
    var detail = chipRow(card.ages, [], "<span class='badge'>社區建議 · 已公開</span>") +
      "<p>" + esc(card.summary || "") + "</p>" +
      link;
    return foldCard(card, detail);
  }

  function renderCards() {
    var personal = state.personalCards
      .slice()
      .sort(function (a, b) { return String(b.addedAt).localeCompare(String(a.addedAt)); })
      .filter(cardMatches);
    var community = communityCards
      .slice()
      .sort(function (a, b) { return String(b.submittedAt || "").localeCompare(String(a.submittedAt || "")); })
      .filter(cardMatches);
    var official = seed
      .slice()
      .sort(function (a, b) { return (a.rank || 99) - (b.rank || 99); })
      .filter(cardMatches);
    var items = [];
    personal.forEach(function (c) { items.push({ card: c, kind: "personal" }); });
    community.forEach(function (c) { items.push({ card: c, kind: "community" }); });
    official.forEach(function (c) { items.push({ card: c, kind: "seed" }); });
    items.forEach(function (item, i) { item.order = i; });
    items.sort(function (a, b) {
      var dv = voteCount(b.card.id) - voteCount(a.card.id);
      if (dv) return dv;
      return a.order - b.order;
    });
    var html = items.map(function (item) {
      if (item.kind === "personal") return renderPersonalCard(item.card);
      if (item.kind === "community") return renderCommunityCard(item.card);
      return renderSeedCard(item.card);
    }).join("");
    $("card-list").innerHTML = html || "<p class='empty'>沒有符合的卡片。可改用其他字詞，或取消年齡與主題篩選再試。</p>";
    $("card-count").textContent = String(items.length);
  }

  function toggleFoldCard(article) {
    var id = article.getAttribute("data-card-id") || "";
    var detail = article.querySelector(".card-detail");
    if (!detail) return;
    var open = !!detail.hidden;
    detail.hidden = !open;
    article.classList.toggle("is-open", open);
    article.setAttribute("aria-expanded", open ? "true" : "false");
    if (id) {
      if (open) expandedCardIds[id] = true;
      else delete expandedCardIds[id];
    }
  }

  function onCardVote(btn) {
    var id = btn.getAttribute("data-card-vote");
    if (!id || cardVotedMap[id]) return;
    cardVotedMap[id] = true;
    saveCardVoted();
    var shownShared = !!cardVotesShared;
    if (shownShared) cardVotesShared[id] = voteCount(id) + 1;
    else {
      cardVoteMap[id] = voteCount(id) + 1;
      saveCardVotes();
    }
    renderCards();
    var req = ++cardVotesReq;
    var url = PUBLIC_EXEC + "?action=cardup&id=" + encodeURIComponent(id) +
      "&deviceId=" + encodeURIComponent(syncDeviceId()) + "&t=" + Date.now();
    fetch(url, { cache: "no-store" })
      .then(function (r) { if (!r.ok) throw new Error("bad"); return r.json(); })
      .then(function (data) {
        if (!data || data.ok !== true) throw new Error("bad");
        if (req !== cardVotesReq) return;
        if (data.votes && typeof data.votes === "object" && !Array.isArray(data.votes)) applySharedVotes(data.votes);
        else if (typeof data.count === "number" && isFinite(data.count) && data.count >= 0) {
          if (!cardVotesShared) cardVotesShared = {};
          cardVotesShared[id] = Math.floor(data.count);
        }
        if (shownShared) {
          var localN = cardVoteMap[id];
          cardVoteMap[id] = (typeof localN === "number" ? localN : 0) + 1;
          saveCardVotes();
        }
        renderCards();
      })
      .catch(function () {
        if (req !== cardVotesReq) return;
        if (shownShared) {
          delete cardVotedMap[id];
          saveCardVoted();
          var back = cardVotesShared[id];
          if (typeof back === "number" && back > 0) cardVotesShared[id] = back - 1;
          else delete cardVotesShared[id];
          renderCards();
          return;
        }
      });
  }

  function fillSelect(select, items, placeholder) {
    var current = select.value;
    select.innerHTML = "";
    if (placeholder) {
      var o = document.createElement("option");
      o.value = placeholder.value;
      o.textContent = placeholder.label;
      select.appendChild(o);
    }
    items.forEach(function (item) {
      var o = document.createElement("option");
      o.value = item.id;
      o.textContent = item.name || item.label;
      select.appendChild(o);
    });
    if (current && select.querySelector("option[value='" + CSS.escape(current) + "']")) {
      select.value = current;
    }
  }

  var selectedChildId = "";

  function ensureSelectedChild() {
    if (childById(selectedChildId)) return;
    selectedChildId = state.children.length ? state.children[0].id : "";
  }

  function refreshPersonButton() {
    ensureSelectedChild();
    var child = childById(selectedChildId);
    var label = child ? childLabel(child) : "小孩";
    var nameEl = $("selected-child-name");
    if (nameEl) nameEl.textContent = label;
    var btn = $("child-toggle");
    if (btn) btn.setAttribute("aria-label", "小孩設定：" + label);
  }

  function refreshChildSelects() {
    ensureSelectedChild();
    var kids = state.children.map(function (c) { return { id: c.id, name: c.name }; });
    fillSelect($("log-child"), kids, null);
    var logSel = $("log-child");
    if (logSel && selectedChildId && childById(selectedChildId)) logSel.value = selectedChildId;
    if (logSel) logSel.hidden = state.children.length < 2;
    fillSelect($("filter-child"), kids, { value: "all", label: "全部小孩" });
    if (logChild !== "all" && childById(logChild)) $("filter-child").value = logChild;
    else logChild = "all";
    refreshPersonButton();
  }

  function renderChildren() {
    var host = $("child-list");
    if (!state.children.length) {
      host.innerHTML = "<p class='empty'>尚未有小孩。可按「+ 小孩」加入。紀錄仍然只留在這部瀏覽器。</p>";
    } else {
      host.innerHTML = state.children.map(function (c) {
        var birthVal = parseBirthYm(c.birthYm) || "";
        var legacy = parseLegacyAge(c);
        var hint = !birthVal && legacy !== ""
          ? "<p class='legacy-age-hint'>舊年齡為 " + esc(String(legacy)) + " 歲，請設定出生年月</p>"
          : "";
        return "<div class='child-row' data-child-row='" + esc(c.id) + "'>" +
          "<label class='field-inline'><span>稱謂</span><input data-child-name='" + esc(c.id) + "' type='text' value='" + esc(c.name) + "' maxlength='40' placeholder='例如：姐姐' autocomplete='off'></label>" +
          "<label class='field-inline'><span>出生年月</span><input data-child-birth='" + esc(c.id) + "' type='month' value='" + esc(birthVal) + "'></label>" +
          "<button type='button' class='child-remove' data-del-child='" + esc(c.id) + "' aria-label='移除「" + esc(c.name) + "」'>❌</button>" +
          hint +
          "</div>";
      }).join("");
    }
    refreshChildSelects();
    renderSummary();
    renderLogs();
  }

  function renderLogs() {
    var rows = state.logs.filter(function (log) {
      if (logChild !== "all" && log.childId !== logChild) return false;
      if (logContext !== "all" && kindGroup(log.context) !== logContext) return false;
      return true;
    }).sort(function (a, b) {
      if (a.date !== b.date) return a.date < b.date ? 1 : -1;
      return String(a.id) < String(b.id) ? 1 : -1;
    });
    $("log-count").textContent = String(rows.length);
    var shown = rows.slice(0, logLimit);
    if (!shown.length) {
      $("log-list").innerHTML = "<p class='empty'>未有符合的紀錄。按「記錄一項學習或活動」記錄閱讀、影音、運動或其他項目。</p>";
    } else {
      $("log-list").innerHTML = shown.map(function (log) {
        var child = childById(log.childId);
        var extra = [];
        extra.push(contextLabel(log.context));
        var ageText = formatLogAge(log);
        if (ageText) extra.push(ageText);
        if (log.intensity) extra.push(intensityLabel(log.intensity));
        if (log.durationMin) extra.push(String(log.durationMin) + " 分鐘");
        return "<article class='log'>" +
          "<div class='log-head'><h3>" + esc(child ? child.name : "（已移除的小孩）") + " · " + esc(logHeadline(log)) + "</h3>" +
          "<time datetime='" + esc(log.date) + "'>" + esc(log.date) + "</time></div>" +
          (extra.length ? "<p class='intensity'>" + esc(extra.join(" · ")) + "</p>" : "") +
          (log.note ? "<p>" + esc(log.note) + "</p>" : "") +
          "<div class='actions'><button type='button' class='danger' data-del-log='" + esc(log.id) + "'>刪除這則</button></div>" +
          "</article>";
      }).join("");
    }
    $("more-logs").hidden = rows.length <= logLimit;
  }

  function summaryWindow() {
    var end = todayISO();
    var startDate = new Date(end + "T12:00:00");
    startDate.setDate(startDate.getDate() - 13);
    var localStart = new Date(startDate.getTime() - startDate.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
    return { start: localStart, end: end };
  }

  function renderSummary() {
    var host = $("summary");
    if (!host) return;
    if (!state.children.length) {
      host.innerHTML = "<p class='empty'>新增一位小孩之後，這裡會按年齡段與種類列出最近 14 日記錄的電影、書籍與活動名稱，方便對照「這個年紀常看什麼、讀什麼、做什麼」。資料只在本機，不會上傳或與他人分享。</p>";
      return;
    }
    var win = summaryWindow();
    var recent = state.logs.filter(function (log) {
      return log.date >= win.start && log.date <= win.end;
    }).sort(function (a, b) {
      if (a.date !== b.date) return a.date < b.date ? 1 : -1;
      return String(a.id) < String(b.id) ? 1 : -1;
    });
    if (!recent.length) {
      host.innerHTML = "<p class='empty'>" + esc(win.start) + " 至 " + esc(win.end) + " 尚未有學習紀錄。記錄一部電影、一本書或一項活動即可。</p>";
      return;
    }
    var bands = AGE_BANDS.concat([SUMMARY_AGE_UNSET]);
    var grouped = {};
    bands.forEach(function (band) { grouped[band] = {}; });
    recent.forEach(function (log) {
      var resolved = logAgeBand(log);
      var band = resolved && AGE_BANDS.indexOf(resolved) !== -1 ? resolved : SUMMARY_AGE_UNSET;
      var kind = normalizeContext(log.context);
      if (!grouped[band][kind]) grouped[band][kind] = [];
      grouped[band][kind].push(log);
    });
    var html = "<p><strong>最近 14 日</strong> · " + esc(win.start) + " 至 " + esc(win.end) + "</p>" +
      "<p class='intensity'>按紀錄時的年齡（或舊版年齡段）與種類列出名稱，方便回想同齡時的觀看、閱讀與活動；不是評估分數，亦不會與其他家庭比較。</p>";
    bands.forEach(function (band) {
      var kinds = grouped[band];
      var kindIds = LEARNING_KINDS.map(function (k) { return k.id; }).filter(function (id) {
        return kinds[id] && kinds[id].length;
      });
      if (!kindIds.length) return;
      html += "<section class='learning-band'><h3 class='learning-band-title'>" + esc(band) + "</h3>";
      kindIds.forEach(function (kindId) {
        var kind = learningKindById(kindId);
        html += "<div class='learning-kind-block'><h4>" + esc(kind ? kind.label : kindId) + "</h4><ul class='learning-title-list'>";
        kinds[kindId].forEach(function (log) {
          var child = childById(log.childId);
          var meta = [];
          if (child) meta.push(child.name);
          meta.push(log.date);
          html += "<li><span class='learning-item-title'>" + esc(logHeadline(log)) + "</span>" +
            "<span class='learning-item-meta'>" + esc(meta.join(" · ")) + "</span></li>";
        });
        html += "</ul></div>";
      });
      html += "</section>";
    });
    host.innerHTML = html;
  }

  function renderLogKindPicker() {
    var kindHost = $("log-kind-pick");
    if (!kindHost) return;
    if (!LEARNING_KINDS.some(function (k) { return k.id === logPickKind; })) logPickKind = "";
    kindHost.innerHTML = LEARNING_KINDS.map(function (k) {
      var pressed = k.id === logPickKind ? "true" : "false";
      return "<button type='button' class='kind-chip' data-log-kind='" + esc(k.id) + "' aria-pressed='" + pressed + "'>" + esc(k.label) + "</button>";
    }).join("");
    $("log-context").value = logPickKind;
  }

  function fillContextFilter() {
    var select = $("filter-context");
    var current = select.value;
    select.innerHTML = "<option value='all'>全部種類</option>";
    LEARNING_KINDS.forEach(function (k) {
      var o = document.createElement("option");
      o.value = k.id;
      o.textContent = k.label;
      select.appendChild(o);
    });
    if (current && select.querySelector("option[value='" + CSS.escape(current) + "']")) {
      select.value = current;
    }
  }

  function exportData() {
    var payload = {
      version: 1,
      exportedAt: new Date().toISOString(),
      app: "homeschool-hk",
      children: state.children,
      logs: state.logs,
      personalCards: state.personalCards
    };
    var blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    var a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "homeschool-hk-backup-" + todayISO() + ".json";
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(function () { URL.revokeObjectURL(a.href); }, 1500);
  }

  function mergeImport(data) {
    var ids = {};
    state.children.forEach(function (c) { ids[c.id] = true; });
    (data.children || []).forEach(function (c) {
      if (!c || !c.id || ids[c.id]) return;
      state.children.push(normalizeChild(c));
      ids[c.id] = true;
    });
    var logIds = {};
    state.logs.forEach(function (l) { logIds[l.id] = true; });
    (data.logs || []).forEach(function (l) {
      if (!l || !l.id || logIds[l.id]) return;
      state.logs.push(cleanLog(l));
      logIds[l.id] = true;
    });
    var cardIds = {};
    state.personalCards.forEach(function (c) { cardIds[c.id] = true; });
    (data.personalCards || []).forEach(function (c) {
      if (!c || !c.id || cardIds[c.id]) return;
      state.personalCards.push(cleanCard(c));
    });
  }

  function cleanLog(l) {
    var rawContext = l.context;
    var ctx = normalizeContext(rawContext);
    if (!ctx) ctx = "learning-other";
    var title = String(l.title || "").trim().slice(0, 120);
    if (!title) {
      var legacyTitle = legacyContextLabel(rawContext);
      if (legacyTitle) title = legacyTitle.slice(0, 120);
    }
    var intensity = (l.intensity === "light" || l.intensity === "usual" || l.intensity === "strong") ? l.intensity : "";
    var mins = parseInt(l.durationMin, 10);
    return {
      id: String(l.id),
      childId: String(l.childId || ""),
      date: /^\d{4}-\d{2}-\d{2}$/.test(l.date) ? l.date : todayISO(),
      context: ctx,
      title: title,
      childAge: parseLogChildAge(l),
      ageBand: normalizeAgeBand(l.ageBand) || numericAgeToBand(parseLogChildAge(l)),
      note: String(l.note || "").slice(0, 2000),
      intensity: intensity,
      durationMin: (mins > 0 && mins < 10000) ? mins : "",
      updatedAt: (l && typeof l.updatedAt === "string") ? l.updatedAt : ""
    };
  }

  function cleanCard(c) {
    var tags = Array.isArray(c.tags) ? c.tags.map(function (t) { return String(t).trim(); }).filter(Boolean).slice(0, 8) : [];
    return {
      id: String(c.id),
      title: String(c.title || "未命名").slice(0, 80),
      summary: String(c.summary || "").slice(0, 2000),
      url: safeUrl(c.url || ""),
      tags: tags,
      ages: cleanAges(c.ages),
      addedAt: c.addedAt || new Date().toISOString()
    };
  }

  function normalizeCommunityCard(raw) {
    if (!raw || !raw.title) return null;
    var tags = Array.isArray(raw.tags) ? raw.tags.map(function (t) { return String(t).trim(); }).filter(Boolean).slice(0, 8) : [];
    return {
      id: String(raw.id || uid()),
      title: String(raw.title).slice(0, 80),
      summary: String(raw.summary || "").slice(0, 2000),
      url: safeUrl(raw.url || ""),
      tags: tags,
      ages: cleanAges(raw.ages),
      submittedAt: raw.submittedAt || ""
    };
  }

  function readSuggestForm() {
    var title = $("card-title").value.trim();
    var summary = $("card-summary").value.trim();
    if (!title || !summary) return null;
    var tags = $("card-tags").value.split(/[,，]/).map(function (t) { return t.trim(); }).filter(Boolean).slice(0, 8);
    var ages = [];
    var boxes = $("add-card").querySelectorAll("input[name='age']");
    for (var i = 0; i < boxes.length; i++) {
      if (boxes[i].checked) ages.push(boxes[i].value);
    }
    var shortId = uid();
    var cardId = "community-" + shortId;
    var filePath = "cards/" + cardId + ".json";
    var payload = {
      id: cardId,
      title: title.slice(0, 80),
      summary: summary.slice(0, 2000),
      url: safeUrl($("card-url").value),
      tags: tags,
      ages: cleanAges(ages),
      submittedAt: new Date().toISOString().slice(0, 10)
    };
    return { payload: payload, filePath: filePath, cardId: cardId };
  }

  function githubNewIssueUrl(title, body) {
    return "https://github.com/" + GITHUB_REPO + "/issues/new?title=" +
      encodeURIComponent(title) + "&body=" + encodeURIComponent(body);
  }

  function openCommunitySuggest() {
    var form = readSuggestForm();
    if (!form) return;
    var jsonText = JSON.stringify(form.payload, null, 2);
    var issueTitle = "社區資訊卡建議：" + form.payload.title;
    var issueBody = [
      "建議新增社區資訊卡。",
      "",
      "建議檔案路徑：`" + form.filePath + "`",
      "",
      "```json",
      jsonText,
      "```"
    ].join("\n");
    var hint = $("suggest-card-hint");
    hint.hidden = false;
    hint.textContent =
      "已開啟 GitHub 新增議題頁面。請在該頁按「Submit new issue」提交；維護者加入清單後，卡片才會對所有訪客公開。";
    window.open(githubNewIssueUrl(issueTitle, issueBody), "_blank", "noopener,noreferrer");
  }

  function loadCommunityCards(files) {
    if (!files || !files.length) return Promise.resolve([]);
    return Promise.all(files.map(function (path) {
      return fetch(path, { cache: "no-store" })
        .then(function (r) { return r.ok ? r.json() : null; })
        .catch(function () { return null; });
    })).then(function (items) {
      return items.map(normalizeCommunityCard).filter(Boolean);
    });
  }

  function loadCommunityIndex() {
    return fetch("cards/community-index.json", { cache: "no-store" })
      .then(function (r) { return r.ok ? r.json() : { files: [] }; })
      .catch(function () { return { files: [] }; });
  }

  function replaceImport(data) {
    state.logs = (data.logs || []).filter(Boolean).map(cleanLog);
    state.children = migrateChildren(data.children || [], state.logs);
    state.personalCards = (data.personalCards || []).filter(Boolean).map(cleanCard);
  }

  function addChildRow() {
    state.children.push(touch(normalizeChild({ id: uid(), name: "小孩", birthYm: "", legacyAge: "", note: "" })));
    save();
    renderChildren();
    var list = $("child-list");
    if (!list) return;
    var nameInput = list.querySelector("[data-child-row]:last-child input[data-child-name]");
    if (nameInput) nameInput.focus();
  }

  function openAddLogForm() {
    var form = $("add-log");
    if (!form) return;
    form.hidden = false;
    ensureSelectedChild();
    var dateEl = $("log-date");
    if (dateEl && !dateEl.value) dateEl.value = todayISO();
    var logSel = $("log-child");
    if (logSel && selectedChildId && childById(selectedChildId)) logSel.value = selectedChildId;
    var kindField = $("log-kind-field");
    if (kindField) kindField.scrollIntoView({ behavior: "smooth", block: "nearest" });
    var kindHost = $("log-kind-pick");
    var chip = kindHost && kindHost.querySelector("button");
    if (chip) chip.focus();
  }


  var PUBLIC_EXEC = "https://script.google.com/macros/s/AKfycbzSQhdoAlfDfYgXUDg9ObVmhM_Cay4IiZ_IeGNOxzf9ePPlQd9_rn0s92fnb2uQgZXwug/exec";
  var HEART_KEY = "homeschool-hk-hearts-v1";
  var publicShareItems = [];
  var heartedMap = loadHearted();

  function loadHearted() {
    try {
      var raw = localStorage.getItem(HEART_KEY);
      var data = raw ? JSON.parse(raw) : {};
      if (!data || typeof data !== "object" || Array.isArray(data)) return {};
      return data;
    } catch (e) {
      return {};
    }
  }

  function saveHearted() {
    localStorage.setItem(HEART_KEY, JSON.stringify(heartedMap));
  }

  function itemHasNumericAge(item) {
    if (!item || item.age === "" || item.age == null) return false;
    var n = Number(item.age);
    return Number.isFinite(n) && n >= 0 && n <= 99 && Math.floor(n) === n;
  }

  function shareAgeLabel(item) {
    if (itemHasNumericAge(item)) return String(item.age) + "歲";
    return String(item.ageBand || "");
  }

  function shareKey(item) {
    var agePart = itemHasNumericAge(item) ? String(item.age) : String(item.ageBand || "");
    return agePart + "\n" + String(item.kind || "") + "\n" + String(item.title || "");
  }

  function kindIdFromLabel(label) {
    if (PUBLIC_KIND_TO_ID[label]) return PUBLIC_KIND_TO_ID[label];
    for (var i = 0; i < LEARNING_KINDS.length; i++) {
      if (LEARNING_KINDS[i].label === label) return LEARNING_KINDS[i].id;
    }
    return "";
  }

  function childLabel(child) {
    return String((child && child.name) || "").trim() || "小孩";
  }

  function heartLabel(n, filled) {
    var count = typeof n === "number" && n >= 0 ? n : 0;
    return "❤️ " + String(count);
  }

  function setShareStatus(article, text, isError) {
    var el = article && article.querySelector("[data-share-status]");
    if (!el) return;
    el.hidden = false;
    el.textContent = text;
    el.classList.toggle("is-error", !!isError);
  }

  function copyShareToChild(item, child) {
    var kind = kindIdFromLabel(item.kind) || "learning-other";
    var childAge = childAgeForNewLog(child);
    var ageBand = childAge !== "" ? numericAgeToBand(childAge) : "";
    state.logs.push(touch({
      id: uid(),
      childId: child.id,
      date: todayISO(),
      context: kind,
      title: String(item.title || "").trim().slice(0, 120),
      childAge: childAge,
      ageBand: ageBand,
      note: ""
    }));
    save();
    renderLogs();
    renderSummary();
  }

  function renderPublicShares() {
    var host = $("share-list");
    if (!host) return;
    if (!publicShareItems.length) {
      host.innerHTML = "<p class='empty'>這 7 日尚未有分享。</p>";
      return;
    }
    host.innerHTML = publicShareItems.map(function (item, index) {
      var filled = !!heartedMap[shareKey(item)];
      var hearts = typeof item.hearts === "number" ? item.hearts : 0;
      return "<article class='share-item' data-share-index='" + index + "'>" +
        "<div class='share-main'>" +
          "<div class='share-title'>" + esc(item.title) + "</div>" +
          "<div class='share-meta'>" + esc(shareAgeLabel(item)) + " · " + esc(item.kind) + "</div>" +
        "</div>" +
        "<div class='share-actions'>" +
          "<button type='button' class='share-btn' data-share-plus='" + index + "'>+1</button>" +
          "<button type='button' class='share-btn" + (filled ? " hearted" : "") + "' data-share-heart='" + index + "' aria-pressed='" + (filled ? "true" : "false") + "'>" + heartLabel(hearts, filled) + "</button>" +
        "</div>" +
        "<div class='share-pick' data-share-pick hidden></div>" +
        "<p class='share-status' data-share-status hidden></p>" +
      "</article>";
    }).join("");
  }

  function openChildPick(article, index) {
    var pick = article.querySelector("[data-share-pick]");
    if (!pick) return;
    pick.hidden = false;
    pick.innerHTML = "<span class='share-pick-label'>記入哪一位？</span>" +
      state.children.map(function (c) {
        return "<button type='button' class='kind-chip' data-share-child='" + esc(c.id) + "'>" + esc(childLabel(c)) + "</button>";
      }).join("");
  }

  function onSharePlus(article, index) {
    var item = publicShareItems[index];
    if (!item) return;
    if (!state.children.length) {
      var pick = article.querySelector("[data-share-pick]");
      if (pick) { pick.hidden = true; pick.innerHTML = ""; }
      setShareStatus(article, "請先到「家裡紀錄」加入小孩。", true);
      return;
    }
    if (state.children.length === 1) {
      var only = state.children[0];
      copyShareToChild(item, only);
      var pickOne = article.querySelector("[data-share-pick]");
      if (pickOne) { pickOne.hidden = true; pickOne.innerHTML = ""; }
      setShareStatus(article, "已記入「" + childLabel(only) + "」。", false);
      return;
    }
    var existing = article.querySelector("[data-share-pick]");
    if (existing && !existing.hidden) {
      existing.hidden = true;
      existing.innerHTML = "";
      return;
    }
    openChildPick(article, index);
  }

  function onShareHeart(btn, article, index) {
    var item = publicShareItems[index];
    if (!item || !btn) return;
    var key = shareKey(item);
    if (heartedMap[key]) return;
    if (btn.getAttribute("data-busy") === "1") return;
    btn.setAttribute("data-busy", "1");
    btn.disabled = true;
    var ageQuery = itemHasNumericAge(item)
      ? "age=" + encodeURIComponent(String(item.age))
      : "ageBand=" + encodeURIComponent(item.ageBand || "");
    var url = PUBLIC_EXEC + "?action=heart&" + ageQuery +
      "&kind=" + encodeURIComponent(item.kind) +
      "&title=" + encodeURIComponent(item.title) +
      "&t=" + Date.now();
    fetch(url, { cache: "no-store" })
      .then(function (r) { if (!r.ok) throw new Error("bad"); return r.json(); })
      .then(function (data) {
        if (!data || data.ok !== true || typeof data.hearts !== "number") throw new Error("bad");
        heartedMap[key] = true;
        saveHearted();
        item.hearts = data.hearts;
        btn.textContent = heartLabel(data.hearts, true);
        btn.classList.add("hearted");
        btn.setAttribute("aria-pressed", "true");
        btn.disabled = false;
        btn.removeAttribute("data-busy");
      })
      .catch(function () {
        btn.disabled = false;
        btn.removeAttribute("data-busy");
        setShareStatus(article, "未能送出心意，請稍後再試。", true);
      });
  }

  function initPublicShares() {
    var host = $("share-list");
    if (!host) return;
    host.innerHTML = "<p class='empty'>正在讀取家長分享……</p>";
    var url = PUBLIC_EXEC + "?action=list&t=" + Date.now();
    fetch(url, { cache: "no-store" })
      .then(function (r) { if (!r.ok) throw new Error("bad"); return r.json(); })
      .then(function (data) {
        if (!data || data.ok === false || !Array.isArray(data.items)) throw new Error("bad");
        publicShareItems = data.items.filter(function (item) {
          return item && item.title && item.kind && (itemHasNumericAge(item) || item.ageBand);
        });
        renderPublicShares();
      })
      .catch(function () {
        host.innerHTML = "<p class='empty'>暫時讀不到家長分享。請稍後再試。</p>";
      });
  }

  var SYNC_CODE_KEY = "homeschool-hk-sync-code-v1";
  var SYNC_DEVICE_KEY = "homeschool-hk-sync-device-v1";
  var SYNC_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  var syncTimer = null;
  var syncBusy = false;
  var syncSession = false;

  function randomFromAlphabet(len) {
    var out = "";
    var bytes = new Uint8Array(len);
    if (window.crypto && window.crypto.getRandomValues) window.crypto.getRandomValues(bytes);
    else {
      for (var i = 0; i < len; i++) bytes[i] = Math.floor(Math.random() * 256);
    }
    for (var j = 0; j < len; j++) out += SYNC_ALPHABET[bytes[j] % SYNC_ALPHABET.length];
    return out;
  }

  function syncDeviceId() {
    try {
      var existing = localStorage.getItem(SYNC_DEVICE_KEY) || "";
      if (/^[A-HJ-NP-Z2-9]{8,32}$/.test(existing)) return existing;
    } catch (e) {}
    var id = randomFromAlphabet(12);
    try { localStorage.setItem(SYNC_DEVICE_KEY, id); } catch (e2) {}
    return id;
  }

  function normalizeSyncCode(value) {
    return String(value || "").toUpperCase().replace(/\s+/g, "");
  }

  function setSyncStatus(text, isError) {
    var el = $("sync-status");
    if (!el) return;
    if (!text) {
      el.hidden = true;
      el.textContent = "";
      el.classList.remove("is-error");
      return;
    }
    el.hidden = false;
    el.textContent = text;
    el.classList.toggle("is-error", !!isError);
  }

  function syncSnapshotText() {
    return JSON.stringify({
      version: 1,
      app: "homeschool-hk",
      children: state.children,
      logs: state.logs
    });
  }

  function itemTime(item) {
    var t = Date.parse(item && item.updatedAt);
    return isNaN(t) ? 0 : t;
  }

  function mergeRemoteDiary(data) {
    if (!data || typeof data !== "object") return false;
    var changed = false;
    var childIndex = {};
    state.children.forEach(function (c, i) { childIndex[c.id] = i; });
    (data.children || []).forEach(function (raw) {
      if (!raw) return;
      var child = normalizeChild(raw);
      if (!child.id) return;
      if (typeof raw.updatedAt === "string") child.updatedAt = raw.updatedAt;
      var idx = childIndex[child.id];
      if (idx == null) {
        state.children.push(child);
        childIndex[child.id] = state.children.length - 1;
        changed = true;
        return;
      }
      if (itemTime(child) > itemTime(state.children[idx])) {
        state.children[idx] = child;
        changed = true;
      }
    });
    var logIndex = {};
    state.logs.forEach(function (l, i) { logIndex[l.id] = i; });
    (data.logs || []).forEach(function (raw) {
      if (!raw || !raw.id) return;
      var log = cleanLog(raw);
      if (typeof raw.updatedAt === "string") log.updatedAt = raw.updatedAt;
      var idx = logIndex[log.id];
      if (idx == null) {
        state.logs.push(log);
        logIndex[log.id] = state.logs.length - 1;
        changed = true;
        return;
      }
      if (itemTime(log) > itemTime(state.logs[idx])) {
        state.logs[idx] = log;
        changed = true;
      }
    });
    return changed;
  }

  function pushSnapshot(code) {
    var text = syncSnapshotText();
    if (text.length > 45000) {
      return Promise.resolve({ ok: false, error: "快照太大（超過 45KB），請減少紀錄後再同步。" });
    }
    return fetch(PUBLIC_EXEC, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify({
        action: "sync",
        method: "push",
        code: code,
        deviceId: syncDeviceId(),
        snapshot: text
      }),
      cache: "no-store"
    }).then(function (r) {
      if (!r.ok) throw new Error("bad");
      return r.json();
    });
  }

  function pullSnapshots(code) {
    var url = PUBLIC_EXEC + "?action=sync&method=pull&code=" + encodeURIComponent(code) +
      "&deviceId=" + encodeURIComponent(syncDeviceId()) + "&t=" + Date.now();
    return fetch(url, { cache: "no-store" }).then(function (r) {
      if (!r.ok) throw new Error("bad");
      return r.json();
    });
  }

  function applyPulled(pulled) {
    if (!syncSession) return;
    if (!pulled || pulled.ok !== true) {
      setSyncStatus((pulled && pulled.error) || "未能讀取其他家長的紀錄。", true);
      return;
    }
    var changed = false;
    (pulled.snapshots || []).forEach(function (snap) {
      var data = snap;
      if (typeof snap === "string") {
        try { data = JSON.parse(snap); }
        catch (e) { return; }
      }
      if (mergeRemoteDiary(data)) changed = true;
    });
    if (changed) {
      save();
      renderChildren();
      renderLogs();
      renderSummary();
    }
    var n = (pulled.snapshots || []).length;
    setSyncStatus("同步中。剛才讀到 " + n + " 位同時在線的家長。", false);
  }

  function syncOnce() {
    if (!syncSession || syncBusy) return;
    var input = $("sync-code");
    var code = normalizeSyncCode(input && input.value);
    if (!code) {
      stopSync("請輸入同步碼。", true);
      return;
    }
    syncBusy = true;
    pushSnapshot(code).then(function (pushed) {
      if (!syncSession) return null;
      if (!pushed || pushed.ok !== true) {
        var err = (pushed && pushed.error) || "未能上傳，請稍後再試。";
        stopSync(err, true);
        return null;
      }
      return pullSnapshots(code);
    }).then(function (pulled) {
      if (pulled) applyPulled(pulled);
    }).catch(function () {
      if (syncSession) setSyncStatus("同步暫時失敗，會再試。", true);
    }).then(function () {
      syncBusy = false;
    });
  }

  function stopSync(message, isError) {
    syncSession = false;
    if (syncTimer) {
      clearInterval(syncTimer);
      syncTimer = null;
    }
    var stopBtn = $("sync-stop");
    var startBtn = $("sync-start");
    if (stopBtn) stopBtn.hidden = true;
    if (startBtn) startBtn.hidden = false;
    if (message) setSyncStatus(message, !!isError);
  }

  function startSyncSession() {
    var input = $("sync-code");
    var code = normalizeSyncCode(input && input.value);
    if (input) input.value = code;
    if (!code) {
      setSyncStatus("請輸入同步碼，或按「生成同步碼」。", true);
      return;
    }
    if (!/^[A-Z0-9]{4,16}$/.test(code)) {
      setSyncStatus("同步碼請用 4 至 16 個英文字母或數字。", true);
      return;
    }
    var ok = confirm("這部瀏覽器的家裡紀錄（小孩與學習日記，包括詳情）會上傳到共用試算表，讓持有相同同步碼、同時開着這個頁面的家長合併。關掉頁面就不會再上傳。確定上傳並開始同步？");
    if (!ok) {
      setSyncStatus("已取消，沒有上傳。", false);
      return;
    }
    try { localStorage.setItem(SYNC_CODE_KEY, code); } catch (e) {}
    syncSession = true;
    var stopBtn = $("sync-stop");
    var startBtn = $("sync-start");
    if (stopBtn) stopBtn.hidden = false;
    if (startBtn) startBtn.hidden = true;
    setSyncStatus("同步中……", false);
    syncOnce();
    if (syncTimer) clearInterval(syncTimer);
    syncTimer = setInterval(syncOnce, 8000);
  }

  function openSyncDialog() {
    var dlg = $("sync-dialog");
    var input = $("sync-code");
    if (input && !syncSession) {
      var saved = "";
      try { saved = localStorage.getItem(SYNC_CODE_KEY) || ""; } catch (e) {}
      input.value = saved;
      setSyncStatus("", false);
    }
    if (dlg && typeof dlg.showModal === "function") dlg.showModal();
  }

  function bindSync() {
    on("sync-open", "click", openSyncDialog);
    on("sync-generate", "click", function () {
      var code = randomFromAlphabet(8);
      var input = $("sync-code");
      if (input) input.value = code;
      try { localStorage.setItem(SYNC_CODE_KEY, code); } catch (e) {}
      setSyncStatus("新同步碼：" + code + "。請告訴其他家長。尚未上傳。", false);
    });
    on("sync-start", "click", startSyncSession);
    on("sync-stop", "click", function () {
      stopSync("已停止同步。", false);
    });
    on("sync-close", "click", function () {
      var dlg = $("sync-dialog");
      if (dlg && dlg.open && typeof dlg.close === "function") dlg.close();
    });
    var dlg = $("sync-dialog");
    if (dlg) dlg.addEventListener("close", function () {
      if (syncSession) stopSync("已停止同步。", false);
    });
  }

  function bind() {
    on("wish-open", "click", function () {
      var dlg = $("wish-dialog");
      var status = $("wish-status");
      if (status) { status.hidden = true; status.textContent = ""; status.classList.remove("is-error"); }
      if (dlg && typeof dlg.showModal === "function") dlg.showModal();
    });
    on("wish-cancel", "click", function () {
      var dlg = $("wish-dialog");
      if (dlg && dlg.open) dlg.close();
    });
    on("wish-form", "submit", function (ev) {
      ev.preventDefault();
      var messageEl = $("wish-message");
      var contactEl = $("wish-contact");
      var status = $("wish-status");
      var btn = $("wish-send");
      var message = messageEl ? messageEl.value.trim().slice(0, 500) : "";
      var contact = contactEl ? contactEl.value.trim().slice(0, 120) : "";
      if (!message) {
        if (status) {
          status.hidden = false;
          status.classList.add("is-error");
          status.textContent = "未能送出，請稍後再試。";
        }
        return;
      }
      if (btn) btn.disabled = true;
      var url = PUBLIC_EXEC + "?action=wish&message=" + encodeURIComponent(message) +
        "&contact=" + encodeURIComponent(contact) + "&t=" + Date.now();
      fetch(url, { cache: "no-store" })
        .then(function (r) { if (!r.ok) throw new Error("bad"); return r.json(); })
        .then(function (data) {
          if (!data || data.ok !== true) throw new Error("bad");
          if (messageEl) messageEl.value = "";
          if (contactEl) contactEl.value = "";
          if (status) {
            status.hidden = false;
            status.classList.remove("is-error");
            status.textContent = "已送出。";
          }
          if (btn) btn.disabled = false;
        })
        .catch(function () {
          if (status) {
            status.hidden = false;
            status.classList.add("is-error");
            status.textContent = "未能送出，請稍後再試。";
          }
          if (btn) btn.disabled = false;
        });
    });
    on("tab-public", "click", function () { setMode("public"); });

    on("share-list", "click", function (ev) {
      var plus = ev.target.closest("[data-share-plus]");
      var heart = ev.target.closest("[data-share-heart]");
      var childBtn = ev.target.closest("[data-share-child]");
      var article = ev.target.closest(".share-item");
      if (!article) return;
      var index = parseInt(article.getAttribute("data-share-index"), 10);
      if (plus) {
        onSharePlus(article, index);
        return;
      }
      if (heart) {
        onShareHeart(heart, article, index);
        return;
      }
      if (childBtn) {
        var item = publicShareItems[index];
        var child = childById(childBtn.getAttribute("data-share-child"));
        if (!item || !child) {
          setShareStatus(article, "找不到這位小孩。", true);
          return;
        }
        copyShareToChild(item, child);
        var pick = article.querySelector("[data-share-pick]");
        if (pick) { pick.hidden = true; pick.innerHTML = ""; }
        setShareStatus(article, "已記入「" + childLabel(child) + "」。", false);
      }
    });
    on("tab-private", "click", function () { setMode("private"); });

    on("private-info", "click", function () {
      var note = $("private-note");
      var btn = $("private-info");
      if (!note || !btn) return;
      var open = note.hidden;
      note.hidden = !open;
      btn.setAttribute("aria-expanded", open ? "true" : "false");
    });

    on("child-toggle", "click", function () {
      var panel = $("child-settings");
      var btn = $("child-toggle");
      if (!panel || !btn) return;
      var open = panel.hidden;
      panel.hidden = !open;
      btn.setAttribute("aria-expanded", open ? "true" : "false");
    });

    on("log-child", "change", function () {
      var sel = $("log-child");
      if (!sel || !childById(sel.value)) return;
      selectedChildId = sel.value;
      refreshPersonButton();
    });

    on("search", "input", function () {
      var search = $("search");
      query = search ? search.value.trim().toLowerCase() : "";
      renderCards();
    });

    on("add-card", "submit", function (ev) {
      ev.preventDefault();
      openCommunitySuggest();
    });

    on("card-list", "click", function (ev) {
      var voteBtn = ev.target.closest("[data-card-vote]");
      if (voteBtn) {
        ev.preventDefault();
        onCardVote(voteBtn);
        return;
      }
      var btn = ev.target.closest("[data-del-card]");
      if (btn) {
        var id = btn.getAttribute("data-del-card");
        if (!confirm("刪除這張自行新增的卡片？內建資料不會受影響。")) return;
        state.personalCards = state.personalCards.filter(function (c) { return c.id !== id; });
        save();
        renderTags();
        renderCards();
        return;
      }
      if (ev.target.closest("a, button, input, textarea, select, label")) return;
      var article = ev.target.closest("article.card-fold");
      if (!article) return;
      toggleFoldCard(article);
    });

    function persistChildEdits() {
      save();
      refreshChildSelects();
      renderLogs();
      renderSummary();
    }

    function onChildNameInput(ev) {
      var nameId = ev.target.getAttribute("data-child-name");
      if (!nameId) return;
      var child = childById(nameId);
      if (!child) return;
      child.name = ev.target.value.slice(0, 40);
      touch(child);
      persistChildEdits();
    }

    function commitChildNameField(input) {
      var nameId = input.getAttribute("data-child-name");
      if (!nameId) return;
      var child = childById(nameId);
      if (!child) return;
      var normalized = input.value.trim().slice(0, 40) || "小孩";
      child.name = normalized;
      input.value = normalized;
      touch(child);
      persistChildEdits();
    }

    function onChildBirthChange(ev) {
      var birthId = ev.target.getAttribute("data-child-birth");
      if (!birthId) return;
      var child = childById(birthId);
      if (!child) return;
      child.birthYm = parseBirthYm(ev.target.value) || "";
      if (!child.birthYm) ev.target.value = "";
      touch(child);
      save();
      renderChildren();
    }

    on("child-list", "input", function (ev) {
      if (ev.target.getAttribute("data-child-name")) onChildNameInput(ev);
    });
    on("child-list", "change", function (ev) {
      if (ev.target.getAttribute("data-child-name")) commitChildNameField(ev.target);
      else if (ev.target.getAttribute("data-child-birth")) onChildBirthChange(ev);
    });
    on("child-list", "blur", function (ev) {
      if (ev.target.getAttribute("data-child-name")) commitChildNameField(ev.target);
    }, true);

    on("child-list", "click", function (ev) {
      var btn = ev.target.closest("[data-del-child]");
      if (!btn) return;
      var id = btn.getAttribute("data-del-child");
      var child = childById(id);
      if (!child) return;
      if (!confirm("移除「" + child.name + "」？其在這部瀏覽器的日常紀錄會一併刪除。此動作不能還原，除非先前已匯出備份。")) return;
      state.children = state.children.filter(function (c) { return c.id !== id; });
      state.logs = state.logs.filter(function (l) { return l.childId !== id; });
      save();
      renderChildren();
    });

    on("add-child-head", "click", openAddLogForm);
    on("add-child-btn", "click", addChildRow);
    on("open-add-log", "click", openAddLogForm);

    renderLogKindPicker();
    fillContextFilter();
    var logDateInit = $("log-date");
    if (logDateInit) logDateInit.value = todayISO();

    on("log-kind-pick", "click", function (ev) {
      var btn = ev.target.closest("[data-log-kind]");
      if (!btn) return;
      logPickKind = btn.getAttribute("data-log-kind");
      renderLogKindPicker();
    });
    on("add-log", "submit", function (ev) {
      ev.preventDefault();
      if (!state.children.length) return;
      var kind = $("log-context").value;
      if (!learningKindById(kind)) {
        alert("請先點選一種種類（例如閱讀、影音或外遊）。");
        var kindField = $("log-kind-field");
        if (kindField) kindField.scrollIntoView({ behavior: "smooth", block: "nearest" });
        return;
      }
      var title = $("log-title").value.trim().slice(0, 120);
      if (!title) {
        alert("請填寫項目。");
        return;
      }
      var dateValue = ($("log-date").value || "").trim();
      if (!/^\d{4}-\d{2}-\d{2}$/.test(dateValue)) {
        alert("日期請用 yyyy-mm-dd。");
        return;
      }
      ensureSelectedChild();
      var chosenId = $("log-child").value || selectedChildId;
      var child = childById(chosenId);
      var childAge = childAgeForNewLog(child);
      var ageBand = childAge !== "" ? numericAgeToBand(childAge) : "";
      var note = $("log-note").value.trim().slice(0, 2000);
      state.logs.push(touch({
        id: uid(),
        childId: chosenId,
        date: dateValue,
        context: kind,
        title: title,
        childAge: childAge,
        ageBand: ageBand,
        note: note
      }));
      save();
      $("log-title").value = "";
      $("log-note").value = "";
      renderLogs();
      renderSummary();
      var shareStatus = $("log-share-status");
      function showShareStatus(text, isError) {
        if (!shareStatus) return;
        shareStatus.hidden = false;
        shareStatus.textContent = text;
        shareStatus.classList.toggle("is-error", !!isError);
      }
      var kindMeta = learningKindById(kind);
      var kindLabel = kindMeta ? kindMeta.label : "";
      if (childAge === "" || childAge == null || !Number.isFinite(Number(childAge))) {
        showShareStatus("已記錄在這部瀏覽器。未有年齡，所以沒有送到公開清單。", true);
        return;
      }
      var submitBtn = ev.target.querySelector("button[type='submit']");
      if (submitBtn) submitBtn.disabled = true;
      var shareUrl = PUBLIC_EXEC + "?action=add&age=" + encodeURIComponent(String(childAge)) +
        "&kind=" + encodeURIComponent(kindLabel) +
        "&title=" + encodeURIComponent(title) +
        "&t=" + Date.now();
      fetch(shareUrl, { cache: "no-store" })
        .then(function (r) { if (!r.ok) throw new Error("bad"); return r.json(); })
        .then(function (data) {
          if (!data || data.ok !== true) throw new Error("bad");
          showShareStatus("已記錄，並已送到公開清單。", false);
          if (submitBtn) submitBtn.disabled = false;
          initPublicShares();
        })
        .catch(function () {
          showShareStatus("已記錄在這部瀏覽器，但未能送到公開清單。", true);
          if (submitBtn) submitBtn.disabled = false;
        });
    });

    on("filter-child", "change", function () {
      var sel = $("filter-child");
      logChild = sel ? sel.value : "all";
      renderLogs();
    });
    on("filter-context", "change", function () {
      var sel = $("filter-context");
      logContext = sel ? sel.value : "all";
      renderLogs();
    });
    on("more-logs", "click", function () {
      logLimit += 20;
      renderLogs();
    });
    on("log-list", "click", function (ev) {
      var btn = ev.target.closest("[data-del-log]");
      if (!btn) return;
      var id = btn.getAttribute("data-del-log");
      state.logs = state.logs.filter(function (l) { return l.id !== id; });
      save();
      renderLogs();
      renderSummary();
    });

    on("export-btn", "click", exportData);
    bindSync();
    on("import-btn", "click", function () {
      var input = $("import-file");
      if (input) input.click();
    });
    on("import-file", "change", function () {
      var importInput = $("import-file");
      if (!importInput) return;
      var file = importInput.files && importInput.files[0];
      importInput.value = "";
      if (!file) return;
      var reader = new FileReader();
      reader.onload = function () {
        var data;
        try { data = JSON.parse(String(reader.result)); }
        catch (e) { alert("這個檔案不是可讀的 JSON。"); return; }
        if (!data || (!data.children && !data.logs && !data.personalCards)) {
          alert("檔案裡沒有小孩、紀錄或個人卡片。");
          return;
        }
        var mode = confirm("按「確定」：合併。保留現有資料，只加入檔案裡尚未存在的項目。\n按「取消」之後會再詢問是否取代。");
        if (mode) {
          mergeImport(data);
        } else if (confirm("取代這部瀏覽器裡的全部私人資料？現有小孩、紀錄及自行新增的卡片會被檔案覆蓋。內建資訊卡不受影響。")) {
          replaceImport(data);
        } else {
          return;
        }
        save();
        renderTags();
        renderCards();
        renderChildren();
      };
      reader.readAsText(file);
    });
  }

  function start(data) {
    seed = (data && data.cards) || [];
    loadCommunityIndex().then(function (index) {
      return loadCommunityCards((index && index.files) || []);
    }).then(function (cards) {
      communityCards = cards;
      bind();
      renderAges();
      renderTags();
      renderCards();
      fetchCardVotes();
      renderChildren();
      initPublicShares();
      if (location.hash === "#info") setMode("public");
      else setMode("private");
    });
  }

  fetch("cards.json", { cache: "no-store" })
    .then(function (r) { if (!r.ok) throw new Error("bad"); return r.json(); })
    .then(start)
    .catch(function () {
      $("card-list").innerHTML = "<p class='empty'>讀不到 cards.json。請以網站方式打開這個資料夾，而不是把個別檔案拆開。</p>";
      bind();
      renderAges();
      renderChildren();
      initPublicShares();
      if (location.hash === "#info") setMode("public");
      else setMode("private");
    });
})();
