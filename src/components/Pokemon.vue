<script setup>
import axios from 'axios';
import { ref } from 'vue';
import { RouterLink} from 'vue-router';
const pokemons = ref([])
const nextUrl = ref(null)
const prevUrl = ref(null)
const loading = ref(false)

// helper to pull the numeric id out of the API url
const extractId = url => {
    const parts = url.split('/').filter(p => p);
    return parts[parts.length - 1];
}

const fetchPage = async(url = 'https://pokeapi.co/api/v2/pokemon/') => {
    loading.value = true
    try {
        const { data } = await axios.get(url)
        // save next/previous for pagination
        nextUrl.value = data.next
        prevUrl.value = data.previous
        pokemons.value = data.results.map(p => {
            const id = extractId(p.url)
            return {
                name: p.name,
                id,
                sprite: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`
            }
        })
    } catch (error) {
        console.error('failed to load pokemons', error)
    } finally {
        loading.value = false
    }
}

fetchPage()
</script>


<template>
  <div class="min-h-screen bg-linear-to-br from-red-100 via-white to-red-50 py-10 px-4">
    
    <!-- CONTENEDOR PRINCIPAL -->
    <div class="max-w-7xl mx-auto bg-red-500 rounded-3xl shadow-2xl p-8 relative">

      <!-- DECORACIÓN SUPERIOR -->
      <div class="absolute top-6 left-6 w-6 h-6 bg-blue-400 rounded-full border-4 border-white shadow"></div>
      <div class="absolute top-6 left-16 w-4 h-4 bg-yellow-300 rounded-full border-2 border-white"></div>
      <div class="absolute top-6 left-24 w-4 h-4 bg-green-400 rounded-full border-2 border-white"></div>

      <!-- PANTALLA INTERNA -->
      <div class="bg-gray-100 rounded-2xl p-8 mt-8">

        <h1 class="text-4xl font-extrabold text-center text-red-600 tracking-wider mb-10">
          Pokédex
        </h1>

        <!-- LOADING -->
        <div v-if="loading" class="text-center text-gray-500 py-16 text-lg">
          Cargando Pokémon...
        </div>

        <!-- GRID -->
        <ul v-else class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
          <li v-for="pokemon in pokemons" :key="pokemon.name">
            <router-link
              :to="`/pokemon/${pokemon.name}`"
              class="group block bg-white rounded-2xl border-2 border-red-200
                     hover:border-red-500 shadow-md hover:shadow-xl
                     transition duration-300 p-4"
            >
              <div class="flex justify-center">
                <img
                  :src="pokemon.sprite"
                  :alt="pokemon.name"
                  class="w-24 h-24 group-hover:scale-110 transition duration-300"
                />
              </div>

              <div class="mt-3 text-center">
                <p class="capitalize font-bold text-gray-800 truncate">
                  {{ pokemon.name }}
                </p>
                <span class="text-sm text-gray-500">
                  #{{ pokemon.id }}
                </span>
              </div>
            </router-link>
          </li>
        </ul>

        <!-- PAGINACIÓN -->
        <div class="flex justify-center gap-6 mt-12">

          <button
            @click="fetchPage(prevUrl)"
            :disabled="!prevUrl || loading"
            class="px-6 py-2 bg-black text-white rounded-full
                   hover:bg-gray-800 active:scale-95
                   disabled:opacity-40 transition"
          >
            ◀ Anterior
          </button>

          <button
            @click="fetchPage(nextUrl)"
            :disabled="!nextUrl || loading"
            class="px-6 py-2 bg-black text-white rounded-full
                   hover:bg-gray-800 active:scale-95
                   disabled:opacity-40 transition"
          >
            Siguiente ▶
          </button>

        </div>

      </div>
    </div>
  </div>
</template>