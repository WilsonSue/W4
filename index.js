const hasPowerUp = () => Math.random() * 100 <= 15;
let gameStarted = false;
let gameInterval;
let isDark = false;
const difficultyTime = {
  6: 100,
  12: 200,
  18: 300,
};

$("#theme_switch").on("click", function () {
  if (isDark) {
    $("body").removeClass("dark-theme");
    $("body").addClass("light-theme");
    isDark = false;
  } else {
    $("body").removeClass("light-theme");
    $("body").addClass("dark-theme");
    isDark = true;
  }
});

$("#difficulty").change(function () {
  clearInterval(gameInterval);
  gameStarted = false;
  const numberOfCards = $(this).val();
  timer = difficultyTime[numberOfCards];
  $("#timer").text(`Time: ${timer}`);
  $("#message").text("");
  matchedCards = [];
  firstCard = secondCard = undefined;
  busy = false;
  createGameGrid(numberOfCards);
  setup();
});

const createGameGrid = (numberOfCards) => {
  const gameGrid = $("#game_grid");
  gameGrid.empty();
  const totalImages = 9;
  for (let i = 0; i < numberOfCards / 2; i++) {
    const imageNumber = (i % totalImages) + 1;
    const imageName = String(imageNumber).padStart(3, "0");
    const card1 = createCardElement(imageName);
    const card2 = createCardElement(imageName);
    gameGrid.append(card1, card2);
  }
  gameGrid.append(gameGrid.children().sort(() => Math.random() - 0.5));
};

const createCardElement = (imageName) => {
  const card = $("<div>").addClass("card");
  const frontFace = $("<img>")
    .addClass("front_face")
    .attr("src", `${imageName}.png`);
  const backFace = $("<img>").addClass("back_face").attr("src", "back.webp");
  card.append(frontFace, backFace);
  return card;
};

const setup = () => {
  let firstCard = undefined;
  let secondCard = undefined;
  let busy = false;
  let matchedCards = [];
  let clickCount = 0;
  let totalPairs = $(".card").length / 2;
  $("#total_pairs").text(`Total pairs: ${totalPairs}`);
  $("#pairs_left").text(`Pairs left: ${totalPairs}`);

  $(".card")
    .off("click")
    .on("click", function () {
      if (
        !gameStarted ||
        busy ||
        $(this).hasClass("match") ||
        (firstCard && firstCard[0] == this)
      )
        return;
      clickCount++;
      $("#click_count").text(`Clicks: ${clickCount}`);
      $(this).addClass("flip");
      if (!firstCard) {
        firstCard = $(this);
      } else {
        busy = true;
        secondCard = $(this);
        if (
          firstCard.find(".front_face").attr("src") ===
          secondCard.find(".front_face").attr("src")
        ) {
          matchedCards.push(firstCard, secondCard);
          $("#pairs_matched").text(`Pairs matched: ${matchedCards.length / 2}`);
          $("#pairs_left").text(
            `Pairs left: ${totalPairs - matchedCards.length / 2}`
          );
          if (matchedCards.length === $(".card").length) {
            clearInterval(gameInterval);
            gameStarted = false;
            $("#message").text("You won!");
          }
          firstCard = secondCard = undefined;
          busy = false;
        } else {
          setTimeout(() => {
            firstCard.removeClass("flip");
            secondCard.removeClass("flip");
            firstCard = secondCard = undefined;
            busy = false;
          }, 1000);
        }
      }
      if (hasPowerUp()) {
        alert("Power up!");

        const unmatchedCards = $(".card").not(".flip");
        unmatchedCards.addClass("flip");

        setTimeout(() => {
          unmatchedCards.removeClass("flip");
        }, 3000);
      }
    });

  $("#start_game")
    .off("click")
    .on("click", function () {
      if (gameStarted) return;
      gameStarted = true;
      gameInterval = setInterval(() => {
        timer--;
        $("#timer").text(`Time: ${timer}`);
        if (timer <= 0) {
          clearInterval(gameInterval);
          gameStarted = false;
          $("#message").text("Time's up!");
        }
      }, 1000);
    });

  $("#reset_game")
    .off("click")
    .on("click", function () {
      clearInterval(gameInterval);
      gameStarted = false;
      timer = difficultyTime[$("#difficulty").val()];
      $(".card").removeClass("flip match");
      $("#click_count").text(`Clicks: 0`);
      $("#pairs_matched").text(`Pairs matched: 0`);
      $("#pairs_left").text(`Pairs left: ${totalPairs}`);
      $("#timer").text(`Time: ${timer}`);
      $("#message").text("");
      firstCard = secondCard = undefined;
      busy = false;
      matchedCards = [];
      clickCount = 0;
    });
};

$(document).ready(() => {
  $("body").addClass("light-theme");
  const initialDifficulty = $("#difficulty").val();
  timer = difficultyTime[initialDifficulty];
  createGameGrid(initialDifficulty);
  setup();
});
