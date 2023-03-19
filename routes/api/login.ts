import { Handlers } from "$fresh/server.ts";
import { setCookie} from "https://deno.land/std/http/cookie.ts";

export const handler: Handlers = {
  async POST(req, ctx) {
    const url = new URL(req.url);
    const form = await req.formData();
    if (form.get("username") === Deno.env.get('ADMIN_USER') && form.get("password") === Deno.env.get('ADMIN_PASS')) {
      const headers = new Headers();
      setCookie(headers, {
        name: "auth",
        value: "bar", // this should be a unique value for each session
        maxAge: 120,
        sameSite: "Lax", // this is important to prevent CSRF attacks
        domain: url.hostname,
        path: "/",
        secure: true,
      });

      headers.set("location", "/app/mindmaps");
      return new Response(null, {
        status: 303, // "See Other"
        headers,
      });
    } else {
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