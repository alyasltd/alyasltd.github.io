/* ====== Paramètres ====== */
const GITHUB_USER = "alyasltd"; // <- change si besoin
const SHOW_MAX = 100;
const CACHE_HOURS = 6;

/* ====== Cache ====== */
const KEY = u => `repos_cache_v1_${u}`;
const getCache = u => {
  try {
    const raw = localStorage.getItem(KEY(u));
    if (!raw) return null;
    const { t, data } = JSON.parse(raw);
    if (Date.now() - t < CACHE_HOURS * 3600 * 1000) return data;
  } catch(_) {}
  return null;
};
const setCache = (u, data) => {
  try { localStorage.setItem(KEY(u), JSON.stringify({ t: Date.now(), data })); } catch(_) {}
};

/* ====== Rendu ====== */
const container = () => document.getElementById("repos");
const repoCard = r => `
  <div class="card">
    <h3 style="margin:0 0 6px"><a href="${r.html_url}" target="_blank" rel="noopener">${r.name}</a></h3>
    <p class="muted">${r.description || "Sans description"}</p>
    <div>
      ${r.language ? `<span class="badge">${r.language}</span>` : ""}
      <span class="badge">★ ${r.stargazers_count || 0}</span>
      <span class="badge">MAJ: ${new Date(r.updated_at).toLocaleDateString()}</span>
    </div>
  </div>
`;
const render = repos => {
  const c = container();
  if (!c) return;
  if (!repos || !repos.length) {
    c.innerHTML = `
      <div class="card">
        <p class="muted">Aucun dépôt public trouvé. <a href="https://github.com/${GITHUB_USER}?tab=repositories" target="_blank" rel="noopener">Voir sur GitHub</a>.</p>
      </div>`;
    return;
  }
  c.innerHTML = repos.map(repoCard).join("");
};
const fallback = () => {
  const c = container();
  if (!c) return;
  c.innerHTML = `
    <div class="card">
      <h3><a href="https://github.com/${GITHUB_USER}?tab=repositories" target="_blank" rel="noopener">Voir tous mes dépôts sur GitHub</a></h3>
      <p class="muted">Impossible d’afficher la liste dynamique (hors-ligne ou limite API).</p>
    </div>`;
};

/* ====== API ====== */
const j = async url => { const r = await fetch(url); if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json(); };
const loadRepos = async user => {
  const cached = getCache(user);
  if (cached) render(cached);
  try {
    let repos = await j(`https://api.github.com/users/${user}/repos?sort=updated&per_page=${SHOW_MAX}`);
    if (!Array.isArray(repos) || !repos.length) {
      repos = await j(`https://api.github.com/orgs/${user}/repos?sort=updated&per_page=${SHOW_MAX}`);
    }
    repos.sort((a,b) => new Date(b.updated_at) - new Date(a.updated_at));
    render(repos);
    setCache(user, repos);
  } catch(e) {
    if (!cached) fallback();
  }
};
document.addEventListener("DOMContentLoaded", () => loadRepos(GITHUB_USER));