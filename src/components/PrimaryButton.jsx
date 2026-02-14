import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const PrimaryButton = ({ children, className, ...props }) => {
    return (
        <button
            className={twMerge(
                "bg-primary hover:bg-primary/90 text-white font-medium py-2 px-4 rounded-lg transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed",
                className
            )}
            {...props}
        >
            {children}
        </button>
    );
};
