// bite : découpe le pattern en tranches et les réordonne (équivalent de scrub pour les patterns)

$mel: n("0 1 2 3 4 5 6 7").scale("C:minor").s("sawtooth")
  .bite(4, "<[3 2 1 0] [2 [0 3] 1*4 1]>")
  .lpf(1200)

// Tête de lecture pilotée par un signal (non testé : si ça plante, remplacer par "{0 1 2 1 4 5 4 3}%8")
// .bite(8, sine.range(0, 8).segment(8).floor())
