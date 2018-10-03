# pint

Convert [BeerXML](http://www.beerxml.com/) recipes to different batch sizes. Conveniently scale recipes up or down!

## Usage

```
$ pint -h
Usage: pint [options]

Options:

  -V, --version     output the version number
  -s --size <size>  Batch size
  -f --file <file>  Path to input BeerXML file
  --json            Output as JSON instead of text
  -h, --help        output usage information
```

## Example

```
$ pint -s 1.1 -f lemon-saison-1.xml
##################
## LEMON SAISON ##
##################
┌─────────┬────────────────┬──────┬───────┬──────────┐
│ (index) │      name      │ size │ unit  │  style   │
├─────────┼────────────────┼──────┼───────┼──────────┤
│    0    │ 'Lemon Saison' │ 1.1  │ 'gal' │ 'Saison' │
└─────────┴────────────────┴──────┴───────┴──────────┘
FERMENTABLES
┌─────────┬────────────────────┬────────────────────┬──────┐
│ (index) │        name        │       amount       │ unit │
├─────────┼────────────────────┼────────────────────┼──────┤
│    0    │ 'Pilsen Light LME' │ 5.288881798217933  │ 'oz' │
│    1    │ 'Pilsen Light DME' │  4.29097957213907  │ 'oz' │
│    2    │    'Honey Malt'    │ 1.5966435617261672 │ 'oz' │
└─────────┴────────────────────┴────────────────────┴──────┘
HOPS
┌─────────┬──────────────┬─────────────────────┬──────┬────────────┐
│ (index) │     name     │       amount        │ unit │    time    │
├─────────┼──────────────┼─────────────────────┼──────┼────────────┤
│    0    │ 'Citra (US)' │ 0.03991614701138738 │ 'oz' │ '60.0 min' │
│    1    │ 'Citra (US)' │ 0.05987422051708105 │ 'oz' │ '1.0 min'  │
└─────────┴──────────────┴─────────────────────┴──────┴────────────┘
YEAST
┌─────────┬─────────────────┬──────────┐
│ (index) │      name       │  brand   │
├─────────┼─────────────────┼──────────┤
│    0    │ 'French Saison' │ 'Wyeast' │
└─────────┴─────────────────┴──────────┘
MISC
┌─────────┬────────────────────┬────────────────────┬───────┬───────┐
│ (index) │        name        │       amount       │ unit  │ time  │
├─────────┼────────────────────┼────────────────────┼───────┼───────┤
│    0    │ 'Whirlfloc Tablet' │         0          │ 'ea.' │ '5.0' │
│    1    │    'Lemon Peel'    │ 0.6600001315075605 │ 'ea.' │ '5.0' │
└─────────┴────────────────────┴────────────────────┴───────┴───────┘
```

## TODO

* No input size uses recipe's provided size
* Better output than console.table()
* Smarter default units (e.g. "Lemon Peel" is actually .66 oz)
* Can a recipe be measured in kilograms?
* Output other formats (Markdown?)
