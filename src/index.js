const parser = require('xml2json');
const debug = require('debug');
const utils = require('./utils');

const log = debug('pint');

// Constants for units
const units = {
  POUNDS: 'lb',
  OUNCES: 'oz',
  GALLONS: 'gal'
};

// Round a number to a specified decimal length
const round = (num, places = 2) => Number(num).toFixed(places);

// In BeerXML files, an AMOUT is metric but DISPLAY_AMOUNT may be anything
const litersToGallons = l => Number(l) * 0.264172;
const kilogramsToPounds = kg => Number(kg) * 2.20462;

// Calculate the scaled amount of an ingredient
const calculateAmount = (ingredient, scaleFn) => {
  log('calculateAmount', ingredient);
  const amountIsWeight = ingredient['AMOUNT_IS_WEIGHT'] !== 'false';
  let amount, unit;
  if (amountIsWeight) {
    amount = scaleFn(kilogramsToPounds(ingredient['AMOUNT']));
    unit = units.POUNDS;
    if (amount < 1) {
      amount = amount * 16;
      unit = units.OUNCES;
    }
  } else {
    amount = scaleFn(ingredient['AMOUNT']); // Example - is it safe to scale lemon peel like a grain?
    unit = 'ea.';
  }
  // Special case for single items with amount 0 (e.g. Whirlfloc Tablet)
  if (parseFloat(amount) === 0) {
    amount = 1;
  }
  log(amount, unit);
  return { amount: round(amount), unit };
};

// Scale and format ingredients
const processIngredients = (ingredients = [], scaleFn) => {
  log('processIngredients', ingredients);
  if (!Array.isArray(ingredients)) {
    ingredients = [ingredients];
  }
  return Array.prototype.map.call(ingredients, (ingredient) => {
    const { amount, unit } = calculateAmount(ingredient, scaleFn);
    const convertedIngredient = {
      name: ingredient['NAME'],
      amount,
      unit,
    };
    if (ingredient['DISPLAY_TIME']) {
      const time = parseFloat(ingredient['DISPLAY_TIME']);
      // Add the correct time unit based on the use case
      let timeUnit = 'min'; // ingredient['USE'].toLowerCase() === 'boil'
      if (['secondary', 'dry hop'].indexOf(ingredient['USE'].toLowerCase()) > -1) {
        timeUnit = (parseFloat(amount) === 1) ? 'day' : 'days';
      }
      convertedIngredient.time = `${time} ${timeUnit}`;
    }
    return convertedIngredient;
  });
};

/**
 * Convert a BeerXML file to the specified batch size
 * @param {String} xmlIn the BeerXML file as a string
 * @param {Number} batchSize the size of the batch in gallons
 * @return {Object} the converted recipe
 */
module.exports = (xmlIn, batchSizeIn) => {
  // Parse the XML file into JSON
  const json = JSON.parse(parser.toJson(xmlIn));
  log('JSON:');
  log(utils.prettyPrintJSON(json));

  // Format a simplified recipe object
  const tmp = json['RECIPES']['RECIPE'];
  const batchSize = batchSizeIn || round(litersToGallons(tmp['BATCH_SIZE']), 1);
  const recipe = {
    data: {
      name: tmp['NAME'],
      size: litersToGallons(tmp['BATCH_SIZE']),
      unit: units.GALLONS,
      style: tmp['STYLE']['NAME'],
    },
    ingredients: {
      fermentables: tmp['FERMENTABLES']['FERMENTABLE'],
      hops: tmp['HOPS']['HOP'],
      yeast: tmp['YEASTS']['YEAST'],
      misc: tmp['MISCS']['MISC']
    }
  };
  log('Recipe:');
  log(utils.prettyPrintJSON(recipe));

  // Scale the recipe to the specified amount
  const scaleFactor = recipe.data.size / batchSize;
  const scale = (value, factor = scaleFactor) => value / factor;
  const process = (type) => processIngredients(recipe.ingredients[type], scale);
  const convertedRecipe = {
    data: {
      name: recipe.data.name,
      size: batchSize,
      unit: units.GALLONS,
      style: recipe.data.style,
    },
    ingredients: {}
  };
  convertedRecipe.ingredients.fermentables = process('fermentables', scale);
  convertedRecipe.ingredients.hops = process('hops', scale);
  convertedRecipe.ingredients.misc = process('misc', scale);
  convertedRecipe.ingredients.yeast = [{
    name: recipe.ingredients.yeast['NAME'],
    brand: recipe.ingredients.yeast['LABORATORY'],
  }];
  log('Converted Recipe:');
  log(utils.prettyPrintJSON(convertedRecipe));

  // Return the converted recipe
  return convertedRecipe
};
