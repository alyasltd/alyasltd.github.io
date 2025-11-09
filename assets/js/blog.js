document.addEventListener("DOMContentLoaded", () => {
  const blogContainer = document.querySelector(".blog-list");

  // Liste des articles à afficher
  const posts = [
    {
      title: "How does Pose Estimation work ?",
      date: "XXX",
      author: "Alya Zouzou",
      image: "../assets/img/blog/art1/P3Pposeidon.png",
      theme: "Computer Vision, perception",
      desc: "Pose estimation is a fundamental task in computer vision that involves determining the position and orientation of an object in 3D space from 2D images. In this blog post, we will explore the key concepts and techniques used in pose estimation, including camera models, feature detection, and optimization algorithms.",
      url: "../blog/pose_estimation.html"
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