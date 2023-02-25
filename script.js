const fieldHTML = document.querySelector('#field')
const body = document.querySelector('body')

//создание игрового поля: 20х20 ячеек по 30х30 px
for (let i = 0; i < 400; i++) {
    let cell = document.createElement('div')
    cell.className = 'cell'
    fieldHTML.append(cell)
    cell.style.left = i % 20 * 30 + 'px'
    cell.style.top = - Math.floor(i/20) * 30 * 19 - i % 20 * 30 + 'px'
}

const field = document.querySelectorAll('.cell')
const walls = document.querySelectorAll('.wall')

//первоначальная расстановка относительно клиентских размеров экрана
let docWidth, docHeight
const faq = document.querySelector('#faq')
//const changeField = document.querySelector('#changeField')
const pointsHTML = document.querySelector('#points')
let points, isMoveStart, speed
const resetButton = document.querySelector('#reset')

//смена положения всех игровых блоков
const fieldPosition = () => {
    docWidth = document.documentElement.clientWidth
    docHeight = document.documentElement.clientHeight
    
    fieldHTML.style.left = (docWidth - 20 * 30) / 2 + 'px'
    fieldHTML.style.top = (docHeight - 20 * 30) / 2 - 40 + 'px'
    
    faq.style.top = (docHeight - 23 * 30) / 2 + 'px'
    faq.style.display = 'block'

    pointsHTML.style.left = (docWidth + 20 * 30) / 2 - 10 + 'px'
    pointsHTML.style.top = (docHeight - 24 * 30) / 2 + 'px'
    pointsHTML.style.display = 'block'
    
    resetButton.style.left = (docWidth - 80) / 2 + 'px'
    resetButton.style.buttom = (docHeight - 20 * 30) / 2 + 'px'
}

//удаление хвоста при движении
const tailRemove = () => {
    const index = Array.prototype.indexOf.call(field, tailSnake)
    tailSnake.className = 'cell'
    tailSnake.innerHTML = Number.MAX_SAFE_INTEGER
    const up = Number(field[index - 20].innerHTML)
    const down = Number(field[index + 20].innerHTML)
    const right = Number(field[index + 1].innerHTML)
    const left = Number(field[index - 1].innerHTML)
    if ((left < right) && (left < up) && (left < down)) tailSnake = field[index - 1]
    else if ((right < up) && (right < down)) tailSnake = field[index + 1]
    else if (up < down) tailSnake = field[index - 20]
    else tailSnake = field[index + 20]
}

//рандомная вишня на поле
const spawnBerry = () => {
    let index
    while ((index === undefined) || (field[index].className !== 'cell')) {
        index = Math.floor(Math.random() * (378 - 21 + 1) + 21)
    }
    field[index].classList.add('berry')
}

//просчет времени с начала игры
let timeStartGame, timeInGame
const timeNow = () => {
    timeInGame = new Date().getTime() - timeStartGame.getTime()
    return timeInGame
}

//победа в игре
const winGame = () => {
    clearInterval(move)
    body.style.backgroundColor = 'lightgreen'
    setTimeout (() => alert('Поздравляем! Вы победили!'), 100)
}
//проигрыш в игре
const crash = () => {
    clearInterval(move)
    isMoveStart = false
    body.style.backgroundColor = 'crimson'
    time = Math.round(timeInGame/600)/100
    setTimeout (() => alert(`Вы проиграли со счетом ${points}, игра длилась ${time} минут`),
    100)
    resetButton.style.display = 'block'
}

//функция для движения
const moveDone = () => {
    headSnake.innerHTML = timeNow()
    if (!headSnake.classList.contains('berry')) tailRemove()
    else {
        headSnake.classList.remove('berry')
        spawnBerry()
        points++
        if (speed > 150) speed -= 5
        console.log(speed);
        clearInterval(move)
        moveStart()
        pointsHTML.innerHTML = points
        if (points === 322) winGame()
    }
    if ((headSnake.classList.contains('wall')) || 
    (headSnake.classList.contains('snakeBody'))) {
        crash()
        return false
    }
    return true
}

