suits = ['Spades', 'Clubs', 'Diamonds', 'Hearts'];
vals = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]
deck1 = [];
hand = [];
//array used to hold extra hands.  Would make further splitting easier down the line
splitHands = [];
dealer = [];
dealerTurn = false;  //for stopping hitting when we hit
gameOver = true;
betting = true;
splitCount = 0;
balance = 100;
stayCount = 0;
bet = 0;
ogbet = 0;
betTalley = 0;  //count all bets per turn so we know if we can potentially bet more
tbet = [];
var userName = '';


//initialization function
function main(){
    deck1 = []
    
    //5 shoe deck for stephen
    for(var i = 0; i < 5; i++){
        deck1 = deck1.concat(createDeck());        
    }
    
    shuffle(deck1);
    
    myDeck = '';
    aceCount = 0;
    for(var i = 0; i < deck1.length; i++){
        if(i % 52 == 0){
            myDeck = myDeck.concat('\n');
        }
        if(deck1[i].Name == "A"){
            aceCount++;
        }
        try{
            myDeck = myDeck.concat(deck1[i].Name + ' ');
        }catch(TypeError){
            console.log("tried at " + (i*(k+1)));
        }
    }

    /*
    ar = myDeck.split('\n');
    for(var s = 0; s < ar.length; s++){
        console.log(ar[s]);
    }*/

    getHighScores();
}

//creates our deck and shuffles it
function createDeck(){
    deck = [];
    for(var i = 0; i < 4; i++){
        for(var k = 1; k < 14; k++){
            n = k;
            v = k;
            switch(n){
                case 1:
                    n = "A";
                    break;
                case 11:
                    n = "J";
                    v = 10;
                    break;
                case 12:
                    n = "Q";
                    v = 10;
                    break;
                case 13:
                    n = "K";
                    v = 10;
                    break;
            }
            var card = {Value: v, Name: n, Suit: suits[i]};
            deck.push(card);
        } 
    }
    return deck;
}

//shuffles deck by switching two random cards in deck.  50000 is arbitrary but makes for good shuffles  
function shuffle(deck){

    for(var i = 0; i < 50000; i++){
        var ind1 = Math.floor(Math.random() * deck.length);
        var ind2 = Math.floor(Math.random() * deck.length);
        var temp = deck[ind1];
        deck[ind1] = deck[ind2];
        deck[ind2] = temp;
    }  
}

//Uses AJAX to get highscores from PHP/MySQL database 
function getHighScores(){
    function reqListener () {
      console.log(this.responseText);
    }
    
    var topScores = [];
    var oReq = new XMLHttpRequest();
    oReq.onload = function() {      
        answerString = this.responseText;
        topScores = answerString.split('\n');  //PHP handles MySQL query as a string.  Separates rows by \n and columns by -
        scoreboard = document.getElementById('scoreboard');
        scoreboard.innerHTML = "";
        //create a table row and add the info to said tr for top 10 scores in database
        for(var i = 0; i < topScores.length; i++){
            if(topScores[i] == ""){  //adds \n after last row item in PHP
                continue;
            }
            var trow = document.createElement("tr");
            scoreboard.appendChild(trow);
            var scoreVals = topScores[i].split('-');
            var tdown = document.createElement('td');
            tdown.innerHTML = scoreVals[0];
            tdown.className = "left";
            trow.appendChild(tdown);
            tdown = document.createElement('td');
            tdown.innerHTML = scoreVals[1];
            tdown.className = "right";
            trow.appendChild(tdown);
        }
    };
    oReq.open("get", "topscores.php", true);
    oReq.send();   
}

//Sends our current score and username to PHP to handle MySQL queries
function sendScore(){
    function reqListener () {
      console.log(this.responseText);
    }
    
    var oReq = new XMLHttpRequest(); // New request object
    oReq.onload = function() {  
    }; 
    oReq.open("GET", "addscore.php?q=" + document.getElementById('username').value + "-" + balance, true);
    oReq.send();
}


