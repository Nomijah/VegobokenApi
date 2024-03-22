import crypto from 'crypto';

const SECRET = process.env.RECIPE_API_CLIENT_SECRET;

export const random = () => crypto.randomBytes(128).toString('base64');
export const authentication = (salt: string, password: string) => {
    return crypto.createHmac('sha256', [salt, password].join('/')).update(SECRET).digest('hex');
}

export const minutesToMilliseconds = (minutes: number) => minutes*60000;
export const hoursToMilliseconds = (hours: number) => hours*3600000;