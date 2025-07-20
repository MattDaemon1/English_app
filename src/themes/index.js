import { useState } from 'react';

// Palettes de couleurs disponibles
export const themes = {
    classic: {
        name: "� EnglishMaster",
        // Fond crème doux pour les yeux
        background: "bg-[#FAF8F6]",

        // Système de couleurs texte selon votre charte
        text: "text-[#1E293B]", // Gris ardoise foncé, très lisible
        textSecondary: "text-[#334155]", // Un peu plus doux que le principal  
        textTertiary: "text-[#64748B]", // Pour détails, commentaires
        textLink: "text-[#2563EB]", // Bleu modéré pour liens

        // Boutons principaux - Bleu doux avec hover
        primary: "bg-[#2563EB] hover:bg-[#1E40AF]",
        button: "bg-[#2563EB] hover:bg-[#1E40AF] text-white rounded-[10px] font-semibold text-base shadow-[0_2px_6px_rgba(0,0,0,0.08)] transition-all duration-200",

        // Boutons secondaires - Gris clair bleuté
        secondary: "bg-[#E2E8F0] hover:bg-[#CBD5E1]",
        buttonSecondary: "bg-[#E2E8F0] hover:bg-[#CBD5E1] text-[#1E293B] rounded-[10px] font-semibold text-base shadow-[0_2px_6px_rgba(0,0,0,0.08)] transition-all duration-200",

        // Cartes et zones - Blanc avec bordure douce
        card: "bg-white border border-[#E5E7EB] rounded-[12px] shadow-[0_1px_4px_rgba(0,0,0,0.05)]",
        cardBackground: "bg-white border border-[#E5E7EB] rounded-[12px] shadow-[0_1px_4px_rgba(0,0,0,0.05)]",
        cardSecondary: "bg-[#F8FAFC] border border-[#E5E7EB] rounded-[12px]",

        // Indicateurs de score selon votre système
        scoreExcellent: "bg-[#10B981] text-white", // 7-10 (vert)
        scoreMoyen: "bg-[#F59E0B] text-white",     // 4-6 (orange)
        scoreFaible: "bg-[#EF4444] text-white",    // 0-3 (rouge)

        // États et feedback
        success: "text-[#10B981] bg-[#ECFDF5] border-[#10B981]",
        warning: "text-[#F59E0B] bg-[#FFFBEB] border-[#F59E0B]",
        error: "text-[#EF4444] bg-[#FEF2F2] border-[#EF4444]",

        // Badges
        badge: "bg-[#2563EB] text-white rounded-lg",
        badgeSuccess: "bg-[#10B981] text-white rounded-lg",
        badgeWarning: "bg-[#F59E0B] text-white rounded-lg",
        badgeError: "bg-[#EF4444] text-white rounded-lg",
        badgeOutline: "border-[#2563EB] text-[#2563EB] bg-white",

        // Inputs et formulaires
        input: "bg-white border-[#E5E7EB] text-[#1E293B] focus:border-[#2563EB] focus:ring-[#2563EB] rounded-[10px] transition-all duration-200",

        // Bordures et séparateurs
        border: "border-[#E5E7EB]",
        borderStrong: "border-[#D1D5DB]",

        // Classes utilitaires
        buttonHover: "hover:bg-[#1E40AF]",
        buttonSecondaryHover: "hover:bg-[#CBD5E1]",
        accent: "text-[#2563EB]"
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
        background: "bg-[#1F2937]", // Mode sombre basé sur votre charte
        primary: "bg-[#2563EB] hover:bg-[#1E40AF]", // Même bleu mais plus saturé
        secondary: "bg-[#374151] hover:bg-[#4B5563]",
        text: "text-[#F9FAFB]", // Texte blanc cassé pour mode sombre
        textSecondary: "text-[#D1D5DB]", // Gris clair pour le secondaire
        textTertiary: "text-[#9CA3AF]", // Plus sombre pour détails
        textLink: "text-[#60A5FA]", // Bleu plus clair pour liens

        // Boutons adaptés au mode sombre
        button: "bg-[#2563EB] hover:bg-[#1E40AF] text-white rounded-[10px] font-semibold text-base shadow-[0_2px_6px_rgba(0,0,0,0.3)] transition-all duration-200",
        buttonSecondary: "bg-[#374151] hover:bg-[#4B5563] text-[#F9FAFB] rounded-[10px] font-semibold text-base shadow-[0_2px_6px_rgba(0,0,0,0.3)] transition-all duration-200",

        // Cartes adaptées
        card: "bg-[#374151] border border-[#4B5563] rounded-[12px] shadow-[0_2px_8px_rgba(0,0,0,0.2)]",
        cardBackground: "bg-[#374151] border border-[#4B5563] rounded-[12px] shadow-[0_2px_8px_rgba(0,0,0,0.2)]",
        cardSecondary: "bg-[#1F2937] border border-[#374151] rounded-[12px]",

        // Indicateurs de score (mêmes couleurs mais adaptées)
        scoreExcellent: "bg-[#10B981] text-white",
        scoreMoyen: "bg-[#F59E0B] text-white",
        scoreFaible: "bg-[#EF4444] text-white",

        // États pour mode sombre
        success: "text-[#34D399] bg-[#064E3B] border-[#10B981]",
        warning: "text-[#FBBF24] bg-[#451A03] border-[#F59E0B]",
        error: "text-[#F87171] bg-[#450A0A] border-[#EF4444]",

        // Badges pour mode sombre
        badge: "bg-[#2563EB] text-white rounded-lg",
        badgeSuccess: "bg-[#10B981] text-white rounded-lg",
        badgeWarning: "bg-[#F59E0B] text-white rounded-lg",
        badgeError: "bg-[#EF4444] text-white rounded-lg",
        badgeOutline: "border-[#60A5FA] text-[#60A5FA] bg-[#1F2937]",

        // Inputs pour mode sombre
        input: "bg-[#374151] border-[#4B5563] text-[#F9FAFB] focus:border-[#60A5FA] focus:ring-[#60A5FA] rounded-[10px] transition-all duration-200",

        // Bordures
        border: "border-[#4B5563]",
        borderStrong: "border-[#6B7280]",

        // Classes utilitaires
        buttonHover: "hover:bg-[#1E40AF]",
        buttonSecondaryHover: "hover:bg-[#4B5563]",
        accent: "text-[#60A5FA]"
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
            // Système de couleurs pour les scores selon votre charte EnglishMaster
            if (variant === 'faible' || variant === 'low') return `${theme.scoreFaible} px-4 py-2 rounded-xl font-bold text-lg`; // 0-3/10
            if (variant === 'moyen' || variant === 'medium') return `${theme.scoreMoyen} px-4 py-2 rounded-xl font-bold text-lg`; // 4-6/10
            if (variant === 'excellent' || variant === 'high') return `${theme.scoreExcellent} px-4 py-2 rounded-xl font-bold text-lg`; // 7-10/10
            return `${theme.badge} px-4 py-2 rounded-xl font-bold text-lg`;

        case 'badge-score':
            if (variant === 'faible') return `${theme.scoreFaible} px-3 py-1 text-sm font-medium rounded-lg`;
            if (variant === 'moyen') return `${theme.scoreMoyen} px-3 py-1 text-sm font-medium rounded-lg`;
            if (variant === 'excellent') return `${theme.scoreExcellent} px-3 py-1 text-sm font-medium rounded-lg`;
            return `${theme.badge} px-3 py-1 text-sm font-medium rounded-lg`;

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
