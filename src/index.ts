enum suit {
  Clubs = "♣",
  Diamonds = "♦",
  Hearts = "♥",
  Spades = "♠",
}

enum turn {
  human,
  computer,
}

type card = { Value: string; Suit: suit };

type hand = {
  [key: string]: card[];
  A: card[];
  2: card[];
  3: card[];
  4: card[];
  5: card[];
  6: card[];
  7: card[];
  8: card[];
  9: card[];
  10: card[];
  J: card[];
  Q: card[];
  K: card[];
};

class Deck {
  #cards: card[];

  constructor() {
    this.#cards = [
      { Value: "A", Suit: suit.Clubs },
      { Value: "2", Suit: suit.Clubs },
      { Value: "3", Suit: suit.Clubs },
      { Value: "4", Suit: suit.Clubs },
      { Value: "5", Suit: suit.Clubs },
      { Value: "6", Suit: suit.Clubs },
      { Value: "7", Suit: suit.Clubs },
      { Value: "8", Suit: suit.Clubs },
      { Value: "9", Suit: suit.Clubs },
      { Value: "10", Suit: suit.Clubs },
      { Value: "J", Suit: suit.Clubs },
      { Value: "Q", Suit: suit.Clubs },
      { Value: "K", Suit: suit.Clubs },
      { Value: "A", Suit: suit.Diamonds },
      { Value: "2", Suit: suit.Diamonds },
      { Value: "3", Suit: suit.Diamonds },
      { Value: "4", Suit: suit.Diamonds },
      { Value: "5", Suit: suit.Diamonds },
      { Value: "6", Suit: suit.Diamonds },
      { Value: "7", Suit: suit.Diamonds },
      { Value: "8", Suit: suit.Diamonds },
      { Value: "9", Suit: suit.Diamonds },
      { Value: "10", Suit: suit.Diamonds },
      { Value: "J", Suit: suit.Diamonds },
      { Value: "Q", Suit: suit.Diamonds },
      { Value: "K", Suit: suit.Diamonds },
      { Value: "A", Suit: suit.Hearts },
      { Value: "2", Suit: suit.Hearts },
      { Value: "3", Suit: suit.Hearts },
      { Value: "4", Suit: suit.Hearts },
      { Value: "5", Suit: suit.Hearts },
      { Value: "6", Suit: suit.Hearts },
      { Value: "7", Suit: suit.Hearts },
      { Value: "8", Suit: suit.Hearts },
      { Value: "9", Suit: suit.Hearts },
      { Value: "10", Suit: suit.Hearts },
      { Value: "J", Suit: suit.Hearts },
      { Value: "Q", Suit: suit.Hearts },
      { Value: "K", Suit: suit.Hearts },
      { Value: "A", Suit: suit.Spades },
      { Value: "2", Suit: suit.Spades },
      { Value: "3", Suit: suit.Spades },
      { Value: "4", Suit: suit.Spades },
      { Value: "5", Suit: suit.Spades },
      { Value: "6", Suit: suit.Spades },
      { Value: "7", Suit: suit.Spades },
      { Value: "8", Suit: suit.Spades },
      { Value: "9", Suit: suit.Spades },
      { Value: "10", Suit: suit.Spades },
      { Value: "J", Suit: suit.Spades },
      { Value: "Q", Suit: suit.Spades },
      { Value: "K", Suit: suit.Spades },
    ];
    this.#shuffleDeck();
  }

  #shuffleDeck() {
    // Shuffle algorithm is from https://bost.ocks.org/mike/shuffle/
    let length = this.#cards.length;
    let t;
    let i;

    // While there remain elements to shuffle…
    while (length) {
      // Pick a remaining element…
      i = Math.floor(Math.random() * length--);

      // And swap it with the current element.
      t = this.#cards[length];
      this.#cards[length] = this.#cards[i];
      this.#cards[i] = t;
    }
  }

  get empty() {
    return this.#cards.length === 0;
  }

  get remaining() {
    return this.#cards.length;
  }

  // Throws an error on empty deck
  pickACard(): card | never {
    if (this.empty) {
      throw Error("No more cards in the deck");
    }
    return this.#cards.pop()!;
  }
}

class Player {
  protected _hand: hand;
  protected _length: number;

  constructor(cards: card[]) {
    if (cards.length <= 0) throw Error("Hand Size must be greater then 0");
    this._length = cards.length;
    this._hand = { A: [], 2: [], 3: [], 4: [], 5: [], 6: [], 7: [], 8: [], 9: [], 10: [], J: [], Q: [], K: [] };
    for (let card of cards) {
      this._hand[card.Value].push(card);
    }
  }

  addCardToHand(card: card) {
    this._length++;
    this._hand[card.Value].push(card);
  }
  get length() {
    return this._length;
  }

  get empty() {
    return this._length === 0;
  }

  toCardArray(): card[] {
    return Object.values(this._hand).flat();
  }

  // return null if player does not have the card
  askForCards(cardValue: string): card[] | null {
    if (this._hand[cardValue] === undefined || this._hand[cardValue].length === 0) return null;
    const cards = this._hand[cardValue];
    this._hand[cardValue] = []; // Removing cards from hand
    return cards;
  }
}

class Table {
  // #humanSide;
  // #computerSide;
  #humanPointsEl = document.getElementById("human_points") as HTMLHeadingElement;
  #computerPointsEl = document.getElementById("computer_points") as HTMLHeadingElement;
  #humanScore = 0;
  #ComputerScore = 0;
  #deckEl = document.getElementById("main_deck") as HTMLUListElement;
  #deckTemplate = document.getElementById("template-deck-cardBack") as HTMLTemplateElement;
  #deck = new Deck();
  // currentTurn: turn;

  constructor() {
    this.#deckInit();

    // Init Points
    this.#humanPointsEl.textContent = "0";
    this.#computerPointsEl.textContent = "0";
  }

  #deckInit() {
    this.#deckEl.innerHTML = ""; // Clear inner html of deck
    for (let i = 0; i <= this.#deck.remaining; i++) {
      let clone = this.#deckTemplate.content.cloneNode(true);
      this.#deckEl.appendChild(clone);
    }
  }

  addPointComputer() {
    this.#ComputerScore++;
    this.#computerPointsEl.textContent = this.#ComputerScore.toString();
  }

  addPointHuman() {
    this.#humanScore++;
    this.#humanPointsEl.textContent = this.#humanScore.toString();
  }

  removeDeckTopCard() {
    this.#deckEl.firstChild?.remove();
  }
}

let table = new Table();
