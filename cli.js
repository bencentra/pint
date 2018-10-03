#! /usr/bin/env node
const program = require('commander');
const debug = require('debug');
const pkg = require('./package.json');
const pint = require('./index.js');
const utils = require('./utils');

const log = debug('pint-cli');

program
  .version(pkg.version)
  .option('-s --size <size>', 'Batch size', parseFloat)
  .option('-f --file <file>', 'Path to input BeerXML file')
  .option('--json', 'Output as JSON instead of text')
  .parse(process.argv);

const batchSize = program.size;
const fileName = program.file;
const format = (program.json) ? 'json' : 'table';

const convertedRecipe = pint(fileName, batchSize);
const convertedIngredients = convertedRecipe.ingredients;

const outputTable = (recipe) => {
  // Print a fancy header
  const len = recipe.name.length;
  console.log('#'.repeat(len + 6));
  console.log(`## ${recipe.name.toUpperCase()} ##`);
  console.log('#'.repeat(len + 6));
  // Print the recipe
  delete recipe.ingredients;
  console.table(recipe);
  Object.keys(convertedIngredients).forEach((type) => {
    console.log(`${type.toUpperCase()}\n`);
    console.table(convertedIngredients[type]);
  });
};

const outputJson = (recipe) => console.log(utils.prettyPrintJSON(recipe));

if (format === 'table') {
  outputTable(convertedRecipe);
} else if (format === 'json') {
  outputJson(convertedRecipe);
}
