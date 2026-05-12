"use client";

import { useState, useTransition } from "react";
import { Heart, User } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { SPONSOR_TIERS } from "@/types/dota";
import type { SponsorRow } from "@/lib/data/sponsor";

interface Props {
  sponsors: SponsorRow[];
  stats: { totalAmount: number; totalCount: number };
  alipayQr: string | null;
  wechatQr: string | null;
}

export function SponsorClient({ sponsors, stats, alipayQr, wechatQr }: Props) {
  const [tab, setTab] = useState<"sponsor" | "wall">("sponsor");
  const [amount, setAmount] = useState(18);
  const [customAmount, setCustomAmount] = useState("");
  const [userName, setUserName] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [pending, startTransition] = useTransition();
  const [qrOpen, setQrOpen] = useState(false);
  const [paidAmount, setPaidAmount] = useState(0);

  const usingCustom = customAmount !== "";
  const displayAmount = usingCustom ? Number(customAmount) || 0 : amount;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!userName.trim()) {
      setError("请输入昵称");
      return;
    }
    if (displayAmount < 1 || displayAmount > 9999) {
      setError("金额需在 1-9999 之间");
      return;
    }

    startTransition(async () => {
      try {
        const res = await fetch("/api/sponsor", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userName: userName.trim(),
            amount: displayAmount,
            message: message.trim() || undefined,
          }),
        });
        if (!res.ok) {
          const data = await res.json();
          setError(data.error || "提交失败");
          return;
        }
        setPaidAmount(displayAmount);
        setQrOpen(true);
        setAmount(18);
        setCustomAmount("");
        setUserName("");
        setMessage("");
      } catch {
        setError("网络错误，请重试");
      }
    });
  }

  return (
    <Container className="py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-dota-text mb-2">打赏赞助</h1>
        <p className="text-dota-muted">支持 DOTA2攻略站 的持续运营</p>
      </div>

      {/* Stats */}
      <div className="flex justify-center gap-8 mb-8">
        <div className="text-center">
          <div className="text-2xl font-bold text-dota-gold">¥{stats.totalAmount}</div>
          <div className="text-xs text-dota-muted mt-1">累计赞助</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-dota-text">{stats.totalCount}</div>
          <div className="text-xs text-dota-muted mt-1">赞助人次</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex justify-center gap-2 mb-8">
        <button
          onClick={() => setTab("sponsor")}
          className={`px-4 py-2 text-sm rounded-lg transition-colors ${
            tab === "sponsor"
              ? "bg-dota-gold text-black font-medium"
              : "text-dota-muted hover:text-dota-text bg-dota-surface"
          }`}
        >
          赞助我们
        </button>
        <button
          onClick={() => setTab("wall")}
          className={`px-4 py-2 text-sm rounded-lg transition-colors ${
            tab === "wall"
              ? "bg-dota-gold text-black font-medium"
              : "text-dota-muted hover:text-dota-text bg-dota-surface"
          }`}
        >
          赞助墙
        </button>
      </div>

      {tab === "sponsor" ? (
        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader>
              <h2 className="text-sm font-semibold text-dota-text">填写赞助信息</h2>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Tiers */}
                <div>
                  <p className="text-xs text-dota-muted mb-2">选择金额</p>
                  <div className="grid grid-cols-4 gap-2 mb-2">
                    {SPONSOR_TIERS.map((tier) => (
                      <button
                        key={tier.amount}
                        type="button"
                        onClick={() => { setAmount(tier.amount); setCustomAmount(""); }}
                        className={`py-2 px-3 text-xs rounded-lg border transition-colors ${
                          amount === tier.amount && !usingCustom
                            ? "border-dota-gold bg-dota-gold/10 text-dota-gold"
                            : "border-dota-border text-dota-muted hover:border-dota-muted"
                        }`}
                      >
                        <span className="block text-sm">{tier.emoji}</span>
                        ¥{tier.amount}
                      </button>
                    ))}
                  </div>
                  <Input
                    placeholder="自定义金额"
                    type="number"
                    min={1}
                    max={9999}
                    value={customAmount}
                    onChange={(e) => setCustomAmount(e.target.value)}
                    className="h-8 text-xs"
                  />
                </div>

                {/* Name */}
                <div>
                  <Input
                    placeholder="你的昵称（将展示在赞助墙）"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    maxLength={30}
                    className="h-9 text-sm"
                  />
                </div>

                {/* Message */}
                <div>
                  <Input
                    placeholder="留言（可选，最多200字）"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    maxLength={200}
                    className="h-9 text-sm"
                  />
                </div>

                {error && (
                  <p className="text-xs text-dota-red">{error}</p>
                )}

                <Button type="submit" className="w-full" disabled={pending}>
                  {pending ? "提交中..." : `赞助 ¥${displayAmount}`}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      ) : (
        /* Sponsor Wall */
        <div className="max-w-2xl mx-auto">
          {sponsors.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Heart className="h-8 w-8 text-dota-muted mx-auto mb-3" />
                <p className="text-dota-muted">还没有赞助记录，来做第一个支持者吧！</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {sponsors.map((s) => (
                <Card key={s.id} className="card-hover">
                  <CardContent className="py-3 flex items-center gap-4">
                    <div className="shrink-0 w-10 h-10 rounded-full bg-dota-bg flex items-center justify-center">
                      <User className="h-5 w-5 text-dota-muted" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-dota-text truncate">
                          {s.userName}
                        </span>
                        <Badge variant="outline" className="text-xs">
                          赞助
                        </Badge>
                      </div>
                      {s.message && (
                        <p className="text-xs text-dota-muted mt-0.5 truncate">
                          {s.message}
                        </p>
                      )}
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-sm font-semibold text-dota-gold">¥{s.amount}</span>
                      <p className="text-xs text-dota-border mt-0.5">
                        {new Date(s.createdAt).toLocaleDateString("zh-CN")}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {/* QR Code Dialog */}
      <Dialog open={qrOpen} onOpenChange={setQrOpen}>
        <DialogContent className="text-center">
          <DialogHeader>
            <DialogTitle>请扫码支付</DialogTitle>
            <DialogDescription>
              支付金额 <span className="text-dota-gold font-semibold">¥{paidAmount}</span>
            </DialogDescription>
          </DialogHeader>
          {alipayQr || wechatQr ? (
            <div className={`grid ${alipayQr && wechatQr ? "grid-cols-2" : "grid-cols-1"} gap-4 mt-4`}>
              {alipayQr && (
                <div className="text-center">
                  <img
                    src={alipayQr}
                    alt="支付宝收款码"
                    className="w-full rounded-lg border border-dota-border"
                  />
                  <p className="text-xs text-dota-muted mt-2">支付宝</p>
                </div>
              )}
              {wechatQr && (
                <div className="text-center">
                  <img
                    src={wechatQr}
                    alt="微信收款码"
                    className="w-full rounded-lg border border-dota-border"
                  />
                  <p className="text-xs text-dota-muted mt-2">微信支付</p>
                </div>
              )}
            </div>
          ) : (
            <div className="border border-dashed border-dota-border rounded-lg p-8 mt-4">
              <p className="text-sm text-dota-muted">收款码暂未配置</p>
            </div>
          )}
          <p className="text-xs text-dota-muted mt-4">
            支付完成后，管理员确认后会展示在赞助墙上
          </p>
        </DialogContent>
      </Dialog>

      {/* Why sponsor */}
      <Card className="max-w-2xl mx-auto mt-8">
        <CardContent className="py-6">
          <h3 className="text-sm font-semibold text-dota-text mb-3">为什么要赞助？</h3>
          <div className="text-sm text-dota-muted space-y-2">
            <p>• 服务器和数据库托管需要持续费用</p>
            <p>• 数据更新和内容维护需要投入时间</p>
            <p>• 你的支持让网站能够保持无广告、高质量</p>
            <p>• 未来计划：赞助者专属徽章、优先体验新功能</p>
          </div>
        </CardContent>
      </Card>
    </Container>
  );
}
