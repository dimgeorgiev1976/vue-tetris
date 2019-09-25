// ÐšÐ¾Ð½ÑÑ‚Ð°Ð½Ñ‚Ñ‹
const CANVAS_WIDTH = 375
const CANVAS_HEIGHT = 750
const CANVAS_BACKGROUND = '#fbfbfb'

const ROW_NUMBERS = 20
const COLUMNS_NUMBERS = 10
const PADDING = 2

const fieldWidth = CANVAS_WIDTH / COLUMNS_NUMBERS
const fieldHeight = CANVAS_HEIGHT / ROW_NUMBERS

const canvas = document.querySelector('canvas')
const context = canvas.getContext('2d')

const map = getMap();
let block = getBlock(9, '#756c83', 4, 0)
let downTime = getDownTime()



canvas.width = CANVAS_WIDTH
canvas.height = CANVAS_HEIGHT

start()

function start() {
	requestAnimationFrame(tick)
}

// Ð Ð°Ð½Ð´Ð¾Ð¼Ð½Ñ‹Ð¹ Ð±Ð»Ð¾Ðº
function getRandomInt(min, max) {
	return Math.floor(Math.random() * (max - min)) + min;
}

function tick(timestamp) {

	if (timestamp >= downTime) {
		const blockCopy = block.getCopy()
		blockCopy.y = blockCopy.y + 1

		if (canBlockExists(blockCopy)) {
			block = blockCopy
		}
		else {
			saveBlock()
			const lines = clearLines()
			console.log(lines)
			block = getBlock(getRandomInt(1, 19))
		}
		downTime = timestamp + getDownTime()
	}

	clearCanvas()
	drawBlock()
	drawState()
	requestAnimationFrame(tick)
}

function getDownTime() {
	return 1000
}

// ÐžÑ‡Ð¸ÑÑ‚Ð¸Ñ‚ÑŒ ÐºÐ°Ð½Ð²Ð°Ñ
function clearCanvas() {
	context.fillStyle = CANVAS_BACKGROUND
	context.strokeStyle = '#ffffff'
	context.rect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
	context.fill()
	context.stroke()
}

// Ð—Ð°Ñ€Ð¸ÑÐ¾Ð²Ð°Ñ‚ÑŒ ÑÑ‡ÐµÐ¹ÐºÑƒ Ð¿Ð¾Ð»Ñ
function drawField(x, y, color) {
	context.fillStyle = color
	context.fillRect(
		x * fieldWidth + PADDING,
		y * fieldHeight + PADDING,
		fieldWidth - 2 * PADDING,
		fieldHeight - 2 * PADDING
	)
}

function drawBlock() {
	for (const part of block.getIncludetParts()) {
		drawField(part.x, part.y, block.color)
	}
}

// ÐŸÐ¾Ð¸ÑÐº Ð·Ð°Ð¿Ð¾Ð»Ð½ÐµÐ½Ð½Ñ‹Ñ… Ð»Ð¸Ð½Ð¸Ð¹
function clearLines() {
	let lines = 0

	for (let y = ROW_NUMBERS - 1; y >= 0; y--) {
		let flag = true
		for (let x = 0; x < COLUMNS_NUMBERS; x++) {
			if (!getField(x, y)) {
				flag = false
				break
			}

		}
		if (flag) {
			lines = lines + 1

			for (let t = y; t >= 1; t--) {
				for (let x = 0; x < COLUMNS_NUMBERS; x++) {
					map[t][x] = map[t - 1][x]
					map[t - 1][x] = null

				}

			}
			y = y + 1
		}

	}
	return lines
}

// ÐšÐ°Ñ€Ñ‚Ð° Ð²ÑÐµÑ… ÐºÐ»ÐµÑ‚Ð¾Ðº Ð½Ð° Ð¿Ð¾Ð»Ðµ
function getMap() {
	const map = []
	for (let y = 0; y < ROW_NUMBERS; y++) {
		const row = []
		for (let x = 0; x < COLUMNS_NUMBERS; x++) {
			row.push(null)

		}
		map.push(row)
	}
	return map
}

function saveBlock() {
	for (const part of block.getIncludetParts()) {
		setField(part.x, part.y, block.color)
	}
}

// ÐžÑ‚Ñ€Ð¸ÑÐ¾Ð²Ð°Ñ‚ÑŒ ÑÐ¾ÑÑ‚Ð¾ÑÐ½Ð¸Ðµ Ñ‚ÐµÑ‚Ñ€Ð¸ÑÐ° ( Ð²ÑÐµ, Ñ‡Ñ‚Ð¾ ÐµÑÑ‚ÑŒ Ð² map[] )
function drawState() {
	for (let y = 0; y < ROW_NUMBERS; y++) {
		for (let x = 0; x < COLUMNS_NUMBERS; x++) {
			const field = map[y][x]
			if (field) {
				drawField(x, y, field)
			}
		}

	}

}

