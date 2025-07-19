import { useState } from 'react';

// Palettes de couleurs disponibles
export const themes = {
    classic: {
        name: "🎨 Classique (Gris)",
        background: "bg-gradient-to-br from-gray-50 to-gray-100",
        primary: "bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-800 hover:to-gray-900",
        secondary: "bg-gradient-to-r from-gray-200 to-gray-300 hover:from-gray-300 hover:to-gray-400",
        text: "text-gray-900",
        textSecondary: "text-gray-600",
        card: "border-gray-200",
        badge: "bg-gradient-to-r from-gray-700 to-gray-800 text-white",
        badgeOutline: "border-gray-600 text-gray-800",
        button: "bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white",
        buttonSecondary: "bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 text-gray-900 border border-gray-300",
        buttonHover: "hover:from-gray-700 hover:to-gray-800",
        buttonSecondaryHover: "hover:from-gray-200 hover:to-gray-300",
        input: "bg-white border-gray-300 text-gray-900 focus:border-gray-500",
        border: "border-gray-200",
        cardBackground: "bg-white/80 backdrop-blur-sm border-gray-200",
        cardSecondary: "bg-gray-50/70 backdrop-blur-sm",
        accent: "text-gray-800"
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
    dark: {
        name: "🌙 Sombre",
        background: "bg-gradient-to-br from-gray-900 via-slate-900 to-zinc-900",
        primary: "bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-500 hover:to-gray-600",
        secondary: "bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700",
        text: "text-white",
        textSecondary: "text-gray-300",
        card: "border-gray-600 bg-gray-800",
        badge: "bg-gradient-to-r from-gray-600 to-gray-700 text-white",
        badgeOutline: "border-gray-400 text-gray-200",
        button: "bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-500 hover:to-gray-600 text-white",
        buttonSecondary: "bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-700 hover:to-gray-800 text-white border border-gray-600",
        buttonHover: "hover:from-gray-500 hover:to-gray-600",
        buttonSecondaryHover: "hover:from-gray-700 hover:to-gray-800",
        input: "bg-gray-800 border-gray-600 text-white focus:border-gray-400",
        border: "border-gray-600",
        cardBackground: "bg-gray-800/80 backdrop-blur-sm border-gray-600",
        cardSecondary: "bg-gray-700/70 backdrop-blur-sm",
        accent: "text-gray-200"
    }
}

// Fonction utilitaire pour appliquer les classes de thème
export const getThemeClasses = (theme, type, isActive = false) => {
    switch (type) {
        case 'button-primary':
            return isActive
                ? `${theme.button} font-semibold shadow-lg transform transition-all duration-200 hover:scale-105 hover:shadow-xl`
                : `${theme.buttonSecondary} font-medium transition-all duration-200 hover:scale-105 hover:shadow-md`;
        case 'button-secondary':
            return `${theme.buttonSecondary} font-medium transition-all duration-200 hover:scale-105 hover:shadow-md`;
        case 'button-primary-solid':
            return `${theme.button} font-semibold shadow-lg transition-all duration-200 hover:scale-105 hover:shadow-xl`;
        case 'input':
            return `${theme.input} focus:ring-2 focus:ring-opacity-50 focus:scale-105 transition-all duration-200 shadow-sm`;
        case 'card':
            return `${theme.cardBackground} shadow-lg rounded-xl transition-all duration-300 hover:shadow-xl`;
        case 'card-main':
            return `${theme.cardBackground} shadow-2xl rounded-2xl border-2 ${theme.border} transition-all duration-300 hover:shadow-3xl`;
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
