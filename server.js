// const { createServer } = require("https");
// const { parse } = require("url");
// const next = require("next");

// const fs = require("fs");

// const dev = process.env.NODE_ENV !== "production";
// const app = next({ dev: false });
// const handle = app.getRequestHandler();

// const port = process.env.port || 443;

// app.prepare().then(() => {
//   const options = {
//     key: fs.readFileSync("anselmo.local.key").toString(),
//     cert: fs.readFileSync("anselmo.local.crt").toString(),
//   };

//   createServer(options, (req, res) => {
//     const parseUrl = parse(req.url, true);
//     const { pathname, query } = parseUrl;

//     if (pathname === "/a") {
//       app.render(req, res, "/a", query);
//     } else if (pathname === "/b") {
//       app.render(req, res, "/b", query);
//     } else {
//       handle(req, res, parseUrl);
//     }
//   }).listen(port, (err) => {
//     if (err) throw err;
//     console.log("listos en el puerto", port);
//   });
// });

const express = require("express");
const path = require("path");

const app = express();
const port = process.env.PORT || 3000; // Puedes especificar el puerto que desees

// Configurar Express para servir archivos estáticos desde la carpeta "out"
app.use(express.static(path.join(__dirname, "out")));

// Ruta para manejar todas las solicitudes GET
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "out", "index.html"));
});

app.listen(port, () => {
  console.log(`La aplicación está escuchando en el puerto ${port}`);
});

// remote without https

/*
const { createServer } = require("http");
const { parse } = require("url");
const next = require("next");

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev: false });
const handle = app.getRequestHandler();

const port = process.env.port || 80;

app.prepare().then(() => {
  createServer((req, res) => {
    const parseUrl = parse(req.url, true);
    const { pathname, query } = parseUrl;

    if (pathname === "/a") {
      app.render(req, res, "/a", query);
    } else if (pathname === "/b") {
      app.render(req, res, "/b", query);
    } else {
      handle(req, res, parseUrl);
    }
  }).listen(port, err => {
    if(err) throw err
    console.log("listos en el puerto", port)
  });
});
*/
