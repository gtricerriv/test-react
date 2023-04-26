const chai = require('chai');
const chaiHttp = require('chai-http');
const sinon = require('sinon');
const axios = require('axios');
const fs = require('fs');
const test6 = fs.readFileSync('./test6.csv', 'utf8');
const { parseCSV } = require('./parseCSV');

chai.use(chaiHttp);

const {app} = require('./app.js');

// Definimos las pruebas unitarias para la ruta /files
describe('GET /files', () => {
  it('should return a list of files', async () => {
    const axiosStub = sinon.stub(axios, 'request').resolves({
      data: {
        files: [
            "test1.csv",
            "test2.csv",
            "test3.csv",
            "test18.csv",
            "test4.csv",
            "test5.csv",
            "test6.csv",
            "test9.csv",
            "test15.csv"
        ]
      }
    });

    const response = await chai.request(app).get('/files');

    chai.expect(response).to.have.status(200);
    
    chai.expect(response.body).to.deep.equal({ files: [
        "test1.csv",
        "test2.csv",
        "test3.csv",
        "test18.csv",
        "test4.csv",
        "test5.csv",
        "test6.csv",
        "test9.csv",
        "test15.csv",
    ] });

    axiosStub.restore();
  });
});

// Definimos las pruebas unitarias para la ruta /file/:name
describe('GET /file/:name', () => {

     
  it('should return the parsed CSV file', async () => {

    const axiosStub = sinon.stub(axios, 'request').resolves({
      data: 'file,text,number,hex \n test2.csv,napMFEltjoHzxDBFYdySgcLhkj,1,8a6582efbcedf9a32873a0d5166d8e19'
    });

    const response = await chai.request(app).get('/file/test2.csv');

    chai.expect(response).to.have.status(200);
    const { file, lines } = response.body
    chai.expect(response.body).to.deep.equal({
      columns: ['file', 'text', 'number', 'hex'],
      file: file,
      lines: [
        {
            text: lines[0].text,
            number: lines[0].number,
            hex: lines[0].hex
        }
      ]
    });

    axiosStub.restore();
  });

  it('should return an error message', async () => {
    const axiosStub = sinon.stub(axios, 'request').throws(new Error('Error al descargar el archivo test4.csv, File error'));

    const response = await chai.request(app).get('/file/test4.csv');

    chai.expect(response).to.have.status(500);
    chai.expect(response.body).to.deep.equal({ error: `Error al descargar el archivo test4.csv, Request failed with status code 500 `});

    axiosStub.restore();
  });
});

// Definimos las pruebas unitarias para la función parseCSV
describe('parseCSV', () => {
  it('should return the parsed CSV data', () => {
    
    const { columns, file, lines } = parseCSV(test6);
    const response_test = [
        {
            text: "QEYYpXLsfJtyqfwLVPlEcLNPqxEAx",
            number: "466o",
            hex: "ec4ff6d5d030056e994b7d8d9cfadd48"
        },
        {
            text: "qVxjFFEQBxgWJLDerRJhhpbd",
            number: "161208321o",
            hex: "a3a7c77288502a4f7086f1a1b1207e44",
        },
        {
            text: "GRusoOa",
            number: "146o",
            hex: "2168d5631fc41625fe0654566229f9e4"
        }
    ]

    chai.expect(columns).to.deep.equal(['file', 'text', 'number', 'hex']);
    chai.expect(file).to.equal('test6.csv');
    chai.expect(lines).to.deep.equal(response_test);
  });

});