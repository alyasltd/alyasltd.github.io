document.addEventListener("DOMContentLoaded", () => {
  const blogContainer = document.querySelector(".blog-list");

  // Liste des articles à afficher
  const posts = [
    {
      title: "Bonjour ! Welcome to my blog",
      date: "November 2025",
      author: "Alya Zouzou",
      image: "../assets/img/blog1.jpg",
      theme: "Personal, Introduction",
      desc: "A short note about launching this website and what I’ll share here.",
      url: "post-bonjour.html"
    },
    {
      title: "A peek into my current research",
      date: "November 2025",
      author: "Alya Zouzou",
      image: "../assets/img/blog2.jpg",
      theme: "Research, Computer Vision",
      desc: "Exploring conformal prediction and robustness for multimodal models.",
      url: "post-research.html"
    }
  ];

  // Génération des cards
  posts.forEach(post => {
    const card = document.createElement("div");
    card.classList.add("blog-card");

    card.innerHTML = `
      <img src="${post.image}" alt="${post.title}">
      <div class="blog-card-content">
        <h2><a href="${post.url}">${post.title}</a></h2>
        <p>${post.desc}</p>
        <div class="blog-meta">
          <span>${post.date}</span> · <span>${post.author}</span> · <span>${post.theme}</span>
        </div>
      </div>
    `;

    blogContainer.appendChild(card);
  });
});