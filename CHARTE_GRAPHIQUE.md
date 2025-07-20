# 🎨 Charte Graphique EnglishMaster

## Vue d'ensemble
Cette charte graphique définit l'identité visuelle de l'application EnglishMaster, optimisée pour l'apprentissage de l'anglais avec une approche moderne, accessible et engageante.

## 🎯 Objectifs de Design
- **Lisibilité maximale** : Contraste élevé et typographie claire
- **Expérience ludique** : Couleurs vives et animations subtiles  
- **Accessibilité** : Conformité WCAG 2.1 AA
- **Cohérence** : Système de design unifié
- **Modernité** : Tendances actuelles avec durabilité

## 🎨 Palette de Couleurs

### Couleurs Principales
| Couleur | Usage | Code HEX | Variable CSS |
|---------|-------|----------|--------------|
| 🔵 Bleu océan | Couleur principale (CTA, liens) | `#3B82F6` | `--color-ocean-blue` |
| 🟢 Vert forêt | Validation, succès | `#10B981` | `--color-forest-green` |
| 🟠 Orange coucher | Avertissements, accents chauds | `#F97316` | `--color-sunset-orange` |
| 🟣 Violet mystique | Accent secondaire, ambiance fun | `#8B5CF6` | `--color-mystique-purple` |

### Couleurs Neutres
| Couleur | Usage | Code HEX | Variable CSS |
|---------|-------|----------|--------------|
| ⚪ Gris clair | Fond principal | `#F4F4F5` | `--color-light-gray` |
| ⚫ Gris foncé | Texte principal | `#1F2937` | `--color-dark-gray` |
| ⚪ Blanc | Fond secondaire / cartes | `#FFFFFF` | `--color-white` |
| 🔴 Rouge clair | Erreurs, mauvaises réponses | `#EF4444` | `--color-light-red` |

## 🖋️ Système Typographique

### Polices Recommandées
1. **Titre/Logo** : `Poppins` (arrondi, moderne, accessible)
2. **Texte courant** : `Inter` (lisible, neutre)
3. **Accent/Citations** : `Playfair Display` (optionnel, élégant)

### Hiérarchie Typographique
| Élément | Police | Taille | Poids | Classe CSS |
|---------|--------|--------|--------|------------|
| Titre principal | Poppins | 32-40px | Bold | `.title-main` |
| Sous-titre | Inter | 24-28px | Semi-bold | `.subtitle` |
| Texte de question | Inter | 20-22px | Medium | `.question-text` |
| Réponses/boutons | Inter | 16-18px | Medium | `.button-text` |
| Notes secondaires | Inter | 14px | Regular | `.note-text` |
| Citations/accents | Playfair Display | Variable | Regular/Italic | `.accent-text` |

## 🧩 Composants UI

### Boutons
```css
/* Structure de base */
.btn-english-master {
  font-family: 'Inter', sans-serif;
  font-weight: 500;
  border-radius: 12px;
  box-shadow: rgba(0, 0, 0, 0.1) 0px 2px 8px;
  transition: all 0.2s ease;
  padding: 12px 24px;
}

/* Variantes */
.btn-primary { background-color: #3B82F6; } /* Bleu océan */
.btn-success { background-color: #10B981; } /* Vert forêt */
.btn-warning { background-color: #F97316; } /* Orange coucher */
.btn-danger { background-color: #EF4444; }  /* Rouge erreur */
```

### Cartes
```css
.card-english-master {
  background-color: #FFFFFF;
  border: 1px solid #E5E7EB;
  border-radius: 12px;
  box-shadow: rgba(0, 0, 0, 0.05) 0px 4px 12px;
  padding: 24px;
  transition: all 0.3s ease;
}

.card-english-master:hover {
  box-shadow: rgba(0, 0, 0, 0.1) 0px 8px 24px;
  transform: translateY(-2px);
}
```

### Indicateurs de Score
Système de couleurs basé sur les performances :

| Score | Couleur | Signification |
|-------|---------|---------------|
| 0-4/10 | Rouge clair | À améliorer |
| 5-7/10 | Orange | Bien |
| 8-10/10 | Vert | Excellent |

## 🌙 Mode Sombre

### Adaptation des Couleurs
| Élément | Mode Clair | Mode Sombre |
|---------|------------|-------------|
| Fond principal | `#F4F4F5` | `#18181B` |
| Fond cartes | `#FFFFFF` | `#27272A` |
| Texte principal | `#1F2937` | `#F4F4F5` |
| Bordures | `#E5E7EB` | `#3F3F46` |

## 🎯 Principes d'Utilisation

### Accessibilité
- **Contraste minimum** : 4.5:1 pour le texte normal
- **Contraste élevé** : 7:1 pour le texte important
- **Support clavier** : Navigation complète sans souris
- **Screen readers** : Labels ARIA appropriés

### Responsive Design
- **Mobile-first** : Conception prioritaire mobile
- **Breakpoints** : 768px (tablette), 1024px (desktop)
- **Typographie fluide** : `clamp()` pour l'adaptation automatique

### Animations
- **Durée** : 200ms pour les interactions, 300ms pour les transitions
- **Easing** : `ease` ou `cubic-bezier(0.4, 0, 0.2, 1)`
- **Hover effects** : `transform: translateY(-2px)` et ombres

## 🛠️ Implémentation Technique

### Structure CSS
```
src/styles/
├── typography.css     # Système typographique complet
├── components.css     # Composants UI réutilisables
└── variables.css      # Variables CSS personnalisées
```

### Classes Utilitaires Tailwind
```javascript
// Exemple d'utilisation dans les composants
const theme = {
  button: "bg-blue-500 hover:bg-blue-600 text-white rounded-xl",
  card: "bg-white border border-gray-200 rounded-xl shadow-md",
  text: "text-gray-800",
  // ...
}
```

### Integration avec React
```jsx
import { getThemeClasses } from '../themes';

// Utilisation dans un composant
<button className={getThemeClasses(theme, 'button-primary')}>
  Démarrer le Quiz
</button>
```

## 📱 Exemples d'Usage

### Page Quiz
- **Titre** : Police Poppins, couleur principale
- **Questions** : Police Inter, taille medium
- **Boutons réponses** : Fond blanc, bordure, hover bleu
- **Feedback** : Couleurs sémantiques (vert/rouge)

### Tableau de bord
- **Cartes statistiques** : Fond blanc, ombre douce
- **Graphiques** : Palette de couleurs principales
- **Boutons d'action** : Couleur principale avec hover

### Interface mobile
- **Navigation** : Boutons tactiles 44px minimum
- **Cartes** : Padding réduit, typographie adaptée
- **Espacement** : Marges cohérentes 16px/24px

## 🔄 Évolutions Futures

### Thèmes Additionnels
- **Thème sombre** : Implémentation complète
- **Thèmes colorés** : Variations par niveau/matière
- **Personnalisation** : Préférences utilisateur

### Améliorations Prévues
- **Micro-animations** : Feedback visuel enrichi
- **Glassmorphism** : Effets de transparence
- **Illustrations** : Assets vectoriels cohérents

---

*Cette charte évolue avec les besoins de l'application et les retours utilisateurs. Dernière mise à jour : Juillet 2025*
