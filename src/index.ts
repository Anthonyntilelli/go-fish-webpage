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

type memory = {
  [key: string]: boolean;
  A: boolean;
  2: boolean;
  3: boolean;
  4: boolean;
  5: boolean;
  6: boolean;
  7: boolean;
  8: boolean;
  9: boolean;
  10: boolean;
  J: boolean;
  Q: boolean;
  K: boolean;
};

class Deck {
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

  get empty() {
    return this.#cards.length === 0;
  }

  get remaining() {
    return this.#cards.length;
  }

  // Throws an error on empty deck
  draw(): card | never {
    if (this.empty) throw Error("No more cards in the deck");
    this.#deckEl.querySelector("li")?.remove();
    return this.#cards.pop()!;
  }

  #deckDisplayInit() {
    this.#deckEl.innerHTML = ""; // Clear inner html of deck
    for (let i = 0; i < this.remaining; i++) {
      const clone = this.#templateBackCard.content.cloneNode(true);
      this.#deckEl.appendChild(clone);
    }
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
    this._length -= cards.length;
    return cards;
  }
}

class ComputerPlayer extends Player {
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

  askForCards(cardValue: string) {
    this.#memory[cardValue] = true;
    return super.askForCards(cardValue);
  }

  #handList() {
    const cardValues: string[] = [];
    for (let k of Object.keys(this._hand)) {
      if (this._hand[k].length !== 0) {
        cardValues.push(k);
      }
    }
    return cardValues;
  }
}

abstract class Side {
  protected _sideEl: HTMLUListElement;
  protected _player: Player;
  #PointsEl: HTMLHeadingElement;
  #score = 0;

  constructor(cards: card[], sideId: string, pointsId: string) {
    this._player = new Player(cards);
    this.#PointsEl = document.getElementById(pointsId) as HTMLHeadingElement;
    this._sideEl = document.getElementById(sideId) as HTMLUListElement;
    this.#PointsEl.textContent = "0";
  }

  addPoint() {
    this.#score++;
    this.#PointsEl.textContent = this.#score.toString();
  }

  abstract displayHand(): void;

  // Returns null if the player does not have the cards
  abstract askForCards(cardValue: string): card[] | null;

  abstract addCard(card: card): void;
}

class ComputerSide extends Side {
  #templateBackCard = document.getElementById("template-deck-cardBack") as HTMLTemplateElement;

  constructor(cards: card[]) {
    super(cards, "computer_hand", "computer_points");
    this.displayHand();
  }

  displayHand(): void {
    this._sideEl.innerHTML = "";

    if (this._player.empty) {
      this._sideEl.innerHTML = "Computer Player had No Cards";
      return;
    }

    for (let i = 0; i < this._player.length; i++) {
      const clone = this.#templateBackCard.content.cloneNode(true);
      this._sideEl.appendChild(clone);
    }
  }

  askForCards(cardValue: string) {
    const cards = this._player.askForCards(cardValue);
    this.displayHand();
    return cards;
  }

  addCard(card: card): void {
    this._player.addCardToHand(card);
    this.displayHand();
  }
}

// class Table {
//   #humanSideEl = document.getElementById("human_hand") as HTMLUListElement;

//   #humanPointsEl = document.getElementById("human_points") as HTMLHeadingElement;
//   #computerPointsEl = document.getElementById("computer_points") as HTMLHeadingElement;
//   #humanScore = 0;
//   #ComputerScore = 0;

//   #templateBackCard = document.getElementById("template-deck-cardBack") as HTMLTemplateElement;
//   #deck = new Deck();
//   #computerPlayer: ComputerPlayer;
//   #humanPlayer: Player;
//   // currentTurn: turn;

//   constructor() {
//     this.#computerPlayer = new ComputerPlayer([
//       this.#deck.draw(),
//       this.#deck.draw(),
//       this.#deck.draw(),
//       this.#deck.draw(),
//       this.#deck.draw(),
//     ]);

// this.#humanPlayer = new Player([
//   this.#deck.draw(),
//   this.#deck.draw(),
//   this.#deck.draw(),
//   this.#deck.draw(),
//   this.#deck.draw(),
// ]);

// this.#computerSideDisplayInit();
// this.#playerSideDisplayInit();
// this.#deckDisplayInit(); // Init DeckDisplay last as the computerSideDisplay and playerSideDisplay take card off the deck

// // Init Points
// this.#humanPointsEl.textContent = "0";
// this.#computerPointsEl.textContent = "0";
//   }

//   #playerSideDisplayInit() {
//     this.#humanSideEl.innerHTML = "";
//     const cards = this.#humanPlayer.toCardArray();
//     for (let card of cards) {
//       this.addHumanCard(card);
//     }
//   }

//   removeComputerCard() {
//     this.#computerSideEl.firstChild?.remove();
//   }

//   addHumanCard(card: card) {
//     let templateId = `template-${card.Value.toLowerCase()}-`;
//     let cardId = `${card.Value.toLowerCase()}-`;
//     switch (card.Suit) {
//       case suit.Clubs: {
//         templateId += "clubs";
//         cardId += "clubs";
//         break;
//       }
//       case suit.Diamonds: {
//         templateId += "diams";
//         cardId += "diams";
//         break;
//       }
//       case suit.Hearts: {
//         templateId += "hearts";
//         cardId += "hearts";
//         break;
//       }
//       case suit.Spades: {
//         templateId += "spades";
//         cardId += "spades";
//         break;
//       }
//     }
//     const templateCard = document.getElementById(templateId) as HTMLTemplateElement;
//     // console.log(templateId);
//     const clone = templateCard.content.cloneNode(true) as DocumentFragment;
//     const innerLi = clone.querySelector("li")!;
//     innerLi.id = cardId;
//     this.#humanSideEl.appendChild(clone);
//   }

//   // Removes all cards of that value
//   removeHumanCard(cardValue: string) {
//     const cvl = cardValue.toLowerCase();
//     document.getElementById(`${cvl}-spades`)?.remove();
//     document.getElementById(`${cvl}-hearts`)?.remove();
//     document.getElementById(`${cvl}-diams`)?.remove();
//     document.getElementById(`${cvl}-clubs`)?.remove();
//   }
// }

// let table = new Table();

let d = new Deck();
let cp = new ComputerSide([d.draw(), d.draw(), d.draw(), d.draw(), d.draw()]);
