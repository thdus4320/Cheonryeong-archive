const fs = require("fs");

const files = ["cheonryeong-archive.html", "index.html"];
const requiredSnippets = [
  "portraitImage:",
  "id=\"hero\"",
  "id=\"sidebarPortrait\"",
  "id=\"heroPortrait\"",
  "renderFrameVisibility()",
  "activeTab === \"profile\"",
  "pinned:",
  "pinned: Boolean",
  "pinnedGalleryItems",
  "data-pin",
  "상단 고정",
  "대표 이미지 주소",
  "대표 이미지 파일",
  "id=\"imageViewerDialog\"",
  "openImageViewer",
  "closeImageViewer",
  "data-view",
  "gallery-image-button",
  "viewerImage",
  "이미지 크게 보기"
];

for (const file of files) {
  const html = fs.readFileSync(file, "utf8");
  const scriptMatch = html.match(/<script>([\s\S]*)<\/script>/);

  if (!scriptMatch) {
    throw new Error(`${file}: missing inline script`);
  }

  new Function(scriptMatch[1]);

  for (const snippet of requiredSnippets) {
    if (!html.includes(snippet)) {
      throw new Error(`${file}: missing ${snippet}`);
    }
  }
}

const source = fs.readFileSync("cheonryeong-archive.html", "utf8");
const published = fs.readFileSync("index.html", "utf8");

if (source !== published) {
  throw new Error("index.html must match cheonryeong-archive.html");
}

console.log("archive verification ok");
