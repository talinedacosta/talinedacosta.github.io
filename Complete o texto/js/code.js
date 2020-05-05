$(document).ready(function () {

    var incorrect = 0,
        start = 0,
        total = 0,
        dataJson,
        arraySelection = [],
        arrayTexts = false,
        totalInputs = [],
        completed = [],
        actual = 0,
        inputs = [],
        mobile = false;

    loadData();

    $('.btn-low-vision').on('click', function () {
        $('.contentText .text').toggleClass('color-black');
        $('.inputWord').toggleClass('color-white bg-black');
        $('.carousel-control-next').toggleClass('color-black');
        $('.carousel-control-prev').toggleClass('color-black');


        $('html').toggleClass('low-vision');
        $('.selection').toggleClass('low-vision');
    });

    $('.startbtn').click(function () {
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

        var fileJson = $.getJSON("dados.json", function (data) {

            dataJson = data;
            total = dataJson.paginas.length;

            if (total > 1) {
                arrayTexts = true;

            } else {
                arrayTexts = false;
            }
            inputfilled(0);
            carousel(total);
        })

    }

    if (/Android|webOS|iPhone|iPad|iPod|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        mobile = true;
    }

    function carousel(number) {
        if (arrayTexts == false) {
            $('.carousel-indicators').append('<li data-target="#carousel" data-slide-to="0"></li>');
            $('.carousel-inner').addClass('one').append('<div class="carousel-item"></div>');
            $('.carousel-control-next').remove();
            $('.carousel-control-prev').remove();
            $('.carousel-indicators').css('bottom', '13px')
        } else {
            for (let i = 0; i < number; i++) {
                $('.carousel-indicators').append('<li data-target="#carousel" data-slide-to="' + [i] + '"></li>');
                $('.carousel-inner').append('<div class="carousel-item"></div>');
            };
        }

        $('.carousel-item').each(function (i) {
            $(this).append('<div class="content"> <div class="contentWords"><div class="titleWords">Palavras <span class="close">x</span></div> <div class="selection"></div></div> <div class="contentText"><h4 class="title"></h4> <p class="text"></p></div> </div><div class="check">Conferir</div>');
            $(this).attr('data-id', i);
        })


        $('.carousel-inner > div:first-of-type').addClass('active'); // start from 0
        $('.carousel-indicators > li:first-of-type').addClass('active'); // start from 0

        $('.text').each(function (i) {
            $(this).attr('data-id', i);
        })

        $('.contentWords').each(function (i) {
            $(this).attr('data-id', i);
        })

        $('.selection').each(function (i) {
            $(this).attr('data-id', i);
        })

        $('.check').each(function (i) {
            $(this).attr('data-id', i).css('visibility', 'hidden').off();
        })

        textswords()
    }

    function textswords() {

        $('.text').each(function (i, item) {
            var page = $(item).attr('data-id');
            var actualText = dataJson.paginas[i].texto;
            $(this).empty().append(actualText);

            var actualWords = actualText.match(/<lacuna>(.*?)<\/lacuna>/g).map(function (val) {
                return val.replace(/<\/?lacuna>/g, '');
            })

            arraySelection.push(actualWords)

            $('lacuna').each(function () {

                $(this).replaceWith('<div class="inputDiv"><input data-id=' + page + '><div class="clean" data-id=' + page + '></div></div>');

                $("input[data-id= '" + page + "' ]").each(function (i) {
                    $(this).attr({
                        id: i,
                        type: "text",
                        name: "inputWord",
                        class: "droppable inputWord",
                        word: ""
                    })
                })

                $(".clean[data-id= '" + page + "' ]").each(function (i) {
                    $(this).attr({
                        id: i
                    })
                })
            })
        })

        $('.title').each(function (i) {
            $(this).text(dataJson.paginas[i].titulo)
        })


        for (var i = 0; i < arraySelection.length; i++) {
            totalInputs[i] = arraySelection[i].length;
            completed[i] = 0;
        }

        $('.selection').each(function (index, item) {
            var words, otherWords;
            $(this).empty().append();

            words = arraySelection;
            otherWords = dataJson.paginas[index].outrasPalavras;


            for (var i = 0; i < words[index].length; i++) {
                $("<div>", {
                    class: 'word',
                    text: words[index][i],
                    'data-text': i
                }).appendTo(this)
            }

            for (var j = 0; j < otherWords.length; j++) {
                $("<div>", {
                    class: 'word',
                    text: otherWords[j]
                }).appendTo(this)
            }
        })
        isMobile();
        dragdrop()

        $('.carousel-item').each(function (index) {
            randomPosition(index)
        })
    }

    function inputfilled(actual) {

        setTimeout(function () {
            $(".text input[data-id='" + actual + "']").each(function (index, item) {
                inputs[index] = '';

                var allInputs = $(".text input[data-id='" + actual + "']");

                $(this).on('input', function (e) {
                    var item = e.currentTarget;
                    $(this).attr('word', $(this).val())

                    if ($(this).hasClass('correct') == false) {
                        $(this).css('border-bottom', 'none');
                    }

                    if (item.value === '' || item.value === null) {
                        $(item).attr('filled', 'false');
                    } else {
                        $(item).attr('filled', 'true');
                    }
                    checkbutton();
                });


                $(this).focusout(function () {
                    inputs[index] = $(this).val()

                    $(".selection[data-id='" + actual + "']>div").each(function (index, item) {
                        for (var i = 0; i < arraySelection[actual].length; i++) {
                            if (arraySelection[actual].indexOf(inputs[i]) !== -1) {
                                if (inputs.indexOf($(this).text()) !== -1) {
                                    $(this).addClass('used').draggable('disable')

                                } else {
                                    $(this).removeClass('used').draggable('enable')
                                }
                            } else {
                                if (inputs[i].length === 0) {
                                    if (inputs.indexOf($(this).text()) !== -1) {
                                        $(this).addClass('used').draggable('disable')

                                    } else {
                                        $(this).removeClass('used').draggable('enable')
                                    }
                                }
                            }
                        }
                    })
                })
            })

            if (mobile == true) {
                $('.clean[data-id=' + actual + ']').on('click', function () {
                    var id = $(this).attr('id');

                    if (!$('.text[data-id=' + actual + '] .inputWord[id=' + id + ']').hasClass('correct')) {
                        var inputActual = $('.text[data-id=' + actual + '] .inputWord[id=' + id + ']').val();
                        $('.contentWords[data-id=' + actual + ']').fadeIn();
                        setTimeout(function () {
                            $('.text[data-id=' + actual + '] .inputWord[id=' + id + ']').val('').attr('filled', 'false').attr('word', '');
                            $(".selection[data-id='" + actual + "'] .word").each(function (index, item) {
                                if ($(this).text() == inputActual) {
                                    $(this).removeClass('used').draggable('enable');
                                }
                            })

                        }, 500);

                    }
                });
            }

        }, 100)


    }

    function checkbutton() {
        var totalFilled = 0;
        var allInputs = $(".text input[data-id='" + actual + "']");

        for (var i = 0; i < arraySelection[actual].length; i++) {
            if ($(allInputs[i]).attr('filled') === 'true') {
                totalFilled++;
            }
        }

        if (totalFilled == allInputs.length) {
            $(".check[data-id='" + actual + "']").addClass('active');
            if (mobile == false) {
                $(".check[data-id='" + actual + "']").css('visibility', 'visible').on().animate({
                    right: 0,
                }, 300);
            } else {
                $(".check[data-id='" + actual + "']").css('visibility', 'visible').on().animate({
                    opacity: 1,
                }, 300);
            }
            check();
        } else {
            $(".check[data-id='" + actual + "']").removeClass('active');
            if (mobile == false) {
                $(".check[data-id='" + actual + "']").animate({
                    right: '-189px'
                }, 300).css('visibility', 'hidden').off();
            } else {
                $(".check[data-id='" + actual + "']").css('visibility', 'hidden').off().animate({
                    opacity: 0,
                }, 300);
            }
        }
    }

    function check() {
        var allFilled = false;

        $(document).keypress(function (event) {
            if (event.which === 13 && $('.check').css('visibility') === 'visible') {
                confirm();
            }
        })

        $(".check").click(function () {
            confirm()
        })

        function confirm() {

            $(".text[data-id='" + actual + "'] input").each(function () {

                if ($(this).hasClass('correct') == false) {

                    if ($(this).val() === arraySelection[actual][$(this).attr('id')]) {
                        completed[actual]++;
                        $(this).css('border-bottom', '2px solid #5cb722').prop('disabled', true);

                        $(".selection[data-id='" + actual + "'] .word:contains('" + $(this).val() + "')").addClass('disabled');

                        $(this).addClass('correct').removeClass('droppable');
                        $(this).parent().find('.clean').remove();
                        console.log()

                    } else {

                        $(this).css('border-bottom', '2px solid #e74c3c');

                    }
                }

            })


            if (completed[actual] == totalInputs[actual]) {
                $("li[data-slide-to='" + actual + "']").removeClass('wordIncorrect').addClass('wordCompleted');
                $(".check[data-id='" + actual + "']").off().css({
                    display: "none"
                }).removeClass('active');
                $("input[data-id='" + actual + "']").prop('disabled', true).css('border-bottom', '2px solid #5cb722');
            } else {
                $("li[data-slide-to='" + actual + "']").addClass('wordIncorrect');
                if (mobile == true) {
                    $(".check[data-id='" + actual + "']").css('visibility', 'hidden').off().animate({
                        opacity: 0,
                    }, 300).removeClass('active');
                }
            }
        }
    }

    function dragdrop() {
        var word = '';


        $('.word').draggable({
            zIndex: 10,
            snap: '.droppable',
            helper: "clone",
            scroll: true,
            start: function () {
                var contentSize = $('.contentWords[data-id=' + actual + ']').height();

                $('.contentWords[data-id=' + actual + ']').animate({
                    bottom: "-" + contentSize + ""
                }, 500);
            },
            revert: function (is_valid_drop) {
                var contentSize = $('.contentWords[data-id=' + actual + ']').height();

                if (!is_valid_drop) {
                    $('.contentWords[data-id=' + actual + ']').animate({
                        bottom: "0"
                    }, 500);
                } else {

                    return true
                }
            }
        });

        $('.droppable').droppable({
            accept: '.word',
            drop: function (event, ui) {
                var textDrag = ui.draggable.text();
                var drags = ui.draggable;
                var index = event.target.id;
                $('.contentWords[data-id=' + actual + ']').animate({
                    bottom: "0"
                }, 500);
                if (!$(this).hasClass('correct')) {
                    $(ui.draggable).addClass('used').draggable("disable");


                    $(this).attr('word', $(this).val());

                    if ($(this).attr('filled') == 'true') {
                        word = $(this).attr('word');

                        $(".selection[data-id='" + actual + "']>div").each(function (index, item) {
                            if (inputs.indexOf(word) !== -1) {

                                if ($(item).text() == word) {
                                    $(item).removeClass('used').draggable('enable')
                                    word = '';
                                }
                            }
                        })

                    }
                    inputs[index] = textDrag;

                    $(this).attr('filled', 'true');
                    $(this).val(textDrag);
                }


                checkbutton();
            }
        });
    }

    function isMobile() {
        if (mobile == true) {
            $(".contentWords").prependTo('#app');
            $(".check").prependTo('#app');

            $('body').on('click', '.close', function () {
                $('.contentWords[data-id=' + actual + ']').fadeOut("slow");

            });


            $('.inputWord').focus(function () {

                $(this).trigger('blur').attr('readonly', 'readonly');

                $('.contentWords[data-id=' + actual + ']').fadeIn("slow");
            })


        }
    }

    function randomPosition(n) {
        $(".selection[data-id='" + n + "']>div").each(function (index, item) {
            var randomPos = Math.floor(Math.random() * arraySelection[n].length);
            $(this).css('order', randomPos)
        })
    }

    $(function () {
        $('#carousel').on('slide.bs.carousel', function (ev) {
            var id = ev.relatedTarget;
            actual = $(id).attr('data-id');
            inputfilled(actual);

            if (mobile == true) {
                $('.contentWords[data-id=' + actual + ']').fadeOut("slow");

                if ($(".check").hasClass('active') && $(".check").attr("data-id") !== actual) {
                    $(".check").css('visibility', 'hidden').on().animate({
                        opacity: 0,
                    }, 300);
                } else if ($(".check").hasClass('active') && $(".check").attr("data-id") === actual) {
                    $(".check").css('visibility', 'visible').on().animate({
                        opacity: 1,
                    }, 300);
                }


            }
        });

        $('.carousel').carousel({
            interval: false
        });
    });

});