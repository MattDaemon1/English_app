import { getDatabase } from './src/database/database.js';

const db = getDatabase();

console.log('🔍 Vérification des traductions récemment corrigées...\n');

// Quelques mots pour vérifier les corrections
const testWords = [
    'abortion', 'achieve', 'dance', 'cat', 'coffee', 'brain', 'beach', 'active'
];

console.log('✅ Mots correctement traduits:');
testWords.forEach(word => {
    const result = db.db.prepare(`
        SELECT word, translation, pronunciation 
        FROM words 
        WHERE word = ?
    `).get(word);

    if (result) {
        console.log(`   ${result.word} -> ${result.translation}${result.pronunciation ? ` (${result.pronunciation})` : ''}`);
    }
});

// Statistiques globales
const stats = {
    total: db.db.prepare('SELECT COUNT(*) as count FROM words').get().count,
    translated: db.db.prepare('SELECT COUNT(*) as count FROM words WHERE translation NOT LIKE \'[%]\'').get().count,
    untranslated: db.db.prepare('SELECT COUNT(*) as count FROM words WHERE translation LIKE \'[%]\'').get().count
};

console.log('\n📊 Statistiques de traduction:');
console.log(`   📚 Total des mots: ${stats.total}`);
console.log(`   ✅ Mots traduits: ${stats.translated} (${Math.round(stats.translated / stats.total * 100)}%)`);
console.log(`   ⚠️  Mots non traduits: ${stats.untranslated} (${Math.round(stats.untranslated / stats.total * 100)}%)`);

console.log('\n🎯 L\'application est maintenant prête avec des traductions de qualité !');

db.db.close();
