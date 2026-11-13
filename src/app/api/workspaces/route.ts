import type { RoleType, Workspace } from "@/types/workspace";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const workspaces = await prisma.workspace.findMany();

    return Response.json({ workspaces });
  } catch {
    return Response.json(
      { message: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}

function isRoleType(value: unknown): value is RoleType {
  return value === "OWNER" || value === "ADMIN" || value === "MEMBER";
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json(
      { message: "잘못된 요청입니다." },
      { status: 400 }
    );
  }

  if (typeof body !== "object" || body === null) {
    return Response.json(
      { message: "잘못된 요청입니다." },
      { status: 400 }
    );
  }

  if (!("name" in body) || typeof body.name !== "string") {
    return Response.json(
      { message: "잘못된 요청입니다." },
      { status: 400 }
    );
  }

  const name = body.name.trim();
  if (!("role" in body) || typeof body.role !== "string") {
    return Response.json(
      { message: "잘못된 요청입니다." },
      { status: 400 }
    );
  }

  if (name === "" || !isRoleType(body.role)) {
    return Response.json(
      { message: "잘못된 요청입니다." },
      { status: 400 }
    );
  }

  try {
    const newWorkspace = await prisma.workspace.create({
      data: {
        name,
        role: body.role,
      }
    });

    return Response.json(
      { workspace: newWorkspace },
      { status: 201 }
    );
  } catch {
    return Response.json(
      { message: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}