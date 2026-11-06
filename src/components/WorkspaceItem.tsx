import type { Workspace } from "@/types/workspace";

interface WorkspaceItemProps {
  workspace: Workspace;
  showRole?: boolean;
  onSelect: (workspace: Workspace) => void;
  isSelected: boolean;
}

export default function WorkspaceItem({ workspace, showRole = true, onSelect, isSelected }: WorkspaceItemProps) {
  function handleClick(event: React.MouseEvent<HTMLButtonElement>) {
    console.log(event.currentTarget.textContent);
    onSelect(workspace);
  }

  return (
    <div>
      {workspace.name}{showRole ? ` (${workspace.role})` : ''} <button onClick={handleClick}>선택</button> {isSelected ? '← 선택됨' : ''}
    </div>
  )
}