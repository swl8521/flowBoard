export function errorResponse(message: string, status: number): Response {
  return Response.json(
    { message },
    { status }
  );
}