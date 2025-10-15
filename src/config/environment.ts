import * as dotenv from 'dotenv';
import * as path from 'path';

// Determine which environment file to load
const env = process.env.TEST_ENV || 'staging1';
const envPath = path.resolve(process.cwd(), 'env', '.env');

// If no .env file exists, copy the environment-specific file
if (!require('fs').existsSync(envPath)) {
    const sourceEnvPath = path.resolve(process.cwd(), 'env', `.env.${env}`);
    if (require('fs').existsSync(sourceEnvPath)) {
        require('fs').copyFileSync(sourceEnvPath, envPath);
    }
}

// Load environment variables from the specific env file
dotenv.config({ path: envPath });

interface Environment {
    baseUrl: string;
    timeouts: {
        default: number;
        navigation: number;
        element: number;
        network: number;
    };
    users: {
        default: {
            username: string;
            password: string;
        };
    };
}

const getEnvironmentConfig = (): Environment => {
    const env = process.env.TEST_ENV || 'staging';
    
    const baseUrls: { [key: string]: string } = {
        local: process.env.LOCAL_BASE_URL || 'http://localhost:3000',
        staging: process.env.STAGING_BASE_URL || 'https://buggy.justtestit.org',
        production: process.env.PRODUCTION_BASE_URL || 'https://production.buggy.com',
        uat1: process.env.UAT1_BASE_URL || 'https://uat1.buggy.justtestit.org',
        sit1: process.env.SIT1_BASE_URL || 'https://sit1.buggy.justtestit.org',
        staging1: process.env.STAGING1_BASE_URL || 'https://staging1.buggy.justtestit.org'
    };

    return {
        baseUrl: baseUrls[env] || baseUrls.staging,
        timeouts: {
            default: parseInt(process.env.DEFAULT_TIMEOUT || '60000'),
            navigation: parseInt(process.env.NAVIGATION_TIMEOUT || '30000'),
            element: parseInt(process.env.ELEMENT_TIMEOUT || '10000'),
            network: parseInt(process.env.NETWORK_TIMEOUT || '5000')
        },
        users: {
            default: {
                username: process.env.DEFAULT_USERNAME || 'tester2025',
                password: process.env.DEFAULT_PASSWORD || '123456789aA!'
            }
        }
    };
};

export const config = getEnvironmentConfig();

// Export environment check helpers
export const isLocalEnv = () => process.env.TEST_ENV === 'local';
export const isStagingEnv = () => process.env.TEST_ENV === 'staging' || !process.env.TEST_ENV;
export const isProductionEnv = () => process.env.TEST_ENV === 'production';