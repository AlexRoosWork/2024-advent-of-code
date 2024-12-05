// written by C. Schipper
async function getLinesFromData() {
  const data = await Bun.file('./days/day-4/input.txt').text()
  return data.split('\n')
}

function walkPattern(lines: string[], positionY: number, positionX: number) {
  const letter1 = lines.at(positionY)?.at(positionX)
  const letter2 = lines.at(positionY + 1)?.at(positionX + 1)
  const letter3 = lines.at(positionY + 2)?.at(positionX + 2)
  const letter4 = lines.at(positionY)?.at(positionX + 2)
  const letter6 = lines.at(positionY + 2)?.at(positionX)

  if (!letter1 || !letter2 || !letter3 || !letter4 || !letter6) return false

  if (
    (letter1 + letter2 + letter3 === 'MAS' && letter4 + letter2 + letter6 === 'SAM') ||
    (letter1 + letter2 + letter3 === 'SAM' && letter4 + letter2 + letter6 === 'SAM') ||
    (letter1 + letter2 + letter3 === 'MAS' && letter4 + letter2 + letter6 === 'MAS') ||
    (letter1 + letter2 + letter3 === 'SAM' && letter4 + letter2 + letter6 === 'MAS')
  ) {
    return true
  }
  return false
}

const walkDiagonal = (lines: string[], startY: number) => {
  let count = 0
  let currentY = startY
  let currentX = 0
  while (currentY < lines.length && currentX < lines.length) {
    if (currentY >= 0) {
      if (walkPattern(lines, currentY, currentX)) {
        count++
      }
    }
    currentY++
    currentX++
  }
  return count
}

const getPatternCount = (lines: string[]) => {
  let patternCount = 0
  for (let y = -lines.length; y < lines.length; y++) {
    patternCount += walkDiagonal(lines, y)
  }
  return patternCount
}

async function countPatternMAS() {
  const lines = await getLinesFromData()
  const patternCount = getPatternCount(lines)
  console.log(patternCount)
}

countPatternMAS()
