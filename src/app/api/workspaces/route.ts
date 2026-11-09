import type { RoleType, Workspace } from "@/types/workspace";
import prisma from "@/lib/prisma";

export async function GET() {
  const workspaces = await prisma.workspace.findMany();

  return Response.json({ workspaces });
}

function isRoleType(value: unknown): value is RoleType {
  return value === "OWNER" || value === "ADMIN" || value === "MEMBER";
}

export async function POST(request: Request) {
  const body = await request.json();
  const name = typeof body.name === "string" ? body.name.trim() : "";

  if (name !== "" && isRoleType(body.role)) {
    const newWorkspace = await prisma.workspace.create({
      data: {
        name: name,
        role: body.role,
      }
    });

    return Response.json(
      { workspace: newWorkspace },
      { status: 201 }
    );
  }

  return Response.json(
    { message: "잘못된 요청입니다." },
    { status: 400 }
  );
}