import http, { IncomingMessage, ServerResponse } from "http";

const requestListener = function (req: IncomingMessage, res: ServerResponse) {
  res.writeHead(200);
  res.end("My first server!");
};

const server = http.createServer(requestListener);

export default server;
