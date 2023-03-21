import { Handlers } from "$fresh/server.ts";
import { setCookie } from "https://deno.land/std/http/cookie.ts";
import { getUserData, updateUserSessionValue } from "./dbService.ts";

export const handler: Handlers = {
  async POST(req, ctx) {
    const url = new URL(req.url);
    const form = await req.formData();
    const user = form.get('username')
    const pass = form.get('password')
    try{
      if(!user || !pass){
        throw new Error('Invalid fields')
      }
      const { user_id, name, password } = await getUserData(user);
      if(!name || !password){
        throw new Error('user does not exist')
      }
      if(password !== pass){
        throw new Error('Invalid password')
      }
      const headers = new Headers();
      // deno bug doesn't recognize the randomUUID method. See https://github.com/denoland/deno/issues/12754
      const sessionValue = (crypto as any).randomUUID()
      setCookie(headers, {
        name: "auth",
        value: sessionValue, // this should be a unique value for each session
        maxAge: 20 * 60, // 20 minutes 
        sameSite: "Lax", // this is important to prevent CSRF attacks
        domain: url.hostname,
        path: "/",
        secure: true,
      });
      await updateUserSessionValue(user_id, sessionValue);

      headers.set("location", "/app/mindmaps");
      return new Response(null, {
        status: 303, // "See Other"
        headers,
      });

    }catch(err){
      // redirect back to login page
      const headers = new Headers();
      headers.set("location", "/login?status=failed");
      return new Response(null, {
        status: 303,
        headers,
      });
    }
  },
};