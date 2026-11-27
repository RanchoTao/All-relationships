/* global DATA */
(() => {
  "use strict";

  // Leave blank until an operator has configured and verified the intended project.
  const SUPABASE_URL = "";
  const SUPABASE_PUBLISHABLE_KEY = "";
  const OPERATOR_EMAIL = "";

  const SDK_URL = "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.119.2/dist/umd/supabase.js";
  const SDK_INTEGRITY = "sha384-A97u3Qnt9GZHURO9YJZRe7VQgGUeFzcv6I1oIGnUTxQrCxnpQMwR0/G8F2zt9abZ";
  const COOLDOWN_KEY = "dwm-compass-listing:last-submit";
  const COOLDOWN_MS = 60_000;
  const RELATION_ID = /^A[0-9]{2}-[0-9]{3}$/;
  const CONTACT_TYPES = new Set(["wechat", "phone", "email"]);
  const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const mount = document.getElementById("compass-listing");
  const results = document.getElementById("results");
  const app = document.getElementById("app");
  if (!mount || !results || !app || typeof DATA === "undefined" || !Array.isArray(DATA.cards)) return;

  const stylesheet = document.createElement("link");
  stylesheet.rel = "stylesheet";
  stylesheet.href = new URL("./listing.css", document.currentScript.src).href;
  document.head.append(stylesheet);

  function isPublicKey(key) {
    if (/^sb_publishable_[\w-]+$/.test(key)) return true;
    try {
      if (!/^[\w-]+\.[\w-]+\.[\w-]+$/.test(key)) return false;
      const payload = key.split(".")[1].replaceAll("-", "+").replaceAll("_", "/");
      return JSON.parse(atob(payload)).role === "anon";
    } catch {
      return false;
    }
  }

  function isConfigured() {
    try {
      const url = new URL(SUPABASE_URL);
      return url.protocol === "https:" && !url.username && !url.password &&
        url.pathname === "/" && !url.search && !url.hash &&
        isPublicKey(SUPABASE_PUBLISHABLE_KEY) && EMAIL.test(OPERATOR_EMAIL);
    } catch {
      return false;
    }
  }

  const configured = isConfigured();
  const cardByKey = new Map(DATA.cards.map((card) => [card.key, card]));
  let choices = [];
  let submitting = false;
  let lastSubmit = 0;
  let clientPromise;

  function candidates() {
    // The stack is rendered back to front. Keep its actual order and, if the
    // stack is depleted, fill the available places from cards the user kept.
    const stack = Array.from(results.querySelectorAll("#stack .rc[data-k]:not(.yes):not(.no)")).reverse();
    const kept = results.querySelectorAll(".mine [data-un]");
    const found = new Map();
    for (const element of [...stack, ...kept]) {
      const card = cardByKey.get(element.dataset.k ?? element.dataset.un);
      // Only listing-eligible cards leave the device. Sexual preferences and
      // cards marked "仅供了解" are outside this form.
      if (!card || card.adult || card.status !== "match" || card.key === "ace-romance") continue;
      const id = card.wiki?.id ?? card.members?.[0]?.id;
      if (RELATION_ID.test(id) && !found.has(id)) found.set(id, card.name);
      if (found.size === 3) break;
    }
    return [...found].map(([id, name]) => ({ id, name }));
  }

  mount.innerHTML = `
    <div class="cl-entry">
      <div><h2>挂出我的需求</h2><p>由运营者人工查看，不会显示在公开列表。</p></div>
      <button type="button" class="cl-primary" data-open>挂出我的需求</button>
    </div>
    <p class="cl-hint" data-availability></p>
    <dialog class="cl-dialog" aria-labelledby="cl-title">
      <header class="cl-header">
        <h2 id="cl-title">挂出我的需求</h2>
        <button type="button" class="cl-close" aria-label="关闭表单" data-close>×</button>
      </header>
      <p class="cl-hint">公开描述不会展示在网站上。联系方式仅供运营者联系你。</p>
      <form novalidate>
        <fieldset class="cl-fields">
          <label>想优先建立的关系
            <select name="primary_relation" required></select>
          </label>
          <div class="cl-bottom">
            <p id="cl-bottom-help">只写真正不能让步的，最多两条。</p>
            <label>底线 1 <span>（可选，60 字以内）</span>
              <input name="bottom_1" maxlength="60" aria-describedby="cl-bottom-help" />
            </label>
            <label>底线 2 <span>（可选，60 字以内）</span>
              <input name="bottom_2" maxlength="60" aria-describedby="cl-bottom-help" />
            </label>
          </div>
          <label>城市 <span>（30 字以内）</span>
            <input name="city" maxlength="30" required />
          </label>
          <label>联系方式类型
            <select name="contact_type">
              <option value="wechat">微信号</option>
              <option value="phone">手机号</option>
              <option value="email">邮箱</option>
            </select>
          </label>
          <label>联系方式 <span>（100 字以内）</span>
            <input name="contact" maxlength="100" required />
          </label>
          <label>公开描述 <span>（可选，80 字以内）</span>
            <textarea name="public_note" maxlength="80" rows="2"></textarea>
          </label>
          <p class="cl-hint">底线和公开描述里请勿填写姓名、联系方式或健康、私生活、负债、证件号等信息。</p>
          <div class="cl-trap" aria-hidden="true" inert>
            <label>请留空 <input name="company_website" tabindex="-1" autocomplete="off" /></label>
          </div>
          <label class="cl-check"><input type="checkbox" name="is_adult" required />我已满 18 周岁</label>
          <label class="cl-check"><input type="checkbox" name="consent" required />我已阅读并同意隐私说明（含境外存储）</label>
        </fieldset>
        <details class="cl-privacy">
          <summary>隐私说明</summary>
          <p>我们收集前三张候选关系编号、你选定的关系、底线、城市、公开描述、联系方式及两项确认，仅用于人工撮合。不会上传罗盘答题记录。</p>
          <p>数据存放在 Supabase 境外服务器。只有运营者本人可以通过运营后台查阅，不会公开或出售。人工撮合时可向潜在对方展示你主动填写的匿名公开描述；交换联系方式前会分别征得双方同意。</p>
          <p>需要删除时，请发邮件到 <span data-operator></span>。运营者收到后 7 天内删除。未满 18 周岁请勿提交。</p>
        </details>
        <button type="submit" class="cl-primary">确认挂出</button>
        <p class="cl-message" role="status" aria-live="polite"></p>
      </form>
      <p class="cl-success" role="status" tabindex="-1" hidden></p>
    </dialog>`;

  const dialog = mount.querySelector("dialog");
  const opener = mount.querySelector("[data-open]");
  const availability = mount.querySelector("[data-availability]");
  const form = mount.querySelector("form");
  const fields = form.querySelector("fieldset");
  const select = form.elements.namedItem("primary_relation");
  const trap = form.elements.namedItem("company_website");
  const submit = form.querySelector('[type="submit"]');
  const message = form.querySelector(".cl-message");
  const success = dialog.querySelector(".cl-success");
  const operator = form.querySelector("[data-operator]");
  if (configured) {
    const link = document.createElement("a");
    link.href = `mailto:${OPERATOR_EMAIL}`;
    link.textContent = OPERATOR_EMAIL;
    operator.append(link);
  } else {
    operator.textContent = "【运营者邮箱，待填】";
  }

  function sync() {
    mount.hidden = !app.classList.contains("res");
    if (mount.hidden && dialog.open && !submitting) dialog.close();
    const hasChoices = candidates().length > 0;
    opener.disabled = !hasChoices;
    availability.textContent = hasChoices ? "" : "目前没有可挂出的候选关系。你可以返回调整答案。";
  }
  sync();
  new MutationObserver(sync).observe(results, { childList: true });
  new MutationObserver(sync).observe(app, { attributes: true, attributeFilter: ["class"] });

  function remaining() {
    let saved = 0;
    try { saved = Number(localStorage.getItem(COOLDOWN_KEY)) || 0; } catch { /* storage unavailable */ }
    return Math.max(0, Math.min(COOLDOWN_MS, Math.max(lastSubmit, saved) + COOLDOWN_MS - Date.now()));
  }

  opener.addEventListener("click", () => {
    choices = candidates();
    if (!choices.length) return;
    form.reset();
    form.hidden = false;
    success.hidden = true;
    success.textContent = "";
    select.replaceChildren(...choices.map(({ id, name }) => new Option(name, id)));
    fields.disabled = !configured;
    submit.disabled = !configured;
    const seconds = Math.ceil(remaining() / 1_000);
    message.textContent = !configured ? "暂未开放提交。" :
      seconds ? `请等待 ${seconds} 秒后再提交。` : "";
    dialog.showModal();
  });

  const close = dialog.querySelector("[data-close]");
  close.addEventListener("click", () => { if (!submitting) dialog.close(); });
  dialog.addEventListener("cancel", (event) => { if (submitting) event.preventDefault(); });
  dialog.addEventListener("close", () => {
    form.reset();
    message.textContent = "";
  });

  function getClient() {
    if (!clientPromise) {
      clientPromise = new Promise((resolve, reject) => {
        const script = document.createElement("script");
        script.src = SDK_URL;
        script.integrity = SDK_INTEGRITY;
        script.crossOrigin = "anonymous";
        script.referrerPolicy = "no-referrer";
        script.onload = () => {
          script.remove();
          try {
            resolve(window.supabase.createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
              auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
            }));
          } catch (error) { reject(error); }
        };
        script.onerror = () => {
          script.remove();
          reject(new Error("Supabase SDK could not load"));
        };
        document.head.append(script);
      }).catch((error) => {
        clientPromise = undefined;
        throw error;
      });
    }
    return clientPromise;
  }

  function readSubmission() {
    const data = new FormData(form);
    const rawText = (name) => String(data.get(name) ?? "");
    const text = (name, max, label, required = false) => {
      const raw = rawText(name);
      const value = raw.trim();
      if (Array.from(raw).length > max) throw new Error(`${label}不能超过 ${max} 字。`);
      if (required && !value) throw new Error(`请填写${label}。`);
      return value;
    };
    const relations = choices.map(({ id }) => id);
    const primary = rawText("primary_relation");
    if (!relations.includes(primary)) throw new Error("请从当前候选中选择一种关系。");
    const type = rawText("contact_type");
    if (!CONTACT_TYPES.has(type)) throw new Error("请选择联系方式类型。");
    const bottomLines = [text("bottom_1", 60, "底线 1"), text("bottom_2", 60, "底线 2")].filter(Boolean);
    const city = text("city", 30, "城市", true);
    const contact = text("contact", 100, "联系方式", true);
    if (type === "email" && !EMAIL.test(contact)) throw new Error("请填写有效的邮箱地址。");
    const note = text("public_note", 80, "公开描述");
    if (!data.has("is_adult")) throw new Error("请确认你已满 18 周岁。");
    if (!data.has("consent")) throw new Error("请阅读并同意隐私说明。");
    return {
      relations, primary_relation: primary, bottom_lines: bottomLines, city,
      public_note: note || null, contact_type: type, contact, is_adult: true, consent: true,
    };
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (submitting || !configured || trap.value) return;
    const seconds = Math.ceil(remaining() / 1_000);
    if (seconds) {
      message.textContent = `请等待 ${seconds} 秒后再提交。`;
      return;
    }
    let payload;
    try {
      payload = readSubmission();
    } catch (error) {
      message.textContent = error.message;
      return;
    }

    submitting = true;
    fields.disabled = true;
    submit.disabled = true;
    close.disabled = true;
    message.textContent = "正在提交…";
    try {
      const client = await getClient();
      const { error } = await client.from("listings").insert(payload);
      if (error) throw error;
      lastSubmit = Date.now();
      try { localStorage.setItem(COOLDOWN_KEY, String(lastSubmit)); } catch { /* storage unavailable */ }
      form.reset();
      select.replaceChildren();
      choices = [];
      form.hidden = true;
      success.hidden = false;
      success.textContent = "已匿名挂出。找到报价对上的人时，我们会先分别征得双方同意，再交换联系方式。";
      success.focus();
    } catch {
      message.textContent = "暂时无法提交，请稍后重试。";
    } finally {
      submitting = false;
      fields.disabled = false;
      submit.disabled = false;
      close.disabled = false;
      sync();
    }
  });
})();
