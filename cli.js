#! /usr/bin/env node
require('console.table');
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
let format = process.argv[4] || '';
if (['table', 'json'].indexOf(format) === -1) {
  format = 'table';
}

const convertedRecipe = pint(fileName, batchSize);
const convertedIngredients = convertedRecipe.ingredients;

const outputTable = (recipe) => {
  delete recipe.ingredients;
  console.log(`${recipe.name.toUpperCase()}\n`);
  console.table(recipe);
  Object.keys(convertedIngredients).forEach((type) => {
    console.log(`${type.toUpperCase()}\n`);
    console.table(convertedIngredients[type]);
  });
};

const outputJson = (recipe) => console.log(JSON.stringify(recipe));

if (format === 'table') {
  outputTable(convertedRecipe);
} else if (format === 'json') {
  outputJson(convertedRecipe);
}
