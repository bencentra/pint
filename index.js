const parser = require('xml2json');
const fs = require('fs');
const path = require('path');
const debug = require('debug');
const utils = require('./utils');

const log = debug('pint');

const units = {
  POUNDS: 'lb',
  OUNCES: 'oz',
  GALLONS: 'gal'
};

const litersToGallons = l => Number(l) * 0.264172;
const kilogramsToPounds = kg => Number(kg) * 2.20462;

module.exports = (fileName, batchSize) => {

  const xml = fs.readFileSync(fileName, 'utf8');
  const json = JSON.parse(parser.toJson(xml));
  log('JSON:');
  log(utils.prettyPrintJSON(json));

  const tmp = json['RECIPES']['RECIPE'];
  const recipe = {
    name: tmp['NAME'],
    size: litersToGallons(tmp['BATCH_SIZE']),
    unit: units.GALLONS,
    style: tmp['STYLE']['NAME'],
    ingredients: {
      fermentables: tmp['FERMENTABLES']['FERMENTABLE'],
      hops: tmp['HOPS']['HOP'],
      yeast: tmp['YEASTS']['YEAST'],
      misc: tmp['MISCS']['MISC']
    }
  };
  log('Recipe:');
  log(utils.prettyPrintJSON(recipe));
  const scaleFactor = recipe.size / batchSize;
  const scale = (value, factor = scaleFactor) => value / factor;
  const convertedRecipe = {
    name: recipe.name,
    size: batchSize,
    unit: units.GALLONS,
    style: recipe.style,
    ingredients: {
      fermentables: [],
      hops: [],
      yeast: {},
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

  const processIngredient = (type) => {
    return Array.prototype.map.call(recipe.ingredients[type], (ingredient) => {
      const { amount, unit } = calculateAmount(ingredient);
      const convertedIngredient = {
        name: ingredient['NAME'],
        amount,
        unit
      };
      return convertedIngredient;
    });
  };

  convertedRecipe.ingredients.fermentables = processIngredient('fermentables');
  convertedRecipe.ingredients.hops = processIngredient('hops');
  convertedRecipe.ingredients.misc = processIngredient('misc');
  convertedRecipe.ingredients.yeast = {
    name: recipe.ingredients.yeast['NAME'],
    brand: recipe.ingredients.yeast['LABORATORY']
  };

  log('Converted Recipe:');
  log(utils.prettyPrintJSON(convertedRecipe));

  return convertedRecipe
};
