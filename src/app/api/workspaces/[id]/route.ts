import prisma from "@/lib/prisma";
import type { RoleType } from "@/types/workspace";

function isRoleType(value: unknown): value is RoleType {
  return value === "OWNER" || value === "ADMIN" || value === "MEMBER";
}

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const workspaceId = Number(id);

  if (Number.isNaN(workspaceId)) {
    return Response.json(
      { message: "잘못된 요청입니다." },
      { status: 400 }
    );
  }

  const body = await request.json();
  const name = typeof body.name === "string" ? body.name.trim() : "";

  if (name !== "" && isRoleType(body.role)) {
    const workspace = await prisma.workspace.findUnique({
      where: {
        id: workspaceId
      }
    });

    if (!workspace) {
      return Response.json(
        { message: "워크스페이스를 찾을 수 없습니다." },
        { status: 404 }
      );
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
  }

  return Response.json(
    { message: "잘못된 요청입니다." },
    { status: 400 }
  );
}

export async function DELETE(
  _request: Request, // _ 아직 미사용이라는 뜻
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const workspaceId = Number(id);

  if (Number.isNaN(workspaceId)) {
    return Response.json(
      { message: "잘못된 요청입니다." },
      { status: 400 }
    );
  }

  const workspace = await prisma.workspace.findUnique({
    where: {
      id: workspaceId
    }
  });

  if (!workspace) {
    return Response.json(
      { message: "워크스페이스를 찾을 수 없습니다." },
      { status: 404 }
    );
  }

  await prisma.workspace.delete({
    where: {
      id: workspace.id
    }
  });

  return Response.json({
    message: "워크스페이스가 삭제되었습니다.",
  });
}