//黒は-1,白は1,何もないは0
//width(幅)>-w height(高さ)>-h
//classの550はキャンバスの大きさ
//repace_reserch関数は改善の余地あり
/*・範囲外の時(data[x][y]のx,yが8超えた)の条件分岐で三行つかってる
  ・2回探索してる
  */
//💩プログラムだけど許して♡
function setup() {
  createCanvas(550, 550);
}

//大麻ー(タイマー)
class Time {
  constructor() {
    this.pretime = 0;
    this.flag = 0;
  }
  timer(set_time) {
    let a = this;
    if (!a.flag) {
      a.pretime = millis();
      a.flag = 1;
    }
    if (millis() - a.pretime > set_time)
      return 1;
  }
}

//posはpositionの略
class Pos {
  constructor(_x, _y) {
    this.x = _x;
    this.y = _y;
  }
  add(b) {
    let a = this;
    return new Pos(a.x + b.x, a.y + b.y);
  }
  //範囲外の時1を出力
  out_range() {
    let a = this;
    if (a.x >= 8 || a.y >= 8 || a.x < 0 || a.y < 0) return 1;
  }
}

//lef_topは左上の値
//オセロボード
class Board {
  constructor(_size) {
    this.size = _size;
    this.p_size = _size / 8;
    this.lef_top = new Pos((550 - _size) / 2, (550 - _size) / 2);
    //math.random()は0<=x<1の少数 board.orderは順番を表す
    //黒の番のとき-1,白の番の時1
    this.order = Math.random() * 10 > 5 ? -1 : 1;
    
    //end関数で使う
    this.flag=0;
    this.step=0;
    this.sub_b_count=0;
    this.sub_w_count=0;
  }
 reset() {
    let a = this;
  a.disc_data_reset();
  data[3][3] = 1;
  data[3][4] = -1;
  data[4][3] = -1;
  data[4][4] = 1;
  a.order = Math.random() * 10 > 5 ? -1 : 1;
  a.flag=0;
}
  disc_data_reset() {
    for (let x = 0; x < 8; x++) {
      for (let y = 0; y < 8; y++) data[y][x] = 0;
    }
  }
  //駒を描く関数
  drawdisc(x, y, color) {
    let a = this;
    let r = board.p_size / 2 - 2;
    //2を引くのは余白をつくるため
    let xx = a.p_size * x + a.p_size / 2;
    let yy = a.p_size * y + a.p_size / 2;
    fill(color);
    circle(xx + a.lef_top.x, yy + a.lef_top.y, r * 2);
  }
  
  //終わるときのどっちが勝ったあらわす
  end(b_count,w_count) {
    let a = this;
    for (let x = 0; x < 8; x++) {
      for (let y = 0; y < 8; y++) 
        if (data_able[y][x]) return 0;
    }
    
    if(button.draw("sort", 256, 40, hint_color, 2, 0, 0)||a.flag){
      if(!a.flag){
      a.disc_data_reset();
      a.flag=1;
      a.sub_b_count=b_count;
      a.sub_w_count=w_count;
    }
      //0.1秒間隔で並べていく
   if(!timer1.timer(100)) return 0;
     if(a.step<a.sub_w_count)
     data[7-a.step%8][7-Math.floor(a.step/8)]=1;
     if(a.step<a.sub_b_count)
     data[a.step%8][Math.floor(a.step/8)]=-1;
     timer1.flag=0;
      a.step++;
}
  }
}

//ボードの上や下にテキスト付長方形を表示
//down=1のとき下に表示 down=0のとき上に表示
class Text_rect {
  constructor(_w, _h, x_rect_num, x_div, down) {
    this.w = _w;
    this.h = _h;
    this.lef_top = new Pos(
      (550 - _w * x_rect_num) / x_div,
      (board.lef_top.y - _h) / 2 + (550 - board.lef_top.y) * down
    );
  }
  //num何番目の長方形か space何番目の空欄か
  //順番がわかるようスコアボードを囲む
  //🤔flameのごり押し感 flameは順番がわかるようにスコアボードを囲う
  draw(Text, text_color, text_size, rect_color, num, space, flame) {
    let a = this;
    let ww = (space + 1) * a.lef_top.x + (num - 1) * a.w;
    //🤔
    if (flame === 1) {
      fill("#FF3300");
      rect(ww - 10, a.lef_top.y - 10, a.w + 20, a.h + 20);
    }
    fill(rect_color);
    rect(ww, a.lef_top.y, a.w, a.h);
    fill(text_color);
    textSize(text_size);
    textAlign(CENTER, CENTER);
    text(Text, ww + a.w / 2, a.lef_top.y + a.h / 2);
    //長方形がクリックされたら1を返す
    if (
      mouseX >= ww &&
      mouseX <= ww + a.w &&
      mouseY >= a.lef_top.y &&
      mouseY <= a.lef_top.y + a.h &&
      mouseIsPressed
    )
      return 1;
  }
}

