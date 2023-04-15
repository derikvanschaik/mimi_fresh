// so stupid 
// https://github.com/JamesBroadberry/deno-bcrypt/issues/26
// im dropping deno next project
import {
    genSalt as genSaltPromise,
    genSaltSync, 
    hash as hashPromise,
    hashSync,
    compare as comparePromise,
    compareSync,
  } from "https://deno.land/x/bcrypt/mod.ts";
  
  export const isRunningInDenoDeploy = (globalThis as any).Worker === undefined; 
console.log('is running in deploy = ', isRunningInDenoDeploy)

export const hash: typeof hashPromise = isRunningInDenoDeploy
  ? (plaintext: string, salt: string | undefined = undefined) =>
      new Promise((res) => res(hashSync(plaintext, salt)))
  : hashPromise;
export const compare: typeof comparePromise = isRunningInDenoDeploy
  ? (plaintext: string, hash: string) =>
      new Promise((res) => res(compareSync(plaintext, hash)))
  : comparePromise;

export const genSalt: typeof genPromise = isRunningInDenoDeploy
? (salt: number) =>
    new Promise((res) => res(genSaltSync(salt)))
: genSaltPromise;


