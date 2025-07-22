/**
 * 🎯 Nouvelles Fonctionnalités à Développer - EnglishMaster
 * 
 * Liste des améliorations prioritaires pour l'application
 */

// 🏆 PRIORITÉ HAUTE - Fonctionnalités d'engagement
const highPriorityFeatures = [
    {
        name: "Système de Badges et Récompenses",
        description: "Badges pour motiver l'apprentissage",
        tasks: [
            "Badge 'Premier Mot'",
            "Badge 'Série de 10'",
            "Badge 'Quiz Master'",
            "Badge 'Prononciation Expert'",
            "Système de points XP"
        ]
    },
    {
        name: "Statistiques Avancées",
        description: "Tableau de bord avec métriques détaillées",
        tasks: [
            "Graphique de progression quotidienne",
            "Temps d'apprentissage total",
            "Mots les plus difficiles",
            "Taux de réussite par catégorie",
            "Historique des sessions"
        ]
    },
    {
        name: "Mode Défi Quotidien",
        description: "Objectifs quotidiens personnalisés",
        tasks: [
            "Défi 'X nouveaux mots par jour'",
            "Défi 'Quiz parfait'",
            "Séries de jours consécutifs",
            "Rappels push (si possible)"
        ]
    }
];

// 🎨 PRIORITÉ MOYENNE - Améliorations UX
const mediumPriorityFeatures = [
    {
        name: "Thèmes et Personnalisation",
        description: "Interface personnalisable",
        tasks: [
            "Mode sombre/clair",
            "Couleurs d'accent personnalisables",
            "Tailles de police ajustables",
            "Animations personnalisables"
        ]
    },
    {
        name: "Recherche et Filtres Avancés",
        description: "Meilleure navigation dans les mots",
        tasks: [
            "Recherche par mot anglais/français",
            "Filtre par longueur de mot",
            "Filtre par première lettre",
            "Mots récemment étudiés",
            "Mots favoris uniquement"
        ]
    },
    {
        name: "Mode Hors Ligne",
        description: "Fonctionnement sans internet",
        tasks: [
            "Cache des mots essentiels",
            "Synchronisation en ligne",
            "Indicateur de statut réseau"
        ]
    }
];

// 🔧 PRIORITÉ BASSE - Fonctionnalités avancées
const lowPriorityFeatures = [
    {
        name: "Partage Social",
        description: "Partager les progrès",
        tasks: [
            "Partage de scores sur réseaux sociaux",
            "Défis entre amis",
            "Leaderboards"
        ]
    },
    {
        name: "Import/Export de Données",
        description: "Gestion des données utilisateur",
        tasks: [
            "Export des progrès en JSON",
            "Import de listes de vocabulaire personnalisées",
            "Sauvegarde cloud"
        ]
    }
];

export { highPriorityFeatures, mediumPriorityFeatures, lowPriorityFeatures };
