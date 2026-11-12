# Dossier Claude

Fichiers créés avec Claude pendant le travail sur Strudel (https://strudel.cc/).

| Fichier | Contenu |
|---|---|
| [`astuces.md`](astuces.md) | **Synthèse de nos échanges** : `bite`, `plyWith` + `mul`, forme courte vs `x => x`, `every`/`lastOf`, gain en mini-notation, `chunk` vs `iter`, `late`/`early`, tempo (`.cps`, `setcpm`, `fast`), `all`/`each` |
| [`aide-memoire.md`](aide-memoire.md) | Référence condensée de toutes les fonctions Strudel par famille |
| [`patterns/`](patterns/) | Patterns prêts à coller dans le REPL (un fichier par idée) |

## Patterns
- [`ply-rampe-speed.js`](patterns/ply-rampe-speed.js) : répétitions qui montent en pitch et baissent en volume
- [`bite-scrub.js`](patterns/bite-scrub.js) : mélodie découpée et réordonnée avec `bite`
- [`tempo-sequence.js`](patterns/tempo-sequence.js) : tempo global qui change à chaque cycle avec `.cps()`