let board = new Board(320);
//黒と白の駒の数を表示するボード
let S_board = new Text_rect(100, 70, 2, 3, 0);
let button = new Text_rect(120, 70, 3, 2, 1);
let timer1 = new Time();

let data = [
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 1, -1, 0, 0, 0],
  [0, 0, 0, -1, 1, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
];
let data_able = [];
for (let y = 0; y < 8; y++) {
  data_able[y] = [];
  for (let x = 0; x < 8; x++) {
    data_able[y][x] = 0;
  }
}
//flag===trueのとき駒置き、駒を裏返す
//flag===falseのとき裏返るマスを数えるだけ
function search_replace(x, y, color, flag) {
  let o = new Pos(x, y);
  let count = 0;
  let dx = [-1, 0, 1, 1, 1, 0, -1, -1];
  let dy = [1, 1, 1, 0, -1, -1, -1, 0];
  //data[y][x]に駒がおかれてないときだけ実行
  if (o.out_range()) return 0; //💩
  if (data[y][x] !== 0) return 0; //💩
  for (let i = 0; i < 8; i++) {
    let sub_count = 0; //sub_countはflag替わりでもある
    let d = new Pos(dx[i], dy[i]);
    let t = new Pos(x + dx[i], y + dy[i]);
    if (t.out_range()) continue; //💩

    //探索して置き換えれるか調べる 置き換えれるときはsubcount=1
    while (data[t.y][t.x] === -color) {
      t = t.add(d);
      if (t.out_range()) break; //💩
      sub_count++;
    }
    //置き換え
    if (sub_count) {
      if (t.out_range()) continue; //💩
      if (data[t.y][t.x] === color) {
        if (flag) {
          data[y][x] = color;
          sub_count = 1;
          t = new Pos(x + dx[i], y + dy[i]); //💩
          while (data[t.y][t.x] === -color) {
            data[t.y][t.x] = color;
            t = t.add(d);
            sub_count++;
          }
        } else sub_count++;
      } else sub_count = 0;
    }
    count += sub_count;
  }
  if (count && flag) board.order = -board.order;
  return count;
}

let hint_on = 0;
let hint_color = 0;
let auto_on = 0;
let auto_color = 0;

function draw() {
  if (mouseIsPressed) {
    let xx = Math.floor((mouseX - board.lef_top.x) / board.p_size);
    let yy = Math.floor((mouseY - board.lef_top.y) / board.p_size);
    search_replace(xx, yy, board.order, 1);
  }

  for (let x = 0; x < 8; x++) {
    for (let y = 0; y < 8; y++) {
      data_able[y][x] = search_replace(x, y, board.order, 0);
    }
  }
  background("#FFCC66");

  /*ボード描画*/
  //緑の正方形
  fill("rgba(144,238,144,1)");
  square(board.lef_top.x, board.lef_top.y, board.size);
  //線描画
  for (let x = 1; x < 8; x++)
    line(
      board.p_size * x + board.lef_top.x,
      board.lef_top.y,
      board.p_size * x + board.lef_top.x,
      board.size + board.lef_top.y
    );
  for (let y = 1; y < 8; y++)
    line(
      board.lef_top.x,
      board.p_size * y + board.lef_top.y,
      board.size + board.lef_top.x,
      board.p_size * y + board.lef_top.y
    );
  stroke(0);
  strokeWeight(1);

  /*駒描画*/
  //駒の数を数える
  let b_count = 0; //黒カウント
  let w_count = 0; //白カウント
  for (let x = 0; x < 8; x++) {
    for (let y = 0; y < 8; y++) {
      if (!data[y][x] && (!data_able[y][x] || !hint_on)) continue;
      let color;
      if (data_able[y][x]) color = "#77FFFF";
      if (data[y][x] === 1) {
        color = 256;
        w_count++;
      } else if (data[y][x] === -1) {
        color = 0;
        b_count++;
      }
      board.drawdisc(x, y, color);
    }
  }

  /*スコア表示*/
  let tmp = board.order === -1 ? 1 : 0;
  S_board.draw(b_count, 256, 50, 0, 1, 0, tmp);
  S_board.draw(w_count, 0, 50, 256, 2, 1, tmp ^ 1);

  /*ボタン表示*/
  if (button.draw("reset", 256, 40, "#0000FF", 1, 0, 0)) board.reset();
  if (!hint_on) hint_color = "#0000FF";
  else hint_color = "#FF3300";
  if (button.draw("hint", 256, 40, hint_color, 2, 0, 0)) hint_on ^= 1;
  //💩同じの繰り返し
  if (!auto_on) auto_color = "#0000FF";
  else auto_color = "#FF3300";
  if (button.draw("auto", 256, 40, auto_color, 3, 0, 0)) auto_on ^= 1;
  board.end(b_count,w_count);
}
