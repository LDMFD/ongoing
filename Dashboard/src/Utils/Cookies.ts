const cookiePrefix = 'Amplifa_';

export function setCookie(name: string, value: string, expiresInDays: number = 7): void {
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + expiresInDays);
    const expires = `expires=${expirationDate.toUTCString()}`;
    const path = 'path=/';
    // @ts-ignore
    // console.log("setting cookie domain to " + window.Config.ApiHost)
    // @ts-ignore
    // const domain = `domain=ongoing-api`//${window.Config.ApiHost}`;

    // for Prod add 'secure':
    // document.cookie = `${cookiePrefix}${name}=${value}; ${expires}; ${path}; secure; SameSite=Strict;`;

    // Local dev:
    // document.cookie = `${cookiePrefix}${name}=${value}; ${expires}; ${path}; ${domain}; SameSite=Lax;`;
    document.cookie = `${cookiePrefix}${name}=${value}; ${expires}; ${path}; SameSite=Lax;`;
}

export function getCookie(name: string): string | null {
    const prefixedName = `${cookiePrefix}${name}=`;
    const ca = document.cookie.split(';');

    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
        if (c.indexOf(prefixedName) === 0) return c.substring(prefixedName.length, c.length);
    }

    return null;
}

export function deleteCookie(name: string): void {
    name = `${cookiePrefix}${name}=`;
    document.cookie = `${cookiePrefix}${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
}
