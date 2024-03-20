
// Function to validate if a value is required
export const validateRequired = (value, fieldName) => {
    if (value === null || value === undefined || value.toString().trim() === '') {
        return `${fieldName} is required`;
    }
    return null; // Return null if validation
};

// Function to validate email format
export const validateEmail = (value) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(value)) {
        return 'Invalid email format';
    }
    return null; // Return null if validation passes
};

// Function to validate if a value is a valid number
export const validateNumber = (value, fieldName) => {
    if (isNaN(value)) {
        return `${fieldName} must be a valid number`;
    }
    return null; // Return null if validation passes
};
