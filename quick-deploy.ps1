# 🚀 Script de Déploiement Rapide PowerShell - EnglishMaster

param(
    [string]$Message = "Déploiement auto - $(Get-Date -Format 'dd/MM/yyyy HH:mm')",
    [switch]$Monitor,
    [switch]$Force,
    [switch]$Help
)

# Couleurs PowerShell
$Colors = @{
    Reset = "`e[0m"
    Red = "`e[31m"
    Green = "`e[32m"
    Yellow = "`e[33m"
    Blue = "`e[34m"
    Magenta = "`e[35m"
    Cyan = "`e[36m"
    Bright = "`e[1m"
}

function Write-ColoredOutput {
    param([string]$Message, [string]$Color = "Reset")
    Write-Host "$($Colors[$Color])$Message$($Colors.Reset)"
}

function Test-GitChanges {
    Write-ColoredOutput "🔍 Vérification des modifications Git..." "Cyan"
    $changes = git status --porcelain
    
    if ($changes) {
        Write-ColoredOutput "📝 Modifications détectées:" "Yellow"
        $changes | ForEach-Object { Write-Host "  $_" }
        return $true
    } else {
        Write-ColoredOutput "✅ Aucune modification en attente" "Green"
        return $false
    }
}

function Invoke-Build {
    Write-ColoredOutput "🏗️ Build de l'application..." "Cyan"
    
    try {
        npm run build
        if ($LASTEXITCODE -eq 0) {
            Write-ColoredOutput "✅ Build réussi !" "Green"
            return $true
        } else {
            Write-ColoredOutput "❌ Build échoué !" "Red"
            return $false
        }
    } catch {
        Write-ColoredOutput "❌ Erreur lors du build: $($_.Exception.Message)" "Red"
        return $false
    }
}

function Invoke-Deploy {
    param([string]$CommitMessage)
    
    Write-ColoredOutput "🚀 Déploiement sur Heroku..." "Cyan"
    
    try {
        # Ajouter tous les fichiers
        git add .
        
        # Commit
        git commit -m $CommitMessage
        if ($LASTEXITCODE -ne 0 -and (git status --porcelain)) {
            Write-ColoredOutput "❌ Erreur lors du commit" "Red"
            return $false
        }
        
        # Push vers Heroku
        git push heroku master
        if ($LASTEXITCODE -eq 0) {
            Write-ColoredOutput "✅ Déploiement réussi !" "Green"
            return $true
        } else {
            Write-ColoredOutput "❌ Déploiement échoué !" "Red"
            return $false
        }
    } catch {
        Write-ColoredOutput "❌ Erreur lors du déploiement: $($_.Exception.Message)" "Red"
        return $false
    }
}

function Start-LogMonitoring {
    Write-ColoredOutput "📊 Surveillance des logs Heroku..." "Cyan"
    Write-ColoredOutput "Appuyez sur Ctrl+C pour arrêter la surveillance" "Yellow"
    
    try {
        heroku logs --tail --app englishmaster-learning
    } catch {
        Write-ColoredOutput "❌ Erreur lors de la surveillance: $($_.Exception.Message)" "Red"
    }
}

function Show-AppInfo {
    Write-ColoredOutput "`n📱 Informations de l'application:" "Magenta"
    Write-ColoredOutput "🌐 URL: https://englishmaster-learning-34511c3cdb5b.herokuapp.com" "Blue"
    Write-ColoredOutput "📊 Logs: heroku logs --tail --app englishmaster-learning" "Blue"
    Write-ColoredOutput "🔄 Restart: heroku restart --app englishmaster-learning" "Blue"
    Write-ColoredOutput "📋 Status: heroku ps --app englishmaster-learning" "Blue"
}

function Show-Help {
    Write-ColoredOutput "`n📖 Utilisation du script de déploiement:" "Yellow"
    Write-ColoredOutput ".\quick-deploy.ps1 [Options]" "Blue"
    Write-ColoredOutput "`nOptions:" "Yellow"
    Write-ColoredOutput "  -Message `"Votre message`"  - Message de commit personnalisé" "Blue"
    Write-ColoredOutput "  -Monitor                   - Surveiller les logs après déploiement" "Blue"
    Write-ColoredOutput "  -Force                     - Forcer le déploiement même sans changements" "Blue"
    Write-ColoredOutput "  -Help                      - Afficher cette aide" "Blue"
    Write-ColoredOutput "`nExemples:" "Yellow"
    Write-ColoredOutput "  .\quick-deploy.ps1" "Blue"
    Write-ColoredOutput "  .\quick-deploy.ps1 -Message `"Nouvelle fonctionnalité`"" "Blue"
    Write-ColoredOutput "  .\quick-deploy.ps1 -Monitor" "Blue"
    Write-ColoredOutput "  .\quick-deploy.ps1 -Force -Monitor" "Blue"
}

# Script principal
if ($Help) {
    Show-Help
    exit 0
}

Write-ColoredOutput "🚀 EnglishMaster - Déploiement Rapide" "Bright"
Write-ColoredOutput "====================================" "Bright"

# Vérifier les modifications
$hasChanges = Test-GitChanges

if (-not $hasChanges -and -not $Force) {
    Write-ColoredOutput "`n⚠️ Aucune modification à déployer. Utilisez -Force pour forcer le déploiement." "Yellow"
    Show-AppInfo
    exit 0
}

# Build
if (-not (Invoke-Build)) {
    Write-ColoredOutput "`n❌ Déploiement annulé suite au build" "Red"
    exit 1
}

# Déploiement
if (Invoke-Deploy -CommitMessage $Message) {
    Show-AppInfo
    
    if ($Monitor) {
        Start-Sleep -Seconds 3
        Start-LogMonitoring
    }
} else {
    Write-ColoredOutput "`n❌ Échec du déploiement" "Red"
    exit 1
}
