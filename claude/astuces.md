# Astuces Strudel : synthèse de nos échanges

| Question | Réponse courte |
|---|---|
| Un `scrub` pour les patterns ? | `bite(n, "indices")` |
| Faire évoluer chaque répétition de `ply` ? | `plyWith(n, mul(...))` |
| `speed(2)` ou `mul(speed(1.1))` ? | `speed()` **remplace**, `mul()` **multiplie** (et donc s'accumule) |
| Pourquoi `x => x.` ? | Seulement pour **enchaîner** ou **calculer** ; sinon forme courte |
| `every` ? | Alias de `firstOf` ; `lastOf` pour la fin du groupe |

---

## 1. `bite` : découper et réordonner un pattern

`scrub`, `slice` et `splice` découpent un **sample audio**. `bite` découpe **le pattern lui-même** : chaque cycle est coupé en `n` tranches égales, rejouées selon une séquence d'index.

```js
// mélodie coupée en 4 tranches, jouées à l'envers
n("0 1 2 3 4 5 6 7").scale("C:minor").s("sawtooth")
  .bite(4, "3 2 1 0")

// stutters et accélérations : chaque tranche s'adapte à la durée de son pas
  .bite(4, "2 [0 3] 1*4 1")
```

À retenir : avec `scrub`, `"0.25@3"` **tient** une position dans le son ; avec `bite`, `"2@3"` **étire** la tranche 2 sur 3 pas (ça ralentit les notes, pas la hauteur).

Effet « tête de lecture » (non testé) :
```js
.bite(8, sine.range(0, 8).segment(8).floor())
// plan B : .bite(8, "{0 1 2 1 4 5 4 3}%8")
```

**Fonctions voisines**

| Fonction | Effet | Exemple |
|---|---|---|
| `zoom(début, fin)` | joue une portion du cycle, étirée sur tout le cycle | `.zoom(.25, .75)` |
| `linger(fraction)` | boucle le début du cycle (effet buffer) | `.linger("<1 .5 .25>")` |
| `ribbon(offset, cycles)` | boucle une portion qui s'étend sur plusieurs cycles | `.ribbon(1, 2)` |
| `squeeze` / `inhabit` | choisit parmi plusieurs patterns, compressés dans l'événement | `"<a b>".inhabit({a: s("bd(3,8)"), b: s("cp sd")})` |

---

## 2. `plyWith` : répétitions qui évoluent

`ply(n)` répète chaque événement `n` fois. `plyWith(n, fonction)` applique en plus une fonction **à chaque répétition, à partir de la précédente** : l'effet s'accumule.

### Le piège : `speed()` remplace, `mul()` multiplie

```js
.plyWith(3, x => x.speed(2))       // répétitions : 1, 2, 2       (rien ne s'accumule)
.plyWith(3, x => x.mul(speed(1.1))) // répétitions : 1, 1.1, 1.21 (rampe)
```

### Version finale (testée, ça marche)

```js
$kick: s("bd*2 cp casio:2 east*2")
  .speed(1)                                  // valeur de départ
  .plyWith(3, mul(speed(1.1).gain(.8)))      // pitch monte, volume baisse
```

Un seul `mul` peut agir sur plusieurs paramètres : `speed(1.1).gain(.8)` est un seul pattern qui porte les deux valeurs.

### Variantes

```js
.plyWith(4, x => x.add(speed(0.15)))   // montée linéaire : 1, 1.15, 1.3, 1.45
.plyWith(4, x => x.mul(speed(0.9)))    // descente
.plyWith("<3 4 6>", mul(speed(1.1)))  // nombre de répétitions qui change selon le cycle
```

### Ce qui ne fait PAS la même chose

| Essai | Pourquoi ça ne convient pas |
|---|---|
| `.echo(4, 1/16, .8)` | copies **décalées et superposées** (pas une subdivision), volume qui baisse mais pas de pitch |
| `.echoWith(4, 1/16, (p, i) => p.speed(1 + i*.1))` | même principe d'écho, mais donne l'index `i` : utile pour des courbes précises |
| `.ply(4).speed("1 1.1 1.2 1.3")` | le pattern de speed se cale sur le **cycle**, pas sur chaque événement : faux dès que les durées diffèrent (`bd*2` contre `cp`) |

---

## 3. `x => x...` ou forme courte ?

`x => x.quelquechose()` est une fonction JavaScript (« prends le pattern `x`, renvoie-le transformé »). Strudel fournit aussi des **raccourcis** qui sont déjà des fonctions : `rev`, `jux(rev)`, `fast(2)`, `add(7)`, `mul(...)`.

**Une seule transformation → forme courte**
```js
.every(4, jux(rev))
.off(1/8, add(7))
.plyWith(4, mul(speed(1.1).gain(.8)))
```

**Forme longue obligatoire quand on :**
```js
// enchaîne (un point après le raccourci = erreur)
.every(4, x => x.jux(rev).speed(2))   // OK
.every(4, jux(rev).speed(2))          // ERREUR : jux(rev) est une fonction, pas un pattern

// utilise un 2e argument (index)
.echoWith(4, 1/8, (p, i) => p.speed(1 + i*.1))

// calcule en JavaScript
.someCycles(x => x.speed(Math.random() > .5 ? 2 : .5))
```

Règle simple : **s'il y a un point pour enchaîner, il faut `x => x`.**

---

## 4. `every`, `firstOf`, `lastOf`

- `every(4, f)` = `firstOf(4, f)` : applique `f` au **1er** cycle de chaque groupe de 4.
- `lastOf(4, f)` : applique `f` au **dernier** cycle du groupe (pratique pour un fill avant la reprise).

```js
s("bd sd [~ bd] sd, hh*8")
  .lastOf(4, x => x.ply(2).speed(1.5))   // fill sur le 4e cycle
```
