import { state } from "./types.js";
import { Deck } from "./deck.js";
import { ComputerSide, HumanSide } from "./side.js";

class App {
  #deck: Deck;
  #computer: ComputerSide;
  #human: HumanSide;
  #statusText = document.getElementById("status_text") as HTMLHeadingElement;
  #currentState: state;

  constructor() {
    this.#deck = new Deck();
    this.#computer = new ComputerSide([
      this.#deck.draw(),
      this.#deck.draw(),
      this.#deck.draw(),
      this.#deck.draw(),
      this.#deck.draw(),
    ]);
    this.#human = new HumanSide([
      this.#deck.draw(),
      this.#deck.draw(),
      this.#deck.draw(),
      this.#deck.draw(),
      this.#deck.draw(),
    ]);
    this.#currentState = state.humanTurn;
    this.#statusText.textContent = "Select a card to start the game.";
    document.getElementById("human_hand")?.addEventListener("click", this.#playerGuessEvent.bind(this));
    document.getElementById("main_deck")?.addEventListener("click", this.#playerGoFishAndComputerTurn.bind(this));
    this.#statusText.addEventListener("click", this.newGame.bind(this));
  }

  newGame(_: Event): void {
    if (this.#currentState !== state.gameOver) return;
    this.#deck = new Deck();
    this.#computer = new ComputerSide([
      this.#deck.draw(),
      this.#deck.draw(),
      this.#deck.draw(),
      this.#deck.draw(),
      this.#deck.draw(),
    ]);
    this.#human = new HumanSide([
      this.#deck.draw(),
      this.#deck.draw(),
      this.#deck.draw(),
      this.#deck.draw(),
      this.#deck.draw(),
    ]);
    this.#currentState = state.humanTurn;
    this.#statusText.textContent = "Select a card to start the game.";
  }

  #checkGameOver(): void {
    if (this.#deck.empty && (this.#computer.player.empty || this.#human.player.empty)) {
      this.#currentState = state.gameOver;
      if (this.#computer.score > this.#human.score)
        this.#statusText.textContent = "GameOver Computer won :-(, Click here to restart the game.";
      else if (this.#human.score > this.#computer.score)
        this.#statusText.textContent = "GameOver You won :-), Click here to restart the game.";
      else this.#statusText.textContent = "GameOver Its a Tie, Click here to restart the game.";
    }
  }

  #playerGuessEvent(event: Event): void {
    const cardEl = (event.target as HTMLElement)?.closest("li");
    if (cardEl === null || this.#currentState !== state.humanTurn) return; // skip if could not find card

    const [cardValue, _] = cardEl.id.split("-");
    const cards = this.#computer.askForCards(cardValue.toUpperCase());

    if (cards === null) {
      this.#statusText.textContent = "No luck, You will need to go fish (click on the deck)";
      this.#currentState = state.goFish;
    } else {
      for (let card of cards) this.#human.addCard(card);
      this.#human.checkAndRemoveFourPair();
      this.#statusText.textContent = "You guessed correctly! Go again.";
      this.#checkGameOver();
    }
  }

  #playerGoFishAndComputerTurn(_: Event): void {
    if (this.#currentState !== state.goFish) return; // only draw on go fish.
    this.#human.addCard(this.#deck.draw()); //human  goFish
    this.#human.checkAndRemoveFourPair();
    this.#computerTurn();
    this.#currentState = state.humanTurn;
    this.#checkGameOver();
  }

  #computerTurn(): void {
    this.#currentState = state.computerTurn;
    if (this.#computer.player.empty) {
      this.#statusText.textContent = "Computer hand is empty, it must GoFish. Your turn.";
    } else {
      const cardsAsked: string[] = [];
      let cards = null;
      do {
        const cardValue = this.#computer.player.guess();
        cardsAsked.push(cardValue);
        cards = this.#human.askForCards(cardValue);
        if (cards) for (const card of cards) this.#computer.addCard(card);
      } while (cards);
      this.#statusText.textContent = `Computer asked for ${cardsAsked.join(", ")}, Your Turn`;
    }
    if (!this.#deck.empty) this.#computer.addCard(this.#deck.draw()); // CP goFish
    this.#computer.checkAndRemoveFourPair();
  }
}

{
  const app = new App();
}
