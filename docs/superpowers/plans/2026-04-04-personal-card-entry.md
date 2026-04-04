# Personal Card Entry Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将首页从博客列表改造成移动端优先的个人名片入口页，保留文章页不受影响。

**Architecture:** 首页直接重写为单页名片结构，使用现有静态 HTML/CSS/JS 技术栈完成。`index.html` 负责新语义结构，`css/style.css` 以首页专属类重建视觉系统并保留文章页样式，`js/main.js` 移除文章筛选逻辑，仅保留安全的轻量交互。

**Tech Stack:** HTML5, CSS3, 原生 JavaScript, Python `http.server` 用于本地验证, `agent-browser` 用于截图验证

---

## File Structure

- Modify: `index.html`
  - 重建首页 DOM，从“文章导向”切换为“名片 + 联系信息 + 入口卡片”
- Modify: `css/style.css`
  - 为首页引入新的冷色系视觉变量、版式、卡片、按钮、移动端断点
  - 保留并兼容文章页相关样式
- Modify: `js/main.js`
  - 删除文章筛选逻辑
  - 保留年份更新和 reveal 动画
  - 可选增加轻量复制/平滑交互，但不引入依赖
- Verify: `http://127.0.0.1:<port>/`
  - 桌面与移动截图验证

### Task 1: 重建首页 HTML 结构

**Files:**
- Modify: `index.html`

- [ ] **Step 1: 写出结构预期并对照现有首页确认要删除的区块**

目标结构应类似下面这段骨架，旧的 `最新文章`、`关于我`、`联系` 长区块需要整体移除：

```html
<body class="home-page">
  <header class="topbar">
    <div class="container topbar-inner">
      <a class="brand-mark" href="index.html">青玉白露</a>
      <a class="lang-pill" href="https://example.com" target="_blank" rel="noopener">EN</a>
    </div>
  </header>

  <main class="card-home">
    <section class="intro-shell reveal">
      <div class="avatar-orb">QY</div>
      <p class="intro-kicker">PERSONAL CARD</p>
      <h1>青玉白露</h1>
      <p class="intro-alias">whitedew / AI builder</p>
      <p class="intro-summary">...</p>
    </section>

    <section class="meta-grid reveal">...</section>
    <section class="entry-list reveal">...</section>
  </main>

  <footer class="site-footer">...</footer>
</body>
```

- [ ] **Step 2: 直接替换首页主内容为名片入口结构**

将 `index.html` 首页 `<main>` 改成下面这类结构，所有链接先保留 mock 值：

```html
<main class="card-home">
  <section class="intro-shell reveal" id="about">
    <div class="avatar-orb" aria-hidden="true">QY</div>
    <p class="intro-kicker">PERSONAL CARD</p>
    <h1>青玉白露</h1>
    <p class="intro-alias">whitedew · AI 产品化 / 工程化</p>
    <p class="intro-summary">
      我关注 AI 产品、Agent、RAG 与实际落地，把复杂能力整理成更易理解、可执行的入口。
    </p>
  </section>

  <section class="meta-grid reveal" aria-label="联系方式">
    <a class="meta-item" href="https://example.com/wechat" target="_blank" rel="noopener">
      <span class="meta-label">微信</span>
      <strong>whitedewstory</strong>
    </a>
    <a class="meta-item" href="mailto:hello@example.com">
      <span class="meta-label">邮箱</span>
      <strong>hello@example.com</strong>
    </a>
    <div class="meta-item">
      <span class="meta-label">城市</span>
      <strong>成都</strong>
    </div>
    <a class="meta-item" href="https://example.com/github" target="_blank" rel="noopener">
      <span class="meta-label">GitHub</span>
      <strong>@whitedew</strong>
    </a>
  </section>

  <section class="entry-list reveal" id="links">
    <a class="entry-card" href="https://example.com/blog" target="_blank" rel="noopener">
      <span class="entry-icon">01</span>
      <span class="entry-copy">
        <strong>AI 见闻</strong>
        <span>AI 领域的教程以及自我实践</span>
      </span>
      <span class="entry-arrow" aria-hidden="true">↗</span>
    </a>
  </section>
</main>
```

- [ ] **Step 3: 运行静态检查，确认 HTML 没有遗漏闭合标签**

Run: `python3 - <<'PY'\nfrom html.parser import HTMLParser\nHTMLParser().feed(open('index.html', encoding='utf-8').read())\nprint('html-parse-ok')\nPY`

Expected: 输出 `html-parse-ok`

### Task 2: 重写首页视觉样式并保留文章页样式

**Files:**
- Modify: `css/style.css`

- [ ] **Step 1: 写出首页新变量和新的页面级类名，避免误伤文章页**

首页样式应围绕新类名展开，例如：

```css
:root {
  --bg: #0b1220;
  --bg-soft: #111a2b;
  --panel: rgba(10, 16, 28, 0.72);
  --panel-strong: #111827;
  --text: #e8eef9;
  --muted: #94a3b8;
  --line: rgba(148, 163, 184, 0.18);
  --accent: #7dd3fc;
  --accent-strong: #38bdf8;
  --glow: 0 24px 60px rgba(8, 15, 30, 0.42);
}

body.home-page { ... }
.card-home { ... }
.intro-shell { ... }
.meta-grid { ... }
.entry-card { ... }
```

