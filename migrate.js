import DataMigration from './src/database/migration.js';

console.log('🚀 Démarrage de la migration des données...\n');

async function runMigration() {
    try {
        const migration = new DataMigration();
        const result = await migration.migrateAll();

        console.log('\n🎉 Migration terminée avec succès !');
        console.log('📈 Votre English App est maintenant alimentée par SQLite\n');

        process.exit(0);
    } catch (error) {
        console.error('❌ Erreur durant la migration:', error);
        process.exit(1);
    }
}

runMigration();
