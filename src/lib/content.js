import fs from "node:fs";
import path from "node:path";

const sectionOrder = [
  "about",
  "core-business",
  "product-showcase",
  "case-showcase",
  "corporate-culture",
  "partners",
  "contact",
];

const labels = {
  en: {
    heroKicker: "High-End Enterprise Official Website",
    heroTitle: "Intelligent industry, cinematic presence.",
    heroSubtitle:
      "A light-luxury corporate homepage driven by frame-by-frame scroll animation, built for technology enterprises, industrial groups, and premium brands.",
    intro:
      "Scroll to drive the sequence. Every frame is pinned, eased, and composed for an immersive enterprise brand reveal.",
    scroll: "SCROLL DOWN",
    journey: "TO START THE JOURNEY",
    inquiry: "Online Inquiry",
    footer: "© 2026 TSLH Enterprise. Built for future-facing industry.",
    nav: [
      ["About", "#about"],
      ["Business", "#core-business"],
      ["Products", "#product-showcase"],
      ["Cases", "#case-showcase"],
      ["Contact", "#contact"],
    ],
  },
  zh: {
    heroKicker: "高端企业官网",
    heroTitle: "以智能产业，呈现电影级品牌气场。",
    heroSubtitle:
      "面向科技企业、工业集团与高端品牌的轻奢企业首页，以序列帧滚动构建沉浸式主视觉。",
    intro: "滚动驱动画面序列。固定视差、缓动与留白共同完成企业品牌揭幕。",
    scroll: "向下滚动",
    journey: "开启品牌旅程",
    inquiry: "在线咨询",
    footer: "© 2026 TSLH Enterprise. 面向未来产业而生。",
    nav: [
      ["关于我们", "#about"],
      ["核心业务", "#core-business"],
      ["产品中心", "#product-showcase"],
      ["案例展示", "#case-showcase"],
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
