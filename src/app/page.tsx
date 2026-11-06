import { workspaces } from "@/types/workspace";
import WorkspaceList from "@/components/WorkspaceList";

export default function Home() {
  return (
    <div>
      <div>FlowBoard</div>

      <WorkspaceList workspaces={workspaces} />
    </div>
  );
}
