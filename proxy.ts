import { NextRequest, NextResponse } from "next/server";

export async function proxy(request: NextRequest) {
  const cookie = request.cookies.get("guest_session_id");
  if (!cookie) {
    const apiKey = process.env.TMDB_API_KEY;
    const res = await fetch(
      `https://api.themoviedb.org/3/authentication/guest_session/new?api_key=${apiKey}`,
    );
    const data = await res.json();
    const guestSessionId = data.guest_session_id;

    const response = NextResponse.next();
    response.cookies.set("guest_session_id", guestSessionId, {
      path: "/",
      maxAge: 259200,
      sameSite: "lax",
    });
    return response;
  }
  return NextResponse.next();
}

export default proxy;
