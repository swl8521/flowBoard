import prisma from "@/lib/prisma";

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