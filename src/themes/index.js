import { useState } from 'react';

// Palettes de couleurs disponibles
export const themes = {
    classic: {
        name: "🎨 Classique (Gris)",
        background: "bg-white",
        primary: "bg-gray-800 hover:bg-gray-700",
        secondary: "bg-gray-200 hover:bg-gray-300",
        text: "text-gray-900",
        textSecondary: "text-gray-600",
        card: "border-gray-200",
        badge: "bg-gray-800 text-white",
        badgeOutline: "border-gray-600 text-gray-800"
    },
    ocean: {
        name: "🌊 Océan (Bleu)",
        background: "bg-blue-50",
        primary: "bg-blue-600 hover:bg-blue-700",
        secondary: "bg-blue-100 hover:bg-blue-200",
        text: "text-blue-900",
        textSecondary: "text-blue-700",
        card: "border-blue-200",
        badge: "bg-blue-600 text-white",
        badgeOutline: "border-blue-600 text-blue-800"
    },
    forest: {
        name: "🌲 Forêt (Vert)",
        background: "bg-green-50",
        primary: "bg-green-700 hover:bg-green-800",
        secondary: "bg-green-100 hover:bg-green-200",
        text: "text-green-900",
        textSecondary: "text-green-700",
        card: "border-green-200",
        badge: "bg-green-700 text-white",
        badgeOutline: "border-green-700 text-green-800"
    },
    sunset: {
        name: "🌅 Coucher (Orange)",
        background: "bg-orange-50",
        primary: "bg-orange-600 hover:bg-orange-700",
        secondary: "bg-orange-100 hover:bg-orange-200",
        text: "text-orange-900",
        textSecondary: "text-orange-700",
        card: "border-orange-200 bg-white",
        badge: "bg-orange-600 text-white",
        badgeOutline: "border-orange-600 text-orange-800"
    },
    purple: {
        name: "💜 Mystique (Violet)",
        background: "bg-purple-50",
        primary: "bg-purple-600 hover:bg-purple-700",
        secondary: "bg-purple-100 hover:bg-purple-200",
        text: "text-purple-900",
        textSecondary: "text-purple-700",
        card: "border-purple-200",
        badge: "bg-purple-600 text-white",
        badgeOutline: "border-purple-600 text-purple-800"
    },
    dark: {
        name: "🌙 Sombre",
        background: "bg-gray-900",
        primary: "bg-gray-600 hover:bg-gray-500",
        secondary: "bg-gray-700 hover:bg-gray-600",
        text: "text-white",
        textSecondary: "text-gray-300",
        card: "border-gray-600 bg-gray-800",
        badge: "bg-gray-600 text-white",
        badgeOutline: "border-gray-400 text-gray-200"
    }
}

// Fonction utilitaire pour appliquer les classes de thème
export const getThemeClasses = (theme, type, isActive = false) => {
    switch (type) {
        case 'button-primary':
            return isActive
                ? `${theme.primary} text-white`
                : `${theme.secondary} ${theme.text}`;
        case 'button-secondary':
            return `${theme.secondary} ${theme.text}`;
        case 'button-primary-solid':
            return `${theme.primary} text-white`;
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
