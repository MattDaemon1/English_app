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
        name: "🌊 Ocean",
        background: "bg-gradient-to-br from-blue-50 to-cyan-50",
        text: "text-slate-800",
        textSecondary: "text-slate-600",
        textTertiary: "text-slate-500",
        textLink: "text-blue-600",

        button: "bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold px-4 py-2 transition-all duration-200 shadow-sm",
        buttonSecondary: "bg-blue-100 hover:bg-blue-200 text-blue-800 rounded-lg font-semibold px-4 py-2 transition-all duration-200 shadow-sm",

        card: "bg-white/80 backdrop-blur-sm border border-blue-100 rounded-lg shadow-sm",
        cardBackground: "bg-white/80 backdrop-blur-sm border border-blue-100 rounded-lg shadow-sm",
        cardSecondary: "bg-blue-50/50 border border-blue-100 rounded-lg",

        scoreExcellent: "bg-emerald-500 text-white",
        scoreMoyen: "bg-amber-500 text-white",
        scoreFaible: "bg-red-500 text-white",

        success: "text-emerald-600 bg-emerald-50 border-emerald-200",
        warning: "text-amber-600 bg-amber-50 border-amber-200",
        error: "text-red-600 bg-red-50 border-red-200",

        badge: "bg-blue-600 text-white rounded-lg px-2 py-1",
        badgeSuccess: "bg-emerald-500 text-white rounded-lg px-2 py-1",
        badgeWarning: "bg-amber-500 text-white rounded-lg px-2 py-1",
        badgeError: "bg-red-500 text-white rounded-lg px-2 py-1",
        badgeOutline: "border border-blue-600 text-blue-600 bg-white rounded-lg px-2 py-1",

        input: "bg-white border border-blue-200 text-slate-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20 rounded-lg px-3 py-2 transition-all duration-200",

        border: "border-blue-100",
        borderStrong: "border-blue-200",

        buttonHover: "hover:bg-blue-700",
        buttonSecondaryHover: "hover:bg-blue-200",
        accent: "text-blue-600"
    },

    forest: {
        name: "🌲 Forest",
        background: "bg-gradient-to-br from-green-50 to-emerald-50",
        text: "text-slate-800",
        textSecondary: "text-slate-600",
        textTertiary: "text-slate-500",
        textLink: "text-green-600",

        button: "bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold px-4 py-2 transition-all duration-200 shadow-sm",
        buttonSecondary: "bg-green-100 hover:bg-green-200 text-green-800 rounded-lg font-semibold px-4 py-2 transition-all duration-200 shadow-sm",

        card: "bg-white/80 backdrop-blur-sm border border-green-100 rounded-lg shadow-sm",
        cardBackground: "bg-white/80 backdrop-blur-sm border border-green-100 rounded-lg shadow-sm",
        cardSecondary: "bg-green-50/50 border border-green-100 rounded-lg",

        scoreExcellent: "bg-emerald-600 text-white",
        scoreMoyen: "bg-amber-600 text-white",
        scoreFaible: "bg-red-600 text-white",

        success: "text-emerald-700 bg-emerald-50 border-emerald-200",
        warning: "text-amber-700 bg-amber-50 border-amber-200",
        error: "text-red-700 bg-red-50 border-red-200",

        badge: "bg-green-600 text-white rounded-lg px-2 py-1",
        badgeSuccess: "bg-emerald-600 text-white rounded-lg px-2 py-1",
        badgeWarning: "bg-amber-600 text-white rounded-lg px-2 py-1",
        badgeError: "bg-red-600 text-white rounded-lg px-2 py-1",
        badgeOutline: "border border-green-600 text-green-600 bg-white rounded-lg px-2 py-1",

        input: "bg-white border border-green-200 text-slate-800 focus:border-green-500 focus:ring-2 focus:ring-green-500 focus:ring-opacity-20 rounded-lg px-3 py-2 transition-all duration-200",

        border: "border-green-100",
        borderStrong: "border-green-200",

        buttonHover: "hover:bg-green-700",
        buttonSecondaryHover: "hover:bg-green-200",
        accent: "text-green-600"
    },

    sunset: {
        name: "🌅 Sunset",
        background: "bg-gradient-to-br from-orange-50 to-red-50",
        text: "text-slate-800",
        textSecondary: "text-slate-600",
        textTertiary: "text-slate-500",
        textLink: "text-orange-600",

        button: "bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-semibold px-4 py-2 transition-all duration-200 shadow-sm",
        buttonSecondary: "bg-orange-100 hover:bg-orange-200 text-orange-800 rounded-lg font-semibold px-4 py-2 transition-all duration-200 shadow-sm",

        card: "bg-white/80 backdrop-blur-sm border border-orange-100 rounded-lg shadow-sm",
        cardBackground: "bg-white/80 backdrop-blur-sm border border-orange-100 rounded-lg shadow-sm",
        cardSecondary: "bg-orange-50/50 border border-orange-100 rounded-lg",

        scoreExcellent: "bg-emerald-500 text-white",
        scoreMoyen: "bg-amber-500 text-white",
        scoreFaible: "bg-red-500 text-white",

        success: "text-emerald-600 bg-emerald-50 border-emerald-200",
        warning: "text-amber-600 bg-amber-50 border-amber-200",
        error: "text-red-600 bg-red-50 border-red-200",

        badge: "bg-orange-500 text-white rounded-lg px-2 py-1",
        badgeSuccess: "bg-emerald-500 text-white rounded-lg px-2 py-1",
        badgeWarning: "bg-amber-500 text-white rounded-lg px-2 py-1",
        badgeError: "bg-red-500 text-white rounded-lg px-2 py-1",
        badgeOutline: "border border-orange-500 text-orange-500 bg-white rounded-lg px-2 py-1",

        input: "bg-white border border-orange-200 text-slate-800 focus:border-orange-500 focus:ring-2 focus:ring-orange-500 focus:ring-opacity-20 rounded-lg px-3 py-2 transition-all duration-200",

        border: "border-orange-100",
        borderStrong: "border-orange-200",

        buttonHover: "hover:bg-orange-600",
        buttonSecondaryHover: "hover:bg-orange-200",
        accent: "text-orange-500"
    },

    purple: {
        name: "💜 Purple",
        background: "bg-gradient-to-br from-purple-50 to-pink-50",
        text: "text-slate-800",
        textSecondary: "text-slate-600",
        textTertiary: "text-slate-500",
        textLink: "text-purple-600",

        button: "bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold px-4 py-2 transition-all duration-200 shadow-sm",
        buttonSecondary: "bg-purple-100 hover:bg-purple-200 text-purple-800 rounded-lg font-semibold px-4 py-2 transition-all duration-200 shadow-sm",

        card: "bg-white/80 backdrop-blur-sm border border-purple-100 rounded-lg shadow-sm",
        cardBackground: "bg-white/80 backdrop-blur-sm border border-purple-100 rounded-lg shadow-sm",
        cardSecondary: "bg-purple-50/50 border border-purple-100 rounded-lg",

        scoreExcellent: "bg-emerald-500 text-white",
        scoreMoyen: "bg-amber-500 text-white",
        scoreFaible: "bg-red-500 text-white",

        success: "text-emerald-600 bg-emerald-50 border-emerald-200",
        warning: "text-amber-600 bg-amber-50 border-amber-200",
        error: "text-red-600 bg-red-50 border-red-200",

        badge: "bg-purple-600 text-white rounded-lg px-2 py-1",
        badgeSuccess: "bg-emerald-500 text-white rounded-lg px-2 py-1",
        badgeWarning: "bg-amber-500 text-white rounded-lg px-2 py-1",
        badgeError: "bg-red-500 text-white rounded-lg px-2 py-1",
        badgeOutline: "border border-purple-600 text-purple-600 bg-white rounded-lg px-2 py-1",

        input: "bg-white border border-purple-200 text-slate-800 focus:border-purple-500 focus:ring-2 focus:ring-purple-500 focus:ring-opacity-20 rounded-lg px-3 py-2 transition-all duration-200",

        border: "border-purple-100",
        borderStrong: "border-purple-200",

        buttonHover: "hover:bg-purple-700",
        buttonSecondaryHover: "hover:bg-purple-200",
        accent: "text-purple-600"
    },

    dark: {
        name: "🌙 Dark",
        background: "bg-slate-900",
        text: "text-slate-100",
        textSecondary: "text-slate-300",
        textTertiary: "text-slate-400",
        textLink: "text-blue-400",

        button: "bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold px-4 py-2 transition-all duration-200 shadow-sm",
        buttonSecondary: "bg-slate-700 hover:bg-slate-600 text-slate-100 rounded-lg font-semibold px-4 py-2 transition-all duration-200 shadow-sm",

        card: "bg-slate-800 border border-slate-700 rounded-lg shadow-sm",
        cardBackground: "bg-slate-800 border border-slate-700 rounded-lg shadow-sm",
        cardSecondary: "bg-slate-700 border border-slate-600 rounded-lg",

        scoreExcellent: "bg-emerald-600 text-white",
        scoreMoyen: "bg-amber-600 text-white",
        scoreFaible: "bg-red-600 text-white",

        success: "text-emerald-400 bg-emerald-900/30 border-emerald-700",
        warning: "text-amber-400 bg-amber-900/30 border-amber-700",
        error: "text-red-400 bg-red-900/30 border-red-700",

        badge: "bg-blue-600 text-white rounded-lg px-2 py-1",
        badgeSuccess: "bg-emerald-600 text-white rounded-lg px-2 py-1",
        badgeWarning: "bg-amber-600 text-white rounded-lg px-2 py-1",
        badgeError: "bg-red-600 text-white rounded-lg px-2 py-1",
        badgeOutline: "border border-blue-400 text-blue-400 bg-slate-800 rounded-lg px-2 py-1",

        input: "bg-slate-800 border border-slate-600 text-slate-100 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20 rounded-lg px-3 py-2 transition-all duration-200",

        border: "border-slate-700",
        borderStrong: "border-slate-600",

        buttonHover: "hover:bg-blue-700",
        buttonSecondaryHover: "hover:bg-slate-600",
        accent: "text-blue-400"
    }
};

export default themes;
