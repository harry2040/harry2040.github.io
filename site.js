// Tranquil Stargazer's Paradise — nav + photo roll behaviour (no jQuery needed)

document.addEventListener('DOMContentLoaded', () => {
    const toggle = document.querySelector('.nav__toggle');
    const links = document.querySelector('.nav__links');
    if (toggle && links) {
        toggle.addEventListener('click', () => {
            links.classList.toggle('is-open');
        });
    }

    document.querySelectorAll('.gallery').forEach(initGallery);
});

function initGallery(gallery) {
    const track = gallery.querySelector('.gallery__track');
    const items = Array.from(gallery.querySelectorAll('.gallery__item'));
    if (!track || items.length === 0) return;

    const dotsWrap = gallery.querySelector('.gallery__dots');
    const dots = items.map((_, i) => {
        const dot = document.createElement('button');
        dot.className = 'gallery__dot';
        dot.setAttribute('aria-label', `Go to photo ${i + 1}`);
        dot.addEventListener('click', () => scrollToIndex(i));
        dotsWrap && dotsWrap.appendChild(dot);
        return dot;
    });

    function setActive(index) {
        dots.forEach((d, i) => d.classList.toggle('is-active', i === index));
    }

    function scrollToIndex(index) {
        const target = items[index];
        if (target) {
            track.scrollTo({ left: target.offsetLeft - track.offsetLeft, behavior: 'smooth' });
        }
    }

    let current = 0;
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                current = items.indexOf(entry.target);
                setActive(current);
            }
        });
    }, { root: track, threshold: 0.6 });
    items.forEach((item) => observer.observe(item));

    const prev = gallery.querySelector('.gallery__arrow--prev');
    const next = gallery.querySelector('.gallery__arrow--next');
    prev && prev.addEventListener('click', () => scrollToIndex(Math.max(0, current - 1)));
    next && next.addEventListener('click', () => scrollToIndex(Math.min(items.length - 1, current + 1)));

    setActive(0);

    let autoplayTimer = null;
    function startAutoplay() {
        stopAutoplay();
        autoplayTimer = setInterval(() => {
            scrollToIndex((current + 1) % items.length);
        }, 5000);
    }
    function stopAutoplay() {
        if (autoplayTimer) clearInterval(autoplayTimer);
    }

    startAutoplay();
    gallery.addEventListener('mouseenter', stopAutoplay);
    gallery.addEventListener('mouseleave', startAutoplay);
    gallery.addEventListener('touchstart', stopAutoplay, { passive: true });
}
