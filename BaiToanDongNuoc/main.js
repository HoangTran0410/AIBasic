/********************************************************
 Luat 1: Nếu VX đầy thì đổ VX đi                    
 Luat 2: Nếu VY rỗng thì đổi đầy nước cho bình 2    
 Luat 3: Nếu VX không đầy và VY không rỗng thì trút 
 	nước từ VY sang VX cho đến khi VX đầy
*********************************************************/

let binh1 = 7;
let binh2 = 4;
let luongNuocCanLay = 5;

// Vx là
function dongnuoc(Vx, Vy, z) {
  // lượng nước hiện có trog bình 1, 2
  let x = 0,
    y = 0;
  let limit_countdown = 150;
  let times = 0;

  console.log()

  while (x != z && y != z) {
    if (x == Vx) {
      x = 0;
      times++;
      console.log(
        `Bước ${times}: Luật 1: Bình "${Vx} lít" đầy, đổ bình này đi => ${x} - ${y}`
      );
    }
    if (y == 0) {
      y = Vy;
      times++;
      console.log(
        `Bước ${times}: Luật 2: Bình "${Vy} lít" rỗng, đổ đầy nước cho bình này => ${x} - ${y}`
      );
    }
    if (y > 0) {
      let k = Math.min(Vx - x, y); // k là lượng nước
      x = x + k;
      y = y - k;
      times++;
      console.log(
        `Bước ${times}: Luật 3: Bình "${Vx} lít" không đầy và bình "${Vy}" không rỗng => đổ đầy từ bình ${Vy} sang ${Vx} => ${x} - ${y}`
      );
    }

    limit_countdown--;
    if (limit_countdown < 0) {
      console.warn("overload > 100 times!!!");
      break;
    }
  }

  if (limit_countdown >= 0) {
    console.warn(`Hoàn Thành sau ${times} bước`);
  }

  return 0;
}
