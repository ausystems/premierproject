import { Writable } from "node:stream";
import { renderToPipeableStream } from "react-dom/server";
import { StaticRouter } from "react-router-dom/server";
import { AppRoutes } from "./App";

/**
 * Build-time renderer used by scripts/postbuild.mjs: one route to an HTML string, after every lazy page
 * on it has resolved, so each pre-rendered shell carries the complete page.
 */
export const render = (url: string): Promise<string> =>
  new Promise((resolve, reject) => {
    let html = "";
    const sink = new Writable({
      write(chunk, _encoding, done) {
        html += chunk.toString();
        done();
      },
    });
    sink.on("finish", () => resolve(html));
    const stream = renderToPipeableStream(
      <StaticRouter location={url}>
        <AppRoutes />
      </StaticRouter>,
      {
        onAllReady: () => stream.pipe(sink),
        onShellError: reject,
        onError: (error) => reject(error),
      }
    );
  });
