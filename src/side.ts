import { suit, card } from "./types.js";
import { Player, ComputerPlayer } from "./player.js";

export abstract class Side {
  protected _sideEl: HTMLUListElement;
  #PointsEl: HTMLHeadingElement;
  #score = 0;

  constructor(sideId: string, pointsId: string) {
    this.#PointsEl = document.getElementById(pointsId) as HTMLHeadingElement;
    this._sideEl = document.getElementById(sideId) as HTMLUListElement;
    this.#PointsEl.textContent = "0";
  }

  addPoint(points: number): void {
    this.#score += points;
    this.#PointsEl.textContent = this.#score.toString();
  }

  get score(): number {
    return this.#score;
  }

  abstract displayHand(): void;

  // Returns null if the player does not have the cards
  abstract askForCards(cardValue: string): card[] | null;

  abstract addCard(card: card): void;

  abstract checkAndRemoveFourPair(): void;
}

export class ComputerSide extends Side {
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

  askForCards(cardValue: string): card[] | null {
    const cards = this.player.askForCards(cardValue);
    this.displayHand();
    return cards;
  }

  addCard(card: card): void {
    this.player.addCardToHand(card);
    this.displayHand();
  }

  checkAndRemoveFourPair(): void {
    const points = this.player.removeFourPair();
    this.addPoint(points);
    this.displayHand();
  }
}

export class HumanSide extends Side {
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

  askForCards(cardValue: string): card[] | null {
    const cards = this.player.askForCards(cardValue);
    this.displayHand();
    return cards;
  }

  addCard(card: card): void {
    this.player.addCardToHand(card);
    this.displayHand();
  }

  checkAndRemoveFourPair(): void {
    const points = this.player.removeFourPair();
    this.addPoint(points);
    this.displayHand();
  }

  #createDisplayCards(card: card): void {
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
