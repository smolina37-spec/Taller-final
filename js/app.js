document.addEventListener("DOMContentLoaded", () => {
    let currentPage = 1;
    let totalPages = 1;
    let currentQuery = '';
    const charactersContainer = document.getElementById('characters');
    const ariaMessage = document.getElementById('aria-message');
    const searchForm = document.getElementById('search-form');
    const searchInput = document.getElementById('search-input');
    const prevPageBtn = document.getElementById('prev-page');
    const nextPageBtn = document.getElementById('next-page');
    const pageIndicator = document.getElementById('page-indicator');

    async function fetchCharacters(page = 1, query = '') {
        let url = `https://rickandmortyapi.com/api/character?page=${page}`;
        if (query) url += `&name=${encodeURIComponent(query)}`;
        const response = await fetch(url);
        const data = await response.json();
        totalPages = data.info ? data.info.pages : 1;
        return data.results || [];
    }

    function renderCharacters(characters) {
        charactersContainer.innerHTML = '';
        if (characters.length === 0) {
            charactersContainer.innerHTML = '<p>No se encontraron personajes.</p>';
            return;
        }
        characters.forEach(character => {
            const div = document.createElement('div');
            div.className = 'character-card';
            div.innerHTML = `
                <img src="${character.image}" alt="${character.name}">
                <h3>${character.name}</h3>
                <p>${character.species}</p>
            `;
            charactersContainer.appendChild(div);
        });
    }

    async function loadCharacters(page, query = '') {
        ariaMessage.textContent = 'Cargando personajes...';
        const characters = await fetchCharacters(page, query);
        renderCharacters(characters);
        ariaMessage.textContent = `Se cargaron ${characters.length} personajes.`;
        pageIndicator.textContent = `Página ${currentPage} de ${totalPages}`;
        prevPageBtn.disabled = currentPage <= 1;
        nextPageBtn.disabled = currentPage >= totalPages;
    }

    // Inicial
    loadCharacters(currentPage);

    // Buscador
    searchForm.addEventListener('submit', (e) => {
        e.preventDefault();
        currentQuery = searchInput.value.trim();
        currentPage = 1;
        loadCharacters(currentPage, currentQuery);
    });

    // Paginación
    prevPageBtn.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            loadCharacters(currentPage, currentQuery);
        }
    });

    nextPageBtn.addEventListener('click', () => {
        if (currentPage < totalPages) {
            currentPage++;
            loadCharacters(currentPage, currentQuery);
        }
    });
});
