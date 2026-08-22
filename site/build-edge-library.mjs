import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const siteDir = path.dirname(fileURLToPath(import.meta.url));
const registryPath = path.resolve(siteDir, '..', 'research', 'commerce-intelligence', 'free-source-registry.json');
const outputPath = path.join(siteDir, 'edge-commerce-library.js');
const registry = JSON.parse(await readFile(registryPath, 'utf8'));

const banner = `/* Generated from research/commerce-intelligence/free-source-registry.json. Do not edit by hand. */`;
const payload = JSON.stringify(registry, null, 2);
const browserBundle = `${banner}
(function () {
  'use strict';

  function deepFreeze(value) {
    if (!value || typeof value !== 'object' || Object.isFrozen(value)) return value;
    Object.freeze(value);
    Object.values(value).forEach(deepFreeze);
    return value;
  }

  window.VorgCommerceLibrary = deepFreeze(${payload});
})();
`;

await writeFile(outputPath, browserBundle, 'utf8');
console.log(`Built ${path.basename(outputPath)} with ${registry.sources.length} sources and ${registry.claims.length} atomic claims.`);
