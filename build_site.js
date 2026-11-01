/* Bouwt de versie voor de eigen site (stormtoren.cordain.nl) in site/index.html:
   - doctype + mobiele meta-tags ervoor (site_head.html)
   - de speelcode verdoezeld (onleesbare namen, teksten in een versleutelde lijst, alles op één regel)
   - CSS samengeperst en HTML-opmerkingen weg
   De leesbare index.html blijft ongewijzigd: daar werk je in, dit is alleen het uploadbestand.
   Gebruik: npm run build */
const fs = require('fs');
const path = require('path');
const JavaScriptObfuscator = require('javascript-obfuscator');

const dir = __dirname;
const IN = process.argv[2] || path.join(dir, 'index.html'), OUT = process.argv[3] || path.join(dir, 'site', 'index.html');   // optioneel: eigen in- en uitvoerbestand
let html = fs.readFileSync(IN, 'utf8');
const head = fs.readFileSync(path.join(dir, 'site_head.html'), 'utf8');

// 1. inline <script> (zonder src) verdoezelen
let scripts = 0;
html = html.replace(/<script>([\s\S]*?)<\/script>/g, (m, code) => {
  scripts++;
  const out = JavaScriptObfuscator.obfuscate(code, {
    compact: true,
    identifierNamesGenerator: 'hexadecimal',
    renameGlobals: false,             // de code zit al in een eigen functie; globale namen (window, document…) blijven heel
    renameProperties: false,          // velden zoals presence.nick moeten voor iedereen hetzelfde heten
    transformObjectKeys: false,
    stringArray: true,
    stringArrayThreshold: 0.75,
    stringArrayEncoding: ['base64'],
    stringArrayRotate: true,
    stringArrayShuffle: true,
    splitStrings: false,
    controlFlowFlattening: false,     // uit: dat maakt de game-loop en physics merkbaar trager
    deadCodeInjection: false,
    selfDefending: false,
    debugProtection: false,
    numbersToExpressions: false,
    simplify: true,
    unicodeEscapeSequence: false,
  }).getObfuscatedCode();
  return '<script>' + out + '</script>';
});

// 2. CSS samenpersen (opmerkingen en overbodige witruimte weg)
html = html.replace(/<style>([\s\S]*?)<\/style>/g, (m, css) => '<style>' + css
  .replace(/\/\*[\s\S]*?\*\//g, '')
  .replace(/\s+/g, ' ')
  .replace(/\s*([{}:;,>])\s*/g, '$1')
  .replace(/;}/g, '}')
  .trim() + '</style>');

// 3. HTML-opmerkingen en witruimte tussen tags weg
html = html.replace(/<!--[\s\S]*?-->/g, '').replace(/>[ \t]*\n\s*</g, '><');   // alleen witruimte met een regeleinde: spaties binnen een regel blijven

fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, head.replace(/>\s+</g, '><').trim() + html);
console.log(`${path.relative(dir, OUT)} klaar (${scripts} script verdoezeld, ${Math.round(fs.statSync(OUT).size / 1024)} kB)`);