//Deal our deck when we start a game
async function deal(deck){
    if(gameOver){
        //clear win statements
        wins = document.getElementsByClassName('gameover');
        for(var i = 0; i < wins.length; i++){
            wins[i].style.display = 'none';
        }

        //records our bet and doesn't let us pass until we give a valid one
        bet = parseInt(document.getElementById('bet').value, 10);
        if(bet > balance){
            document.getElementById('badbet').style.display = "block";
            return;
        }else if(bet > 0){
            document.getElementById('bet').disabled = true;
            document.getElementById('username').disabled = true;
        }else{
            document.getElementById('badbet').style.display = "block";
            return;
        }
        
        //when we get below one deck length reset to 5 decks and shuffle
        document.getElementById('shuffling').style.display = 'block';
        if(deck.length <= 52){
            main();
            await sleep(1500);
        }
        document.getElementById('shuffling').style.display = 'none';
        
        //clear card image divs and reset vars
        document.getElementById('hand').innerHTML = '';
        document.getElementById('dealer').innerHTML = '';
        document.getElementById('temp').innerHTML = '';
        document.getElementById('temp2').innerHTML = '';
        document.getElementById('hide').style.display = "none";
        hand = [];
        dealer = [];
        splitCount = 0;
        dealerTurn = false;
        splitHands = [];
        tbet = [];
        betTalley = bet;
        ogbet = bet;
        stayCount = 0;
        
        //Log score in database
        sendScore();
        
        //create cards for our hand
        for(var i = 0; i < 2; i++){
            await sleep(300);
            var card = document.createElement("div");
            var icon = '';
            if (deck[i].Suit == 'Hearts'){
                icon='♥';
                s = 'heart';
            }else if (deck[i].Suit == 'Spades'){
                icon = '♠';
                s = "spade";
            }else if (deck[i].Suit == 'Diamonds'){
                icon = '♦';
                s = "diamond";
            }else{
                icon = '♣';
                s = "club";
            }
            card.innerHTML = deck[i].Name + '<br>' + icon;
            card.className = 'card ' + s;
            card.id = "hand" + deck[i].Name + "" + deck[i].Suit;
            document.getElementById("hand").appendChild(card);
        }
        hand.push(deck.shift());
        hand.push(deck.shift());
        
        //create cards for the dealer's hand
        for(var i = 0; i < 2; i++){
            await sleep(300);
            document.getElementById('hide').style.display = "block";
            var card = document.createElement("div");
            var icon = '';
            if (deck[i].Suit == 'Hearts'){
                icon='♥';
                s = 'heart';
            }else if (deck[i].Suit == 'Spades'){
                icon = '♠';
            s = "spade";
            }else if (deck[i].Suit == 'Diamonds'){
                icon = '♦';
                s = 'diamond';
            }else{
                icon = '♣';
                s = 'club';
            }
            card.innerHTML = deck[i].Name + '<br>' + icon;
            card.className = 'card ' + s;
            card.id = "dealer" + deck[i].Name + "" + deck[i].Suit;
            document.getElementById("dealer").appendChild(card);
        }
        dealer.push(deck.shift());
        dealer.push(deck.shift());
        
        //check our hand for a blackjack and end game if we do
        if(checkVals(hand) == -1){
            gameOver = true;
            document.getElementById('blackjack').style.display = "block";
            blackJack();
            return;
        }  
        gameOver = false;  
    }
}

