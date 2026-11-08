import { workspaces } from "@/types/workspace";
import type { RoleType, Workspace } from "@/types/workspace";

export async function GET() {
  return Response.json({ workspaces });
}

function isRoleType(value: unknown): value is RoleType {
  return value === "OWNER" || value === "ADMIN" || value === "MEMBER";
}

export async function POST(request: Request) {
  const body = await request.json();
  console.log(body);

  const name = typeof body.name === "string" ? body.name.trim() : "";

  if (name !== "" && isRoleType(body.role)) {

    const newWorkspace: Workspace = {
      id: Date.now(),
      name,
      role: body.role,
      createdAt: new Date().toISOString().split("T")[0],
    };

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