const SITE = {
  name: "Alya ZOUZOU",
  photo: "assets/img/photo.jpg",     
  email: "alyasltd@gmail.com",
  githubUser: "alyasltd"            
};


function buildHeader() {
  const h = document.getElementById("site-header");
  if (!h) return;
  h.innerHTML = `
    <div class="wrapper" style="display:flex;align-items:center;gap:16px;flex-wrap:wrap;padding:16px 24px;border-bottom:1px solid var(--border);">
      <img src="${SITE.photo}" alt="Photo" style="width:52px;height:52px;border-radius:9999px;object-fit:cover;border:2px solid var(--border)">
      <div style="font-weight:800;font-size:1.25rem">${SITE.name}</div>
      <nav style="display:flex;gap:8px;flex-wrap:wrap;margin-left:auto">
        <a class="nav-link" href="index.html">About</a>
        <a class="nav-link" href="cv.html">CV</a>
        <a class="nav-link active" href="code.html" aria-current="page">Code</a>
        <a class="nav-link" href="research.html">Research interests</a>
        <a class="nav-link" href="publications.html">Publications</a>
        <a class="nav-link" href="blog/index.html">Blog</a>
        <a class="nav-link" href="contact.html">Contact</a>
      </nav>
    </div>
  `;
}

function repoCard(r) {
  const lang = r.language ? `<span class="badge">${r.language}</span>` : "";
  const stars = `<span class="badge">★ ${r.stargazers_count || 0}</span>`;
  const updated = `<span class="badge">MAJ: ${new Date(r.updated_at).toLocaleDateString()}</span>`;
  return `
    <div class="card">
      <h3 style="margin:0 0 6px"><a href="${r.html_url}" target="_blank" rel="noopener">${r.name}</a></h3>
      <p class="muted">${r.description || "Sans description"}</p>
      <div>${lang} ${stars} ${updated}</div>
    </div>
  `;
}

function renderRepos(repos) {
  const container = document.getElementById("repos");
  if (!container) return;
  if (!repos || repos.length === 0) {
    container.innerHTML = `
      <div class="card">
        <p class="muted">Aucun dépôt public trouvé. <a href="https://github.com/${SITE.githubUser}?tab=repositories">Voir sur GitHub</a>.</p>
      </div>`;
    return;
  }
  container.innerHTML = repos.map(repoCard).join("");
}

const CACHE_KEY = (user) => `repos_cache_v1_${user}`;

function getCachedRepos(user) {
  try {
    const raw = localStorage.getItem(CACHE_KEY(user));
    if (!raw) return null;
    const { savedAt, data } = JSON.parse(raw);
    // valide 6 heures
    if (Date.now() - savedAt < 6 * 60 * 60 * 1000) return data;
  } catch (_) {}
  return null;
}

function setCachedRepos(user, data) {
  try {
    localStorage.setItem(CACHE_KEY(user), JSON.stringify({ savedAt: Date.now(), data }));
  } catch (_) {}
}

async function fetchReposFrom(endpoint) {
  const res = await fetch(endpoint);
  if (!res.ok) throw new Error(`GitHub API: ${res.status}`);
  return await res.json();
}

async function loadReposAlways(username) {
  const container = document.getElementById("repos");
  if (!container) return;

  const cached = getCachedRepos(username);
  if (cached && cached.length) renderRepos(cached);

  try {
    let repos = await fetchReposFrom(`https://api.github.com/users/${username}/repos?sort=updated&per_page=100`);
    if (!Array.isArray(repos) || repos.length === 0) {
      repos = await fetchReposFrom(`https://api.github.com/orgs/${username}/repos?sort=updated&per_page=100`);
    }

    repos.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));

    renderRepos(repos);
    setCachedRepos(username, repos);
    return;
  } catch (e) {
    if (!cached) {
      container.innerHTML = `
        <div class="card">
          <p class="muted">
            Impossible de charger la liste dynamique (hors-ligne ou limite API).
            Consultez <a href="https://github.com/${username}?tab=repositories">mes dépôts sur GitHub</a>.
          </p>
        </div>`;
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  buildHeader();
  if (SITE.githubUser && SITE.githubUser !== "votre-github") {
    loadReposAlways(SITE.githubUser);
  }
});