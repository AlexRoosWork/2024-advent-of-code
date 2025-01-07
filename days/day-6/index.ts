import { filter, pipe, slice, split } from 'ramda'
import { join } from 'node:path'

type Direction = 'up' | 'down' | 'left' | 'right'
const fileContent = await Bun.file('./days/day-6/input.txt').text()

const startingMap = pipe(split('\n'), filter(Boolean))(fileContent)
const maxX = startingMap[0].length - 1
const maxY = startingMap.length - 1

function findStartingPosition() {
  for (let lineIndex = 0; lineIndex < startingMap.length; lineIndex++) {
    for (let characterIndex = 0; characterIndex < startingMap[lineIndex].length; characterIndex++) {
      const character = startingMap[lineIndex][characterIndex]
      if (character === '^') {
        console.log({ startingY: lineIndex, startingX: characterIndex })
        return { startingY: lineIndex, startingX: characterIndex }
      }
    }
  }
  return { startingY: 0, startingX: 0 }
}

function moveUntilObstacleOrFinish(
  gameMap: string[],
  currentX: number,
  currentY: number,
  direction: Direction,
) {
  const [nextX, nextY] = moveInDirection(direction, currentX, currentY)

  // mark the field as visited
  const currentLine = gameMap[currentY]
  const updatedLine = visitFieldAt(currentLine, currentX)

  gameMap[currentY] = updatedLine

  if (isWin(nextX, nextY)) return gameMap

  const lookAheadValue = lookAhead(nextX, nextY, gameMap)

  switch (lookAheadValue) {
    case 'free':
      return moveUntilObstacleOrFinish(gameMap, nextX, nextY, direction)
    case 'obstacle':
      const newDirection = turnRight(direction)
      return moveUntilObstacleOrFinish(gameMap, currentX, currentY, newDirection)
  }
}

function isWin(x: number, y: number) {
  if (x > maxX || x < 0) return true
  if (y > maxY || y < 0) return true
  return false
}

function turnRight(direction: Direction) {
  switch (direction) {
    case 'down':
      return 'left'
    case 'up':
      return 'right'
    case 'left':
      return 'up'
    case 'right':
      return 'down'
  }
}

function visitFieldAt(line: string, x: number) {
  return slice(0, x, line) + 'X' + slice(x + 1, line.length, line)
}

function moveInDirection(direction: Direction, x: number, y: number) {
  switch (direction) {
    case 'down':
      return [x, y + 1]
    case 'up':
      return [x, y - 1]
    case 'left':
      return [x - 1, y]
    case 'right':
      return [x + 1, y]
  }
}

function lookAhead(x: number, y: number, gameMap: string[]) {
  const nextFieldValue = gameMap[y][x]

  // obstacle case
  if (nextFieldValue === '#') return 'obstacle'

  return 'free'
}

function countVisitedFields(gameMap: string[]) {
  let total = 0
  for (let lineIndex = 0; lineIndex < gameMap.length; lineIndex++) {
    for (let characterIndex = 0; characterIndex < gameMap[lineIndex].length; characterIndex++) {
      const character = gameMap[lineIndex][characterIndex]
      if (character === 'X') {
        ++total
      }
    }
  }
  return total
}

// main logic part 1
const { startingY, startingX } = findStartingPosition()

const finalGameMap = moveUntilObstacleOrFinish(startingMap, startingX, startingY, 'up')

const finalVisitedFieldCount = countVisitedFields(finalGameMap)

await Bun.write(join('days/day-6', 'final-map.txt'), finalGameMap.join('\n'))

console.log({ finalVisitedFieldCount })
