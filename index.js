const express = require('express')
const app = express()
const path = require('path')
const nocache = require('nocache')

app.use(nocache());
app.use('/', express.static(path.join(__dirname, "public")));
app.use('/build/', express.static(path.join(__dirname, 'node_modules/three/build')));
app.use('/jsm/', express.static(path.join(__dirname, 'node_modules/three/examples/jsm')));

app.listen(3000, () =>
  {}
);