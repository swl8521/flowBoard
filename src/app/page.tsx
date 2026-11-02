"use client";

import { workspaces, type Workspace, type RoleType } from "@/types/workspace";
import WorkspaceItem from "@/components/WorkspaceItem";
import { useState } from "react";

type FilterRole = RoleType | "ALL";

export default function Home() {
  const [selectedWorkspace, setSelectedWorkspace] = useState<Workspace | null>(null);
  const [filterRole, setFilterRole] = useState<FilterRole>("ALL");

  // handleSelectWorkspace(workspace) = 지금 실행
  // handleSelectWorkspace = 함수를 전달해서 나중에 실행
  function handleSelectWorkspace(workspace: Workspace) {
    setSelectedWorkspace(workspace);
    console.log(`Selected: ${workspace.name}`);
  }

  // 뒤쪽 : 영역은 Narrowing 적용
  const filteredWorkspaces = filterRole === "ALL" ? workspaces : workspaces.filter(workspace => workspace.role === filterRole);
  const filterRoles: FilterRole[] = [
    "ALL",
    "OWNER",
    "ADMIN",
    "MEMBER"
  ];

  return (
    <div>
      <div>FlowBoard</div>

      <div className="flex gap-2">
        {
          filterRoles.map(role => (
            <button key={role} onClick={() => setFilterRole(role)}>
              {filterRole === role ? `[${role} *]` : `[${role}]`}
            </button>
          ))
        }
      </div>

      {
        // TypeScript Narrowing
      }
      <div>{selectedWorkspace ? `선택된 Workspace: ${selectedWorkspace.name}` : `선택된 Workspace 없음`}</div>
      <ul>
        {
          filteredWorkspaces.map((workspace) => {
            return (
              <li key={workspace.id}>
                <WorkspaceItem workspace={workspace} onSelect={handleSelectWorkspace} isSelected={selectedWorkspace?.id === workspace.id} />
              </li>
            )
          })
        }
      </ul>
    </div>
  );
}
