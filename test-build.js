// Script de test pour vérifier si l'application peut être construite
const { execSync } = require('child_process');

try {
    console.log('🔄 Test de construction...');
    execSync('npm run build', { stdio: 'inherit', cwd: __dirname });
    console.log('✅ Construction réussie ! Tailwind CSS complètement supprimé.');
} catch (error) {
    console.error('❌ Erreur de construction:', error.message);
    process.exit(1);
}
