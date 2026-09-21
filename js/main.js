/**
 * OASIS FAMILY GARDEN RESTAURANT & BAR - UI INTERACTIONS
 * Zero External Dependencies (100% Vanilla JS)
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initMobileDrawer();
  initMenuTabs();
  initLightbox();
  initReservationForm();
  initBackgroundVideos();
  setCurrentYear();
});

/* 1. Header Elevation on Scroll */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });
}

/* 2. Mobile Drawer Navigation */
function initMobileDrawer() {
  const toggle = document.getElementById('navToggle');
  const menu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link, .btn-nav');

  if (!toggle || !menu) return;

  toggle.addEventListener('click', () => {
    const expanded = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', !expanded);
    menu.classList.toggle('active');
  });

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      menu.classList.remove('active');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });
}

/* 3. Tab & Sub-Category Switching */
function initMenuTabs() {
  const mainTabs = document.querySelectorAll('.tab-btn');
  const mainContents = document.querySelectorAll('.tab-content');

  mainTabs.forEach(btn => {
    btn.addEventListener('click', () => {
      mainTabs.forEach(t => t.classList.remove('active'));
      mainContents.forEach(c => c.classList.remove('active'));

      btn.classList.add('active');
      const targetId = btn.getAttribute('data-target');
      const targetContent = document.getElementById(targetId);
      if (targetContent) targetContent.classList.add('active');
    });
  });

  const subNavs = document.querySelectorAll('.menu-subnav');
  subNavs.forEach(nav => {
    const subBtns = nav.querySelectorAll('.sub-tab-btn');
    const parentTab = nav.closest('.tab-content');

    subBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        subBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const subTarget = btn.getAttribute('data-sub');
        const panels = parentTab.querySelectorAll('.sub-menu-panel');
        panels.forEach(p => p.classList.remove('active'));

        const activePanel = parentTab.querySelector(`#sub-${subTarget}`);
        if (activePanel) activePanel.classList.add('active');
      });
    });
  });
}

/* 4. Unified Lightbox Image Zoom */
function initLightbox() {
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const closeBtn = document.getElementById('lightboxClose');
  const interactiveItems = document.querySelectorAll('.interactive-media');

  if (!lightbox || !lightboxImg) return;

  interactiveItems.forEach(item => {
    item.addEventListener('click', () => {
      const img = item.querySelector('img');
      const targetSrc = item.getAttribute('data-src') || img.src;
      
      const captionTitle = item.querySelector('.caption-title');

      lightboxImg.src = targetSrc;
      lightboxCaption.innerText = captionTitle ? captionTitle.innerText : '';
      lightbox.classList.add('active');
      lightbox.setAttribute('aria-hidden', 'false');
    });
  });

  const closeLightbox = () => {
    lightbox.classList.remove('active');
    lightbox.setAttribute('aria-hidden', 'true');
    lightboxImg.src = '';
    lightboxCaption.innerText = '';
  };

  closeBtn.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.classList.contains('active')) {
      closeLightbox();
    }
  });
}

/* 5. Reservation Form with WhatsApp Forwarding */
function initReservationForm() {
  const form = document.getElementById('reservationForm');
  const successBanner = document.getElementById('formSuccess');

  if (!form) return;

  const dateInput = document.getElementById('resDate');
  if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.min = today;
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let isValid = true;

    const inputs = form.querySelectorAll('input[required], select[required]');
    inputs.forEach(input => {
      const group = input.closest('.form-group');
      if (!input.checkValidity()) {
        group.classList.add('has-error');
        isValid = false;
      } else {
        group.classList.remove('has-error');
      }
    });

    if (isValid) {
      const name = document.getElementById('resName').value.trim();
      const phone = document.getElementById('resPhone').value.trim();
      const guests = document.getElementById('resGuests').value;
      const date = document.getElementById('resDate').value;
      const time = document.getElementById('resTime').value;
      const seating = document.getElementById('resSeating').value;

      const message = `*Table Reservation Enquiry - Oasis*%0A` +
                      `*Guest Name:* ${encodeURIComponent(name)}%0A` +
                      `*Contact:* ${encodeURIComponent(phone)}%0A` +
                      `*Guests:* ${encodeURIComponent(guests)}%0A` +
                      `*Date:* ${encodeURIComponent(date)}%0A` +
                      `*Time:* ${encodeURIComponent(time)}%0A` +
                      `*Seating Area:* ${encodeURIComponent(seating)}`;

      const whatsappUrl = `https://wa.me/916901383967?text=${message}`;

      successBanner.style.display = 'block';

      setTimeout(() => {
        window.open(whatsappUrl, '_blank');
        form.reset();
        setTimeout(() => {
          successBanner.style.display = 'none';
        }, 5000);
      }, 700);
    }
  });
}

/* 6. Multi-Video Autoplay & Lifecycle Management */
function initBackgroundVideos() {
  const videos = document.querySelectorAll('.bg-video');

  videos.forEach(video => {
    // Force mute to satisfy modern mobile autoplay policies
    video.muted = true;
    const playPromise = video.play();

    if (playPromise !== undefined) {
      playPromise.catch(() => {
        // Fallback: trigger playback on first user touch anywhere on the page
        document.body.addEventListener('touchstart', () => {
          video.play();
        }, { once: true });
      });
    }
  });
}

/* 7. Dynamic Copyright Year */
function setCurrentYear() {
  const yearEl = document.getElementById('currentYear');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
}