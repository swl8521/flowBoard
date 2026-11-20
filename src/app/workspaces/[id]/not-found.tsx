import Link from "next/link";

export default function WorkspaceNotFound() {
  return (
    <div>
      <h1>워크스페이스를 찾을 수 없습니다.</h1>
      <Link href="/">
        ← 워크스페이스 목록
      </Link>
    </div>
  );
}