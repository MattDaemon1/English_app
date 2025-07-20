import fetch from 'node-fetch';

// Test de l'API pour vérifier l'affichage des traductions
const testAPI = async () => {
    try {
        console.log('🌐 Test de l\'API http://localhost:3001/api/words...\n');

        const response = await fetch('http://localhost:3001/api/words?limit=10');
        const result = await response.json();

        if (result.success) {
            console.log('✅ API accessible - Premiers mots:');
            result.data.forEach((word, index) => {
                const translation = word.translation || '[ ]';
                console.log(`${index + 1}. "${word.word}" → "${translation}"`);
            });
        } else {
            console.log('❌ Erreur API:', result.error);
        }

    } catch (error) {
        console.error('❌ Erreur de connexion à l\'API:', error.message);
    }
};

testAPI();
