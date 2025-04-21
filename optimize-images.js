const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const inputDir = 'assets/img';
const outputDir = 'assets/img/optimized';

// Créer le dossier de sortie s'il n'existe pas
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

// Fonction pour optimiser une image
async function optimizeImage(inputPath, outputPath) {
    try {
        // Optimiser en WebP
        await sharp(inputPath)
            .webp({ quality: 80 })
            .toFile(outputPath.replace(/\.[^.]+$/, '.webp'));

        // Optimiser en JPG
        await sharp(inputPath)
            .jpeg({ quality: 80 })
            .toFile(outputPath);

        console.log(`Optimisé: ${path.basename(inputPath)}`);
    } catch (error) {
        console.error(`Erreur lors de l'optimisation de ${inputPath}:`, error);
    }
}

// Lire tous les fichiers du dossier
fs.readdir(inputDir, (err, files) => {
    if (err) {
        console.error('Erreur lors de la lecture du dossier:', err);
        return;
    }

    // Filtrer les fichiers images
    const imageFiles = files.filter(file => 
        /\.(jpg|jpeg|png)$/i.test(file) && 
        !file.includes('optimized')
    );

    // Optimiser chaque image
    imageFiles.forEach(file => {
        const inputPath = path.join(inputDir, file);
        const outputPath = path.join(outputDir, file);
        optimizeImage(inputPath, outputPath);
    });
}); 