//add a card to whatever hand
function hit(toHand, handName){
    if(!gameOver){
        if(handName == 'hand'){
            //Changes which hand we should be hitting since the hit button calls this function the same no matter the hand
            if(splitCount == 1 && splitHands.length == 1 && checkVals(splitHands[0]) != -1){  //one split
                toHand = splitHands[splitCount - 1];
                handName = 'temp';
            }else if(splitCount == 2){  //two splits
                toHand = splitHands[1];
                handName = 'temp2';
            }else if(splitCount == 1 && splitHands.length == 2){  
                if(stayCount > 0){  //two splits but split on OG hand
                    toHand = splitHands[1];
                    handName = 'temp2';
                }else{  //two splits but first split's turn
                    toHand = splitHands[0];
                    handName = 'temp';
                }
            }
            
            //don't let us hit on dealer's turn
            if(dealerTurn){
                return;
            }
            //make sure we're not able to hit on a blackjack
            if(splitHands.length == 1 && checkVals(splitHands[0]) == -1){
                splitCount = 0;
            }
        }

        //deal next card in deck and draw it on board.  add it to whatever hand is being dealt to
        if(checkVals(toHand) < 21){
            if(handName != "dealer" && dealerTurn){
                return;
            }
            var card = document.createElement("div");
            var icon='';
            if (deck1[0].Suit == 'Hearts'){
                icon='♥';
                s = 'heart';
            }else if (deck1[0].Suit == 'Spades'){
                icon = '♠';
                s = 'spade';
            }else if (deck1[0].Suit == 'Diamonds'){
                icon = '♦';
                s = 'diamond';
            }else{
                icon = '♣';
                s = 'club';
            }
            card.innerHTML = deck1[0].Name + '<br>' + icon;
            card.className = 'card ' + s;
            card.id = handName + deck1[0].Name + "" + deck1[0].Suit;
            document.getElementById(handName).appendChild(card);
            toHand.push(deck1.shift());
        }

        //check for busts immediately following deal
        if(checkVals(toHand) > 21){
            switch (handName){
                case "dealer":
                    gameOver = true;
                    document.getElementById('dbust').style.display = "block";
                    // if dealer busts 
                    for(var i = 0; i < splitHands.length; i++){
                        if(checkVals(splitHands[i]) <= 21 && checkVals(splitHands[i]) != -1){
                            if(i == 0){
                                document.getElementById('twin').style.display = 'block';
                            }else if(i == 1){
                                document.getElementById('ttwin').style.display = 'block';
                            }
                            win(tbet[i]);
                        }
                    }
					//Don't double handle blackjacks and busts
                    if(checkVals(hand) <= 21 && checkVals(hand) != -1){
                        document.getElementById('win').style.display = 'block';
                        win(bet);
                    }
                    break;
                case "hand":
                    lose(bet);
                    document.getElementById('bust').style.display = "block";
                    //check and see if there are more hands yet to play
                    if(splitHands.length == 0){
                        gameOver = true;
                    }else{
                        var bustCount = 0;
                        for(var i = 0; i < splitHands.length; i++){
                            if(checkVals(splitHands[i]) > 21){
                                bustCount++;
                            }
                        }
                        if(bustCount == splitHands.length){
                            gameOver = true;
                        }
                        stay();
                    }
                    break;
                case "temp":
                    lose(tbet[splitCount - 1]);
                    document.getElementById('tbust').style.display = "block";
                    //for when busting when og hand blackjacks on split
                    if(checkVals(hand) == -1){
                        if(splitHands.length == 1){
                            gameOver = true;
                            return;
                        }else if(splitHands.length == 2){
                            if(checkVals(splitHands[1]) == -1 || checkVals(splitHands[1]) > 21){
                                gameOver = true;
                                return;
                            }
                        }
                    }
                    stay();
                    break;
                case "temp2":
                    lose(tbet[splitCount - 1]);
                    document.getElementById('ttbust').style.display = "block";
                    //end game when nobody else to play
                    if(checkVals(hand) == -1 && checkVals(splitHands[0] == -1)){
                        gameOver = true;
                        return;
                    }
                    stay();
                    break;
            }
        }

        //check for blackjack following a deal
        if(checkVals(toHand) == -1){
            blackJack();
            switch(handName){
                case 'temp': 
                    stay();
                    document.getElementById('tblackjack').style.display = 'block';
                    break;
                case 'temp2':
                    document.getElementById('ttblackjack').style.display = 'block';
                    stay();
                    break;   
                case 'hand':
                    document.getElementById('blackjack').style.display = 'block';
                    //Ends game when all hands have blackjack
                    var c = 0;
                    for(var i = 0; i < splitHands.length; i++){
                        if(checkVals(splitHands[i]) == -1){
                            c++;
                        }
                    }
                    if(c == splitHands.length){
                        gameOver = true;
                    }
                    break;
            }
        }
    }
}

