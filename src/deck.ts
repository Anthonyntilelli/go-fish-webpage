import { suit, card } from "./types.js";

export class Deck {
  #cards: card[];
  #deckEl = document.getElementById("main_deck") as HTMLUListElement;
  #templateBackCard = document.getElementById("template-deck-cardBack") as HTMLTemplateElement;

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
    this.#deckDisplayInit();
  }

  get empty(): boolean {
    return this.#cards.length === 0;
  }

  get remaining(): number {
    return this.#cards.length;
  }

  // Throws an error on empty deck
  draw(): card | never {
    if (this.empty) throw Error("No more cards in the deck");
    this.#deckEl.querySelector("li")?.remove();
    return this.#cards.pop()!;
  }

  #deckDisplayInit(): void {
    this.#deckEl.innerHTML = ""; // Clear inner html of deck
    for (let i = 0; i < this.remaining; i++) {
      const clone = this.#templateBackCard.content.cloneNode(true);
      this.#deckEl.appendChild(clone);
    }
  }

  #shuffleDeck(): void {
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
}
