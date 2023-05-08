class Boggle {

    constructor(){
        this.score = 0;
        this.game_length = 60;
        this.words = new Set();
        this.$board = $('#game-board');
        this.$wordList = $('#word-list');
        this.$scoreElmnt = $('#score');
        this.$notifs = $('#notifs');
        this.$guess = $('#guess');
        
        this.showTimer()
        this.timer = setInterval(this.tick.bind(this),1000);
        $("#word-form").on("submit", this.submitWord.bind(this));
    }

    async tick(){
        this.game_length -= 1;
        this.showTimer();

        if (this.game_length === 0){
            clearInterval(this.timer);
            await this.scoreGame();
        }
    }

    showTimer(){
        $("#timer").text(this.game_length);
    }

    async scoreGame(){
        $("#word-cont").hide();
        const response = await axios.post("/post-score", {score: this.score});
        if (response.data.brokeRecord){
            this.notif(`New Record: ${this.score}!`,"good");
        }else{
            this.notif(`Final Score: ${this.score}`,"good");
        }
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
        console.log("submit");
        let guess = this.$guess.val();
        if(!guess){
            console.log("none");
            return;
        }

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
            this.addWord(guess);
            this.score += guess.length;
            this.updateScore();
            this.words.add(guess);
            this.notif(`Added ${guess}`, "good")
        }
        this.$guess.val("");

    }
}