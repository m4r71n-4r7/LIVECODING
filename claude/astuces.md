# Astuces Strudel : synthèse de nos échanges

| Question | Réponse courte |
|---|---|
| Un `scrub` pour les patterns ? | `bite(n, "indices")` |
| Faire évoluer chaque répétition de `ply` ? | `plyWith(n, mul(...))` |
| `speed(2)` ou `mul(speed(1.1))` ? | `speed()` **remplace**, `mul()` **multiplie** (et donc s'accumule) |
| Pourquoi `x => x.` ? | Seulement pour **enchaîner** ou **calculer** ; sinon forme courte |
| `every` ? | Alias de `firstOf` ; `lastOf` pour la fin du groupe |
| Gain dans la mini-notation ? | `s("bd:0:.5")` : son : sample : gain (mettre `0` si pas de choix de sample) |
| `chunk` ou `iter` ? | `iter` fait **tourner** l'ordre ; `chunk` **transforme** une part à la fois |
| Le `0.25 ~>` de Tidal ? | `.late(0.25)` (et `<~` = `.early()`) |
| Séquencer le tempo ? | `.cps("<...>")` sur **une** piste (global) ; `setcpm` n'accepte pas de pattern |
| `all` ? | Ligne à part, sans `$:` ; `each` pour agir piste par piste |

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

---

## 5. Le gain directement dans la mini-notation

Dans `s()`, l'ordre après les `:` est fixe : **son : numéro de sample : gain**.

```js
s("bd:2:.5")            // sample 2 de bd, gain 0.5
s("bd:0:.5 sd hh:0:.3") // sans choix de sample : mettre 0 (le sample par défaut)
```

- `bd:.5` ne marche pas comme on croit : le `.5` est lu comme **numéro de sample**.
- `bd::.5` : non documenté, à tester dans le REPL (risque de silence ou d'erreur). `bd:0:.5` est la syntaxe sûre.

Alternative souvent plus lisible : un pattern de gain à côté.
```js
s("bd sd hh hh").gain("1 .8 .3 .5")
s("hh*8").gain("[1 .4]*4")              // accents réguliers
s("hh*16").gain(perlin.range(.3, .8))    // hi-hats plus vivants
```

---

## 6. `chunk` ou `iter` ?

Les deux coupent le cycle en `n` parts, mais :

**`iter(n)` = rotation.** Toutes les notes jouent, le point de départ avance à chaque cycle.
```js
n("0 1 2 3").scale("C:minor").iter(4)
```
| Cycle | Joue |
|---|---|
| 1 | 0 1 2 3 |
| 2 | 1 2 3 0 |
| 3 | 2 3 0 1 |
| 4 | 3 0 1 2 |

**`chunk(n, fonction)` = projecteur.** L'ordre ne change pas ; une seule part est transformée par cycle, et cette part se déplace.
```js
n("0 1 2 3").chunk(4, add(7)).scale("C:minor")
```
| Cycle | Joue (**modifié**) |
|---|---|
| 1 | **7** 1 2 3 |
| 2 | 0 **8** 2 3 |
| 3 | 0 1 **9** 3 |
| 4 | 0 1 2 **10** |

```js
s("bd hh sd hh").chunk(4, x => x.speed(2))   // un coup aigu qui se déplace
s("hh*8").chunk(4, ply(2))                     // un roulement qui se déplace
```
Versions à l'envers : `iterBack`, `chunkBack`.

---

## 7. Décaler dans le temps (le `~>` de Tidal)

| Tidal | Strudel | Effet |
|---|---|---|
| `0.25 ~> p` | `.late(0.25)` | plus **tard** d'1/4 de cycle |
| `0.25 <~ p` | `.early(0.25)` | plus **tôt** d'1/4 de cycle |

```js
s("bd sd [~ bd] sd").late(0.25)
s("hh*8").late("<0 .125 .25 .375>")      // décalage séquencé

// superposer une copie décalée et transposée
n("0 2 4 7").scale("C:minor").s("sawtooth")
  .superimpose(x => x.late(.125).add(note(12)))

// raccourci : off = superimpose + late
  .off(1/8, add(note(7)))
```

Taper `~` sur clavier français : **PC** AltGr + 2 puis Espace ; **Mac** Option + N puis Espace.

---

## 8. Séquencer le tempo

### Ce qui ne marche pas
`setcpm()` / `setcps()` ne prennent qu'**une valeur fixe** (horloge globale, réglée à l'évaluation). `setcpm("<30 40>")` ne fonctionne pas : c'est un problème connu, toujours ouvert (issue Codeberg #1732).

### Solution 1 : `.cps()` sur un pattern (vrai tempo global)
`cps` est patternable depuis Strudel 1.2.0 (PR #1001). Ça change **l'horloge**, donc **toutes les pistes**, sans à-coups. On ne le met que sur **une seule** piste.

```js
// tempo qui change à chaque cycle : 30, 30, 40, 50 cpm
$kick: s("bd*4").cps("<30 30 40 50>".div(60))
$hats: s("hh*8").gain(.5)

// accélération progressive (exemple de yaxu)
sound("bd*8").cps(saw.range(1, 2)).slow(2)
```
Rappel : cps = cpm / 60, et pour un 4/4 : `cpm = BPM / 4`.

Si ça ne marche pas sur strudel.cc, essayer **warm.strudel.cc** (version de développement) : l'exemple de yaxu a d'abord marché uniquement sur warm.

### Solution 2 : `fast` / `slow` (accélère les patterns, pas l'horloge)
```js
s("bd sd [~ bd] sd, hh*8").fast("<1 1.5 2 1.5>")
s("bd sd [~ bd] sd").fast("<1!3 2>")         // 3 cycles normaux, 1 double
s("bd*4, hh*8").hurry("<1 2>")               // fast + pitch qui monte
```
Attention : `fast` fait lire le pattern plus loin dans sa timeline. Sur une boucle de batterie, aucun souci ; sur une mélodie de plusieurs cycles, un changement de `fast` peut **sauter** à un autre endroit de la phrase.

### Le plus simple en live
Changer la valeur de `setcpm(...)` et réévaluer (Ctrl+Entrée).

---

## 9. `all` et `each` : agir sur toutes les pistes

`all` se met sur **sa propre ligne, sans `$:`** (ce n'est pas une piste), en général tout en bas :

```js
setcpm(30)

$kick: s("bd*4")
$hats: s("hh*8").gain(.5)
$bass: note("c2 eb2 g2 bb1").s("sawtooth").lpf(600)

all(x => x.fast("<1 1 1.5 2>").room(.3))
```

- `all` agit **après** le mélange des pistes (sur le stack final).
- `each` agit sur **chaque piste séparément**, avant le mélange. La différence s'entend surtout avec `jux`, `rev`, `bite`...
- Les pistes mutées (`_$:`) restent muettes.
- Regrouper tout dans **un seul** `all` : dans Tidal, chaque `all` remplace le précédent ; probablement pareil dans Strudel (non vérifié).
- Pour l'enlever : commenter la ligne (`// all(...)`) et réévaluer.

---

Sources : [issue #51, tempo patternable](https://codeberg.org/uzu/strudel/issues/51) · [issue #1732, setcpm](https://codeberg.org/uzu/strudel/issues/1732) · [notes de version Strudel](https://strudel.cc/blog/) · [cps dans Tidal](https://userbase.tidalcycles.org/cps.html)
