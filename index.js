import characterData from './data.js'
import Character from './Character.js'

let enemyArray = ["zuko", "iroh", "azula", "ozai"]
let heroArray = ["katara", "sokka", "toph", "aang"]
let isWaiting = false
let musicPlayed = false

function getNewEnemy() {
    const nextEnemyData = characterData[enemyArray.shift()]
    return nextEnemyData ? new Character(nextEnemyData) : {}
}

function getNewHero() {
    const nextHeroData = characterData[heroArray.shift()]
    return nextHeroData ? new Character(nextHeroData) : {}
}

function attack() {


    if (!musicPlayed) {
        const music = new Audio("sound/avatar-agni-kai.mp3")
        music.play()
        musicPlayed = true
    }

    if (!isWaiting) {
        hero.setDiceHtml()
        enemy.setDiceHtml()
        hero.takeDamage(enemy.currentDiceScore)
        enemy.takeDamage(hero.currentDiceScore)
        render()

        if (enemy.dead) {
            isWaiting = true
            if (enemyArray.length > 0) {
                setTimeout(() => {
                    enemy = getNewEnemy()
                    render()
                    isWaiting = false
                }, 1500)
            } else {
                endGame()
            }
        }

        if (hero.dead) {
            isWaiting = true
            if (heroArray.length > 0) {
                setTimeout(() => {
                    hero = getNewHero()
                    render()
                    isWaiting = false
                }, 1500)
            } else {
                endGame()
            }
        }
    }
}

function restart() {
    setTimeout(() => {
        document.location.reload();
    }, 500);
}

function endGame() {
    isWaiting = true
    const endMessage = hero.health === 0 && enemy.health === 0 ?
        "No victors - everybody lost" :
        hero.health > 0 ? "Team Avatar Wins!" :
            "The Firenation Wins!"

    const endGif = hero.health === 0 && enemy.health === 0 ?
        "images/no-winner-gif.gif" :
        hero.health > 0 ? "images/avatar-wins-gif.gif" : "images/ozai-wins.gif"

    setTimeout(() => {
        document.body.innerHTML = `
                <div class="end-game">
                    <h2>Game Over</h2> 
                    <h3>${endMessage}</h3>
                    <img class="end-gif" src="${endGif}" alt="End GIF">
                </div>
                <section class="restart" id="restart">
                    <button class="restart-btn" id="restart-button">Restart</button>
                </section>
                `
        document.getElementById("restart-button").addEventListener('click', restart)
    }, 1500)
}

document.getElementById("attack-button").addEventListener('click', attack)
document.getElementById("restart-button").addEventListener('click', restart)

function render() {
    document.getElementById('hero').innerHTML = hero.getCharacterHtml()
    document.getElementById('enemy').innerHTML = enemy.getCharacterHtml()
}

let hero = getNewHero()
let enemy = getNewEnemy()
render()