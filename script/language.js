document.getElementById('langBtn').addEventListener('click', function() {
    const menu = document.getElementById('langMenu');
    menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
});

// Ferme le menu si l'utilisateur clique en dehors
window.onclick = function(event) {
    if (!event.target.matches('#langBtn')) {
        const dropdowns = document.getElementsByClassName('dropdown-content');
        for (let i = 0; i < dropdowns.length; i++) {
            dropdowns[i].style.display = 'none';
        }
    }
}

// Ajoute des gestionnaires d'événements aux liens de langue
const langLinks = document.querySelectorAll('#langMenu a');
langLinks.forEach(link => {
    link.addEventListener('click', function(event) {
        event.preventDefault(); // Empêche le lien de naviguer immédiatement
        const selectedLang = this.getAttribute('data-lang');
        const currentUrl = new URL(window.location.href);
        currentUrl.searchParams.set('lang', selectedLang);
        window.location.href = currentUrl.toString();
    });
});
