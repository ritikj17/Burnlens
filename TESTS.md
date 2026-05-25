# Tests

Run all tests:

```bash
npm test
```

---

## Automated Test Coverage

### `tests/audit-engine.test.ts`

### 1. Single-user downgrade detection

Verifies that a single-seat Cursor Business setup recommends downgrading to Cursor Pro when the pricing difference is significant.

---

### 2. Enterprise plan mismatch detection

Verifies that very small teams on enterprise-style plans are compared against more appropriate self-serve business tiers.

---

### 3. Seat right-sizing logic

Verifies that paying for significantly more seats than the reported team size creates a recommendation to reduce unused licenses.

---

### 4. API optimization recommendations

Verifies that large API spend triggers deterministic recommendations around routing, batching, or usage optimization patterns.

---

### 5. Duplicate coding assistant detection

Verifies that overlapping coding assistant subscriptions are identified instead of assuming every engineer needs every tool.

---

### 6. Optimized low-savings stack

Verifies that the engine can return low or zero savings when the submitted stack already appears reasonably aligned with pricing assumptions and team size.
