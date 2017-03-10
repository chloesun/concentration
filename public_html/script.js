// Name: Chloe Sun
//Student number: 101059882

$(function(){

	var card_values =[];
	var card_ids =[];
	var card_flipped = 0;
	var guessCount = 0;

//initial display
init();

function init(){
	$('.board').hide();
	$('#guessCount').hide();
	$('#newGameText').hide();
	$('#newGameButton').hide();
}

//click submit button, create new user,send post request
$('#submitButton').click(function(){
	$(this).hide();
	$('.board').show();
	$('#guessCount').show();
	$('#nameInput').hide();
	$('#nameText').hide();
	$.post("/memory/intro", JSON.stringify({"username":$('#nameInput').val()})); 
/* //some issue here to fix  $.ajax({
	method: "POST",    
	url: "/memory/intro",
	data: {"username":$('#nameInput').val()},
	success: 
	dataType:"json"
});*/

});


//what happens if you click the card
$('.card').click(function(){
	clickHandler($(this).data("row"), $(this).data("column"));
});



function clickHandler(row, col){
	//send get request to server 
	$.get("/memory/card?row="+row+"&col="+col+"&username="+$('#nameInput').val(), function(data){

		var cardNum = JSON.parse(data); // value from the server side
		var card_id = row*10+col;       // card id 

		if(card_values.length <2 && card_ids.length<2){
			$("#card"+row+col).css("background","#4286f4");
		$("#"+row+col).html(cardNum); // to show the value
		if(card_values.length == 0){
			card_values.push(cardNum);
			card_ids.push(card_id);
			console.log(card_ids);
			console.log(card_values);
		}else if(card_values.length == 1){
			card_values.push(cardNum);
			card_ids.push(card_id);
			console.log(card_ids);
			console.log(card_values);
			// if match
			if(card_values[0]=card_values[1]){
				card_flipped +=2;
			    // clear arrays
			    card_values = [];
			    card_ids =[];
				// check to see if the whole board is cleared
				if (card_flipped == 16){
					alert("Game Over! Generating a new board");
					$('#newGameButton').show();
                }// if not match ,flipback
                /*
                else{
                	
                		var card_1 = $("#card" + card_ids[0]);
                		var card_2 = $("#card" + card_ids[1]);
                        card_1.css("background","#93d89b");
					    $("#" + card_ids[0]).text("");
					    card_2.css("background","#93d89b");
					    $("#" + card_ids[1]).text("");
                        // clear both arrays
                        card_values =[];
                        card_ids =[];
              
          }  */
      }
  }
}

});


}




});// the end 