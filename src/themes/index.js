import { useState } from 'react';

// Palettes de couleurs disponibles
export const themes = {
    classic: {
        name: "🎨 Classique (Gris)",
        background: "bg-gray-100",
        primary: "bg-gray-600 hover:bg-gray-700",
        secondary: "bg-gray-300 hover:bg-gray-400",
        text: "text-black",
        textSecondary: "text-gray-700",
        card: "bg-white border border-gray-300",
        badge: "bg-gray-600 text-white",
        badgeOutline: "border-gray-600 text-black",
        button: "bg-gray-600 hover:bg-gray-700 text-white",
        buttonSecondary: "bg-gray-300 hover:bg-gray-400 text-black border border-gray-400",
        buttonHover: "hover:bg-gray-700",
        buttonSecondaryHover: "hover:bg-gray-400",
        input: "bg-white border-gray-400 text-black focus:border-gray-600",
        border: "border-gray-400",
        cardBackground: "bg-white border-gray-300",
        cardSecondary: "bg-gray-200",
        accent: "text-black"
    },
    ocean: {
        name: "🌊 Océan (Bleu)",
        background: "bg-gradient-to-br from-blue-50 via-sky-50 to-cyan-50",
        primary: "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800",
        secondary: "bg-gradient-to-r from-blue-100 to-blue-200 hover:from-blue-200 hover:to-blue-300",
        text: "text-blue-900",
        textSecondary: "text-blue-700",
        card: "border-blue-200",
        badge: "bg-gradient-to-r from-blue-600 to-blue-700 text-white",
        badgeOutline: "border-blue-600 text-blue-800",
        button: "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white",
        buttonSecondary: "bg-gradient-to-r from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 text-blue-900 border border-blue-300",
        buttonHover: "hover:from-blue-700 hover:to-blue-800",
        buttonSecondaryHover: "hover:from-blue-100 hover:to-blue-200",
        input: "bg-white border-blue-300 text-blue-900 focus:border-blue-500",
        border: "border-blue-200",
        cardBackground: "bg-white/80 backdrop-blur-sm border-blue-200",
        cardSecondary: "bg-blue-50/70 backdrop-blur-sm",
        accent: "text-blue-700"
    },
    forest: {
        name: "🌲 Forêt (Vert)",
        background: "bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50",
        primary: "bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800",
        secondary: "bg-gradient-to-r from-green-100 to-green-200 hover:from-green-200 hover:to-green-300",
        text: "text-green-900",
        textSecondary: "text-green-700",
        card: "border-green-200",
        badge: "bg-gradient-to-r from-green-600 to-green-700 text-white",
        badgeOutline: "border-green-700 text-green-800",
        button: "bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white",
        buttonSecondary: "bg-gradient-to-r from-green-50 to-green-100 hover:from-green-100 hover:to-green-200 text-green-900 border border-green-300",
        buttonHover: "hover:from-green-700 hover:to-green-800",
        buttonSecondaryHover: "hover:from-green-100 hover:to-green-200",
        input: "bg-white border-green-300 text-green-900 focus:border-green-500",
        border: "border-green-200",
        cardBackground: "bg-white/80 backdrop-blur-sm border-green-200",
        cardSecondary: "bg-green-50/70 backdrop-blur-sm",
        accent: "text-green-700"
    },
    sunset: {
        name: "🌅 Coucher (Orange)",
        background: "bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50",
        primary: "bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700",
        secondary: "bg-gradient-to-r from-orange-100 to-orange-200 hover:from-orange-200 hover:to-orange-300",
        text: "text-orange-900",
        textSecondary: "text-orange-700",
        card: "border-orange-200 bg-white",
        badge: "bg-gradient-to-r from-orange-500 to-orange-600 text-white",
        badgeOutline: "border-orange-600 text-orange-800",
        button: "bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white",
        buttonSecondary: "bg-gradient-to-r from-orange-50 to-orange-100 hover:from-orange-100 hover:to-orange-200 text-orange-900 border border-orange-300",
        buttonHover: "hover:from-orange-600 hover:to-orange-700",
        buttonSecondaryHover: "hover:from-orange-100 hover:to-orange-200",
        input: "bg-white border-orange-300 text-orange-900 focus:border-orange-500",
        border: "border-orange-200",
        cardBackground: "bg-white/80 backdrop-blur-sm border-orange-200",
        cardSecondary: "bg-orange-50/70 backdrop-blur-sm",
        accent: "text-orange-700"
    },
    purple: {
        name: "💜 Mystique (Violet)",
        background: "bg-gradient-to-br from-purple-50 via-violet-50 to-fuchsia-50",
        primary: "bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800",
        secondary: "bg-gradient-to-r from-purple-100 to-purple-200 hover:from-purple-200 hover:to-purple-300",
        text: "text-purple-900",
        textSecondary: "text-purple-700",
        card: "border-purple-200",
        badge: "bg-gradient-to-r from-purple-600 to-purple-700 text-white",
        badgeOutline: "border-purple-600 text-purple-800",
        button: "bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white",
        buttonSecondary: "bg-gradient-to-r from-purple-50 to-purple-100 hover:from-purple-100 hover:to-purple-200 text-purple-900 border border-purple-300",
        buttonHover: "hover:from-purple-700 hover:to-purple-800",
        buttonSecondaryHover: "hover:from-purple-100 hover:to-purple-200",
        input: "bg-white border-purple-300 text-purple-900 focus:border-purple-500",
        border: "border-purple-200",
        cardBackground: "bg-white/80 backdrop-blur-sm border-purple-200",
        cardSecondary: "bg-purple-50/70 backdrop-blur-sm",
        accent: "text-purple-700"
    },
    englishmaster: {
        name: "� EnglishMaster (Nouvelle Charte)",
        // Couleurs principales basées sur la charte graphique
        background: "bg-gray-100", // #F4F4F5
        primary: "bg-blue-500 hover:bg-blue-600", // #3B82F6
        secondary: "bg-emerald-500 hover:bg-emerald-600", // #10B981
        text: "text-gray-800", // #1F2937
        textSecondary: "text-gray-600",

        // Composants spécialisés
        card: "bg-white border border-gray-200 shadow-sm",
        cardBackground: "bg-white border border-gray-200 rounded-xl shadow-md",
        cardSecondary: "bg-gray-50 border border-gray-100",

        // Boutons avec système de couleurs adaptatif
        button: "bg-blue-500 hover:bg-blue-600 text-white rounded-xl", // Bleu océan principal
        buttonSecondary: "bg-white hover:bg-gray-50 text-gray-800 border border-gray-300 rounded-xl",
        buttonSuccess: "bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl", // Vert validation
        buttonWarning: "bg-orange-500 hover:bg-orange-600 text-white rounded-xl", // Orange avertissement
        buttonDanger: "bg-red-500 hover:bg-red-600 text-white rounded-xl", // Rouge erreur
        buttonPurple: "bg-purple-500 hover:bg-purple-600 text-white rounded-xl", // Violet mystique

        // États et feedback
        success: "text-emerald-600 bg-emerald-50 border-emerald-200",
        warning: "text-orange-600 bg-orange-50 border-orange-200",
        error: "text-red-500 bg-red-50 border-red-200",

        // Badges et éléments d'interface
        badge: "bg-blue-500 text-white rounded-lg",
        badgeSuccess: "bg-emerald-500 text-white rounded-lg",
        badgeWarning: "bg-orange-500 text-white rounded-lg",
        badgeOutline: "border-blue-500 text-blue-600 bg-white",

        // Inputs et formulaires
        input: "bg-white border-gray-300 text-gray-800 focus:border-blue-500 focus:ring-blue-200 rounded-xl",

        // Bordures et séparateurs
        border: "border-gray-200",
        borderStrong: "border-gray-300",

        // Classes utilitaires
        buttonHover: "hover:bg-blue-600",
        buttonSecondaryHover: "hover:bg-gray-50",
        accent: "text-blue-600"
    },
    dark: {
        name: "🌙 Sombre",
        background: "bg-gray-900", // #18181B selon votre charte
        primary: "bg-blue-500 hover:bg-blue-400", // Plus saturé en mode sombre
        secondary: "bg-emerald-500 hover:bg-emerald-400",
        text: "text-gray-100", // #F4F4F5
        textSecondary: "text-gray-400",
        card: "bg-gray-800 border border-gray-700", // #27272A
        badge: "bg-blue-500 text-white",
        badgeOutline: "border-blue-400 text-blue-300",
        button: "bg-blue-500 hover:bg-blue-400 text-white rounded-xl",
        buttonSecondary: "bg-gray-800 hover:bg-gray-700 text-gray-100 border border-gray-600 rounded-xl",
        buttonHover: "hover:bg-blue-400",
        buttonSecondaryHover: "hover:bg-gray-700",
        input: "bg-gray-800 border-gray-600 text-gray-100 focus:border-blue-400 rounded-xl",
        border: "border-gray-700",
        cardBackground: "bg-gray-800 border border-gray-700 rounded-xl shadow-lg",
        cardSecondary: "bg-gray-900 border border-gray-700",
        accent: "text-blue-400"
    }
}

