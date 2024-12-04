import { reverse, split } from 'ramda'

const fileContent = await Bun.file('./days/day-4/input.txt').text()

function convertStringToGrid(input: string) {
  const lines = split('\n', input)

  const grid = new Map()

  let maxY = 0
  let maxX = 0

  for (let y = 0; y < lines.length; y++) {
    for (let x = 0; x < lines[y].length; x++) {
      maxX = x
      maxY = y
      const letter = lines[y][x]
      if (!letter) continue
      grid.set(`${x}-${y}`, letter)
    }
  }

  return { grid, maxY, maxX }
}

// find all horizontal lines + their reverse
function getHorizontalLines(grid: Map<string, string>, maxY: number, maxX: number) {
  const lines: string[] = []

  for (let y = 0; y <= maxY; y++) {
    let line = ''
    for (let x = 0; x <= maxX; x++) {
      const letter = grid.get(`${x}-${y}`)
      if (!letter) continue
      line += letter
    }
    lines.push(line)
  }

  return [...lines, ...reverse(lines)]
}

function getVerticalLines(grid: Map<string, string>, maxY: number, maxX: number) {
  const lines: string[] = []

  for (let x = 0; x <= maxX; x++) {
    let line = ''
    for (let y = 0; y <= maxY; y++) {
      const letter = grid.get(`${x}-${y}`)
      if (!letter) continue
      line += letter
    }
    lines.push(line)
  }

  return [...lines, ...reverse(lines)]
}

function getDiagonalLinesYInc(grid: Map<string, string>, maxY: number, maxX: number) {
  const lines: string[] = []

  let y = 0

  for (let startingY = 1; startingY <= maxY; startingY++) {
    let line = ''
    for (let x = 0; x <= maxX; x++) {
      const letter = grid.get(`${x}-${y + startingY}`)
      if (!letter) continue
      line += letter

      y++
    }

    lines.push(line)
    y = 0
  }

  return [...lines, ...reverse(lines)]
}

function getDiagonalLinesXInc(grid: Map<string, string>, maxY: number, maxX: number) {
  const lines: string[] = []

  let x = 0

  for (let startingX = 0; startingX <= maxX; startingX++) {
    let line = ''
    for (let y = 0; y <= maxY; y++) {
      const letter = grid.get(`${x + startingX}-${y}`)
      if (!letter) continue
      line += letter

      x++
    }

    lines.push(line)
    x = 0
  }

  return [...lines, ...reverse(lines)]
}

function getDiagonalLinesYDec(grid: Map<string, string>, maxY: number, maxX: number) {
  const lines: string[] = []

  let y = 0

  for (let startingY = 1; startingY <= maxY; startingY++) {
    let line = ''
    for (let x = maxX; x >= 0; x--) {
      const letter = grid.get(`${x}-${y + startingY}`)
      if (!letter) continue
      line += letter

      y++
    }

    lines.push(line)
    y = 0
  }

  return [...lines, ...reverse(lines)]
}
function getDiagonalLinesXDec(grid: Map<string, string>, maxY: number, maxX: number) {
  const lines: string[] = []

  let x = 0

  for (let startingX = maxX; startingX >= 0; startingX--) {
    let line = ''
    for (let y = 0; y <= maxY; y++) {
      const letter = grid.get(`${startingX - x}-${y}`)
      if (!letter) continue
      line += letter

      x++
    }

    lines.push(line)
    x = 0
  }

  return [...lines, ...reverse(lines)]
}

function matchXmas(lines: string[]) {
  const xmasRegex = /xmas/gi

  let total = 0
  for (const line of lines) {
    for (const match of line.matchAll(xmasRegex)) {
      // console.log({ match })
      total++
    }
  }
  return total
}

// --- MAIN LOGIC
const { grid, maxX, maxY } = convertStringToGrid(fileContent)
const horizontalLines = getHorizontalLines(grid, maxY, maxX)
const verticalLines = getVerticalLines(grid, maxY, maxX)
const diagonalLinesXInc = getDiagonalLinesXInc(grid, maxY, maxX)
const diagonalLinesYInc = getDiagonalLinesYInc(grid, maxY, maxX)

const diagonalLinesXDec = getDiagonalLinesXDec(grid, maxY, maxX)
const diagonalLinesYDec = getDiagonalLinesYDec(grid, maxY, maxX)

console.log({
  firstHLine: horizontalLines.at(0)?.length,
  firstVLine: verticalLines.at(0)?.length,
  hLenght: horizontalLines.length,
  vLength: verticalLines.length,
})

const allLines = [
  ...horizontalLines,
  ...verticalLines,
  ...diagonalLinesXInc,
  ...diagonalLinesYInc,
  ...diagonalLinesXDec,
  ...diagonalLinesYDec,
]
const total = matchXmas(allLines)

console.log({ total })
