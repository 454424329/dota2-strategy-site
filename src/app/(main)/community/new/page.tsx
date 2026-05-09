import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { Container } from "@/components/layout/Container";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { auth } from "@/lib/auth";
import { getCategories } from "@/lib/data/community";
import { CreateDiscussionForm } from "./CreateDiscussionForm";

export const metadata: Metadata = {
  title: "发起讨论",
};

export default async function NewDiscussionPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/community/login?callbackUrl=/community/new");
  }

  const categories = await getCategories();

  return (
    <Container className="py-8 max-w-2xl">
      <h1 className="text-2xl font-bold text-dota-text mb-6">发起新讨论</h1>
      <Card>
        <CardHeader>
          <h3 className="font-semibold text-dota-text">发布讨论</h3>
        </CardHeader>
        <CardContent>
          <CreateDiscussionForm categories={categories} />
        </CardContent>
      </Card>
    </Container>
  );
}
