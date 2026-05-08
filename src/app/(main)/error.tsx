"use client";

import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

export default function MainError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <Container className="py-24 text-center">
      <div className="max-w-md mx-auto">
        <AlertTriangle className="w-12 h-12 text-dota-red mx-auto mb-4" />
        <h2 className="text-xl font-bold text-dota-text mb-2">加载出错</h2>
        <p className="text-sm text-dota-muted mb-6">
          页面数据加载失败，请稍后重试。
        </p>
        <Button variant="dota" onClick={reset}>
          重试
        </Button>
      </div>
    </Container>
  );
}
