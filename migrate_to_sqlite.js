import EnglishDB from './src/database/EnglishDB.js';
import fs from 'fs';

// Initialiser la base de données
const db = new EnglishDB();

console.log('🚀 Migration des données vers SQLite...\n');

// === ÉTAPE 1: Migrer les mots existants ===
async function migrateExistingWords() {
    try {
        // Lire les mots depuis notre fichier JS
        const { wordsData } = await import('./src/data/words.js');

        console.log(`📝 Migration de ${wordsData.length} mots existants...`);

        let successCount = 0;
        let errorCount = 0;

        for (const word of wordsData) {
            const wordId = db.addWord({
                word: word.word,
                translation: word.translation,
                pronunciation: word.pronunciation,
                partOfSpeech: word.partOfSpeech,
                definition: word.definition,
                example: word.example,
                exampleTranslation: word.exampleTranslation,
                difficulty: word.difficulty,
                category: word.category,
                frequencyRank: word.id || 0
            });

            if (wordId) {
                successCount++;
            } else {
                errorCount++;
                console.log(`⚠️  Erreur avec le mot: ${word.word}`);
            }
        }

        console.log(`✅ Mots migrés: ${successCount}`);
        console.log(`❌ Erreurs: ${errorCount}`);

    } catch (error) {
        console.error('❌ Erreur lors de la migration des mots existants:', error);
    }
}

// === ÉTAPE 2: Migrer les mots importés ===
async function migrateImportedWords() {
    try {
        if (fs.existsSync('import_words.json')) {
            const importedWords = JSON.parse(fs.readFileSync('import_words.json', 'utf-8'));

            // Prendre seulement les mots avec traductions réelles
            const validWords = importedWords.filter(word =>
                !word.translation.startsWith('[') &&
                word.translation !== word.word
            ).slice(0, 100); // Limiter à 100 pour commencer

            console.log(`\n📦 Migration de ${validWords.length} mots importés...`);

            let successCount = 0;
            let errorCount = 0;

            for (const word of validWords) {
                const wordId = db.addWord({
                    word: word.word,
                    translation: word.translation,
                    pronunciation: word.pronunciation,
                    partOfSpeech: word.partOfSpeech,
                    definition: word.definition,
                    example: word.example,
                    exampleTranslation: word.exampleTranslation,
                    difficulty: word.difficulty,
                    category: word.category,
                    frequencyRank: word.id || 0
                });

                if (wordId) {
                    successCount++;
                } else {
                    errorCount++;
                }
            }

            console.log(`✅ Mots importés: ${successCount}`);
            console.log(`❌ Erreurs: ${errorCount}`);
        }
    } catch (error) {
        console.error('❌ Erreur lors de la migration des mots importés:', error);
    }
}

// === ÉTAPE 3: Ajouter des mots supplémentaires depuis le fichier txt ===
async function addBasicWords() {
    try {
        if (fs.existsSync('3000_english_words.txt')) {
            const wordsText = fs.readFileSync('3000_english_words.txt', 'utf-8');
            const wordsList = wordsText.split('\n')
                .map(word => word.trim())
                .filter(word => word.length > 0)
                .slice(100, 300); // Prendre les mots 100-300

            console.log(`\n📚 Ajout de ${wordsList.length} mots de base...`);

            // Traductions basiques pour les mots courants
            const basicTranslations = {
                'water': 'eau', 'fire': 'feu', 'earth': 'terre', 'air': 'air',
                'sun': 'soleil', 'moon': 'lune', 'star': 'étoile', 'sky': 'ciel',
                'tree': 'arbre', 'flower': 'fleur', 'grass': 'herbe', 'leaf': 'feuille',
                'dog': 'chien', 'cat': 'chat', 'bird': 'oiseau', 'fish': 'poisson',
                'red': 'rouge', 'blue': 'bleu', 'green': 'vert', 'yellow': 'jaune',
                'big': 'grand', 'small': 'petit', 'hot': 'chaud', 'cold': 'froid',
                'run': 'courir', 'walk': 'marcher', 'jump': 'sauter', 'swim': 'nager',
                'eat': 'manger', 'drink': 'boire', 'sleep': 'dormir', 'wake': 'réveiller'
            };

            let addedCount = 0;

            for (const word of wordsList) {
                const translation = basicTranslations[word.toLowerCase()] || `[${word}]`;

                const wordId = db.addWord({
                    word: word,
                    translation: translation,
                    pronunciation: `/${word}/`,
                    partOfSpeech: 'noun',
                    definition: `Définition de ${word}`,
                    example: `Example with ${word}.`,
                    exampleTranslation: `Exemple avec ${translation}.`,
                    difficulty: word.length <= 4 ? 'beginner' : (word.length <= 7 ? 'intermediate' : 'advanced'),
                    category: 'daily-life',
                    frequencyRank: 500 + addedCount
                });

                if (wordId) addedCount++;
            }

            console.log(`✅ Mots de base ajoutés: ${addedCount}`);
        }
    } catch (error) {
        console.error('❌ Erreur lors de l\'ajout des mots de base:', error);
    }
}

// === EXÉCUTION DE LA MIGRATION ===
async function runMigration() {
    console.log('🔄 Début de la migration...\n');

    await migrateExistingWords();
    await migrateImportedWords();
    await addBasicWords();

    // Afficher les statistiques finales
    const totalWords = db.getWordsCount();
    const beginnerWords = db.getWordsCount('beginner');
    const intermediateWords = db.getWordsCount('intermediate');
    const advancedWords = db.getWordsCount('advanced');

    console.log('\n📊 STATISTIQUES FINALES:');
    console.log(`📚 Total des mots: ${totalWords}`);
    console.log(`🟢 Débutant: ${beginnerWords}`);
    console.log(`🟡 Intermédiaire: ${intermediateWords}`);
    console.log(`🔴 Avancé: ${advancedWords}`);

    console.log('\n✅ Migration terminée avec succès !');
    console.log('📍 Base de données créée: englishmaster.db');

    db.close();
}

// Lancer la migration
runMigration().catch(console.error);
