/**
 * VEGO VTC - Main JavaScript File
 * Version: 1.0
 * Description: Scripts pour les interactions du site VEGO VTC
 */

// Attendre que le DOM soit complètement chargé
document.addEventListener('DOMContentLoaded', function() {
    // Navigation mobile
    setupMobileNav();
    
    // Carousel
    setupCarousels();
    
    // Accordéon FAQ
    setupAccordion();
    
    // Témoignages
    setupTestimonials();
    
    // Map (seulement sur la page de contact)
    if (document.getElementById('map')) {
        initMap();
    }
    
    // Formulaire de contact
    setupContactForm();
    
    // Configuration du carrousel hero
    setupHeroCarousel();
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
    // Carousel de véhicules (page d'accueil)
    const carouselTrack = document.querySelector('.carousel-track');
    const slides = document.querySelectorAll('.carousel-slide');
    const prevButton = document.querySelector('.carousel-button.prev');
    const nextButton = document.querySelector('.carousel-button.next');
    const indicators = document.querySelectorAll('.carousel-indicators .indicator');

    let currentSlide = 0;
    const slideCount = slides.length;

    function updateCarousel() {
        carouselTrack.style.transform = `translateX(-${currentSlide * 100}%)`;
        
        // Mise à jour des indicateurs
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

    // Événements pour les boutons
    if (prevButton && nextButton) {
        prevButton.addEventListener('click', prevSlide);
        nextButton.addEventListener('click', nextSlide);
    }

    // Événements pour les indicateurs
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            currentSlide = index;
            updateCarousel();
        });
    });

    // Défilement automatique du carrousel
    let carouselInterval = setInterval(nextSlide, 5000);

    // Arrêt du défilement automatique au survol
    carouselTrack.addEventListener('mouseenter', () => {
        clearInterval(carouselInterval);
    });

    carouselTrack.addEventListener('mouseleave', () => {
        carouselInterval = setInterval(nextSlide, 5000);
    });

    // Animation au défilement
    const animateOnScroll = function() {
        const elements = document.querySelectorAll('.section, .service-card, .carousel-slide');
        
        elements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementBottom = element.getBoundingClientRect().bottom;
            
            if (elementTop < window.innerHeight && elementBottom > 0) {
                element.classList.add('animate');
            }
        });
    };

    window.addEventListener('scroll', animateOnScroll);
    animateOnScroll(); // Appel initial pour les éléments visibles au chargement
}

/**
 * Configuration des accordéons FAQ
 */
function setupAccordion() {
    const accordionHeaders = document.querySelectorAll('.accordion-header');
    
    if (accordionHeaders.length > 0) {
        accordionHeaders.forEach(header => {
            header.addEventListener('click', () => {
                // Toggle active class
                header.classList.toggle('active');
                
                // Get the content
                const content = header.nextElementSibling;
                
                // Toggle active class on content
                content.classList.toggle('active');
            });
        });
    }
}

/**
 * Configuration du slider de témoignages
 */
function setupTestimonials() {
    const testimonialSlides = document.querySelectorAll('.testimonial-slide');
    
    if (testimonialSlides.length > 0) {
        const prevButton = document.querySelector('.testimonial-prev');
        const nextButton = document.querySelector('.testimonial-next');
        const dots = document.querySelectorAll('.testimonial-dots .dot');
        
        let currentTestimonialIndex = 0;
        
        // Fonction pour naviguer vers un témoignage spécifique
        function goToTestimonial(index) {
            if (index < 0) {
                index = testimonialSlides.length - 1;
            } else if (index >= testimonialSlides.length) {
                index = 0;
            }
            
            // Masquer tous les témoignages
            testimonialSlides.forEach(slide => {
                slide.classList.remove('active');
            });
            
            // Afficher le témoignage actif
            testimonialSlides[index].classList.add('active');
            
            // Mettre à jour les points
            dots.forEach((dot, i) => {
                dot.classList.toggle('active', i === index);
            });
            
            currentTestimonialIndex = index;
        }
        
        // Événements pour les boutons précédent/suivant
        if (prevButton) {
            prevButton.addEventListener('click', () => {
                goToTestimonial(currentTestimonialIndex - 1);
            });
        }
        
        if (nextButton) {
            nextButton.addEventListener('click', () => {
                goToTestimonial(currentTestimonialIndex + 1);
            });
        }
        
        // Événements pour les points
        if (dots) {
            dots.forEach((dot, i) => {
                dot.addEventListener('click', () => {
                    goToTestimonial(i);
                });
            });
        }
        
        // Défilement automatique
        setInterval(() => {
            if (document.visibilityState === 'visible') {
                goToTestimonial(currentTestimonialIndex + 1);
            }
        }, 7000);
    }
}

