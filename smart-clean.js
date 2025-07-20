import fs from 'fs';

console.log('Nettoyage intelligent du fichier Oxford 3000...\n');

// Lire le fichier words_only.txt
const content = fs.readFileSync('./words_only.txt', 'utf8');
const allWords = content.split('\n').filter(line => line.trim());

console.log(`Mots à traiter: ${allWords.length}`);

// Fonction pour déterminer si un mot est valide
function isValidWord(word) {
    // Mot doit être entre 1 et 15 caractères
    if (word.length < 1 || word.length > 15) return false;

    // Mot ne doit contenir que des lettres minuscules (et éventuellement des tirets)
    if (!/^[a-z-]+$/.test(word)) return false;

    // Exclure les mots avec des patterns suspects
    const suspiciousPatterns = [
        'vb', 'adj', 'adv', 'prep', 'na', 'nb', 'nc',
        'aa', 'bb', 'cc', 'dd', 'ee', 'ff', 'gg',
        'indefinite', 'article', 'preposition',
        'conjunction', 'pronoun', 'determiner'
    ];

    for (const pattern of suspiciousPatterns) {
        if (word.includes(pattern) && word !== pattern) return false;
    }

    // Exclure les mots trop répétitifs
    if (/(.)\1{3,}/.test(word)) return false;

    // Exclure les mots avec trop de tirets
    if ((word.match(/-/g) || []).length > 2) return false;

    return true;
}

// Nettoyer et filtrer les mots
const cleanWords = [];

allWords.forEach(word => {
    const trimmed = word.trim().toLowerCase();

    if (isValidWord(trimmed)) {
        cleanWords.push(trimmed);
    } else {
        console.log(`Exclu: ${trimmed}`);
    }
});

// Supprimer les doublons et trier
const uniqueCleanWords = [...new Set(cleanWords)].sort();

console.log(`\nResultats du nettoyage:`);
console.log(`- Mots originaux: ${allWords.length}`);
console.log(`- Mots valides: ${cleanWords.length}`);
console.log(`- Mots uniques finaux: ${uniqueCleanWords.length}`);

// Afficher un échantillon
console.log('\nEchantillon des mots propres:');
uniqueCleanWords.slice(0, 30).forEach((word, index) => {
    console.log(`${index + 1}. ${word}`);
});

// Sauvegarder la liste finale propre
fs.writeFileSync('./oxford_3000_clean.txt', uniqueCleanWords.join('\n'));

console.log('\n✅ Liste finale sauvegardée: oxford_3000_clean.txt');

// Vérifier quelques mots spécifiques
const testWords = ['company', 'computer', 'beautiful', 'important', 'different', 'government'];
console.log('\nVerification des mots cles:');
testWords.forEach(word => {
    if (uniqueCleanWords.includes(word)) {
        console.log(`✅ ${word} - présent`);
    } else {
        console.log(`❌ ${word} - manquant`);
    }
});

console.log('\nPret pour l\'import en base de donnees !');
