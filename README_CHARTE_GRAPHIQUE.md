# 🎓 EnglishMaster - Nouvelle Charte Graphique

## 🎨 Aperçu de la Charte

La nouvelle charte graphique EnglishMaster a été conçue pour optimiser l'expérience d'apprentissage avec :

- **Fond crème doux** `#FAF8F6` - Reposant pour les yeux
- **Texte ardoise** `#1E293B` - Contraste optimal pour la lecture
- **Bleu modéré** `#2563EB` - Non saturé, professionnel
- **Système de score coloré** - Rouge/Orange/Vert selon performance

## 🔧 Implementation Technique

### Couleurs Principales
```css
:root {
  --bg-cream: #FAF8F6;        /* Fond principal */
  --text-primary: #1E293B;    /* Texte principal (gris ardoise foncé) */
  --text-secondary: #334155;  /* Sous-titres (plus doux) */
  --text-tertiary: #64748B;   /* Détails, commentaires */
  --text-link: #2563EB;       /* Liens cliquables */
  
  --btn-primary: #2563EB;     /* Bouton principal (bleu doux) */
  --btn-primary-hover: #1E40AF; /* Hover bleu foncé */
  --btn-secondary: #E2E8F0;   /* Bouton secondaire (gris clair bleuté) */
  
  --score-excellent: #10B981; /* 7-10 (vert) */
  --score-moyen: #F59E0B;     /* 4-6 (orange) */
  --score-faible: #EF4444;    /* 0-3 (rouge) */
}
```

### Boutons
```css
button.primary {
  background-color: #2563EB;
  color: #FFFFFF;
  border-radius: 10px;
  padding: 10px 16px;
  font-weight: 600;
  font-size: 16px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.08);
  transition: all 0.2s ease-in-out;
}

button.primary:hover {
  background-color: #1E40AF;
  transform: translateY(-1px);
}
```

### Cartes
```css
.card {
  background-color: #FFFFFF;
  border: 1px solid #E5E7EB;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 1px 4px rgba(0,0,0,0.05);
  transition: all 0.3s ease-in-out;
}
```

## 📊 Système de Score

| Score | Couleur | Usage |
|-------|---------|-------|
| 0-3   | `#EF4444` 🔴 | Score faible - À améliorer |
| 4-6   | `#F59E0B` 🟠 | Score moyen - Bien |
| 7-10  | `#10B981` 🟢 | Score excellent |

## 🖋️ Typographie

- **Police principale** : Inter (lisible, neutre)
- **Police titres** : Poppins (moderne, arrondie)
- **Taille de base** : 16px
- **Titres** : 28-36px, font-weight: 700
- **Boutons** : 16-18px, font-weight: 600

## ✨ Améliorations UI

### Transitions Globales
```css
* {
  transition: all 0.2s ease-in-out;
}
```

### Mode Sombre Automatique
- Basé sur `#1F2937` comme vous l'avez demandé
- S'adapte automatiquement aux préférences système
- Couleurs optimisées pour la lisibilité nocturne

### Responsive Design
- Mobile-first approach
- Breakpoints : 768px (tablette), 1024px (desktop)
- Typographie fluide avec `clamp()`

## 🚀 Utilisation

### Dans les Thèmes React
```javascript
const theme = {
  name: "🎓 EnglishMaster",
  background: "bg-[#FAF8F6]",
  text: "text-[#1E293B]",
  button: "bg-[#2563EB] hover:bg-[#1E40AF] text-white rounded-[10px]",
  // ...
}
```

### Classes CSS Disponibles
```html
<div class="card-englishmaster">
  <h1 class="title-main">Titre Principal</h1>
  <p class="text-secondary">Texte secondaire</p>
  <button class="btn-englishmaster btn-primary">Action</button>
  <div class="score-excellent">8/10 - Excellent!</div>
</div>
```

## 📁 Structure des Fichiers

```
src/
├── styles/
│   ├── englishmaster.css    # Nouvelle charte CSS
│   └── typography.css       # Système typographique
├── themes/
│   └── index.js            # Thèmes React (classic = EnglishMaster)
└── components/
    └── CharteEnglishMasterDemo.jsx  # Démonstration complète
```

## 🎯 Objectifs Atteints

✅ **Fond crème doux** - `#FAF8F6` reposant pour les yeux  
✅ **Texte lisible** - Contraste optimal avec `#1E293B`  
✅ **Boutons harmonieux** - Bleu modéré non saturé  
✅ **Score coloré** - Système Rouge/Orange/Vert intuitif  
✅ **Animations douces** - Transitions 0.2s sur tous éléments  
✅ **Mode sombre** - Adaptation automatique `#1F2937`  
✅ **Design responsive** - Mobile-first avec breakpoints  
✅ **Remplacement classique** - Le thème "Classic" est devenu "EnglishMaster"  

## 🔄 Migration

Le thème "Classic" a été remplacé par "EnglishMaster" comme demandé. L'application utilise maintenant automatiquement la nouvelle charte graphique avec :

- Fond crème au lieu du gris
- Nouvelle palette de couleurs harmonieuse  
- Système de typographie optimisé
- Indicateurs de score améliorés
- Transitions globales douces

---

*Charte graphique optimisée pour l'apprentissage de l'anglais - Juillet 2025*
