enum suit {
  Clubs = "♣",
  Diamonds = "♦",
  Hearts = "♥",
  Spades = "♠",
}

enum state {
  humanTurn,
  computerTurn,
  goFish,
  gameOver,
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

  //Finds 4pair Cards and removes them from hand
  //returns number of quads if finds
  removeFourPair() {
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
  #PointsEl: HTMLHeadingElement;
  #score = 0;

  constructor(sideId: string, pointsId: string) {
    this.#PointsEl = document.getElementById(pointsId) as HTMLHeadingElement;
    this._sideEl = document.getElementById(sideId) as HTMLUListElement;
    this.#PointsEl.textContent = "0";
  }

  addPoint(points: number) {
    this.#score += points;
    this.#PointsEl.textContent = this.#score.toString();
  }

  get score() {
    return this.#score;
  }

  abstract displayHand(): void;

  // Returns null if the player does not have the cards
  abstract askForCards(cardValue: string): card[] | null;

  abstract addCard(card: card): void;

  abstract checkAndRemoveFourPair(): void;
}

class ComputerSide extends Side {
  #templateBackCard = document.getElementById("template-deck-cardBack") as HTMLTemplateElement;
  player: ComputerPlayer;

  constructor(cards: card[]) {
    super("computer_hand", "computer_points");
    this.player = new ComputerPlayer(cards);
    this.displayHand();
  }

  displayHand(): void {
    this._sideEl.innerHTML = "";

    if (this.player.empty) {
      this._sideEl.innerHTML = "Computer player has no cards";
      return;
    }

    for (let i = 0; i < this.player.length; i++) {
      const clone = this.#templateBackCard.content.cloneNode(true);
      this._sideEl.appendChild(clone);
    }
  }

  askForCards(cardValue: string) {
    const cards = this.player.askForCards(cardValue);
    this.displayHand();
    return cards;
  }

  addCard(card: card): void {
    this.player.addCardToHand(card);
    this.displayHand();
  }

  checkAndRemoveFourPair() {
    const points = this.player.removeFourPair();
    this.addPoint(points);
    this.displayHand();
  }
}

class HumanSide extends Side {
  player: Player;

  constructor(cards: card[]) {
    super("human_hand", "human_points");
    this.player = new Player(cards);
    this.displayHand();
  }

  displayHand(): void {
    this._sideEl.innerHTML = "";

    if (this.player.empty) {
      this._sideEl.innerHTML = "You have no cards";
      return;
    }

    const cards = this.player.toCardArray();
    for (let card of cards) {
      this.#createDisplayCards(card);
    }
  }

  askForCards(cardValue: string) {
    const cards = this.player.askForCards(cardValue);
    this.displayHand();
    return cards;
  }

  addCard(card: card): void {
    this.player.addCardToHand(card);
    this.displayHand();
  }

  checkAndRemoveFourPair() {
    const points = this.player.removeFourPair();
    this.addPoint(points);
    this.displayHand();
  }

  #createDisplayCards(card: card) {
    let templateId = `template-${card.Value.toLowerCase()}-`;
    let cardId = `${card.Value.toLowerCase()}-`;
    switch (card.Suit) {
      case suit.Clubs: {
        templateId += "clubs";
        cardId += "clubs";
        break;
      }
      case suit.Diamonds: {
        templateId += "diams";
        cardId += "diams";
        break;
      }
      case suit.Hearts: {
        templateId += "hearts";
        cardId += "hearts";
        break;
      }
      case suit.Spades: {
        templateId += "spades";
        cardId += "spades";
        break;
      }
    }
    const templateCard = document.getElementById(templateId) as HTMLTemplateElement;
    const clone = templateCard.content.cloneNode(true) as DocumentFragment;
    const innerLi = clone.querySelector("li")!;
    innerLi.id = cardId;
    this._sideEl.appendChild(clone);
  }
}

