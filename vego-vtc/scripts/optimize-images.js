const sharp = require('sharp');
const fs = require('fs').promises;
const path = require('path');

const sizes = {
    small: 400,
    medium: 800,
    large: 1200
};

async function optimizeImages() {
    try {
        // Créer le dossier optimized s'il n'existe pas
        const optimizedDir = path.join(__dirname, '../assets/img/optimized');
        await fs.mkdir(optimizedDir, { recursive: true });

        // Lire le dossier des images sources
        const sourceDir = path.join(__dirname, '../assets/img');
        const files = await fs.readdir(sourceDir);

        // Filtrer pour ne garder que les images
        const imageFiles = files.filter(file => 
            /\.(jpg|jpeg|png)$/i.test(file) && 
            !file.includes('-small') && 
            !file.includes('-medium') && 
            !file.includes('-large')
        );

        // Traiter chaque image
        for (const file of imageFiles) {
            const filePath = path.join(sourceDir, file);
            const fileName = path.parse(file).name;

            // Créer les différentes tailles
            for (const [size, width] of Object.entries(sizes)) {
                // Version JPG/PNG
                await sharp(filePath)
                    .resize(width, null, { 
                        withoutEnlargement: true,
                        fit: 'inside'
                    })
                    .toFile(path.join(optimizedDir, `${fileName}-${size}.${path.parse(file).ext}`));

                // Version WebP
                await sharp(filePath)
                    .resize(width, null, { 
                        withoutEnlargement: true,
                        fit: 'inside'
                    })
                    .webp({ quality: 80 })
                    .toFile(path.join(optimizedDir, `${fileName}-${size}.webp`));
            }

            console.log(`✅ Image optimisée : ${file}`);
        }

        console.log('🎉 Optimisation terminée !');
    } catch (error) {
        console.error('❌ Erreur :', error);
    }
}

optimizeImages(); 