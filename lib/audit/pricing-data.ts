import type { PrimaryUseCase, ToolId } from "@/types/audit";

export interface PricingPlan {
  id: string;
  label: string;
  monthlyPerSeat: number | null;
  annualPerSeat?: number | null;
  minSeats?: number;
  isEnterprise?: boolean;
  isApi?: boolean;
  sourceUrl: string;
  verifiedAt: string;
  note?: string;
}

export interface ToolPricing {
  id: ToolId;
  name: string;
  category: "coding" | "chat" | "api" | "multimodal";
  useCaseFit: PrimaryUseCase[];
  plans: PricingPlan[];
}

export const verifiedPricingDate = "2026-05-20";

export const pricingCatalog: Record<ToolId, ToolPricing> = {
  cursor: {
    id: "cursor",
    name: "Cursor",
    category: "coding",
    useCaseFit: ["coding", "mixed"],
    plans: [
      {
        id: "hobby",
        label: "Hobby",
        monthlyPerSeat: 0,
        sourceUrl: "https://cursor.com/en-US/pricing",
        verifiedAt: verifiedPricingDate
      },
      {
        id: "pro",
        label: "Pro",
        monthlyPerSeat: 20,
        sourceUrl: "https://cursor.com/en-US/pricing",
        verifiedAt: verifiedPricingDate
      },
      {
        id: "business",
        label: "Business / Teams",
        monthlyPerSeat: 40,
        sourceUrl: "https://cursor.com/en-US/pricing",
        verifiedAt: verifiedPricingDate
      },
      {
        id: "enterprise",
        label: "Enterprise",
        monthlyPerSeat: null,
        isEnterprise: true,
        sourceUrl: "https://cursor.com/en-US/pricing",
        verifiedAt: verifiedPricingDate,
        note: "Custom pricing; BurnLens compares against Business as the self-serve baseline."
      }
    ]
  },
  "github-copilot": {
    id: "github-copilot",
    name: "GitHub Copilot",
    category: "coding",
    useCaseFit: ["coding", "mixed"],
    plans: [
      {
        id: "individual",
        label: "Individual / Pro",
        monthlyPerSeat: 10,
        sourceUrl: "https://docs.github.com/en/billing/concepts/product-billing/github-copilot-licenses",
        verifiedAt: verifiedPricingDate
      },
      {
        id: "business",
        label: "Business",
        monthlyPerSeat: 19,
        sourceUrl: "https://docs.github.com/copilot/concepts/billing/billing-for-enterprises",
        verifiedAt: verifiedPricingDate
      },
      {
        id: "enterprise",
        label: "Enterprise",
        monthlyPerSeat: 39,
        isEnterprise: true,
        sourceUrl: "https://docs.github.com/copilot/concepts/billing/billing-for-enterprises",
        verifiedAt: verifiedPricingDate
      }
    ]
  },
  claude: {
    id: "claude",
    name: "Claude",
    category: "chat",
    useCaseFit: ["writing", "research", "coding", "mixed"],
    plans: [
      {
        id: "free",
        label: "Free",
        monthlyPerSeat: 0,
        sourceUrl: "https://claude.com/pricing",
        verifiedAt: verifiedPricingDate
      },
      {
        id: "pro",
        label: "Pro",
        monthlyPerSeat: 20,
        sourceUrl: "https://support.claude.com/en/articles/11049762-choose-a-claude-plan",
        verifiedAt: verifiedPricingDate
      },
      {
        id: "max",
        label: "Max",
        monthlyPerSeat: 100,
        sourceUrl: "https://claude.com/pricing",
        verifiedAt: verifiedPricingDate,
        note: "Max starts at $100/month for 5x Pro usage."
      },
      {
        id: "team",
        label: "Team Standard",
        monthlyPerSeat: 25,
        annualPerSeat: 20,
        minSeats: 5,
        sourceUrl: "https://claude.com/pricing",
        verifiedAt: verifiedPricingDate
      },
      {
        id: "enterprise",
        label: "Enterprise",
        monthlyPerSeat: 20,
        isEnterprise: true,
        isApi: true,
        sourceUrl: "https://claude.com/pricing",
        verifiedAt: verifiedPricingDate,
        note: "Self-serve Enterprise lists $20/seat plus usage at API rates."
      },
      {
        id: "api",
        label: "API direct",
        monthlyPerSeat: null,
        isApi: true,
        sourceUrl: "https://platform.claude.com/docs/en/about-claude/pricing",
        verifiedAt: verifiedPricingDate
      }
    ]
  },
  chatgpt: {
    id: "chatgpt",
    name: "ChatGPT",
    category: "chat",
    useCaseFit: ["writing", "research", "data", "coding", "mixed"],
    plans: [
      {
        id: "plus",
        label: "Plus",
        monthlyPerSeat: 20,
        sourceUrl: "https://help.openai.com/en/articles/6950777-chatgpt-plus-",
        verifiedAt: verifiedPricingDate
      },
      {
        id: "team",
        label: "Team / Business",
        monthlyPerSeat: 25,
        annualPerSeat: 20,
        minSeats: 2,
        sourceUrl: "https://help.openai.com/en/articles/8792536-manage-billing-on-the-chatgpt-business-subscription-plan",
        verifiedAt: verifiedPricingDate,
        note: "ChatGPT Team was renamed ChatGPT Business on 2025-08-29."
      },
      {
        id: "enterprise",
        label: "Enterprise",
        monthlyPerSeat: null,
        isEnterprise: true,
        sourceUrl: "https://chatgpt.com/pricing/",
        verifiedAt: verifiedPricingDate
      },
      {
        id: "api",
        label: "API direct",
        monthlyPerSeat: null,
        isApi: true,
        sourceUrl: "https://platform.openai.com/docs/pricing/",
        verifiedAt: verifiedPricingDate
      }
    ]
  },
  "anthropic-api": {
    id: "anthropic-api",
    name: "Anthropic API",
    category: "api",
    useCaseFit: ["coding", "writing", "research", "data", "mixed"],
    plans: [
      {
        id: "paygo",
        label: "Pay as you go",
        monthlyPerSeat: null,
        isApi: true,
        sourceUrl: "https://platform.claude.com/docs/en/about-claude/pricing",
        verifiedAt: verifiedPricingDate,
        note: "Sonnet 4.6 is $3 input / $15 output per million tokens; Batch can reduce token cost by 50%."
      },
      {
        id: "batch",
        label: "Batch workflows",
        monthlyPerSeat: null,
        isApi: true,
        sourceUrl: "https://platform.claude.com/docs/en/about-claude/pricing",
        verifiedAt: verifiedPricingDate
      },
      {
        id: "commit",
        label: "Committed credits",
        monthlyPerSeat: null,
        isApi: true,
        sourceUrl: "https://claude.com/pricing",
        verifiedAt: verifiedPricingDate
      }
    ]
  },
  "openai-api": {
    id: "openai-api",
    name: "OpenAI API",
    category: "api",
    useCaseFit: ["coding", "writing", "research", "data", "mixed"],
    plans: [
      {
        id: "standard",
        label: "Standard API",
        monthlyPerSeat: null,
        isApi: true,
        sourceUrl: "https://platform.openai.com/docs/pricing/",
        verifiedAt: verifiedPricingDate,
        note: "GPT-5.2 is $1.75 input / $14 output per million tokens; GPT-5 mini is $0.25 input / $2 output."
      },
      {
        id: "mini-mix",
        label: "Mini/model mix",
        monthlyPerSeat: null,
        isApi: true,
        sourceUrl: "https://platform.openai.com/docs/pricing/",
        verifiedAt: verifiedPricingDate
      },
      {
        id: "batch",
        label: "Batch/Flex",
        monthlyPerSeat: null,
        isApi: true,
        sourceUrl: "https://platform.openai.com/docs/pricing/",
        verifiedAt: verifiedPricingDate
      }
    ]
  },
  gemini: {
    id: "gemini",
    name: "Gemini",
    category: "multimodal",
    useCaseFit: ["writing", "research", "data", "mixed"],
    plans: [
      {
        id: "pro",
        label: "Google AI Pro",
        monthlyPerSeat: 19.99,
        sourceUrl: "https://gemini.google/us/subscriptions/?hl=en",
        verifiedAt: verifiedPricingDate
      },
      {
        id: "ultra",
        label: "Google AI Ultra",
        monthlyPerSeat: 99.99,
        sourceUrl: "https://gemini.google/us/subscriptions/?hl=en",
        verifiedAt: verifiedPricingDate,
        note: "Ultra starts at $99.99/month and can scale to a higher usage tier."
      },
      {
        id: "api",
        label: "Gemini API",
        monthlyPerSeat: null,
        isApi: true,
        sourceUrl: "https://ai.google.dev/gemini-api/docs/pricing",
        verifiedAt: verifiedPricingDate
      }
    ]
  },
  windsurf: {
    id: "windsurf",
    name: "Windsurf",
    category: "coding",
    useCaseFit: ["coding", "mixed"],
    plans: [
      {
        id: "free",
        label: "Free",
        monthlyPerSeat: 0,
        sourceUrl: "https://windsurf.com/pricing",
        verifiedAt: verifiedPricingDate
      },
      {
        id: "pro",
        label: "Pro",
        monthlyPerSeat: 20,
        sourceUrl: "https://windsurf.com/pricing",
        verifiedAt: verifiedPricingDate
      },
      {
        id: "teams",
        label: "Teams",
        monthlyPerSeat: 40,
        sourceUrl: "https://windsurf.com/pricing",
        verifiedAt: verifiedPricingDate
      },
      {
        id: "enterprise",
        label: "Enterprise",
        monthlyPerSeat: null,
        isEnterprise: true,
        sourceUrl: "https://windsurf.com/pricing",
        verifiedAt: verifiedPricingDate
      }
    ]
  }
};

export function getToolPricing(toolId: ToolId) {
  return pricingCatalog[toolId];
}

export function getPlan(toolId: ToolId, planId: string) {
  return pricingCatalog[toolId].plans.find((plan) => plan.id === planId);
}

export function getDefaultPlanId(toolId: ToolId) {
  return pricingCatalog[toolId].plans[0]?.id ?? "";
}

export function getPlanLabel(toolId: ToolId, planId: string) {
  return getPlan(toolId, planId)?.label ?? planId;
}
