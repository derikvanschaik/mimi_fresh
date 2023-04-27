// DO NOT EDIT. This file is generated by fresh.
// This file SHOULD be checked into source version control.
// This file is automatically updated during development when running `dev.ts`.

import config from "./deno.json" assert { type: "json" };
import * as $0 from "./routes/_middleware.ts";
import * as $1 from "./routes/api/dbService.ts";
import * as $2 from "./routes/api/login.ts";
import * as $3 from "./routes/api/logout.ts";
import * as $4 from "./routes/api/register.ts";
import * as $5 from "./routes/app/[mindmap].tsx";
import * as $6 from "./routes/app/mindmaps.tsx";
import * as $7 from "./routes/index.tsx";
import * as $8 from "./routes/login.tsx";
import * as $9 from "./routes/register.tsx";
import * as $$0 from "./islands/MindmapIsland.tsx";
import * as $$1 from "./islands/MindmapList.tsx";
import * as $$2 from "./islands/Textbox.tsx";
import * as $$3 from "./islands/TourInstruction.tsx";
import * as $$4 from "./islands/TutorialVideo.tsx";

const manifest = {
  routes: {
    "./routes/_middleware.ts": $0,
    "./routes/api/dbService.ts": $1,
    "./routes/api/login.ts": $2,
    "./routes/api/logout.ts": $3,
    "./routes/api/register.ts": $4,
    "./routes/app/[mindmap].tsx": $5,
    "./routes/app/mindmaps.tsx": $6,
    "./routes/index.tsx": $7,
    "./routes/login.tsx": $8,
    "./routes/register.tsx": $9,
  },
  islands: {
    "./islands/MindmapIsland.tsx": $$0,
    "./islands/MindmapList.tsx": $$1,
    "./islands/Textbox.tsx": $$2,
    "./islands/TourInstruction.tsx": $$3,
    "./islands/TutorialVideo.tsx": $$4,
  },
  baseUrl: import.meta.url,
  config,
};

export default manifest;
