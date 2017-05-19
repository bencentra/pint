#! /usr/bin/env node
const parser = require('xml2json');
const fs = require('fs');
const path = require('path');

const litersToGallons = l => Number(l) * 0.264172;
const kilogramsToPounds = kg => Number(kg) * 2.20462;

const filename = process.argv[2];
if (!filename) {
  console.error('file name required');
  process.exit(1);
}
const batchSize = Number(process.argv[3]);
if (!batchSize) {
  console.error('batch size required');
  process.exit(1);
}

const xml = fs.readFileSync(filename, 'utf8');
const json = JSON.parse(parser.toJson(xml));

const recipe = json['RECIPES']['RECIPE'];
const convertedRecipe = {
  batchSize,
  ingredients: {}
};

const sizeInGallons = litersToGallons(recipe['BATCH_SIZE']);
const scaleFactor = sizeInGallons / batchSize;
console.log(sizeInGallons, batchSize, scaleFactor);

const fermentables = recipe['FERMENTABLES']['FERMENTABLE'];
const convertedFermentables = fermentables.map((f) => {
  return {
    name: f['NAME'],
    amount: kilogramsToPounds(f['AMOUNT']) / scaleFactor
  };
});
convertedRecipe.ingredients.fermentables = convertedFermentables

const hops = recipe['HOPS']['HOP'];
const convertedHops = hops.map((h) => {
  return {
    name: h['NAME'],
    amount: kilogramsToPounds(h['AMOUNT']) / scaleFactor
  };
});
convertedRecipe.ingredients.hops = convertedHops

console.log(JSON.stringify(convertedRecipe));
