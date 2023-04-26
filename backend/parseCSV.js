const csv = require('csv-parser');

function parseCSV(content) {
        const data = {
          columns: [],
          lines: [],
          file: '',
        };
        let rows = content.split('\n').map(row => row.split(','));
        data.columns = rows[0];
        data.file = rows[1][0];
        rows.shift();
        rows.shift();
        rows.forEach(row => {
          if (row.length >= 4 && row[1] != '' && row[2] != '' && row[3]) {
            data.lines.push({
              text: row[1],
              number: row[2],
              hex: row[3]
            });
          }
        });
        return data;
}
  module.exports = { parseCSV }