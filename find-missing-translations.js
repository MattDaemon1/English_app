import Database from 'better-sqlite3';

// Ouvrir la base de données
const db = new Database('english-app.db');

console.log('🔍 Recherche des mots sans traduction...\n');

// Trouver les mots sans traduction (NULL)
const wordsWithoutTranslation = db.prepare(`
    SELECT word, translation, id
    FROM words 
    WHERE translation IS NULL
    ORDER BY word
    LIMIT 50
`).all();

console.log(`📊 Mots sans traduction: ${wordsWithoutTranslation.length}`);

if (wordsWithoutTranslation.length > 0) {
    console.log('\n📝 Premiers mots sans traduction:');
    wordsWithoutTranslation.forEach((row, index) => {
        console.log(`${index + 1}. "${row.word}" (ID: ${row.id})`);
    });

    // Remplacer les traductions NULL par des crochets vides pour l'affichage
    console.log('\n🔧 Remplacement des NULL par "[ ]" pour l\'affichage...');
    const updateStmt = db.prepare(`
        UPDATE words 
        SET translation = '[ ]'
        WHERE translation IS NULL
    `);

    const result = updateStmt.run();
    console.log(`✅ ${result.changes} mots mis à jour avec "[ ]"`);
}

// Statistiques finales
const stats = db.prepare(`
    SELECT 
        COUNT(*) as total,
        COUNT(CASE WHEN translation IS NOT NULL AND translation != '[ ]' THEN 1 END) as with_real_translation,
        COUNT(CASE WHEN translation = '[ ]' THEN 1 END) as with_brackets,
        COUNT(CASE WHEN translation IS NULL THEN 1 END) as with_null
    FROM words
`).get();

console.log('\n📈 Statistiques finales:');
console.log(`- Total des mots: ${stats.total}`);
console.log(`- Avec vraie traduction: ${stats.with_real_translation}`);
console.log(`- Avec crochets [ ]: ${stats.with_brackets}`);
console.log(`- Avec NULL: ${stats.with_null}`);

// Vérifier quelques mots spécifiques
console.log('\n🔍 Test de mots spécifiques:');
const testWords = ['hello', 'the', 'and', 'to', 'a'];
testWords.forEach(word => {
    const result = db.prepare('SELECT word, translation FROM words WHERE word = ?').get(word);
    if (result) {
        console.log(`- ${result.word}: "${result.translation}"`);
    } else {
        console.log(`- ${word}: MOT NON TROUVÉ`);
    }
});

db.close();
console.log('\n✅ Analyse terminée');
