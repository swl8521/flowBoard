import { workspaces } from "@/types/workspace";

export async function DELETE(
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

  const workspace = workspaces.find((workspace) => workspace.id === workspaceId);

  if (!workspace) {
    return Response.json(
      { message: "워크스페이스를 찾을 수 없습니다." },
      { status: 404 }
    );
  }

  console.log(workspace);
  const updatedWorkspaces = workspaces.filter((workspace) => workspace.id !== workspaceId);

  return Response.json({
    message: "워크스페이스가 삭제되었습니다.",
  });
}