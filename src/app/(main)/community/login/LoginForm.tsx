"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";

interface LoginFormProps {
  callbackUrl?: string;
}

export function LoginForm({ callbackUrl }: LoginFormProps) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || name.trim().length < 2) {
      setError("用户名至少2个字符");
      return;
    }

    setLoading(true);
    setError("");

    const result = await signIn("credentials", {
      name: name.trim(),
      password: password || undefined,
      redirect: false,
    });

    if (result?.error) {
      setError(result.error === "CredentialsSignin" ? "用户名包含无效字符" : "登录失败");
      setLoading(false);
    } else {
      router.push(callbackUrl || "/community");
      router.refresh();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 rounded bg-dota-red/10 border border-dota-red/30 text-sm text-dota-red">
          {error}
        </div>
      )}
      <div>
        <label className="block text-sm font-medium text-dota-text mb-1">
          用户名
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="输入你的用户名（2-20个字符）"
          maxLength={20}
          className="w-full rounded-md border border-dota-border bg-dota-surface px-3 py-2 text-sm text-dota-text placeholder:text-dota-muted focus:outline-none focus:ring-2 focus:ring-dota-accent/50"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-dota-text mb-1">
          密码 <span className="text-dota-muted font-normal">（仅管理员需要）</span>
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="普通用户无需填写密码"
          className="w-full rounded-md border border-dota-border bg-dota-surface px-3 py-2 text-sm text-dota-text placeholder:text-dota-muted focus:outline-none focus:ring-2 focus:ring-dota-accent/50"
        />
      </div>
      <Button type="submit" disabled={!name.trim() || loading} className="w-full">
        {loading ? "登录中..." : "进入社区"}
      </Button>
      <p className="text-xs text-dota-muted text-center">
        首次输入用户名将自动注册账号
      </p>
    </form>
  );
}
