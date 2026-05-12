"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { SponsorRow } from "@/lib/data/sponsor";

export function AdminSponsorClient({
  pending: initial,
}: {
  pending: SponsorRow[];
}) {
  const [pending, setPending] = useState(initial);
  const [confirming, setConfirming] = useState<string | null>(null);

  async function handleConfirm(id: string) {
    setConfirming(id);
    try {
      const res = await fetch("/api/sponsor/confirm", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (res.ok) {
        setPending((prev) => prev.filter((s) => s.id !== id));
      }
    } catch {
      // ignore
    } finally {
      setConfirming(null);
    }
  }

  if (pending.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <p className="text-dota-muted">没有待确认的赞助</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {pending.map((s) => (
        <Card key={s.id}>
          <CardContent className="py-4 flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-dota-text">
                  {s.userName}
                </span>
                <span className="text-dota-gold font-semibold">
                  ¥{s.amount}
                </span>
                <Badge variant="outline" className="text-xs">
                  待确认
                </Badge>
              </div>
              {s.message && (
                <p className="text-xs text-dota-muted mt-1 truncate">
                  {s.message}
                </p>
              )}
              <p className="text-xs text-dota-border mt-1">
                {new Date(s.createdAt).toLocaleString("zh-CN")}
              </p>
            </div>
            <Button
              size="sm"
              onClick={() => handleConfirm(s.id)}
              disabled={confirming === s.id}
            >
              {confirming === s.id ? "确认中..." : "确认赞助"}
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
