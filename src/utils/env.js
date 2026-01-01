export const getEnv = (key, defaultValue = '') => {
    return import.meta.env[key] || defaultValue
}

export const API_BASE_URL = getEnv('VITE_API_BASE_URL', 'http://localhost:3000/api')
