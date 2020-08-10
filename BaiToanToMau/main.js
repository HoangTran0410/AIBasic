let graph, dragEle

function setup() {
    createCanvas(800, 600).parent('canvasContainer')

    let listMaTranKe = [{
        // cac thanh pho
        labels: `Hague Lisbon Madrid Paris Rome Viene Berne Luxemburg Berlin Brusen`,
        maTranKe: `0 0 0 0 0 0 0 0 1 1
0 0 1 0 0 0 0 0 0 0
0 1 0 1 0 0 0 0 0 0
0 0 1 0 1 0 1 1 1 1
0 0 0 1 0 1 1 0 0 0
0 0 0 0 1 0 1 0 1 0
0 0 0 1 1 1 0 0 1 0
0 0 0 1 0 0 0 0 1 1
1 0 0 1 0 1 1 1 0 1
1 0 0 1 0 0 0 1 1 0`,
    }, {
        // bai toan cuoc hoi thao
        labels: `A B C D E F G H I`,
        maTranKe: `0 1 0 1 1 0 0 1 1
1 0 1 1 0 0 0 1 1
0 1 0 1 0 0 0 0 0
1 1 1 0 1 1 0 1 1
1 0 0 1 0 0 0 0 0
0 0 0 1 0 0 1 1 1
0 0 0 0 0 1 0 1 0
1 1 0 1 0 1 1 0 1
1 1 0 1 0 1 0 1 0`
    }]

    graph = new Graph().fromMaTranKe(listMaTranKe[random([0, 1])])

    document.getElementById('btnPaint').onclick = () => graph.toMau()
    document.getElementById('btnReset').onclick = () => graph.reset()
    document.getElementById('btnNhap').onclick = () => {
        let data = {
            labels: document.getElementById('inputLabels').value,
            maTranKe: document.getElementById('inputMatrix').value,
        }
        if (!data.labels || !data.maTranKe) {
            alert('thiếu dữ liệu')
            return;
        }
        graph.fromMaTranKe(data)
    }
}

function draw() {
    background(30)

    dragControl(graph)
    graph.show()

    CheckMouseEvent.update()

    text(~~frameRate(), 10, 10)
}

const CheckMouseEvent = {
    pMousePressed: false,
    update: () => this.pMousePressed = mouseIsPressed,
    pressed: () => !this.pMousePressed && mouseIsPressed,
    released: () => this.pMousePressed && !mouseIsPressed,
    dragged: () => this.pMousePressed && mouseIsPressed,
}

function dragControl(graph) {
    if (dragEle) {
        dragEle.position = createVector(mouseX, mouseY)
    }

    if (CheckMouseEvent.pressed()) {
        for (let v of graph.listVertex) {
            if (p5.Vector.dist(v.position, createVector(mouseX, mouseY)) < v.radius) {
                dragEle = v
            }
        }
    }

    if (CheckMouseEvent.released()) {
        dragEle = null
    }
}


// ==================================================================

class Graph {
    constructor(data = {}) {
        const {
            listVertex = [],
                listColors = ['magenta', 'yellow', 'green', 'blue', 'gray', 'white', 'pink', 'orange', 'purple'],
                maTranKe = [],
                listLabels = []
        } = data

        this.listVertex = listVertex
        this.listColors = listColors
        this.listLabels = listLabels
        this.maTranKe = maTranKe
    }

    show() {
        if (this.maTranKe) {
            stroke(100)
            for (let i = 0; i < this.maTranKe.length; i++) {
                let current = this.listVertex[i]
                let row = this.maTranKe[i]

                for (let j = i; j < row.length; j++) {
                    if (row[j] == 1) {
                        let connectWith = this.listVertex[j]
                        line(current.position.x, current.position.y, connectWith.position.x, connectWith.position.y)
                    }
                }
            }
        }

        for (let v of this.listVertex) {
            v.show()
        }
    }

    reset() {
        this.fromMaTranKe({
            maTranKe: this.maTranKe,
            labels: this.listLabels
        })
    }

