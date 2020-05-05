 $(document).ready(function () {

     var dados, start = 0,
         end = 0,
         completed = [],
         incorrect = [],
         actual = 0,
         allCompleted = [],
         allIncorrect = [],
         allGifs = [],
         arrayWords = true,
         dadosWords,
         mobile = false;

     if (/Android|webOS|iPhone|iPad|iPod|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
         mobile = true;
     }

     loadData();

     $('.btn-low-vision').on('click', function () {
         $('.contentText .text').toggleClass('color-black');
         $('.inputWord').toggleClass('color-white bg-black');
         $('.carousel-control-next').toggleClass('color-black');
         $('.carousel-control-prev').toggleClass('color-black');
         $('.tipDiv').toggleClass('color-black');


         $('html').toggleClass('low-vision');
         $('.selection').toggleClass('low-vision');
     });

     $('.startbtn').click(function () {
         //fake loader
         var elem = $("#loader");
         var width = 1;
         var id = setInterval(frame, 10);

         function frame() {
             if (width >= 100) {
                 clearInterval(id);
                 setTimeout(function () {
                     $('#start').css('display', 'none');
                     $('#app').css('display', 'block');
                     $('#low-vision span').remove();
                 }, 1000)

             } else {
                 width++;
                 elem.css('width', width + '%');
             }
         }
     });


     function loadData() {
         var arquivoJson = $.getJSON("dados.json", function (data) {
             dados = data;
             dadosWords = dados.palavras

             if (dadosWords.length > 1) {
                 arrayWords = true;
             } else {
                 arrayWords = false;
             }

             ObjectStructure()

         });

     }

     function ObjectStructure() {

         if (arrayWords == false) {
             $('.carousel-indicators').addClass('one').append('<li data-target="#carousel" data-slide-to="0"></li>');
             $('.carousel-inner').append('<div class="carousel-item"></div>');
             $('.carousel-control-next').remove();
             $('.carousel-control-prev').remove();
             $('.carousel-indicators').css('bottom', '13px')
             completed[0] = 0;


         } else {
             for (let i = 0; i < dadosWords.length; i++) {
                 $('.carousel-indicators').append('<li data-target="#carousel" data-slide-to="' + [i] + '"></li>');
                 $('.carousel-inner').append('<div class="carousel-item"></div>');
                 completed[i] = 0;
             };
         }

         $('.carousel-item').each(function (i) {
             $(this).append('<div class="middle"><div class="tip"></div><div class="word"></div><div class="keyboard"></div></div><div class="animation"></div>');
             $(this).attr('data-window', i);
         })

         $('.carousel-inner > div:first-of-type').addClass('active'); // start from 0
         $('.carousel-indicators > li:first-of-type').addClass('active'); // start from 0

         $('.keyboard').each(function (i) {
             $(this).attr('data-keyboard', i);
         })

         $('.word').each(function (i) {
             $(this).attr('data-word', i);
         })

         $('.tip').each(function (i) {
             $(this).attr('data-tip', i);
         })

         $('.animation').each(function (i) {
             $(this).attr('data-animation', i);
         })

         var words, wordsSplitted, wordsNotAccents = [],
             wordsLength = [],
             allwords = [],
             allWordsKey = [];

         VirtualKeyboard();
         Words();
         Tips();
         Animation();


         /*************************************************/

         function VirtualKeyboard() {

             var alphabet = "QWERTYUIOPASDFGHJKLÇZXCVBNM";
             alphabet = alphabet.toString().toLowerCase();
             var letters = alphabet.split("");
             var wordsLength = $('.carousel-item').length;

             for (let i = 0; i < letters.length; i++) {

                 $("<div/>", {
                         "class": "keyDiv",
                         text: letters[i],
                         "data-letter": letters[i],
                         "data-keyboard": '',
                         tabIndex: 0,
                         click: function () {

                             var dataLetterKey = $(this).attr('data-letter');

                             var letterKey = $(this);

                             if ($(this).hasClass('clicked') === false) {
                                 checkAnswer(letterKey);
                                 $(this).addClass('clicked')
                             }
                         }
                     })
                     .appendTo(".keyboard");
             }
             $('.keyboard').each(function (index) {
                 $(this).children('.keyDiv').attr("data-keyboard", index)
             });

         }

         /*************************************************/

         function Words() {
             var i, j;

             $('.word').each(function (index, item) {

                 words = dadosWords[index].toLowerCase();
                 wordsSplitted = words.split("");
                 allwords.push(wordsSplitted);

                 wordsNotAccents = removeAccents(words);
                 allWordsKey.push(wordsNotAccents.split(""));

                 wordsLength = dadosWords[index].split(" ");


                 for (j = 0; j < wordsLength.length; j++) {
                     $("<div/>", {
                         "class": "wordBox",
                         "data-word": index,
                         "data-box": j
                     }).appendTo(this)

                 }

                 $('.wordBox[data-word=' + index + ']').each(function (number, item) {

                     for (i = 0; i < wordsLength[number].length; i++) {
                         $("<div/>", {
                             "class": "wordDiv",
                             text: " ",
                             "data-letter": i,
                             "data-answer": i,
                             "data-word": index
                         }).appendTo(this)

                     }
                     specialChar(number, index)

                 })
                 spaces(index)
             });


             function removeAccents(text) {
                 text = text.toLowerCase();
                 text = text.replace(new RegExp('[ÁÀÂÃ]', 'gi'), 'a');
                 text = text.replace(new RegExp('[ÉÈÊ]', 'gi'), 'e');
                 text = text.replace(new RegExp('[ÍÌÎ]', 'gi'), 'i');
                 text = text.replace(new RegExp('[ÓÒÔÕ]', 'gi'), 'o');
                 text = text.replace(new RegExp('[ÚÙÛ]', 'gi'), 'u');
                 return text;
             }

             for (var i = 0; i < allwords.length; i++) {
                 incorrect[i] = 0;
                 allCompleted[i] = allwords[i].length;
                 allIncorrect[i] = 5;
             }

         }

         function specialChar(n, idx) {

             var wordsS, wordsSplittedS, spaces = [],
                 hyphens = [],
                 total = 0;

             wordsLength = dadosWords[idx].split(" ");
             wordsS = wordsLength[n].toLowerCase();
             wordsSplittedS = wordsS.split("");

             for (i = 0; i < wordsSplittedS.length; i++) {

                 if (wordsSplittedS[i] === '-') {
                     hyphens.push(i);
                     $(" .word[data-word= " + idx + " ] .wordBox[data-box=" + n + "] > .wordDiv[data-letter='" + [i] + "'] ").css('borderBottom', 'none').text("-").addClass('special');
                     total++;
                     completed[idx] += total;
                 }
             }

         }

         function spaces(idx) {
             var total = 0;
             for (var j = 0; j < allwords[idx].length; j++) {
                 if (allwords[idx][j] === " ") {
                     total++
                     completed[idx] += total;
                     total = 0;
                 }
             }
         }

         /*************************************************/

         function Tips() {
             var tips, i;

             $('.tip').each(function (index) {

                 tips = dados.pistas[index];

                 $("<p/>", {
                         "class": "tipDiv",
                         html: "<span>DICA:</span>" + " " + tips
                     })
                     .appendTo(this);
             });
         }

         /************************************************/
         function Animation() {

             if (mobile == false) {
                 $('.animation').each(function (index) {

                     $("<div/>", {
                             "class": "gifText",
                             "text": "ERROS: 0/5",
                             "data-animation": $(this).attr('data-animation')
                         })
                         .appendTo(this);

                     $("<div/>", {
                             "class": "animationSprite",
                             "data-animation": $(this).attr('data-animation')
                         })
                         .appendTo(this);

                 });


                 $(".animationSprite").animateSprite({
                     fps: 24,
                     animations: {
                         1: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19],
                         2: [20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39],
                         3: [40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59],
                         4: [60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79],
                         5: [80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100]
                     },
                     loop: false,
                     autoplay: false
                 });

             }

         }

         /************************************************/

         $(".keyDiv").focusin(function () {
             var actualKey = $(this);
             $(this).keypress(function (event) {
                 if (event.which == 13) {
                     if ($(this).hasClass('clicked') === false) {
                         checkAnswer(actualKey);
                         $(this).addClass('clicked')
                     }
                 }
             })

         });

         //REAL KEYBOARD
         $("body").keypress(function (e) {
             var keyPress = (e.key);
             var s = String.fromCharCode(e.which);
             if (s.toUpperCase() === s && s.toLowerCase() !== s && !e.shiftKey) {
                 keyPress = keyPress.toString().toLowerCase();
             } else {
                 keyPress = keyPress.toString().toLowerCase();
             }


             var divKey = $(".keyDiv[data-keyboard='" + actual + "'][data-letter='" + keyPress + "']")
             if ((e.which >= 97 && e.which <= 122 || e.which == 231 || e.which == 45) && $(divKey).hasClass('clicked') === false) {

                 checkAnswer(divKey);
                 $(divKey).addClass('clicked');
             }

         })

         /*************************************************/

         function checkAnswer(letterkey) {

             var wordsSplit = allWordsKey[actual].join("").split(" ");
             var wordsASplit = allwords[actual].join("").split(" ");

             var dataLetterKeyboard = $(letterkey).attr("data-letter");

             if ($(letterkey).attr('data-keyboard') == actual) {
                 var keyActual = $(this);

                 if (allWordsKey[actual].includes(dataLetterKeyboard)) {

                     for (var i = 0; i < wordsSplit.length; i++) {
                         wordsSplit[i] = wordsSplit[i].toLowerCase();

                         if (wordsSplit[i].includes(dataLetterKeyboard)) {

                             for (var j = 0; j < wordsSplit[i].length; j++) {

                                 if (wordsSplit[i][j] === dataLetterKeyboard) {
                                     letterkey.addClass('clicked');
                                     completed[actual]++;
                                     $(".wordBox[data-box=" + i + "] .wordDiv[data-word='" + actual + "'][data-letter='" + j + "']").text(wordsASplit[i][j]).css('border-bottom', 'none');
                                 }
                             }
                         }

                     }
                 } else {
                     letterkey.addClass('clicked wordDivIncorrect');
                     incorrect[actual]++;
                     animationIncorrect(actual, incorrect[actual]);
                 }
             }

             windowCheck();

         }

         /*************************************************/

         function windowCheck() {
             if (allCompleted[actual] === completed[actual]) {
                 allCompleteds(actual);
             }

             if (allIncorrect[actual] === incorrect[actual]) {
                 allIncorrects(actual);
             }
         }

         function allCompleteds(i) {
             $("li[data-slide-to='" + i + "']").addClass('wordCompleted');
             $(".keyDiv[data-keyboard='" + i + "']").addClass('clicked');

             $(".animation[data-animation='" + i + "']").animate({
                 opacity: 0
             }, 700, function () {
                 if (mobile == false) {
                     $(".animation[data-animation='" + i + "']").empty().append("<img src='images/spritesheet/end.png' class='gif' style='right:57px;'>");
                     gifTransition();
                 }
             })

             function gifTransition() {

                 $(".animation[data-animation='" + i + "']").animate({
                     opacity: 1
                 }, 700, function () {

                 })
             }


         }

         function allIncorrects(i) {

             $("li[data-slide-to='" + i + "']").addClass('wordIncorrect');

             $(".animation[data-animation='" + i + "']").append("<div class='tryAgain' data-window='" + i + "' tabIndex='0'>tentar novamente</div>").find('.gifText').remove()

             $(".keyDiv[data-keyboard='" + i + "']").addClass('clicked');

             $('.tryAgain').click(function () {
                 Reset();

             });

         }

         function animationIncorrect(window, index) {

             $(".animationSprite[data-animation='" + window + "']").animateSprite('play', index.toString());
             $(".gifText[data-animation='" + window + "']").text("ERROS: " + index + "/5 ")

         }

         function Reset() {

             $(".wordDiv[data-word='" + actual + "']").empty().css('border-bottom', ' 2px solid #b8b8b8');
             $(".keyDiv[data-keyboard='" + actual + "']").removeClass('clicked').removeClass('wordDivIncorrect');
             $("li[data-slide-to='" + actual + "']").removeClass('wordIncorrect');
             $(".tryAgain[data-window='" + actual + "']").remove();
             if (mobile == false) {
                 $(".animation[data-animation='" + actual + "']").append("<div class='gifText' data-animation='" + actual + "'>ERROS 0/5</div>")
                 $('.animationSprite').animateSprite('frame', 0)
             }

             incorrect[actual] = 0;
             completed[actual] = 0;
             spaces(actual)
             $('.wordBox[data-word=' + actual + ']').each(function (index, item) {
                 specialChar(index, actual)
             })
         }
     }

     $(function () {

         $('#carousel').on('slide.bs.carousel', function (ev) {
             var id = ev.relatedTarget;
             actual = $(id).attr('data-window');
         });
         $('.carousel').carousel({
             interval: false
         });
     });


 });