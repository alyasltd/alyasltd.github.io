document.addEventListener("DOMContentLoaded", () => {
  const blogContainer = document.querySelector(".blog-list");

  // Liste des articles à afficher
  const posts = [
    {
      title: "",
      date: "",
      author: "Alya Zouzou",
      image: "",
      theme: "",
      desc: "",
      url: ""
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