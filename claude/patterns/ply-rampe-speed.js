// Répétitions avec plyWith : chaque répétition monte un peu en pitch et baisse en volume

$kick: s("bd*2 cp casio:2 east*2")
  .speed(1)
  .plyWith(3, mul(speed(1.1).gain(.8)))

// Variantes
// .plyWith(4, x => x.add(speed(0.15)))   // montée linéaire
// .plyWith(4, x => x.mul(speed(0.9)))    // descente
// .plyWith("<3 4 6>", mul(speed(1.1)))  // facteur qui change selon le cycle
