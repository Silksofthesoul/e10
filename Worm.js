const {parse, stringify} = JSON;
const { min, max, atan, atan2, abc, PI } = Math;
const p = str => parse(str);
const s = obj => stringify(obj);
const co = obj => p(s(obj));
const floor = _ => Math.floor(_);
const int = val => parseInt(val);

const random = _ => Math.random();
const rndMinMaxInt = (min, max) => floor(random() * (max - min + 1)) + min;
const rndCoinBool = () => (~~floor(random() * 2) === 0);

const middle = (...arr) => arr.reduce((s,c,i) => (s+=c, s), 0) / arr.length;
const check = (x, [start, end]) => x >= start && x <= end;

const gx = (len, deg) => (len * sin((-deg + 180) * PI / 180) / len) * len;
const gy = (len, deg) => (len * cos((deg + 180) * PI / 180) / len) * len;

// Converts from degrees to radians.
const deg2rad = deg => deg * PI / 180;

// Converts from radians to degrees.
const rad2deg = rad => rad * 180 / PI;

const getDegByPoints = (x1, y1, x2, y2) => {
  let v = y2 - y1;
  let h = x2 - x1;
  return rad2deg(atan2(v, h));
};

const ratio = (a = 1, b = 1, c = 1) => a * c / b; // ??

const degGuard = deg => deg % 360;

const _seg = (x1, y1, x2, y2, stroke = 'rgb(0, 0, 0)') => ({x1, y1, x2, y2, stroke});
const getLine = ({x1, y1, x2, y2}) => ([x1, y1, x2, y2]);
const getStroke = ({stroke}) => stroke;
const getLast = arr => arr[arr.length - 1];

let factor = (mult = 1) => rndMinMaxInt(0, rndMinMaxInt(1, 3)) * mult;

class Worm {
  stroke = 'rgb(0, 0, 0)'
  x = 0;
  y = 0;

  borderX = int(640 / 2);
  borderY = int(640 / 2);

  borderWidth = 640;
  borderHeight = 640;


  length = 10;
  maxLength = 300;
  segments = [];
  test = 0;

  constructor ({width, height, x, y}) {
    this.borderWidth = width;
    this.borderHeight = height;
    this.borderX = x;
    this.borderY = y;
  }

  step() {
    let segment = co(getLast(this.segments) || this.initPosition);
    segment.x1 = segment.x2;
    segment.y1 = segment.y2;
    segment.x2 += rndCoinBool() ? -(this.length + factor()) : this.length + factor();
    segment.y2 += rndCoinBool() ? -(this.length + factor()) : this.length + factor();
    segment.stroke = `rgb(${rndMinMaxInt(0, 20)}, ${rndMinMaxInt(0, 10)}, ${rndMinMaxInt(0, 255)})`;

    if( segment.x2 >= this.maxX) segment.x2 += -(this.length);
    if( segment.y2 >= this.maxY) segment.y2 += -(this.length);

    if( segment.x2 <= this.minX) segment.x2 += this.length;
    if( segment.y2 <= this.minY) segment.y2 += this.length;

    if(this.segments.length > this.maxLength) this.segments.shift();
    this.segments.push(segment);
  }
  //
  // pointDraw({ stroke: _stroke, x, y, deg, length}) {
  //   stroke(_stroke);
  //   let x2 = floor(x + gx(length / 2, deg));
  //   let y2 = floor(y + gy(length / 2, deg));
  //   line(x, y, x2, y2);
  // }
  // getRelativeLine({ x, y, deg, length}) {
  //   let x2 = floor(x + gx(length, deg));
  //   let y2 = floor(y + gy(length, deg));
  //   return {
  //     x1: x,
  //     y1: y,
  //     x2,
  //     y2,
  //   };
  // }

  // rndDraw({stroke: _stroke = null, startX, startY, endX, endY}) {
  //   let segments = [];
  //   let r1 = abs(startX - endX);
  //   let r2 = abs(startY - endY);
  //   let r = ratio(r2, r1);
  //   let c = r * 180;
  //
  //   let deg = degGuard(getDegByPoints(startX, startY, endX, endY) + (85));
  //
  //   const f = _ => {
  //     let segment = co(getLast(segments) || {});
  //     segment.x1 = segments.length === 0 ? startX : segment.x2;
  //     segment.y1 = segments.length === 0 ? startY : segment.y2;
  //
  //     let {x2, y2} = this.getRelativeLine({
  //       x: segment.x1,
  //       y: segment.y1,
  //       deg: deg + factor(20),
  //       length: this.length,
  //     });
  //
  //     segment.x2 = x2;
  //     segment.y2 = y2;
  //     let condX = check(segment.x2, [startX - 0, endX + 0]);
  //     let condY = check(segment.y2, [startY - 0, endY + 0]);
  //     if(!condX && !condY) return false;
  //     segment.stroke = _stroke;
  //     segments.push(segment);
  //     return true;
  //   };
  //
  //   let [maxCount, count] = [150, 0];
  //
  //   while(true) {
  //     if(++count > maxCount) break;
  //     if(f() === false) break;
  //   }
  //
  //   for (let segment of segments) {
  //     let [x1, y1, x2, y2] = getLine(segment);
  //     stroke(getStroke(segment));
  //     line(x1, y1, x2, y2);
  //   }
  // }

  drawBorder() {
    stroke(`rgba(200, 0, 0, 1)`);
    const border = {
      top: [this.borderX, this.borderY, this.borderX + this.borderWidth, this.borderY],
      bottom: [this.borderX, this.borderY + this.borderHeight, this.borderX + this.borderWidth, this.borderY + this.borderHeight],
      left: [this.borderX, this.borderY, this.borderX, this.borderY + this.borderHeight],
      right: [this.borderX + this.borderWidth, this.borderY, this.borderX + this.borderWidth, this.borderY + this.borderHeight]
    };
    line(...border.top);
    line(...border.bottom);
    line(...border.left);
    line(...border.right);
  }

  get maxX() { return this.borderX + this.borderWidth; }
  get maxY() { return this.borderY + this.borderHeight; }
  get minX() { return this.borderX; }
  get minY() { return this.borderY; }
  get initPosition() {
    const x1 = rndMinMaxInt(this.borderX, this.borderX + (this.borderWidth - this.length));
    const y1 = rndMinMaxInt(this.borderY, this.borderY + (this.borderHeight - this.length));
    const x2 = x1 + this.length;
    const y2 = y1 + this.length;
    return {x1, y1, x2, y2, stroke: this.stroke};
  }

  drawWorm() {
    for (let segment of this.segments) {
      stroke(getStroke(segment));
      line(...getLine(segment));
    }
  }

  render() {
    this.drawBorder();
    this.drawWorm();
  }

}
