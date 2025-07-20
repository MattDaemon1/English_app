import { getDatabase } from './src/database/database.js';

const db = getDatabase();

console.log('🔧 Correction des traductions et prononciations...\n');

// Dictionnaire de corrections avec traductions et prononciations
const corrections = {
    'abortion': {
        translation: 'avortement',
        pronunciation: '/əˈbɔːrʃən/',
        partOfSpeech: 'noun',
        definition: 'The deliberate termination of a human pregnancy'
    },
    'a': {
        translation: 'un/une',
        pronunciation: '/ə, eɪ/',
        partOfSpeech: 'article',
        definition: 'Used when referring to someone or something for the first time'
    },
    'abandon': {
        translation: 'abandonner',
        pronunciation: '/əˈbændən/',
        partOfSpeech: 'verb',
        definition: 'To leave completely and finally'
    },
    'ability': {
        translation: 'capacité',
        pronunciation: '/əˈbɪləti/',
        partOfSpeech: 'noun',
        definition: 'The capacity to do something'
    },
    'able': {
        translation: 'capable',
        pronunciation: '/ˈeɪbəl/',
        partOfSpeech: 'adjective',
        definition: 'Having the power, skill, or means to do something'
    },
    'about': {
        translation: 'à propos de',
        pronunciation: '/əˈbaʊt/',
        partOfSpeech: 'preposition',
        definition: 'On the subject of; concerning'
    },
    'above': {
        translation: 'au-dessus',
        pronunciation: '/əˈbʌv/',
        partOfSpeech: 'preposition',
        definition: 'In or to a higher position than'
    },
    'abroad': {
        translation: 'à l\'étranger',
        pronunciation: '/əˈbrɔːd/',
        partOfSpeech: 'adverb',
        definition: 'In or to a foreign country or countries'
    },
    'absence': {
        translation: 'absence',
        pronunciation: '/ˈæbsəns/',
        partOfSpeech: 'noun',
        definition: 'The state of being away from a place or person'
    },
    'absolute': {
        translation: 'absolu',
        pronunciation: '/ˈæbsəluːt/',
        partOfSpeech: 'adjective',
        definition: 'Not qualified or diminished in any way; total'
    },
    'absolutely': {
        translation: 'absolument',
        pronunciation: '/ˈæbsəluːtli/',
        partOfSpeech: 'adverb',
        definition: 'With no qualification, restriction, or limitation; totally'
    },
    'absorb': {
        translation: 'absorber',
        pronunciation: '/əbˈzɔːrb/',
        partOfSpeech: 'verb',
        definition: 'To take in or soak up'
    },
    'abuse': {
        translation: 'abus',
        pronunciation: '/əˈbjuːs/',
        partOfSpeech: 'noun',
        definition: 'The improper use of something'
    },
    'academic': {
        translation: 'académique',
        pronunciation: '/ækəˈdemɪk/',
        partOfSpeech: 'adjective',
        definition: 'Relating to education and scholarship'
    },
    'accept': {
        translation: 'accepter',
        pronunciation: '/əkˈsept/',
        partOfSpeech: 'verb',
        definition: 'To agree to receive or undertake'
    },
    'access': {
        translation: 'accès',
        pronunciation: '/ˈækses/',
        partOfSpeech: 'noun',
        definition: 'The means or opportunity to approach or enter'
    },
    'accident': {
        translation: 'accident',
        pronunciation: '/ˈæksɪdənt/',
        partOfSpeech: 'noun',
        definition: 'An unfortunate incident that happens unexpectedly'
    },
    'accompany': {
        translation: 'accompagner',
        pronunciation: '/əˈkʌmpəni/',
        partOfSpeech: 'verb',
        definition: 'To go somewhere with someone'
    },
    'accomplish': {
        translation: 'accomplir',
        pronunciation: '/əˈkʌmplɪʃ/',
        partOfSpeech: 'verb',
        definition: 'To achieve or complete successfully'
    },
    'according': {
        translation: 'selon',
        pronunciation: '/əˈkɔːrdɪŋ/',
        partOfSpeech: 'preposition',
        definition: 'As stated by or in'
    }
};

// Fonction pour corriger un mot
function correctWord(word, correction) {
    try {
        const stmt = db.db.prepare(`
            UPDATE words 
            SET translation = ?, 
                pronunciation = ?, 
                part_of_speech = ?, 
                definition = ?,
                updated_at = CURRENT_TIMESTAMP
            WHERE word = ?
        `);

        const result = stmt.run(
            correction.translation,
            correction.pronunciation,
            correction.partOfSpeech,
            correction.definition,
            word
        );

        return result.changes > 0;
    } catch (error) {
        console.error(`Erreur lors de la correction de "${word}":`, error.message);
        return false;
    }
}

// Trouver tous les mots avec des traductions incorrectes (format [mot])
const wordsToFix = db.db.prepare(`
    SELECT word, translation 
    FROM words 
    WHERE translation LIKE '[%]' 
    ORDER BY word
`).all();

console.log(`🔍 Trouvé ${wordsToFix.length} mots avec des traductions incorrectes`);

// Corriger les mots connus
let corrected = 0;
let remaining = 0;

for (const wordData of wordsToFix) {
    const word = wordData.word;

    if (corrections[word]) {
        if (correctWord(word, corrections[word])) {
            console.log(`✅ Corrigé: ${word} -> ${corrections[word].translation}`);
            corrected++;
        }
    } else {
        console.log(`⚠️  Traduction manquante pour: ${word} (actuellement: ${wordData.translation})`);
        remaining++;
    }
}

// Corriger aussi les mots qui ont une traduction mais pas de prononciation
const wordsNoPronunciation = db.db.prepare(`
    SELECT word, translation 
    FROM words 
    WHERE pronunciation IS NULL AND word IN (${Object.keys(corrections).map(() => '?').join(',')})
`).all(...Object.keys(corrections));

for (const wordData of wordsNoPronunciation) {
    const word = wordData.word;
    if (corrections[word] && wordData.translation !== `[${word}]`) {
        if (correctWord(word, corrections[word])) {
            console.log(`🔊 Ajouté prononciation: ${word} -> ${corrections[word].pronunciation}`);
            corrected++;
        }
    }
}

console.log(`\n📊 Résumé des corrections:`);
console.log(`   ✅ Mots corrigés: ${corrected}`);
console.log(`   ⚠️  Mots nécessitant encore une traduction: ${remaining}`);

// Vérifier les corrections
if (corrected > 0) {
    console.log(`\n🔍 Vérification des corrections:`);
    const verifyStmt = db.db.prepare('SELECT word, translation, pronunciation FROM words WHERE word IN (' + Object.keys(corrections).slice(0, 5).map(() => '?').join(',') + ')');
    const verified = verifyStmt.all(...Object.keys(corrections).slice(0, 5));

    verified.forEach(word => {
        console.log(`   ${word.word}: "${word.translation}" [${word.pronunciation}]`);
    });
}

console.log(`\n✨ Correction terminée!`);

// Nettoyer
db.db.close();
