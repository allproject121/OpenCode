// Tiny test server for the Run button: prints its address like real dev servers do.
const http = require("node:http")
const port = 4321
http
  .createServer((req, res) => res.end("<h1>RUN-NODE-OK</h1>"))
  .listen(port, () => console.log(`Server ready at http://localhost:${port}/`))
