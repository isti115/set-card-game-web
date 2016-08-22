import { CardProperty } from './card'

const imageSourceFromCardShape = cardProperty => ({
  [CardProperty.SHAPE.OVAL]: './images/oval.png',
  [CardProperty.SHAPE.SQUIGGLE]: './images/squiggle.png',
  [CardProperty.SHAPE.DIAMOND]: './images/diamond.png'
}[cardProperty])

const symbolCountFromCardNumber = cardProperty => ({
  [CardProperty.NUMBER.ONE]: 1,
  [CardProperty.NUMBER.TWO]: 2,
  [CardProperty.NUMBER.THREE]: 3
}[cardProperty])

const elementIdFromCard = card => `card_${card.color}_${card.shape}_${card.number}_${card.shading}`

export default class Renderer {
  constructor (container, game) {
    this.container = container
    this.game = game

    this.boardWidth = 4
    this.boardHeight = 3

    this.elements = {}
    this.maxZIndex = 0

    this.queue = []
    this.autoProcessQueue = true
  }

  setContainer (container) {
    this.container = container
  }

  setGame (game) {
    this.game = game
  }

  init () {
    for (const card of this.game.deck.cards) {
      this.elements[elementIdFromCard(card)] = this.renderCard(card)
    }

    for (const element in this.elements) {
      this.container.appendChild(this.elements[element])
    }
  }

  render () {
    for (const card of this.game.changedCards) {
      const currentElement = this.elements[elementIdFromCard(card)]

      const i = this.game.board.cards.indexOf(card)

      this.queue.push({
        element: currentElement,
        properties: {
          transform: `translateX(${document.body.clientWidth / 2}px)` +
            `translateY(${document.body.clientHeight / 2}px)` +
            `rotateY(180deg)` +
            `translateZ(-250px)`
        },
        delay: 2000
      })

      this.queue.push({
        element: currentElement,
        properties: {
          transform: `translateX(${300 + (Math.floor(i / 3)) * 125}px)` +
            `translateY(${0 + (i % 3) * 175}px)` +
            `rotateY(180deg)`
        },
        delay: 2000
      })
      currentElement.style.zIndex = ++this.maxZIndex
    }

    this.processQueue()
  }

  processQueue () {
    console.log(this)
    if (this.queue.length === 0) {
      return false
    }

    const currentQueueItem = this.queue.shift()

    for (const property in currentQueueItem.properties) {
      currentQueueItem.element.style[property] = currentQueueItem.properties[property]
    }

    if (this.autoProcessQueue) {
      setTimeout(this.processQueue.bind(this), currentQueueItem.delay)
    }
  }

  renderCard (card) {
    const element = document.createElement('div')
    element.classList.add('card')

    const back = document.createElement('div')
    back.classList.add('back')

    const front = document.createElement('div')
    front.classList.add('front')

    const symbol = document.createElement('div')
    symbol.classList.add('symbol')

    symbol.style.backgroundColor = card.color

    const symbolImage = document.createElement('img')
    symbolImage.classList.add('symbolImage')

    symbolImage.src = imageSourceFromCardShape(card.shape)

    symbol.appendChild(symbolImage)

    for (let i = 0; i < symbolCountFromCardNumber(card.number); i++) {
      front.appendChild(symbol.cloneNode(true))
    }

    element.appendChild(back)
    element.appendChild(front)

    element.addEventListener('click', (e) => console.log('card clicked'))

    return element
  }

  getFreeBoardIndices () {
    const freeIndices = []

    for (let i = 0; i < this.boardWidth * this.boardHeight; i++) {
      if (board.cards[i] === undefined) {
        freeIndices.push(i)
      }
    }

    return freeIndices
  }
}