class App {
  deck: Deck;
  computer: ComputerSide;
  human: HumanSide;
  statusText = document.getElementById("status_text") as HTMLHeadingElement;
  currentState: state;

  constructor() {
    this.deck = new Deck();
    this.computer = new ComputerSide([
      this.deck.draw(),
      this.deck.draw(),
      this.deck.draw(),
      this.deck.draw(),
      this.deck.draw(),
    ]);
    this.human = new HumanSide([
      this.deck.draw(),
      this.deck.draw(),
      this.deck.draw(),
      this.deck.draw(),
      this.deck.draw(),
    ]);
    this.currentState = state.humanTurn;
    this.statusText.textContent = "Select a card to start the game.";
    document.getElementById("human_hand")?.addEventListener("click", this.#playerGuessEvent.bind(this));
    document.getElementById("main_deck")?.addEventListener("click", this.#playerGoFishAndComputerTurn.bind(this));
    this.statusText.addEventListener("click", this.newGame.bind(this));
  }
  newGame(_: Event) {
    if (this.currentState !== state.gameOver) return;
    this.deck = new Deck();
    this.computer = new ComputerSide([
      this.deck.draw(),
      this.deck.draw(),
      this.deck.draw(),
      this.deck.draw(),
      this.deck.draw(),
    ]);
    this.human = new HumanSide([
      this.deck.draw(),
      this.deck.draw(),
      this.deck.draw(),
      this.deck.draw(),
      this.deck.draw(),
    ]);
    this.currentState = state.humanTurn;
    this.statusText.textContent = "Select a card to start the game.";
  }

  #checkGameOver() {
    if (this.deck.empty && (this.computer.player.empty || this.human.player.empty)) {
      this.currentState = state.gameOver;
      if (this.computer.score > this.human.score)
        this.statusText.textContent = "GameOver Computer won :-(, Click here to restart the game.";
      else if (this.human.score > this.computer.score)
        this.statusText.textContent = "GameOver You won :-), Click here to restart the game.";
      else this.statusText.textContent = "GameOver Its a Tie, Click here to restart the game.";
    }
  }

  #playerGuessEvent(event: Event) {
    const cardEl = (event.target as HTMLElement)?.closest("li");
    if (cardEl === null || this.currentState !== state.humanTurn) return; // skip if could not find card

    const [cardValue, _] = cardEl.id.split("-");
    const cards = this.computer.askForCards(cardValue.toUpperCase());

    if (cards === null) {
      this.statusText.textContent = "No luck, You will need to go fish (click on the deck)";
      this.currentState = state.goFish;
    } else {
      for (let card of cards) this.human.addCard(card);
      this.human.checkAndRemoveFourPair();
      this.statusText.textContent = "You guessed correctly! Go again.";
      this.#checkGameOver();
    }
  }

  #playerGoFishAndComputerTurn(_: Event) {
    if (this.currentState !== state.goFish) return; // only draw on go fish.
    this.human.addCard(this.deck.draw()); //human  goFish
    this.human.checkAndRemoveFourPair();
    this.#computerTurn();
    this.currentState = state.humanTurn;
    this.#checkGameOver();
  }

  #computerTurn() {
    this.currentState = state.computerTurn;
    if (this.computer.player.empty) {
      this.statusText.textContent = "Computer hand is empty, it must GoFish. Your turn.";
    } else {
      const cardsAsked: string[] = [];
      let cards = null;
      do {
        const cardValue = this.computer.player.guess();
        cardsAsked.push(cardValue);
        cards = this.human.askForCards(cardValue);
        if (cards) for (const card of cards) this.computer.addCard(card);
      } while (cards);
      this.statusText.textContent = `Computer asked for ${cardsAsked.join(", ")}, Your Turn`;
    }
    if (!this.deck.empty) this.computer.addCard(this.deck.draw()); // CP goFish
    this.computer.checkAndRemoveFourPair();
  }
}

const app = new App();