//double bet and hit once if we haven't hit yet
function doubleDown(){
    var ourBet;
    //double down on original hand
    if(splitCount == 0){
        if(betTalley + bet > balance || hand.length != 2){
            return;
        }
        betTalley += bet;
        bet = 2*bet;
        hit(hand, 'hand');
        stay();
    }else{
        //for when we've stayed on split1 and split again on OG hand
        if(splitCount == 1 && splitHands.length > 1 && stayCount > 0){
            if(splitHands[1].length != 2){
                return;
            }
            ourBet = tbet[1];
            if(betTalley + ourBet < balance){
                betTalley += ourBet;
                tbet[1] = 2*ourBet; 
                hit(splitHands[1], 'temp2');
                stay();
            }
        }else{
            if(splitHands[splitCount - 1].length != 2){
                return;
            }
            ourBet = tbet[splitCount - 1];
            if(betTalley + ourBet < balance){
                //assign correct playing hand context for hitting
                var splitID = "";
                if(splitCount = 2){
                    splitID = "2";
                }
                betTalley += ourBet;
                tbet[splitCount - 1] = 2*ourBet;
                hit(splitHands[splitCount - 1], 'temp' + splitID);
                stay();
            }
        }      
    }
}

//split hand into two hands
async function split(){
    if(gameOver){
        return;
    }
    if(betTalley + bet > balance){  //don't let us split when we can't afford it
        return;
    }
    //Add our bet to total bet amount and split.  for when we split the original card with no other splits
    betTalley += bet;
    if(splitHands.length == 0){
        if(hand[0].Value != hand[1].Value){
            return;
        } 
        //deals a card and draws it to a new hand
        handDIV = document.getElementById("hand" + hand[0].Name + "" + hand[0].Suit).remove();
        splitHands.push([hand.shift()]);
        tbet.push(bet);
        thand = document.getElementById('temp');
        
        var card = document.createElement("div");
        var icon='';
        if (splitHands[0][0].Suit == 'Hearts'){
            icon='♥';
            s = 'heart';
        }else if (splitHands[0][0].Suit == 'Spades'){
            icon = '♠';
            s = 'spade';
        }else if (splitHands[0][0].Suit == 'Diamonds'){
            icon = '♦';
            s = 'diamond';
        }else{
            icon = '♣';
            s = 'club';
        }
        card.innerHTML = splitHands[0][0].Name + '<br>' + icon;
        card.className = 'card ' + s;
        card.id = "temp" + splitHands[0][0].Name + "" + splitHands[0][0].Suit;
        thand.appendChild(card);
        
        //deal card to new hand then to our hand
        await sleep(300);
        hit(splitHands[0], 'temp');
        await sleep(300);
        hit(hand, 'hand');
        splitCount++;


    }else{
        //for when we have a split already
        if(splitHands.length == 1){
            //make sure our hand can be split
            if(hand.length == 2 && hand[0].Value == hand[1].Value && splitCount == 0){
                stayCount++;
                //deal a card and draw it to our second split hand
                handDIV = document.getElementById("hand" + hand[0].Name + "" + hand[0].Suit).remove();
                splitHands.push([hand.shift()]);
                tbet.push(bet);
                thand = document.getElementById('temp2');              
                var card = document.createElement("div");
                var icon='';
                if (splitHands[1][0].Suit == 'Hearts'){
                    icon='♥';
                    s = 'heart';
                }else if (splitHands[1][0].Suit == 'Spades'){
                    icon = '♠';
                    s = 'spade';
                }else if (splitHands[1][0].Suit == 'Diamonds'){
                    icon = '♦';
                    s = 'diamond';
                }else{
                    icon = '♣';
                    s = 'club';
                }
                card.innerHTML = splitHands[1][0].Name + '<br>' + icon;
                card.className = 'card ' + s;
                card.id = "temp2" + splitHands[1][0].Name + "" + splitHands[1][0].Suit;
                thand.appendChild(card);
                
                //deal a card to new hand then original hand
                await sleep(300);
                hit(splitHands[1], 'temp2');
                await sleep(300);
                hit(hand, 'hand');
                splitCount++;
            }  
            //for when we split a split.  Deal a card and draw it to new split hand
            if(splitHands[0].length == 2 && splitHands[0][0].Value == splitHands[0][1].Value){
                handDIV = document.getElementById("temp" + splitHands[0][0].Name + "" + splitHands[0][0].Suit).remove();
                splitHands.push([splitHands[0].shift()]);
                tbet.push(bet);
                thand = document.getElementById('temp2');
                var card = document.createElement("div");
                var icon='';
                if (splitHands[1][0].Suit == 'Hearts'){
                    icon='♥';
                    s = 'heart';
                }else if (splitHands[1][0].Suit == 'Spades'){
                    icon = '♠';
                    s = 'spade';
                }else if (splitHands[1][0].Suit == 'Diamonds'){
                    icon = '♦';
                    s = 'diamond';
                }else{
                    icon = '♣';
                    s = 'club';
                }
                card.innerHTML = splitHands[1][0].Name + '<br>' + icon;
                card.className = 'card ' + s;
                card.id = "temp2" + splitHands[1][0].Name + "" + splitHands[1][0].Suit;
                thand.appendChild(card);
                
                //hit new split hand, then original split hand
                await sleep(300);
                hit(splitHands[1], 'temp2');
                await sleep(300);
                hit(splitHands[0], 'temp');
                splitCount++; 
            }
        }
        else{
            return;
        }
    }
}

