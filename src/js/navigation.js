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

function goTo(path) {
    loader.classList.remove('hidden')
    setTimeout(() => {
        location.href = path
    }, 500)
}
