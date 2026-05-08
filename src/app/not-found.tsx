"use client";

import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <Container className="py-24 text-center">
      <div className="max-w-md mx-auto">
        <h1 className="text-6xl font-bold text-dota-text mb-4">404</h1>
        <p className="text-lg text-dota-muted mb-2">页面未找到</p>
        <p className="text-sm text-dota-muted mb-8">
          你访问的页面不存在或已被移至其他位置
        </p>
        <div className="flex items-center justify-center gap-3">
          <Link href="/">
            <Button variant="dota">
              <Home className="w-4 h-4 mr-2" />
              返回首页
            </Button>
          </Link>
          <Button variant="outline" onClick={() => window.history.back()}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            返回上页
          </Button>
        </div>
      </div>
    </Container>
  );
}