    fromMaTranKe(data) {
        let {
            maTranKe = [], labels = []
        } = data

        let labelsArr = labels
        let maTranKeArr = maTranKe

        if (typeof(labels) == 'string') {
            labelsArr = labels.split(' ')
        }

        if (typeof(maTranKe) == 'string') {
            maTranKeArr = this.textToMatrix(maTranKe)
        }

        if (labelsArr.length < maTranKeArr[0].length) {
            alert('Số lượng labels và số đỉnh trong ma trận kề không khớp')
            return
        }

        if (maTranKeArr.length != maTranKeArr[0].length) {
            alert('Ma trận kề phải là hình vuông')
            return
        }

        if (typeof(maTranKe) == 'string') document.getElementById('inputMatrix').value = maTranKe
        if (typeof(labels) == 'string') document.getElementById('inputLabels').value = labels

        this.maTranKe = maTranKeArr
        this.listLabels = labelsArr
        this.listColors = []
        this.listVertex = []

        let i = 0
        for (let row of maTranKeArr) {
            this.listColors.push([random(255), random(255), random(255)])
            this.listVertex.push(new Vertex({
                label: (labelsArr[i] || i + 1)
            }))
            i++
        }

        return this
    }

    textToMatrix(text) {
        let rows = text.split('\n')
        let matrix = []

        for (let row of rows) {
            matrix.push([...row.split(' ')])
        }

        return matrix
    }

    toMau() {
        let count = 0
        
        // init
        for (let i = 0; i < this.listVertex.length; i++) {
            this.listVertex[i].color = null;
            this.listVertex[i].mauCamTo = [];
            this.listVertex[i].danhSachDinhKe = [];

            let bac = 0;
            for (let j = 0; j < this.maTranKe[i].length; j++) {
                if (this.maTranKe[i][j] == 1) {
                    bac++;
                    this.listVertex[i].danhSachDinhKe.push(this.listVertex[j]);
                }
            }
            this.listVertex[i].bac = bac;
        }

        while (true) {

            // tim dinh co bac lon nhat
            let dinhCoBacLonNhat = this.listVertex[0];

            for (let i = 0; i < this.listVertex.length; i++) {
                if (!this.listVertex[i].color) {
                    let better = (!this.listVertex[i].color && dinhCoBacLonNhat.color)
                    if (this.listVertex[i].bac > dinhCoBacLonNhat.bac || better) {
                        dinhCoBacLonNhat = this.listVertex[i];
                    }
                }
            }

            // chon mau
            let indexMauDuocTo = 0;
            while (true) {
                if (dinhCoBacLonNhat.mauCamTo.indexOf(this.listColors[indexMauDuocTo]) < 0) {
                    break;
                }
                indexMauDuocTo++;
            }
            dinhCoBacLonNhat.color = this.listColors[indexMauDuocTo];
            dinhCoBacLonNhat.colorIndex = indexMauDuocTo;
            dinhCoBacLonNhat.bac = 0;

            // ha bac
            for (let dinh of dinhCoBacLonNhat.danhSachDinhKe) {
                dinh.mauCamTo.push(dinhCoBacLonNhat.color);

                if (dinh.bac > 0 && !dinh.color)
                    dinh.bac--;
            }

            // xuat ra table


            // check to mau xong
            let done = true;
            for (let dinh of this.listVertex) {
                if (!dinh.color) {
                    done = false;
                }
            }

            if (done) break;
            if (count++ > this.listVertex.length * 2) {
                console.log(dinhCoBacLonNhat, this.listVertex)
                alert('Lỗi vòng lặp vượt quá số lần cho phép')
                break;
            }
        }
    }
}

class Vertex {
    constructor(data = {}) {
        const {
            radius = 15,
                label = '',
                color = null,
                position = createVector(random(width), random(height)),
        } = data

        this.position = position
        this.radius = radius
        this.label = label
        this.color = color
    }

    show() {
        if (!this.color) {
            stroke(255)
                // noFill()
            fill(0)
        } else {
            noStroke()
            fill(this.color)
        }
        circle(this.position.x, this.position.y, this.radius * 2)

        fill(255)
        noStroke()
        textAlign(CENTER, CENTER)
        textSize(constrain(this.radius, 12, 20))
        text(this.label, this.position.x, this.position.y - this.radius - 10)

        if (this.colorIndex != undefined) {
            text(this.colorIndex, this.position.x, this.position.y);
        }
    }
}


class TableData {
    constructor(data) {
        const {
            element
        } = data

        this.element = element
    }
}