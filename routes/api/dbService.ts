import { Client } from "https://deno.land/x/postgres@v0.17.0/mod.ts";
import "https://deno.land/x/dotenv/load.ts";

async function getClient(){
  const url = Deno.env.get('DB_URL')
  const client = new Client(url);
  await client.connect();
  return client;
}
export async function getMindmaps(sessionValue: string){
  // connect
  const client = await getClient();
  // get all mindmaps by logged in user
  // we don't want users being able to see other user's mindmaps 
  const result = await client.queryObject(`
  SELECT 
    mindmap_id, mindmap_data, title 
  FROM 
    mindmap
  JOIN 
    sessions ON sessions.user_id = mindmap.user_id
  WHERE 
    session=$1
  `, [sessionValue]);
  await client.end();
  return result.rows;
}

export async function getMindmapData(mindmapID: number, sessionValue: string){
  // connect
  const client = await getClient();
  // query db
  const result = await client.queryObject(`
  SELECT 
    mindmap_data 
  FROM 
    mindmap
  JOIN
    sessions on sessions.user_id = mindmap.user_id
  WHERE 
    mindmap_id=$1 AND session=$2`
  , [mindmapID, sessionValue]);
  await client.end();
  return result.rows;
}
// update stringified data for mindmap
export async function updateMindmapData(mindmapID: number, data: string, sessionValue: string){
  // connect
  const client = await getClient();
  await client.queryObject(`
  UPDATE
    mindmap 
  SET 
    data=$1
  WHERE 
    mindmap_id = $2
  AND mindmap.user_id = (
    select user_id from sessions where session = $3
  );
    `, [data, mindmapID, sessionValue]);
  await client.end();
}

export async function createMindmap(title: string, sessionValue: string){
  const client = await getClient();
  const result = await client.queryObject(`
    INSERT INTO mindmap(mindmap_data, title, user_id) 
    values ('', $1, (SELECT user_id from sessions WHERE session=$2)) RETURNING mindmap_id`, [title, sessionValue]
  )
  await client.end();
  return result.rows[0].mindmap_id;
}

export async function updateMindmapTitle(mindmapID: number, title: string, sessionValue: string){
  const client = await getClient();
  await client.queryObject(`
  UPDATE
    mindmap 
  SET 
    title=$1
  WHERE 
    mindmap_id = $2
  AND mindmap.user_id = (
    select user_id from sessions where session = $3
  );
    `, [title, mindmapID, sessionValue]
  )
  await client.end();
}
export async function deleteMindmap(mindmapID: number, sessionValue: string){
  const client = await getClient();
  await client.queryObject(`
  DELETE FROM
    mindmap
  WHERE 
    mindmap_id = $2
  AND mindmap.user_id = (
    select user_id from sessions where session = $3
  );`, [mindmapID, sessionValue]
  )
  await client.end();
}

export async function getUserData(username: string){
  const client = await getClient()
  const data = await client.queryObject(
    `select * from users where name=$1`, [username]
  )
  await client.end();
  return data.rows[0];
}

export async function updateUserSessionValue(
  userID: number, sessionValue: string){
    const client = await getClient()
    await client.queryObject(
      `insert into sessions(session, user_id) values($1, $2)`,
      [sessionValue, userID]
    )
    await client.end()
}

export async function isValidSession(sessionValue: string): Promise<boolean>{
  const client = await getClient()
  const result = await client.queryObject('select * from sessions where session=$1', [sessionValue])
  await client.end()
  return result.rows.length == 1;
}

export async function deleteSessionValue(sessionValue: string){
  const client = await getClient()
  await client.queryObject('delete from sessions where session=$1', [sessionValue])
  await client.end()
}