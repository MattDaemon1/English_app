import Database from 'better-sqlite3';

// Ouvrir la base de données
const db = new Database('english-app.db');

console.log('🔍 Recherche de tous les mots avec des traductions entre crochets...\n');

// Trouver tous les mots avec des crochets
const wordsWithBrackets = db.prepare(`
    SELECT word, translation, id
    FROM words 
    WHERE translation LIKE '[%]'
    ORDER BY word
`).all();

console.log(`📊 Total de mots avec crochets: ${wordsWithBrackets.length}`);

if (wordsWithBrackets.length > 0) {
    console.log('\n🔧 Correction des traductions entre crochets...');

    // Préparer la requête de mise à jour pour remplacer par un marqueur
    const updateStmt = db.prepare('UPDATE words SET translation = ? WHERE id = ?');

    let corrected = 0;

    // Traiter tous les mots avec crochets
    wordsWithBrackets.forEach((row, index) => {
        // Remplacer par un marqueur pour indiquer qu'il n'y a pas de traduction
        updateStmt.run('[ ]', row.id);
        corrected++;

        if (index < 20) { // Afficher les 20 premiers
            console.log(`${index + 1}. "${row.word}" : "${row.translation}" → "[ ]"`);
        }
    });

    console.log(`\n✅ ${corrected} mots corrigés (traduction mise à NULL)`);
}

// Statistiques finales
const stats = db.prepare(`
    SELECT 
        COUNT(*) as total,
        COUNT(CASE WHEN translation != '[ ]' THEN 1 END) as with_real_translation,
        COUNT(CASE WHEN translation = '[ ]' THEN 1 END) as without_translation
    FROM words
`).get();

console.log('\n📈 Statistiques après correction:');
console.log(`- Total des mots: ${stats.total}`);
console.log(`- Avec vraie traduction: ${stats.with_real_translation}`);
console.log(`- Sans traduction ([ ]): ${stats.without_translation}`);
console.log(`- Pourcentage traduit: ${((stats.with_real_translation / stats.total) * 100).toFixed(1)}%`);

db.close();
console.log('\n✅ Correction terminée');
