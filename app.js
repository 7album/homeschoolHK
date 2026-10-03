(function () {
  "use strict";

  var KEY = "homeschool-hk-private-v1";
  var DIARY_AREAS = [
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
        { id: "social-peer", label: "與同齡小朋友" },
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
  var INTENSITY = [
    { id: "", label: "可不填" },
    { id: "light", label: "輕微" },
    { id: "usual", label: "普通" },
    { id: "strong", label: "明顯" }
  ];
  var AGE_BANDS = ["0–6", "6–12", "12–18", ">18"];
  var GITHUB_REPO = "7album/homeschoolHK";
  var GITHUB_BRANCH = "main";

  var seed = [];
  var communityCards = [];
  var activeTopics = [];
  var activeAges = [];
  var query = "";
  var logChild = "all";
  var logContext = "all";
  var logLimit = 20;
  var summaryChild = "";
  var summaryArea = "sleep";
  var logPickArea = "sleep";
  var logPickKind = "";

  function $(id) { return document.getElementById(id); }

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
        { id: "child-older", name: "姐姐", note: "請改為實際出生月份或備註。" },
        { id: "child-younger", name: "妹妹", note: "請改為實際出生月份或備註。" }
      ],
      logs: [],
      personalCards: []
    };
  }

  function diaryKindById(kindId) {
    for (var a = 0; a < DIARY_AREAS.length; a++) {
      var kinds = DIARY_AREAS[a].kinds;
      for (var k = 0; k < kinds.length; k++) {
        if (kinds[k].id === kindId) return { area: DIARY_AREAS[a], kind: kinds[k] };
      }
    }
    return null;
  }

  function diaryAreaById(areaId) {
    for (var i = 0; i < DIARY_AREAS.length; i++) {
      if (DIARY_AREAS[i].id === areaId) return DIARY_AREAS[i];
    }
    return null;
  }

  function normalizeContext(value) {
    var v = value == null ? "" : String(value).trim();
    if (!v) return "other-misc";
    if (diaryKindById(v)) return v;
    var top = LEGACY_CONTEXT[v] || (LEGACY_TOP_TO_KIND[v] ? v : "");
    if (top && LEGACY_TOP_TO_KIND[top]) return LEGACY_TOP_TO_KIND[top];
    return "other-misc";
  }

  function load() {
    try {
      var raw = localStorage.getItem(KEY);
      if (!raw) return defaultState();
      var data = JSON.parse(raw);
      if (!data || data.version !== 1) return defaultState();
      data.children = Array.isArray(data.children) ? data.children : [];
      data.logs = Array.isArray(data.logs) ? data.logs.map(function (log) {
        var copy = {};
        for (var k in log) if (Object.prototype.hasOwnProperty.call(log, k)) copy[k] = log[k];
        copy.context = normalizeContext(log.context);
        return copy;
      }) : [];
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
    var normalized = normalizeContext(id);
    var hit = diaryKindById(normalized);
    if (hit) return hit.kind.label;
    return String(id == null ? "" : id);
  }

  function contextAreaLabel(id) {
    var normalized = normalizeContext(id);
    var hit = diaryKindById(normalized);
    return hit ? hit.area.label : "";
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

  function renderSeedCard(card) {
    var paras = (card.paragraphs || []).map(function (p) { return "<p>" + esc(p) + "</p>"; }).join("");
    return "<article class='card'>" +
      chipRow(card.ages, card.tags) +
      "<h2>" + esc(card.title) + "</h2>" +
      paras +
      sourceList(card.sources) +
      "</article>";
  }

  function renderPersonalCard(card) {
    var href = safeUrl(card.url);
    var link = href ? "<p><a href='" + esc(href) + "' rel='noopener noreferrer'>" + esc(href) + "</a></p>" : "";
    return "<article class='card' data-id='" + esc(card.id) + "'>" +
      chipRow(card.ages, card.tags, "<span class='badge mine'>自行新增 · 只在這部瀏覽器</span>") +
      "<h2>" + esc(card.title) + "</h2>" +
      "<p>" + esc(card.summary || "") + "</p>" +
      link +
      "<div class='actions'><button type='button' class='danger' data-del-card='" + esc(card.id) + "'>刪除這張</button></div>" +
      "</article>";
  }

  function renderCommunityCard(card) {
    var href = safeUrl(card.url);
    var link = href ? "<p><a href='" + esc(href) + "' rel='noopener noreferrer'>" + esc(href) + "</a></p>" : "";
    return "<article class='card' data-community-id='" + esc(card.id) + "'>" +
      chipRow(card.ages, card.tags, "<span class='badge'>社區建議 · 已公開</span>") +
      "<h2>" + esc(card.title) + "</h2>" +
      "<p>" + esc(card.summary || "") + "</p>" +
      link +
      "</article>";
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
    var html = personal.map(renderPersonalCard).join("") +
      community.map(renderCommunityCard).join("") +
      official.map(renderSeedCard).join("");
    $("card-list").innerHTML = html || "<p class='empty'>沒有符合的卡片。可改用其他字詞，或取消年齡與主題篩選再試。</p>";
    $("card-count").textContent = String(personal.length + community.length + official.length);
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

  function refreshChildSelects() {
    var kids = state.children.map(function (c) { return { id: c.id, name: c.name }; });
    fillSelect($("log-child"), kids, null);
    fillSelect($("filter-child"), kids, { value: "all", label: "全部小朋友" });
    fillSelect($("summary-child"), kids, null);
    if (summaryChild && childById(summaryChild)) $("summary-child").value = summaryChild;
    else if (state.children[0]) {
      summaryChild = state.children[0].id;
      $("summary-child").value = summaryChild;
    }
    if (logChild !== "all" && childById(logChild)) $("filter-child").value = logChild;
    else logChild = "all";
  }

  function renderChildren() {
    var host = $("child-list");
    if (!state.children.length) {
      host.innerHTML = "<p class='empty'>尚未有小朋友。下方可以新增一位。紀錄仍然只留在這部瀏覽器。</p>";
    } else {
      host.innerHTML = state.children.map(function (c) {
        return "<article class='child'>" +
          "<h3><label class='field'>稱呼<input data-child-name='" + esc(c.id) + "' type='text' value='" + esc(c.name) + "' maxlength='40'></label></h3>" +
          "<label class='field'>年齡或出生備註<textarea data-child-note='" + esc(c.id) + "' maxlength='240'>" + esc(c.note || "") + "</textarea></label>" +
          "<div class='actions'><button type='button' class='danger' data-del-child='" + esc(c.id) + "'>移除此人（連同其紀錄）</button></div>" +
          "</article>";
      }).join("");
    }
    refreshChildSelects();
    fillSummaryAreaSelect();
    renderSummary();
    renderLogs();
  }

  function renderLogs() {
    var rows = state.logs.filter(function (log) {
      if (logChild !== "all" && log.childId !== logChild) return false;
      if (logContext !== "all" && normalizeContext(log.context) !== logContext) return false;
      return true;
    }).sort(function (a, b) {
      if (a.date !== b.date) return a.date < b.date ? 1 : -1;
      return String(a.id) < String(b.id) ? 1 : -1;
    });
    $("log-count").textContent = String(rows.length);
    var shown = rows.slice(0, logLimit);
    if (!shown.length) {
      $("log-list").innerHTML = "<p class='empty'>未有符合的紀錄。記下一件今日的小事即可，例如進食分量、在何處玩耍、有沒有看着你說一句話。</p>";
    } else {
      $("log-list").innerHTML = shown.map(function (log) {
        var child = childById(log.childId);
        var extra = [];
        if (log.intensity) extra.push(intensityLabel(log.intensity));
        if (log.durationMin) extra.push(String(log.durationMin) + " 分鐘");
        var areaLbl = contextAreaLabel(log.context);
        var kindLbl = contextLabel(log.context);
        var title = areaLbl ? areaLbl + " · " + kindLbl : kindLbl;
        return "<article class='log'>" +
          "<div class='log-head'><h3>" + esc(child ? child.name : "（已移除的小朋友）") + " · " + esc(title) + "</h3>" +
          "<time datetime='" + esc(log.date) + "'>" + esc(log.date) + "</time></div>" +
          (extra.length ? "<p class='intensity'>" + esc(extra.join(" · ")) + "</p>" : "") +
          "<p>" + esc(log.note || "") + "</p>" +
          "<div class='actions'><button type='button' class='danger' data-del-log='" + esc(log.id) + "'>刪除這則</button></div>" +
          "</article>";
      }).join("");
    }
    $("more-logs").hidden = rows.length <= logLimit;
  }

  function renderSummary() {
    var host = $("summary");
    var child = childById($("summary-child").value || summaryChild);
    if (!child) {
      host.innerHTML = "<p class='empty'>新增一位小朋友之後，這裡會顯示最近14日、在所選範圍內各種具體日常有多少則紀錄。這些數字只是記下的次數，不是發展評估。</p>";
      return;
    }
    summaryChild = child.id;
    var end = todayISO();
    var startDate = new Date(end + "T12:00:00");
    startDate.setDate(startDate.getDate() - 13);
    var localStart = new Date(startDate.getTime() - startDate.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
    var area = diaryAreaById(summaryArea) || DIARY_AREAS[0];
    summaryArea = area.id;
    var counts = {};
    area.kinds.forEach(function (k) { counts[k.id] = 0; });
    state.logs.forEach(function (log) {
      if (log.childId !== child.id) return;
      if (log.date < localStart || log.date > end) return;
      var ctx = normalizeContext(log.context);
      if (counts[ctx] == null) return;
      counts[ctx] += 1;
    });
    var max = 1;
    area.kinds.forEach(function (k) { if (counts[k.id] > max) max = counts[k.id]; });
    host.innerHTML = "<p><strong>" + esc(child.name) + "</strong> · " + esc(localStart) + " 至 " + esc(end) + " · " + esc(area.label) + "</p>" +
      "<p class='intensity'>同一範圍內各種具體種類的則數，方便對照；不是分數，亦不是與其他小朋友比較。</p>" +
      area.kinds.map(function (k) {
        var n = counts[k.id] || 0;
        var w = Math.round((n / max) * 100);
        return "<div class='bar-row'><span class='bar-label'>" + esc(k.label) + "</span>" +
          "<span class='bar-track'><span class='bar-fill' style='width:" + w + "%'></span></span>" +
          "<span class='bar-count'>" + n + "</span></div>";
      }).join("");
  }

  function renderLogKindPicker() {
    var areaHost = $("log-area-pick");
    var kindHost = $("log-kind-pick");
    if (!areaHost || !kindHost) return;
    areaHost.innerHTML = DIARY_AREAS.map(function (a) {
      var pressed = a.id === logPickArea ? "true" : "false";
      return "<button type='button' class='kind-chip' data-log-area='" + esc(a.id) + "' aria-pressed='" + pressed + "'>" + esc(a.label) + "</button>";
    }).join("");
    var area = diaryAreaById(logPickArea) || DIARY_AREAS[0];
    logPickArea = area.id;
    if (!area.kinds.some(function (k) { return k.id === logPickKind; })) logPickKind = "";
    kindHost.innerHTML = area.kinds.map(function (k) {
      var pressed = k.id === logPickKind ? "true" : "false";
      return "<button type='button' class='kind-chip' data-log-kind='" + esc(k.id) + "' aria-pressed='" + pressed + "'>" + esc(k.label) + "</button>";
    }).join("");
    $("log-context").value = logPickKind;
  }

  function fillContextFilter() {
    var select = $("filter-context");
    var current = select.value;
    select.innerHTML = "<option value='all'>全部</option>";
    DIARY_AREAS.forEach(function (area) {
      var group = document.createElement("optgroup");
      group.label = area.label;
      area.kinds.forEach(function (k) {
        var o = document.createElement("option");
        o.value = k.id;
        o.textContent = k.label;
        group.appendChild(o);
      });
      select.appendChild(group);
    });
    if (current && select.querySelector("option[value='" + CSS.escape(current) + "']")) {
      select.value = current;
    }
  }

  function fillSummaryAreaSelect() {
    var select = $("summary-area");
    if (!select) return;
    var current = select.value;
    select.innerHTML = "";
    DIARY_AREAS.forEach(function (a) {
      var o = document.createElement("option");
      o.value = a.id;
      o.textContent = a.label;
      select.appendChild(o);
    });
    if (current && diaryAreaById(current)) select.value = current;
    else if (diaryAreaById(summaryArea)) select.value = summaryArea;
    else select.value = DIARY_AREAS[0].id;
    summaryArea = select.value;
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
      state.children.push({ id: String(c.id), name: String(c.name || "小朋友").slice(0, 40), note: String(c.note || "").slice(0, 240) });
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
    var ctx = normalizeContext(l.context);
    if (!diaryKindById(ctx)) ctx = "other-misc";
    var intensity = (l.intensity === "light" || l.intensity === "usual" || l.intensity === "strong") ? l.intensity : "";
    var mins = parseInt(l.durationMin, 10);
    return {
      id: String(l.id),
      childId: String(l.childId || ""),
      date: /^\d{4}-\d{2}-\d{2}$/.test(l.date) ? l.date : todayISO(),
      context: ctx,
      note: String(l.note || "").slice(0, 2000),
      intensity: intensity,
      durationMin: (mins > 0 && mins < 10000) ? mins : ""
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

  function githubNewFileUrl(filePath) {
    return "https://github.com/" + GITHUB_REPO + "/new/" + GITHUB_BRANCH + "/" + filePath;
  }

  function githubEditIndexUrl() {
    return "https://github.com/" + GITHUB_REPO + "/edit/" + GITHUB_BRANCH + "/cards/community-index.json";
  }

  function copyText(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(text);
    }
    return new Promise(function (resolve, reject) {
      try {
        var ta = document.createElement("textarea");
        ta.value = text;
        ta.setAttribute("readonly", "");
        ta.style.position = "fixed";
        ta.style.left = "-9999px";
        document.body.appendChild(ta);
        ta.select();
        var ok = document.execCommand("copy");
        ta.remove();
        if (ok) resolve();
        else reject(new Error("copy failed"));
      } catch (e) {
        reject(e);
      }
    });
  }

  function openCommunitySuggest() {
    var form = readSuggestForm();
    if (!form) return;
    var jsonText = JSON.stringify(form.payload, null, 2) + "\n";
    var indexLine = '    "' + form.filePath + '"';
    var prBody = [
      "## 社區資訊卡建議",
      "",
      "請維護者合併前核對內容與來源。",
      "",
      "1. 新增檔案 `" + form.filePath + "`（內容見下方 JSON）。",
      "2. 在 `cards/community-index.json` 的 `files` 陣列加入一行：",
      "```json",
      indexLine,
      "```",
      "",
      "### 卡片 JSON",
      "```json",
      jsonText.trim(),
      "```"
    ].join("\n");
    var hint = $("suggest-card-hint");
    hint.hidden = false;
    window.open(githubNewFileUrl(form.filePath), "_blank", "noopener,noreferrer");
    copyText(jsonText).then(function () {
      hint.textContent = "已複製 JSON。請在 GitHub 編輯器貼上內容，提交到新分支後開立拉取請求；並在 cards/community-index.json 加入此檔路徑（見 README）。檔案：" + form.filePath;
    }).catch(function () {
      hint.textContent = "無法自動複製，請手動複製以下 JSON 後在 GitHub 貼上。檔案：" + form.filePath;
      try {
        window.prompt("請複製以下 JSON，再在 GitHub 編輯器貼上：", jsonText);
      } catch (e) {}
    });
    try {
      sessionStorage.setItem("homeschool-hk-last-suggest-pr-body", prBody);
    } catch (e) {}
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
    state.children = (data.children || []).filter(Boolean).map(function (c) {
      return { id: String(c.id || uid()), name: String(c.name || "小朋友").slice(0, 40), note: String(c.note || "").slice(0, 240) };
    });
    state.logs = (data.logs || []).filter(Boolean).map(cleanLog);
    state.personalCards = (data.personalCards || []).filter(Boolean).map(cleanCard);
  }

  function bind() {
    $("tab-public").addEventListener("click", function () { setMode("public"); });
    $("tab-private").addEventListener("click", function () { setMode("private"); });

    $("search").addEventListener("input", function () {
      query = $("search").value.trim().toLowerCase();
      renderCards();
    });

    $("add-card").addEventListener("submit", function (ev) {
      ev.preventDefault();
      openCommunitySuggest();
    });

    $("card-list").addEventListener("click", function (ev) {
      var btn = ev.target.closest("[data-del-card]");
      if (!btn) return;
      var id = btn.getAttribute("data-del-card");
      if (!confirm("刪除這張自行新增的卡片？內建資料不會受影響。")) return;
      state.personalCards = state.personalCards.filter(function (c) { return c.id !== id; });
      save();
      renderTags();
      renderCards();
    });

    $("child-list").addEventListener("change", function (ev) {
      var name = ev.target.getAttribute("data-child-name");
      var note = ev.target.getAttribute("data-child-note");
      var child = childById(name || note);
      if (!child) return;
      if (name) {
        child.name = ev.target.value.trim().slice(0, 40) || "小朋友";
        ev.target.value = child.name;
      }
      if (note) child.note = ev.target.value.slice(0, 240);
      save();
      refreshChildSelects();
      renderLogs();
      renderSummary();
    });

    $("child-list").addEventListener("click", function (ev) {
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

    $("add-child").addEventListener("submit", function (ev) {
      ev.preventDefault();
      var name = $("new-child-name").value.trim();
      if (!name) return;
      state.children.push({ id: uid(), name: name.slice(0, 40), note: $("new-child-note").value.slice(0, 240) });
      save();
      $("add-child").reset();
      renderChildren();
    });

    renderLogKindPicker();
    fillContextFilter();
    fillSummaryAreaSelect();
    INTENSITY.forEach(function (item) {
      var o = document.createElement("option");
      o.value = item.id;
      o.textContent = item.label;
      $("log-intensity").appendChild(o);
    });
    $("log-date").value = todayISO();

    $("log-area-pick").addEventListener("click", function (ev) {
      var btn = ev.target.closest("[data-log-area]");
      if (!btn) return;
      logPickArea = btn.getAttribute("data-log-area");
      logPickKind = "";
      renderLogKindPicker();
    });
    $("log-kind-pick").addEventListener("click", function (ev) {
      var btn = ev.target.closest("[data-log-kind]");
      if (!btn) return;
      logPickKind = btn.getAttribute("data-log-kind");
      renderLogKindPicker();
    });

    $("add-log").addEventListener("submit", function (ev) {
      ev.preventDefault();
      if (!state.children.length) return;
      var kind = normalizeContext($("log-context").value);
      if (!diaryKindById(kind)) {
        alert("請先點選一種具體日常種類。");
        return;
      }
      var mins = parseInt($("log-mins").value, 10);
      state.logs.push({
        id: uid(),
        childId: $("log-child").value,
        date: $("log-date").value || todayISO(),
        context: kind,
        note: $("log-note").value.trim().slice(0, 2000),
        intensity: $("log-intensity").value,
        durationMin: (mins > 0 && mins < 10000) ? mins : ""
      });
      save();
      $("log-note").value = "";
      $("log-mins").value = "";
      $("log-intensity").value = "";
      renderLogs();
      renderSummary();
    });

    $("filter-child").addEventListener("change", function () {
      logChild = $("filter-child").value;
      renderLogs();
    });
    $("filter-context").addEventListener("change", function () {
      logContext = $("filter-context").value;
      renderLogs();
    });
    $("summary-child").addEventListener("change", function () {
      summaryChild = $("summary-child").value;
      renderSummary();
    });
    $("summary-area").addEventListener("change", function () {
      summaryArea = $("summary-area").value;
      renderSummary();
    });
    $("more-logs").addEventListener("click", function () {
      logLimit += 20;
      renderLogs();
    });
    $("log-list").addEventListener("click", function (ev) {
      var btn = ev.target.closest("[data-del-log]");
      if (!btn) return;
      var id = btn.getAttribute("data-del-log");
      state.logs = state.logs.filter(function (l) { return l.id !== id; });
      save();
      renderLogs();
      renderSummary();
    });

    $("export-btn").addEventListener("click", exportData);
    $("import-btn").addEventListener("click", function () { $("import-file").click(); });
    $("import-file").addEventListener("change", function () {
      var file = $("import-file").files && $("import-file").files[0];
      $("import-file").value = "";
      if (!file) return;
      var reader = new FileReader();
      reader.onload = function () {
        var data;
        try { data = JSON.parse(String(reader.result)); }
        catch (e) { alert("這個檔案不是可讀的 JSON。"); return; }
        if (!data || (!data.children && !data.logs && !data.personalCards)) {
          alert("檔案裡沒有小朋友、紀錄或個人卡片。");
          return;
        }
        var mode = confirm("按「確定」：合併。保留現有資料，只加入檔案裡尚未存在的項目。\n按「取消」之後會再詢問是否取代。");
        if (mode) {
          mergeImport(data);
        } else if (confirm("取代這部瀏覽器裡的全部私人資料？現有小朋友、紀錄及自行新增的卡片會被檔案覆蓋。內建資訊卡不受影響。")) {
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
      renderChildren();
      if (location.hash === "#records") setMode("private");
      else setMode("public");
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
      setMode("public");
    });
})();
