/**
 * VEGO VTC - Main JavaScript File
 * Version: 1.0
 * Description: Scripts pour les interactions du site VEGO VTC
 */

// Attendre que le DOM soit complètement chargé
document.addEventListener('DOMContentLoaded', function() {
    // Navigation mobile
    setupMobileNav();
    
    // Carousels
    setupCarousels();
    
    // Animations au scroll
    setupScrollAnimations();
    
    // Optimisation des images
    initImageOptimization();
    
    // Map (seulement sur la page de contact)
    if (document.getElementById('map')) {
        initMap();
    }
});

/**
 * Configuration de la navigation mobile
 */
function setupMobileNav() {
    const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
    const primaryNav = document.querySelector('.primary-navigation');

    if (mobileNavToggle) {
        mobileNavToggle.addEventListener('click', function() {
            primaryNav.classList.toggle('active');
            this.setAttribute('aria-expanded', primaryNav.classList.contains('active'));
        });
    }
}

/**
 * Configuration des carousels sur le site
 */
function setupCarousels() {
    // Carousel hero
    const carouselSlides = document.querySelectorAll('.carousel-slides .carousel-slide');
    const prevButton = document.querySelector('.carousel-arrow.prev');
    const nextButton = document.querySelector('.carousel-arrow.next');
    const indicators = document.querySelectorAll('.carousel-indicators .indicator');

    if (!carouselSlides.length) return;

    let currentSlide = 0;
    const slideCount = carouselSlides.length;
    let slideInterval;

    function updateCarousel() {
        carouselSlides.forEach((slide, index) => {
            slide.classList.toggle('active', index === currentSlide);
        });
        
        indicators.forEach((indicator, index) => {
            indicator.classList.toggle('active', index === currentSlide);
        });
    }

    function nextSlide() {
        currentSlide = (currentSlide + 1) % slideCount;
        updateCarousel();
    }

    function prevSlide() {
        currentSlide = (currentSlide - 1 + slideCount) % slideCount;
        updateCarousel();
    }

    function goToSlide(index) {
        currentSlide = index;
        updateCarousel();
    }

    function startSlideShow() {
        slideInterval = setInterval(nextSlide, 5000);
    }

    function stopSlideShow() {
        clearInterval(slideInterval);
    }

    // Événements pour les boutons
    if (prevButton && nextButton) {
        prevButton.addEventListener('click', () => {
            stopSlideShow();
            prevSlide();
            startSlideShow();
        });
        
        nextButton.addEventListener('click', () => {
            stopSlideShow();
            nextSlide();
            startSlideShow();
        });
    }

    // Événements pour les indicateurs
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            stopSlideShow();
            goToSlide(index);
            startSlideShow();
        });
    });

    // Démarrage du carrousel automatique
    startSlideShow();

    // Arrêt du défilement automatique au survol
    const carouselContainer = document.querySelector('.hero-carousel');
    if (carouselContainer) {
        carouselContainer.addEventListener('mouseenter', stopSlideShow);
        carouselContainer.addEventListener('mouseleave', startSlideShow);
    }
}

/**
 * Configuration des animations au scroll
 */
function setupScrollAnimations() {
    const animatedElements = document.querySelectorAll('.animate, .animate-left, .animate-right, .animate-zoom');
    
    if (!animatedElements.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1
    });

    animatedElements.forEach(element => {
        observer.observe(element);
    });
}

/**
 * Initialisation de la carte pour la page de contact
 */
function initMap() {
    const companyLocation = [48.8698, 2.3075]; // Coordonnées pour les Champs-Élysées, Paris
    
    const map = L.map('map').setView(companyLocation, 16);
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
    
    const marker = L.marker(companyLocation).addTo(map);
    marker.bindPopup("<strong>VEGO VTC</strong><br>123 Avenue des Champs-Élysées<br>75008 Paris").openPopup();
}

/**
 * Optimisation des images pour le SEO et les performances
 */
function initImageOptimization() {
    // Préchargement des images critiques
    const criticalImages = [
        'assets/img/logo2.png',
        'assets/img/placeholder1.jpg'
    ];

    criticalImages.forEach(src => {
        const img = new Image();
        img.src = src;
    });

    // Configuration de l'Intersection Observer pour le lazy loading
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                const picture = img.closest('picture');

                if (picture) {
                    const sources = picture.querySelectorAll('source[data-srcset]');
                    sources.forEach(source => {
                        if (source.dataset.srcset) {
                            source.srcset = source.dataset.srcset;
                            delete source.dataset.srcset;
                        }
                    });
                }

                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    delete img.dataset.src;
                }

                img.classList.add('loaded');
                observer.unobserve(img);
            }
        });
    }, {
        rootMargin: '50px 0px',
        threshold: 0.01
    });

    // Observer uniquement les images non critiques
    document.querySelectorAll('img[loading="lazy"]').forEach(img => {
        if (!img.closest('.critical-section')) {
            imageObserver.observe(img);
        }
    });

    // Ajouter les attributs de performance pour le SEO
    document.querySelectorAll('img').forEach(img => {
        if (!img.hasAttribute('alt')) {
            img.alt = ''; // Pour la validation HTML
        }
        if (!img.hasAttribute('width') || !img.hasAttribute('height')) {
            img.setAttribute('width', '800');
            img.setAttribute('height', '600');
        }
    });
}