// ÐŸÐ¾Ð»ÑƒÑ‡ÐµÐ½Ð¸Ðµ Ð±Ð»Ð¾ÐºÐ°
function getBlock(type, color = 'black', x = 4, y = 0) {
	const block = { type, x, y, color }

	// ÐœÐµÑ‚Ð¾Ð´ Ð²Ð¾Ð·Ð²Ñ€Ð°Ñ‰Ð°ÐµÑ‚ Ð¼Ð°ÑÑÐ¸Ð² Ð²ÑÐµÑ… Ñ‡Ð°ÑÑ‚ÐµÐ¹ Ð±Ð»Ð¾ÐºÐ°
	block.getIncludetParts = function () {

		const p = (dx, dy) => ({ x: block.x + dx, y: block.y + dy })

		switch (block.type) {
			case 1:return [p(0, 0), p(1, 0), p(0, 1), p(1, 1)]

			case 2:return [p(0, 0), p(-1, 0), p(1, 0), p(0, -1)]
			case 3:return [p(0, 0), p(-1, 0), p(1, 0), p(0, 1)]
			case 4:return [p(0, 0), p(0, 1), p(0, -1), p(1, 0)]
			case 5:return [p(0, 0), p(-1, 0), p(0, 1), p(0, -1)]
			case 6:return [p(0, 0), p(1, 0), p(0, 1), p(-1, 1)]
			case 7:return [p(0, 0), p(0, 1), p(1, 1), p(-1, 0)]
			case 8:return [p(0, 0), p(-1, 0), p(-1, -1), p(0, 1)]
			case 9:return [p(0, 0), p(0, -1), p(-1, 0), p(-1, 1)]
			case 10:return [p(0, 0), p(1, 0), p(2, 0), p(-1, 0)]
			case 11:return [p(0, 0), p(0, -1), p(0, 1), p(0, 2)]

			case 12:return [p(0, 0), p(1, 0), p(0, 1), p(0, 2)]
			case 13:return [p(0, 0), p(-1, 0), p(-2, 0), p(0, 1)]
			case 14:return [p(0, 0), p(-1, 0), p(0, -1), p(0, -2)]
			case 15:return [p(0, 0), p(0, -1), p(1, 0), p(2, 0)]
			case 16:return [p(0, 0), p(-1, 0), p(0, 1), p(0, 2)]
			case 17:return [p(0, 0), p(-1, 0), p(-2, 0), p(0, -1)]
			case 18:return [p(0, 0), p(1, 0), p(0, -1), p(0, -2)]
			case 19:return [p(0, 0), p(1, 0), p(2, 0), p(0, 1)]
		}

	}

	// ÐœÐµÑ‚Ð¾Ð´
	block.getNextBlock = function () {
		const p = n => getBlock(n, block.color, block.x, block.y)
		switch (block.type) {
			case 1:return p(1)
			case 2:return p(4)
			case 3:return p(5)
			case 4:return p(3)
			case 5:return p(2)
			case 6:return p(8)
			case 7:return p(9)
			case 8:return p(6)
			case 9:return p(7)
			case 10:return p(11)
			case 11:return p(10)
			case 12:return p(13)
			case 13:return p(14)
			case 14:return p(15)
			case 15:return p(12)
			case 16:return p(17)
			case 17:return p(18)
			case 18:return p(19)
			case 19:return p(16)
			default:
				break;
		}
	}

	// ÐœÐµÑ‚Ð¾Ð´ Ð²Ð¾Ð·Ð²Ñ€Ð°Ñ‰Ð°ÐµÑ‚ Ð½Ð¾Ð²Ñ‹Ð¹ Ð±Ð»Ð¾Ðº Ñ Ñ‚ÐµÐ¼Ðµ Ð¶Ðµ Ð´Ð°Ð½Ð½Ñ‹Ð¼Ð¸
	block.getCopy = function () {
		return getBlock(block.type, block.color, block.x, block.y)
	}

	return block
}

// ÐœÐ¾Ð¶Ð½Ð¾ Ð»Ð¸ Ð¿ÐµÑ€ÐµÐ¼ÐµÑÑ‚Ð¸Ñ‚ÑŒ Ð±Ð»Ð¾Ðº
function canBlockExists(block) {
	for (const part of block.getIncludetParts()) {
		if (getField(part.x, part.y)) {
			return false
		}
	}
	return true
}

// Ð’Ð·ÑÑ‚ÑŒ ÑÑƒÑ‰ÐµÑÑ‚Ð²ÑƒÑŽÑ‰ÑƒÑŽ ÑÑ‡ÐµÐ¹ÐºÑƒ
function getField(x, y) {
	if (map[y] === undefined || map[y][x] === undefined) {
		return 'black'
	}
	return map[y][x]
}

function setField(x, y, value) {
	if (map[y] === undefined || map[y][x] === undefined) {
		return
	}
	return map[y][x] = value
}

document.body.addEventListener('keyup', function (event) {
	if (event.code === 'KeyA') {
		const blockCopy = block.getCopy()
		blockCopy.x = blockCopy.x - 1
		if (canBlockExists(blockCopy)) {
			block = blockCopy
		}
	}
	if (event.code === 'KeyD') {
		const blockCopy = block.getCopy()
		blockCopy.x = blockCopy.x + 1
		if (canBlockExists(blockCopy)) {
			block = blockCopy
		}
	}
	if (event.code === 'KeyW') {
		const blockCopy = block.getNextBlock()
		if (canBlockExists(blockCopy)) {
			block = blockCopy
		}
	}
	if (event.code === 'KeyS') {
		const blockCopy = block.getCopy()
		blockCopy.y = blockCopy.y + 1
		if (canBlockExists(blockCopy)) {
			block = blockCopy
		}
	}

})
