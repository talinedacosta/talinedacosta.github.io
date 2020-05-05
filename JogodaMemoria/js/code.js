  function dynamicallyLoadScript(url) {
      var script = document.createElement("script");
      document.body.appendChild(script);
  }

  dynamicallyLoadScript('dados.js');

  /**************/

  const startBtn = document.querySelector('.start-btn');

  startBtn.addEventListener('click', function () {
      document.querySelector('.start-game').style.display = 'none';
      document.querySelector('#game').style.display = 'block';
      document.querySelector('#low-vision').removeChild(document.querySelector('#low-vision span'));

  });


  /*****************/


  const btnLowVision = document.querySelector('.btn-low-vision');

  btnLowVision.addEventListener('click', function () {


      document.querySelector('html').classList.toggle('low-vision');



  });

  /********************/

  var dados = array;
  var dadosLength = dados.length;

  const memoryGame = document.querySelector('.memory-game');
  const container = document.querySelector('.container');


  array.forEach(function (el, i) {
      var element = "";
      for (j = 0; j < 2; j++) {

          var memoryCard = document.createElement('div');
          memoryCard.className = 'memory-card';
          memoryCard.setAttribute('data-par', i);
          memoryCard.setAttribute('data-card', j);
          container.appendChild(memoryCard);
          if (j == 1) {
              element = el.cardF;
          } else {
              element = el.cardS;
          }

          var frontFaceDiv = document.createElement('div');
          frontFaceDiv.className = "front-face-div";

          if (element.includes("img/")) {
              var frontFace = document.createElement('img');
              frontFace.setAttribute('src', element);
              frontFaceDiv.appendChild(frontFace);
          } else {
              var frontFace = document.createElement('div');
              frontFace.innerHTML = element;
              frontFaceDiv.appendChild(frontFace);
          }

          frontFace.className = 'front-face';
          memoryCard.appendChild(frontFaceDiv);

      }

  });

  const cards = document.querySelectorAll('.memory-card');

[].forEach.call(cards, (el, i) => {

      var backFace = document.createElement('img');
      backFace.className = 'back-face';
      backFace.setAttribute('src', 'assets/carta.png')

      el.appendChild(backFace);
  });

  /***************************/
  let hasFlippedCard = false;
  let lockBoard = false;
  let firstCard, secondCard;
  let total = 0;

  function flipCard() {
      if (lockBoard) return;
      if (this === firstCard) return;
      this.classList.add('flip');
      if (!hasFlippedCard) {
          hasFlippedCard = true;
          firstCard = this;
          return;
      }

      secondCard = this;
      checkForMatch();

        [].forEach.call(cards, (e, i) => {
          e.classList.remove('wrong');
      });
  }

  function checkForMatch() {
      let isMatch = firstCard.dataset.par === secondCard.dataset.par;
      isMatch ? disableCards() : unflipCards();
  }

  function disableCards() {

      firstCard.className += ' correct';
      secondCard.className += ' correct';

      firstCard.removeEventListener('click', flipCard);
      secondCard.removeEventListener('click', flipCard);

      resetBoard();
      total++;
      setTimeout(() => {
          endGameF(total);
      }, 5000);
  }

  function endGameF(n) {
      const endGame = document.querySelector('.end-game');

      if (n == dadosLength) {
          endGame.style.visibility = "visible";
          endGame.style.opacity = "1";
      }
  }

  function unflipCards() {
      lockBoard = true;
      setTimeout(() => {
          firstCard.classList.add('wrong');
          secondCard.classList.add('wrong');
          firstCard.classList.remove('flip');
          secondCard.classList.remove('flip');
          resetBoard();
      }, 1500);
  }


  function resetBoard() {
      [hasFlippedCard, lockBoard] = [false, false];
      [firstCard, secondCard] = [null, null];
  }

  (function shuffle() {
      cards.forEach(card => {
          let ramdomPos = Math.floor(Math.random() * dadosLength);
          card.style.order = ramdomPos;
      });
  })();


  cards.forEach(card => card.addEventListener('click', flipCard));