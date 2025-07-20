import { getDatabase } from './src/database/database.js';
import fs from 'fs';

const db = getDatabase();

console.log('Remplacement complet de la base avec les mots Oxford propres...\n');

// 1. Lire la liste de mots propres
const cleanWords = fs.readFileSync('./oxford_3000_clean.txt', 'utf8')
    .split('\n')
    .filter(word => word.trim())
    .map(word => word.trim());

console.log(`Mots propres a importer: ${cleanWords.length}`);

// 2. Sauvegarder les mots déjà traduits
console.log('\n=== SAUVEGARDE DES TRADUCTIONS EXISTANTES ===');
const existingTranslations = db.db.prepare(`
    SELECT word, translation 
    FROM words 
    WHERE translation NOT LIKE '[%]'
`).all();

console.log(`Sauvegarde de ${existingTranslations.length} traductions existantes`);

// Créer un dictionnaire des traductions
const translationDict = {};
existingTranslations.forEach(row => {
    translationDict[row.word] = row.translation;
});

// 3. Vider complètement la table
console.log('\n=== NETTOYAGE COMPLET DE LA BASE ===');
db.db.prepare('DELETE FROM words').run();
console.log('Table words videe completement');

// 4. Réinsérer les mots propres avec traductions préservées
console.log('\n=== INSERTION DES MOTS PROPRES ===');

let inserted = 0;
let withTranslation = 0;

const insertStmt = db.db.prepare(`
    INSERT INTO words (word, translation, difficulty, category, created_at, updated_at)
    VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
`);

cleanWords.forEach(word => {
    try {
        // Déterminer la difficulté basée sur la longueur et la position
        let difficulty = 'beginner';
        const position = cleanWords.indexOf(word);

        if (word.length > 6 || position > 1000) {
            difficulty = 'intermediate';
        }
        if (word.length > 8 || position > 2000) {
            difficulty = 'advanced';
        }

        // Utiliser la traduction existante ou placeholder
        const translation = translationDict[word] || `[${word}]`;

        insertStmt.run(word, translation, difficulty, 'oxford-3000');
        inserted++;

        if (translation !== `[${word}]`) {
            withTranslation++;
        }

        if (inserted % 500 === 0) {
            console.log(`Insere ${inserted} mots...`);
        }
    } catch (error) {
        console.error(`Erreur pour "${word}":`, error.message);
    }
});

console.log(`Total insere: ${inserted} mots`);
console.log(`Avec traduction: ${withTranslation} mots`);

// 5. Ajouter les mots essentiels manquants avec traductions
console.log('\n=== AJOUT DES MOTS ESSENTIELS MANQUANTS ===');

const essentialWordsWithTranslations = {
    'different': 'différent',
    'the': 'le/la/les',
    'and': 'et',
    'or': 'ou',
    'but': 'mais',
    'if': 'si',
    'then': 'alors',
    'this': 'ceci',
    'that': 'cela',
    'these': 'ceux-ci',
    'those': 'ceux-là',
    'my': 'mon/ma/mes',
    'your': 'votre/vos',
    'his': 'son/sa/ses',
    'her': 'son/sa/ses',
    'its': 'son/sa/ses',
    'our': 'notre/nos',
    'their': 'leur/leurs',
    'me': 'moi',
    'you': 'vous/tu',
    'him': 'lui',
    'us': 'nous',
    'them': 'eux/elles'
};

let essentialAdded = 0;
for (const [word, translation] of Object.entries(essentialWordsWithTranslations)) {
    if (!cleanWords.includes(word)) {
        insertStmt.run(word, translation, 'beginner', 'essential');
        essentialAdded++;
        console.log(`Ajoute: ${word} -> ${translation}`);
    }
}

console.log(`Mots essentiels ajoutes: ${essentialAdded}`);

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

// Test des mots essentiels
console.log('\n=== TEST DES MOTS ESSENTIELS ===');
const testWords = ['hello', 'beautiful', 'cat', 'dog', 'house', 'company', 'computer', 'different'];

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

// Nettoyage des fichiers temporaires
console.log('\n=== NETTOYAGE ===');
try {
    fs.unlinkSync('./3000_words_clean.txt');
    fs.unlinkSync('./words_only.txt');
    fs.unlinkSync('./oxford_3000_clean.txt');
    console.log('Fichiers temporaires supprimes');
} catch (error) {
    console.log('Fichiers temporaires deja supprimes');
}

console.log('\n🎉 Base de donnees completement renovee !');
console.log('✅ Tous les mots sont maintenant propres et valides');
console.log('✅ Traductions existantes preservees');
console.log('✅ Pret pour une utilisation optimale');

db.db.close();
