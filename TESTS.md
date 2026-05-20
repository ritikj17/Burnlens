# Tests

Run all tests:

```bash
npm test
```

## Automated Tests

### `tests/audit-engine.test.ts`

1. **Single-user downgrade detection**  
   Verifies Cursor Business with one seat recommends downgrading to Cursor Pro and saves $20/month.

2. **Enterprise misuse detection**  
   Verifies a four-person team on GitHub Copilot Enterprise is flagged and compared against Copilot Business.

3. **Seat right-sizing**  
   Verifies ChatGPT Team/Business with 10 paid seats for a four-person team recommends removing unused seats.

4. **API optimization logic**  
   Verifies OpenAI API spend above $1,000/month gets deterministic model-routing and batch/credit savings.

5. **Duplicate coding assistant detection**  
   Verifies Cursor + Copilot + Windsurf does not recommend paying every developer for all three tools.

6. **Optimized low-savings stack**  
   Verifies the engine honestly returns zero savings when spend matches published pricing and usage fit.
