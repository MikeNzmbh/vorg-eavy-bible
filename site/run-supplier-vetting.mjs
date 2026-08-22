import vm from 'node:vm';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const source = readFileSync(join(__dirname, 'supplier-vetting-agent.js'), 'utf8');
const queue = JSON.parse(readFileSync(join(__dirname, 'fixtures', 'suppliers', 'drop-001-candidates.json'), 'utf8'));
const supplierArg = process.argv.find(arg => arg.startsWith('--supplier='));
const supplierId = supplierArg ? supplierArg.slice('--supplier='.length) : '';
const sandbox = {};

vm.createContext(sandbox);
vm.runInContext(source, sandbox, { filename: 'supplier-vetting-agent.js' });

const agent = sandbox.VorgSupplierVetting;
if (!agent) throw new Error('VorgSupplierVetting bundle is unavailable. Run npm run build:suppliers first.');

const candidates = supplierId
  ? queue.suppliers.filter(supplier => supplier.id === supplierId)
  : queue.suppliers;

if (supplierId && candidates.length === 0) {
  throw new Error(`Supplier not found in queue: ${supplierId}`);
}

for (const supplier of candidates) {
  const evaluation = agent.evaluateSupplier(supplier);
  const next = agent.nextAction(supplier);
  const draft = agent.draftNextMessage(supplier, new Date(`${queue.checkedAt}T12:00:00Z`));
  console.log(JSON.stringify({
    supplier: { id: supplier.id, name: supplier.name, styleIds: supplier.styleIds },
    evaluation,
    nextAction: next,
    messageDraft: draft
  }, null, 2));
}
