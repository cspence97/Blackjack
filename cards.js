//implement split now :o

suits = ['Spades', 'Clubs', 'Diamonds', 'Hearts'];
vals = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]
deck1 = [];
hand = [];
//double nests array; inside arrays are hands; outside array is for holding extra hands from splitting
splitHands = [];


dealer = [];
//dealerturn for stopping hitting when we hit
dealerTurn = false;
gameOver = true;
betting = true;
splitCount = 0;
balance = 100;
bet = 0;
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
    ar = myDeck.split('\n');
    for(var s = 0; s < ar.length; s++){
        console.log(ar[s]);
    }
    console.log(aceCount + " aces");
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
    console.log(deck.length);
    return deck;
}

function shuffle(deck){
    
    for(var i = 0; i < 50000; i++){
        var ind1 = Math.floor(Math.random() * deck.length);
        var ind2 = Math.floor(Math.random() * deck.length);
        var temp = deck[ind1];
        deck[ind1] = deck[ind2];
        deck[ind2] = temp;
    }  
}

function getHighScores(){
    function reqListener () {
      console.log(this.responseText);
    }
    var topScores = [];
    var oReq = new XMLHttpRequest(); // New request object
    oReq.onload = function() {
        // This is where you handle what to do with the response.
        // The actual data is found on this.responseText
       //alert(this.responseText); // Will alert: 42
        
        answerString = this.responseText;

        topScores = answerString.split('\n');

        scoreboard = document.getElementById('scoreboard');

        scoreboard.innerHTML = '';
        for(var i = 0; i < topScores.length; i++){
            if(topScores[i] == ""){
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
    //                               ^ Don't block the rest of the execution.
    //                                 Don't wait until the request finishes to
    //                                 continue.
    oReq.send();

    
}

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
//if we aren't in game check for good bet then deal 2 to hand and dealer
async function deal(deck){
    
    



     //clear win statements
    wins = document.getElementsByClassName('gameover');
    for(var i = 0; i < wins.length; i++){
        wins[i].style.display = 'none';
    }
    
    if(gameOver){
        //records our bet and doesn't let us pass until we give a valid one
        bet = parseInt(document.getElementById('bet').value, 10);
        console.log("bet: " + bet);
        if(bet > balance){
            console.log("bad bet");
            document.getElementById('badbet').style.display = "block";
            return;
        }else if(bet > 0){
            console.log("good bet");
            document.getElementById('bet').disabled = true;
            document.getElementById('username').disabled = true;
            /*document.getElementById('badbet').style.display = "none";
            document.getElementById('bet').style.display = "none";
            document.getElementById("betamount").innerHTML = "Bet: " + bet;
            document.getElementById("betamount").style.display = "block";
            document.getElementById('bet').value = 0;*/
        }else{
            console.log("bad bet");
            document.getElementById('badbet').style.display = "block";
            return;
        }
        
        document.getElementById('shuffling').style.display = 'block';

        //when we get below one deck length reset to 5 decks and shuffle
        if(deck.length <= 52){
            console.log("shuffling...");
            main();
            await sleep(1500);
        }
        document.getElementById('shuffling').style.display = 'none';

        console.log("starting deal");
        //clear card image divs
        document.getElementById('hand').innerHTML = '';
        document.getElementById('dealer').innerHTML = '';
        document.getElementById('temp').innerHTML = '';
        document.getElementById('temp2').innerHTML = '';
        document.getElementById('hide').style.display = "none";
        //discard our hands
        hand = [];
        dealer = [];
        splitCount = 0;
        dealerTurn = false;
        splitHands = [];
        sendScore();
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
            card.id = deck[i].Name + "" + deck[i].Suit;
            document.getElementById("hand").appendChild(card);
        }
        hand.push(deck.shift());
        hand.push(deck.shift());
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
            card.id = deck[i].Name + "" + deck[i].Suit;
            document.getElementById("dealer").appendChild(card);
        }
        dealer.push(deck.shift());
        dealer.push(deck.shift());
        
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
            //this is totally not unneccessary, hit button calls hit(hand, hand) we need it to call hit(splithand, temp) when not hitting normal hand duh
            if(splitCount == 1 && splitHands.length == 1){
                toHand = splitHands[splitCount - 1];
                handName = 'temp'
            }else if(splitCount == 1 && splitHands.length == 2){
                toHand = splitHands[1];
                handName = 'temp2'
            }
            if(dealerTurn){
                return;
            }
        }
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
            card.id = deck1[0].Name + "" + deck1[0].Suit;
            document.getElementById(handName).appendChild(card);
            toHand.push(deck1.shift());
        }
        if(checkVals(toHand) > 21){
            switch (handName){
                case "dealer":
                    gameOver = true;
                    document.getElementById('dbust').style.display = "block";

                    // if dealer busts 
                    for(var i = 0; i < splitHands.length; i++){
                        if(checkVals(splitHands[i]) <= 21){
                            if(i == 0){
                                document.getElementById('twin').style.display = 'block';
                            }else if(i == 1){
                                document.getElementById('ttwin').style.display = 'block';
                            }
                            win(tbet[i]);
                        }
                    }
                    if(checkVals(hand) <= 21){
                        document.getElementById('win').style.display = 'block';
                        win(bet);
                    }
                    break;
                case "hand":
                    lose(bet);
                    document.getElementById('bust').style.display = "block";
                    if(splitHands.length == 0){
                        gameOver = true;
                        console.log("bust");
                    }else{
                        var bustCount = 0;
                        for(var i = 0; i < splitHands.length; i++){
                            if(checkVals(splitHands[i]) > 21){
                                bustCount++;
                            }
                        }
                        if(bustCount == splitHands.length){
                            gameOver = true;
                            console.log("bust");
                        }
                        stay();
                    }
                    break;
                case "temp":
                    lose(tbet[splitCount - 1]);
                    document.getElementById('tbust').style.display = "block";
                    stay();
                    break;
                case "temp2":
                    lose(tbet[splitCount - 1]);
                    document.getElementById('ttbust').style.display = "block";
                    stay();
                    break;
            }
        }
        //check split for blackjack.  normal blackjack not affected since it will detect on deal before chance to hit
        if(checkVals(toHand) == -1){
            switch(handName){
                case 'temp': 
                    //why isn't this being called
                    if(splitHands.length == 1 && splitCount == 1){
                        stay();
                    }
                    document.getElementById('tblackjack').style.display = 'block';
                    break;
                case 'temp2':
                    document.getElementById('ttblackjack').style.display = 'block';
                    stay();
                    break;   
                case 'hand':
                    document.getElementById('blackjack').style.display = 'block';
            }
            blackJack();
            
            //splitCount--;
        }
    }
}