/**
 * Initialisation de la carte pour la page de contact
 */
function initMap() {
    // Coordonnées pour les Champs-Élysées, Paris (exemple)
    const companyLocation = [48.8698, 2.3075]; 
    
    // Créer une carte centrée sur les coordonnées de l'entreprise
    const map = L.map('map').setView(companyLocation, 16);
    
    // Ajouter une couche OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
    
    // Ajouter un marqueur pour l'entreprise
    const marker = L.marker(companyLocation).addTo(map);
    
    // Ajouter une popup au marqueur
    marker.bindPopup("<strong>VEGO VTC</strong><br>123 Avenue des Champs-Élysées<br>75008 Paris").openPopup();
}

/**
 * Configuration du formulaire de contact avec validation
 */
function setupContactForm() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            // Obtenir les champs
            const nameInput = document.getElementById('name');
            const emailInput = document.getElementById('email');
            const phoneInput = document.getElementById('phone');
            const messageInput = document.getElementById('message');
            const privacyCheckbox = document.getElementById('privacy');
            
            // Valider les champs
            let isValid = true;
            
            // Validation du nom
            if (nameInput.value.trim() === '') {
                showError(nameInput, 'Veuillez entrer votre nom');
                isValid = false;
            } else {
                removeError(nameInput);
            }
            
            // Validation de l'email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (emailInput.value.trim() === '') {
                showError(emailInput, 'Veuillez entrer votre email');
                isValid = false;
            } else if (!emailRegex.test(emailInput.value)) {
                showError(emailInput, 'Veuillez entrer un email valide');
                isValid = false;
            } else {
                removeError(emailInput);
            }
            
            // Validation du téléphone
            const phoneRegex = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/;
            if (phoneInput.value.trim() === '') {
                showError(phoneInput, 'Veuillez entrer votre numéro de téléphone');
                isValid = false;
            } else if (!phoneRegex.test(phoneInput.value)) {
                showError(phoneInput, 'Veuillez entrer un numéro de téléphone valide');
                isValid = false;
            } else {
                removeError(phoneInput);
            }
            
            // Validation du message
            if (messageInput.value.trim() === '') {
                showError(messageInput, 'Veuillez entrer un message');
                isValid = false;
            } else {
                removeError(messageInput);
            }
            
            // Validation de la case à cocher
            if (!privacyCheckbox.checked) {
                showError(privacyCheckbox, 'Vous devez accepter la politique de confidentialité');
                isValid = false;
            } else {
                removeError(privacyCheckbox);
            }
            
            // Si tout est valide, simuler l'envoi du formulaire
            if (isValid) {
                // Simuler l'envoi du formulaire (dans un projet réel, cela serait remplacé par un vrai envoi AJAX)
                const submitButton = contactForm.querySelector('button[type="submit"]');
                const originalText = submitButton.textContent;
                
                submitButton.textContent = 'Envoi en cours...';
                submitButton.disabled = true;
                
                // Simuler un délai de traitement
                setTimeout(() => {
                    // Afficher un message de succès
                    const successMessage = document.createElement('div');
                    successMessage.className = 'alert alert-success';
                    successMessage.innerHTML = '<i class="fas fa-check-circle"></i> Votre message a été envoyé avec succès! Nous vous contacterons bientôt.';
                    
                    // Insérer le message avant le formulaire
                    contactForm.parentNode.insertBefore(successMessage, contactForm);
                    
                    // Réinitialiser le formulaire
                    contactForm.reset();
                    
                    // Rétablir le bouton
                    submitButton.textContent = originalText;
                    submitButton.disabled = false;
                    
                    // Faire défiler jusqu'au message de succès
                    successMessage.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    
                    // Supprimer le message après 5 secondes
                    setTimeout(() => {
                        successMessage.remove();
                    }, 5000);
                }, 1500);
            }
        });
    }
}

/**
 * Affiche un message d'erreur pour un champ de formulaire
 */
