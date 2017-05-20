#! /usr/bin/env node
// https://www.brewtoad.com/recipes/andys-wheat-peach

const parser = require('xml2json');
const fs = require('fs');
const path = require('path');

const units = {
  POUNDS: 'lb',
  OUNCES: 'oz',
  GALLONS: 'gal'
};

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

const tmp = json['RECIPES']['RECIPE'];
const recipe = {
  size: litersToGallons(tmp['BATCH_SIZE']),
  unit: units.GALLONS,
  style: tmp['STYLE'],
  ingredients: {
    fermentables: tmp['FERMENTABLES']['FERMENTABLE'],
    hops: tmp['HOPS']['HOP'],
    yeast: tmp['YEASTS']['YEAST'],
    misc: tmp['MISCS']['MISC']
  }
};
const scaleFactor = recipe.size / batchSize;
const scale = (value, factor = scaleFactor) => value / factor;
const convertedRecipe = {
  size: batchSize,
  unit: units.GALLONS,
  style: {},
  ingredients: {
    fermentables: [],
    hops: [],
    yeast: [],
    misc: []
  }
};

const calculateAmount = (ingredient) => {
  const notKg = ingredient['AMOUNT_IS_WEIGHT'] === 'false';
  let amount, unit = units.POUNDS;
  if (notKg) {
    amount = scale(Number(ingredient['AMOUNT']));
  } else {
    amount = scale(kilogramsToPounds(ingredient['AMOUNT']));
  }
  if (amount < 1) {
    amount = amount * 16;
    unit = units.OUNCES;
  }
  return { amount, unit };
};

Object.keys(recipe.ingredients).forEach((type) => {
  // Dunno why recipe.ingredients[type].forEach isn't working...
  Array.prototype.forEach.call(recipe.ingredients[type], (ingredient) => {
    const { amount, unit } = calculateAmount(ingredient);
    const convertedIngredient = {
      name: ingredient['NAME'],
      amount,
      unit
    };
    convertedRecipe.ingredients[type].push(convertedIngredient);
  });
});

console.log(JSON.stringify(convertedRecipe));
