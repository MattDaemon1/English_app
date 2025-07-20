import { useState } from 'react';

// Système de thèmes EnglishMaster v2.1.0 - Simplifié et fonctionnel
export const themes = {
    classic: {
        name: "🌟 Classic",
        // Couleurs de base
        background: "bg-[#FAF8F6]",
        text: "text-[#1E293B]",
        textSecondary: "text-[#334155]",
        textTertiary: "text-[#64748B]",
        textLink: "text-[#2563EB]",

        // Boutons
        button: "bg-[#2563EB] hover:bg-[#1E40AF] text-white rounded-lg font-semibold px-4 py-2 transition-all duration-200 shadow-sm",
        buttonSecondary: "bg-[#E2E8F0] hover:bg-[#CBD5E1] text-[#1E293B] rounded-lg font-semibold px-4 py-2 transition-all duration-200 shadow-sm",

        // Cartes
        card: "bg-white border border-[#E5E7EB] rounded-lg shadow-sm",
        cardBackground: "bg-white border border-[#E5E7EB] rounded-lg shadow-sm",
        cardSecondary: "bg-[#F8FAFC] border border-[#E5E7EB] rounded-lg",

        // Scores
        scoreExcellent: "bg-[#10B981] text-white",
        scoreMoyen: "bg-[#F59E0B] text-white",
        scoreFaible: "bg-[#EF4444] text-white",

        // États
        success: "text-[#10B981] bg-[#ECFDF5] border-[#10B981]",
        warning: "text-[#F59E0B] bg-[#FFFBEB] border-[#F59E0B]",
        error: "text-[#EF4444] bg-[#FEF2F2] border-[#EF4444]",

        // Badges
        badge: "bg-[#2563EB] text-white rounded-lg px-2 py-1",
        badgeSuccess: "bg-[#10B981] text-white rounded-lg px-2 py-1",
        badgeWarning: "bg-[#F59E0B] text-white rounded-lg px-2 py-1",
        badgeError: "bg-[#EF4444] text-white rounded-lg px-2 py-1",
        badgeOutline: "border border-[#2563EB] text-[#2563EB] bg-white rounded-lg px-2 py-1",

        // Inputs
        input: "bg-white border border-[#E5E7EB] text-[#1E293B] focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB] focus:ring-opacity-20 rounded-lg px-3 py-2 transition-all duration-200",

        // Bordures
        border: "border-[#E5E7EB]",
        borderStrong: "border-[#D1D5DB]",

        // Hover et utilitaires
        buttonHover: "hover:bg-[#1E40AF]",
        buttonSecondaryHover: "hover:bg-[#CBD5E1]",
        accent: "text-[#2563EB]"
    },

    ocean: {
        name: "🌊 Océan",
        background: "bg-blue-50",
        text: "text-blue-900",
        textSecondary: "text-blue-700",
        textTertiary: "text-blue-600",
        textLink: "text-blue-600",

        button: "bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold px-4 py-2 transition-all duration-200 shadow-sm",
        buttonSecondary: "bg-blue-100 hover:bg-blue-200 text-blue-900 rounded-lg font-semibold px-4 py-2 transition-all duration-200 shadow-sm",

        card: "bg-white border border-blue-200 rounded-lg shadow-sm",
        cardBackground: "bg-white border border-blue-200 rounded-lg shadow-sm",
        cardSecondary: "bg-blue-50 border border-blue-200 rounded-lg",

        scoreExcellent: "bg-emerald-500 text-white",
        scoreMoyen: "bg-orange-500 text-white",
        scoreFaible: "bg-red-500 text-white",

        success: "text-emerald-600 bg-emerald-50 border-emerald-200",
        warning: "text-orange-600 bg-orange-50 border-orange-200",
        error: "text-red-600 bg-red-50 border-red-200",

        badge: "bg-blue-600 text-white rounded-lg px-2 py-1",
        badgeSuccess: "bg-emerald-500 text-white rounded-lg px-2 py-1",
        badgeWarning: "bg-orange-500 text-white rounded-lg px-2 py-1",
        badgeError: "bg-red-500 text-white rounded-lg px-2 py-1",
        badgeOutline: "border border-blue-600 text-blue-600 bg-white rounded-lg px-2 py-1",

        input: "bg-white border border-blue-300 text-blue-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20 rounded-lg px-3 py-2 transition-all duration-200",

        border: "border-blue-200",
        borderStrong: "border-blue-300",
        buttonHover: "hover:bg-blue-700",
        buttonSecondaryHover: "hover:bg-blue-200",
        accent: "text-blue-600"
    },

    forest: {
        name: "🌲 Forêt",
        background: "bg-green-50",
        text: "text-green-900",
        textSecondary: "text-green-700",
        textTertiary: "text-green-600",
        textLink: "text-green-600",

        button: "bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold px-4 py-2 transition-all duration-200 shadow-sm",
        buttonSecondary: "bg-green-100 hover:bg-green-200 text-green-900 rounded-lg font-semibold px-4 py-2 transition-all duration-200 shadow-sm",

        card: "bg-white border border-green-200 rounded-lg shadow-sm",
        cardBackground: "bg-white border border-green-200 rounded-lg shadow-sm",
        cardSecondary: "bg-green-50 border border-green-200 rounded-lg",

        scoreExcellent: "bg-emerald-500 text-white",
        scoreMoyen: "bg-orange-500 text-white",
        scoreFaible: "bg-red-500 text-white",

        success: "text-emerald-600 bg-emerald-50 border-emerald-200",
        warning: "text-orange-600 bg-orange-50 border-orange-200",
        error: "text-red-600 bg-red-50 border-red-200",

        badge: "bg-green-600 text-white rounded-lg px-2 py-1",
        badgeSuccess: "bg-emerald-500 text-white rounded-lg px-2 py-1",
        badgeWarning: "bg-orange-500 text-white rounded-lg px-2 py-1",
        badgeError: "bg-red-500 text-white rounded-lg px-2 py-1",
        badgeOutline: "border border-green-600 text-green-600 bg-white rounded-lg px-2 py-1",

        input: "bg-white border border-green-300 text-green-900 focus:border-green-500 focus:ring-2 focus:ring-green-500 focus:ring-opacity-20 rounded-lg px-3 py-2 transition-all duration-200",

        border: "border-green-200",
        borderStrong: "border-green-300",
        buttonHover: "hover:bg-green-700",
        buttonSecondaryHover: "hover:bg-green-200",
        accent: "text-green-600"
    },

    sunset: {
        name: "🌅 Coucher",
        background: "bg-orange-50",
        text: "text-orange-900",
        textSecondary: "text-orange-700",
        textTertiary: "text-orange-600",
        textLink: "text-orange-600",

        button: "bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-semibold px-4 py-2 transition-all duration-200 shadow-sm",
        buttonSecondary: "bg-orange-100 hover:bg-orange-200 text-orange-900 rounded-lg font-semibold px-4 py-2 transition-all duration-200 shadow-sm",

        card: "bg-white border border-orange-200 rounded-lg shadow-sm",
        cardBackground: "bg-white border border-orange-200 rounded-lg shadow-sm",
        cardSecondary: "bg-orange-50 border border-orange-200 rounded-lg",

        scoreExcellent: "bg-emerald-500 text-white",
        scoreMoyen: "bg-orange-500 text-white",
        scoreFaible: "bg-red-500 text-white",

        success: "text-emerald-600 bg-emerald-50 border-emerald-200",
        warning: "text-orange-600 bg-orange-50 border-orange-200",
        error: "text-red-600 bg-red-50 border-red-200",

        badge: "bg-orange-500 text-white rounded-lg px-2 py-1",
        badgeSuccess: "bg-emerald-500 text-white rounded-lg px-2 py-1",
        badgeWarning: "bg-orange-500 text-white rounded-lg px-2 py-1",
        badgeError: "bg-red-500 text-white rounded-lg px-2 py-1",
        badgeOutline: "border border-orange-500 text-orange-500 bg-white rounded-lg px-2 py-1",

        input: "bg-white border border-orange-300 text-orange-900 focus:border-orange-500 focus:ring-2 focus:ring-orange-500 focus:ring-opacity-20 rounded-lg px-3 py-2 transition-all duration-200",

        border: "border-orange-200",
        borderStrong: "border-orange-300",
        buttonHover: "hover:bg-orange-600",
        buttonSecondaryHover: "hover:bg-orange-200",
        accent: "text-orange-600"
    },

    purple: {
        name: "💜 Mystique",
        background: "bg-purple-50",
        text: "text-purple-900",
        textSecondary: "text-purple-700",
        textTertiary: "text-purple-600",
        textLink: "text-purple-600",

        button: "bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold px-4 py-2 transition-all duration-200 shadow-sm",
        buttonSecondary: "bg-purple-100 hover:bg-purple-200 text-purple-900 rounded-lg font-semibold px-4 py-2 transition-all duration-200 shadow-sm",

        card: "bg-white border border-purple-200 rounded-lg shadow-sm",
        cardBackground: "bg-white border border-purple-200 rounded-lg shadow-sm",
        cardSecondary: "bg-purple-50 border border-purple-200 rounded-lg",

        scoreExcellent: "bg-emerald-500 text-white",
        scoreMoyen: "bg-orange-500 text-white",
        scoreFaible: "bg-red-500 text-white",

        success: "text-emerald-600 bg-emerald-50 border-emerald-200",
        warning: "text-orange-600 bg-orange-50 border-orange-200",
        error: "text-red-600 bg-red-50 border-red-200",

        badge: "bg-purple-600 text-white rounded-lg px-2 py-1",
        badgeSuccess: "bg-emerald-500 text-white rounded-lg px-2 py-1",
        badgeWarning: "bg-orange-500 text-white rounded-lg px-2 py-1",
        badgeError: "bg-red-500 text-white rounded-lg px-2 py-1",
        badgeOutline: "border border-purple-600 text-purple-600 bg-white rounded-lg px-2 py-1",

        input: "bg-white border border-purple-300 text-purple-900 focus:border-purple-500 focus:ring-2 focus:ring-purple-500 focus:ring-opacity-20 rounded-lg px-3 py-2 transition-all duration-200",

        border: "border-purple-200",
        borderStrong: "border-purple-300",
        buttonHover: "hover:bg-purple-700",
        buttonSecondaryHover: "hover:bg-purple-200",
        accent: "text-purple-600"
    },

    dark: {
        name: "🌙 Sombre",
        background: "bg-slate-900",
        text: "text-slate-100",
        textSecondary: "text-slate-300",
        textTertiary: "text-slate-400",
        textLink: "text-blue-400",

        button: "bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold px-4 py-2 transition-all duration-200 shadow-sm",
        buttonSecondary: "bg-slate-700 hover:bg-slate-600 text-slate-100 rounded-lg font-semibold px-4 py-2 transition-all duration-200 shadow-sm",

        card: "bg-slate-800 border border-slate-700 rounded-lg shadow-sm",
        cardBackground: "bg-slate-800 border border-slate-700 rounded-lg shadow-sm",
        cardSecondary: "bg-slate-900 border border-slate-700 rounded-lg",

        scoreExcellent: "bg-emerald-500 text-white",
        scoreMoyen: "bg-orange-500 text-white",
        scoreFaible: "bg-red-500 text-white",

        success: "text-emerald-400 bg-emerald-900 border-emerald-500",
        warning: "text-orange-400 bg-orange-900 border-orange-500",
        error: "text-red-400 bg-red-900 border-red-500",

        badge: "bg-blue-600 text-white rounded-lg px-2 py-1",
        badgeSuccess: "bg-emerald-500 text-white rounded-lg px-2 py-1",
        badgeWarning: "bg-orange-500 text-white rounded-lg px-2 py-1",
        badgeError: "bg-red-500 text-white rounded-lg px-2 py-1",
        badgeOutline: "border border-blue-400 text-blue-400 bg-slate-800 rounded-lg px-2 py-1",

        input: "bg-slate-800 border border-slate-600 text-slate-100 focus:border-blue-400 focus:ring-2 focus:ring-blue-400 focus:ring-opacity-20 rounded-lg px-3 py-2 transition-all duration-200",

        border: "border-slate-700",
        borderStrong: "border-slate-600",
        buttonHover: "hover:bg-blue-700",
        buttonSecondaryHover: "hover:bg-slate-600",
        accent: "text-blue-400"
    }
};

// Fonction utilitaire pour appliquer les classes de thème
export const getThemeClasses = (theme, type, isActive = false, variant = 'primary') => {
    const baseTransition = "transition-all duration-200";
    const hoverScale = "hover:scale-105";
    const shadow = "shadow-sm hover:shadow-md";

    switch (type) {
        case 'button-primary':
            return isActive
                ? `${theme.button} ${shadow} transform ${baseTransition} ${hoverScale}`
                : `${theme.buttonSecondary} ${baseTransition} ${hoverScale}`;

        case 'button-secondary':
            return `${theme.buttonSecondary} ${baseTransition} ${hoverScale}`;

        case 'button-primary-solid':
            return `${theme.button} ${shadow} ${baseTransition} ${hoverScale}`;

        case 'card':
            return `${theme.cardBackground} ${shadow} transition-all duration-300 hover:shadow-lg`;

        case 'input':
            return `${theme.input} ${baseTransition}`;

        default:
            return theme[type] || '';
    }
};

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
};