function showError(input, message) {
    // Obtenir le parent du champ
    const formGroup = input.closest('.form-group');
    
    // Supprimer les messages d'erreur existants
    removeError(input);
    
    // Ajouter la classe d'erreur au groupe de formulaire
    formGroup.classList.add('has-error');
    
    // Créer l'élément du message d'erreur
    const errorMessage = document.createElement('div');
    errorMessage.className = 'error-message';
    errorMessage.style.color = 'var(--danger)';
    errorMessage.style.fontSize = '0.8rem';
    errorMessage.style.marginTop = '5px';
    errorMessage.textContent = message;
    
    // Ajouter le message d'erreur au groupe de formulaire
    formGroup.appendChild(errorMessage);
    
    // Ajouter une bordure rouge au champ
    if (input.type !== 'checkbox') {
        input.style.borderColor = 'var(--danger)';
    }
}

/**
 * Supprime le message d'erreur pour un champ de formulaire
 */
function removeError(input) {
    // Obtenir le parent du champ
    const formGroup = input.closest('.form-group');
    
    // Supprimer la classe d'erreur
    formGroup.classList.remove('has-error');
    
    // Supprimer les messages d'erreur
    const errorMessage = formGroup.querySelector('.error-message');
    if (errorMessage) {
        errorMessage.remove();
    }
    
    // Réinitialiser la bordure du champ
    if (input.type !== 'checkbox') {
        input.style.borderColor = '';
    }
}

/**
 * Ajouter des effets d'animation au défilement
 */
window.addEventListener('scroll', function() {
    const sections = document.querySelectorAll('.section');
    
    sections.forEach(section => {
        const sectionTop = section.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        
        // Si la section est dans la vue
        if (sectionTop < windowHeight * 0.75) {
            section.classList.add('fade-in');
        }
    });
});


/**
 * Configuration du carrousel hero
 */
function setupHeroCarousel() {
    const slides = document.querySelectorAll('.hero-carousel .carousel-slide');
    const prevButton = document.querySelector('.hero-carousel .carousel-arrow.prev');
    const nextButton = document.querySelector('.hero-carousel .carousel-arrow.next');
    
    // Vérifier si les éléments existent
    if (!slides.length || !prevButton || !nextButton) return;
    
    // Créer des indicateurs si nécessaire
    let indicators = document.querySelectorAll('.hero-carousel .carousel-indicators .indicator');
    if (!indicators.length) {
        // Si vous n'avez pas d'indicateurs dans votre HTML, ce code les créera
        const indicatorsContainer = document.createElement('div');
        indicatorsContainer.className = 'carousel-indicators';
        slides[0].parentNode.appendChild(indicatorsContainer);
        
        for (let i = 0; i < slides.length; i++) {
            const indicator = document.createElement('button');
            indicator.className = 'indicator';
            indicator.setAttribute('aria-label', `Slide ${i + 1}`);
            if (i === 0) indicator.classList.add('active');
            indicatorsContainer.appendChild(indicator);
        }
        
        indicators = document.querySelectorAll('.hero-carousel .carousel-indicators .indicator');
    }
    
    let currentSlide = 0;
    let slideInterval;
    const intervalTime = 5000; // 5 secondes entre chaque transition

    // Fonction pour passer à la slide suivante
    function nextSlide() {
        // Désactiver la slide actuelle
        slides[currentSlide].classList.remove('active');
        if (indicators[currentSlide]) indicators[currentSlide].classList.remove('active');
        
        // Passer à la slide suivante ou revenir à la première
        currentSlide++;
        // CORRECTION ICI : utiliser une comparaison (===) au lieu d'une assignation (=)
        if (currentSlide >= slides.length) {
            currentSlide = 0; // Revenir à la première slide
        }
        
        // Activer la nouvelle slide
        slides[currentSlide].classList.add('active');
        if (indicators[currentSlide]) indicators[currentSlide].classList.add('active');
    }

    // Fonction pour passer à la slide précédente
    function prevSlide() {
        // Désactiver la slide actuelle
        slides[currentSlide].classList.remove('active');
        if (indicators[currentSlide]) indicators[currentSlide].classList.remove('active');
        
        // Passer à la slide précédente ou aller à la dernière
        currentSlide--;
        if (currentSlide < 0) {
            currentSlide = slides.length - 1; // Aller à la dernière slide
        }
        
        // Activer la nouvelle slide
        slides[currentSlide].classList.add('active');
        if (indicators[currentSlide]) indicators[currentSlide].classList.add('active');
    }

    // Fonction pour aller à une slide spécifique
    function goToSlide(index) {
        if (index === currentSlide) return;
        
        // Désactiver la slide actuelle
        slides[currentSlide].classList.remove('active');
        if (indicators[currentSlide]) indicators[currentSlide].classList.remove('active');
        
        // Mettre à jour l'index
        currentSlide = index;
        
        // Activer la nouvelle slide
        slides[currentSlide].classList.add('active');
        if (indicators[currentSlide]) indicators[currentSlide].classList.add('active');
    }

    // Démarrer le défilement automatique
    function startSlideShow() {
        // Nettoyer l'intervalle existant avant d'en créer un nouveau
        if (slideInterval) {
            clearInterval(slideInterval);
        }
        slideInterval = setInterval(nextSlide, intervalTime);
    }

    // Arrêter le défilement automatique
    function stopSlideShow() {
        if (slideInterval) {
            clearInterval(slideInterval);
            slideInterval = null;
        }
    }

    // Événements pour les boutons de navigation
    if (prevButton) {
        prevButton.addEventListener('click', () => {
            prevSlide();
            stopSlideShow();
            startSlideShow();
        });
    }

    if (nextButton) {
        nextButton.addEventListener('click', () => {
            nextSlide();
            stopSlideShow();
            startSlideShow();
        });
    }

    // Événements pour les indicateurs
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            goToSlide(index);
            stopSlideShow();
            startSlideShow();
        });
    });

    // Pause au survol
    const carousel = document.querySelector('.hero-carousel');
    if (carousel) {
        carousel.addEventListener('mouseenter', stopSlideShow);
        carousel.addEventListener('mouseleave', startSlideShow);

        // Gestion du swipe sur mobile
        let touchStartX = 0;
        let touchEndX = 0;

        carousel.addEventListener('touchstart', e => {
            touchStartX = e.changedTouches[0].screenX;
            stopSlideShow();
        });

        carousel.addEventListener('touchend', e => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
            startSlideShow();
        });

        function handleSwipe() {
            const swipeThreshold = 50;
            const diff = touchStartX - touchEndX;

            if (Math.abs(diff) > swipeThreshold) {
                if (diff > 0) {
                    nextSlide(); // Swipe vers la gauche -> slide suivante
                } else {
                    prevSlide(); // Swipe vers la droite -> slide précédente
                }
            }
        }
    }

    // Démarrer le carrousel
    startSlideShow();
}
// Solution radicale - DÉSACTIVE D'ABORD TOUTES LES ANIMATIONS, puis les RÉACTIVE AU DÉFILEMENT

