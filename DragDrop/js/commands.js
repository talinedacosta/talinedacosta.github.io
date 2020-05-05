$(document).ready(function() {
    
        let lastPlace; //last selection of drag div
        let changetitle;
        var imgs = ["imagens/quem.png","imagens/recursos.png","imagens/entradas.png","imagens/entradas.png","imagens/saidas.png","imagens/como.png","imagens/indicadores.png"];
     
        // Reset the game
        correctCards = 0;
        wrongCards = 0;
        addedCards = 0;
    
        // Create draggable div
        let numbers = [1,2,3,4,5,6,7];
 
        for (let i=0; i < numbers.length; i++) {
            $('<div></div>').data('number', i ).attr('id', 'cardDrag'+ numbers[i] ).appendTo('#cardPile').attr('correct','d' + numbers[i]);;
            
        }

        $('#cardPile div').draggable({
            zIndex: 10,
            snap: '#cardSlots div',
            snapMode: 'inner',
            start: function (event, ui) {
                lastPlace = $(this).parent(); 
                
            },
            drag: function( event ) {
               $('.info').css('background','rgba(255, 255, 255, 0.30)');
                $('.data').css('background','rgba(255, 255, 255, 0.30)');                
                $('#blackBox').css('background','linear-gradient(rgba(0, 0, 0, 0.15), rgba(0, 0, 0, 0.15))');
                                               
                $(this).removeClass('add'); 
                $(this).css('width','240px'); 
                $(this).css('height','180px');  
                $(this).css('visibility','visible'); 
                
                $('#menuPile').find('span').html('MENU DE OPÇÕES');
                $('#cardPile').css('visibility','hidden');
                $('#cardPile').css('bottom','0');
                $('#cardPile').css('pointer-events','none');  
                                
                if ($(this).hasClass('TitleDrop')){
                    $(this).remove($('#cardDrop').attr('label'));
                }
                
                for (let i=0; i<numbers.length; i++){
                    $('#cardDrag'+ [i+1]).find('.arrow_box').remove();
                    $('#cardDrag'+ [i+1]).find('.arrow_box_bottom').remove();
                    $('#cardDrag'+ [i+1]).css('border-bottom','');
                }
                               
            },
            revert: function(event, ui){
                $(this).find('p:first').html($(this).parent().attr('label'));
               
                if($(this).parent('#cardPile')){
                    $('.info').css('background','#ffffff');
                    $('.data').css('background','#ffffff');
                    $('#cardPile').css('bottom','-395px');
                    $('#cardPile').css('visibility','hidden');
                    $('#cardPile').css('pointer-events','none'); 
                     $('#blackBox').css('background','transparent');
                    return true; 
                };                
            },
            
        });
     
        // Create droppable div
        let words = ['QUEM', 'RECURSOS', 'ENTRADA', 'PROCESSO', 'SAÍDA', 'COMO', 'INDICADORES']
        let drops = [1,2,3,4,5,6,7];
      
        
        for (let i=0; i< drops.length; i++) {
            $('<div></div>').data('number', i ).attr('id', 'cardDrop' + drops[i] ).appendTo('#cardSlots').attr('label',words[i]).css('background', 'url(' + imgs[i] + ')').attr('selfImg',imgs[i]).attr('correct','d' + drops[i]);
        }

        $('#cardSlots div').droppable({
             
            drop: function (event, ui) {
                let slotNumber = $(this).data('number');
                let cardNumber = ui.draggable.data('number');
                let dropped = ui.draggable;
                let droppedOn = this;
                                                
                $(droppedOn).addClass('added');
                addedCards++;
                $(dropped).addClass('add');  
                $(dropped).addClass('Titledrop');
                
                if($(dropped).hasClass('Titledrop')){
                    $(droppedOn).css('border','1px dashed transparent')
                
                }
              
                if(addedCards == 6 ){
                    $('#check').css('display','block') 
                 }
                // change of place div               
                if(!$(droppedOn).hasClass('correct')) {
                    if ($(droppedOn).children().length > 0) {
                       var divChanged = $(droppedOn).children().detach().prependTo($(lastPlace)); 
                 }                    
                    
                    $(dropped).detach().css({
                        top: 0,
                        left: 0
                    }).prependTo($(droppedOn));                    
                }; 
                                
                // change dropTitle
                 $(divChanged).find('p:first').html($(divChanged).parent().attr('label'));           
                 $(dropped).find('p:first').html($(droppedOn).attr('label'));
                 
                $('#blackBox').css('background','transparent');
                $('.info').css('background','#ffffff');
                $('.data').css('background','#ffffff');
                
                if($('#cardPile').children().length == 1){
                    $('#cardPile').remove();
                    $('#menuPile').remove();                           
           };

               
                
                                 
            },
            over: function (event, ui){
             let dropped = ui.draggable;
             let droppedOn = this; 
             let selImg = $(this).attr('selfImg');
                
            $(droppedOn).css('background', 'linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 0)), url(' + selImg + ')');
                     
            $(dropped).find('p:first').html($(droppedOn).attr('label'));
            },
            out: function (event, ui){
             let dropped = ui.draggable;
             let droppedOn = this; 
             let selImg = $(this).attr('selfImg');
              $(droppedOn).css('background', 'linear-gradient(rgba(0, 0, 0, 0.15), rgba(0, 0, 0, 0.15)), url(' + selImg + ')');
            },
            activate: function(event, ui) {
             let dropped = ui.draggable;
             let droppedOn = this; 
             let selImg = $(this).attr('selfImg');
              $(droppedOn).css('background', 'linear-gradient(rgba(0, 0, 0, 0.15), rgba(0, 0, 0, 0.15)), url(' + selImg + ')');
              
            },
            deactivate: function(event, ui) {
             let dropped = ui.draggable;
             let droppedOn = this; 
             let selImg = $(this).attr('selfImg');
              $(droppedOn).css('background', 'linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 0)), url(' + selImg + ')');
                
            },
                                  
        });  
      
        $('#cardDrop4').droppable( "disable" );
    
    // menu hover 
    $('#menuPile').hover(function() {
                
                if($('#cardPile').children().length > 1){
                    $(this).css('cursor','pointer')
                    $('#menuPile').find('span').html('CLIQUE E SEGURE UM BLOCO PARA ARRASTÁ-LO E SOLTÁ-LO EM UM ESPAÇO DISPONÍVEL');
                    
                    $('#cardPile div').find('p:first').html('');
                    $('#cardPile div').css('visibility','');
                    $('#cardPile div').css('width','221px'); 
                    $('#cardPile div').css('height','161px'); 
               
                    $('#cardPile').css('visibility','visible');
                    $('#cardPile').css('bottom','0');
                    $('#cardPile').css('pointer-events','all');
                
                    if($('#cardPile').children().length == 4){
                        $('#cardPile').css('height','216px')
                    }
                } 
                
            });
    
    // check answers 
    $('#check').click(function(event,ui) { 
        
                        
             for (let i=0; i<numbers.length; i++){
                 var draggables =  $('#cardDrag' + [i+1]);
                 var droppables = $('#cardDrag' + [i+1]).parent();
                             
            if ( $(draggables).attr('correct') === $(droppables).attr('correct') ){
                $(draggables).css('cursor','default');
                $(draggables).draggable('disable');
                $(draggables).addClass('correct');
                $(droppables).addClass('correct');                
                 correctCards++;
                console.log(correctCards);
            };  
                 
            if ($(draggables).attr('correct') != $(droppables).attr('correct') ){
                $(draggables).append('<div class="arrow_box"><h1 class="logo">ERRADO!</h1></div>'); 
                $(draggables).css('border-bottom','3px solid #e84c3c');
                $(draggables).removeClass('correct');
                $(draggables).draggable('enable');  
                wrongCards++;
                if ( wrongCards >= 1 ) {
                    correctCards = 0;
                }
               
            };
                 
             if ($('#cardDrag' + i).parent().hasClass('correct')){
                 $('#cardDrag' + i).parent().css({
                     border:'1px dashed transparent',
                 });
             }
                 
                        
             if ( correctCards == 6 ) {
                 $('#download').css('display','block');
                 $('#check').remove();
             }
        
        }
            
        });
    
     $('#download').click(function(event) { 
         window.print();
     });
    
    //inicar intruções
    $('#iniciar_btn').click(function(){
        $('#iniciar').remove();    
    });   
    
    // form name 
    $(function() {
        //open
        $('[data-popup-open]').on('click', function(e)  {
            $('#instrucao').remove();
            
            var targeted_popup_class = jQuery(this).attr('data-popup-open'); 
            $('[data-popup="' + targeted_popup_class + '"]').fadeIn(350);
            e.preventDefault();
        }); 
        
        //close
        $('[data-popup-close]').on('click', function(e)  {
            if($('#name').val().length > 0){
                var targeted_popup_class = jQuery(this).attr('data-popup-close');
            $('[data-popup="' + targeted_popup_class + '"]').fadeOut(350);
            var nome = $('#name').val();
            $('#info_nome').html(nome);
            e.preventDefault();
            
            } 
            if($('#name').val().length === 0){
                $('#name').addClass('input-required').attr('placeholder','Por favor, insira seu nome.');
            
            }            
         });
        $('#name').keypress(function (e) {
             var key = e.which;
             if(key == 13)  // the enter key code
             {
                 if($('#name').val().length > 0){
                     var targeted_popup_class = jQuery('[data-popup-close]').attr('data-popup-close');
                     $('[data-popup="' + targeted_popup_class + '"]').fadeOut(350);
                     var nome = $('#name').val();
                     $('#info_nome').html(nome);
                     e.preventDefault();
                 }
                 if($('#name').val().length === 0){
                $('#name').attr('placeholder','Por favor, insira seu nome.');
            
            }
             }
});
    });
    
    //date  
    var hoje = moment().format('L'); 
    var next = moment().add(1,'months').format('L');    
    $('#dateToday').html(hoje);    
    $('#dateNext').html(next); 
    
            
      
    //textos drags
    
$( "#cardDrag1" ).html( "<p class='dropTitle'></p><p class='dragText'>Sócios; Coordenadores financeiros; Analista de RH e Técnico do Trabalho.</p>" );
    
$( "#cardDrag2" ).html( "<p class='dropTitle'></p><p class='dragText'>Cadastro de fornecedores de treinamento; Infraestrutura para realizar treinamentos.</p>" );
    
$( "#cardDrag3" ).html( "<p class='dropTitle'></p><p class='dragText'>Solicitação de contratação; Relatório de auditoria interna no RH; Avaliação 360; solicitação de treinamento desenvolvimento; PPRA e PCMSO da empresa e fornecedores.</p>" );
    
$( "#cardDrag4" ).css('display', 'none');
   
$( "#cardDrag5" ).html( "<p class='dropTitle'></p><p class='dragText'>Decisões de análise e melhoria de processos de RH; Programação de treinamento e desenvolvimento; Informação de novos colaboradores e realocação de MO; Avaliação 360; solicitação de treinamento não aprovada com justificativa.</p>" );
   
$( "#cardDrag6" ).html( "<p class='dropTitle'></p><p class='dragText'>Procedimentos de RHUNI-02</p>" );
    
$( "#cardDrag7" ).html( "<p class='dropTitle'></p><p class='dragText'>Taxa de frequência de acidentes; Índice de satisfação do cliente interno; Índice de treinamento.</p>" );
          
});