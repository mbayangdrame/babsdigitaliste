const pool = require('../config/database');
const path = require('path');
const fs = require('fs');
const { createThumbnail } = require('../middleware/upload');

console.log('🔄 Régénération des thumbnails manquants...');

// Fonction pour vérifier si un fichier existe
function fileExists(filePath) {
    try {
        return fs.existsSync(filePath);
    } catch (error) {
        return false;
    }
}

// Fonction pour régénérer un thumbnail
async function regenerateThumbnail(imagePath, thumbnailPath) {
    try {
        if (!fileExists(imagePath)) {
            console.log(`❌ Image originale non trouvée: ${imagePath}`);
            return false;
        }

        // Créer le dossier thumbnail s'il n'existe pas
        const thumbnailDir = path.dirname(thumbnailPath);
        if (!fs.existsSync(thumbnailDir)) {
            fs.mkdirSync(thumbnailDir, { recursive: true });
            console.log(`📁 Dossier créé: ${thumbnailDir}`);
        }

        // Régénérer le thumbnail
        await createThumbnail(imagePath);
        console.log(`✅ Thumbnail régénéré: ${path.basename(thumbnailPath)}`);
        return true;
    } catch (error) {
        console.error(`❌ Erreur lors de la régénération du thumbnail: ${error.message}`);
        return false;
    }
}

// Fonction principale
async function regenerateMissingThumbnails() {
    try {
        console.log('📊 Récupération des images depuis la base de données...');
        
        // Récupérer toutes les images
        const result = await pool.query(`
            SELECT id, image_url, thumbnail_url, title 
            FROM images 
            ORDER BY created_at DESC
        `);

        console.log(`📋 ${result.rows.length} images trouvées dans la base de données`);

        const uploadPath = process.env.UPLOAD_PATH || path.join(__dirname, '..', 'uploads');
        let successCount = 0;
        let errorCount = 0;
        let skippedCount = 0;

        for (const image of result.rows) {
            console.log(`\n🔍 Traitement de l'image: ${image.title || image.id}`);
            
            // Chemins des fichiers
            const imagePath = path.join(uploadPath, image.image_url);
            const thumbnailPath = image.thumbnail_url ? path.join(uploadPath, image.thumbnail_url) : null;

            // Vérifier si l'image originale existe
            if (!fileExists(imagePath)) {
                console.log(`❌ Image originale manquante: ${image.image_url}`);
                errorCount++;
                continue;
            }

            // Vérifier si le thumbnail existe
            if (thumbnailPath && fileExists(thumbnailPath)) {
                console.log(`✅ Thumbnail existe déjà: ${image.thumbnail_url}`);
                skippedCount++;
                continue;
            }

            // Régénérer le thumbnail
            console.log(`🔄 Régénération du thumbnail pour: ${image.image_url}`);
            const success = await regenerateThumbnail(imagePath, thumbnailPath);
            
            if (success) {
                successCount++;
                
                // Mettre à jour la base de données si nécessaire
                if (!image.thumbnail_url) {
                    const newThumbnailUrl = image.image_url.replace(/\.(jpg|jpeg|png|gif|webp)$/i, '_thumb.$1');
                    await pool.query(
                        'UPDATE images SET thumbnail_url = $1 WHERE id = $2',
                        [newThumbnailUrl, image.id]
                    );
                    console.log(`📝 Base de données mise à jour pour l'image ${image.id}`);
                }
            } else {
                errorCount++;
            }
        }

        console.log('\n📊 Résumé de la régénération:');
        console.log(`✅ Thumbnails régénérés avec succès: ${successCount}`);
        console.log(`⏭️  Thumbnails ignorés (déjà existants): ${skippedCount}`);
        console.log(`❌ Erreurs: ${errorCount}`);
        console.log(`📋 Total traité: ${result.rows.length}`);

    } catch (error) {
        console.error('❌ Erreur lors de la régénération:', error);
        process.exit(1);
    } finally {
        await pool.end();
    }
}

// Exécution du script
regenerateMissingThumbnails(); 