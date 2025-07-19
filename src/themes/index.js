import { useState } from 'react';

// Palettes de couleurs disponibles
export const themes = {
    classic: {
        name: "🎨 Classique (Gris)",
        background: "bg-white",
        primary: "bg-gray-800 hover:bg-gray-700",
        secondary: "bg-gray-300 hover:bg-gray-400",
        text: "text-gray-900",
        textSecondary: "text-gray-700",
        card: "border-gray-200",
        badge: "bg-gray-800 text-white",
        badgeOutline: "border-gray-600 text-gray-800",
        button: "bg-gray-600 hover:bg-gray-700 text-white",
        buttonSecondary: "bg-gray-200 hover:bg-gray-300 text-gray-900 border border-gray-400",
        buttonHover: "hover:bg-gray-700",
        buttonSecondaryHover: "hover:bg-gray-300",
        input: "bg-white border-gray-400 text-gray-900",
        border: "border-gray-300",
        cardBackground: "bg-white border-gray-200",
        cardSecondary: "bg-gray-50",
        accent: "text-gray-800"
    },
    ocean: {
        name: "🌊 Océan (Bleu)",
        background: "bg-blue-50",
        primary: "bg-blue-600 hover:bg-blue-700",
        secondary: "bg-blue-200 hover:bg-blue-300",
        text: "text-blue-900",
        textSecondary: "text-blue-700",
        card: "border-blue-200",
        badge: "bg-blue-600 text-white",
        badgeOutline: "border-blue-600 text-blue-800",
        button: "bg-blue-600 hover:bg-blue-700 text-white",
        buttonSecondary: "bg-blue-100 hover:bg-blue-200 text-blue-900 border border-blue-400",
        buttonHover: "hover:bg-blue-700",
        buttonSecondaryHover: "hover:bg-blue-200",
        input: "bg-white border-blue-400 text-blue-900",
        border: "border-blue-300",
        cardBackground: "bg-white border-blue-200",
        cardSecondary: "bg-blue-50",
        accent: "text-blue-700"
    },
    forest: {
        name: "🌲 Forêt (Vert)",
        background: "bg-green-50",
        primary: "bg-green-700 hover:bg-green-800",
        secondary: "bg-green-200 hover:bg-green-300",
        text: "text-green-900",
        textSecondary: "text-green-700",
        card: "border-green-200",
        badge: "bg-green-700 text-white",
        badgeOutline: "border-green-700 text-green-800",
        button: "bg-green-700 hover:bg-green-800 text-white",
        buttonSecondary: "bg-green-100 hover:bg-green-200 text-green-900 border border-green-400",
        buttonHover: "hover:bg-green-800",
        buttonSecondaryHover: "hover:bg-green-200",
        input: "bg-white border-green-400 text-green-900",
        border: "border-green-300",
        cardBackground: "bg-white border-green-200",
        cardSecondary: "bg-green-50",
        accent: "text-green-700"
    },
    sunset: {
        name: "🌅 Coucher (Orange)",
        background: "bg-orange-50",
        primary: "bg-orange-600 hover:bg-orange-700",
        secondary: "bg-orange-200 hover:bg-orange-300",
        text: "text-orange-900",
        textSecondary: "text-orange-700",
        card: "border-orange-200 bg-white",
        badge: "bg-orange-600 text-white",
        badgeOutline: "border-orange-600 text-orange-800",
        button: "bg-orange-600 hover:bg-orange-700 text-white",
        buttonSecondary: "bg-orange-100 hover:bg-orange-200 text-orange-900 border border-orange-400",
        buttonHover: "hover:bg-orange-700",
        buttonSecondaryHover: "hover:bg-orange-200",
        input: "bg-white border-orange-400 text-orange-900",
        border: "border-orange-300",
        cardBackground: "bg-white border-orange-200",
        cardSecondary: "bg-orange-50",
        accent: "text-orange-700"
    },
    purple: {
        name: "💜 Mystique (Violet)",
        background: "bg-purple-50",
        primary: "bg-purple-600 hover:bg-purple-700",
        secondary: "bg-purple-200 hover:bg-purple-300",
        text: "text-purple-900",
        textSecondary: "text-purple-700",
        card: "border-purple-200",
        badge: "bg-purple-600 text-white",
        badgeOutline: "border-purple-600 text-purple-800",
        button: "bg-purple-600 hover:bg-purple-700 text-white",
        buttonSecondary: "bg-purple-100 hover:bg-purple-200 text-purple-900 border border-purple-400",
        buttonHover: "hover:bg-purple-700",
        buttonSecondaryHover: "hover:bg-purple-200",
        input: "bg-white border-purple-400 text-purple-900",
        border: "border-purple-300",
        cardBackground: "bg-white border-purple-200",
        cardSecondary: "bg-purple-50",
        accent: "text-purple-700"
    },
    dark: {
        name: "🌙 Sombre",
        background: "bg-gray-900",
        primary: "bg-gray-600 hover:bg-gray-500",
        secondary: "bg-gray-600 hover:bg-gray-500",
        text: "text-white",
        textSecondary: "text-gray-300",
        card: "border-gray-600 bg-gray-800",
        badge: "bg-gray-600 text-white",
        badgeOutline: "border-gray-400 text-gray-200",
        button: "bg-gray-600 hover:bg-gray-500 text-white",
        buttonSecondary: "bg-gray-700 hover:bg-gray-600 text-white border border-gray-500",
        buttonHover: "hover:bg-gray-500",
        buttonSecondaryHover: "hover:bg-gray-600",
        input: "bg-gray-800 border-gray-500 text-white",
        border: "border-gray-600",
        cardBackground: "bg-gray-800 border-gray-600",
        cardSecondary: "bg-gray-700",
        accent: "text-gray-200"
    }
}

// Fonction utilitaire pour appliquer les classes de thème
export const getThemeClasses = (theme, type, isActive = false) => {
    switch (type) {
        case 'button-primary':
            return isActive
                ? `${theme.button} font-semibold shadow-md`
                : `${theme.buttonSecondary} font-medium`;
        case 'button-secondary':
            return `${theme.buttonSecondary} font-medium`;
        case 'button-primary-solid':
            return `${theme.button} font-semibold shadow-md`;
        case 'input':
            return `${theme.input} focus:ring-2 focus:ring-opacity-50`;
        case 'card':
            return `${theme.cardBackground} shadow-sm`;
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
