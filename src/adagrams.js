const LETTER_POOL_PER_GAME = {
  A: 9, B: 2, C: 2, D: 4, E: 12, F: 2, G: 3, H: 2,
  I: 9, J: 1, K: 1, L: 4, M: 2, N: 6, O: 8, P: 2,
  Q: 1, R: 6, S: 4, T: 6, U: 4, V: 2, W: 2, X: 1,
  Y: 2, Z: 1,
};

const LETTER_SCORES = {
  A: 1, B: 3, C: 3, D: 2, E: 1, F: 4, G: 2, H: 4,
  I: 1, J: 8, K: 5, L: 1, M: 3, N: 1, O: 1, P: 3,
  Q: 10, R: 1, S: 1, T: 1, U: 1, V: 4, W: 4, X: 8,
  Y: 4, Z: 10
};

const BONUS_MIN_LENGTH = 7;
const LENGTH_BONUS_POINTS = 8;
const HAND_SIZE = 10;

export const drawLetters = () => {
  const letterPool = [];

  for (const [letter, count] of Object.entries(LETTER_POOL_PER_GAME)) {
    for (let i = 0; i < count; i++) {
      letterPool.push(letter);
    }
  }

  const letterBank = [];
  const availableLetters = {...LETTER_POOL_PER_GAME};

  while (letterBank.length < HAND_SIZE) {
    const randomIndex = Math.floor(Math.random() * letterPool.length);
    const letter = letterPool[randomIndex];

    if (availableLetters[letter] > 0) {
      letterBank.push(letter);
      availableLetters[letter]--;
    }
  }

  return letterBank;
};

export const usesAvailableLetters = (input, lettersInHand) => {
  input = input.toUpperCase();
  lettersInHand = lettersInHand.map(letter => letter.toUpperCase());

  const letterBankDict = {};
  for (const letter of lettersInHand) {
    if (letter in letterBankDict) {
      letterBankDict[letter]++;
    } else {
      letterBankDict[letter] = 1;
    }
  }

  const letterCount = {};
  for (const letter of input) {
    if (letter in letterCount) {
      letterCount[letter]++;
    } else {
      letterCount[letter] =1;
    }
  }

  for (const letter in letterCount) {
    if (!(letter in letterBankDict)) {
      return false;
    } else if (letterCount[letter] > letterBankDict[letter]) {
      return false;
    }
  }

  return true;
};

export const scoreWord = (word) => {
  if (!word || word.length === 0) {
    return 0;
  }

  word = word.toUpperCase();
  let totalPoints = 0;

  for (const letter of word) {
    if (letter in LETTER_SCORES) {
      totalPoints += LETTER_SCORES[letter];
    }
  }

  if (word.length >= BONUS_MIN_LENGTH) {
    totalPoints += LENGTH_BONUS_POINTS;
  }

  return totalPoints;
};

export const highestScoreFrom = (words) => {
  let highestScore = 0;
  let bestWord = ''

  for (const word of words) {
    const score = scoreWord(word);
    if (score > highestScore) {
      bestWord = word;
      highestScore = score;
    } else if (score === highestScore && bestWord.length !== HAND_SIZE) {
        if (word.length === HAND_SIZE) {
          bestWord = word;
        } else if (word.length < bestWord.length) {
          bestWord = word;
        }
    }
  }
  return {
    word: bestWord,
    score: highestScore
  }
};