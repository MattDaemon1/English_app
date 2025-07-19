import React from 'react'

export function Badge({ children, variant = 'default', className = '', ...props }) {
    const variants = {
        default: 'bg-gray-800 text-white',
        secondary: 'bg-gray-600 text-white',
        outline: 'border border-gray-600 text-gray-800'
    }

    return (
        <span
            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${variant === 'outline' ? className : variants[variant]} ${variant !== 'outline' ? className : ''}`}
            {...props}
        >
            {children}
        </span>
    )
}