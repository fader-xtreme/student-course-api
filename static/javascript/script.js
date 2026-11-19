// Campus Connect - loads data from the Flask API into the Flask-served pages.
// Same origin as the API, so relative URLs work locally and on Render.
const API_BASE = "/api";

const PAGE_ENDPOINTS = {
  "/students": "students",
  "/courses": "courses",
  "/enrollment": "enrollments",
  "/announcements": "announcements",
};

// Header text (normalized) -> API field name, for headers that differ from the field.
const ALIASES = {
  student: "student_name",
  course: "course_name",
  code: "course_code",
  date: "enrollment_date",
  posted: "date_posted",
};

const ID_FIELD = {
  students: "student_id",
  courses: "course_id",
  enrollments: "enrollment_id",
  announcements: "announcement_id",
};

function normalize(text) {
  return text.trim().toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, "");
}

async function loadStats() {
  const targets = document.querySelectorAll("[data-stat]");
  if (!targets.length) return;
  try {
    const res = await fetch(`${API_BASE}/stats`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const stats = await res.json();
    targets.forEach((el) => {
      const v = stats[el.dataset.stat];
      el.textContent = v !== undefined ? v : "-";
    });
  } catch (err) {
    console.error("Could not load stats:", err);
    targets.forEach((el) => (el.textContent = "!"));
  }
}

function cellValue(row, header, resource) {
  const key = normalize(header);
  if (!key || key === "actions" || key === "action") return "";

  if (key === "id") return row[ID_FIELD[resource]] ?? "";
  if (key === "name" && row.first_name !== undefined) {
    return `${row.first_name} ${row.last_name || ""}`.trim();
  }
  if (row[key] !== undefined && row[key] !== null) return row[key];

  const alias = ALIASES[key];
  if (alias && row[alias] !== undefined && row[alias] !== null) return row[alias];
  return "";
}

async function loadTable() {
  const path = window.location.pathname.replace(/\/+$/, "") || "/";
  const resource = PAGE_ENDPOINTS[path];
  if (!resource) return;

  const table = document.querySelector("table");
  if (!table) return;
  const tbody = table.tBodies[0] || table.createTBody();
  const headers = Array.from(table.querySelectorAll("thead th")).map((th) => th.textContent);
  const colCount = headers.length || 1;

  const message = (text) => {
    tbody.innerHTML = "";
    const tr = tbody.insertRow();
    const td = tr.insertCell();
    td.colSpan = colCount;
    td.textContent = text;
  };

  try {
    const res = await fetch(`${API_BASE}/${resource}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const rows = await res.json();

    if (!rows.length) {
      message("No records yet.");
      return;
    }

    tbody.innerHTML = "";
    rows.forEach((row) => {
      const tr = tbody.insertRow();
      headers.forEach((h) => {
        tr.insertCell().textContent = cellValue(row, h, resource);
      });
    });
  } catch (err) {
    console.error(`Could not load ${resource}:`, err);
    message("Could not load data. Try again in a moment.");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  loadStats();
  loadTable();
});
