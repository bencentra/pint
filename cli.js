#! /usr/bin/env node
const pint = require('./index.js');

const fileName = process.argv[2];
if (!fileName) {
  console.error('file name required');
  process.exit(1);
}
const batchSize = Number(process.argv[3]);
if (!batchSize) {
  console.error('batch size required');
  process.exit(1);
}

console.log(JSON.stringify(pint(fileName, batchSize)));
