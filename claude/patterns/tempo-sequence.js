// Tempo séquencé : .cps() sur UNE piste change l'horloge de toutes les pistes
// cps = cpm / 60 ; ici 30, 30, 40, 50 cpm (soit 120, 120, 160, 200 BPM en 4/4)
// Si rien ne change sur strudel.cc, essayer warm.strudel.cc

$kick: s("bd*4").cps("<30 30 40 50>".div(60))
$hats: s("[~ hh]*4").gain(.5)
$bass: note("<c2 eb2 g2 bb1>*4").s("sawtooth").lpf(600)

// Alternative sans toucher à l'horloge : accélérer tous les patterns
// all(x => x.fast("<1 1 1.5 2>"))
