// -----------------------------------------------------------
// กหนดค่าตัวเกม
// -----------------------------------------------------------
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const WIDTH  = canvas.width;
const HEIGHT = canvas.height;

// ตัวละคร (player)
const player = {
    x: WIDTH/2,
    y: HEIGHT-50,
    w: 80,
    h: 20,
    speed: 7,
    color: '#ffca28'
};

// ลูกบอล (ball)
class Ball {
    constructor(){
        this.reset();
    }
    reset(){
        this.x = Math.random() * (WIDTH-30) + 15;
        this.y = -10;
        this.r  = 15;
        this.vy = Math.random() * 2 + 1.5; // ความเร็วลง
        this.vx = (Math.random() - 0.5) * 4; // ความเร็วข้างๆ
        this.color = '#ff5252';
    }
    update(){
        this.x += this.vx;
        this.y += this.vy;

        // สะท้อนผนังขาง
        if(this.x <= this.r || this.x >= WIDTH-this.r){
            this.vx = -this.vx;
        }
    }
    draw(){
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, Math.PI*2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();
    }
}
let ball = new Ball();

// สถานะการกดปม
const keys = {
    left:false,
    right:false,
    space:false
};

// คะแนน
let score = 0;
const scoreEl = document.getElementById('score');

// -----------------------------------------------------------
// อีเวนต์กด/ปล่อยปุ่ม
// -----------------------------------------------------------
document.addEventListener('keydown', e=>{
    switch(e.code){
        case 'ArrowLeft':  keys.left = true; break;
        case 'ArrowRight': keys.right = true; break;
        case 'Space':      keys.space = true; break;
    }
});
document.addEventListener('keyup', e=>{
    switch(e.code){
        case 'ArrowLeft':  keys.left = false; break;
        case 'ArrowRight': keys.right = false; break;
        case 'Space':      keys.space = false; break;
    }
});

// -----------------------------------------------------------
// ตรวจจับการชน
// -----------------------------------------------------------
function rectCircleColliding(rect, circle){
    // หาจดที่ใกลที่สุดบนสเหลี่ยม
    let distX = Math.abs(circle.x - rect.x - rect.w/2);
    let distY = Math.abs(circle.y - rect.y - rect.h/2);

    if(distX > (rect.w/2 + circle.r)) { return false; }
    if(distY > (rect.h/2 + circle.r)) { return false; }

    if(distX <= (rect.w/2)) { return true; }
    if(distY <= (rect.h/2)) { return true; }

    let dx = distX - rect.w/2;
    let dy = distY - rect.h/2;
    return (dx*dx + dy*dy <= (circle.r*circle.r));
}

// -----------------------------------------------------------
// อัพเดตและวาดเฟรม
// -----------------------------------------------------------
function update(){
    // เคลื่อน player
    if(keys.left){
        player.x -= player.speed;
        if(player.x < 0) player.x = 0;
    }
    if(keys.right){
        player.x += player.speed;
        if(player.x > WIDTH-player.w) player.x = WIDTH-player.w;
    }

    // ถ้า Space กด - ทำให้ ball เลื่อนขึ้น
    if(keys.space){
        ball.y -= 3;
    }

    // อัพเดต ball
    ball.update();

    // ตรวจจับชน
    if(rectCircleColliding(player, ball)){
        score += 1;
        scoreEl.textContent = 'คะแนน: ' + score;
        ball.reset();
    }

    // ถ้าลูกบอลตกด้านล่าง
    if(ball.y - ball.r > HEIGHT){
        ball.reset(); // หรือให้เกมสิ้นสุด
    }
}

function render(){
    // เคลยร์ canvas
    ctx.clearRect(0,0,WIDTH,HEIGHT);

    // วาด player
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x, player.y, player.w, player.h);

    // วาด ball
    ball.draw();
}

function loop(){
    update();
    render();
    requestAnimationFrame(loop);
}

loop(); // เริ่มเกม
