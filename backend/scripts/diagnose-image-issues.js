const pool = require('../config/database');
const path = require('path');
const fs = require('fs');

console.log('🔍 Diagnostic des problèmes d\'images...\n');

// Fonction pour vérifier si un fichier existe
function fileExists(filePath) {
    try {
        return fs.existsSync(filePath);
    } catch (error) {
        return false;
    }
}

// Fonction pour obtenir la taille d'un fichier
function getFileSize(filePath) {
    try {
        const stats = fs.statSync(filePath);
        return stats.size;
    } catch (error) {
        return 0;
    }
}

// Fonction principale de diagnostic
async function diagnoseImageIssues() {
    try {
        console.log('📊 Récupération des images depuis la base de données...');
        
        // Récupérer toutes les images
        const result = await pool.query(`
            SELECT id, image_url, thumbnail_url, title, album_name, created_at
            FROM images 
            ORDER BY created_at DESC
        `);

        console.log(`📋 ${result.rows.length} images trouvées dans la base de données\n`);

        const uploadPath = process.env.UPLOAD_PATH || path.join(__dirname, '..', 'uploads');
        console.log(`📂 Chemin d'upload configuré: ${uploadPath}\n`);

        let totalImages = 0;
        let missingOriginalImages = 0;
        let missingThumbnails = 0;
        let corruptedImages = 0;
        let healthyImages = 0;

        const issues = [];

        for (const image of result.rows) {
            totalImages++;
            console.log(`🔍 Vérification de l'image: ${image.title || `ID ${image.id}`}`);
            
            // Chemins des fichiers
            const imagePath = path.join(uploadPath, image.image_url);
            const thumbnailPath = image.thumbnail_url ? path.join(uploadPath, image.thumbnail_url) : null;

            // Vérifier l'image originale
            if (!fileExists(imagePath)) {
                console.log(`  ❌ Image originale manquante: ${image.image_url}`);
                missingOriginalImages++;
                issues.push({
                    type: 'missing_original',
                    image: image,
                    path: imagePath
                });
                continue;
            }

            // Vérifier la taille de l'image originale
            const originalSize = getFileSize(imagePath);
            if (originalSize === 0) {
                console.log(`  ⚠️  Image originale corrompue (taille 0): ${image.image_url}`);
                corruptedImages++;
                issues.push({
                    type: 'corrupted_original',
                    image: image,
                    path: imagePath,
                    size: originalSize
                });
                continue;
            }

            // Vérifier le thumbnail
            if (image.thumbnail_url) {
                if (!fileExists(thumbnailPath)) {
                    console.log(`  ❌ Thumbnail manquant: ${image.thumbnail_url}`);
                    missingThumbnails++;
                    issues.push({
                        type: 'missing_thumbnail',
                        image: image,
                        thumbnailPath: thumbnailPath
                    });
                } else {
                    const thumbnailSize = getFileSize(thumbnailPath);
                    if (thumbnailSize === 0) {
                        console.log(`  ⚠️  Thumbnail corrompu (taille 0): ${image.thumbnail_url}`);
                        missingThumbnails++;
                        issues.push({
                            type: 'corrupted_thumbnail',
                            image: image,
                            thumbnailPath: thumbnailPath,
                            size: thumbnailSize
                        });
                    } else {
                        console.log(`  ✅ Image et thumbnail OK (${originalSize} bytes)`);
                        healthyImages++;
                    }
                }
            } else {
                console.log(`  ⚠️  Pas de thumbnail défini pour: ${image.image_url}`);
                missingThumbnails++;
                issues.push({
                    type: 'no_thumbnail_defined',
                    image: image
                });
            }
        }

        // Résumé
        console.log('\n📊 Résumé du diagnostic:');
        console.log('=====================================');
        console.log(`📋 Total d'images: ${totalImages}`);
        console.log(`✅ Images saines: ${healthyImages}`);
        console.log(`❌ Images originales manquantes: ${missingOriginalImages}`);
        console.log(`❌ Thumbnails manquants/corrompus: ${missingThumbnails}`);
        console.log(`⚠️  Images corrompues: ${corruptedImages}`);

        // Recommandations
        console.log('\n💡 Recommandations:');
        if (missingOriginalImages > 0) {
            console.log(`  - ${missingOriginalImages} images originales manquantes nécessitent une restauration`);
        }
        if (missingThumbnails > 0) {
            console.log(`  - ${missingThumbnails} thumbnails à régénérer avec: npm run regenerate-thumbnails`);
        }
        if (corruptedImages > 0) {
            console.log(`  - ${corruptedImages} images corrompues nécessitent une attention particulière`);
        }

        // Détails des problèmes
        if (issues.length > 0) {
            console.log('\n🔍 Détails des problèmes:');
            console.log('========================');
            
            const missingOriginals = issues.filter(i => i.type === 'missing_original');
            if (missingOriginals.length > 0) {
                console.log('\n❌ Images originales manquantes:');
                missingOriginals.forEach(issue => {
                    console.log(`  - ${issue.image.title || `ID ${issue.image.id}`}: ${issue.image.image_url}`);
                });
            }

            const missingThumbs = issues.filter(i => i.type === 'missing_thumbnail' || i.type === 'no_thumbnail_defined');
            if (missingThumbs.length > 0) {
                console.log('\n❌ Thumbnails manquants:');
                missingThumbs.forEach(issue => {
                    console.log(`  - ${issue.image.title || `ID ${issue.image.id}`}: ${issue.image.thumbnail_url || 'Non défini'}`);
                });
            }
        }

        // Vérification du stockage
        console.log('\n💾 Vérification du stockage:');
        console.log('============================');
        if (fs.existsSync(uploadPath)) {
            const stats = fs.statSync(uploadPath);
            console.log(`📂 Dossier uploads: ${uploadPath}`);
            console.log(`📊 Taille: ${(stats.size / 1024 / 1024).toFixed(2)} MB`);
            
            const files = fs.readdirSync(uploadPath);
            console.log(`📄 Fichiers dans uploads: ${files.length}`);
            
            if (fs.existsSync(path.join(uploadPath, 'thumbnails'))) {
                const thumbFiles = fs.readdirSync(path.join(uploadPath, 'thumbnails'));
                console.log(`🖼️  Thumbnails: ${thumbFiles.length}`);
            } else {
                console.log('❌ Dossier thumbnails manquant');
            }
        } else {
            console.log('❌ Dossier uploads inexistant');
        }

    } catch (error) {
        console.error('❌ Erreur lors du diagnostic:', error);
        process.exit(1);
    } finally {
        await pool.end();
    }
}

// Exécution du diagnostic
diagnoseImageIssues(); 