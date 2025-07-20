import { getDatabase } from './src/database/database.js';
import fs from 'fs';

const db = getDatabase();

console.log('Extraction et ajout des 3000 mots Oxford...\n');

// Lire le fichier Markdown
const fileContent = fs.readFileSync('./ef_3000_words.md', 'utf8');

// Extraire tous les mots après la description
const lines = fileContent.split('\n');
let startExtracting = false;
const extractedWords = [];

for (const line of lines) {
    const trimmedLine = line.trim();

    // Commencer après la description
    if (trimmedLine === 'a' && !startExtracting) {
        startExtracting = true;
    }

    if (startExtracting && trimmedLine) {
        // Ignorer les lignes de titre et les lignes vides
        if (!trimmedLine.startsWith('#') &&
            !trimmedLine.startsWith('[') &&
            !trimmedLine.includes('With 2,500') &&
            !trimmedLine.includes('Test your English') &&
            trimmedLine.length > 0) {

            // Nettoyer le mot (enlever les espaces, ponctuation)
            const cleanWord = trimmedLine.toLowerCase().replace(/[^a-z-]/g, '');
            if (cleanWord && cleanWord.length > 1) {
                extractedWords.push(cleanWord);
            }
        }
    }
}

console.log(`Trouve ${extractedWords.length} mots a traiter`);

// Afficher les premiers mots pour vérification
console.log('\nPremiers mots extraits:');
extractedWords.slice(0, 20).forEach((word, index) => {
    console.log(`${index + 1}. ${word}`);
});

// Fonction pour ajouter les mots en base
function addWordsToDatabase() {
    let added = 0;
    let skipped = 0;
    let updated = 0;

    console.log('\nAjout des mots en base de donnees...');

    for (const word of extractedWords) {
        try {
            // Vérifier si le mot existe déjà
            const existing = db.db.prepare(`
                SELECT id, translation FROM words WHERE word = ?
            `).get(word);

            if (existing) {
                // Si le mot existe et n'a pas de traduction correcte, on met à jour
                if (existing.translation === `[${word}]`) {
                    const updateStmt = db.db.prepare(`
                        UPDATE words 
                        SET updated_at = CURRENT_TIMESTAMP
                        WHERE word = ?
                    `);
                    updateStmt.run(word);
                    updated++;
                } else {
                    skipped++;
                }
            } else {
                // Ajouter le nouveau mot avec traduction placeholder
                const insertStmt = db.db.prepare(`
                    INSERT INTO words (word, translation, difficulty, category, created_at, updated_at)
                    VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
                `);

                // Déterminer la difficulté basée sur la longueur et la fréquence
                let difficulty = 'beginner';
                if (word.length > 6 || extractedWords.indexOf(word) > 1000) {
                    difficulty = 'intermediate';
                }
                if (word.length > 8 || extractedWords.indexOf(word) > 2000) {
                    difficulty = 'advanced';
                }

                insertStmt.run(word, `[${word}]`, difficulty, 'oxford-3000');
                added++;

                if (added % 100 === 0) {
                    console.log(`   ${added} mots ajoutes...`);
                }
            }
        } catch (error) {
            console.error(`Erreur pour "${word}":`, error.message);
        }
    }

    return { added, skipped, updated };
}

// Traitement
const result = addWordsToDatabase();

// Statistiques finales
const totalWords = db.db.prepare('SELECT COUNT(*) as count FROM words').get().count;
const translatedWords = db.db.prepare('SELECT COUNT(*) as count FROM words WHERE translation NOT LIKE \'[%]\'').get().count;
const untranslatedWords = db.db.prepare('SELECT COUNT(*) as count FROM words WHERE translation LIKE \'[%]\'').get().count;

console.log('\n--- Resume de l operation:');
console.log(`   + Nouveaux mots ajoutes: ${result.added}`);
console.log(`   - Mots existants ignores: ${result.skipped}`);
console.log(`   * Mots mis a jour: ${result.updated}`);
console.log('\n--- Statistiques de la base:');
console.log(`   Total des mots: ${totalWords}`);
console.log(`   Mots traduits: ${translatedWords} (${Math.round(translatedWords / totalWords * 100)}%)`);
console.log(`   Mots a traduire: ${untranslatedWords} (${Math.round(untranslatedWords / totalWords * 100)}%)`);

console.log('\nBase de donnees Oxford 3000 mise a jour avec succes !');

// Recommandations
if (untranslatedWords > 0) {
    console.log('\nProchaines etapes recommandees:');
    console.log('   1. Utiliser un service de traduction pour les mots restants');
    console.log('   2. Ajouter manuellement les traductions des mots les plus courants');
    console.log('   3. Integrer un API de traduction pour automatiser le processus');
}

db.db.close();
