// Script pour traiter les mots anglais et les ajouter à notre base de données

import fs from 'fs';
import path from 'path';

// Lire le fichier des 3000 mots
const wordsFile = fs.readFileSync('3000_english_words.txt', 'utf-8');
const wordsList = wordsFile.split('\n').filter(word => word.trim().length > 0);

console.log(`Nombre de mots trouvés: ${wordsList.length}`);

// Fonction pour générer des traductions et exemples basiques
// (À remplacer par vos données du PDF plus tard)
function generateWordData(word, index) {
    // Traductions approximatives pour les mots les plus courants
    const commonTranslations = {
        'a': 'un/une',
        'abandon': 'abandonner',
        'ability': 'capacité',
        'able': 'capable',
        'about': 'à propos de',
        'above': 'au-dessus',
        'abroad': 'à l\'étranger',
        'absence': 'absence',
        'absolute': 'absolu',
        'absolutely': 'absolument',
        'accept': 'accepter',
        'access': 'accès',
        'accident': 'accident',
        'account': 'compte',
        'accurate': 'précis',
        'achieve': 'atteindre',
        'action': 'action',
        'active': 'actif',
        'activity': 'activité',
        'actor': 'acteur',
        'actress': 'actrice',
        'actual': 'réel',
        'actually': 'en fait',
        'add': 'ajouter',
        'address': 'adresse',
        'adjust': 'ajuster'
        // ... Plus de traductions peuvent être ajoutées
    };

    // Déterminer la difficulté basée sur la longueur et la fréquence
    let difficulty = 'beginner';
    if (word.length > 6 || index > 200) difficulty = 'intermediate';
    if (word.length > 9 || index > 500) difficulty = 'advanced';

    // Déterminer la catégorie basée sur des patterns simples
    let category = 'daily-life';
    if (word.endsWith('ing')) category = 'verbs';
    if (word.endsWith('ly')) category = 'adjectives';
    if (word.includes('tech') || word.includes('computer')) category = 'technology';

    return {
        id: index + 21, // Commencer après nos 20 mots existants
        word: word,
        translation: commonTranslations[word] || `[À traduire: ${word}]`,
        pronunciation: `[/${word}/]`, // Placeholder pour la prononciation
        partOfSpeech: "noun", // Placeholder
        definition: `Définition de ${word}`, // Placeholder
        example: `This is an example with ${word}.`,
        exampleTranslation: `Ceci est un exemple avec ${word}.`,
        difficulty: difficulty,
        category: category
    };
}

// Générer les données pour les 100 premiers mots (pour commencer)
const newWordsData = wordsList.slice(0, 100).map((word, index) => generateWordData(word, index));

// Afficher un aperçu
console.log('Aperçu des premiers mots générés:');
console.log(JSON.stringify(newWordsData.slice(0, 5), null, 2));

// Sauvegarder dans un fichier temporaire
fs.writeFileSync('generated_words.json', JSON.stringify(newWordsData, null, 2));
console.log('Mots générés sauvegardés dans generated_words.json');
