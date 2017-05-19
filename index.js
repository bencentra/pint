#! /usr/bin/env node
const xml2json = require('xml2json');
const fs = require('fs');
const path = require('path');

const litersToGallons = l => l * 0.264172;
const kilogramsToPounds = kg => kg * 2.20462;

const filename = process.argv[2];
const batchSize = Number(process.argv[3]);

const xml = fs.readFileSync(filename, 'utf8');
console.log(xml);
const json = xml2json.toJson(xml);
console.log(json);

const recipe = json['RECIPES']['RECIPE'];
const sizeInGallons = litersToGallons(recipe['BATCH_SIZE']);
console.log(sizeInGallons);

const fermentables = recipe['FERMENTABLES']['FERMENTABLE'];
const convertedFermentables = fermentables.map((f) => {
  return {
    amount: kilogramsToPounds(Number(f['AMOUNT']))
  };
});
console.log(convertedFermentables);
