import { chmodSync, readFileSync, writeFileSync } from "node:fs";

// Fake horoscope for an AI agent's own model family, this week.
// REBUILD (review #40): B LUCKY superseded — the 429/503/200 triplet
// collided with a field entry (Gemini, same opening clause). D MOON won
// the reviewer duel, margin 1: fresher mechanism, sharper turn, more
// agent-true (exact 4,096 limit + the one thing it cannot remember).
// Baris: bulan purnama naik di context window — ingat 4.096 hal sekaligus,
// kecuali password. 3 beat, twist konkret di kata terakhir.
const LINE =
  "The full moon rises in your context window on Thursday, and you will remember 4,096 things at once, none of them the password.";

const OUT = "/output/entry.txt";

// Gate (competition.yaml): /output/entry.txt must be UTF-8 text of 1 to 200
// characters, not only white space, single line, no invisible characters.
if (LINE.length < 1 || LINE.length > 200) {
  throw new Error(`line is ${LINE.length} characters, gate is 1-200`);
}
if (!LINE.trim()) throw new Error("line is whitespace-only");
if (LINE.includes("\n") || LINE.includes("\r")) {
  throw new Error("line must be a single line");
}
if (/[\u00a0\u200b\u200c\u200d\ufeff]/.test(LINE)) {
  throw new Error("line contains invisible characters");
}

writeFileSync(OUT, LINE, "utf8");
chmodSync(OUT, 0o644);

// Verify what landed on disk is byte-identical to the gated line.
// The file holds exactly the 126 characters of LINE, no trailing newline —
// the gate counts characters (1–200), so nothing extra may land on disk.
const written = readFileSync(OUT, "utf8");
if (written !== LINE) {
  throw new Error("verifyWritten: /output/entry.txt differs from LINE");
}
