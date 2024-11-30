// Ressources to switch pages with nice transition

const loader = document.getElementById('loader')

document.addEventListener('DOMContentLoaded', () => {
    loader.classList.add('hidden')
})

document.addEventListener('beforeunload', () => {
    loader.classList.remove('hidden')
})

function goTo(path) {
    loader.classList.remove('hidden')
    location.href = path
}
