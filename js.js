var TEMP = document.getElementById("temp");

var CARD = TEMP.querySelector(".card");


class Game {
    constructor(players, deck) {
        this.players = players;
        this.deck = deck;
    
        this.turn = 0;

        this.drawSurface = document.getElementById("draw");
        this.finalLabel = document.getElementById("finishLabel");
        
        this.deck.shuffle();

        this.init();
    }

    init() {
        // make this function attach a button to hit or stand & create each player
        for (var i = 0; i < this.players.length; i++) {
            this.players[i].init(this);
            this.players[i].draw(this.drawSurface);
        }
    }

    end() {
        // final display
        console.log("ENDING")
        
        // cleanup
        for (var i = 0; i < this.players.length; i++) {
            this.players[i].HTML.querySelector("#hit").disabled = true;
            this.players[i].HTML.querySelector("#stand").disabled = true;

            if (!this.players[i].lost) {
                this.finalLabel.textContent = `${this.players[i].name} WON! (value: ${this.players[i].sum()})`;
            }
        }

        
    }

    tick() {
        // check if they have gone over 21
        this.turn += 1;
        for (player of this.players) {
            var total = player.sum();

            if (total == 21) {
                // the player has won, do not give them more cards or similar
                player.won = true;
                this.end();
                return;
            }

            if (this.hit) {
                var nextCard = this.deck.pop();
                console.log(nextCard);
                console.log(this.player.sum());
                player.cards.push(nextCard)

                console.log(nextCard.value);
                console.log(nextCard.id);
                console.log("\n\n")
                
                
                player.hit = false;
            } else {
                player.stand = false;
            }

            // draw
            this.drawSurface.textContent = ''; // clear

            player.draw(this.drawSurface);

            if (newSum > 21) {
                player.lost = true;

                console.log(`${this.player.name} LOST! (value: ${newSum})`);
                // the player has lost
                return;
            } else if (newSum == 21) {
                return;
            }

            if (this.turn > 10) {
                this.end();
            }
        }
    }
}

class Player {
    constructor(name) {
        this.name = name;
        this.cards = [];
        this.lost = false;

        this.hit = false;
        this.stand = false;

        this.HTML = TEMP.querySelector("#display").cloneNode(true);

        this.HTML.id = `${name}-display`;
        this.HTML.querySelector("#title").textContent = name;
    }

    init(game_ref) {
        this.HTML.querySelector("#hit").addEventListener("click", () => {
            this.hit = true;
            game_ref.tick();
        });

        this.HTML.querySelector("#stand").addEventListener("click", () => {
            this.stand = true;
            game_ref.tick();
        });
    }

    sum() {
        var t = 0
        for (var i = 0; i < this.cards.length; i++) {
            t += this.cards[i].value;
        }

        return t;
    }

    draw(appendTo) {
        var cPos = this.HTML.querySelector("#target");
        cPos.textContent = ''; // clear

        for (var i = 0; i < this.cards.length; i++) {
            this.cards[i].draw(cPos);
        }

        this.HTML.querySelector("#sum").textContent = `Card Total: ${this.sum()}`;
        
        appendTo.append(this.HTML);
    }
}


class Deck {
    constructor(numOfCards) {
        this.cards = [];
        this.length = numOfCards;

        this.make();
    }

    make() {
        for (var i = 0; i < this.length; i++) {
            this.cards.push(new Card(i));
        }
    }

    shuffle() {
        for (var i = 0; i < this.length; i++) {
            var card1 = Math.floor(Math.random() * this.length);

            // swap these two cards
            var temp = this.cards[card1];
            this.cards[card1] = this.cards[i];
            this.cards[i] = temp;
        }   
    }

    pop() {
        return this.cards.pop();
    }
}


class Card {
    constructor(value) {
        this.id = value;
        this.suit = Math.floor(value/13);
        this.value = (value % 13) + 1;
        this.renderValue = value % 13
        console.log(value);
        console.log(this.value);

        this.html = CARD.cloneNode(true);

        this.html.style.backgroundPositionX = -(this.renderValue) + "00%";
        console.log(this.html.style.backgroundPositionX);
        // TODO: this ONLY renders aces for some reason
        this.html.style.backgroundPositionY = (this.suit * 25) + "%";
        this.html.style.display = "inline-block";
    }

    draw(appendTo) {
        appendTo.append(this.html);
    }
}

new Game([new Player("a"), new Player("b"), new Player("c")], new Deck(52));
