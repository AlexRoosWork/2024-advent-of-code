import { map, reverse, split } from 'ramda'

const fileContent = await Bun.file('./days/day-4/input.txt').text()
// const fileContent = await Bun.file('./days/day-4/trial-input.txt').text()
const lines = split('\n', fileContent).filter(Boolean)

const reverseLines = map((line: string) => reverse(line))

const horizontalLines = lines

const getVerticalLines = (lines: string[]) => {
  const verticalLines = []
  for (let x = 0; x < lines[0].length; x++) {
    let verticalLine = ''
    for (let y = 0; y < lines.length; y++) {
      const letter = lines[y][x]
      verticalLine += letter
    }
    verticalLines.push(verticalLine)
  }
  return verticalLines
}

const walkDiagonalWithY = (lines: string[], startY: number) => {
  let diagonal = ''
  let currentY = startY
  let currentX = 0
  while (currentY >= 0) {
    const letter = lines.at(currentY)?.at(currentX)
    if (letter) diagonal += letter
    currentY--
    currentX++
  }
  return diagonal
}

const walkDiagonalWithX = (lines: string[], startY: number) => {
  let diagonal = ''
  let currentX = 0
  let currentY = startY
  while (currentY <= lines.length) {
    const letter = lines
      .at(currentY < 0 || currentY >= lines.length ? lines.length : currentY)
      ?.at(currentX)
    if (letter) diagonal += letter
    currentY++
    currentX++
  }
  return diagonal
}

const getDiagonalLines = (lines: string[]) => {
  const diagonalLines = []
  // starting point loop
  for (let y = 0; y < lines.length * 2; y++) {
    const line = walkDiagonalWithY(lines, y)
    if (!!line.length) diagonalLines.push(line)
  }

  for (let y = -lines.length; y < lines.length; y++) {
    const line = walkDiagonalWithX(lines, y)
    if (!!line.length) diagonalLines.push(line)
  }

  return diagonalLines
}

const allLinesForward = [
  ...horizontalLines,
  ...getVerticalLines(lines),
  ...getDiagonalLines(lines),
].filter(Boolean)
const allLines = [...allLinesForward, ...reverseLines(allLinesForward)]

// await Bun.write('./days/day-4/output.txt', JSON.stringify(allLines, null, 4))

function matchXmas(lines: string[]) {
  const xmasRegex = /xmas/gi

  let total = 0
  for (const line of lines) {
    for (const _ of line.matchAll(xmasRegex)) {
      total++
    }
  }
  return total
}

const total = matchXmas(allLines)

console.log({ total })