// 1. Créer une classe CSS qui annule toutes les animations
const styleElement = document.createElement('style');
styleElement.textContent = `
  .no-animation {
    opacity: 1 !important;
    transform: none !important;
    transition: none !important;
  }
`;
document.head.appendChild(styleElement);

// 2. Fonction d'initialisation qui s'exécute immédiatement
function disableInitialAnimations() {
  // Ajouter la classe no-animation à tous les éléments animés
  document.querySelectorAll('.animate, .animate-left, .animate-right, .animate-zoom').forEach(el => {
    el.classList.add('no-animation');
    el.classList.add('visible');  // Assurer que tout est visible
  });
  
  console.log('Toutes les animations ont été désactivées au chargement');
}

// 3. Fonction qui réactive les animations uniquement pour les éléments non visibles
function setupScrollAnimations() {
  // Petit délai pour s'assurer que tout est rendu
  setTimeout(() => {
    const elements = document.querySelectorAll('.animate, .animate-left, .animate-right, .animate-zoom');
    const windowHeight = window.innerHeight;
    
    elements.forEach(el => {
      const rect = el.getBoundingClientRect();
      
      // Si l'élément est complètement hors de l'écran (en dessous)
      if (rect.top >= windowHeight) {
        // Réactiver l'animation pour cet élément
        el.classList.remove('no-animation');
        el.classList.remove('visible');
        
        console.log('Animation réactivée pour élément hors écran:', el);
      }
    });
    
    // Maintenant configurer la détection au défilement normale
    window.addEventListener('scroll', handleScroll);
    console.log('Écouteur de défilement configuré');
  }, 200);
}

// 4. Gérer les animations au défilement
function handleScroll() {
  const elements = document.querySelectorAll('.animate:not(.visible), .animate-left:not(.visible), .animate-right:not(.visible), .animate-zoom:not(.visible)');
  const windowHeight = window.innerHeight;
  
  elements.forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.top < windowHeight - 100) {
      el.classList.add('visible');
    }
  });
}

// Exécution séquentielle
// 1. Désactiver immédiatement toutes les animations au chargement du DOM
document.addEventListener('DOMContentLoaded', disableInitialAnimations);

// 2. Configurer les animations au défilement après le chargement complet
window.addEventListener('load', setupScrollAnimations);