//double bet and hit once if we haven't hit yet
function doubleDown(){
    
    if(splitCount == 0){
        if(2*bet > balance || hand.length != 2){
            return;
        }
        bet = 2*bet;
        hit(hand, 'hand');
        stay();
    }else{
        if(tbet[splitCount - 1]*2 > balance || splitHands[splitCount - 1].length != 2){
            return;
        }
        tbet[splitCount - 1] = 2*bet;
        hit(splitHands[splitCount - 1], 'temp');
        stay();
    }
}

//split hand into two hands
async function split(){
    if(splitHands.length == 0){
        if(hand[0].Value != hand[1].Value){
            return;
        }
        
        
        handDIV = document.getElementById(hand[0].Name + "" + hand[0].Suit).remove();
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
        card.id = splitHands[0][0].Name + "" + splitHands[0][0].Suit;
        thand.appendChild(card);
        
        await sleep(300);
        hit(splitHands[0], 'temp');
        await sleep(300);
        hit(hand, 'hand');
        splitCount++;

    }else{
        //limit to two split for now just cuz we don't have much space on the board until css is redesigned
        if(splitHands.length == 1){
            //COMMENTED BECAUSE SPLITTING OG HAND SHOULD ONLY BE POSSIBLE WHEN SPLITCOUNT =0 EVEN AFTER WE"VE SPLIT
            //check if splitting first hand or second hand or if one can at all
            //splitcount == 0 so we can only perform this split on turn 1
            if(hand.length == 2 && hand[0].Value == hand[1].Value && splitCount == 0){
                handDIV = document.getElementById(hand[0].Name + "" + hand[0].Suit).remove();
                
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
                card.id = splitHands[1][0].Name + "" + splitHands[1][0].Suit;
                thand.appendChild(card);
                
                await sleep(300);
                hit(splitHands[1], 'temp2');
                await sleep(300);
                hit(hand, 'hand');
                splitCount++;
            }  
            if(splitHands[0].length == 2 && splitHands[0][0].Value == splitHands[0][1].Value){
                handDIV = document.getElementById(splitHands[0][0].Name + "" + splitHands[0][0].Suit).remove();
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
                card.id = splitHands[1][0].Name + "" + splitHands[1][0].Suit;
                thand.appendChild(card);
                
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
        //really think about how to do staying for split without reducing splitcount
        /*
            how about we reduce splitcount by one after staying, however on win conditions we look at length of thands.
            reset thands on deal yes this is the way
        */
        if(splitCount > 0){
            //checks if next hand in turn has blackjack and if so pass over them so we don't have to stay.
            if(splitCount > 1){
                if(checkVals(splitHands[splitCount - 2]) == -1){
                    splitCount--;
                    stay();
                    return;
                }
            }else if(splitCount == 1){
                if(checkVals(hand) == -1){
                    splitCount--;
                    stay();
                    return;
                }
            }
            splitCount--;     
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
                        lose(tbet[i]);
                    }
                }
                lose(bet);
                gameOver = true;
                document.getElementById('lose').style.display = 'block';
                return;   
                

            }
            while(true){
                await sleep(500);
                if(checkVals(dealer) <= 16){
                    hit(dealer, 'dealer');
                }else{
                    break;
                }
            }
            if(splitHands.length > 0){
                
                for(i = 0; i < splitHands.length; i++){
                    if(checkVals(splitHands[i]) > 21 || checkVals(dealer) > 21){
                       continue;
                    }
                    if(checkVals(splitHands[i]) == -1){
                       continue;
                    }
                    if(checkVals(dealer) > checkVals(splitHands[i])){
                        if(i == 0){
                            document.getElementById('tlose').style.display = 'block';
                        }else if(i == 1){
                            document.getElementById('ttlose').style.display = 'block';
                        }
                        lose(tbet[i]);
                    }
                    if(checkVals(dealer) < checkVals(splitHands[i])){
                        if(i == 0){
                            document.getElementById('twin').style.display = 'block';
                        }else if(i == 1){
                            document.getElementById('ttwin').style.display = 'block';
                        }
                        win(tbet[i]);
                    }
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
            if(checkVals(dealer) > 21){
                gameOver = true;
                return;
            }

            //this executed after a dbust
            if(checkVals(dealer) > checkVals(hand)){
                lose(bet);
               
                document.getElementById('lose').style.display = 'block';
            }
            if(checkVals(dealer) < checkVals(hand)){
                win(bet);
                document.getElementById('win').style.display = 'block';
            }
            if(checkVals(dealer) == checkVals(hand)){
                document.getElementById('push').style.display = 'block';
                push();
            }   
           gameOver = true;
       }
    }
}

//add value to balance
//IMPORTANT: WHEN IMPLEMENTING DEALER BUSTING MAKE SURE WE DONT SKIP WINNING BOTH OUR BETS
function win(tBet){
    balance += tBet;
    document.getElementById('bal').innerHTML = "Balance: " + balance;
    document.getElementById('bet').disabled = false;
    if(bet <= balance){
        document.getElementById('bet').value = bet;
    }else{
        document.getElementById('bet').value = Math.floor(bet/2);
    }
}

//blackjack win 3:2
function blackJack(){
    if(splitCount > 0){
        b = tbet[splitCount - 1]*1.5;  //3:2
        balance += Math.floor(b);
        //stay();
    }else{
        b = bet * 1.5;
        balance += Math.floor(b);
        document.getElementById('bal').innerHTML = "Balance: " + balance;
        document.getElementById('bet').disabled = false;
        betting = true;
        if(bet <= balance){
            document.getElementById('bet').value = bet;
        }else{
            document.getElementById('bet').value = Math.floor(bet/2);
        }
    }
}

//subtract value from balance
function lose(b){
    //pay up our bet;  allows for doubling down on splits
    
    balance -= b;
    document.getElementById('bal').innerHTML = "Balance: " + balance;
    document.getElementById('bet').disabled = false;
    betting = true;
    if(bet < balance){
        document.getElementById('bet').value = bet;
    }else{
        document.getElementById('bet').value = Math.floor(bet/2);
    } 
}

function push(){
    document.getElementById('bal').innerHTML = "Balance: " + balance;
    document.getElementById('bet').style.display = "block";
    document.getElementById('betamount').style.display = "none";
    betting = true;
    if(bet <= balance){
        document.getElementById('bet').value = bet;
    }else{
        document.getElementById('bet').value = Math.floor(bet/2);
    }
}

//checks values in a given hand.  first for blackjack.  Counts aces and gives it all possible values and takes best one
function checkVals(hand){
    count = 0;
    aces = 0;
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
    //if end up doing more decks then update this to 4*deck quantity
    //check ace values at 1 or 11
    switch(aces){
        case 1:
            if(count + 11 <= 21){
                count += 11;
            }else{
                count++;
            }
            break;
        case 2:
            if(count + 12 <= 21){
                count += 12;
            }else{
                count += 2;
            }
            break;
        case 3:
            if(count + 13 <= 21){
                count += 13;
            }else{
                count += 3;
            }
            break;
        case 4:
            if(count + 14 <= 21){
                count += 14;
            }else{
                count += 4;
            }
            break;
    }
    console.log("Our count is: " + count);
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