// Importer le composant Carousel
import Carousel from '../components/Carousel.js';

// Exemple d'utilisation simple
const simpleCarousel = new Carousel({
    selector: '#simple-carousel'
});

// Exemple d'utilisation avec options personnalisées
const customCarousel = new Carousel({
    selector: '#custom-carousel',
    interval: 3000,           // Transition toutes les 3 secondes
    showArrows: true,
    showIndicators: true,
    autoplay: true
});

// Exemple d'utilisation avec contrôle manuel
const manualCarousel = new Carousel({
    selector: '#manual-carousel',
    autoplay: false,         // Désactiver le défilement automatique
    showArrows: true,
    showIndicators: false    // Masquer les indicateurs
});

// Exemple d'utilisation avec des méthodes publiques
const controlledCarousel = new Carousel({
    selector: '#controlled-carousel'
});

// Exemple de contrôle programmatique
document.getElementById('next-btn').addEventListener('click', () => {
    controlledCarousel.nextSlide();
});

document.getElementById('prev-btn').addEventListener('click', () => {
    controlledCarousel.prevSlide();
});

// Exemple de nettoyage lors de la suppression
function removeCarousel() {
    controlledCarousel.destroy();
} 