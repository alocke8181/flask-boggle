class Boggle {

    constructor(){
        this.score = 0;
        this.words = new Set();
        this.$board = $('#game-board');
        this.$wordList = $('#word-list');
        this.$scoreElmnt = $('#score');
        this.$notifs = $('#notifs');
        this.$guess = $('#guess');

        $("#word-form").on("submit", this.submitWord.bind(this));
    }

    addWord(word){
        this.$wordList.append($("<li>",{text: word}));
    }

    updateScore(){
        this.$scoreElmnt.text(`Your Score: ${this.score}`);
    }

    notif(msg, msgType){
        this.$notifs.text(msg);
        this.$notifs.removeClass();
        this.$notifs.addClass(`msg ${msgType}`);
    }

    async submitWord(event){
        event.preventDefault();
        let guess = this.$guess.val();

        if(!guess){return;}

        if(this.words.has(guess)){
            this.notif(`You've already guessed ${guess}`,"error");
            return;
        }

        const resp = await axios.get("/check-guess", {params: {guess:guess}});
        let result = resp.data.result;
        //NaW = Not a Word
        if(result === "not-word"){
            this.notif(`${guess} is not a valid English word`,"error");
        }
        //NoB = Not on Board
        else if (result === "not-on-board"){
            this.notif(`${guess} is not on the board`, "error");
        }
        else{
            this.showWord(guess);
            this.score += guess.length;
            this.updateScore();
            this.words.add(guess);
            this.notif(`Added ${guess}`, "good")
        }
        this.$guess.val("");

    }
}