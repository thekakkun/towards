import server from "./app";

const PORT = 8080;
const HOST = "localhost";

server.listen(PORT, HOST, () => {
  console.log(`Server is running on http://${HOST}:${PORT}`);
});
