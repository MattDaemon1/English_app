/**
 * 🔄 Watcher de Développement Continu - EnglishMaster
 * 
 * Ce script surveille les modifications de fichiers et propose
 * automatiquement de redéployer l'application.
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

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
    const timestamp = new Date().toLocaleTimeString();
    console.log(`${colors[color]}[${timestamp}] ${message}${colors.reset}`);
}

// Fichiers à surveiller (patterns)
const watchPatterns = [
    '*.jsx', '*.js', '*.css', '*.html', '*.md',
    'src/**/*.jsx', 'src/**/*.js', 'src/**/*.css',
    'server.js', 'package.json', 'vite.config.js'
];

// Fichiers à ignorer
const ignorePatterns = [
    'node_modules', '.git', 'dist', '.env', '.log',
    'dev-deploy.js', 'dev-watcher.js', 'quick-deploy.ps1'
];

let isWatching = false;
let lastDeployTime = 0;
const deployCooldown = 30000; // 30 secondes entre déploiements

function shouldIgnoreFile(filePath) {
    return ignorePatterns.some(pattern => filePath.includes(pattern));
}

function getFileList(dir = '.', files = []) {
    const items = fs.readdirSync(dir);
    
    for (const item of items) {
        const fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory() && !shouldIgnoreFile(fullPath)) {
            getFileList(fullPath, files);
        } else if (stat.isFile() && !shouldIgnoreFile(fullPath)) {
            // Vérifier si le fichier correspond aux patterns
            const ext = path.extname(fullPath);
            const fileName = path.basename(fullPath);
            
            if (watchPatterns.some(pattern => {
                if (pattern.includes('**/')) {
                    return fullPath.includes(pattern.replace('**/', '').replace('*', ''));
                }
                return pattern.includes(ext) || pattern.includes(fileName);
            })) {
                files.push({
                    path: fullPath,
                    mtime: stat.mtime.getTime()
                });
            }
        }
    }
    
    return files;
}

function checkForChanges() {
    try {
        const result = execSync('git status --porcelain', { encoding: 'utf8' });
        return result.trim().length > 0;
    } catch (error) {
        return false;
    }
}

function promptDeploy() {
    const now = Date.now();
    if (now - lastDeployTime < deployCooldown) {
        log(`⏳ Déploiement en cooldown (${Math.ceil((deployCooldown - (now - lastDeployTime)) / 1000)}s restantes)`, 'yellow');
        return;
    }
    
    log('🚀 Modifications détectées ! Voulez-vous déployer ?', 'cyan');
    log('Tapez "d" + Entrée pour déployer, ou Entrée pour ignorer', 'yellow');
    
    process.stdin.setRawMode(false);
    process.stdin.resume();
    
    const rl = require('readline').createInterface({
        input: process.stdin,
        output: process.stdout
    });
    
    rl.question('> ', (answer) => {
        rl.close();
        
        if (answer.toLowerCase().trim() === 'd') {
            log('🚀 Déploiement en cours...', 'green');
            lastDeployTime = Date.now();
            
            try {
                execSync('node dev-deploy.js deploy "Auto-deploy par watcher"', { stdio: 'inherit' });
                log('✅ Déploiement terminé !', 'green');
            } catch (error) {
                log('❌ Erreur lors du déploiement', 'red');
            }
        } else {
            log('⏭️ Déploiement ignoré', 'blue');
        }
        
        log('👀 Surveillance reprise...', 'cyan');
        setTimeout(startWatching, 1000);
    });
}

function startWatching() {
    if (isWatching) return;
    
    isWatching = true;
    log('👀 Démarrage de la surveillance...', 'cyan');
    
    let fileStates = new Map();
    const files = getFileList();
    
    // Initialiser l'état des fichiers
    files.forEach(file => {
        fileStates.set(file.path, file.mtime);
    });
    
    log(`📁 Surveillance de ${files.length} fichiers`, 'blue');
    
    // Vérification périodique
    const checkInterval = setInterval(() => {
        if (!isWatching) {
            clearInterval(checkInterval);
            return;
        }
        
        const currentFiles = getFileList();
        let hasChanges = false;
        let changedFiles = [];
        
        // Vérifier les modifications
        currentFiles.forEach(file => {
            const oldMtime = fileStates.get(file.path);
            if (!oldMtime || file.mtime > oldMtime) {
                hasChanges = true;
                changedFiles.push(file.path);
                fileStates.set(file.path, file.mtime);
            }
        });
        
        // Vérifier les nouveaux fichiers
        if (currentFiles.length !== fileStates.size) {
            hasChanges = true;
        }
        
        if (hasChanges && checkForChanges()) {
            isWatching = false;
            clearInterval(checkInterval);
            
            log(`📝 Fichiers modifiés: ${changedFiles.join(', ')}`, 'yellow');
            promptDeploy();
        }
    }, 2000); // Vérifier toutes les 2 secondes
}

function stopWatching() {
    isWatching = false;
    log('⏹️ Arrêt de la surveillance', 'yellow');
}

// Gestion des signaux d'arrêt
process.on('SIGINT', () => {
    stopWatching();
    log('👋 Au revoir !', 'green');
    process.exit(0);
});

process.on('SIGTERM', stopWatching);

// Démarrage
log('🔄 EnglishMaster - Surveillance Continue', 'bright');
log('=======================================', 'bright');
log('Appuyez sur Ctrl+C pour arrêter', 'yellow');

startWatching();
