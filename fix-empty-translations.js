import Database from 'better-sqlite3';

// Ouvrir la base de données
const db = new Database('english-app.db');

console.log('🔍 Analyse des traductions problématiques...\n');

// Vérifier les mots avec des crochets vides ou des traductions manquantes
const emptyTranslations = db.prepare(`
    SELECT word, translation 
    FROM words 
    WHERE translation = '[ ]' 
       OR translation = '' 
       OR translation IS NULL 
       OR translation LIKE '%[ ]%'
    ORDER BY word
`).all();

console.log(`📊 Nombre de mots avec traductions problématiques: ${emptyTranslations.length}`);

if (emptyTranslations.length > 0) {
    console.log('\n🔧 Exemples de mots problématiques:');
    emptyTranslations.slice(0, 20).forEach((row, index) => {
        console.log(`${index + 1}. "${row.word}" → "${row.translation}"`);
    });

    // Nettoyer les traductions vides en les remplaçant par NULL
    console.log('\n🧹 Nettoyage des traductions vides...');
    const cleanupStmt = db.prepare(`
        UPDATE words 
        SET translation = NULL 
        WHERE translation = '[ ]' 
           OR translation = '' 
           OR translation LIKE '%[ ]%'
    `);

    const result = cleanupStmt.run();
    console.log(`✅ ${result.changes} traductions nettoyées`);
}

// Statistiques finales
const stats = db.prepare(`
    SELECT 
        COUNT(*) as total,
        COUNT(translation) as with_translation,
        COUNT(*) - COUNT(translation) as without_translation
    FROM words
`).get();

console.log('\n📈 Statistiques finales:');
console.log(`- Total des mots: ${stats.total}`);
console.log(`- Avec traduction: ${stats.with_translation}`);
console.log(`- Sans traduction: ${stats.without_translation}`);
console.log(`- Pourcentage traduit: ${((stats.with_translation / stats.total) * 100).toFixed(1)}%`);

// Vérifier quelques mots importants
console.log('\n🔍 Vérification de mots clés:');
const testWords = ['hello', 'company', 'water', 'house', 'time'];
testWords.forEach(word => {
    const result = db.prepare('SELECT word, translation FROM words WHERE word = ?').get(word);
    if (result) {
        console.log(`- ${result.word}: ${result.translation || 'PAS DE TRADUCTION'}`);
    }
});

db.close();
console.log('\n✅ Analyse terminée');
