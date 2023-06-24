import { Handlers } from "$fresh/server.ts";
import { setCookie } from "https://deno.land/std/http/cookie.ts";
import { isUserRegistered, createNewUser, updateUserSessionValue } from "./dbService.ts";
import { hash , genSalt } from '../../utils/decrypt.ts'

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
      if (user.includes(' ') || pass.includes(' ')){
          throw new Error('Invalid fields')
      }
      const userExists = await isUserRegistered(user);
      if(userExists){
        throw new Error('username already taken')
      }
      const salt = await genSalt(8);
      const hashed = await hash(pass, salt);
      const user_id = await createNewUser(user, hashed);
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
      headers.set("location", "/register?status=failed");
      return new Response(null, {
        status: 303,
        headers,
      });
    }
  },
};