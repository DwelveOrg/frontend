import 'server-only';
import { cookies } from 'next/headers';
import {
    SESSION_COOKIE_NAME,
    SESSION_DURATION_MS,
} from '../_constants/session';
import type { SessionPayload } from '../_types/auth';
import {
    decryptSession,
    encryptSession,
} from './session-token';

type SessionProfile = Omit<SessionPayload, 'expiresAt'>;

export async function createSession(profile: SessionProfile) {
    const cookieStore = await cookies()
    const expiresAt = new Date(Date.now() + SESSION_DURATION_MS);
    const session = await encrypt({ ...profile, expiresAt: expiresAt.toISOString() });

    cookieStore.set(SESSION_COOKIE_NAME, session, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        expires: expiresAt,
    })
}

export async function deleteSession(){
    const cookieStore = await cookies()
    cookieStore.delete(SESSION_COOKIE_NAME)
}

export async function getSession() {
    const cookieStore = await cookies();
    return decrypt(cookieStore.get(SESSION_COOKIE_NAME)?.value);
}

export async function encrypt(payload: SessionPayload){
    return encryptSession(payload);
}

export async function decrypt(session: string | undefined = '') {
    return decryptSession(session);
}
