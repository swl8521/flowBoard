import type { RoleType } from "@/types/workspace";
import prisma from "@/lib/prisma";
import { errorResponse } from "@/lib/api";
import { isRoleType } from "@/lib/workspace";

export async function GET() {
  try {
    const workspaces = await prisma.workspace.findMany();

    return Response.json({ workspaces });
  } catch {
    return errorResponse("서버 오류가 발생했습니다.", 500);
  }
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return errorResponse("잘못된 요청입니다.", 400);
  }

  if (typeof body !== "object" || body === null) {
    return errorResponse("잘못된 요청입니다.", 400);
  }

  if (!("name" in body) || typeof body.name !== "string") {
    return errorResponse("잘못된 요청입니다.", 400);
  }

  const name = body.name.trim();
  if (!("role" in body) || typeof body.role !== "string") {
    return errorResponse("잘못된 요청입니다.", 400);
  }

  if (name === "" || !isRoleType(body.role)) {
    return errorResponse("잘못된 요청입니다.", 400);
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
    return errorResponse("서버 오류가 발생했습니다.", 500);
  }
}