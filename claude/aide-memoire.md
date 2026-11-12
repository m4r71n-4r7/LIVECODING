# Strudel : aide-mémoire (référence de travail)

Sources : https://strudel.cc/workshop/getting-started/ et la référence sur https://strudel.cc/ (consultées le 11/11/2026).
Strudel = portage JavaScript du langage de patterns TidalCycles, dans le navigateur (REPL sur strudel.cc).

## REPL : bases
- Évaluer : Ctrl+Entrée ; stopper : Ctrl+. (raccourcis usuels du REPL)
- Tempo : `setcpm(n)` (cycles/minute, valeur fixe, pas de pattern) ; `cpm = BPM / 4` en 4/4
- Tempo séquencé (global) : `.cps("<30 40>".div(60))` sur une seule piste ; sinon `fast("<1 2>")`
- `all(x => x...)` (ligne à part, sans `$:`) : transforme toutes les pistes ; `each` : piste par piste
- Plusieurs pistes en parallèle : `$: ...` sur chaque ligne ; `_$:` pour muter une piste
- Visuels : `.pianoroll()`, `.punchcard()`, `.color("red")`

## Mini-notation (entre guillemets doubles)
| Syntaxe | Rôle | Exemple |
|---|---|---|
| espace | séquence dans un cycle | `s("bd sd hh cp")` |
| `:x` | numéro de sample | `s("hh:0 hh:1")` |
| `:x:g` | numéro de sample + gain | `s("bd:0:.5")` |
| `~` ou `-` | silence | `s("bd ~ sd ~")` |
| `[]` | sous-séquence | `s("bd [sd sd] hh")` |
| `*n` / `/n` | accélérer / ralentir | `s("hh*8")`, `note("[c e g]/2")` |
| `<>` | alterne un élément par cycle | `note("c <e g>")` |
| `,` | parallèle / accord | `note("[c3,e3,g3]")` |
| `@n` | poids (durée relative) | `note("c@3 e")` |
| `!n` | répétition sans accélérer | `note("c!3 e")` |
| `_` | prolonge l'événement précédent | `note("c _ e g")` |
| `?` / `?0.3` | suppression aléatoire | `s("hh*16?0.3")` |
| `\|` | choix aléatoire | `s("bd \| cp")` |
| `(p,s,o)` | rythme euclidien | `s("bd(3,8,2)")` |

Backticks pour du multi-ligne, guillemets simples pour une chaîne non parsée.

