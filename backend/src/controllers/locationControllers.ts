import { IncomingMessage, ServerResponse } from "http";

export const getAllLocations = (req: IncomingMessage, res: ServerResponse) => {
  res.writeHead(200);
};
