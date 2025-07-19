import { getDatabase } from './src/database/database.js';

const db = getDatabase();
const words = db.getWords({ limit: 10 });

console.log('=== VERIFICATION DES DONNEES ===');
console.log(`Nombre total de mots: ${db.getTotalWordsCount()}`);
console.log('\nPremiers mots en base:');

words.forEach((word, index) => {
    console.log(`${index + 1}. Word: "${word.word}"`);
    console.log(`   Translation: "${word.translation}"`);
    console.log(`   Pronunciation: "${word.pronunciation}"`);
    console.log(`   Part of speech: "${word.part_of_speech}"`);
    console.log(`   Difficulty: "${word.difficulty}"`);
    console.log('---');
});

// Vérifier spécifiquement le mot "abortion"
const abortionWord = words.find(w => w.word === 'abortion');
if (abortionWord) {
    console.log('\n=== PROBLEME IDENTIFIE: ABORTION ===');
    console.log('Word:', abortionWord.word);
    console.log('Pronunciation actuelle:', abortionWord.pronunciation);
    console.log('Translation:', abortionWord.translation);
} else {
    console.log('\nLe mot "abortion" n\'est pas dans les 10 premiers mots');
}