## Sons
- `s()` / `sound()` : samples ou synthés. `bank("RolandTR909")`, `n("0 1 2")` pour l'index.
- Abréviations batterie : bd sd hh oh cp rim cr rd ht mt lt sh cb tb perc ; aussi misc, fx, instruments VCSL (piano...). Liste dans l'onglet *sounds*.
- `samples('github:tidalcycles/dirt-samples')` pour charger une banque externe.
- Lecture de samples : `begin`, `end`, `loop`, `speed` (négatif = à l'envers), `chop(n)`, `slice(n, "0 1 2")`, `splice(n, ...)`, `striate(n)`, `fit()`, `loopAt(n)`, `scrub("0.5:2")`, `clip`/`legato`.
- Synthés : `sine sawtooth square triangle` ; bruits `white pink brown crackle`, `.noise(x)` ; additif `s("user").partials([...])` ; vibrato `vib("4:12")`, `vibmod` ; FM `fm`, `fmh`, `fmattack`, `fmdecay`, `fmsustain`, `fmenv` ; wavetable `s("wt_...")` avec `loopBegin/loopEnd` (AKWF via `samples('bubo:waveforms')`) ; ZZFX `z_sawtooth z_sine z_square z_tan z_noise`.

## Notes et harmonie
- `note("c e g")` ou nombres MIDI ; `n("0 2 4").scale("C:minor")` (octave 3 par défaut)
- `transpose(st)`, `scaleTranspose(deg)`, `add(...)` / `sub(...)` / `mul(...)`
- Accords : `chord("<C Am F G>").voicing()` ; options `dict('ireal')`, `anchor`, `mode("root:g2")`, `offset` ; `n("0 1 2 3").chord(...).voicing()` pour arpéger ; `rootNotes(2)` pour la basse
- `arp("0 [0,2] 1")` sur des accords empilés

## Effets
- Filtres : `lpf/cutoff`, `lpq/resonance`, `hpf`, `hpq`, `bpf`, `bpq`, `ftype("ladder")`, `vowel("a")`
- Enveloppe filtre : `lpa lpd lps lpr lpenv` (idem hp/bp)
- ADSR : `attack decay sustain release` ou `.adsr(".1:.1:.5:.2")`
- Enveloppe de pitch : `pattack pdecay prelease penv pcurve panchor`
- Dynamique : `gain`, `velocity`, `postgain`, `compressor("-20:20:10:.002:.02")`, `xfade`
- Stéréo : `pan`, `jux(fn)`, `juxBy(.5, fn)`
- Distorsion : `coarse`, `crush`, `distort("3:.5:diode")`
- Trémolo : `tremolo`, `tremsync`, `tremdepth`, `tremshape`...
- Globaux (par `orbit`) : `delay`, `delaytime`, `delayfeedback`, `room`, `roomsize`, `roomfade`, `roomlp`, `ir(...)`, `phaser`, `phaserdepth` ; sidechain : `duckorbit(2)`, `duckattack`, `duckdepth`

## Signaux continus (0..1, version `2` = -1..1)
`sine cosine saw tri square rand perlin`, `irand(n)`, `brand`, `brandBy(p)`, `mousex/mousey`, `signal(t=>...)`
-> `.range(min,max)`, `.segment(n)`, `.slow(n)`. Ex : `s("hh*16").lpf(sine.range(300,4000).slow(4))`

## Temps
`late(t)` = `t ~>` de Tidal, `early(t)` = `<~`. `iter` fait tourner l'ordre ; `chunk(n, f)` transforme une part par cycle.

`fast slow hurry early late rev palindrome iter iterBack ply plyWith segment compress zoom linger fastGap inside outside ribbon bite swing swingBy euclid euclidRot euclidLegato`

## Construction de patterns
`cat` (1 élément/cycle), `seq` (tout dans un cycle), `stack`, `stepcat([3,"e3"],[1,"g3"])`, `arrange([4,patA],[2,patB])`, `polymeter`, `run(n)`, `binary(n)`, `silence`

## Aléatoire
`choose`, `wchoose`, `chooseCycles`, `degradeBy(p)`, `degrade`, `sometimesBy(p, fn)`, `sometimes`, `often` (75 %), `rarely` (25 %), `almostNever`, `almostAlways`, `someCyclesBy`

## Conditionnel
`firstOf(n, fn)` (alias `every`), `lastOf(n, fn)`, `when(bin, fn)`, `chunk(n, fn)`, `chunkBack`, `struct("x ~ x x")`, `mask("1 0")`, `reset`, `restart`, `pick`, `pickF`, `inhabit`, `squeeze`

## Accumulation
`superimpose(fn)`, `layer(fn)`, `off(1/8, fn)`, `echo(n, t, fb)`, `echoWith(n, t, (p,i)=>...)`

## Pages de référence utiles
- Workshop : first-sounds, first-notes, first-effects, pattern-effects, recap (https://strudel.cc/workshop/...)
- https://strudel.cc/learn/mini-notation/ · /learn/samples/ · /learn/synths/ · /learn/effects/ · /learn/signals/ · /learn/time-modifiers/ · /learn/tonal/ · /learn/random-modifiers/ · /learn/conditional-modifiers/ · /learn/accumulation/ · /learn/factories/ · /learn/lfo/ · /learn/stepwise/ · /learn/input-output/ (MIDI/OSC) · /learn/hydra/ (visuels)
