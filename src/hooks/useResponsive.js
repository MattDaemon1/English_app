import { useState, useEffect } from 'react';

/**
 * 📱 Hook pour détecter la taille d'écran et rendre les composants responsive
 */
export const useResponsive = () => {
    const [screenSize, setScreenSize] = useState({
        width: typeof window !== 'undefined' ? window.innerWidth : 1024,
        height: typeof window !== 'undefined' ? window.innerHeight : 768
    });

    const [isMobile, setIsMobile] = useState(false);
    const [isTablet, setIsTablet] = useState(false);
    const [isDesktop, setIsDesktop] = useState(true);

    useEffect(() => {
        const handleResize = () => {
            const width = window.innerWidth;
            const height = window.innerHeight;
            
            setScreenSize({ width, height });
            
            // Définir les breakpoints
            setIsMobile(width <= 768);
            setIsTablet(width > 768 && width <= 1024);
            setIsDesktop(width > 1024);
        };

        // Écouter les changements de taille
        window.addEventListener('resize', handleResize);
        
        // Initialiser
        handleResize();

        // Nettoyer l'event listener
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return {
        screenSize,
        isMobile,
        isTablet,
        isDesktop,
        // Helpers utiles
        isSmallScreen: isMobile,
        isMediumScreen: isTablet,
        isLargeScreen: isDesktop
    };
};
