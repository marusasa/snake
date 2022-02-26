(function () {
    var config = {
        type: Phaser.AUTO,
        width: 800,
        height: 600, 
        backgroundColor: '#ffffff',
        parent: 'game-loc',
        physics: {
            default: 'arcade',
            arcade: {
                gravity: { y: 0, x: 0},
                debug: false 
            }
        },
        scene: {
            preload: preload,
            create: create,
            update: update
        }
    };

    

    var game = new Phaser.Game(config);
    var food;
    var direction = 1;  //0 = up, 1 = right, 2 = down, 3 = left
    var nextDirection = Array();
    var MAX_Y = 16;
    var MAX_X = 25;
    var squares = new Array(); 
    var currentX = 3;
    var currentY = 1;
    var movesX = Array();
    var movesY = Array();
    var lastPointer = 0;
    var foodX = 0;
    var foodY = 0;
    var scoreText;
    var score = 0;
    var gameText;

    function preload() {
        this.load.image('snake_body', 'assets/snake_square.png');
        this.load.image('food', 'assets/food_square.png');
    }

    function create() {
       
        //Draw outer lines
        var line1 = this.add.line(0,0,0,60,780,60,0x3a3a3a);
        line1.setOrigin(0,0);
        var line2 = this.add.line(0,0,0,570,780,570,0x3a3a3a);
        line2.setOrigin(0,0);
        var line3 = this.add.line(0,0,1,60,1,570,0x3a3a3a);
        line3.setOrigin(0,0);
        var line4 = this.add.line(0,0,780,60,780,570,0x3a3a3a);
        line4.setOrigin(0,0);

        for(var x = 0;x <= MAX_X;x++){
            squares.push(new Array());            
            for(var y = 0;y <= MAX_Y;y++){
                squares[x].push(this.physics.add.sprite(30 * (x+1)-15, 30 * (y+3)-15, 'snake_body'));
            }
        }

        foodX = 10;
        foodY = 1;
        food = this.physics.add.sprite((foodX+1) * 30 -15, (foodY+3) * 30 -15, 'food');

        //Add Text
        scoreText = this.add.text(16, 16, 'Score: ' + score, { fontSize: '32px', fill: '#000' });
        gameText = this.add.text(400, 16, '', { fontSize: '32px', fill: '#000' });

        resetGame();
        gameText.setText('Hit Space to Start');

        //  Input Events
        cursors = this.input.keyboard.createCursorKeys();
        cursors.up.on('down', function (event) {
            nextDirection.push(0);
        });
        cursors.down.on('down', function (event) {
            nextDirection.push(2);
        });
        cursors.left.on('down', function (event) {
            nextDirection.push(3);
        });
        cursors.right.on('down', function (event) {
            nextDirection.push(1);
        });
        cursors.space.on('down', function (event) {
           //set score to 0
           if(!go){
            resetGame();
            go = true;
           }
        });
    }   

    function resetGame(){
        //hide all snake body
        for(var x = 0;x <= MAX_X;x++){
            for(var y = 0;y <= MAX_Y;y++){
                squares[x][y].setVisible(false);
            }
        }
        
        movesX = Array();
        movesY = Array();
        nextDirection = Array();

        squares[1][1].setVisible(true);
        movesX.push(1);
        movesY.push(1);
        squares[2][1].setVisible(true);
        movesX.push(2);
        movesY.push(1);
        squares[3][1].setVisible(true);
        movesX.push(3);
        movesY.push(1);
        lastPointer = 0;

        currentX = 3;
        currentY = 1;
        foodX = 10;
        foodY = 1;
        food.setX((foodX+1)*30-15);
        food.setY((foodY+3)*30-15);

        direction = 1;
        score = 0;
        scoreText.setText('Score: ' + score);
        gameText.setText('');
    }

    function newFood(){
        var newX = Math.floor(Math.random() * (MAX_X-1));
        var newY = Math.floor(Math.random() * (MAX_Y-1));
        console.log(newX + ' ' + newY);
        while(squares[newX][newY].visible){
            newX = Math.floor(Math.random() * (MAX_X-1));
            newY = Math.floor(Math.random() * (MAX_Y-1));
        }
        food.setX((newX+1)*30-15);
        food.setY((newY+3)*30-15);
        foodX = newX;
        foodY = newY;
    }
   
    var gameTime = 0;
    var go = false;
    var gameSpeed = 150;
    function update(time,delta) {
        gameTime += delta;
        if(gameTime > gameSpeed && go){
            //0 = up, 1 = right, 2 = down, 3 = left
            var nd = direction;
            if(nextDirection.length > 0){
                nd = nextDirection.shift();
                if(nd == 0 && direction != 2){
                    direction = nd;
                }else if(nd == 2 && direction != 0){
                    direction = nd;
                }else if(nd == 3 && direction != 1){
                    direction = nd;
                }else if(nd == 1 && direction != 3){
                    direction = nd;
                }
            }
            if(direction == 0){
                currentY--;
            }else if(direction == 1){
                currentX++;
            }else if(direction == 2){
                currentY++;
            }else if(direction == 3){
                currentX--;
            }
            //move tail end before checking body collision
            squares[movesX[lastPointer]][movesY[lastPointer]].setVisible(false);
            lastPointer++;
            if(currentY < 0 || currentX < 0 || currentY > MAX_Y || currentX > MAX_X ||
                    squares[currentX][currentY].visible){
                go = false;
                gameText.setText('Game Over');
                this.time.delayedCall(2000, function(){if(!go){gameText.setText('Hit Space to Restart');}});
            }else{
                squares[currentX][currentY].setVisible(true);
                movesX.push(currentX);
                movesY.push(currentY);
                if(foodX == currentX && foodY == currentY){
                    //score
                    score++;
                    scoreText.setText('Score: ' + score);
                    //grow body
                    lastPointer--;                
                    newFood();
                    if(gameSpeed > 80){
                        gameSpeed -= 1;
                    }
                }            
                gameTime = 0;
            }
        }

    }


  
}());