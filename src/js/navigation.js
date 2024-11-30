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

function goTo(path, gameImage = 'img/arcade_small.png') {
    loader.classList.remove('hidden')
    const loaderImage = loader.querySelector('img')
    loaderImage.src = gameImage
    setTimeout(() => {
        location.href = path
    }, 500)
}
