"use client";

import { useEffect, useState } from "react";
import { Check, Copy, Share2 } from "lucide-react";

import { Button } from "@/components/ui/button";

export function ShareButton({
  url,
  title
}: {
  url: string;
  title: string;
}) {
  const [copied, setCopied] = useState(false);

  const [canNativeShare, setCanNativeShare] =
    useState(false);

  useEffect(() => {
    setCanNativeShare(Boolean(navigator.share));
  }, []);

  async function share() {
    if (canNativeShare) {
      try {
        await navigator.share({
          title,
          url
        });

        return;
      } catch {
        // User cancelled native share flow.
      }
    }

    await navigator.clipboard.writeText(url);

    setCopied(true);

    window.setTimeout(() => {
      setCopied(false);
    }, 1800);
  }

  return (
    <Button
      type="button"
      variant="outline"
      onClick={share}
    >
      {copied ? (
        <Check className="size-4" />
      ) : canNativeShare ? (
        <Share2 className="size-4" />
      ) : (
        <Copy className="size-4" />
      )}

      {copied ? "Link copied" : "Share report"}
    </Button>
  );
}
