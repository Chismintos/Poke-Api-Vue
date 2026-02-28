<script setup>
import axios from 'axios';
import { ref } from 'vue';
import { RouterLink} from 'vue-router';
const pokemons = ref([])

// helper to pull the numeric id out of the API url
const extractId = url => {
    const parts = url.split('/').filter(p => p);
    return parts[parts.length - 1];
}

const getData = async() => {
    try {
        const { data } = await axios.get('https://pokeapi.co/api/v2/pokemon/');
        // map results to include an id and a sprite url so we can render images
        pokemons.value = data.results.map(p => {
            const id = extractId(p.url);
            return {
                name: p.name,
                id,
                sprite: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`
            };
        });
    } catch (error) {
        console.error('failed to load pokemons', error);
    }
}

getData()
</script>


<template>
    <div class="p-6">
        <h1 class="text-3xl font-bold mb-6">Pokédex</h1>

        <ul class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            <li v-for="pokemon in pokemons" :key="pokemon.name">
                <router-link
                    :to="`/pokemon/${pokemon.name}`"
                    class="block p-4 bg-white rounded-lg shadow hover:shadow-lg transition-colors duration-150"
                >
                    <img
                        :src="pokemon.sprite"
                        :alt="pokemon.name"
                        class="w-24 h-24 mx-auto"
                    />
                    <p class="mt-2 text-center capitalize text-gray-700">
                        {{ pokemon.name }}
                    </p>
                </router-link>
            </li>
        </ul>
    </div>
</template>