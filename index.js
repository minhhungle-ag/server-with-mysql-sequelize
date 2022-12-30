const http = require("http");
const app = require("./app");
const sequelize = require("./utils/database");
const port = process.env.PORT || 3000;
const server = http.createServer(app);

sequelize
  .sync()
  .then((result) => {
    server.listen(port, () => console.log(`connect server at ${port}`));
  })
  .catch((error) => console.log(error));
