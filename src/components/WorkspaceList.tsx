"use client";

import type { Workspace, RoleType } from "@/types/workspace";
import { useState } from "react";
import WorkspaceItem from "@/components/WorkspaceItem";

type FilterRole = RoleType | "ALL";

interface WorkspaceListProps {
  workspaces: Workspace[];
}

export default function WorkspaceList({ workspaces }: WorkspaceListProps) {
  const [workspaceList, setWorkspaceList] = useState<Workspace[]>(workspaces);

  const [selectedWorkspace, setSelectedWorkspace] = useState<Workspace | null>(null);
  const [filterRole, setFilterRole] = useState<FilterRole>("ALL");
  const filterRoles: FilterRole[] = ["ALL", "OWNER", "ADMIN", "MEMBER"];
  const filteredWorkspaces = filterRole === "ALL" ? workspaceList : workspaceList.filter((workspace) => workspace.role === filterRole);
  const [workspaceName, setWorkspaceName] = useState<string>("");
  const [workspaceRole, setWorkspaceRole] = useState<RoleType>("MEMBER");

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  function handleSelect(workspace: Workspace) {
    setSelectedWorkspace(workspace);
  }

  function handleDelete(workspace: Workspace) {
    setWorkspaceList(prev => prev.filter((w) => w.id !== workspace.id));

    if (selectedWorkspace?.id === workspace.id) {
      setSelectedWorkspace(null);
    }
  }

  function isFilterRole(value: string): value is FilterRole {
    return filterRoles.includes(value as FilterRole);
  }

  function isRoleType(value: string): value is RoleType {
    return (
      value === "OWNER" ||
      value === "ADMIN" ||
      value === "MEMBER"
    );
  }

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const value = e.currentTarget.value;
    if (isFilterRole(value)) {
      setFilterRole(value);
      setSelectedWorkspace(null);
    }
  }

  function handleNameChange(e: React.ChangeEvent<HTMLInputElement>) {
    setErrorMessage(null);
    setWorkspaceName(e.currentTarget.value);
  }

  function handleRoleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const value = e.currentTarget.value;
    if (isRoleType(value)) {
      setWorkspaceRole(value);
    }
  }

  function handleSubmit(
    e: React.SubmitEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    const name = workspaceName.trim();

    if (name === "") {
      setErrorMessage("워크스페이스 이름을 입력해주세요.");
      return;
    }

    if (workspaceList.some(workspace => workspace.name.toLowerCase() === name.toLowerCase())) {
      setErrorMessage("이미 존재하는 워크스페이스입니다.");
      return;
    }

    setErrorMessage(null);

    const newWorkspace: Workspace = {
      id: Date.now(),
      name,
      role: workspaceRole,
      createdAt: "2026-11-07",
    };

    console.log(newWorkspace);

    setWorkspaceList(prev => [...prev, newWorkspace]);
    setWorkspaceName("");
    setWorkspaceRole("MEMBER");
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div>Workspace 이름: [<input type="text" value={workspaceName} onChange={handleNameChange} />]</div>
        <div>Workspace 역할: [<select value={workspaceRole} onChange={handleRoleChange}>
          <option value="OWNER">OWNER</option>
          <option value="ADMIN">ADMIN</option>
          <option value="MEMBER">MEMBER</option>
        </select>]</div>
        <button type="submit">
          Workspace 추가
        </button>
      </form>
      {
        errorMessage && (
          <div style={{ color: "red" }}>
            {errorMessage}
          </div>
        )
      }
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
                  onDelete={handleDelete}
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