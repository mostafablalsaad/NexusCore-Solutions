const { Parser } = require('json2csv');

const exportToCSV = (data, fields) => {
  try {
    const json2csvParser = new Parser({ fields });
    const csv = json2csvParser.parse(data);
    return csv;
  } catch (error) {
    console.error('CSV Export Error:', error);
    throw error;
  }
};

module.exports = { exportToCSV };
