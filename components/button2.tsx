import React from 'react';

// Define the component props
interface Button2Props {
    onClick: () => void;
    isLoading: boolean;
    text: string; // To make the button text flexible
}

// Destructure props: onClick and isLoading
const Button2: React.FC<Button2Props> = ({ onClick, isLoading, text }) => {
    return (
        <div>
            <button
                // Use template literals to conditionally apply loading/disabled styles
                className={`
                    w-[400px] h-[42.3px] border-[1.2px] border-[#d4af37] box-border text-center text-[12px] relative transition-opacity
                    ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#d4af37] hover:text-white'}
                `}
                style={{ fontFamily: "'Jost', sans-serif" }}
                onClick={!isLoading ? onClick : undefined} // Prevent click if loading
                disabled={isLoading} // Disable the button
            >
                {/* Conditional rendering for the content */}
                <span 
                    className="w-full text-center tracking-[3.6px] leading-[16px] flex items-center justify-center h-full"
                    // Conditional text color to ensure visibility if hover changes background
                    style={{ color: isLoading ? '#d4af37' : 'inherit' }}
                >
                    {isLoading ? (
                        <>
                            {/* Spinning Loader SVG */}
                            <svg
                                className="animate-spin -ml-1 mr-3 h-4 w-4 text-[#d4af37]"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                            >
                                <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                ></circle>
                                <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                ></path>
                            </svg>
                            LOADING...
                        </>
                    ) : (
                        text // Display the provided text when not loading
                    )}
                </span>
            </button>
        </div>
    )
}

export default Button2;
