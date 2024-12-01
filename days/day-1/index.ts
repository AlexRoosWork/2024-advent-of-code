import { multiply, reduce, sort, split, sum, zipWith } from 'ramda'

const diff = (a: number, b: number) => a - b
const sortLowestToHighest = sort(diff)

async function getListsFromInputs() {
  const file = Bun.file('./days/day-1/input.txt')

  const contents = await file.text()

  const list1 = []
  const list2 = []

  for (const line of split('\n', contents)) {
    const [first, second] = split('   ', line)
    const firstNum = parseInt(first)
    const secondNum = parseInt(second)

    if (!isNaN(firstNum)) list1.push(firstNum)
    if (!isNaN(secondNum)) list2.push(secondNum)
  }

  return { list1, list2 }
}

const { list1, list2 } = await getListsFromInputs()

const sortedList1 = sortLowestToHighest(list1)
const sortedList2 = sortLowestToHighest(list2)

const deltas = zipWith((l1: number, l2: number) => Math.abs(l1 - l2), sortedList1, sortedList2)

console.log(deltas[deltas.length - 1])

const finalSumPart1 = sum(deltas)

console.log({ finalSumPart1 })

function calculateSimilarityScore(leftList: number[], rightList: number[]) {
  let totalSimilarityScore = 0
  for (const leftNumber of leftList) {
    const occurencesInRightList: number = reduce((acc, curr) => {
      if (curr === leftNumber) ++acc
      return acc
    }, 0)(rightList)
    totalSimilarityScore += leftNumber * occurencesInRightList
  }

  return totalSimilarityScore
}

const finalSumPart2 = calculateSimilarityScore(list1, list2)
console.log({ finalSumPart2 })
