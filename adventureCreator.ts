"use strict";

let newGame: World
let itemID: number = 1;

(<HTMLButtonElement>document.getElementById("submitInitialGeneration")).addEventListener("click", initialWorldGen);
(<HTMLButtonElement>document.getElementById("newPlaceButton")).addEventListener("click", newPlaceForm);
(<HTMLButtonElement>document.getElementById("submitPlace")).addEventListener("click", addNewPlace);
(<HTMLButtonElement>document.getElementById("newItemButton")).addEventListener("click", newItemForm);
(<HTMLButtonElement>document.getElementById("submitItem")).addEventListener("click", addNewItem);
(<HTMLButtonElement>document.getElementById("generateJSONButton")).addEventListener("click", outputJSON);

function initialWorldGen(){
    let worldName = (<HTMLInputElement>document.getElementById("worldName")).value
    let introText = (<HTMLTextAreaElement>document.getElementById("introText")).value
    let playerHealth:number = parseInt((<HTMLInputElement>document.getElementById("playerHealth")).value)
    let playerStamina:number = parseInt((<HTMLInputElement>document.getElementById("playerStamina")).value)
    let maximumCarryWeight:number = parseInt((<HTMLInputElement>document.getElementById("maximumCarryWeight")).value)
    let startName = (<HTMLInputElement>document.getElementById("startLocName")).value
    let startDescription = (<HTMLTextAreaElement>document.getElementById("startLocDescription")).value
    let startHints = (<HTMLTextAreaElement>document.getElementById("startHints")).value

    let startPlace = new Place(startName, startDescription, startHints);

    newGame = new World(
        worldName,
        new Player(
            startPlace,
            playerHealth,
            playerStamina,
            maximumCarryWeight
        ),
        introText
    );

    newGame.addPlace(startName.toLowerCase(), startPlace);

    let nameList = <HTMLUListElement>document.getElementById("placeList")
    let listItem = document.createElement("li")
    listItem.innerHTML = startName
    nameList.appendChild(listItem);

    (<HTMLDivElement> document.getElementById("initialGeneration")).style.display = "none";
    (<HTMLDivElement> document.getElementById("newButtons")).style.display = "inline"
}

function newPlaceForm(){
    (<HTMLDivElement> document.getElementById("newButtons")).style.display = "none";
    (<HTMLDivElement> document.getElementById("newPlace")).style.display = "inline"
}

function addNewPlace(){
    let placeName = (<HTMLInputElement>document.getElementById("placeName")).value
    let placeDescription = (<HTMLInputElement>document.getElementById("placeDescription")).value
    let placeHints = (<HTMLInputElement>document.getElementById("placeHints")).value

    newGame.addPlace(
        placeName.toLowerCase(),
        new Place(
            placeName,
            placeDescription,
            placeHints
        )
    )

    const directions = ["north", "east", "south", "west", "up", "down"]
    for(let i in directions){
        if ((<HTMLInputElement> document.getElementById(directions[i])).checked == true){
            let placeDirection = directions[i]
            let place = ((<HTMLInputElement>document.getElementById(`${directions[i]}Place`)).value).toLowerCase();
            let locked = (<HTMLInputElement>document.getElementById(`${directions[i]}Locked`)).checked;
            let blocked = (<HTMLInputElement>document.getElementById(`${directions[i]}Blocked`)).checked;
            let needsJump = (<HTMLInputElement>document.getElementById(`${directions[i]}NeedsJump`)).checked;
            let hidden = (<HTMLInputElement>document.getElementById(`${directions[i]}Hidden`)).checked;
            let durability = parseInt((<HTMLInputElement>document.getElementById(`${directions[i]}Durability`)).value)


            newGame.places[placeName.toLowerCase()].addNearbyPlace(
                placeDirection,
                newGame.places[place],
                new Exit(
                    locked,
                    blocked,
                    needsJump,
                    hidden,
                    durability
                )
            )
        }
    }

    let nameList = <HTMLUListElement>document.getElementById("placeList")
    let listItem = document.createElement("li")
    listItem.innerHTML = placeName
    nameList.appendChild(listItem);

    (<HTMLDivElement> document.getElementById("newPlace")).style.display = "none";
    (<HTMLDivElement> document.getElementById("newButtons")).style.display = "inline"
}


