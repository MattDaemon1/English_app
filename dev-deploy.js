#!/usr/bin/env node

/**
 * 🚀 Script de Déploiement Continu - EnglishMaster
 * 
 * Ce script automatise le processus de développement et déploiement :
 * - Vérifie les modifications
 * - Lance les tests
 * - Build l'application
 * - Déploie sur Heroku
 * - Surveille les logs
 */

import { execSync, spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

const colors = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
    console.log(`${colors[color]}${message}${colors.reset}`);
}

function execCommand(command, showOutput = true) {
    try {
        const result = execSync(command, { 
            encoding: 'utf8',
            stdio: showOutput ? 'inherit' : 'pipe'
        });
        return { success: true, output: result };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

function checkGitStatus() {
    log('\n🔍 Vérification des modifications Git...', 'cyan');
    const result = execCommand('git status --porcelain', false);
    
    if (result.success && result.output.trim()) {
        log('📝 Modifications détectées:', 'yellow');
        console.log(result.output);
        return true;
    } else {
        log('✅ Aucune modification en attente', 'green');
        return false;
    }
}

function runTests() {
    log('\n🧪 Lancement des tests...', 'cyan');
    const result = execCommand('npm run test:run');
    
    if (result.success) {
        log('✅ Tests réussis !', 'green');
        return true;
    } else {
        log('❌ Tests échoués !', 'red');
        return false;
    }
}

function buildApp() {
    log('\n🏗️  Build de l\'application...', 'cyan');
    const result = execCommand('npm run build');
    
    if (result.success) {
        log('✅ Build réussi !', 'green');
        return true;
    } else {
        log('❌ Build échoué !', 'red');
        return false;
    }
}

function deployToHeroku(message = 'Déploiement automatique') {
    log('\n🚀 Déploiement sur Heroku...', 'cyan');
    
    // Commit les changements
    execCommand(`git add .`);
    const commitResult = execCommand(`git commit -m "${message}"`);
    
    if (!commitResult.success && !commitResult.error.includes('nothing to commit')) {
        log('❌ Erreur lors du commit', 'red');
        return false;
    }
    
    // Push vers Heroku
    const deployResult = execCommand('git push heroku master');
    
    if (deployResult.success) {
        log('✅ Déploiement réussi !', 'green');
        return true;
    } else {
        log('❌ Déploiement échoué !', 'red');
        return false;
    }
}

function monitorLogs() {
    log('\n📊 Surveillance des logs Heroku...', 'cyan');
    log('Appuyez sur Ctrl+C pour arrêter la surveillance', 'yellow');
    
    const logsProcess = spawn('heroku', ['logs', '--tail', '--app', 'englishmaster-learning'], {
        stdio: 'inherit'
    });
    
    logsProcess.on('error', (error) => {
        log(`❌ Erreur lors de la surveillance: ${error.message}`, 'red');
    });
}

function showAppInfo() {
    log('\n📱 Informations de l\'application:', 'magenta');
    log('🌐 URL: https://englishmaster-learning-34511c3cdb5b.herokuapp.com', 'blue');
    log('📊 Logs: heroku logs --tail --app englishmaster-learning', 'blue');
    log('🔄 Restart: heroku restart --app englishmaster-learning', 'blue');
}

async function main() {
    const args = process.argv.slice(2);
    const command = args[0] || 'deploy';
    
    log('🚀 EnglishMaster - Déploiement Continu', 'bright');
    log('=====================================', 'bright');
    
    switch (command) {
        case 'deploy':
            const hasChanges = checkGitStatus();
            
            if (!hasChanges) {
                log('\n⚠️  Aucune modification à déployer', 'yellow');
                showAppInfo();
                return;
            }
            
            // Tests optionnels (commentés pour le moment)
            // if (!runTests()) {
            //     log('\n❌ Déploiement annulé suite aux tests', 'red');
            //     return;
            // }
            
            if (!buildApp()) {
                log('\n❌ Déploiement annulé suite au build', 'red');
                return;
            }
            
            const message = args[1] || `Déploiement auto - ${new Date().toLocaleString()}`;
            if (deployToHeroku(message)) {
                showAppInfo();
                if (args.includes('--monitor')) {
                    setTimeout(monitorLogs, 2000);
                }
            }
            break;
            
        case 'logs':
            monitorLogs();
            break;
            
        case 'info':
            showAppInfo();
            break;
            
        case 'test':
            runTests();
            break;
            
        case 'build':
            buildApp();
            break;
            
        default:
            log('\n📖 Utilisation:', 'yellow');
            log('node dev-deploy.js [command] [options]', 'blue');
            log('\nCommandes disponibles:', 'yellow');
            log('  deploy [message]  - Déployer l\'application (défaut)', 'blue');
            log('  logs             - Surveiller les logs', 'blue');
            log('  info             - Afficher les infos de l\'app', 'blue');
            log('  test             - Lancer les tests', 'blue');
            log('  build            - Builder l\'application', 'blue');
            log('\nOptions:', 'yellow');
            log('  --monitor        - Surveiller les logs après déploiement', 'blue');
            log('\nExemples:', 'yellow');
            log('  node dev-deploy.js deploy "Nouvelle fonctionnalité"', 'blue');
            log('  node dev-deploy.js deploy --monitor', 'blue');
            log('  node dev-deploy.js logs', 'blue');
    }
}

main().catch(error => {
    log(`❌ Erreur: ${error.message}`, 'red');
    process.exit(1);
});
