"use client";

import type { Workspace, RoleType } from "@/types/workspace";
import { useState, useEffect } from "react";
import WorkspaceItem from "@/components/WorkspaceItem";

type FilterRole = RoleType | "ALL";

interface WorkspaceResponse {
  workspaces: Workspace[];
}

interface CreateWorkspaceResponse {
  workspace: Workspace;
}

interface UpdateWorkspaceResponse {
  workspace: Workspace;
}

export default function WorkspaceList() {
  const [workspaceList, setWorkspaceList] = useState<Workspace[]>([]);

  const [selectedWorkspace, setSelectedWorkspace] = useState<Workspace | null>(null);
  const [filterRole, setFilterRole] = useState<FilterRole>("ALL");
  const filterRoles: FilterRole[] = ["ALL", "OWNER", "ADMIN", "MEMBER"];
  const filteredWorkspaces = filterRole === "ALL" ? workspaceList : workspaceList.filter((workspace) => workspace.role === filterRole);
  const [workspaceName, setWorkspaceName] = useState<string>("");
  const [workspaceRole, setWorkspaceRole] = useState<RoleType>("MEMBER");

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [apiErrorMessage, setApiErrorMessage] = useState<string>("");

  const [editName, setEditName] = useState<string>("");
  const [editRole, setEditRole] = useState<RoleType>("MEMBER");

  useEffect(() => {
    async function fetchWorkspaces() {
      setIsLoading(true);
      setApiErrorMessage("");

      try {
        const response = await fetch("/api/workspaces");
        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.message);
        }

        const data: WorkspaceResponse = await response.json();
        setWorkspaceList(data.workspaces);
      } catch (error) {
        if (error instanceof Error) {
          setApiErrorMessage(error.message);
        } else {
          setApiErrorMessage("알 수 없는 오류가 발생했습니다.");
        }
      } finally {
        setIsLoading(false);
      }
    }

    fetchWorkspaces();
  }, []);

  function handleSelect(workspace: Workspace) {
    setSelectedWorkspace(workspace);
    setEditName(workspace.name);
    setEditRole(workspace.role);
  }

  async function handleDelete(workspace: Workspace) {
    setApiErrorMessage("");

    try {
      const response = await fetch(`/api/workspaces/${workspace.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message);
      }

      setWorkspaceList(prev => prev.filter((w) => w.id !== workspace.id));
      if (selectedWorkspace?.id === workspace.id) {
        setSelectedWorkspace(null);
      }
    } catch (error) {
      if (error instanceof Error) {
        setApiErrorMessage(error.message);
      } else {
        setApiErrorMessage("알 수 없는 오류가 발생했습니다.");
      }
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

  async function handleEdit() {
    const name = editName.trim();

    if (selectedWorkspace === null) {
      setErrorMessage("워크스페이스 선택해주세요.");
      return;
    }

    if (name === "") {
      setErrorMessage("워크스페이스 이름을 입력해주세요.");
      return;
    }

    setErrorMessage(null);

    try {
      const response = await fetch(`/api/workspaces/${selectedWorkspace.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ name, role: editRole }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message);
      }

      const data: UpdateWorkspaceResponse = await response.json();

      setWorkspaceList(prev =>
        prev.map(workspace =>
          workspace.id === data.workspace.id
            ? data.workspace
            : workspace
        ));

      setEditName("");
      setEditRole("MEMBER");
      setSelectedWorkspace(null);
    } catch (error) {
      if (error instanceof Error) {
        setApiErrorMessage(error.message);
      } else {
        setApiErrorMessage("알 수 없는 오류가 발생했습니다.");
      }
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

  async function handleSubmit(
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
    setApiErrorMessage("");

    try {
      const response = await fetch("/api/workspaces", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ name, role: workspaceRole }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message);
      }

      const data: CreateWorkspaceResponse = await response.json();
      setWorkspaceList(prev => [
        ...prev,
        data.workspace,
      ]);

      setWorkspaceName("");
      setWorkspaceRole("MEMBER");
    } catch (error) {
      if (error instanceof Error) {
        setApiErrorMessage(error.message);
      } else {
        setApiErrorMessage("알 수 없는 오류가 발생했습니다.");
      }
    }
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
      {
        isLoading && (
          <div>워크스페이스 불러오는 중...</div>
        )
      }
      {
        apiErrorMessage && (
          <div style={{ color: "red" }}>
            {apiErrorMessage}
          </div>
        )
      }
      <div>
        선택된 워크스페이스: {selectedWorkspace ? `${selectedWorkspace.name}` : '없음'}
      </div>
      {
        selectedWorkspace && (
          <div>
            <div>수정 이름: [<input type="text" value={editName} onChange={(e) => setEditName(e.currentTarget.value)} />]</div>
            <div>수정 역할: [<select value={editRole} onChange={(e) => {
              const value = e.currentTarget.value;

              if (isRoleType(value)) {
                setEditRole(value);
              }
            }}>
              <option value="OWNER">OWNER</option>
              <option value="ADMIN">ADMIN</option>
              <option value="MEMBER">MEMBER</option>
            </select>]
              <button type="button" onClick={handleEdit}>
                수정
              </button>
            </div>
          </div>
        )
      }
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