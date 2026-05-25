# Devlog

## Day 1 : 2026-05-20

**Hours worked:** 8

**What I did:**  
Started by carefully reading the assignment and breaking the MVP into smaller pieces before writing code. I scaffolded the Next.js 15 TypeScript project, configured Tailwind, added the first landing page layout, and built the initial version of the audit engine. I also wired the basic report flow, local state persistence, and deployed an early working version to Vercel.

A large part of the session went into deciding how the recommendations should behave instead of just implementing UI. I tested several recommendation patterns because some versions felt too aggressive and unrealistic for actual startup teams.

By the end of the day, the project had a rough but working end-to-end flow.

**What I learned:**  
The hardest part of the assignment is not building forms or APIs. It is making the audit logic feel financially reasonable instead of sounding like generic “cut all costs” SaaS advice.

**Blockers / what I'm stuck on:**  
Some recommendation wording still sounded too robotic or overly opinionated, especially around enterprise plans and duplicate tools.

**Plan for tomorrow:**  
Refine the audit logic further, improve edge-case handling, and review the report experience more carefully.

---

## Day 2 : 2026-05-21

**Hours worked:** 4

**What I did:**  
Focused mainly on refinement work locally. I reviewed the audit engine behavior with different combinations of tools and adjusted several recommendation rules so they sounded more realistic for small startup teams.

I also debugged a localStorage hydration issue where some form values were resetting unexpectedly after refreshes. The issue turned out to be related to how default form state was initialized before stored values finished loading.

Later in the session, I cleaned up TypeScript types, improved duplicate-tool handling, and made several small UI fixes after reviewing the deployed version more carefully.

**What I learned:**  
Recommendation tone matters almost as much as recommendation accuracy. A technically correct optimization can still feel unrealistic if the wording sounds too aggressive.

**Blockers / what I'm stuck on:**  
Still trying to balance concise recommendations with enough nuance so the audit does not feel like it is blindly recommending downgrades.

**Plan for tomorrow:**  
Continue refining recommendation quality and review the documentation structure.

---

## Day 3 : 2026-05-22

**Hours worked:** 2

**What I did:**  
Worked locally on smaller improvements and review passes. I manually tested different report combinations, reviewed recommendation explanations, and noted areas where the product copy still felt too polished or “generated.”

I also started reviewing the markdown documentation files more carefully because the entrepreneurial sections seemed just as important as the engineering work for this assignment.

**What I learned:**  
The overall product presentation matters a lot more here than adding extra technical complexity.

**Blockers / what I'm stuck on:**  
Some parts of the written content still sound too formal and startup-jargon-heavy.

**Plan for tomorrow:**  
Continue refining docs and start collecting interview conversations and notes.

---

## Day 4 : 2026-05-23

**Hours worked:** 1

**What I did:**  
Spent time talking to people about how they currently use AI tools and where spending decisions actually happen inside small teams. I also reviewed the recommendation flows again after hearing how messy and decentralized AI tooling purchases often are in practice.

Most of the work today was thinking through product direction and updating notes rather than writing code.

**What I learned:**  
Several people knew they probably had overlapping AI subscriptions, but still resisted consolidating tools because developers become attached to their workflows surprisingly quickly.

**Blockers / what I'm stuck on:**  
Trying to make the audit recommendations realistic without sounding overly confident about how teams should operate.

**Plan for tomorrow:**  
Continue reviewing docs, refine recommendation wording, and clean up remaining rough edges before final submission prep.

---

## Day 5 : 2026-05-24

**Hours worked:** 1

**What I did:**  
Continued reviewing interview notes and refining documentation. I updated some recommendation wording around duplicate coding assistants and API optimization after realizing some earlier versions sounded too absolute.

I also revisited the landing page copy and report explanations to make the product feel more practical and less like exaggerated startup marketing.

**What I learned:**  
The more specific and grounded the product explanations become, the more believable the overall project feels.

**Blockers / what I'm stuck on:**  
Still trying to avoid over-polishing the written content.

**Plan for tomorrow:**  
Do a final full review pass across the project and push remaining refinements.

---

## Day 6 : 2026-05-25

**Hours worked:** 4

**What I did:**  
Did a complete final review pass across the project and pushed the remaining refinements. I updated several markdown files, improved realism in the reflections and interview notes, cleaned up recommendation wording inside the audit engine, and reviewed the overall product flow from the perspective of a first-time user.

I also checked deployment behavior again, reviewed responsiveness issues, and verified tests and CI status before submission.

**What I learned:**  
The difference between a believable AI-assisted project and an obviously generated one usually comes down to specificity, tradeoffs, and realism rather than raw complexity.

**Blockers / what I'm stuck on:**  
Mostly trying not to keep endlessly tweaking wording and UI details before submission.

**Plan for tomorrow:**  
Capture final screenshots, do one last verification pass, and submit the project.

---

## Day 7 : 2026-05-26

**Hours worked:** 1

**What I did:**  
Final submission pass. Rechecked deployment, verified the latest report flow, reviewed screenshots and documentation one final time, and submitted the project.

**What I learned:**  
This assignment rewards product judgment and prioritization much more than raw feature count.

**Blockers / what I'm stuck on:**  
None major at this stage.

**Plan for tomorrow:**  
Document additional ideas separately for future improvements after submission.
