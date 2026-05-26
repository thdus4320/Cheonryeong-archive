const fs = require("fs");

const files = ["cheonryeong-archive.html", "index.html"];
const adminFile = "admin.html";
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
  "id=\"imageViewerDialog\"",
  "openImageViewer",
  "closeImageViewer",
  "data-view",
  "gallery-image-button",
  "viewerImage",
  "viewerThumbs",
  "contextmenu",
  "imageUrls",
  "coverIndex",
  "SUPABASE_URL",
  "SUPABASE_ANON_KEY",
  "SUPABASE_GALLERY_BUCKET",
  "fetchApprovedGalleryItems",
  "mergeGalleryItems",
  "return EDIT_MODE ?",
  "supabaseGalleryItems",
  "EDIT_MODE",
  "renderEditControls",
  "data-edit-only",
  "approved"
];

const forbiddenSnippets = [
  "submitGalleryItemToSupabase",
  "uploadGalleryImageToSupabase",
  "create policy \"Public can submit pending gallery items\"",
  "create policy \"Public can upload pending gallery images\""
];

const adminRequiredSnippets = [
  "supabase.createClient",
  "signInWithPassword",
  "uploadAdminImage",
  "uploadAdminImages",
  "imageFile2",
  "coverIndex",
  "image_paths",
  "image_urls",
  "renderPreviewImages",
  "gallery-images",
  "gallery_items",
  "status: \"approved\"",
  "adminUploadForm",
  "adminGalleryList",
  "fetchAdminGalleryItems",
  "renderAdminGalleryItems",
  "startEditItem",
  "deleteAdminItem",
  "currentEditId",
  "update(payload)",
  "delete().eq"
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

  for (const snippet of forbiddenSnippets.slice(0, 2)) {
    if (html.includes(snippet)) {
      throw new Error(`${file}: forbidden public upload code ${snippet}`);
    }
  }
}

const sql = fs.readFileSync("supabase-setup.sql", "utf8");
for (const snippet of forbiddenSnippets.slice(2)) {
  if (sql.includes(snippet)) {
    throw new Error(`supabase-setup.sql: forbidden public upload policy ${snippet}`);
  }
}

for (const snippet of [
  "to authenticated",
  "Admin can insert gallery items",
  "Admin can read gallery items",
  "Admin can upload gallery images",
  "image_paths jsonb",
  "image_urls jsonb",
  "cover_index integer",
  "status = 'approved'"
]) {
  if (!sql.includes(snippet)) {
    throw new Error(`supabase-setup.sql: missing ${snippet}`);
  }
}

const admin = fs.readFileSync(adminFile, "utf8");
for (const snippet of adminRequiredSnippets) {
  if (!admin.includes(snippet)) {
    throw new Error(`${adminFile}: missing ${snippet}`);
  }
}

const source = fs.readFileSync("cheonryeong-archive.html", "utf8");
const published = fs.readFileSync("index.html", "utf8");

if (source !== published) {
  throw new Error("index.html must match cheonryeong-archive.html");
}

console.log("archive verification ok");
