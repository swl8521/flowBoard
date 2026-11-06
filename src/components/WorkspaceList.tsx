"use client";

import type { Workspace, RoleType } from "@/types/workspace";
import { useState } from "react";
import WorkspaceItem from "@/components/WorkspaceItem";

type FilterRole = RoleType | "ALL";

interface WorkspaceListProps {
  workspaces: Workspace[];
}

export default function WorkspaceList({ workspaces }: WorkspaceListProps) {
  const [selectedWorkspace, setSelectedWorkspace] = useState<Workspace | null>(null);
  const [filterRole, setFilterRole] = useState<FilterRole>("ALL");
  const filterRoles: FilterRole[] = ["ALL", "OWNER", "ADMIN", "MEMBER"];
  const filteredWorkspaces = filterRole === "ALL" ? workspaces : workspaces.filter((workspace) => workspace.role === filterRole);

  function handleSelect(workspace: Workspace) {
    setSelectedWorkspace(workspace);
  }

  function isFilterRole(value: string): value is FilterRole {
    return filterRoles.includes(value as FilterRole);
  }

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const value = e.currentTarget.value;
    if (isFilterRole(value)) {
      setFilterRole(value);
      setSelectedWorkspace(null);
    }
  }

  return (
    <div>
      <div>
        선택된 워크스페이스: {selectedWorkspace ? `${selectedWorkspace.name}` : '없음'}
      </div>
      <div className="flex gap-2">
        <select value={filterRole} onChange={handleChange}>
          {
            filterRoles.map(role => (
              <option key={role} value={role}>
                {role}
              </option>
            ))
          }
        </select>
      </div>
      <ul>
        {
          filteredWorkspaces.map((workspace) => {
            return (
              <li key={workspace.id}>
                <WorkspaceItem
                  workspace={workspace}
                  onSelect={handleSelect}
                  isSelected={selectedWorkspace?.id === workspace.id}
                />
              </li>
            )
          })
        }
      </ul>
    </div>
  )
}