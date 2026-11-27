/**
 * Tokenizer JavaScript super ringan untuk pewarnaan kode (tanpa dependensi).
 * Cukup untuk contoh materi & editor sandbox: komentar, string, keyword, angka.
 */
const KEYWORDS =
    'const|let|var|function|return|if|else|for|while|do|of|in|new|true|false|null|undefined|typeof|instanceof|break|continue|switch|case|default|class|extends|import|export|from|async|await|this|try|catch|throw';

const TOKEN = new RegExp(
    [
        String.raw`(\/\/[^\n]*|\/\*[\s\S]*?\*\/)`, // 1 komentar
        String.raw`('(?:\\.|[^'\\\n])*'|"(?:\\.|[^"\\\n])*"|` + '`(?:\\\\.|[^`\\\\])*`)', // 2 string & template literal
        String.raw`\b(${KEYWORDS})\b`, // 3 keyword
        String.raw`\b(\d+(?:\.\d+)?)\b`, // 4 angka
    ].join('|'),
    'g',
);

/** @returns {{ type: 'plain'|'comment'|'string'|'keyword'|'number', text: string }[]} */
export function tokenize(code) {
    const out = [];
    let last = 0;
    for (const m of code.matchAll(TOKEN)) {
        if (m.index > last) out.push({ type: 'plain', text: code.slice(last, m.index) });
        const type = m[1] ? 'comment' : m[2] ? 'string' : m[3] ? 'keyword' : 'number';
        out.push({ type, text: m[0] });
        last = m.index + m[0].length;
    }
    if (last < code.length) out.push({ type: 'plain', text: code.slice(last) });
    return out;
}