//движение змеи
const moveLeft = () => {
    const index = Array.prototype.indexOf.call(field, headSnake)
    headSnake.className = 'cell snakeBody'
    headSnake = field[index - 1]
    if (moveDone()) headSnake.classList.add('snakeHeadLeft')
}
const moveRight = () => {
    const index = Array.prototype.indexOf.call(field, headSnake)
    headSnake.className = 'cell snakeBody'
    headSnake = field[index + 1]
    if (moveDone()) headSnake.classList.add('snakeHeadRight')
}
const moveUp = () => {
    const index = Array.prototype.indexOf.call(field, headSnake)
    headSnake.className = 'cell snakeBody'
    headSnake = field[index - 20]
    if (moveDone()) headSnake.classList.add('snakeHeadUp')
}
const moveDown = () => {
    const index = Array.prototype.indexOf.call(field, headSnake)
    headSnake.className = 'cell snakeBody'
    headSnake = field[index + 20]
    if (moveDone()) headSnake.classList.add('snakeHeadDown')
}

const keyDownFirst = () => {
    isMoveStart = true
    faq.style.display = 'none'
    timeStartGame = new Date()
}

//тайминги для движения
let isGoLeft, isGoRight, isGoUp, isGoDown
document.addEventListener('keydown', (event) => {
    if ((event.code === 'ArrowLeft' || event.code === 'KeyA') && 
    (!headSnake.classList.contains('snakeHeadRight'))) {
        isGoLeft = true
        isGoRight = false
        isGoUp = false
        isGoDown = false
        if (!isMoveStart) keyDownFirst()
    }
    if ((event.code === 'ArrowRight' || event.code === 'KeyD') && 
    (!headSnake.classList.contains('snakeHeadLeft'))) {
        isGoLeft = false
        isGoRight = true
        isGoUp = false
        isGoDown = false
        if (!isMoveStart) keyDownFirst()
    }
    if ((event.code === 'ArrowUp' || event.code === 'KeyW') && 
    (!headSnake.classList.contains('snakeHeadDown'))) {
        isGoLeft = false
        isGoRight = false
        isGoUp = true
        isGoDown = false
        if (!isMoveStart) keyDownFirst()
    }
    if ((event.code === 'ArrowDown' || event.code === 'KeyS') && 
    (!headSnake.classList.contains('snakeHeadUp'))) {
        isGoLeft = false
        isGoRight = false
        isGoUp = false
        isGoDown = true
        if (!isMoveStart) keyDownFirst()
    }
})

//запуск проверки начала движения
let move
const moveStart = () => {
    move = setInterval(() => {
        if (isGoLeft) moveLeft()
        if (isGoRight) moveRight()
        if (isGoUp) moveUp()
        if (isGoDown) moveDown()
    }, speed)
}

//все в начальное положение для новой игры
const newGame = () => {
    let i
    field.forEach((cell) => {
        i = Array.prototype.indexOf.call(field, cell)
        cell.innerHTML = Number.MAX_SAFE_INTEGER
        cell.className = 'cell'
        if ((i % 20 < 1) || (i % 20 > 18) || (i < 19) || (i > 380)) {
            cell.classList.add('wall')
            if ((i === 0) && (i === 19) && (i === 380) && (i === 399)) {
                cell.classList.remove('wall')
            }
        }
    })
    field[210].classList.add('snakeHeadUp')
    headSnake = field[210]
    tailSnake = field[210]
    isMoveStart = false
    spawnBerry()
    fieldPosition()
    points = 0
    isGoLeft = false 
    isGoRight = false 
    isGoUp = false 
    isGoDown = false
    speed = 500
    moveStart()
}
newGame()

//при нажатии на кнопку перезапуска
resetButton.onclick = () => {
    resetButton.style.display = 'none'
    body.style.backgroundColor = 'grey'
    pointsHTML.innerHTML = '0'
    newGame()
}
