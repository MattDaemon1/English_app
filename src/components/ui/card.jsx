import React from 'react'
import PropTypes from 'prop-types'

export const Card = ({ children, className = '', ...props }) => (
    <div
        className={`rounded-lg border bg-card text-card-foreground shadow-sm ${className}`}
        {...props}
    >
        {children}
    </div>
)

export const CardHeader = ({ children, className = '', ...props }) => (
    <div className={`flex flex-col space-y-1.5 p-6 ${className}`} {...props}>
        {children}
    </div>
)

export const CardTitle = ({ children, className = '', ...props }) => (
    <h3 className={`text-lg font-semibold leading-none tracking-tight ${className}`} {...props}>
        {children}
    </h3>
)

export const CardDescription = ({ children, className = '', ...props }) => (
    <p className={`text-sm text-muted-foreground ${className}`} {...props}>
        {children}
    </p>
)

export const CardContent = ({ children, className = '', ...props }) => (
    <div className={`p-6 pt-0 ${className}`} {...props}>
        {children}
    </div>
)

export const CardFooter = ({ children, className = '', ...props }) => (
    <div className={`flex items-center p-6 pt-0 ${className}`} {...props}>
        {children}
    </div>
)

Card.propTypes = {
    children: PropTypes.node,
    className: PropTypes.string
}

CardHeader.propTypes = {
    children: PropTypes.node,
    className: PropTypes.string
}

CardTitle.propTypes = {
    children: PropTypes.node,
    className: PropTypes.string
}

CardDescription.propTypes = {
    children: PropTypes.node,
    className: PropTypes.string
}

CardContent.propTypes = {
    children: PropTypes.node,
    className: PropTypes.string
}

CardFooter.propTypes = {
    children: PropTypes.node,
    className: PropTypes.string
}
