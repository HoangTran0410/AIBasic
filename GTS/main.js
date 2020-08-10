const matrix = [
	[0, 1, 2, 7, 5],
	[1, 0, 4, 4, 3],
	[2, 4, 0, 1, 2],
	[7, 4, 1, 0, 3],
	[5, 3, 2, 3, 0]
]

const labels = ['A', 'B', 'C', 'D', 'E']

function GTS1(matrix, start, labels) {
	let tour = [start],
		cost = 0,
		current = start

	// mảng gán nhãn 
	const flag = []
	for (let i = 0; i < matrix.length; i++) {
		flag[i] = (i == start ? 1 : 0)
	}

	// lặp n -1 lần - tương ứng n-1 đỉnh còn lại (ngoại trừ đỉnh bắt đầu)
	for (let j = 0; j < matrix.length - 1; j++) {

		// ở mỗi đỉnh tìm đỉnh kề có giá thành nhỏ nhất
		let minCost = Infinity, minIndex = 0
		for (let i = 0; i < matrix[current].length; i++) {
			if (!flag[i]) {
				if (matrix[current][i] < minCost) {
					minCost = matrix[current][i]
					minIndex = i
				}
			}
		}

		tour.push(minIndex)
		cost += minCost
		flag[minIndex] = 1
		current = minIndex
	}

	// trở về đỉnh cũ
	tour.push(start)
	cost += matrix[current][start]

	if (labels) {
		tour = tour.map(i => labels[i])
	}

	// trả về giá trị
	return {
		tour, cost
	}
}

function GTS2(matrix, labels) {
	let minTour, minCost = Infinity

	for (let i = 0; i < matrix.length; i++) {
		const { tour, cost } = GTS1(matrix, i, labels)
		// console.log({tour, cost})

		if (cost < minCost) {
			minTour = tour
			minCost = cost
		}
	}

	return {
		minTour,
		minCost
	}
}

console.log('GTS1: start A', GTS1(matrix, 0, labels))
console.log('GTS2: ', GTS2(matrix, labels))