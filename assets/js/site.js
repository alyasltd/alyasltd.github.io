
/* -------- Réglages du site -------- */
const SITE = {
  name: "Alya ZOUZOU",
  photo: "assets/img/photo.jpg",
  githubUser: "alyasltd",
  email: "alyasltd@gmail.com"
};

/* -------- Header commun à toutes les pages -------- */
function buildHeader(){
  const paths = [
    ["index.html","About"],
    ["cv.pdf","CV"],
    ["code.html","Code"],
    ["research.html","Research interests"],
    ["publications.html","Publications"],
    ["blog/index.html","Blog"],
    ["contact.html","Contact"],
  ];

  const here = location.pathname.split('/').slice(-1)[0] || "index.html";
  const header = document.getElementById("site-header");
  if(!header) return;

  const navLinks = paths.map(([href,label]) => {
    const active = (here === href || (here==="" && href==="index.html")) ? "active" : "";
    return `<a class="${active}" href="${href}">${label}</a>`;
  }).join("");

  header.innerHTML = `
    <div class="header-inner">
      <div class="brand">
        <a href="index.html" aria-label="Accueil">
          <img src="${SITE.photo}" alt="Photo de profil">
        </a>
      </div>
      <div style="flex:1"></div>
      <div class="site-name">${SITE.name}</div>
    </div>
    <div class="header-inner" style="padding-top:0">
      <nav class="nav">${navLinks}</nav>
    </div>
  `;
}

/* -------- Utilitaires -------- */
function byId(id){ return document.getElementById(id); }
function el(tag, attrs={}, html=""){
  const e = document.createElement(tag);
  Object.entries(attrs).forEach(([k,v])=>e.setAttribute(k,v));
  e.innerHTML = html;
  return e;
}

/* ----- Page Code: lister les repos GitHub ----- */
async function loadRepos(){
  if(!SITE.githubUser || SITE.githubUser === "votre-github") return;
  const container = byId("repos");
  if(!container) return;

  container.innerHTML = "<p class='muted'>Chargement des dépôts…</p>";
  try{
    const res = await fetch(`https://api.github.com/users/${SITE.githubUser}/repos?sort=updated&per_page=12`);
    if(!res.ok) throw new Error("Erreur API GitHub");
    const repos = await res.json();
    container.innerHTML = "";
    repos.forEach(r => {
      const card = el("div", {class:"card"});
      card.innerHTML = `
        <h3 style="margin:0 0 6px"><a href="${r.html_url}">${r.name}</a></h3>
        <p class="muted">${r.description || "Sans description"}</p>
        <div>
          ${r.language ? `<span class="badge">${r.language}</span>` : ""}
          <span class="badge">★ ${r.stargazers_count}</span>
          <span class="badge">MAJ: ${new Date(r.updated_at).toLocaleDateString()}</span>
        </div>
      `;
      container.appendChild(card);
    });
    if(repos.length===0){
      container.innerHTML = "<p class='muted'>Aucun dépôt public trouvé.</p>";
    }
  }catch(e){
    container.innerHTML = "<p class='muted'>Impossible de charger les dépôts (limite API ?). Vous pouvez masquer cette section.</p>";
  }
}

/* -------- Initialisation -------- */
document.addEventListener("DOMContentLoaded", ()=>{
  buildHeader();
  loadRepos();
});
