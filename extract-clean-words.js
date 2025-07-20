import fs from 'fs';

console.log('Nettoyage du fichier ef_3000_words.md pour extraire les mots purs...\n');

// Lire le fichier original
const content = fs.readFileSync('./ef_3000_words.md', 'utf8');
const lines = content.split('\n');

const extractedWords = [];
let inWordList = false;

console.log('Traitement des lignes...');

for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    // Détecter le début de la liste de mots (après la description)
    if (line === 'a' && !inWordList) {
        inWordList = true;
        extractedWords.push('a');
        console.log('Debut de la liste de mots detecte');
        continue;
    }

    if (inWordList && line) {
        // Ignorer les lignes vides et les en-têtes
        if (line.startsWith('#') ||
            line.includes('With 2,500') ||
            line.includes('Test your English') ||
            line.includes('Resources for learning')) {
            continue;
        }

        // Traiter les lignes avec format tableau | mot |  | type |
        if (line.includes('|')) {
            const parts = line.split('|');
            if (parts.length >= 2) {
                const word = parts[1].trim();
                if (word && word.length > 1 && word !== ' ' && !word.includes('adj') && !word.includes('adv') && !word.includes('n.') && !word.includes('v.')) {
                    // Nettoyer le mot
                    const cleanWord = word.toLowerCase().replace(/[^a-z-]/g, '');
                    if (cleanWord && cleanWord.length > 1 && !cleanWord.includes('-')) {
                        extractedWords.push(cleanWord);
                    }
                }
            }
        } else {
            // Traiter les lignes simples (mots seuls)
            const cleanWord = line.toLowerCase().replace(/[^a-z-]/g, '');
            if (cleanWord && cleanWord.length > 1 && !cleanWord.includes('-')) {
                extractedWords.push(cleanWord);
            }
        }
    }
}

// Supprimer les doublons et trier
const uniqueWords = [...new Set(extractedWords)].sort();

console.log(`\nExtraction terminee:`);
console.log(`- Mots originaux: ${extractedWords.length}`);
console.log(`- Mots uniques: ${uniqueWords.length}`);

// Afficher un échantillon
console.log('\nEchantillon des mots extraits:');
uniqueWords.slice(0, 30).forEach((word, index) => {
    console.log(`${index + 1}. ${word}`);
});

// Créer un fichier propre avec uniquement les mots
const cleanContent = `# 3000 Most Common English Words - Clean List

Cette liste contient les 3000 mots anglais les plus courants, extraits et nettoyés.

${uniqueWords.join('\n')}
`;

fs.writeFileSync('./3000_words_clean.txt', cleanContent);

console.log('\n✅ Fichier propre créé: 3000_words_clean.txt');
console.log('Ce fichier contient uniquement les mots purs, sans annotations.');

// Créer aussi une version simple (un mot par ligne)
const simpleContent = uniqueWords.join('\n');
fs.writeFileSync('./words_only.txt', simpleContent);

console.log('✅ Fichier simple créé: words_only.txt');
console.log('Prêt pour l\'importation en base de données !');

console.log('\nDerniers mots de la liste:');
uniqueWords.slice(-10).forEach((word, index) => {
    console.log(`${uniqueWords.length - 10 + index + 1}. ${word}`);
});
