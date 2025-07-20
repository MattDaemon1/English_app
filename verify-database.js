import { getDatabase } from './src/database/database.js';

const db = getDatabase();

console.log('Verification des mots et traductions dans la base...\n');

// Statistiques générales
const stats = {
    total: db.db.prepare('SELECT COUNT(*) as count FROM words').get().count,
    translated: db.db.prepare('SELECT COUNT(*) as count FROM words WHERE translation NOT LIKE \'[%]\'').get().count,
    untranslated: db.db.prepare('SELECT COUNT(*) as count FROM words WHERE translation LIKE \'[%]\'').get().count
};

console.log('=== STATISTIQUES GENERALES ===');
console.log(`Total des mots: ${stats.total}`);
console.log(`Mots traduits: ${stats.translated} (${Math.round(stats.translated / stats.total * 100)}%)`);
console.log(`Mots non traduits: ${stats.untranslated} (${Math.round(stats.untranslated / stats.total * 100)}%)`);

// Vérifier quelques mots spécifiques du quiz
console.log('\n=== VERIFICATION DES MOTS DU QUIZ ===');
const testWords = ['hello', 'beautiful', 'cat', 'dog', 'house', 'car', 'book', 'water', 'food', 'love'];

testWords.forEach(word => {
    const result = db.db.prepare(`
        SELECT word, translation, difficulty, category 
        FROM words 
        WHERE word = ?
    `).get(word);

    if (result) {
        const status = result.translation.startsWith('[') ? '❌ NON TRADUIT' : '✅ TRADUIT';
        console.log(`${status} - ${result.word} -> ${result.translation} (${result.difficulty})`);
    } else {
        console.log(`⚠️  MANQUANT - ${word}`);
    }
});

// Afficher les 20 premiers mots traduits
console.log('\n=== PREMIERS MOTS TRADUITS ===');
const translatedWords = db.db.prepare(`
    SELECT word, translation, difficulty 
    FROM words 
    WHERE translation NOT LIKE '[%]'
    ORDER BY word
    LIMIT 20
`).all();

translatedWords.forEach((row, index) => {
    console.log(`${index + 1}. ${row.word} -> ${row.translation} (${row.difficulty})`);
});

// Afficher quelques mots non traduits
console.log('\n=== QUELQUES MOTS NON TRADUITS ===');
const untranslatedWords = db.db.prepare(`
    SELECT word, translation, difficulty 
    FROM words 
    WHERE translation LIKE '[%]'
    ORDER BY word
    LIMIT 20
`).all();

untranslatedWords.forEach((row, index) => {
    console.log(`${index + 1}. ${row.word} -> ${row.translation} (${row.difficulty})`);
});

// Répartition par difficulté
console.log('\n=== REPARTITION PAR DIFFICULTE ===');
const difficulties = ['beginner', 'intermediate', 'advanced'];
difficulties.forEach(difficulty => {
    const count = db.db.prepare(`
        SELECT COUNT(*) as count 
        FROM words 
        WHERE difficulty = ?
    `).get(difficulty).count;

    const translated = db.db.prepare(`
        SELECT COUNT(*) as count 
        FROM words 
        WHERE difficulty = ? AND translation NOT LIKE '[%]'
    `).get(difficulty).count;

    console.log(`${difficulty}: ${count} mots (${translated} traduits, ${count - translated} à traduire)`);
});

// Problèmes potentiels
console.log('\n=== VERIFICATION DES PROBLEMES ===');

// Mots dupliqués
const duplicates = db.db.prepare(`
    SELECT word, COUNT(*) as count 
    FROM words 
    GROUP BY word 
    HAVING COUNT(*) > 1
`).all();

if (duplicates.length > 0) {
    console.log(`⚠️  ${duplicates.length} mots dupliqués trouvés:`);
    duplicates.slice(0, 10).forEach(row => {
        console.log(`   - ${row.word} (${row.count} fois)`);
    });
} else {
    console.log('✅ Aucun mot dupliqué');
}

// Traductions vides ou NULL
const emptyTranslations = db.db.prepare(`
    SELECT COUNT(*) as count 
    FROM words 
    WHERE translation IS NULL OR translation = ''
`).get().count;

if (emptyTranslations > 0) {
    console.log(`⚠️  ${emptyTranslations} mots avec traduction vide`);
} else {
    console.log('✅ Aucune traduction vide');
}

console.log('\n=== RECOMMANDATIONS ===');
if (stats.untranslated > 0) {
    console.log('1. Priorité: Traduire les mots de niveau "beginner" en premier');
    console.log('2. Utiliser un dictionnaire API pour automatiser les traductions');
    console.log('3. Vérifier manuellement les traductions importantes');
}

console.log('\nVerification terminee !');

db.db.close();
