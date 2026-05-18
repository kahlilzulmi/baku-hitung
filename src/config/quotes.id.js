export const winnerQuotes = [
  'Kecepatan luar biasa!',
  'Insting yang tajam!',
  'Pertahankan momentummu!',
  'Kerja bagus, tetap fokus!',
  'Luar biasa! Kamu memimpin!',
  'Otakmu bekerja seperti kalkulator!',
  'Terus gas, jangan beri celah!',
]

export const loserQuotes = [
  'Hampir saja! Tarik napas, coba lagi.',
  'Fokus ke soal berikutnya, kamu pasti bisa!',
  'Setiap putaran membuatmu lebih cepat.',
  'Jangan menyerah, balas di ronde ini!',
  'Kamu lebih kuat dari yang kamu pikir!',
  'Satu putaran ini bukan akhir segalanya!',
  'Ayo bangkit, kamu pasti bisa membalas!',
]

export function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}
