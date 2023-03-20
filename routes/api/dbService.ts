import { Client } from "https://deno.land/x/postgres@v0.17.0/mod.ts";
import "https://deno.land/x/dotenv/load.ts";

async function getClient(){
  const url = Deno.env.get('DB_URL')
  const client = new Client(url);
  await client.connect();
  return client;
}
async function createDummyMindmapData(){
  const textboxes = [
    { x: 600, y: 300, text: 'idea 1', id: "90192", selected: false},
    { x: 230, y: 89, text: 'idea 2', id: "9102390", selected: false},
    {x: 100, y: 100, text: 'another idea', id: "77", selected: false},
  ]
  const lines = [
    { from: {x: 600, y: 300}, to: {x: 230, y: 89}},
  ]
  const mindmapData = { lines, textboxes }
  const data = JSON.stringify(mindmapData);
  // console.log(data)
  const client = await getClient();
  await client.queryObject(`UPDATE mindmap set mindmap_data=$1 WHERE mindmap_id=1`, [data])
  await client.queryObject(`UPDATE mindmap set mindmap_data=$1 WHERE mindmap_id=2`, [data])
  await client.queryObject(`UPDATE mindmap set mindmap_data=$1 WHERE mindmap_id=3`, [data])
  await client.end();

}
export async function getMindmaps(){
  // connect
  const client = await getClient();
  // query db
  const result = await client.queryObject('SELECT * FROM mindmap');
  await client.end();
  return result.rows;
}

export async function getMindmapData(mindmapID: int){
  // connect
  const client = await getClient();
  // query db
  const result = await client.queryObject('SELECT mindmap_data FROM mindmap WHERE mindmap_id=$1', [mindmapID]);
  await client.end();
  return result.rows;
}
// update stringified data for mindmap
export async function updateMindmapData(mindmapID: number, data: string){
  // connect
  const client = await getClient();
  await client.queryObject(
    `UPDATE mindmap set mindmap_data=$1 WHERE mindmap_id=$2`, [data, mindmapID]);
  await client.end();
}

export async function createMindmap(title: string){
  const client = await getClient();
  const result = await client.queryObject(
    `insert into mindmap(mindmap_data, title) 
    values ('', $1) returning mindmap_id`, [title]
  )
  await client.end();
  return result.rows[0].mindmap_id;
}

export async function updateMindmapTitle(mindmapID: number, title: string){
  const client = await getClient();
  await client.queryObject(
    `update mindmap set title=$1 where mindmap_id = $2;`, [title, mindmapID]
  )
  await client.end();
}
export async function deleteMindmap(mindmapID: number){
  const client = await getClient();
  await client.queryObject(
    `delete from mindmap where mindmap_id = $1`, [mindmapID]
  )
  await client.end();
}