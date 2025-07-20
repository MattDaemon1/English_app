import Database from 'better-sqlite3';

// Ouvrir la base de données
const db = new Database('english-app.db');

console.log('🔍 Vérification du mot "acceptable"...\n');

// Rechercher le mot "acceptable"
const word = db.prepare('SELECT * FROM words WHERE word = ?').get('acceptable');

if (word) {
    console.log('📝 Détails du mot "acceptable":');
    console.log(`- ID: ${word.id}`);
    console.log(`- Mot: "${word.word}"`);
    console.log(`- Traduction: "${word.translation}"`);
    console.log(`- Type de traduction: ${typeof word.translation}`);
    console.log(`- Longueur traduction: ${word.translation ? word.translation.length : 'NULL'}`);
    console.log(`- Difficulté: ${word.difficulty}`);
    console.log(`- Catégorie: ${word.category}`);
} else {
    console.log('❌ Mot "acceptable" non trouvé dans la base de données');
}

// Rechercher tous les mots avec des crochets dans la traduction
console.log('\n🔍 Recherche de mots avec des crochets dans la traduction...');
const wordsWithBrackets = db.prepare(`
    SELECT word, translation 
    FROM words 
    WHERE translation LIKE '%[%' OR translation LIKE '%]%'
    ORDER BY word
    LIMIT 20
`).all();

console.log(`📊 Nombre de mots avec crochets: ${wordsWithBrackets.length}`);

if (wordsWithBrackets.length > 0) {
    console.log('\n📝 Exemples de mots avec crochets:');
    wordsWithBrackets.forEach((row, index) => {
        console.log(`${index + 1}. "${row.word}" → "${row.translation}"`);
    });
}

db.close();
console.log('\n✅ Vérification terminée');
