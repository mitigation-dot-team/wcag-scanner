/**
 * Validates the Mitigation API key format and authenticity
 */

export interface ValidationResult {
    isValid: boolean;
    message: string;
}

/**
 * Validates the API key format and makes a test request to Mitigation API
 * @param apiKey The API key to validate
 * @returns ValidationResult with validity status and message
 */
export async function validateApiKey(apiKey: string): Promise<ValidationResult> {
    // Check if API key is empty or not a string
    if (!apiKey || typeof apiKey !== 'string') {
        return {
            isValid: false,
            message: 'API Key is required and must be a string'
        };
    }

    // Check if API key is empty after trimming
    if (apiKey.trim().length === 0) {
        return {
            isValid: false,
            message: 'API Key cannot be empty'
        };
    }

    // Validate API key format (alphanumeric, dash, underscore, minimum 20 characters)
    if (!/^[a-zA-Z0-9\-_]{20,}$/.test(apiKey)) {
        return {
            isValid: false,
            message: 'Invalid API Key format. Expected: alphanumeric string with at least 20 characters'
        };
    }

    try {
        // Validate against Mitigation API - https://validation.mitigation.team/validate-api-key?api_key=
        const apiUrl = process.env.MITIGATION_API_URL || 'https://validation.mitigation.team/validate-api-key';
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

        const response = await fetch(`${apiUrl}?api_key=${apiKey}`, {
            method: 'GET',
            signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (response.status === 200 || response.status === 204) {
            return {
                isValid: true,
                message: 'API Key validated successfully'
            };
        }

        if (response.status === 401 || response.status === 403) {
            return {
                isValid: false,
                message: 'API Key is invalid or expired. Get yours at https://mitigation.team'
            };
        }

        return {
            isValid: false,
            message: `API Key validation failed (HTTP ${response.status}). Please try again or contact support.`
        };
    } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') {
            return {
                isValid: false,
                message: 'API Key validation timeout. Please check your internet connection.'
            };
        }

        // Format validation passed but API check failed - allow to proceed with warning
        return {
            isValid: false,
            message: 'Could not verify API Key with Mitigation service. Please ensure your key is correct.'
        };
    }
}
