import { buildConfig } from "payload/config";
import { mongooseAdapter } from "@payloadcms/db-mongodb";
import { slateEditor } from "@payloadcms/richtext-slate";
import { webpackBundler } from "@payloadcms/bundler-webpack";
import dayjs from "dayjs";
import dotenv from "dotenv";
import eoDayjs from "dayjs/locale/eo";
import path from "path";

import { Kol } from "./kolektoj/nomoj";
import { Terminoj, Uzantoj } from "./kolektoj";

dayjs.locale(eoDayjs);

dotenv.config({
  path: path.resolve(__dirname, "../../.env"),
});

export default buildConfig({
  admin: {
    user: Kol.Uzantoj,
    bundler: webpackBundler(),
    css: path.resolve(__dirname, "../stiloj/cxefa.scss"),
    webpack: config => ({
      ...config,
      resolve: {
        ...config.resolve,
        alias: {
          ...config.resolve?.alias,
          dotenv: path.resolve(__dirname, "./dotenv.js"),
        },
      },
    }),
  },
  editor: slateEditor({}),
  db: mongooseAdapter({
    url: process.env.DATABASE_URI!,
    autoPluralization: false,
  }),
  serverURL: process.env.PAYLOAD_PUBLIC_SERVER_URL,
  collections: [Uzantoj, Terminoj],
  typescript: {
    outputFile: path.resolve(__dirname, "../tipoj/payload-tipoj.ts"),
  },
  graphQL: {
    schemaOutputFile: path.resolve(__dirname, "../tipoj/generita-skemo.graphql"),
  },
  cors: process.env.CORS?.split(","),
  csrf: process.env.CORS?.split(",") ?? [],
});
