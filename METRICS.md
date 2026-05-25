# Metrics

The main success metric for BurnLens is the number of high-savings startup teams identified each week.

A normal “daily active users” metric does not make much sense for this product because most startups are not checking AI spend every day. The product is more valuable when it identifies teams with meaningful savings opportunities and successfully turns those audits into conversations with Credex.

A completed audit with little or no savings is still useful because it builds trust, but the most valuable outcome is finding teams where the current tooling setup is clearly inefficient or overpriced.

The three most important supporting metrics are:

1. **Audit completion rate**  
   Measures how many users who start the audit actually reach the results page. If this drops, the form is probably too long, confusing, or asking for too much information.

2. **High-savings lead rate**  
   Measures how many completed audits identify significant savings opportunities and result in an email submission. This helps validate whether the product is attracting the right audience.

3. **Consultation click or booking rate**  
   Measures how many high-savings reports actually lead to consultation interest. This is a good signal for whether the recommendations feel trustworthy and actionable.

The first analytics events I would track are:

- Landing page viewed
- Audit started
- Tool row enabled
- Audit completed
- Report shared
- Lead captured
- Consultation clicked
- Email sent

I would also track:
- savings range
- company size range
- primary use case
- tools selected in the audit

But I would avoid storing personally identifying information like company names or emails directly inside analytics events.

One important warning sign would be this:

If the product receives around 500 completed audits from relevant startup communities and very few reports show meaningful savings opportunities, the positioning may be wrong. It could mean the tool is mostly attracting hobby users with low spend, or that the recommendations are not convincing enough for teams to exchange contact information or request help.
