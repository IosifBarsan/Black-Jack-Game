let cardValues = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
let cardSuits = ['Heart', 'Club', 'Diamond', 'Spade'];
let cards = [];


for (let suitId = 0; suitId < cardSuits.length; suitId++) {
  for (let valueId = 0; valueId < cardValues.length; valueId++) {
    let card = {
      value: cardValues[valueId],
      suit: cardSuits[suitId]
    };
    cards.push(card);
  }
}

let playerCards = [];
let dealerCards = [];
let playerScore = 0;
let dealerScore = 0;
let gameOver = false;


function shuffleCards() {
  for (let i = cards.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    let temp = cards[i];
    cards[i] = cards[j];
    cards[j] = temp;
  }
}


function startGame() {
  playerCards = [];
  dealerCards = [];
  playerScore = 0;
  dealerScore = 0;
  gameOver = false;
  shuffleCards();
  playerCards.push(cards.pop());
  dealerCards.push(cards.pop());
  playerCards.push(cards.pop());
  dealerCards.push(cards.pop());
  updateScores();
  renderCards();
  document.getElementById("game-message").textContent = "Let's Play!";
}

function renderCards() {
  document.getElementById("player-cards").innerHTML = "";
  document.getElementById("dealer-cards").innerHTML = "";

  for (let i = 0; i < playerCards.length; i++) {
    let card = document.createElement("img");
    card.src = `images/${playerCards[i].value}-${playerCards[i].suit}.jpg`;
    card.alt = `${playerCards[i].value}-${playerCards[i].suit}`;
    document.getElementById("player-cards").appendChild(card);
  }
  
  for (let i = 0; i < dealerCards.length; i++) {
    let card = document.createElement("img");
    if (i === 0 && dealerTurn) {
      card.src = "images/back-card.jpg";
      card.alt = "Card back";
      card.classList.add("back-card");
    } else {
      let cardName = `${dealerCards[i].value}-${dealerCards[i].suit}.jpg`;
      card.src = `images/${cardName}`;
      card.alt = `${dealerCards[i].value} of ${dealerCards[i].suit}`;
    }
    document.getElementById("dealer-cards").appendChild(card);
  }


  if (!gameOver && dealerCards.length === 2 && dealerScore.score < 21 && playerScore.score < 21 && dealerTurn && dealerCards[0].value === "Face-Card") {
    let backCard = document.querySelector(".back-card");
    if (backCard) {
      backCard.classList.remove("back-card");
      let nextCard = cards.pop();
      dealerCards[0] = nextCard;
      let card = document.createElement("img");
      let cardName = `${nextCard.value}-${nextCard.suit}.jpg`;
      card.src = `images/${cardName}`;
      card.alt = `${nextCard.value} of ${nextCard.suit}`;
      document.getElementById("dealer-cards").insertBefore(card, document.getElementById("dealer-cards").firstChild);
    }
  }
}


function updateScores() {
  dealerScore = getScore(dealerCards, true);
  playerScore = getScore(playerCards);

  document.getElementById("dealer-score").textContent = dealerScore.score;
  document.getElementById("player-score").textContent = playerScore.score;
}

