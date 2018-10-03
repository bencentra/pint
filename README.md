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

┌─────────┬────────────────┐
│ (index) │     Values     │
├─────────┼────────────────┤
│  name   │ 'Lemon Saison' │
│  size   │      1.1       │
│  unit   │     'gal'      │
│  style  │    'Saison'    │
└─────────┴────────────────┘
FERMENTABLES

┌─────────┬────────────────────┬────────────────────┬──────┐
│ (index) │        name        │       amount       │ unit │
├─────────┼────────────────────┼────────────────────┼──────┤
│    0    │ 'Pilsen Light LME' │ 11.659974589987218 │ 'oz' │
│    1    │ 'Pilsen Light DME' │ 9.459979384329237  │ 'oz' │
│    2    │    'Honey Malt'    │ 3.5199923290527426 │ 'oz' │
└─────────┴────────────────────┴────────────────────┴──────┘
HOPS

┌─────────┬──────────────┬─────────────────────┬──────┐
│ (index) │     name     │       amount        │ unit │
├─────────┼──────────────┼─────────────────────┼──────┤
│    0    │ 'Citra (US)' │ 0.08799993602424484 │ 'oz' │
│    1    │ 'Citra (US)' │ 0.13199990403636722 │ 'oz' │
└─────────┴──────────────┴─────────────────────┴──────┘
YEAST

┌─────────┬─────────────────┐
│ (index) │     Values      │
├─────────┼─────────────────┤
│  name   │ 'French Saison' │
│  brand  │    'Wyeast'     │
└─────────┴─────────────────┘
MISC

┌─────────┬────────────────────┬────────────────────┬──────┐
│ (index) │        name        │       amount       │ unit │
├─────────┼────────────────────┼────────────────────┼──────┤
│    0    │ 'Whirlfloc Tablet' │         0          │ 'oz' │
│    1    │    'Lemon Peel'    │ 10.560002104120969 │ 'oz' │
└─────────┴────────────────────┴────────────────────┴──────┘
```

## TODO

* Handle non-weight units (e.g. "1 Whirlfloc Tablet")
* Output other formats (Markdown?)
