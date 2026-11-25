import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const LIE = "Your backup never existed.";

const words = LIE.trim().split(/\s+/).filter(Boolean);
if (LIE.length < 1 || LIE.length > 88) {
  throw new Error(`entry must be 1 to 88 characters, got ${LIE.length}`);
}
if (words.length < 1 || words.length > 5) {
  throw new Error(`entry must be 1 to 5 words, got ${words.length}`);
}
if (LIE.trim().length === 0) {
  throw new Error("entry must not be only white space");
}
if (LIE !== LIE.trim() || /[\r\n]/.test(LIE)) {
  throw new Error("entry must be a single line with no leading or trailing white space");
}
if (/[\u0000-\u001f\u007f]/.test(LIE)) {
  throw new Error("entry must not contain control characters");
}
if (/  /.test(LIE)) {
  throw new Error("entry must not contain double spaces");
}

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
mkdirSync(outDir, { recursive: true });
const outPath = join(outDir, "entry.txt");
writeFileSync(outPath, LIE, "utf8");

const roundTrip = readFileSync(outPath, "utf8");
if (roundTrip !== LIE) {
  throw new Error("round-trip read-back mismatch");
}

console.log(`wrote ${outPath} (${LIE.length} chars)`);