function getScore(cards, isDealer) {
  let score = 0;
  let hasAce = false;
  for (let i = 0; i < cards.length; i++) {
  let card = cards[i];
  if (card.value === 'A') {
  hasAce = true;
  }
  score += getCardValue(card.value);
  }
  if (hasAce && score + 10 <= 21) {
  score += 10;
  }
  return {
  score: score,
  isBust: score > 21,
  hasBlackjack: isDealer ? false : score === 21 && cards.length === 2
  };
  }
  
  function getCardValue(cardValue) {
  switch (cardValue) {
  case '2':
  return 2;
  case '3':
  return 3;
  case '4':
  return 4;
  case '5':
  return 5;
  case '6':
  return 6;
  case '7':
  return 7;
  case '8':
  return 8;
  case '9':
  return 9;
  case '10':
  case 'J':
  case 'Q':
  case 'K':
  return 10;
  case 'A':
  return 1;
  default:
  return 0;
  }
  }
  
  function endGame() {
    gameOver = true;
    let message;
    let playerScore = getScore(playerCards);
    let dealerScore = getScore(dealerCards, true);
    
    if (playerScore.isBust) {
      message = "You busted! Dealer wins!";
    } else if (dealerScore.isBust) {
      message = "Dealer busted! You win!";
    } else if (playerScore.hasBlackjack && dealerScore.hasBlackjack) {
      message = "Both players have blackjack! It's a tie!";
    } else if (playerScore.hasBlackjack) {
      message = "You have blackjack! You win!";
    } else if (dealerScore.hasBlackjack) {
      message = "Dealer has blackjack! Dealer wins!";
    } else if (playerScore.score > dealerScore.score) {
      message = "You win!";
    } else if (dealerScore.score > playerScore.score) {
      message = "Dealer wins!";
    } else {
      message = "It's a tie!";
    }
    
    let gameMessageElement = document.getElementById("game-message");
    gameMessageElement.textContent = message;
    
    gameMessageElement.classList.add("pop-up"); 
    
    setTimeout(function() {
      gameMessageElement.classList.remove("pop-up");
    }, 500); 
    
    updateScores();
    document.getElementById("start-game").classList.remove("hidden");
    document.getElementById("hit").style.display = "none";
    document.getElementById("stay").style.display = "none";
  }
  
  
  
  function dealerTurn() {
    let facedownCard = document.querySelector(".back-card");
    facedownCard.src = `images/${dealerCards[0].value}-${dealerCards[0].suit}.jpg`;
    facedownCard.alt = `${dealerCards[0].value} of ${dealerCards[0].suit}`;
    facedownCard.classList.remove("back-card");
  
    let score = getScore(dealerCards).score;
    while (score <= 17) {
      dealerCards.push(cards.splice(0, 1)[0]);
      renderCards();
      score = getScore(dealerCards).score;
    }
  
    if (getScore(playerCards).score > score) {
      endGame();
    }
  }


  function revealDealerCard() {
    let facedownCard = document.querySelector(".back-card");
    facedownCard.src = `images/${dealerCards[0].value}-${dealerCards[0].suit}.jpg`;
    facedownCard.alt = `${dealerCards[0].value} of ${dealerCards[0].suit}`;
    facedownCard.classList.remove("back-card");
  }  
  
  
  function hit() {
  if (!gameOver) {
  playerCards.push(cards.pop());
  updateScores();
  renderCards();

  if (getScore(playerCards).isBust) {
    endGame();
    revealDealerCard();
    dealerTurn();
  }
  }
  }
  
  function stay() {
    if (!gameOver) {
      let facedownCard = document.querySelector(".back-card");
      facedownCard.src = `images/${dealerCards[0].value}-${dealerCards[0].suit}.jpg`;
      facedownCard.alt = `${dealerCards[0].value} of ${dealerCards[0].suit}`;
      facedownCard.classList.remove("back-card");
  
      while (getScore(dealerCards).score <= 17) {
        dealerCards.push(cards.pop());
        renderCards();
      }
  
      let playerScore = getScore(playerCards).score;
      let dealerScore = getScore(dealerCards).score;
      if (playerScore > dealerScore) {
        endGame(true);
      } else {
        endGame(false);
      }
      revealDealerCard();
      
    }
  
  }
  
  document.getElementById("start-game").addEventListener("click", function() {
    startGame();
    document.getElementById("hit").style.display = "inline-block";
    document.getElementById("stay").style.display = "inline-block";
    document.getElementById("dealer-score").classList.remove("hidden"); 
    document.getElementById("player-score").classList.remove("hidden");
    document.getElementById("game-message").textContent = "Hit or Stay?";
    this.classList.add("hidden");
  });
  
  
  document.getElementById("hit").addEventListener("click", hit);
  document.getElementById("stay").addEventListener("click", stay);
  
  startGame();