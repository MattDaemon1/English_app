import React from 'react';

const Badge = ({ children, variant = 'primary', size = 'md' }) => {
    const baseClasses = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium';

    const variantClasses = {
        primary: 'bg-blue-100 text-blue-800',
        success: 'bg-green-100 text-green-800',
        warning: 'bg-yellow-100 text-yellow-800',
        error: 'bg-red-100 text-red-800',
        info: 'bg-gray-100 text-gray-800',
        // Nouvelles variantes pour le design premium
        premium: 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg',
        glass: 'bg-white/20 backdrop-blur-md border border-white/30 text-white shadow-xl',
        dark: 'bg-gray-800 text-gray-100',
        light: 'bg-white text-gray-800 shadow-md'
    };

    const sizeClasses = {
        sm: 'px-2 py-0.5 text-xs',
        md: 'px-2.5 py-0.5 text-sm',
        lg: 'px-3 py-1 text-base'
    };

    const classes = `${baseClasses} ${variantClasses[variant] || variantClasses.primary} ${sizeClasses[size]}`;

    return (
        <span className={classes}>
            {children}
        </span>
    );
};

export default Badge;
