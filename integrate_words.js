import fs from 'fs';

// Lire les mots générés
const importedWords = JSON.parse(fs.readFileSync('import_words.json', 'utf-8'));

// Lire le fichier words.js actuel
const currentFile = fs.readFileSync('src/data/words.js', 'utf-8');

// Extraire les mots existants (les 40 premiers)
const existingWordsMatch = currentFile.match(/export const wordsData = \[([\s\S]*?)\];/);
if (!existingWordsMatch) {
    console.error('❌ Impossible de trouver wordsData dans le fichier');
    process.exit(1);
}

// Créer le nouveau contenu
const header = `// Base de données de mots anglais avec système de niveaux de difficulté

// Configuration des niveaux de difficulté
export const difficulties = ['beginner', 'intermediate', 'advanced'];

// Catégories thématiques
export const categories = [
    'daily-life',
    'food',
    'travel',
    'work',
    'emotions',
    'nature',
    'technology',
    'education',
    'greetings',
    'family',
    'transport',
    'house',
    'clothes',
    'weather',
    'colors',
    'body',
    'time'
];

// Sélection de mots anglais avec traductions et exemples`;

// Lire les mots existants pour les garder
const existingContent = fs.readFileSync('src/data/words.js', 'utf-8');
const existingWordsSection = existingContent.match(/wordsData = \[([\s\S]*?)\];/s);

if (!existingWordsSection) {
    console.error('❌ Impossible de parser les mots existants');
    process.exit(1);
}

// Extraire seulement les 40 premiers mots existants
const existingWordsText = existingWordsSection[1];
const existingWords = [];

// Parser manuellement pour extraire les 40 premiers mots
let currentWord = '';
let braceCount = 0;
let inWord = false;

for (let i = 0; i < existingWordsText.length; i++) {
    const char = existingWordsText[i];

    if (char === '{') {
        braceCount++;
        inWord = true;
        currentWord += char;
    } else if (char === '}') {
        braceCount--;
        currentWord += char;

        if (braceCount === 0 && inWord) {
            existingWords.push(currentWord.trim());
            currentWord = '';
            inWord = false;

            // Arrêter après 40 mots
            if (existingWords.length >= 40) break;
        }
    } else if (inWord) {
        currentWord += char;
    }
}

console.log(`📝 Mots existants conservés: ${existingWords.length}`);

// Prendre seulement les 50 meilleurs mots importés (ceux avec traductions)
const bestImportedWords = importedWords
    .filter(word => !word.translation.startsWith('['))
    .slice(0, 50);

console.log(`📝 Nouveaux mots à ajouter: ${bestImportedWords.length}`);

// Créer le nouveau fichier
const newContent = `${header}
export const wordsData = [
${existingWords.join(',\n')},
${bestImportedWords.map(word => `    {
        id: ${word.id},
        word: "${word.word}",
        translation: "${word.translation}",
        pronunciation: "${word.pronunciation}",
        partOfSpeech: "${word.partOfSpeech}",
        definition: "${word.definition}",
        example: "${word.example}",
        exampleTranslation: "${word.exampleTranslation}",
        difficulty: "${word.difficulty}",
        category: "${word.category}"
    }`).join(',\n')}
];`;

// Sauvegarder
fs.writeFileSync('src/data/words.js', newContent);

console.log(`\n🎉 Intégration terminée !`);
console.log(`📊 Total: ${existingWords.length + bestImportedWords.length} mots`);
console.log(`✅ Fichier src/data/words.js mis à jour`);
