const errorBox = document.getElementById('error')
const successBox = document.getElementById('message')

function sendScore(score, game) {
    if (!logged) return
    const data = {
        score: score,
        game: game
    }
    fetch('/sendScore', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
        .then(response => response.json())
        .then(response => {
            if (!response.success) {
                // Session expired
                if (response.code == 401) goTo('/')
                errorBox.innerText = response.message
                errorBox.classList.remove('hidden')
                return
            }
            successBox.innerText = "Vos score ont bien été enregistrés !"
            successBox.classList.remove('hidden')
            console.log(response)
        })
        .catch(err => {
            errorBox.innerText = err
            errorBox.classList.remove('hidden')
        })
}

function hideBoxes() {
    errorBox.classList.add('hidden')
    successBox.classList.add('hidden')
}
