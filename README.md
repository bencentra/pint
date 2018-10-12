# pint

Convert [BeerXML](http://www.beerxml.com/) recipes to different batch sizes. Conveniently scale recipes up or down!

I download BeerXML files from [Brewtoad](https://www.brewtoad.com/) recipes.

## Usage

```
$ pint -h
Usage: pint [options] <file>

Options:

  -V, --version     output the version number
  -s --size <size>  Batch size
  --json            Output as JSON instead of text
  -h, --help        output usage information
```

## Example

```
$ pint examples/lemon-saison-1.xml -s 1.1
##################
## LEMON SAISON ##
##################
┌─────────┬────────────────┬──────┬───────┬──────────┐
│ (index) │      name      │ size │ unit  │  style   │
├─────────┼────────────────┼──────┼───────┼──────────┤
│    0    │ 'Lemon Saison' │ 1.1  │ 'gal' │ 'Saison' │
└─────────┴────────────────┴──────┴───────┴──────────┘
FERMENTABLES
┌─────────┬────────────────────┬─────────┬──────┐
│ (index) │        name        │ amount  │ unit │
├─────────┼────────────────────┼─────────┼──────┤
│    0    │ 'Pilsen Light LME' │ '11.66' │ 'oz' │
│    1    │ 'Pilsen Light DME' │ '9.46'  │ 'oz' │
│    2    │    'Honey Malt'    │ '3.52'  │ 'oz' │
└─────────┴────────────────────┴─────────┴──────┘
HOPS
┌─────────┬──────────────┬────────┬──────┬────────────┐
│ (index) │     name     │ amount │ unit │    time    │
├─────────┼──────────────┼────────┼──────┼────────────┤
│    0    │ 'Citra (US)' │ '0.09' │ 'oz' │ '60.0 min' │
│    1    │ 'Citra (US)' │ '0.13' │ 'oz' │ '1.0 min'  │
└─────────┴──────────────┴────────┴──────┴────────────┘
MISC
┌─────────┬────────────────────┬────────┬───────┬───────┐
│ (index) │        name        │ amount │ unit  │ time  │
├─────────┼────────────────────┼────────┼───────┼───────┤
│    0    │ 'Whirlfloc Tablet' │ '0.00' │ 'ea.' │ '5.0' │
│    1    │    'Lemon Peel'    │ '3.00' │ 'ea.' │ '5.0' │
└─────────┴────────────────────┴────────┴───────┴───────┘
YEAST
┌─────────┬─────────────────┬──────────┐
│ (index) │      name       │  brand   │
├─────────┼─────────────────┼──────────┤
│    0    │ 'French Saison' │ 'Wyeast' │
└─────────┴─────────────────┴──────────┘
```

## TODO

* Better output than console.table()
* Can a recipe be measured in kilograms?
* Output other formats (Markdown?)
