import { MiddlewareHandlerContext } from "$fresh/server.ts";
import { getCookies } from "https://deno.land/std/http/cookie.ts";
import { isValidSession } from './api/dbService.ts'

interface State {
  data: string;
}

export async function handler(
    req: Request,
    ctx: MiddlewareHandlerContext<State>,
) {
    const url = new URL(req.url);
    // protected routes
    if(url.pathname.startsWith('/app')){
        // redirect user if they are not logged in
        const cookies = getCookies(req.headers);
        const loggedIn = await isValidSession(cookies.auth)
        if (!loggedIn) {
            const url = new URL(req.url);
            url.pathname = "/login";
            return Response.redirect(url);
        }
    }
    // ctx.state.data = "myData";
    const resp = await ctx.next();
    // resp.headers.set("server", "fresh server");
    return resp;
}