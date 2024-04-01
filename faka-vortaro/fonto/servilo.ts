import dotenv from "dotenv";
import next from "next";
import nextBuild from "next/dist/build";
import path from "path";

dotenv.config({
  path: path.resolve(__dirname, "../.env"),
});

import express from "express";
import payload from "payload";

const PORDO = process.env.PORDO || 3000;

const apo = express();

apo.get("/", (_, res) => res.redirect("/admin"));

const ek = async (): Promise<void> => {
  await payload.init({
    secret: process.env.PAYLOAD_SEKRETO || "",
    express: apo,
    onInit: () => {
      payload.logger.info(`URL de Payload-portalo: ${payload.getAdminURL()}`);
    },
  });

  // if (process.env.NEXT_BUILD) {
  //   return void apo.listen(PORDO, async () => {
  //     payload.logger.info(`Next.js konstruiĝas...`);
  //     // @ts-expect-error
  //     await nextBuild(path.join(__dirname, "../"));
  //     process.exit();
  //   });
  // }

  const nextApo = next({
    dev: process.env.NODE_ENV !== "production",
  });

  // const nextHandler = nextApo.getRequestHandler();

  // apo.use((req, res) => nextHandler(req, res));

  // nextApo.prepare().then(() => {
  //   payload.logger.info("Startiganta Next.js...");

  apo.listen(PORDO, async () => {
    payload.logger.info(`URL de Next.js-Apo: ${process.env.PAYLOAD_PUBLIC_SERVER_URL}`);
  });
  // });
};

ek();
