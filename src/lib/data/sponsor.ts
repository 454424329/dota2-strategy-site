import { cache } from "react";
import { prisma } from "@/lib/prisma";

export interface SponsorRow {
  id: string;
  userName: string;
  amount: number;
  message: string | null;
  confirmed: boolean;
  createdAt: Date;
}

// Get confirmed sponsors for the public wall
export const getConfirmedSponsors = cache(async (limit = 50) => {
  return prisma.sponsor.findMany({
    where: { confirmed: true },
    orderBy: { createdAt: "desc" },
    take: limit,
    select: {
      id: true,
      userName: true,
      amount: true,
      message: true,
      confirmed: true,
      createdAt: true,
    },
  });
});

export const getSponsorStats = cache(async () => {
  const [total, count] = await Promise.all([
    prisma.sponsor.aggregate({
      where: { confirmed: true },
      _sum: { amount: true },
    }),
    prisma.sponsor.count({ where: { confirmed: true } }),
  ]);
  return {
    totalAmount: total._sum.amount ?? 0,
    totalCount: count,
  };
});

export async function createSponsor(data: {
  userName: string;
  amount: number;
  message?: string;
}) {
  return prisma.sponsor.create({
    data: {
      userName: data.userName,
      amount: data.amount,
      message: data.message || null,
    },
    select: {
      id: true,
      userName: true,
      amount: true,
      message: true,
      confirmed: true,
      createdAt: true,
    },
  });
}

export async function confirmSponsor(id: string) {
  return prisma.sponsor.update({
    where: { id },
    data: { confirmed: true, confirmedAt: new Date() },
  });
}

export async function getPendingSponsors() {
  return prisma.sponsor.findMany({
    where: { confirmed: false },
    orderBy: { createdAt: "desc" },
  });
}
