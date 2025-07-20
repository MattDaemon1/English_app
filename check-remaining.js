import Database from 'better-sqlite3';

// Ouvrir la base de données
const db = new Database('english-app.db');

console.log('🔍 Vérification des mots restants...\n');

// Compter les mots sans traduction
const result = db.prepare('SELECT COUNT(*) as count FROM words WHERE translation = ?').get('[ ]');
console.log(`Mots restants à traduire: ${result.count}`);

// Afficher quelques exemples
const examples = db.prepare('SELECT word FROM words WHERE translation = ? LIMIT 10').all('[ ]');
console.log('\nExemples de mots à traduire:');
examples.forEach((row, index) => {
    console.log(`${index + 1}. ${row.word}`);
});

db.close();
