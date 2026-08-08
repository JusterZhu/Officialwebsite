import fs from "node:fs";
import path from "node:path";

const sectionOrder = [
  "about",
  "core-business",
  "product-showcase",
  "case-showcase",
  "releases",
  "contact",
];

const labels = {
  en: {
    heroKicker: "Unlimited Updates, Boundless Upgrades.",
    heroTitle: "Software solutions that keep enterprise systems moving.",
    heroSubtitle:
      "TSLH AI delivers automatic upgrade platforms and custom software engineering for enterprise, industrial, and public-sector scenarios.",
    intro:
      "Unlimited Updates, Boundless Upgrades. Build once, evolve continuously, and let every release reach users with confidence.",
    scroll: "SCROLL DOWN",
    journey: "UPDATE WITHOUT BOUNDARIES",
    inquiry: "Contact TSLH AI",
    footer: "©2025 - 2026 TSLH Technology. Unlimited Updates, Boundless Upgrades.",
    nav: [
      ["About", "#about"],
      ["Business", "#core-business"],
      ["Products", "#product-showcase"],
      ["Cases", "#case-showcase"],
      ["Releases", "#releases"],
      ["Contact", "#contact"],
    ],
  },
  zh: {
    heroKicker: "更新无限，升级无界。",
    heroTitle: "让企业级软件持续、安全、稳定地进化。",
    heroSubtitle:
      "TSLH AI 聚焦企业级自动升级与软件外包开发，为工业、政企与互联网客户构建可持续演进的软件解决方案。",
    intro: "更新无限，升级无界。一次构建，持续进化，让每次发布都精准、可靠、可追踪。",
    scroll: "向下滚动",
    journey: "开启无界升级",
    inquiry: "联系 TSLH AI",
    footer: "©2025 - 2026 TSLH Technology. Unlimited Updates, Boundless Upgrades.",
    nav: [
      ["关于我们", "#about"],
      ["核心业务", "#core-business"],
      ["产品中心", "#product-showcase"],
      ["案例展示", "#case-showcase"],
      ["发布日志", "#releases"],
      ["联系我们", "#contact"],
    ],
  },
};

function parseFrontmatter(markdown) {
  if (!markdown.startsWith("---")) {
    return [{}, markdown.trim()];
  }

  const end = markdown.indexOf("\n---", 3);
  if (end === -1) {
    return [{}, markdown.trim()];
  }

  const raw = markdown.slice(3, end).trim();
  const body = markdown.slice(end + 4).trim();
  const data = {};

  raw.split("\n").forEach((line) => {
    const separator = line.indexOf(":");
    if (separator === -1) return;
    const key = line.slice(0, separator).trim();
    const value = line.slice(separator + 1).trim();
    data[key] = value.includes("|")
      ? value.split("|").map((item) => item.trim()).filter(Boolean)
      : value;
  });

  return [data, body];
}

function parseBlocks(body) {
  const blocks = [];
  const lines = body.split(/\r?\n/);
  let paragraph = [];
  let list = [];

  const flushParagraph = () => {
    if (!paragraph.length) return;
    blocks.push({ type: "paragraph", text: paragraph.join(" ") });
    paragraph = [];
  };

  const flushList = () => {
    if (!list.length) return;
    blocks.push({ type: "list", items: list });
    list = [];
  };

  lines.forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed) {
      flushParagraph();
      flushList();
      return;
    }

    if (trimmed.startsWith("### ")) {
      flushParagraph();
      flushList();
      blocks.push({ type: "heading", text: trimmed.slice(4) });
      return;
    }

    if (trimmed.startsWith("- ")) {
      flushParagraph();
      list.push(trimmed.slice(2));
      return;
    }

    flushList();
    paragraph.push(trimmed);
  });

  flushParagraph();
  flushList();

  return blocks;
}

function readSection(locale, id) {
  const filePath = path.join(process.cwd(), "src", "content", locale, `${id}.md`);
  const markdown = fs.readFileSync(filePath, "utf8");
  const [frontmatter, body] = parseFrontmatter(markdown);

  return {
    id,
    ...frontmatter,
    blocks: parseBlocks(body),
  };
}

export function getHomepageContent() {
  return Object.fromEntries(
    Object.keys(labels).map((locale) => [
      locale,
      {
        labels: labels[locale],
        sections: sectionOrder.map((id) => readSection(locale, id)),
      },
    ]),
  );
}
