const fileContent = await Bun.file('./days/day-3/input.txt').text()

const multiplicationRegex = /(don\'t)|(do)|(mul\((\d{1,3}),(\d{1,3})\))/g

let total = 0
let enabled = true

for (const match of fileContent.matchAll(multiplicationRegex)) {
  const [fullMatch, _, __, ___, first, second] = match

  if (fullMatch === "don't") enabled = false
  if (fullMatch === 'do') enabled = true

  const firstInt = parseInt(first)
  const secondInt = parseInt(second)

  if (isNaN(firstInt) || isNaN(secondInt)) continue

  const multiplicationResult = firstInt * secondInt

  if (enabled) total += multiplicationResult
}

console.log({ total })
