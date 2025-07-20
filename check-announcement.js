import Database from 'better-sqlite3';

// Ouvrir la base de données
const db = new Database('english-app.db');

console.log('🔍 Vérification du mot "announcement"...\n');

// Rechercher le mot "announcement"
const word = db.prepare('SELECT * FROM words WHERE word = ?').get('announcement');

if (word) {
    console.log('📝 Détails du mot "announcement":');
    console.log(`- ID: ${word.id}`);
    console.log(`- Mot: "${word.word}"`);
    console.log(`- Traduction: "${word.translation}"`);
    console.log(`- Type de traduction: ${typeof word.translation}`);
    console.log(`- Longueur traduction: ${word.translation ? word.translation.length : 'NULL'}`);
    console.log(`- Difficulté: ${word.difficulty}`);
    console.log(`- Catégorie: ${word.category}`);

    // Vérifier si c'est exactement "[ ]"
    if (word.translation === '[ ]') {
        console.log('✅ Le mot a bien la traduction "[ ]" (devrait afficher le message d\'avertissement)');
    } else {
        console.log('⚠️  La traduction n\'est pas "[ ]", investigating...');
    }
} else {
    console.log('❌ Mot "announcement" non trouvé dans la base de données');
}

// Vérifier quelques autres mots pour comparaison
console.log('\n🔍 Comparaison avec d\'autres mots:');
const testWords = ['hello', 'company', 'water', 'accept', 'acceptable'];
testWords.forEach(testWord => {
    const result = db.prepare('SELECT word, translation FROM words WHERE word = ?').get(testWord);
    if (result) {
        console.log(`- ${result.word}: "${result.translation}"`);
    } else {
        console.log(`- ${testWord}: NON TROUVÉ`);
    }
});

db.close();
console.log('\n✅ Vérification terminée');
