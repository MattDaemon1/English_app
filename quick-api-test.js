// Test simple de l'API avec curl equivalent
import { spawn } from 'child_process';

console.log('🔌 Test de l\'API avec une requête simple...\n');

// Utiliser PowerShell pour faire une requête
const process = spawn('powershell', [
    '-Command',
    'Invoke-WebRequest -Uri "http://localhost:3001/api/words" -Method GET | Select-Object -ExpandProperty Content | ConvertFrom-Json | Select-Object -First 5 -ExpandProperty data | ForEach-Object { Write-Host "$($_.word): $($_.translation)" }'
]);

process.stdout.on('data', (data) => {
    console.log(data.toString());
});

process.stderr.on('data', (data) => {
    console.error('Erreur:', data.toString());
});

process.on('close', (code) => {
    console.log(`\n✅ Test terminé avec le code: ${code}`);
});
