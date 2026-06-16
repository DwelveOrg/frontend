import 'server-only';
import { SignJWT, jwtVerify } from 'jose';
import { SessionPayload } from '../_types/index';
import { cookies } from 'next/headers';

const secretKey = process.env.SESSION_SECRET || 'default_secret';
const encodedKey = new TextEncoder().encode(secretKey);


type SessionProfile = Pick<SessionPayload, 'name' | 'role' | 'identifier'>;

export async function createSession(userId: string, profile?: SessionProfile) {
    const cookieStore = await cookies()
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000);
    const session = await encrypt({ userId, expiresAt, ...profile });

    cookieStore.set('session', session, {
        httpOnly: true,
        secure: true,
        expires: expiresAt,
    })
}

export async function deleteSession(){
    const cookieStore = await cookies()
    cookieStore.delete('session')
}

export async function encrypt(payload: SessionPayload){
    return new SignJWT(payload)
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('1h')
        .sign(encodedKey);
}

export async function decrypt(session: string | undefined = '') {
    if (!session) {
        return null;
    }
    try {
        const { payload } = await jwtVerify(session, encodedKey, {
            algorithms: ['HS256'],
        });
        return payload as SessionPayload;
    } catch (error) {
        console.error('Failed to decrypt session:', error);
        return null;
    }
}