//when we want to finish our turn
async function stay(){
    if(!gameOver){
        if(splitCount > 0){
            splitCount--;    
            //checks if next hand in turn has blackjack and if so pass over them so we don't have to stay.
            if(splitCount == 0){
                if(checkVals(hand) == -1){
                    stay();
                }
            } 
        }else{
            //not sure the cause of the issue but there's a bug where a blackjack on split skips dealing a card to original hand
            if(hand.length < 2){
                return;
            }
            dealerTurn = true;
            await sleep(300);
            document.getElementById('hide').style.display = 'none';
            
            //if dealer has blackjack everyone loses :(
            if(checkVals(dealer) == -1){
                if(splitHands.length > 0){
                    for(var i = 0; i < splitHands.length; i++){
                        if(checkVals(splitHands[i]) != -1 && checkVals(splitHands[i]) <= 21){
                            lose(tbet[i]);
                            document.getElementById((i + 1)*'t' + "lose").style.display = "block";
                        }                          
                    }
                }
                lose(bet);
                gameOver = true;
                document.getElementById('lose').style.display = 'block';
                return;
            }
            //deal cards to the dealer until they're over 16 dealer must always hit below 17
            while(true){
                await sleep(500);
                if(checkVals(dealer) <= 16){
                    hit(dealer, 'dealer');
                }else{
                    break;
                }
            }

            //compare the dealer to all of the split hands we've got
            if(splitHands.length > 0){             
                for(i = 0; i < splitHands.length; i++){
                    if(checkVals(splitHands[i]) > 21 || checkVals(dealer) > 21){  //make sure both hands are eligible for comparison
                       continue;
                    }
                    if(checkVals(splitHands[i]) == -1){
                       continue;
                    }
                    //dealer has a better hand
                    if(checkVals(dealer) > checkVals(splitHands[i])){
                        if(i == 0){
                            document.getElementById('tlose').style.display = 'block';
                        }else if(i == 1){
                            document.getElementById('ttlose').style.display = 'block';
                        }
                        lose(tbet[i]);
                    }
                    //we have a better hand
                    if(checkVals(dealer) < checkVals(splitHands[i])){
                        if(i == 0){
                            document.getElementById('twin').style.display = 'block';
                        }else if(i == 1){
                            document.getElementById('ttwin').style.display = 'block';
                        }
                        win(tbet[i]);
                    }
                    //we have same hand
                    if(checkVals(dealer) == checkVals(splitHands[i])){
                        if(i == 0){
                            document.getElementById('tpush').style.display = 'block';
                        }else if(i == 1){
                            document.getElementById('ttpush').style.display = 'block';
                        }
                    }
                }
            }
            //make sure we dont lose if we have blackjack. any non bust hand checkVals > blackjack's -1 val
            if(checkVals(hand) == -1){
                gameOver = true;
                document.getElementById('blackjack').style.display = 'block';
                return;
            }
            //make sure we don't win if we've busted
            if(checkVals(hand) > 21){
                gameOver = true;
                document.getElementById('bust').style.display = 'block';
                return;
            }
			//dealer busting is handled in hit function
            if(checkVals(dealer) > 21){
                gameOver = true;
                return;
            }
            
            //compare dealers hand to our hand
            if(checkVals(dealer) > checkVals(hand)){  //dealer has a better hand
                lose(bet); 
                document.getElementById('lose').style.display = 'block';
            }
            if(checkVals(dealer) < checkVals(hand)){  //we've got better hand
                win(bet);
                document.getElementById('win').style.display = 'block';
            }
            if(checkVals(dealer) == checkVals(hand)){  //we have same hand
                document.getElementById('push').style.display = 'block';
                push();
            }   
           gameOver = true;
       }
    }
}

