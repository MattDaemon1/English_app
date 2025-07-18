import React from 'react'

export const Input = ({ className = '', type = 'text', ...props }) => {
    return (
        <input
            type={type}
            className={`flex h-10 w-full rounded-md border px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
            {...props}
        />
    )
}
