/**
 * Classe Carousel - Composant de carrousel réutilisable
 */
class Carousel {
    constructor(options = {}) {
        this.options = {
            selector: '.carousel',           // Sélecteur du conteneur
            slideSelector: '.carousel-slide', // Sélecteur des slides
            interval: 5000,                  // Intervalle entre les transitions (ms)
            showArrows: true,               // Afficher les flèches de navigation
            showIndicators: true,           // Afficher les indicateurs
            autoplay: true,                 // Défilement automatique
            ...options
        };

        this.currentSlide = 0;
        this.slideInterval = null;
        this.isHovered = false;

        this.init();
    }

    init() {
        // Sélectionner les éléments
        this.container = document.querySelector(this.options.selector);
        if (!this.container) return;

        this.slides = this.container.querySelectorAll(this.options.slideSelector);
        if (!this.slides.length) return;

        // Créer la structure
        this.setupStructure();
        
        // Initialiser les événements
        this.setupEventListeners();

        // Démarrer le carrousel
        if (this.options.autoplay) {
            this.startSlideShow();
        }
    }

    setupStructure() {
        // Ajouter les classes nécessaires
        this.container.classList.add('carousel-container');

        // Créer les flèches de navigation
        if (this.options.showArrows) {
            this.createNavigationArrows();
        }

        // Créer les indicateurs
        if (this.options.showIndicators) {
            this.createIndicators();
        }
    }

    createNavigationArrows() {
        const prevButton = document.createElement('button');
        prevButton.className = 'carousel-arrow prev';
        prevButton.innerHTML = '<i class="fas fa-chevron-left"></i>';
        prevButton.setAttribute('aria-label', 'Slide précédente');

        const nextButton = document.createElement('button');
        nextButton.className = 'carousel-arrow next';
        nextButton.innerHTML = '<i class="fas fa-chevron-right"></i>';
        nextButton.setAttribute('aria-label', 'Slide suivante');

        this.container.appendChild(prevButton);
        this.container.appendChild(nextButton);

        this.prevButton = prevButton;
        this.nextButton = nextButton;
    }

    createIndicators() {
        const indicatorsContainer = document.createElement('div');
        indicatorsContainer.className = 'carousel-indicators';

        for (let i = 0; i < this.slides.length; i++) {
            const indicator = document.createElement('button');
            indicator.className = 'indicator';
            indicator.setAttribute('aria-label', `Slide ${i + 1}`);
            if (i === 0) indicator.classList.add('active');
            indicatorsContainer.appendChild(indicator);
        }

        this.container.appendChild(indicatorsContainer);
        this.indicators = indicatorsContainer.querySelectorAll('.indicator');
    }

    setupEventListeners() {
        // Événements des flèches
        if (this.options.showArrows) {
            this.prevButton.addEventListener('click', () => this.prevSlide());
            this.nextButton.addEventListener('click', () => this.nextSlide());
        }

        // Événements des indicateurs
        if (this.options.showIndicators) {
            this.indicators.forEach((indicator, index) => {
                indicator.addEventListener('click', () => this.goToSlide(index));
            });
        }

        // Événements de survol
        this.container.addEventListener('mouseenter', () => {
            this.isHovered = true;
            if (this.options.autoplay) this.stopSlideShow();
        });

        this.container.addEventListener('mouseleave', () => {
            this.isHovered = false;
            if (this.options.autoplay) this.startSlideShow();
        });

        // Événements tactiles
        this.setupTouchEvents();
    }

    setupTouchEvents() {
        let touchStartX = 0;
        let touchEndX = 0;

        this.container.addEventListener('touchstart', e => {
            touchStartX = e.changedTouches[0].screenX;
            if (this.options.autoplay) this.stopSlideShow();
        });

        this.container.addEventListener('touchend', e => {
            touchEndX = e.changedTouches[0].screenX;
            const diff = touchStartX - touchEndX;

            if (Math.abs(diff) > 50) {
                if (diff > 0) {
                    this.nextSlide();
                } else {
                    this.prevSlide();
                }
            }

            if (this.options.autoplay && !this.isHovered) {
                this.startSlideShow();
            }
        });
    }

    nextSlide() {
        this.slides[this.currentSlide].classList.remove('active');
        if (this.indicators) this.indicators[this.currentSlide].classList.remove('active');

        this.currentSlide++;
        if (this.currentSlide >= this.slides.length) {
            this.currentSlide = 0;
        }

        this.slides[this.currentSlide].classList.add('active');
        if (this.indicators) this.indicators[this.currentSlide].classList.add('active');
    }

    prevSlide() {
        this.slides[this.currentSlide].classList.remove('active');
        if (this.indicators) this.indicators[this.currentSlide].classList.remove('active');

        this.currentSlide--;
        if (this.currentSlide < 0) {
            this.currentSlide = this.slides.length - 1;
        }

        this.slides[this.currentSlide].classList.add('active');
        if (this.indicators) this.indicators[this.currentSlide].classList.add('active');
    }

    goToSlide(index) {
        if (index === this.currentSlide) return;

        this.slides[this.currentSlide].classList.remove('active');
        if (this.indicators) this.indicators[this.currentSlide].classList.remove('active');

        this.currentSlide = index;

        this.slides[this.currentSlide].classList.add('active');
        if (this.indicators) this.indicators[this.currentSlide].classList.add('active');
    }

    startSlideShow() {
        if (this.slideInterval) {
            clearInterval(this.slideInterval);
        }
        this.slideInterval = setInterval(() => this.nextSlide(), this.options.interval);
    }

    stopSlideShow() {
        if (this.slideInterval) {
            clearInterval(this.slideInterval);
            this.slideInterval = null;
        }
    }

    // Méthode pour détruire le carrousel
    destroy() {
        this.stopSlideShow();
        // Supprimer les événements
        // Supprimer les éléments créés
        if (this.prevButton) this.prevButton.remove();
        if (this.nextButton) this.nextButton.remove();
        if (this.indicators) {
            this.indicators.forEach(indicator => indicator.remove());
        }
    }
}

// Exporter la classe pour une utilisation en module
export default Carousel; 