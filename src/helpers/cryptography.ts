import crypto from 'crypto';

const SECRET = process.env.RECIPE_API_CLIENT_SECRET;

export const random = () => crypto.randomBytes(128).toString('base64');
export const authentication = (salt: string, password: string) => {
    return crypto.createHmac('sha256', [salt, password].join('/')).update(SECRET).digest('hex');
}
export const verificationHash = (email: string) => {
    return crypto.createHmac('sha256', email).digest('hex');
}