- [ ] **Step 2: 删除或停用首页旧布局样式，改为名片式居中布局**

将旧的 `.hero`、`.filters`、`.post-grid`、`.contact-card` 等首页主样式替换为下面这类布局：

```css
.card-home {
  width: min(680px, calc(100% - 2rem));
  margin: 0 auto;
  padding: 4.5rem 0 3rem;
}

.intro-shell,
.meta-grid,
.entry-list {
  position: relative;
  z-index: 1;
}

.intro-shell {
  text-align: center;
  padding: 2.25rem 1.5rem 1.25rem;
}

.meta-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.85rem;
  margin-top: 1.25rem;
}

.entry-list {
  display: grid;
  gap: 0.9rem;
  margin-top: 1.4rem;
}
```

- [ ] **Step 3: 实现深色卡片与男性向冷色氛围**

入口卡片和头像区至少应包含如下视觉规则：

```css
.entry-card {
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.05rem;
  border-radius: 22px;
  border: 1px solid var(--line);
  background: linear-gradient(180deg, rgba(17, 24, 39, 0.94), rgba(15, 23, 42, 0.82));
  box-shadow: var(--glow);
}

.entry-card:hover {
  transform: translateY(-2px);
  border-color: rgba(125, 211, 252, 0.34);
}

.avatar-orb {
  width: 92px;
  height: 92px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  background: radial-gradient(circle at 30% 30%, #38bdf8, #111827 72%);
}
```

- [ ] **Step 4: 写移动端断点，优先解决导航和卡片点击问题**

至少加入以下响应式规则：

```css
@media (max-width: 768px) {
  .topbar-inner {
    min-height: 58px;
  }

  .meta-grid {
    grid-template-columns: 1fr;
  }

  .entry-card {
    grid-template-columns: 1fr auto;
  }

  .entry-icon {
    display: none;
  }
}

@media (max-width: 480px) {
  .card-home {
    width: min(100%, calc(100% - 1rem));
    padding-top: 3.25rem;
  }

  .intro-shell {
    padding-inline: 1rem;
  }
}
```

- [ ] **Step 5: 检查文章页关键类是否仍保留**

Run: `rg -n "post-page|post-layout|reading-progress|back-link" css/style.css`

Expected: 输出中仍能找到文章页样式定义

### Task 3: 清理首页脚本逻辑

**Files:**
- Modify: `js/main.js`

- [ ] **Step 1: 删除文章筛选逻辑，保留安全脚本最小集合**

将脚本收敛为下面这种结构：

```js
const yearEl = document.querySelector("#year");
if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}

const revealNodes = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window && revealNodes.length > 0) {
  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.16 }
  );

  revealNodes.forEach((node) => observer.observe(node));
} else {
  revealNodes.forEach((node) => node.classList.add("visible"));
}

const progressBar = document.querySelector("[data-reading-progress]");
if (progressBar) {
  // 保留文章页阅读进度
}
```

- [ ] **Step 2: 运行脚本检视，确保不再引用 `.filter-btn` 或 `.post-card`**

Run: `rg -n "filter-btn|post-card" js/main.js`

Expected: 无输出

### Task 4: 本地验证首页与移动端

**Files:**
- Verify: `index.html`
- Verify: `css/style.css`
- Verify: `js/main.js`

- [ ] **Step 1: 启动本地静态服务**

Run: `python3 -m http.server 4173`

Expected: 输出 `Serving HTTP on ... 4173`

- [ ] **Step 2: 采集桌面端截图**

Run: `agent-browser set viewport 1440 1100 2 && agent-browser open http://127.0.0.1:4173 && agent-browser wait --load networkidle && agent-browser screenshot ./.tmp-shots/personal-card-desktop.png`

Expected: 截图生成成功，首屏展示头像、简介、联系方式和入口卡片

- [ ] **Step 3: 采集移动端截图**

Run: `agent-browser set device "iPhone 14" && agent-browser open http://127.0.0.1:4173 && agent-browser wait --load networkidle && agent-browser screenshot ./.tmp-shots/personal-card-mobile.png`

Expected: 截图生成成功，无导航拥挤、无横向滚动

- [ ] **Step 4: 检查控制台与页面结构**

Run: `agent-browser snapshot -i`

Expected: 可见主入口卡片的交互元素，无异常空白区块

- [ ] **Step 5: 停止本地服务并整理结果**

执行后应确认：

```text
- 首页已从博客首页切换为个人名片入口页
- 文章页样式未被破坏
- 移动端截图通过
```

## Self-Review

- Spec coverage: 已覆盖首页结构重建、视觉风格替换、mock 链接、移动端优先和验证步骤
- Placeholder scan: 计划中的 mock 链接是显式占位策略，不是未定事项；不存在 TBD/TODO
- Type consistency: `intro-shell`、`meta-grid`、`entry-list`、`entry-card` 等命名在各任务中保持一致
