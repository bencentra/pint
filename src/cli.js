#! /usr/bin/env node
const program = require('commander');
const fs = require('fs');
const debug = require('debug');
const pkg = require('../package.json');
const pint = require('./index.js');
const utils = require('./utils');

const log = debug('pint-cli');

// Parse CLI args
let file;
program
  .version(pkg.version)
  .arguments('<file>')
  .action(function(fileIn) {
    file = fileIn;
  })
  .option('-s --size <size>', 'Batch size', parseFloat)
  .option('--json', 'Output as JSON instead of text')
  .parse(process.argv);

// Ensure the file is defined
if (!file) {
  program.help();
}

// Determine running parameters
const batchSize = program.size;
const format = (program.json) ? 'json' : 'tables';

// Convert the recipe
const xml = fs.readFileSync(file, 'utf8');
const convertedRecipe = pint(xml, batchSize);

// Output the recipe as text
const outputTables = (recipe) => {
  const { data, ingredients } = recipe;
  // Print a fancy header
  const len = data.name.length;
  console.log('#'.repeat(len + 6));
  console.log(`## ${data.name.toUpperCase()} ##`);
  console.log('#'.repeat(len + 6));
  // Print the recipe
  console.table([data]);
  Object.keys(ingredients).forEach((type) => {
    if (ingredients[type]) {
      console.log(`${type.toUpperCase()}`);
      console.table(ingredients[type]);
    }
  });
};

// Output the recipe as JSON
const outputJson = (recipe) => console.log(utils.prettyPrintJSON(recipe));

// Output the data
if (format === 'tables') {
  outputTables(convertedRecipe);
} else if (format === 'json') {
  outputJson(convertedRecipe);
}
