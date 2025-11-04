import { clsx } from 'clsx';
export function cn(...inputs) {
    return clsx(inputs);
}
export function safeId(prefix) {
    if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
        return [prefix, crypto.randomUUID()].filter(Boolean).join('_');
    }
    return [prefix, Math.random().toString(36).slice(2, 10)].filter(Boolean).join('_');
}
