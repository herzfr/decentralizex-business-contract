
import { AuthClient } from "@dfinity/auth-client";

const ENV_IDENTITY = process.env.CANISTER_ID_INTERNET_IDENTITY
const IDENTITY_PROV = `http://${ENV_IDENTITY}.localhost:4943#authorize`;
const MAX_TTL = 7 * 24 * 60 * 60 * 1000 * 1000 * 1000;

export const DefaultAuthOptions = {
    createOptions: {
        idleOptions: {
            disableIdle: true,
        },
    },
    loginOptions: {
        identityProvider:
            process.env.DFX_NETWORK === "ic"
                ? "https://identity.ic0.app/#authorize"
                : IDENTITY_PROV,
        maxTimeToLive: MAX_TTL,
    },
}

export async function getAuthClient() {
    return await AuthClient.create(DefaultAuthOptions.createOptions);
}

export async function loginIc() {
    const authClient = window.auth.client;
    const isAuthenticated = await authClient.isAuthenticated();

    if (!isAuthenticated) {
        await authClient?.login({
            ...DefaultAuthOptions.loginOptions,
            onSuccess: async () => {
                window.auth.isAuthenticated = await authClient.isAuthenticated();
                window.location.reload();
            }
        });
    }
}

export async function logoutIc() {
    const authClient = window.auth.client;
    authClient.logout();
    window.location.reload();
}


