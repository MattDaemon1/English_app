import { getDatabase } from './src/database/database.js';

const db = getDatabase();

console.log('Nettoyage et ajout des mots essentiels...\n');

// 1. Supprimer les mots mal formatés
console.log('=== NETTOYAGE DES MOTS INCORRECTS ===');

// Supprimer les mots avec des tirets ou des caractères étranges
const badPatterns = [
    '---',           // Tirets
    'na',            // Suffixes incorrects
    'vb',            // Suffixes incorrects  
    'adj',           // Suffixes incorrects
    'prep',          // Suffixes incorrects
    'adv',           // Suffixes incorrects
    'aan',           // Préfixes incorrects
];

let deletedCount = 0;

badPatterns.forEach(pattern => {
    const deleteStmt = db.db.prepare(`
        DELETE FROM words 
        WHERE word LIKE '%${pattern}%' 
        AND length(word) > 15
    `);

    const result = deleteStmt.run();
    deletedCount += result.changes;
    console.log(`Supprimé ${result.changes} mots contenant "${pattern}"`);
});

// Supprimer les mots trop longs (probablement des erreurs)
const deleteLongWords = db.db.prepare(`
    DELETE FROM words 
    WHERE length(word) > 20
`);
const longWordsDeleted = deleteLongWords.run();
deletedCount += longWordsDeleted.changes;
console.log(`Supprimé ${longWordsDeleted.changes} mots trop longs`);

console.log(`Total supprimé: ${deletedCount} mots incorrects`);

// 2. Ajouter les mots essentiels manquants
console.log('\n=== AJOUT DES MOTS ESSENTIELS MANQUANTS ===');

const essentialWords = {
    // Mots de base très courants
    'dog': 'chien',
    'house': 'maison',
    'water': 'eau',
    'food': 'nourriture',
    'love': 'amour',
    'friend': 'ami',
    'family': 'famille',
    'school': 'école',
    'work': 'travail',
    'time': 'temps',
    'day': 'jour',
    'night': 'nuit',
    'morning': 'matin',
    'evening': 'soir',
    'week': 'semaine',
    'month': 'mois',
    'year': 'année',
    'today': 'aujourd\'hui',
    'tomorrow': 'demain',
    'yesterday': 'hier',
    'now': 'maintenant',
    'here': 'ici',
    'there': 'là',
    'where': 'où',
    'when': 'quand',
    'what': 'quoi',
    'who': 'qui',
    'why': 'pourquoi',
    'how': 'comment',
    'yes': 'oui',
    'no': 'non',
    'please': 's\'il vous plaît',
    'thank': 'remercier',
    'sorry': 'désolé',
    'excuse': 'excuser',
    'help': 'aide',
    'stop': 'arrêter',
    'start': 'commencer',
    'finish': 'finir',
    'open': 'ouvrir',
    'close': 'fermer',
    'big': 'grand',
    'small': 'petit',
    'good': 'bon',
    'bad': 'mauvais',
    'new': 'nouveau',
    'old': 'vieux',
    'hot': 'chaud',
    'cold': 'froid',
    'happy': 'heureux',
    'sad': 'triste',
    'fast': 'rapide',
    'slow': 'lent',
    'easy': 'facile',
    'hard': 'difficile',
    'clean': 'propre',
    'dirty': 'sale',
    'full': 'plein',
    'empty': 'vide',
    'light': 'lumière',
    'dark': 'sombre',
    'red': 'rouge',
    'blue': 'bleu',
    'green': 'vert',
    'yellow': 'jaune',
    'white': 'blanc',
    'black': 'noir',
    'one': 'un',
    'two': 'deux',
    'three': 'trois',
    'four': 'quatre',
    'five': 'cinq',
    'six': 'six',
    'seven': 'sept',
    'eight': 'huit',
    'nine': 'neuf',
    'ten': 'dix',
    'first': 'premier',
    'second': 'deuxième',
    'last': 'dernier',
    'next': 'suivant',
    'mother': 'mère',
    'father': 'père',
    'brother': 'frère',
    'sister': 'sœur',
    'son': 'fils',
    'daughter': 'fille',
    'husband': 'mari',
    'wife': 'épouse',
    'child': 'enfant',
    'baby': 'bébé',
    'boy': 'garçon',
    'girl': 'fille',
    'man': 'homme',
    'woman': 'femme',
    'people': 'gens',
    'person': 'personne'
};

let addedCount = 0;

for (const [word, translation] of Object.entries(essentialWords)) {
    try {
        // Vérifier si le mot existe déjà
        const existing = db.db.prepare(`
            SELECT id FROM words WHERE word = ?
        `).get(word);

        if (!existing) {
            // Ajouter le mot
            const insertStmt = db.db.prepare(`
                INSERT INTO words (word, translation, difficulty, category, created_at, updated_at)
                VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
            `);

            insertStmt.run(word, translation, 'beginner', 'essential');
            addedCount++;
            console.log(`✅ Ajouté: ${word} -> ${translation}`);
        }
    } catch (error) {
        console.error(`❌ Erreur pour "${word}":`, error.message);
    }
}

console.log(`Total ajouté: ${addedCount} mots essentiels`);

// 3. Statistiques finales
console.log('\n=== STATISTIQUES APRES NETTOYAGE ===');
const finalStats = {
    total: db.db.prepare('SELECT COUNT(*) as count FROM words').get().count,
    translated: db.db.prepare('SELECT COUNT(*) as count FROM words WHERE translation NOT LIKE \'[%]\'').get().count,
    untranslated: db.db.prepare('SELECT COUNT(*) as count FROM words WHERE translation LIKE \'[%]\'').get().count
};

console.log(`Total des mots: ${finalStats.total}`);
console.log(`Mots traduits: ${finalStats.translated} (${Math.round(finalStats.translated / finalStats.total * 100)}%)`);
console.log(`Mots non traduits: ${finalStats.untranslated} (${Math.round(finalStats.untranslated / finalStats.total * 100)}%)`);

// Vérifier les mots du quiz maintenant
console.log('\n=== VERIFICATION FINALE DES MOTS DU QUIZ ===');
const testWords = ['hello', 'beautiful', 'cat', 'dog', 'house', 'car', 'book', 'water', 'food', 'love'];

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

console.log('\n🎉 Nettoyage terminé ! La base de données est maintenant plus propre.');

db.db.close();
