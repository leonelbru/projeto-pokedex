const pokedex = document.getElementById('pokedex');
const loadMoreBtn = document.getElementById('loadMore');
const modal = document.getElementById('modal');
const closeModal = document.getElementById('closeModal');
const pokemonDetails = document.getElementById('pokemonDetails');

let offset = 0;
const limit = 10;

const typeColors = {
  grass: 'type-grass',        // verde claro
  fire: 'type-fire',          // vermelho
  water: 'type-water',        // azul
  bug: 'type-bug',            // verde escuro
  electric: 'type-electric',  // amarelo
  poison: 'type-poison',      // roxo
  normal: 'type-normal',      // quase branco
  ground: 'type-ground',      // marrom
};

async function fetchPokemons(offset, limit) {
  for (let i = offset + 1; i <= offset + limit; i++) {
    if (i > 151) return; // apenas geração 1
    const url = `https://pokeapi.co/api/v2/pokemon/${i}`;
    const res = await fetch(url);
    const pokemon = await res.json();
    displayPokemon(pokemon);
  }
}

function displayPokemon(pokemon) {
  const card = document.createElement('div');
  const mainType = pokemon.types[0].type.name;
  card.classList.add('card', typeColors[mainType] || 'type-grass');

  card.innerHTML = `
    <h3>${pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}</h3>
    <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}">
    <div class="type">${mainType}</div>
  `;

  card.addEventListener('click', () => showDetails(pokemon));
  pokedex.appendChild(card);
}

function showDetails(pokemon) {
  modal.classList.remove('hidden');

  const stats = [
    { name: 'HP', value: pokemon.stats[0].base_stat },
    { name: 'Ataque', value: pokemon.stats[1].base_stat },
    { name: 'Defesa', value: pokemon.stats[2].base_stat },
    { name: 'Velocidade', value: pokemon.stats[5].base_stat }
  ];

  pokemonDetails.innerHTML = `
    <h2>${pokemon.name.toUpperCase()} #${pokemon.id}</h2>
    <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}" style="width:120px; height:120px;">
    <p><strong>Tipo:</strong> ${pokemon.types.map(t => t.type.name).join(', ')}</p>
    <div class="stats">
      ${stats.map(stat => `
        <div class="stat">
          <span>${stat.name}: ${stat.value}</span>
          <div class="progress-bar">
            <div class="progress" style="width: ${Math.min(stat.value, 100)}%"></div>
          </div>
        </div>
      `).join('')}
    </div>
  `;
}

closeModal.addEventListener('click', () => {
  modal.classList.add('hidden');
  pokemonDetails.innerHTML = '';
});

modal.addEventListener('click', (e) => {
  if (e.target === modal) {
    modal.classList.add('hidden');
    pokemonDetails.innerHTML = '';
  }
});

loadMoreBtn.addEventListener('click', () => {
  offset += limit; // aumenta o offset
  fetchPokemons(offset, limit);
});

fetchPokemons(offset, limit);
