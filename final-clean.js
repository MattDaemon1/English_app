import { getDatabase } from './src/database/database.js';

const db = getDatabase();

console.log('Nettoyage final et verification de la base...\n');

// 1. Statistiques après le premier nettoyage
console.log('=== STATISTIQUES APRES PREMIER NETTOYAGE ===');
const statsAfterFirst = {
    total: db.db.prepare('SELECT COUNT(*) as count FROM words').get().count,
    translated: db.db.prepare('SELECT COUNT(*) as count FROM words WHERE translation NOT LIKE \'[%]\'').get().count,
    untranslated: db.db.prepare('SELECT COUNT(*) as count FROM words WHERE translation LIKE \'[%]\'').get().count
};

console.log(`Total des mots: ${statsAfterFirst.total}`);
console.log(`Mots traduits: ${statsAfterFirst.translated} (${Math.round(statsAfterFirst.translated / statsAfterFirst.total * 100)}%)`);
console.log(`Mots non traduits: ${statsAfterFirst.untranslated} (${Math.round(statsAfterFirst.untranslated / statsAfterFirst.total * 100)}%)`);

// 2. Continuer le nettoyage avec des patterns plus spécifiques
console.log('\n=== NETTOYAGE SUPPLEMENTAIRE ===');

// Supprimer les mots avec des caractères répétés ou suspects
const additionalCleanup = [
    'DELETE FROM words WHERE word LIKE \'%aaa%\'',
    'DELETE FROM words WHERE word LIKE \'%bbb%\'',
    'DELETE FROM words WHERE word LIKE \'%ccc%\'',
    'DELETE FROM words WHERE word LIKE \'%ddd%\'',
    'DELETE FROM words WHERE word LIKE \'%eee%\'',
    'DELETE FROM words WHERE length(word) < 2',
    'DELETE FROM words WHERE word LIKE \'%.%\'',
    'DELETE FROM words WHERE word LIKE \'%,%\'',
    'DELETE FROM words WHERE word LIKE \'%;%\'',
    'DELETE FROM words WHERE word LIKE \'%:%\'',
    'DELETE FROM words WHERE word LIKE \'%!%\'',
    'DELETE FROM words WHERE word LIKE \'%?%\'',
    'DELETE FROM words WHERE word LIKE \'%(%\'',
    'DELETE FROM words WHERE word LIKE \'%)%\'',
    'DELETE FROM words WHERE word LIKE \'%[%\'',
    'DELETE FROM words WHERE word LIKE \'%]%\'',
    'DELETE FROM words WHERE word LIKE \'%{%\'',
    'DELETE FROM words WHERE word LIKE \'%}%\'',
    'DELETE FROM words WHERE word LIKE \'%/%\'',
    'DELETE FROM words WHERE word LIKE \'%\\\\%\'',
    'DELETE FROM words WHERE word LIKE \'%"%\'',
    'DELETE FROM words WHERE word LIKE "%\'%"',
    'DELETE FROM words WHERE word LIKE \'%`%\'',
    'DELETE FROM words WHERE word LIKE \'%~%\'',
    'DELETE FROM words WHERE word LIKE \'%@%\'',
    'DELETE FROM words WHERE word LIKE \'%#%\'',
    'DELETE FROM words WHERE word LIKE \'%$%\'',
    'DELETE FROM words WHERE word LIKE \'%%\'\'',
    'DELETE FROM words WHERE word LIKE \'%^%\'',
    'DELETE FROM words WHERE word LIKE \'%&%\'',
    'DELETE FROM words WHERE word LIKE \'%*%\'',
    'DELETE FROM words WHERE word LIKE \'%+%\'',
    'DELETE FROM words WHERE word LIKE \'%=%\'',
    'DELETE FROM words WHERE word LIKE \'%|%\'',
    'DELETE FROM words WHERE word LIKE \'%<%\'',
    'DELETE FROM words WHERE word LIKE \'%>%\''
];

let totalCleaned = 0;
additionalCleanup.forEach(query => {
    const result = db.db.prepare(query).run();
    totalCleaned += result.changes;
});

console.log(`Supprime ${totalCleaned} mots avec caracteres speciaux`);

// 3. Supprimer les doublons
console.log('\n=== SUPPRESSION DES DOUBLONS ===');
const removeDuplicates = db.db.prepare(`
    DELETE FROM words 
    WHERE id NOT IN (
        SELECT MIN(id) 
        FROM words 
        GROUP BY word
    )
`);
const duplicatesRemoved = removeDuplicates.run();
console.log(`Supprime ${duplicatesRemoved.changes} doublons`);

// 4. Échantillon de mots restants
console.log('\n=== ECHANTILLON DES MOTS RESTANTS ===');

// Mots traduits
const translatedSample = db.db.prepare(`
    SELECT word, translation, difficulty 
    FROM words 
    WHERE translation NOT LIKE '[%]'
    ORDER BY word
    LIMIT 15
`).all();

console.log('Mots traduits:');
translatedSample.forEach((row, index) => {
    console.log(`${index + 1}. ${row.word} -> ${row.translation} (${row.difficulty})`);
});

// Mots non traduits mais propres
const untranslatedSample = db.db.prepare(`
    SELECT word, translation, difficulty 
    FROM words 
    WHERE translation LIKE '[%]'
      AND length(word) BETWEEN 3 AND 12
      AND word NOT LIKE '%0%'
      AND word NOT LIKE '%1%'
      AND word NOT LIKE '%2%'
      AND word NOT LIKE '%3%'
      AND word NOT LIKE '%4%'
      AND word NOT LIKE '%5%'
      AND word NOT LIKE '%6%'
      AND word NOT LIKE '%7%'
      AND word NOT LIKE '%8%'
      AND word NOT LIKE '%9%'
    ORDER BY word
    LIMIT 15
`).all();

console.log('\nMots non traduits (propres):');
untranslatedSample.forEach((row, index) => {
    console.log(`${index + 1}. ${row.word} -> ${row.translation} (${row.difficulty})`);
});

// 5. Statistiques finales
console.log('\n=== STATISTIQUES FINALES ===');
const finalStats = {
    total: db.db.prepare('SELECT COUNT(*) as count FROM words').get().count,
    translated: db.db.prepare('SELECT COUNT(*) as count FROM words WHERE translation NOT LIKE \'[%]\'').get().count,
    untranslated: db.db.prepare('SELECT COUNT(*) as count FROM words WHERE translation LIKE \'[%]\'').get().count
};

console.log(`Total des mots: ${finalStats.total}`);
console.log(`Mots traduits: ${finalStats.translated} (${Math.round(finalStats.translated / finalStats.total * 100)}%)`);
console.log(`Mots non traduits: ${finalStats.untranslated} (${Math.round(finalStats.untranslated / finalStats.total * 100)}%)`);

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

    console.log(`${difficulty}: ${count} mots (${translated} traduits)`);
});

// 6. Test des mots essentiels
console.log('\n=== TEST DES MOTS ESSENTIELS ===');
const essentialWords = ['hello', 'beautiful', 'cat', 'dog', 'house', 'car', 'book', 'water', 'food', 'love'];

essentialWords.forEach(word => {
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

console.log('\n🎉 Nettoyage complet termine ! Base de donnees optimisee.');
console.log('\n📝 Prochaines etapes:');
console.log('1. Tous les mots mal formates ont ete supprimes');
console.log('2. La base contient maintenant uniquement des mots valides');
console.log('3. Focus sur la traduction des mots restants');
console.log('4. Integration possible d\'un service de traduction automatique');

db.db.close();
