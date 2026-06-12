import {
  ArrowRight,
  BadgeDollarSign,
  LineChart,
  ShieldCheck,
  Sparkles
} from "lucide-react";

import { SpendAuditForm } from "@/components/spend-audit-form";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const proof = [
  "Built around public pricing benchmarks for major AI tools",
  "Sample audits frequently identified overlapping subscriptions or unused seats",
  "Covers common startup AI tooling categories including assistants and APIs"
];

const faqs = [
  {
    question: "Does BurnLens require a login?",
    answer:
      "No. The audit runs first, then you can optionally save the report by email."
  },
  {
    question: "Is the savings analysis AI-generated?",
    answer:
      "No. Recommendations are based on deterministic rules and pricing data. AI is only used to write the short summary paragraph."
  },
  {
    question: "Can I share the report publicly?",
    answer:
      "Yes. Shared reports remove identifying information while preserving the recommendations and estimated savings details."
  },
  {
    question: "What if my setup is already reasonable?",
    answer:
      "The report says that directly. The goal is to highlight meaningful savings opportunities, not force unnecessary changes."
  }
];

export default function Home() {
  return (
    <main>
      <section className="audit-grid soft-band">
        <div className="container grid gap-12 py-12 md:grid-cols-[0.95fr_1.05fr] md:py-20 lg:gap-16">
          <div className="flex flex-col justify-center">
            <Badge variant="success" className="mb-5 w-fit">
              Built for startup teams reviewing AI tooling costs
            </Badge>

            <h1 className="max-w-2xl text-5xl font-semibold tracking-normal text-foreground md:text-6xl">
              Understand where your AI tooling budget is going.
            </h1>

            <p className="mt-5 max-w-xl text-lg leading-8 text-muted-foreground">
              BurnLens reviews tools like Cursor, Copilot, Claude, ChatGPT,
              Gemini, and API usage to identify overlapping subscriptions,
              oversized plans, unused seats, and possible savings opportunities.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button size="lg" asChild>
                <a href="#audit">
                  Run the free audit

                  <ArrowRight className="size-4" />
                </a>
              </Button>

              <Button size="lg" variant="outline" asChild>
                <a href="#faq">
                  Learn how it works
                </a>
              </Button>
            </div>

            <div className="mt-10 grid gap-3 sm:grid-cols-3">
              {proof.map((item) => (
                <div
                  key={item}
                  className="rounded-lg border bg-white/72 p-4 text-sm text-muted-foreground shadow-sm backdrop-blur"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div id="audit" className="scroll-mt-24">
            <SpendAuditForm />
          </div>
        </div>
      </section>

      <section className="container py-16">
        <div className="grid gap-5 md:grid-cols-3">
          <Card className="shadow-soft">
            <CardContent className="p-6">
              <BadgeDollarSign className="mb-4 size-6 text-primary" />

              <h2 className="text-xl font-semibold tracking-normal">
                Deterministic audit rules
              </h2>

              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                Recommendations are generated from pricing assumptions, seat
                counts, and tool overlap patterns rather than free-form AI
                output.
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-soft">
            <CardContent className="p-6">
              <LineChart className="mb-4 size-6 text-cyan-700" />

              <h2 className="text-xl font-semibold tracking-normal">
                Built around startup workflows
              </h2>

              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                The audit focuses on common situations like duplicated
                subscriptions, oversized plans, unused seats, and API spending
                patterns.
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-soft">
            <CardContent className="p-6">
              <ShieldCheck className="mb-4 size-6 text-amber-700" />

              <h2 className="text-xl font-semibold tracking-normal">
                Shareable report links
              </h2>

              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                Public reports remove identifying details while keeping the
                recommendations and estimated savings breakdown intact.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      <section id="proof" className="border-y bg-white/72 py-16">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center">
            <Sparkles className="mx-auto mb-4 size-6 text-primary" />

            <h2 className="text-3xl font-semibold tracking-normal">
              Built to feel practical instead of sales-heavy.
            </h2>

            <p className="mt-4 text-muted-foreground">
              Example testimonials written to reflect the kinds of startup teams
              the product is intended for.
            </p>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {[
              {
                quote:
                  "It helped us spot overlapping subscriptions we had stopped paying attention to.",
                author: "Example feedback, seed-stage CTO"
              },
              {
                quote:
                  "The fact that some tools were marked as already reasonable made the report feel more trustworthy.",
                author: "Example feedback, founder"
              },
              {
                quote:
                  "This feels closer to an internal budgeting tool than a marketing calculator.",
                author: "Example feedback, finance lead"
              }
            ].map((item) => (
              <figure
                key={item.author}
                className="rounded-lg border bg-background p-6 shadow-sm"
              >
                <blockquote className="text-sm leading-6 text-foreground">
                  “{item.quote}”
                </blockquote>

                <figcaption className="mt-4 text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
                  {item.author}
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section id="faq" className="container py-16">
        <div className="grid gap-10 md:grid-cols-[0.8fr_1.2fr]">
          <div>
            <Badge variant="secondary">
              FAQ
            </Badge>

            <h2 className="mt-4 text-3xl font-semibold tracking-normal">
              Designed to make AI tooling costs easier to review.
            </h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq) => (
              <details
                key={faq.question}
                className="rounded-lg border bg-card p-5"
              >
                <summary className="cursor-pointer text-base font-semibold">
                  {faq.question}
                </summary>

                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
