import { card, hand, memory } from "types.js";

export class Player {
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

  addCardToHand(card: card): void {
    this._length++;
    this._hand[card.Value].push(card);
  }

  get length(): number {
    return this._length;
  }

  get empty(): boolean {
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
    this._length -= cards.length;
    return cards;
  }

  //Finds 4pair Cards and removes them from hand
  //returns number of quads if finds
  removeFourPair(): number {
    let fourPairFound = 0;
    for (let value of Object.keys(this._hand)) {
      if (this._hand[value].length == 4) {
        fourPairFound++;
        this._hand[value] = [];
      }
    }
    this._length -= 4 * fourPairFound;
    return fourPairFound;
  }
}

export class ComputerPlayer extends Player {
  #memory: memory;

  constructor(cards: card[]) {
    super(cards);
    this.#memory = {
      A: false,
      2: false,
      3: false,
      4: false,
      5: false,
      6: false,
      7: false,
      8: false,
      9: false,
      10: false,
      J: false,
      Q: false,
      K: false,
    };
  }

  // Chooses a card value from #memory and hand or select a card value at random from the hand
  // Throws error on empty hand
  guess(): string | never {
    if (super.empty) throw Error("Cannot Guess on an empty hand.");

    const possibleGuesses: string[] = [];
    let guess = "";
    for (let k of Object.keys(this._hand)) {
      if (this.#memory[k] && this._hand[k].length !== 0) possibleGuesses.push(k);
    }
    if (possibleGuesses.length !== 0) {
      // random guess from #memory + hand
      guess = possibleGuesses[Math.floor(Math.random() * possibleGuesses.length)];
      this.#memory[guess] = false;
    } else {
      // Random guess from hand
      const cardValues = this.#handList();
      guess = cardValues[Math.floor(Math.random() * cardValues.length)];
    }
    return guess;
  }

  askForCards(cardValue: string): card[] | null {
    this.#memory[cardValue] = true;
    return super.askForCards(cardValue);
  }

  #handList(): string[] {
    const cardValues: string[] = [];
    for (let k of Object.keys(this._hand)) {
      if (this._hand[k].length !== 0) {
        cardValues.push(k);
      }
    }
    return cardValues;
  }
}
