import { getDatabase } from './src/database/database.js';
import fs from 'fs';

const db = getDatabase();

console.log('Reconstruction de la base avec le fichier nettoye...\n');

// 1. Lire le fichier nettoyé
const fileContent = fs.readFileSync('./ef_3000_words.md', 'utf8');
const lines = fileContent.split('\n');

// 2. Extraire uniquement les mots valides
const cleanWords = [];
let startExtracting = false;

for (const line of lines) {
    const trimmedLine = line.trim();

    // Commencer après avoir trouvé un mot simple comme 'a'
    if (trimmedLine === 'a' && !startExtracting) {
        startExtracting = true;
    }

    if (startExtracting && trimmedLine) {
        // Ignorer les lignes de titre, description et lignes vides
        if (!trimmedLine.startsWith('#') &&
            !trimmedLine.startsWith('[') &&
            !trimmedLine.includes('With') &&
            !trimmedLine.includes('Test') &&
            !trimmedLine.includes('Resources') &&
            trimmedLine.length > 0) {

            // Nettoyer le mot : uniquement lettres minuscules et tirets
            const cleanWord = trimmedLine.toLowerCase()
                .replace(/[^a-z-]/g, '')
                .replace(/^-+|-+$/g, '') // enlever tirets en début/fin
                .trim();

            // Ajouter seulement si le mot est valide
            if (cleanWord &&
                cleanWord.length > 1 &&
                cleanWord.length < 20 &&
                !cleanWord.includes('--') &&
                /^[a-z]+(-[a-z]+)*$/.test(cleanWord)) {

                if (!cleanWords.includes(cleanWord)) {
                    cleanWords.push(cleanWord);
                }
            }
        }
    }
}

console.log(`Mots extraits du fichier nettoye: ${cleanWords.length}`);

// Afficher les premiers mots pour vérification
console.log('\nPremiers mots extraits:');
cleanWords.slice(0, 30).forEach((word, index) => {
    console.log(`${index + 1}. ${word}`);
});

// 3. Vider la table actuelle et reconstruire
console.log('\n=== RECONSTRUCTION DE LA BASE ===');

// Sauvegarder les traductions existantes
console.log('Sauvegarde des traductions existantes...');
const existingTranslations = db.db.prepare(`
    SELECT word, translation 
    FROM words 
    WHERE translation NOT LIKE '[%]'
`).all();

const translationsMap = new Map();
existingTranslations.forEach(row => {
    translationsMap.set(row.word, row.translation);
});

console.log(`Sauvegarde de ${translationsMap.size} traductions existantes`);

// Vider la table
db.db.prepare('DELETE FROM words').run();
console.log('Table videe');

// 4. Réinsérer avec les mots propres
console.log('\nInsertion des mots propres...');

let insertedCount = 0;
let translatedCount = 0;

const insertStmt = db.db.prepare(`
    INSERT INTO words (word, translation, difficulty, category, created_at, updated_at)
    VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
`);

for (const word of cleanWords) {
    try {
        // Déterminer la difficulté basée sur la longueur et la position
        let difficulty = 'beginner';
        const wordIndex = cleanWords.indexOf(word);

        if (word.length > 6 || wordIndex > 1000) {
            difficulty = 'intermediate';
        }
        if (word.length > 8 || wordIndex > 2000) {
            difficulty = 'advanced';
        }

        // Récupérer la traduction existante ou mettre un placeholder
        const translation = translationsMap.get(word) || `[${word}]`;

        insertStmt.run(word, translation, difficulty, 'oxford-3000');
        insertedCount++;

        if (translation !== `[${word}]`) {
            translatedCount++;
        }

        if (insertedCount % 500 === 0) {
            console.log(`   ${insertedCount} mots inseres...`);
        }

    } catch (error) {
        console.error(`Erreur pour "${word}":`, error.message);
    }
}

// 5. Ajouter les mots essentiels manquants avec traductions
console.log('\nAjout des mots essentiels...');

const essentialWords = {
    'hello': 'bonjour',
    'goodbye': 'au revoir',
    'please': 's\'il vous plaît',
    'thank': 'merci',
    'sorry': 'désolé',
    'yes': 'oui',
    'no': 'non',
    'dog': 'chien',
    'water': 'eau',
    'food': 'nourriture',
    'house': 'maison',
    'love': 'amour',
    'friend': 'ami',
    'family': 'famille',
    'today': 'aujourd\'hui',
    'tomorrow': 'demain',
    'yesterday': 'hier',
    'now': 'maintenant',
    'here': 'ici',
    'there': 'là',
    'what': 'quoi',
    'who': 'qui',
    'where': 'où',
    'when': 'quand',
    'why': 'pourquoi',
    'how': 'comment'
};

let essentialAdded = 0;

for (const [word, translation] of Object.entries(essentialWords)) {
    // Vérifier si le mot existe déjà
    const existing = db.db.prepare(`
        SELECT id FROM words WHERE word = ?
    `).get(word);

    if (!existing) {
        try {
            insertStmt.run(word, translation, 'beginner', 'essential');
            essentialAdded++;
            translatedCount++;
            console.log(`  + ${word} -> ${translation}`);
        } catch (error) {
            console.error(`Erreur pour "${word}":`, error.message);
        }
    } else {
        // Mettre à jour la traduction si c'était un placeholder
        db.db.prepare(`
            UPDATE words 
            SET translation = ?, category = 'essential'
            WHERE word = ? AND translation = ?
        `).run(translation, word, `[${word}]`);
    }
}

// 6. Statistiques finales
console.log('\n=== STATISTIQUES FINALES ===');
const finalStats = {
    total: db.db.prepare('SELECT COUNT(*) as count FROM words').get().count,
    translated: db.db.prepare('SELECT COUNT(*) as count FROM words WHERE translation NOT LIKE \'[%]\'').get().count,
    untranslated: db.db.prepare('SELECT COUNT(*) as count FROM words WHERE translation LIKE \'[%]\'').get().count
};

console.log(`Total des mots: ${finalStats.total}`);
console.log(`Mots traduits: ${finalStats.translated} (${Math.round(finalStats.translated / finalStats.total * 100)}%)`);
console.log(`Mots non traduits: ${finalStats.untranslated} (${Math.round(finalStats.untranslated / finalStats.total * 100)}%)`);
console.log(`Mots essentiels ajoutes: ${essentialAdded}`);

// Test des mots critiques
console.log('\n=== TEST DES MOTS CRITIQUES ===');
const testWords = ['hello', 'beautiful', 'company', 'house', 'water', 'love'];

testWords.forEach(word => {
    const result = db.db.prepare(`
        SELECT word, translation, difficulty 
        FROM words 
        WHERE word = ?
    `).get(word);

    if (result) {
        const status = result.translation.startsWith('[') ? '❌ NON TRADUIT' : '✅ TRADUIT';
        console.log(`${status} - ${result.word} -> ${result.translation}`);
    } else {
        console.log(`⚠️  MANQUANT - ${word}`);
    }
});

console.log('\n🎉 Base de donnees reconstruite avec succes !');
console.log('✨ Tous les mots sont maintenant propres et valides');
console.log('🚀 Pret pour l\'utilisation dans l\'application');

db.db.close();
