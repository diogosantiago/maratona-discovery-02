const express = require("express");
const server = express();
const routes = require("./src/routes");
const path = require("path");

server.set('view engine', 'ejs');
server.set('views', path.join(__dirname, 'src/views'));

// habilitar arquivos estaticos
server.use(express.static("public"));

// usar o req.body
server.use(express.urlencoded({ extended: true}));

server.use(routes);

const port = process.env.PORT || 3000;

server.listen(port, () => console.log('rodando'));