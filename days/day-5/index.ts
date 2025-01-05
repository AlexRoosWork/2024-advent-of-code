import { includes, move, split, splitWhen } from 'ramda'

const fileContent = await Bun.file('./days/day-5/input.txt').text()
// const fileContent = await Bun.file('./days/day-4/trial-input.txt').text()
const lines = split('\n', fileContent).filter(Boolean)

const [rules, printOrder] = splitWhen(includes(','), lines)

function getCorrectAndIncorrectOrderings() {
  const allCorrectOrders = []
  const allIncorrectOrders = []

  for (const pageOrder of printOrder) {
    const pages = split(',', pageOrder)

    let isValidOrdering = true
    for (let i = 0; i < pages.length; i++) {
      const currentPageNumber = pages.at(i)
      for (let orderingCounter = i + 1; orderingCounter < pages.length; orderingCounter++) {
        const comparingWithPageNumber = pages.at(orderingCounter)

        const forbiddenRule = `${comparingWithPageNumber}|${currentPageNumber}`
        const existsInRules = includes(forbiddenRule)(rules)
        if (existsInRules) {
          isValidOrdering = false
          break
        }
      }
    }

    if (isValidOrdering) allCorrectOrders.push(pages)
    else allIncorrectOrders.push(pages)
  }
  return { allCorrectOrders, allIncorrectOrders }
}

function containsInvalidOrderingAt(pages: string[]) {
  for (let i = 0; i < pages.length; i++) {
    const currentPageNumber = pages.at(i)
    for (let orderingCounter = i + 1; orderingCounter < pages.length; orderingCounter++) {
      const comparingWithPageNumber = pages.at(orderingCounter)

      const forbiddenRule = `${comparingWithPageNumber}|${currentPageNumber}`
      const forbiddenRuleExists = includes(forbiddenRule)(rules)
      if (forbiddenRuleExists) {
        return [i, orderingCounter]
      }
    }
  }
  return [0, 0]
}

function resortPageOrdering(ordering: string[]) {
  const [tooSoon, tooLate] = containsInvalidOrderingAt(ordering)

  if (tooLate !== 0) {
    const newOrdering = move(tooLate, tooSoon)(ordering)
    return resortPageOrdering(newOrdering)
  }
  return ordering
}

function addUpAllOrderings(orderings: string[][]) {
  return orderings.reduce<number>((acc, ordering: string[]) => {
    const middleNumber = parseInt(ordering.at(Math.floor(ordering.length / 2)) as string)
    acc += middleNumber
    return acc
  }, 0)
}

// part 1
const { allCorrectOrders } = getCorrectAndIncorrectOrderings()
const finalAnswerPart1 = addUpAllOrderings(allCorrectOrders)
// console.log({ finalAnswer: finalAnswerPart1 })

// part 2
const { allIncorrectOrders } = getCorrectAndIncorrectOrderings()

const correctedOrderings: string[][] = []
for (const incorrectOrder of allIncorrectOrders) {
  const correctedOrdering = resortPageOrdering(incorrectOrder)
  correctedOrderings.push(correctedOrdering)
}

const finalAnswerPart2 = addUpAllOrderings(correctedOrderings)
console.log({ finalAnswerPart2 })
