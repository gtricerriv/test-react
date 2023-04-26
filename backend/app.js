const express = require('express');
const axios = require('axios');
const cors = require('cors')
const app = express();
const { parseCSV } = require('./parseCSV');

app.use(cors())
// Listar los archivos disponibles
app.get('/files', async (req, res) => {
  try {
    const options = {
      method: 'GET',
      url: 'https://echo-serv.tbxnet.com/v1/secret/files',
      headers: {
        'authorization': 'Bearer aSuperSecretKey'
      }
    };
    const response = await axios(options);
    const files = response.data.files;
    return res.send({ files });
  } catch (error) {
    return res.status(500).send({ error: 'Error al obtener los archivos' });
  }
});

// Descargar un archivo
app.get('/file/:name', async (req, res) => {
  try {
    const name = req.params.name;
    const options = {
      method: 'GET',
      url: `https://echo-serv.tbxnet.com/v1/secret/file/${name}`,
      headers: {
        'authorization': 'Bearer aSuperSecretKey'
      }
    };
    const response = await axios(options);
    const { columns, lines, file } = parseCSV(response.data);
    return res.send({ columns, file, lines });
  } catch (error) {
    res.status(500).send({ error: `Error al descargar el archivo ${req.params.name}, ${error.message} `});
  }
});

app.listen(3000, () => {
  console.log('Servidor iniciado en el puerto 3000');
});


module.exports = {app}