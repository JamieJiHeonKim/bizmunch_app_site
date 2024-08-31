import { useState } from 'react';
interface FormValues {
    firstName: string;
    lastName: string;
    email: string;
    invitation: string;
    password: string;
    confirmPassword: string;
}
export const useFormValidation = () => {
    const [errors, setErrors] = useState<FormValues>({ firstName: '', lastName: '', email: '', invitation: '', password: '', confirmPassword: '' });
    const validate = (values: FormValues): boolean => {
        let valid = true;
        let newErrors = { ...errors };
        // Validate first and last names
        if (values.firstName.length > 20 || values.lastName.length > 20) {
            newErrors.firstName = 'Name must not exceed 20 characters.';
            newErrors.lastName = 'Name must not exceed 20 characters.';
            valid = false;
        }

        // Validate email
        if (!values.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
            newErrors.email = 'Invalid email address.';
            valid = false;
        }

        // Validate password
        if (values.password.length < 8 || !/[!@#$%^&*]/.test(values.password)) {
            newErrors.password = 'Password must be at least 8 characters long and include a special character.';
            valid = false;
        }

        // Confirm password
        if (values.password !== values.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match.';
            valid = false;
        }

        setErrors(newErrors);
        return valid;
    };

    return { validate, errors };
};