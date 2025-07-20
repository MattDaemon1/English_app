import { getDatabase } from './src/database/database.js';

const db = getDatabase();

console.log('Verification complete et nettoyage rigoureux de la base...\n');

// 1. Identifier tous les mots problématiques
console.log('=== IDENTIFICATION DES MOTS PROBLEMATIQUES ===');

const problematicWords = db.db.prepare(`
    SELECT word, translation, category, difficulty 
    FROM words 
    WHERE word LIKE '%vb%' 
       OR word LIKE '%adj%' 
       OR word LIKE '%adv%' 
       OR word LIKE '%prep%'
       OR word LIKE '%na%'
       OR word LIKE '%nb%'
       OR word LIKE '%nc%'
       OR length(word) > 15
       OR word LIKE '%-%-%'
    ORDER BY word
`).all();

console.log(`Trouve ${problematicWords.length} mots problematiques:`);
problematicWords.slice(0, 20).forEach((row, index) => {
    console.log(`${index + 1}. ${row.word} -> ${row.translation}`);
});

if (problematicWords.length > 20) {
    console.log(`... et ${problematicWords.length - 20} autres`);
}

// 2. Supprimer tous les mots problématiques
console.log('\n=== SUPPRESSION DES MOTS PROBLEMATIQUES ===');

const deleteProblematic = db.db.prepare(`
    DELETE FROM words 
    WHERE word LIKE '%vb%' 
       OR word LIKE '%adj%' 
       OR word LIKE '%adv%' 
       OR word LIKE '%prep%'
       OR word LIKE '%na%'
       OR word LIKE '%nb%'
       OR word LIKE '%nc%'
       OR length(word) > 15
       OR word LIKE '%-%-%'
       OR word LIKE '%aa%'
       OR word LIKE '%bb%'
       OR word LIKE '%cc%'
`);

const deletedCount = deleteProblematic.run();
console.log(`Supprime ${deletedCount.changes} mots problematiques`);

// 3. Nettoyer les mots avec des suffixes
console.log('\n=== NETTOYAGE DES SUFFIXES ===');

const wordsWithSuffixes = db.db.prepare(`
    SELECT word, translation 
    FROM words 
    WHERE word REGEXP '[a-z]+[A-Z][a-z]+'
    ORDER BY word
    LIMIT 50
`).all();

console.log(`Mots avec suffixes detectes: ${wordsWithSuffixes.length}`);
wordsWithSuffixes.forEach((row, index) => {
    if (index < 10) {
        console.log(`${index + 1}. ${row.word} -> ${row.translation}`);
    }
});

// 4. Supprimer les mots avec des patterns suspects
const suspiciousPatterns = [
    'aaaa', 'bbbb', 'cccc', 'dddd',
    'abcd', 'efgh', 'ijkl', 'mnop',
    'qrst', 'uvwx', 'yz',
    'indefinite', 'article',
    'preposition', 'conjunction'
];

let suspiciousDeleted = 0;
suspiciousPatterns.forEach(pattern => {
    const deleteStmt = db.db.prepare(`
        DELETE FROM words 
        WHERE word LIKE '%${pattern}%'
    `);
    const result = deleteStmt.run();
    suspiciousDeleted += result.changes;
    if (result.changes > 0) {
        console.log(`Supprime ${result.changes} mots contenant "${pattern}"`);
    }
});

console.log(`Total patterns suspects supprimes: ${suspiciousDeleted}`);

// 5. Statistiques après nettoyage
console.log('\n=== STATISTIQUES APRES NETTOYAGE ===');
const stats = {
    total: db.db.prepare('SELECT COUNT(*) as count FROM words').get().count,
    translated: db.db.prepare('SELECT COUNT(*) as count FROM words WHERE translation NOT LIKE \'[%]\'').get().count,
    untranslated: db.db.prepare('SELECT COUNT(*) as count FROM words WHERE translation LIKE \'[%]\'').get().count
};

console.log(`Total des mots: ${stats.total}`);
console.log(`Mots traduits: ${stats.translated} (${Math.round(stats.translated / stats.total * 100)}%)`);
console.log(`Mots non traduits: ${stats.untranslated} (${Math.round(stats.untranslated / stats.total * 100)}%)`);

// 6. Vérifier la qualité des mots restants
console.log('\n=== VERIFICATION DE LA QUALITE ===');

// Mots valides (lettres uniquement, longueur raisonnable)
const validWords = db.db.prepare(`
    SELECT COUNT(*) as count 
    FROM words 
    WHERE word REGEXP '^[a-z]+$' 
      AND length(word) BETWEEN 2 AND 12
`).get().count;

console.log(`Mots valides (format correct): ${validWords}`);

// Échantillon de mots traduits
console.log('\n=== ECHANTILLON DE MOTS TRADUITS ===');
const sampleTranslated = db.db.prepare(`
    SELECT word, translation, difficulty 
    FROM words 
    WHERE translation NOT LIKE '[%]'
      AND word REGEXP '^[a-z]+$'
    ORDER BY RANDOM()
    LIMIT 15
`).all();

sampleTranslated.forEach((row, index) => {
    console.log(`${index + 1}. ${row.word} -> ${row.translation} (${row.difficulty})`);
});

// Échantillon de mots non traduits mais valides
console.log('\n=== ECHANTILLON DE MOTS NON TRADUITS (VALIDES) ===');
const sampleUntranslated = db.db.prepare(`
    SELECT word, translation, difficulty 
    FROM words 
    WHERE translation LIKE '[%]'
      AND word REGEXP '^[a-z]+$'
      AND length(word) BETWEEN 3 AND 10
    ORDER BY word
    LIMIT 15
`).all();

sampleUntranslated.forEach((row, index) => {
    console.log(`${index + 1}. ${row.word} -> ${row.translation} (${row.difficulty})`);
});

// 7. Rechercher des doublons potentiels
console.log('\n=== VERIFICATION DES DOUBLONS ===');
const duplicates = db.db.prepare(`
    SELECT word, COUNT(*) as count 
    FROM words 
    GROUP BY word 
    HAVING COUNT(*) > 1
    ORDER BY count DESC
`).all();

if (duplicates.length > 0) {
    console.log(`Doublons detectes: ${duplicates.length}`);
    duplicates.slice(0, 10).forEach((row, index) => {
        console.log(`${index + 1}. "${row.word}" apparait ${row.count} fois`);
    });
} else {
    console.log('Aucun doublon detecte');
}

// 8. Recommandations finales
console.log('\n=== RECOMMANDATIONS ===');
console.log('1. La base est maintenant nettoyee des mots mal formates');
console.log('2. Focus sur la traduction des mots valides restants');
console.log('3. Priorite aux mots de niveau "beginner" et "intermediate"');
console.log('4. Utiliser un service de traduction pour automatiser');

console.log('\nVerification complete terminee !');

db.db.close();
