/* Newwoodland Hotel & Lounge — site behaviour. Client data lives in config.js. */
(function () {
  "use strict";

  const cfg = typeof SITE_CONFIG !== "undefined" ? SITE_CONFIG : {};
  const PENDING = "Pending client confirmation";

  /* ---------- Contact details ---------- */
  function fillConfigFields() {
    document.querySelectorAll("[data-config]").forEach((el) => {
      const key = el.dataset.config;
      const value = (cfg[key] || "").trim();

      if (!value) {
        el.textContent = PENDING;
        el.classList.add("pending");
        el.removeAttribute("href");
        return;
      }

      el.textContent = value;
      if (el.tagName === "A" && key === "email") el.href = "mailto:" + value;
    });
  }

  function fillPhones() {
    const phones = cfg.phones || [];
    document.querySelectorAll("[data-phones]").forEach((el) => {
      if (!phones.length) {
        el.textContent = PENDING;
        el.classList.add("pending");
        return;
      }
      phones.forEach((phone) => {
        const link = document.createElement("a");
        link.href = "tel:" + phone.replace(/[^\d+]/g, "");
        link.textContent = phone;
        el.appendChild(link);
      });
    });
  }

  /* ---------- WhatsApp ---------- */
  function whatsappUrl(message) {
    const text = encodeURIComponent(message || cfg.whatsappMessage || "");
    return "https://wa.me/" + cfg.whatsappNumber + "?text=" + text;
  }

  function setupWhatsApp() {
    const number = (cfg.whatsappNumber || "").replace(/\D/g, "");
    cfg.whatsappNumber = number;

    document.querySelectorAll("[data-whatsapp]").forEach((el) => {
      if (!number) {
        // Fall back to the contact section until the number is confirmed
        el.href = "#contact";
        el.title = "WhatsApp number pending client confirmation";
        return;
      }
      el.href = whatsappUrl(el.dataset.message);
      el.target = "_blank";
      el.rel = "noopener";
    });
  }

  /* ---------- Social media ---------- */
  function setupSocial() {
    const social = cfg.social || {};
    document.querySelectorAll("[data-social]").forEach((el) => {
      const url = (social[el.dataset.social] || "").trim();
      if (!url) {
        el.classList.add("is-pending");
        el.setAttribute("aria-disabled", "true");
        el.title = "Link pending client confirmation";
        return;
      }
      el.href = url;
      el.target = "_blank";
      el.rel = "noopener noreferrer";
    });
  }

  /* ---------- Map & directions ---------- */
  function setupMap() {
    const query = (cfg.mapQuery || cfg.address || "").trim();
    const directions = document.getElementById("directionsLink");
    if (!query) {
      if (directions) {
        directions.classList.add("disabled");
        directions.setAttribute("aria-disabled", "true");
        directions.removeAttribute("target");
      }
      return;
    }

    const q = encodeURIComponent(query);
    const wrap = document.getElementById("mapWrap");
    if (wrap) {
      wrap.innerHTML =
        '<iframe title="Map showing the location of Newwoodland Hotel &amp; Lounge" ' +
        'src="https://www.google.com/maps?q=' + q + '&output=embed" ' +
        'loading="lazy" referrerpolicy="no-referrer-when-downgrade" allowfullscreen></iframe>';
    }
    if (directions) {
      directions.href = "https://www.google.com/maps/dir/?api=1&destination=" + q;
    }
  }

  /* ---------- Navigation ---------- */
  function setupNav() {
    const nav = document.getElementById("mainNav");
    const collapseEl = document.getElementById("navLinks");

    const onScroll = () => nav.classList.toggle("is-scrolled", window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    // Close the mobile menu after choosing a link
    collapseEl.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        if (collapseEl.classList.contains("show")) {
          bootstrap.Collapse.getOrCreateInstance(collapseEl).hide();
        }
      });
    });
  }

  /* ---------- Gallery lightbox ---------- */
  function setupGallery() {
    const items = Array.from(document.querySelectorAll(".gallery-item"));
    const modalEl = document.getElementById("lightbox");
    if (!items.length || !modalEl) return;

    const modal = new bootstrap.Modal(modalEl);
    const img = document.getElementById("lightboxImg");
    const caption = document.getElementById("lightboxCaption");
    let current = 0;

    const pad = (n) => String(n).padStart(2, "0");

    function show(index) {
      current = (index + items.length) % items.length;
      const item = items[current];
      const source = item.querySelector("img");
      img.src = source.currentSrc || source.src;
      img.alt = source.alt;

      caption.replaceChildren();
      const title = document.createElement("strong");
      title.textContent = item.dataset.title || source.alt;
      caption.append(title);
      if (item.dataset.desc) {
        const desc = document.createElement("span");
        desc.textContent = item.dataset.desc;
        caption.append(desc);
      }
      const count = document.createElement("small");
      count.textContent = pad(current + 1) + " / " + pad(items.length);
      caption.append(count);
    }

    items.forEach((item, i) => {
      // Title overlay on the tile
      if (item.dataset.title) {
        const label = document.createElement("span");
        label.className = "gallery-label";
        label.setAttribute("aria-hidden", "true");
        label.textContent = item.dataset.title;
        item.append(label);
      }
      item.setAttribute("aria-label", "View larger: " + (item.dataset.title || item.querySelector("img").alt));
      item.addEventListener("click", () => {
        show(i);
        modal.show();
      });
    });

    modalEl.querySelector(".prev").addEventListener("click", () => show(current - 1));
    modalEl.querySelector(".next").addEventListener("click", () => show(current + 1));
    modalEl.addEventListener("keydown", (e) => {
      if (e.key === "ArrowLeft") show(current - 1);
      if (e.key === "ArrowRight") show(current + 1);
    });
  }

  /* ---------- Room cards ---------- */
  const AMENITIES_SHOWN = 6;

  function setupAmenities() {
    document.querySelectorAll(".room-card .amenities").forEach((list) => {
      const extra = Array.from(list.children).slice(AMENITIES_SHOWN);
      if (!extra.length) return;

      list.classList.add("is-collapsed");
      const toggle = document.createElement("button");
      toggle.type = "button";
      toggle.className = "amenities-toggle";
      toggle.setAttribute("aria-expanded", "false");
      const label = () =>
        list.classList.contains("is-collapsed") ? "+ " + extra.length + " more amenities" : "Show less";
      toggle.textContent = label();
      toggle.addEventListener("click", () => {
        const collapsed = list.classList.toggle("is-collapsed");
        toggle.setAttribute("aria-expanded", String(!collapsed));
        toggle.textContent = label();
      });
      list.after(toggle);
    });
  }

  // "Book Now" fills the inquiry form with the chosen room
  function setupBooking() {
    const form = document.getElementById("inquiryForm");
    if (!form) return;
    const select = form.querySelector("#room");
    const message = form.querySelector("#message");

    document.querySelectorAll("[data-book]").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        const room = btn.dataset.book;
        select.value = room;
        if (!message.value.trim() || message.dataset.autofilled === "true") {
          message.value = "I would like to book the " + room + ". Check-in date: , Check-out date: , Guests: ";
          message.dataset.autofilled = "true";
        }
        form.classList.remove("flash");
        void form.offsetWidth; // restart the highlight animation
        form.classList.add("flash");
        form.scrollIntoView({ behavior: "smooth", block: "center" });
        form.querySelector("#name").focus({ preventScroll: true });
      });
    });
    message.addEventListener("input", () => (message.dataset.autofilled = "false"));
  }

  /* ---------- Inquiry form ---------- */
  function setupForm() {
    const form = document.getElementById("inquiryForm");
    if (!form) return;
    const status = document.getElementById("formStatus");

    // Re-check a field as the guest corrects it
    form.addEventListener("input", (e) => {
      if (form.classList.contains("was-validated")) e.target.checkValidity();
    });

    const submitBtn = form.querySelector('button[type="submit"]');
    const hasWhatsApp = Boolean(cfg.whatsappNumber);
    if (hasWhatsApp) submitBtn.textContent = "Send Inquiry on WhatsApp";

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      status.className = "form-status";
      status.textContent = "";

      // Trim whitespace so blank-looking entries fail validation
      form.querySelectorAll("input, textarea").forEach((f) => (f.value = f.value.trim()));

      if (!form.checkValidity()) {
        form.classList.add("was-validated");
        form.querySelector(":invalid").focus();
        return;
      }

      const data = Object.fromEntries(new FormData(form));
      if (!hasWhatsApp) {
        status.classList.add("is-error");
        status.textContent = "The inquiry form is not set up yet. Please contact us by phone or email.";
        return;
      }

      const text = [
        "Hello, I would like to make an inquiry.",
        "Name: " + data.name,
        "Email: " + data.email,
        data.phone ? "Phone: " + data.phone : "",
        data.room ? "Room: " + data.room : "",
        "Message: " + data.message
      ].filter(Boolean).join("\n");
      const url = whatsappUrl(text);
      // Fall back to this tab if a popup blocker stops the new one
      const whatsappTab = window.open(url, "_blank");
      if (whatsappTab) whatsappTab.opener = null;
      else window.location.href = url;
      status.classList.add("is-success");
      status.textContent = "Your inquiry is ready in WhatsApp. Press send there to deliver it to the hotel.";
      form.classList.remove("was-validated");
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("year").textContent = new Date().getFullYear();
    fillConfigFields();
    fillPhones();
    setupWhatsApp();
    setupSocial();
    setupMap();
    setupNav();
    setupGallery();
    setupAmenities();
    setupBooking();
    setupForm();
  });
})();
