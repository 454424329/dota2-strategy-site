import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Container } from "@/components/layout/Container";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { LoginForm } from "./LoginForm";
import { auth } from "@/lib/auth";

export const metadata: Metadata = {
  title: "登录",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string }>;
}) {
  const session = await auth();
  const { callbackUrl } = await searchParams;

  if (session?.user) {
    redirect(callbackUrl || "/community");
  }

  return (
    <Container className="py-16 max-w-md mx-auto">
      <Card>
        <CardHeader>
          <h2 className="text-xl font-bold text-dota-text text-center">登录社区</h2>
          <p className="text-sm text-dota-muted text-center mt-1">
            输入用户名即可参与讨论
          </p>
        </CardHeader>
        <CardContent>
          <LoginForm callbackUrl={callbackUrl} />
        </CardContent>
      </Card>
    </Container>
  );
}
