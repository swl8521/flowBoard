// 1일차, 2026-10-30 
export type RoleType = "OWNER" | "ADMIN" | "MEMBER";

export interface Workspace {
  id: number;
  name: string;
  description?: string;
  createdAt: string;
  role: RoleType;
}

const workspace: Workspace = {
  id: 1,
  name: "FlowBoard",
  createdAt: "2026-10-30",
  role: "OWNER",
}

export const workspaces: Workspace[] = [
  {
    id: 1,
    name: "APPLE",
    createdAt: "2026-10-30",
    role: "OWNER",
  },
  {
    id: 2,
    name: "GRAPE",
    createdAt: "2026-10-29",
    role: "ADMIN",
  },
  {
    id: 3,
    name: "STRAWBERRY",
    createdAt: "2026-10-28",
    role: "MEMBER",
  }
]

const ownerWorkspaces = workspaces.filter(workspace => workspace.role === "OWNER");
const workspaceNames = workspaces.map(workspace => workspace.name);
const foundWorkspace = workspaces.find(workspace => workspace.id === 2);

function getWorkspaceLabel(workspace: Workspace): string {
  return `${workspace.name} (${workspace.role})`;
}

function getWorkspaceById(id: number, workspaces: Workspace[]): Workspace | undefined {
  return workspaces.find(workspace => workspace.id === id);
}

const workspace2 = getWorkspaceById(2, workspaces);
if (workspace2) {
  console.log(getWorkspaceLabel(workspace2));
} else {
  console.log("Workspace not found");
}