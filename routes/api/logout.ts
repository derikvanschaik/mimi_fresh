import { Handlers } from "$fresh/server.ts";
import { deleteCookie, getCookies } from "https://deno.land/std/http/cookie.ts";
import { deleteSessionValue } from './dbService.ts'

export const handler: Handlers = {
  async GET(req) {
    const url = new URL(req.url);
    const headers = new Headers(req.headers);
    const sessionValue = getCookies(req.headers)
    deleteCookie(headers, "auth", { path: "/", domain: url.hostname });
    await deleteSessionValue(sessionValue)
    headers.set("location", "/");
    return new Response(null, {
      status: 302,
      headers,
    });
  },
};