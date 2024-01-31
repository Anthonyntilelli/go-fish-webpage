export enum suit {
  Clubs = "♣",
  Diamonds = "♦",
  Hearts = "♥",
  Spades = "♠",
}

export enum state {
  humanTurn,
  computerTurn,
  goFish,
  gameOver,
}

export type card = { Value: string; Suit: suit };

export type hand = {
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

export type memory = {
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
