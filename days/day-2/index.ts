import { split, pipe, map, reduce, filter, all } from 'ramda'

const reportInput = await Bun.file('./days/day-2/input.txt').text()
const reports = pipe(
  split('\n'),
  map((report) => split(' ', report)),
  map(map(parseInt)),
  filter(all((level: number) => !isNaN(level))),
)(reportInput)

const isDiffGreaterThanThree = (num1: number, num2: number) => Math.abs(num1 - num2) > 3
const isSafeReport = (list: number[]) =>
  list.reduce(
    (acc, curr, currIndex, array) => {
      if (currIndex === 0) {
        // determine the direction
        acc.direction = curr < array[currIndex + 1] ? 'increase' : 'decrease'
      }

      if (currIndex + 1 === array.length) return acc

      const diffTooGreat = isDiffGreaterThanThree(curr, array[currIndex + 1])

      if (diffTooGreat) {
        ++acc.numUnsafeLevels
      }

      if (curr === array[currIndex + 1]) {
        ++acc.numUnsafeLevels
      }

      if (acc.direction === 'increase' && curr > array[currIndex + 1]) {
        ++acc.numUnsafeLevels
      }

      if (acc.direction === 'decrease' && curr < array[currIndex + 1]) {
        ++acc.numUnsafeLevels
      }

      if (acc.numUnsafeLevels > 1) {
        acc.pass = false
      }

      return acc
    },
    { direction: 'increase', pass: true, numUnsafeLevels: 0 },
  )

const totalSafeReports = reduce((acc: number[][], report: number[]) => {
  const { pass } = isSafeReport(report)
  if (pass === true) acc.push(report)

  return acc
}, [])(reports)

console.log({ totalSafeReports: totalSafeReports.length })
await Bun.write('./days/day-2/output.txt', JSON.stringify(totalSafeReports, null, 4))
