import { getDatabase } from './src/database/database.js';

const db = getDatabase();

console.log('🎯 Correction des mots visibles dans le quiz...\n');

// Mots spécifiques vus dans le screenshot du quiz
const quizTranslations = {
    'designer': 'concepteur',
    'band': 'groupe',
    'clinic': 'clinique',
    'come': 'venir',
    'design': 'concevoir',
    'designer': 'concepteur',
    'band': 'groupe',
    'clinic': 'clinique',
    'hospital': 'hôpital',
    'doctor': 'médecin',
    'nurse': 'infirmière',
    'patient': 'patient',
    'medicine': 'médicament',
    'treatment': 'traitement',
    'surgery': 'chirurgie',
    'emergency': 'urgence',
    'appointment': 'rendez-vous',
    'prescription': 'ordonnance',
    'therapy': 'thérapie',
    'diagnosis': 'diagnostic',
    'symptom': 'symptôme',
    'illness': 'maladie',
    'recovery': 'rétablissement',
    'health': 'santé',
    'medical': 'médical',
    'professional': 'professionnel',
    'expert': 'expert',
    'specialist': 'spécialiste',
    'consultant': 'consultant',
    'architect': 'architecte',
    'engineer': 'ingénieur',
    'artist': 'artiste',
    'musician': 'musicien',
    'singer': 'chanteur',
    'performer': 'interprète',
    'actor': 'acteur',
    'director': 'directeur',
    'producer': 'producteur',
    'manager': 'gestionnaire',
    'supervisor': 'superviseur',
    'coordinator': 'coordinateur',
    'administrator': 'administrateur',
    'assistant': 'assistant',
    'secretary': 'secrétaire',
    'receptionist': 'réceptionniste',
    'accountant': 'comptable',
    'lawyer': 'avocat',
    'judge': 'juge',
    'police': 'police',
    'officer': 'officier',
    'detective': 'détective',
    'investigator': 'enquêteur',
    'reporter': 'journaliste',
    'journalist': 'journaliste',
    'editor': 'éditeur',
    'writer': 'écrivain',
    'author': 'auteur',
    'photographer': 'photographe',
    'cameraman': 'cadreur',
    'technician': 'technicien',
    'mechanic': 'mécanicien',
    'electrician': 'électricien',
    'plumber': 'plombier',
    'carpenter': 'charpentier',
    'builder': 'constructeur',
    'contractor': 'entrepreneur',
    'supplier': 'fournisseur',
    'vendor': 'vendeur',
    'customer': 'client',
    'client': 'client',
    'buyer': 'acheteur',
    'seller': 'vendeur',
    'dealer': 'marchand',
    'trader': 'commerçant',
    'merchant': 'négociant',
    'retailer': 'détaillant',
    'wholesaler': 'grossiste',
    'distributor': 'distributeur',
    'manufacturer': 'fabricant',
    'producer': 'producteur',
    'creator': 'créateur',
    'inventor': 'inventeur',
    'developer': 'développeur',
    'programmer': 'programmeur',
    'analyst': 'analyste',
    'researcher': 'chercheur',
    'scientist': 'scientifique',
    'professor': 'professeur',
    'teacher': 'enseignant',
    'instructor': 'instructeur',
    'tutor': 'tuteur',
    'mentor': 'mentor',
    'coach': 'entraîneur',
    'trainer': 'formateur',
    'guide': 'guide',
    'leader': 'leader',
    'captain': 'capitaine',
    'chief': 'chef',
    'boss': 'patron',
    'owner': 'propriétaire',
    'founder': 'fondateur',
    'president': 'président',
    'director': 'directeur',
    'executive': 'cadre',
    'chairman': 'président',
    'board': 'conseil',
    'committee': 'comité',
    'team': 'équipe',
    'group': 'groupe',
    'organization': 'organisation',
    'company': 'entreprise',
    'corporation': 'société',
    'business': 'entreprise',
    'firm': 'cabinet',
    'agency': 'agence',
    'office': 'bureau',
    'department': 'département',
    'division': 'division',
    'section': 'section',
    'unit': 'unité',
    'branch': 'succursale',
    'headquarters': 'siège social',
    'facility': 'installation',
    'location': 'emplacement',
    'site': 'site',
    'place': 'lieu',
    'venue': 'lieu',
    'destination': 'destination',
    'address': 'adresse',
    'position': 'position',
    'spot': 'endroit',
    'area': 'zone',
    'region': 'région',
    'territory': 'territoire',
    'district': 'district',
    'neighborhood': 'quartier',
    'community': 'communauté',
    'society': 'société',
    'culture': 'culture',
    'tradition': 'tradition',
    'custom': 'coutume',
    'habit': 'habitude',
    'practice': 'pratique',
    'routine': 'routine',
    'procedure': 'procédure',
    'process': 'processus',
    'method': 'méthode',
    'technique': 'technique',
    'approach': 'approche',
    'strategy': 'stratégie',
    'plan': 'plan',
    'scheme': 'schéma',
    'program': 'programme',
    'project': 'projet',
    'initiative': 'initiative',
    'campaign': 'campagne',
    'operation': 'opération',
    'activity': 'activité',
    'event': 'événement',
    'occasion': 'occasion',
    'ceremony': 'cérémonie',
    'celebration': 'célébration',
    'festival': 'festival',
    'party': 'fête',
    'gathering': 'rassemblement',
    'meeting': 'réunion',
    'conference': 'conférence',
    'seminar': 'séminaire',
    'workshop': 'atelier',
    'training': 'formation',
    'course': 'cours',
    'class': 'classe',
    'lesson': 'leçon',
    'session': 'session',
    'lecture': 'conférence'
};

// Fonction pour corriger les mots du quiz
function correctQuizWords() {
    let corrected = 0;

    for (const [word, translation] of Object.entries(quizTranslations)) {
        try {
            const stmt = db.db.prepare(`
                UPDATE words 
                SET translation = ?, 
                    updated_at = CURRENT_TIMESTAMP
                WHERE word = ? AND translation = ?
            `);

            const result = stmt.run(translation, word, `[${word}]`);

            if (result.changes > 0) {
                console.log(`✅ ${word} -> ${translation}`);
                corrected++;
            }
        } catch (error) {
            console.error(`❌ Erreur pour "${word}":`, error.message);
        }
    }

    return corrected;
}

console.log('🔄 Correction des mots du quiz...');
const corrected = correctQuizWords();

console.log(`\n📊 Résumé:`);
console.log(`   ✅ Mots corrigés: ${corrected}`);

// Vérification spécifique des mots du screenshot
const testWords = ['designer', 'band', 'clinic', 'come'];
console.log('\n🎯 Vérification des mots du quiz:');
testWords.forEach(word => {
    const result = db.db.prepare(`
        SELECT word, translation 
        FROM words 
        WHERE word = ?
    `).get(word);

    if (result) {
        console.log(`   ${result.word} -> ${result.translation}`);
    }
});

console.log('\n🎉 Le quiz devrait maintenant afficher les bonnes traductions !');

db.db.close();
