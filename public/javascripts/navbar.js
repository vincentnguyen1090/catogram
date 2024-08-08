document.addEventListener("DOMContentLoaded", () => {
  const navbar = document.querySelector(".navbar");
  const scrollThreshold = 50;

  window.addEventListener("scroll", () => {
    if (window.scrollY > scrollThreshold) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
  });
});
