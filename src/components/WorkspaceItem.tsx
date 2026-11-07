import type { Workspace } from "@/types/workspace";

interface WorkspaceItemProps {
  workspace: Workspace;
  showRole?: boolean;
  onSelect: (workspace: Workspace) => void;
  onDelete: (workspace: Workspace) => void;
  isSelected: boolean;
}

export default function WorkspaceItem({ workspace, showRole = true, onSelect, onDelete, isSelected }: WorkspaceItemProps) {
  function handleClick(event: React.MouseEvent<HTMLButtonElement>) {
    console.log(event.currentTarget.textContent);
    onSelect(workspace);
  }

  function handleDeleteClick() {
    console.log(workspace.name);
    onDelete(workspace);
  }

  return (
    <div>
      {workspace.name}{showRole ? ` (${workspace.role})` : ''} <button onClick={handleClick}>선택</button> {isSelected ? '← 선택됨' : ''} <button onClick={handleDeleteClick}>삭제</button>
    </div>
  )
}