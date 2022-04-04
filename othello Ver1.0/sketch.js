//黒は-1,白は1,何もないは
//width(幅)>-w height(高さ)>-h
//classの550はキャンバスの大きさ
//repace_reserch関数は改善の余地あり
/*・範囲外の時(data[x][y]のx,yが8超えた)の条件分岐で三行つかってる
  ・2回探索してる
  */
function setup() {
  createCanvas(550, 550);
}

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
    let b = 0;
    if (a.x >= 8 || a.y >= 8 || a.x < 0 || a.y < 0)
      b = 1;
    return b;
  }
}

//lef_topは左上の値
//オセロボード
class Board {
  constructor(_size) {
    this.size = _size;
    this.p_size = _size / 8;
    this.lef_top = new Pos(
      (550 - _size) / 2,(550 - _size) / 2 + (550 - _size) / 8
    );
  }
}

class Text_rect{
  constructor(_w, _h,x_rect_num,y_rect_num,x_div,y_div) {
    this.w = _w;
    this.h = _h;
    this.lef_top = new Pos((550 - _w * x_rect_num) / x_div, (board.lef_top.y - _h*y_rect_num) /y_div);
  }
  add(b) {
    let a = this;
    return new Text_rect(a.w + b.w, a.h + b.h);
  }
}
//ボタン
class Button{
  constructor(_w,_h){
    this.w = _w;
    this.h = _h;
  }
}
let board = new Board(320);
//黒と白の駒の数を表示するボード
let S_board = new Text_rect(100, 70,2,1,3,2);
let button = new Text_rect(80,50,3,1,2,2);


//オセロの状態を示す
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
for(let y=0;y<8;y++){
data_able[y]=[];
}

//flag===trueのとき駒置き、駒を裏返す
//flag===falseのとき裏返るマスを数えるだけ
function search_replace(x, y, color, flag) {
  let o = new Pos(x,y);
  let count = 0;
  let dx = [-1, 0, 1, 1, 1, 0, -1, -1];
  let dy = [1, 1, 1, 0, -1, -1, -1, 0];
  //data[y][x]に駒がおかれてないときだけ実行
  if(o.out_range()) return 0;//💩
  if (data[y][x] !== 0) return 0;//💩
  for (let i = 0; i < 8; i++) {
    let sub_count = 0; //sub_countはflag替わりでもある
    let d = new Pos(dx[i], dy[i]);
    let t = new Pos(x + dx[i], y + dy[i]);
    if (t.out_range()) continue;//💩
    
    //探索して置き換えれるか調べる 置き換えれるときはsubcount=1
    while (data[t.y][t.x] === -color) {
      t = t.add(d);
      if (t.out_range()) break;//💩
      sub_count = 1;
    }
    //置き換え
    if (sub_count) {
      if (t.out_range()) continue;//💩
      if (data[t.y][t.x] === color) {
        data[y][x] = color * flag;
        sub_count = 1;
        t = new Pos(x + dx[i], y + dy[i]);//💩
        while (data[t.y][t.x] === -color) {
          data[t.y][t.x] = color * flag;
          t = t.add(d);
          sub_count++;
        }
      } else sub_count = 0;
    }
    count += sub_count;
  }
  if (count) order = -order;
  return count;
}

//math.random()は0<=x<1の少数 orderは順番を表す
//黒の番のとき-1,白の番の時1
let order = Math.random() * 10 > 5 ? -1 : 1;

function draw() {
  if(mouseIsPressed) {
  let xx = Math.floor((mouseX - board.lef_top.x) / board.p_size);
  let yy = Math.floor((mouseY - board.lef_top.y) / board.p_size);
  a = search_replace(xx, yy, order, 1);
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
  r = board.p_size / 2 - 2;
  //2を引くのは余白をつくるため
  for (let x = 0; x < 8; x++) {
    for (let y = 0; y < 8; y++) {
      let xx = board.p_size * x + board.p_size / 2;
      let yy = board.p_size * y + board.p_size / 2;
      if(!data[y][x]) continue;
      if (data[y][x] === 1) {
        fill(256);
        w_count++;
      } 
      else {
        fill(0);
        b_count++;
      }
      circle(xx + board.lef_top.x, yy + board.lef_top.y, r * 2);
    }
  }
  /*スコア表示*/

  //順番がわかるようスコアボードを囲む
  fill("#FF3300");
  rect(
    S_board.lef_top.x + 2 * S_board.w * (order === 1 ? 1 : 0) - 10,
    S_board.lef_top.y - 10,S_board.w + 20,S_board.h + 20
  );

  //スコアボードの描画
  fill(0);
  rect(S_board.lef_top.x, S_board.lef_top.y, S_board.w, S_board.h);
  fill(256);
  rect(
    S_board.lef_top.x + 2 * S_board.w,S_board.lef_top.y,S_board.w,S_board.h
  );
  //スコア表示
  textSize(50);
  textAlign(CENTER,CENTER);
  text(
    b_count,S_board.lef_top.x + S_board.w / 2,S_board.lef_top.y + S_board.h / 2
  );
  fill(0);
  text(
    w_count,S_board.lef_top.x + S_board.w * 5 / 2,S_board.lef_top.y + S_board.h / 2
  );
}