function newItemForm(){
    (<HTMLDivElement> document.getElementById("newButtons")).style.display = "none";
    (<HTMLDivElement> document.getElementById("newItem")).style.display = "inline"
}

function addNewItem(){

    let itemName = (<HTMLInputElement>document.getElementById("itemName")).value
    let itemDescription = (<HTMLInputElement>document.getElementById("itemDescription")).value
    let itemWeight = parseInt((<HTMLInputElement>document.getElementById("itemWeight")).value)
    let parentContainerType = (<HTMLSelectElement>document.getElementById("parentContainerType")).value
    let parentContainerName = (<HTMLInputElement>document.getElementById("parentContainerName")).value
    let itemDurability = parseInt((<HTMLInputElement>document.getElementById("itemDurability")).value)


    let generatedItem = new Item(
        itemID,
        itemName,
        itemWeight,
        itemDescription,
        itemDurability
    )

    let itemList = <HTMLUListElement>document.getElementById("itemList")
    let listItem = document.createElement("li")
    listItem.innerHTML = `${itemName} (${itemID})`
    itemList.appendChild(listItem);

    newGame.addItem(itemID, generatedItem)


    if (parentContainerType == "place"){
        newGame.places[parentContainerName.toLowerCase()].addItem(
            itemName.toLowerCase(),
            generatedItem
        )
    }
    
    else if (parentContainerType == "item"){
        newGame.items[parseInt(parentContainerName)].addItem(
            itemName.toLowerCase(),
            generatedItem
        )
    }
    
    if ((<HTMLInputElement>document.getElementById("collectible")).checked == true){
        newGame.items[itemID].collectable = true
    }
    if ((<HTMLInputElement>document.getElementById("edible")).checked == true){
        newGame.items[itemID].edible = true
    }
    if ((<HTMLInputElement>document.getElementById("drinkable")).checked == true){
        newGame.items[itemID].drinkable = true
    }
    if ((<HTMLInputElement>document.getElementById("poisonous")).checked == true){
        newGame.items[itemID].poisonous = true
    }
    if ((<HTMLInputElement>document.getElementById("flammable")).checked == true){
        newGame.items[itemID].flammable = true
    }
    if ((<HTMLInputElement>document.getElementById("alight")).checked == true){
        newGame.items[itemID].alight = true
    }
    if ((<HTMLInputElement>document.getElementById("locked")).checked == true){
        newGame.items[itemID].locked = true
    }
    if ((<HTMLInputElement>document.getElementById("open")).checked == true){
        newGame.items[itemID].open = true
    }
    if ((<HTMLInputElement>document.getElementById("hidden")).checked == true){
        newGame.items[itemID].hidden = true
    }
    if ((<HTMLInputElement>document.getElementById("pushable")).checked == true){
        newGame.items[itemID].pushable = true
    }
    if ((<HTMLInputElement>document.getElementById("weapon")).checked == true){
        newGame.items[itemID].weapon = true
    }
    if ((<HTMLInputElement>document.getElementById("breakable")).checked == true){
        newGame.items[itemID].breakable = true
    }
    if ((<HTMLInputElement>document.getElementById("broken")).checked == true){
        newGame.items[itemID].broken = true
    }

    itemID += 1;


    (<HTMLDivElement> document.getElementById("newItem")).style.display = "none";
    (<HTMLDivElement> document.getElementById("newButtons")).style.display = "inline"

}



function outputJSON(){
    let jsonOutput = JSON.stringify((<any>JSON).decycle(newGame))
    let outputArea = <HTMLTextAreaElement>document.getElementById("outputField")

    outputArea.innerHTML = jsonOutput

}