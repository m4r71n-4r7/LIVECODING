# Astuces Strudel

## `bite` : l'équivalent de `scrub` pour les patterns
`scrub` et `slice` découpent un sample ; `bite(n, indices)` découpe le pattern lui-même en n tranches et les rejoue dans l'ordre donné.
```js
n("0 1 2 3 4 5 6 7").scale("C:minor").s("sawtooth").bite(4, "3 2 1 0")
```
Voisins : `zoom(début, fin)`, `linger(fraction)`, `ribbon(offset, cycles)`, `squeeze`, `inhabit`.

## `plyWith` : répétitions qui évoluent
La fonction s'applique à chaque répétition à partir de la précédente, donc elle s'accumule.
- `.speed(2)` remplace la valeur : toutes les répétitions sont à 2.
- `.mul(speed(1.1))` multiplie : 1 → 1.1 → 1.21...
```js
.plyWith(4, mul(speed(1.1).gain(.8)))
```
Un seul `mul` peut agir sur plusieurs paramètres : `speed(1.1).gain(.8)`.

## `x => x...` ou forme courte ?
- Une seule transformation : forme courte (`jux(rev)`, `fast(2)`, `add(7)`, `mul(...)`).
- Dès qu'on enchaîne (`.rev().fast(2)`), qu'on utilise un index `(p, i) => ...` ou du JavaScript : `x => x...`.
```js
.every(4, jux(rev))                 // OK
.every(4, x => x.jux(rev).speed(2)) // il faut la forme longue
```
`every` = alias de `firstOf` (1er cycle d'un groupe) ; `lastOf` pour le dernier.