//add value to balance and let us bet again
function win(tBet){
    balance += tBet;
    document.getElementById('bal').innerHTML = "Balance: " + balance;
    document.getElementById('bet').disabled = false;
    document.getElementById('bet').value = ogbet;
}

//blackjack win 3:2  add this value to our balance
function blackJack(){
    b = bet * 1.5;
    balance += Math.floor(b);
    document.getElementById('bal').innerHTML = "Balance: " + balance;
    document.getElementById('bet').disabled = false;
    betting = true;
    document.getElementById('bet').value = ogbet;
}

//subtract value from balance
function lose(tBet){
    balance -= tBet;
    document.getElementById('bal').innerHTML = "Balance: " + balance;
    document.getElementById('bet').disabled = false;
    betting = true;
    //try to reset our bet to the same as last time for ease.  but also make sure it's a responsible bet because we're responsible
    if(ogbet < balance){
        document.getElementById('bet').value = ogbet;
    }else{
        document.getElementById('bet').value = Math.floor(ogbet/2);
    } 
}

//let us bet again if we don't win or lose
function push(){
    document.getElementById('bal').innerHTML = "Balance: " + balance;
	document.getElementById("bet").disabled = false;
    betting = true;
    document.getElementById('bet').value = bet;
}

//checks values in a given hand.  first for blackjack.  Counts aces and gives it all possible values and takes best one
function checkVals(hand){
    count = 0;
    aces = 0;
    
    //check for blackjack
    if(hand.length == 2){
        if(hand[0].Name == 'A'){
            if(hand[1].Value == 10){
                return -1;
            }
        }
        if(hand[1].Name == 'A'){
            if(hand[0].Value == 10){
                return -1;
            }
        }
    }

    //add values
    for(var i = 0; i < hand.length; i++){
        if(hand[i].Name == 'A'){  //skip aces for now
            aces++;
        }else{
            count += hand[i].Value;
        }
    }
    
    //check ace values at 1 or 11  there's definitely an easier way to do this but 
    if(11 + aces - 1 + count <= 21){
        count += (10 + aces);
    }else{
        count += aces;
    }
    return count;
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

Element.prototype.remove = function() {
    this.parentElement.removeChild(this);
}

NodeList.prototype.remove = HTMLCollection.prototype.remove = function() {
    for(var i = this.length - 1; i >= 0; i--) {
        if(this[i] && this[i].parentElement) {
            this[i].parentElement.removeChild(this[i]);
        }
    }
}
