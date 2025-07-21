Write-Host "Revenir au commit 010da985fa97c24d29c8af57231e93864cf6ca04..."
Set-Location "c:\Users\mattm\Projects\English_app"

# Afficher le commit actuel
Write-Host "Commit actuel:"
git log --oneline -1

Write-Host ""
Write-Host "Retour au commit cible..."

# Reset vers le commit spécifié
git reset --hard 010da985fa97c24d29c8af57231e93864cf6ca04

Write-Host ""
Write-Host "Commit après reset:"
git log --oneline -1

Write-Host ""
Write-Host "Status du repository:"
git status

Write-Host ""
Write-Host "Operation terminée!"
Read-Host "Appuyez sur Entrée pour continuer..."
