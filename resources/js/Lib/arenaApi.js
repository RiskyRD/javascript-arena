export const TOKEN_KEY = 'jsarena.session_token';
export const NAME_KEY = 'jsarena.student_name';

export class ApiError extends Error {
    constructor(status, payload) {
        super(payload?.message || `Request gagal (${status})`);
        this.status = status;
        this.errors = payload?.errors ?? {};
    }
    /** Pesan validasi pertama, untuk ditampilkan di toast/form. */
    get firstError() {
        return Object.values(this.errors)[0]?.[0] ?? this.message;
    }
}

async function request(method, url, body) {
    const res = await fetch(url, {
        method,
        headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
        body: body ? JSON.stringify(body) : undefined,
    });
    const data = await res.json().catch(() => null);
    if (!res.ok) throw new ApiError(res.status, data);
    return data;
}

export const arenaApi = {
    enter: (payload) => request('POST', '/enter-arena', payload),
    complete: (payload) => request('POST', '/progress/complete', payload),
    skip: (payload) => request('POST', '/progress/skip', payload),
    leaderboard: () => request('GET', '/leaderboard'),
};
