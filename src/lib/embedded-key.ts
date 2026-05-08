// AUTO-GENERATED. DO NOT EDIT BY HAND.
// Static-site embedded key with light obfuscation. This is NOT real security —
// a determined reverse-engineer can recover this key. Use Settings to override
// with your own OpenRouter key for higher trust scenarios.

const __c = ["BUJ1UXNgBTVFBVU1RIBUCZggS","gAFQgAbRABEQ1DStwWDYABEoV","xgBKwlDDM1VBAgAVRlCUhQVTF","==ADCQQVAMwVbxlVBMwBFAVDR"];
const __p = "9c4f2e1d8a3b7561f0a9e2d4c8b71625";

function __decode(): string {
  const joined = __c.map((s) => s.split("").reverse().join("")).join("");
  const raw = atob(joined);
  let out = "";
  for (let i = 0; i < raw.length; i++) {
    out += String.fromCharCode(raw.charCodeAt(i) ^ __p.charCodeAt(i % __p.length));
  }
  return out;
}

let __cached: string | null = null;
export function embeddedKey(): string {
  if (!__cached) __cached = __decode();
  return __cached;
}
