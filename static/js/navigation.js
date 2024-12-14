// Ressources to switch pages with nice transition

const loader = document.getElementById('loader')

document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        loader.classList.add('hidden')
    }, 1000)
})

document.addEventListener('beforeunload', () => {
    loader.classList.remove('hidden')
})

function goTo(path, gameImage = '/static/img/arcade.png') {
    loader.classList.remove('hidden')
    const loaderImage = loader.querySelector('img')
    loaderImage.src = gameImage
    setTimeout(() => {
        location.href = path
    }, 500)
    setTimeout(() => {
        // Si rollback de l'utilisateur, on enlève l'écran de chargement après 2s
        loader.classList.add('hidden')
    }, 2000)
}
