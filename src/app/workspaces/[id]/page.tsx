import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";

export const instant = false;

export default async function WorkspaceDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const workspaceId = Number(id);

  if (Number.isNaN(workspaceId)) {
    notFound();
  }

  const workspace = await prisma.workspace.findUnique({
    where: { id: workspaceId }
  });

  if (!workspace) {
    notFound();
  }

  return <div>
    <div>이름: {workspace.name}</div>
    <div>역할: {workspace.role}</div>
    <div>생성일: {workspace.createdAt.toDateString()}</div>
    <Link href="/">
      ← 워크스페이스 목록
    </Link>
  </div>;
}