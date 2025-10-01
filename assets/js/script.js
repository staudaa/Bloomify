document.addEventListener("DOMContentLoaded", function () {
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  const nav = document.getElementById("mainNav");
  const hero = document.getElementById("hero");

  function updateNavbar() {
    const heroBottom = hero.getBoundingClientRect().bottom;
    if (heroBottom <= window.innerHeight * 0.15) {
      nav.classList.add("navbar-scrolled");
      nav.classList.remove("navbar-transparent");
    } else {
      nav.classList.add("navbar-transparent");
      nav.classList.remove("navbar-scrolled");
    }
  }

  updateNavbar();
  window.addEventListener("scroll", updateNavbar);
  window.addEventListener("resize", updateNavbar);

  const navLinks = document.querySelectorAll(".nav-link");
  navLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const targetId = link.getAttribute("href").replace("#", "");
      const target = document.getElementById(targetId);
      if (target) {
        const offset = 72;
        const top =
          target.getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo({ top, behavior: "smooth" });
      }

      navLinks.forEach((l) => l.classList.remove("active"));
      link.classList.add("active");

      const bsCollapse = document.querySelector(".navbar-collapse");
      if (bsCollapse && bsCollapse.classList.contains("show")) {
        new bootstrap.Collapse(bsCollapse).hide();
      }
    });
  });

  const sections = document.querySelectorAll("section, header");
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute("id");
          if (!id) return;
          navLinks.forEach((l) => {
            l.classList.toggle("active", l.getAttribute("href") === `#${id}`);
          });
        }
      });
    },
    { root: null, threshold: 0.45 }
  );

  sections.forEach((s) => sectionObserver.observe(s));

  const revealEls = document.querySelectorAll(".reveal, [data-reveal]");
  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("show");
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.18 }
  );

  revealEls.forEach((el) => observer.observe(el));

  const categoryBtns = document.querySelectorAll(".category-btn");
  const productItems = document.querySelectorAll(".product-item");

  categoryBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      categoryBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      const cat = btn.getAttribute("data-category");
      productItems.forEach((item) => {
        if (cat === "all" || item.getAttribute("data-category") === cat) {
          item.style.display = "";
        } else {
          item.style.display = "none";
        }
      });
    });
  });

  const modal = document.getElementById("modalProduct");
  const carouselInner = document.getElementById("carouselInner");
  const modalTitle = document.getElementById("modalTitle");
  const productDesc = document.getElementById("productDesc");

  document.querySelectorAll("[data-product]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const data = JSON.parse(btn.getAttribute("data-product"));

      modalTitle.textContent = data.title || "Detail Produk";
      carouselInner.innerHTML = "";
      data.items.forEach((it, i) => {
        const div = document.createElement("div");
        div.className = `carousel-item${i === 0 ? " active" : ""}`;
        div.innerHTML = `<img src="${it.img}" class="d-block w-100" alt="slide-${i}">`;
        div.dataset.desc = it.desc || "";
        carouselInner.appendChild(div);
      });

      productDesc.textContent = data.items[0].desc || "";
      const carouselEl = document.getElementById("productCarousel");
      const bsCarousel =
        bootstrap.Carousel.getInstance(carouselEl) ||
        new bootstrap.Carousel(carouselEl, { ride: false });
      bsCarousel.to(0);
    });
  });

  const productCarouselEl = document.getElementById("productCarousel");
  if (productCarouselEl) {
    productCarouselEl.addEventListener("slid.bs.carousel", function (e) {
      const active = productCarouselEl.querySelector(".carousel-item.active");
      if (active) productDesc.textContent = active.dataset.desc || "";
    });
  }

  const gallery =
    document.getElementById("galleryScroll") ||
    document.getElementById("galleryScroll");
  const galleryWrap = document.querySelector(".gallery-scroll");
  if (galleryWrap) {
    let isDown = false,
      startX,
      scrollLeft;
    galleryWrap.addEventListener("mousedown", (e) => {
      isDown = true;
      galleryWrap.classList.add("dragging");
      startX = e.pageX - galleryWrap.offsetLeft;
      scrollLeft = galleryWrap.scrollLeft;
    });
    galleryWrap.addEventListener("mouseleave", () => {
      isDown = false;
      galleryWrap.classList.remove("dragging");
    });
    galleryWrap.addEventListener("mouseup", () => {
      isDown = false;
      galleryWrap.classList.remove("dragging");
    });
    galleryWrap.addEventListener("mousemove", (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - galleryWrap.offsetLeft;
      const walk = (x - startX) * 1.2;
      galleryWrap.scrollLeft = scrollLeft - walk;
    });

    let touchStartX = 0,
      touchStartScroll = 0;
    galleryWrap.addEventListener(
      "touchstart",
      (e) => {
        touchStartX = e.touches[0].pageX;
        touchStartScroll = galleryWrap.scrollLeft;
      },
      { passive: true }
    );
    galleryWrap.addEventListener(
      "touchmove",
      (e) => {
        const x = e.touches[0].pageX;
        const walk = touchStartX - x;
        galleryWrap.scrollLeft = touchStartScroll + walk;
      },
      { passive: true }
    );
  }

  const WHATSAPP_NUMBER = "6285233929574";
  const contactForm = document.getElementById("contactForm");
  if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();
      const name = document.getElementById("name").value.trim();
      const phone = document.getElementById("phone").value.trim();
      const msg = document.getElementById("message").value.trim();
      const text = `Halo Bloomify, saya ${encodeURIComponent(
        name
      )}. ${encodeURIComponent(msg)} ${
        phone ? " Kontak: " + encodeURIComponent(phone) : ""
      }`;
      const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${text}`;
      window.open(url, "_blank");
    });
  }

  const modalEl = document.getElementById("modalProduct");
  if (modalEl) {
    modalEl.addEventListener("hidden.bs.modal", () => {
      carouselInner.innerHTML = "";
      productDesc.textContent = "";
      modalTitle.textContent = "Detail Produk";
    });
  }
});