// Fonction utilitaire pour appliquer les classes de thème
export const getThemeClasses = (theme, type, isActive = false, variant = 'primary') => {
    const baseTransition = "transition-all duration-200";
    const hoverScale = "hover:scale-105";
    const shadow = "shadow-md hover:shadow-lg";

    switch (type) {
        case 'button-primary':
            return isActive
                ? `${theme.button} font-semibold ${shadow} transform ${baseTransition} ${hoverScale}`
                : `${theme.buttonSecondary} font-medium ${baseTransition} ${hoverScale} shadow-sm hover:shadow-md`;

        case 'button-secondary':
            return `${theme.buttonSecondary} font-medium ${baseTransition} ${hoverScale} shadow-sm hover:shadow-md`;

        case 'button-primary-solid':
            return `${theme.button} font-semibold ${shadow} ${baseTransition} ${hoverScale}`;

        case 'button-success':
            return `${theme.buttonSuccess || theme.button} font-semibold ${shadow} ${baseTransition} ${hoverScale}`;

        case 'button-warning':
            return `${theme.buttonWarning || theme.button} font-semibold ${shadow} ${baseTransition} ${hoverScale}`;

        case 'button-danger':
            return `${theme.buttonDanger || theme.button} font-semibold ${shadow} ${baseTransition} ${hoverScale}`;

        case 'button-purple':
            return `${theme.buttonPurple || theme.button} font-semibold ${shadow} ${baseTransition} ${hoverScale}`;

        case 'input':
            return `${theme.input} focus:ring-2 focus:ring-opacity-50 focus:scale-105 ${baseTransition} shadow-sm`;

        case 'card':
            return `${theme.cardBackground} ${shadow} transition-all duration-300 hover:shadow-xl`;

        case 'card-main':
            return `${theme.cardBackground} shadow-2xl border-2 ${theme.border} transition-all duration-300 hover:shadow-3xl`;

        case 'card-quiz':
            return `${theme.cardBackground} ${shadow} transition-all duration-300 hover:shadow-xl transform hover:scale-105`;

        case 'badge-success':
            return `${theme.badgeSuccess || theme.badge} px-3 py-1 text-sm font-medium`;

        case 'badge-warning':
            return `${theme.badgeWarning || theme.badge} px-3 py-1 text-sm font-medium`;

        case 'badge-error':
            return `${theme.error} px-3 py-1 text-sm font-medium rounded-lg`;

        case 'score-indicator':
            // Système de couleurs pour les scores selon la charte
            if (variant === 'low') return `${theme.error} px-4 py-2 rounded-xl font-bold text-lg`; // 0-4/10
            if (variant === 'medium') return `${theme.warning} px-4 py-2 rounded-xl font-bold text-lg`; // 5-7/10
            if (variant === 'high') return `${theme.success} px-4 py-2 rounded-xl font-bold text-lg`; // 8-10/10
            return `${theme.badge} px-4 py-2 rounded-xl font-bold text-lg`;

        default:
            return '';
    }
}

// Hook personnalisé pour la gestion des thèmes
export const useTheme = (initialTheme = 'classic') => {
    const [selectedTheme, setSelectedTheme] = useState(initialTheme);
    const theme = themes[selectedTheme];

    return {
        selectedTheme,
        setSelectedTheme,
        theme,
        themes
    };
}
