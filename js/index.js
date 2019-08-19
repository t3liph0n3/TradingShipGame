// ammount of cash held
var cash = 10000000;
// number of turns - used in reporting game over
var turns = 0;
var maxCom = 10; //from html - how many ComL# and Comd#... max length of Cargo List
//array for cargo of ship
var cargo = [];
var maxCargo = 5; //The maximum cargo that can  be held

var portName = [ //Ports for the game (check PortInfo has same number)
  "Peyi-fo", "Lildivan", "Modi Mon", "Kay", "Kwez Lilet", "Lapen-vil", "Falez-vilaj"
]
//The list of the items
// max length is 10 (from html doc)
var cargoList = [
  "empty","Fish","Coffee","Sugar","Coconuts","Iron","Coco"
]
//A nested table of Port information
// [ Tax, Item A, Item B, Item C, Item D (in cargo list) ]
var portInfo = [
  [0.40,5,51,22,12,135,610], //Payi-fo cheap coco
  [0.20,2,60,24,10,140,2070], //Lildivan cheap coconuts
  [0.35,4,70,25,15,100,2520], //Modi Mon cheap Iron
  [0.00,1,65,24,11,140,2010], //Kay cheap fish, coconuts
  [0.00,1,70,25,10,145,2040], //Kwez Lilet cheap coconuts, fish
  [0.25,2,50,20,13,150,2050], //Lapen-vil cheap coffee
  [0.30,3,52,21,14,130,500] //Falez-vilaj cheap Coco
]

//location of the ship (starts in a random port)
var nowPort = Math.floor(Math.random() * portInfo.length);

// to start the game, print lables then move the ship to start
printlables();
moveShip();


//move Ship is each turn...
function moveShip(){
  priceChange();
  // Move the ship to the next port
  if(nowPort < (portInfo.length -1)){
    nowPort += 1;
  }else{
    nowPort = 0;
  }
  //each port costs $1 to enter
  cash -=1;
  document.getElementById("cash").innerHTML = "$" + cash;
 //list the port info
  listPort();
  checkEnd();
  turns += 1;
}


// show the commodity names (called at start of game)
function printlables() {
  for (var i = 1; i <= maxCom; i++){
    if (i < cargoList.length) {
      document.getElementById("ComL"+i).innerHTML = cargoList[i];
    } else {
      document.getElementById("ComL"+i).innerHTML = "";
    }
  }
}


//update the information on the table for the port
function listPort() {
  document.getElementById("port").innerHTML = "Now in " + portName[nowPort] + ".";

  document.getElementById("portTax").innerHTML = "Where import tarrifs are: "+ Math.round(portInfo[nowPort][0]*100) + "%.";
  //update table with prices
  for (var i = 1; i <= maxCom; i++){
    if (i < cargoList.length) {
      document.getElementById("Comd"+i).innerHTML = portInfo[nowPort][i]+"<br//><button type=\"button\" onclick=\"buyCargo("+i+")\">Buy</button>";
    } else {
      document.getElementById("Comd"+i).innerHTML = "";
    }
  }
}


//buy produce, update cash, cost and hold info if good sale
function buyCargo(stock) {
  if (cargo.length < maxCargo && cash >= portInfo[nowPort][stock]){
    if (portInfo[nowPort][stock] > 0){
      cash -= portInfo[nowPort][stock];
      document.getElementById("cash").innerHTML = "$" + cash;
      cargo[cargo.length] = stock;
      //price will rise 1-14%
      portInfo[nowPort][stock] = Math.round(portInfo[nowPort][stock]*(Math.random()*15+100)/100);
      listCargo();
      listPort();
    } else {
      alert("sorry out of stock");
    }
  } else {
    //show error can not buy
    if (cargo.length >= maxCargo){
      alert("You don't have enough hold for more cargo. \n Sell some cargo to make room.");
    } else {
      alert("You don't have enough cash for " + cargoList[stock] + " here.");
    }
  }
}


//Sell cargo, check if legal, update cash and cost
function sellCargo(hld) {
  //sell produce in the selected hold, add to cash price - landing tax
  //set hold to undefined (to be filled on buy)
  switch (cargo[hld]) {
    case 0:
    case undefined:
      alert("That hold is empty.");
      break;
    default:
      var sellPrice = portInfo[nowPort][cargo[hld]] * (1-portInfo[nowPort][0]);
      cash += Math.round(sellPrice);
      document.getElementById("cash").innerHTML = "$" + cash;
      //price will drop 0-5%
      portInfo[nowPort][cargo[hld]] = Math.round(portInfo[nowPort][cargo[hld]]*(Math.random()*5+95)/100);
      cargo.pop(cargo[hld]);
      listPort();
      break;
  }
  listCargo();
}

function listCargo() {
  //List the cargo in the hold
  var cHold = 0; //used for adding the Sell button
  if (cargo.length < 1){
  document.getElementById("hold").innerHTML = "empty";
  } else {
    document.getElementById("hold").innerHTML = "<ul><li>"+ cargo.map(element => {
  return cargoList[element]+" <button type\"button\" onclick=\"sellCargo("+(cHold++)+")\"> Sell </button>";
}).join("</li><li>") + "</li></ul>";
  }

  for (var i=0; i <=portInfo.length;i++){
    alert(portInfo[i][0]);
  }
}

function priceChange () {
  // Change the tax or price of goods in a random port and report it as news.
  var effectPort = Math.floor(Math.random()*portInfo.length);
  var effectCargo = Math.floor(Math.random()*cargoList.length);
  if (effectCargo == 0){ //check not effecting tax
     effectCargo = 1;
  }
  switch(Math.floor(Math.random() * 4)){
    case 0:   //change tax 1-6%
      portInfo[effectPort][0] = Math.floor(portInfo[effectPort][0]*100 + 1 + Math.floor(Math.random()*5))/100;
      portInfo[effectPort][0] -= portInfo[effectPort][0]%0.01; //to round
      document.getElementById("gamenews").innerHTML = "Tarrif increase in "+portName[effectPort]+"! Now: "+portInfo[effectPort][0]*100+"%";
      break;
    case 1:  //price decrease
      portInfo[effectPort][effectCargo] -= 1+Math.round(portInfo[effectPort][effectCargo]*(Math.random()*15+20)/100);
      document.getElementById("gamenews").innerHTML = "Price collapse of "+cargoList[effectCargo]+" at " +portName[effectPort]+ ". Now: $"+portInfo[effectPort][effectCargo]+" a unit.";
      break;
    case 2: //price increase
      portInfo[effectPort][effectCargo] += 2+Math.round(portInfo[effectPort][effectCargo]*(Math.random()*10)/100);
      document.getElementById("gamenews").innerHTML = "Shortage of "+cargoList[effectCargo]+" at " +portName[effectPort]+ ".Now: $"+portInfo[effectPort][effectCargo]+" a unit.";
      break;
    case 3: //pirates steal money if in same location
      if (effectPort == nowPort) {
        cash = 1;
        document.getElementById("gamenews").innerHTML = "Pirates attack and steal your cash.";
        document.getElementById("cash").innerHTML = "$" + cash;
        break;
      } else {
        document.getElementById("gamenews").innerHTML = "Pirates reported at "+portName[effectPort]+".";
      }
  }
}

function checkEnd() {
  if (cash < 1){
    //end the game if cash is less than $1
    alert("game over\n\nYou survied "+turns+" turns.");
    document.location.href = "";
  }
}
