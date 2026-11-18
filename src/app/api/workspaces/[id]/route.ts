import prisma from "@/lib/prisma";
import { errorResponse } from "@/lib/api";
import type { RoleType } from "@/types/workspace";
import { isRoleType } from "@/lib/workspace";

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const workspaceId = Number(id);

  if (Number.isNaN(workspaceId)) {
    return errorResponse("잘못된 요청입니다.", 400);
  }

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
    const workspace = await prisma.workspace.findUnique({
      where: {
        id: workspaceId
      }
    });

    if (!workspace) {
      return errorResponse("워크스페이스를 찾을 수 없습니다.", 404);
    }

    const updatedWorkspace = await prisma.workspace.update({
      where: {
        id: workspaceId
      },
      data: {
        name,
        role: body.role
      },
    });

    return Response.json(
      { workspace: updatedWorkspace },
      { status: 200 }
    );
  } catch {
    return errorResponse("서버 오류가 발생했습니다.", 500);
  }
}

export async function DELETE(
  _request: Request, // _ 아직 미사용이라는 뜻
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const workspaceId = Number(id);

  if (Number.isNaN(workspaceId)) {
    return errorResponse("잘못된 요청입니다.", 400);
  }

  try {
    const workspace = await prisma.workspace.findUnique({
      where: {
        id: workspaceId
      }
    });

    if (!workspace) {
      return errorResponse("워크스페이스를 찾을 수 없습니다.", 404);
    }

    await prisma.workspace.delete({
      where: {
        id: workspace.id
      }
    });

    return Response.json({
      message: "워크스페이스가 삭제되었습니다.",
    });
  } catch {
    return errorResponse("서버 오류가 발생했습니다.", 500);
  }
}