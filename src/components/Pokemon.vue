<script setup>
import axios from 'axios'
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const pokemons = ref([])
const loading = ref(false)

const currentPage = ref(1)
const totalPages = ref(0)

const limit = 20
const GEN1_TOTAL = 151

// Calcular páginas visibles
const visiblePages = computed(() => {
  const pages = []
  const start = Math.max(currentPage.value - 2, 1)
  const end = Math.min(currentPage.value + 2, totalPages.value)

  for (let i = start; i <= end; i++) {
    pages.push(i)
  }

  return pages
})

// Extraer ID desde URL de pokeapi
const extractId = (url) => {
  const parts = url.split('/').filter(Boolean)
  return parts[parts.length - 1]
}

// Fetch página específica
const fetchPage = async (page) => {
  loading.value = true

  try {
    const offset = (page - 1) * limit

    const { data } = await axios.get(
      `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`
    )

    // Solo Gen 1
    pokemons.value = data.results
      .map(p => {
        const id = extractId(p.url)
        return {
          name: p.name,
          id,
          sprite: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`
        }
      })
      .filter(p => Number(p.id) <= GEN1_TOTAL)

    totalPages.value = Math.ceil(GEN1_TOTAL / limit)
    currentPage.value = page

  } catch (error) {
    console.error('failed to load pokemons', error)
  } finally {
    loading.value = false
  }
}

// Ir a página específica
const goToPage = (page) => {
  if (page < 1 || page > totalPages.value) return

  router.push({
    path: '/pokemon',
    query: { page }
  })

  fetchPage(page)
}

// Cargar página inicial desde URL
onMounted(() => {
  const initialPage = Number(route.query.page) || 1
  fetchPage(initialPage)
})
</script>


<template>
  <div class="min-h-screen bg-linear-to-br from-red-200 via-white to-red-100 py-12 px-4">

    <!-- CONTENEDOR PRINCIPAL -->
    <div class="max-w-7xl mx-auto bg-red-600 rounded-4xl shadow-[0_20px_60px_rgba(0,0,0,0.4)] p-8 relative border-8 border-red-700">

      <!-- LUCES SUPERIORES -->
      <div class="absolute top-5 left-6 flex gap-3">
        <div class="w-6 h-6 bg-blue-400 rounded-full border-4 border-white shadow-lg animate-pulse"></div>
        <div class="w-4 h-4 bg-yellow-300 rounded-full border-2 border-white"></div>
        <div class="w-4 h-4 bg-green-400 rounded-full border-2 border-white"></div>
      </div>

      <!-- PANTALLA -->
      <div class="bg-linear-to-b from-gray-100 to-gray-200 rounded-3xl p-10 mt-10 shadow-inner border-4 border-gray-300">

        <!-- TÍTULO -->
        <h1 class="text-5xl font-black text-center text-yellow-400 drop-shadow-[3px_3px_0px_#1e3a8a] tracking-widest mb-12">
          POKÉDEX
        </h1>

        <!-- LOADING -->
        <div v-if="loading" class="text-center py-20">
          <div class="inline-block w-16 h-16 border-8 border-red-500 border-t-white rounded-full animate-spin"></div>
          <p class="mt-6 text-gray-600 font-semibold tracking-wide">
            Cargando Pokémon...
          </p>
        </div>

        <!-- GRID -->
        <ul v-else class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-8">

          <li v-for="pokemon in pokemons" :key="pokemon.name">

            <router-link
              :to="`/pokemon/${pokemon.name}`"
              class="group relative block bg-white rounded-3xl 
                     shadow-lg hover:shadow-2xl
                     border-4 border-transparent hover:border-yellow-400
                     transition-all duration-300 p-5 overflow-hidden"
            >

              <!-- Glow efecto -->
              <div class="absolute inset-0 bg-lienar-to-br from-yellow-200 via-transparent to-red-200 opacity-0 group-hover:opacity-30 transition"></div>

              <!-- Imagen -->
              <div class="flex justify-center relative z-10">
                <img
                  :src="pokemon.sprite"
                  :alt="pokemon.name"
                  class="w-24 h-24 drop-shadow-lg
                         group-hover:scale-125 group-hover:-translate-y-2
                         transition-all duration-300"
                />
              </div>

              <!-- Info -->
              <div class="mt-4 text-center relative z-10">
                <p class="capitalize font-extrabold text-gray-800 tracking-wide">
                  {{ pokemon.name }}
                </p>
                <span class="text-sm font-semibold text-red-500">
                  #{{ pokemon.id }}
                </span>
              </div>

              <!-- Línea decorativa inferior -->
              <div class="mt-4 h-1 bg-linear-to-r from-red-500 via-yellow-400 to-red-500 rounded-full opacity-0 group-hover:opacity-100 transition"></div>

            </router-link>

          </li>
        </ul>

        <!-- PAGINACIÓN -->
        <div class="flex justify-center items-center gap-4 mt-16 flex-wrap">

  <!-- ANTERIOR -->
  <button
  @click="goToPage(currentPage - 1)"
  :disabled="currentPage === 1"
  :class="[
    'px-4 py-2 rounded-lg font-semibold transition',
    currentPage === 1
      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
      : 'bg-red-500 text-white hover:bg-red-600'
  ]"
>
  ← Anterior
</button>

  <!-- SI HAY PÁGINAS ANTES -->
  <span v-if="visiblePages[0] > 1" class="px-2 font-bold text-gray-500">
    ...
  </span>

  <!-- NÚMEROS -->
  <button
    v-for="page in visiblePages"
    :key="page"
    @click="goToPage(page)"
    :class="[
      'w-11 h-11 rounded-full font-extrabold transition-all duration-300',
      page === currentPage
        ? 'bg-yellow-400 text-black scale-110 shadow-lg ring-4 ring-yellow-300'
        : 'bg-white text-gray-700 hover:bg-yellow-200 hover:scale-105 shadow'
    ]"
  >
    {{ page }}
  </button>

  <!-- SI HAY PÁGINAS DESPUÉS -->
  <span v-if="visiblePages[visiblePages.length - 1] < totalPages" 
        class="px-2 font-bold text-gray-500">
    ...
  </span>

  <!-- SIGUIENTE -->
  <button
  @click="goToPage(currentPage + 1)"
  :disabled="currentPage === totalPages"
  :class="[
    'px-4 py-2 rounded-lg font-semibold transition',
    currentPage === totalPages
      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
      : 'bg-red-500 text-white hover:bg-red-600'
  ]"
>
  Siguiente →
</button>

</div>

      </div>
    </div>
  </div>
</template>