<script setup>
import axios from 'axios'
import { ref, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';

// map common types to simple Tailwind color classes
const typeColor = (type) => {
    switch (type) {
        case 'fire':
            return 'bg-red-200 text-red-800';
        case 'water':
            return 'bg-blue-200 text-blue-800';
        case 'grass':
            return 'bg-green-200 text-green-800';
        case 'electric':
            return 'bg-yellow-200 text-yellow-800';
        case 'psychic':
            return 'bg-pink-200 text-pink-800';
        case 'rock':
            return 'bg-stone-200 text-stone-800';
        case 'ice':
            return 'bg-cyan-100 text-cyan-800';
        default:
            return 'bg-gray-200 text-gray-800';
    }
}

const pokemon = ref(null);

const route = useRoute()
const router = useRouter()

const back = () => {
    router.push('/pokemon')
}

const getData = async () => {
    try {
        const { data } = await axios.get(
            `https://pokeapi.co/api/v2/pokemon/${route.params.name}`
        );
        pokemon.value = data;
    } catch (error) {
        console.error('error fetching pokemon details', error);
    }
};

const currentSpriteIndex = ref(0)

const spriteList = computed(() => {
    if (!pokemon.value) return []

    const sprites = pokemon.value.sprites

    const variants = [
        { name: 'Official Artwork', url: sprites.other?.['official-artwork']?.front_default },
        { name: 'Normal', url: sprites.front_default },
        { name: 'Back', url: sprites.back_default },
        { name: 'Shiny', url: sprites.front_shiny },
        { name: 'Back Shiny', url: sprites.back_shiny },
        { name: 'Dream World', url: sprites.other?.dream_world?.front_default }
        
    ]

    // filtrar los que sí existen
    return variants.filter(v => v.url)
})

const nextSprite = () => {
    if (!spriteList.value.length) return
    currentSpriteIndex.value =
        (currentSpriteIndex.value + 1) % spriteList.value.length
}

const prevSprite = () => {
    if (!spriteList.value.length) return
    currentSpriteIndex.value =
        (currentSpriteIndex.value - 1 + spriteList.value.length) % spriteList.value.length
}

const isShiny = computed(() => {
  const current = spriteList.value[currentSpriteIndex.value]
  return current?.name.toLowerCase().includes('shiny')
})

getData();
</script>

<template>
  <div class="min-h-screen bg-linear-to-br from-red-200 via-white to-red-100 py-12 px-6">

    <div class="max-w-4xl mx-auto">

      <!-- BOTÓN VOLVER -->
      <button
        @click="back"
        class="mb-8 px-6 py-2 rounded-lg font-semibold
                bg-red-500 text-white
                shadow-md
                transition-all duration-200
                hover:bg-red-600 hover:shadow-xl hover:scale-105
                active:scale-95
                flex items-center gap-2"
        >
        ← Volver
        </button>

      <!-- CONTENEDOR POKÉDEX -->
      <div v-if="pokemon"
           class="bg-red-600 rounded-4xl p-8 shadow-[0_20px_60px_rgba(0,0,0,0.4)] border-8 border-red-700">

        <!-- PANTALLA INTERNA -->
        <div class="bg-linear-to-b from-gray-100 to-gray-200 rounded-3xl p-8 shadow-inner border-4 border-gray-300">

          <!-- 🔥 HEADER POKÉMON -->
          <div class="text-center mb-12">
            <h1 class="text-5xl font-extrabold capitalize tracking-wider
                       text-gray-800 drop-shadow-md">
              {{ pokemon.name }}
            </h1>

            <p class="text-lg text-gray-500 mt-2 font-semibold tracking-wide">
              Nº {{ pokemon.id.toString().padStart(3, '0') }}
            </p>
          </div>

          <div class="grid md:grid-cols-2 gap-10">

            <!-- IMAGEN -->
            <div class="flex flex-col items-center justify-center relative">

              <!-- Glow dinámico -->
              <div
                :class="[
                  'absolute w-72 h-72 rounded-full blur-3xl transition-all duration-500',
                  isShiny
                    ? 'bg-yellow-400 opacity-40'
                    : 'bg-yellow-300 opacity-25'
                ]"
              ></div>

              <!-- Flecha izquierda -->
             <button
                @click="prevSprite"
                class="absolute left-0 top-1/2 -translate-y-1/2
                        w-10 h-10
                        rounded-full
                        bg-white
                        border border-gray-300
                        text-gray-700
                        flex items-center justify-center
                        shadow-sm
                        transition
                        hover:bg-gray-100 hover:shadow-md hover:scale-105
                        active:scale-95
                        z-20"
                >
                ‹
                </button>

              <!-- Sprite -->
              <transition
                mode="out-in"
                enter-active-class="transition duration-300 ease-out"
                enter-from-class="opacity-0 translate-y-4"
                enter-to-class="opacity-100 translate-y-0"
                leave-active-class="transition duration-200 ease-in"
                leave-from-class="opacity-100 translate-y-0"
                leave-to-class="opacity-0 -translate-y-4"
              >
                <img
                  :key="spriteList[currentSpriteIndex]?.url"
                  :src="spriteList[currentSpriteIndex]?.url"
                  :alt="pokemon.name"
                  :class="[
                    'relative z-10 drop-shadow-2xl transition-all duration-300 object-contain',
                    spriteList[currentSpriteIndex]?.name.includes('Official')
                      ? 'max-w-100 w-full h-auto'
                      : 'w-80 h-80'
                  ]"
                  :style="spriteList[currentSpriteIndex]?.name.includes('Official')
                      ? ''
                      : 'image-rendering: pixelated;'"
                />
              </transition>

              <!-- Flecha derecha -->
              <button
                @click="nextSprite"
                class="absolute right-0 top-1/2 -translate-y-1/2
                        w-10 h-10
                        rounded-full
                        bg-white
                        border border-gray-300
                        text-gray-700
                        flex items-center justify-center
                        shadow-sm
                        transition
                        hover:bg-gray-100 hover:shadow-md hover:scale-105
                        active:scale-95
                        z-20"
                >
                ›
                </button>

              <!-- Nombre variante -->
              <p class="mt-4 text-sm font-semibold text-gray-700 tracking-wide">
                {{ spriteList[currentSpriteIndex]?.name }}
              </p>

              <!-- Indicador -->
              <p class="text-xs text-gray-500 mt-1">
                {{ currentSpriteIndex + 1 }} / {{ spriteList.length }}
              </p>

            </div>

            <!-- INFO DERECHA -->
            <div>

              <!-- STATS -->
              <div>
                <h3 class="text-lg font-bold text-gray-700 mb-4 tracking-wide">
                  Estadísticas Base
                </h3>

                <div class="space-y-4">
                  <div v-for="s in pokemon.stats" :key="s.stat.name">

                    <div class="flex justify-between text-sm font-semibold mb-1">
                      <span class="capitalize">{{ s.stat.name }}</span>
                      <span>{{ s.base_stat }}</span>
                    </div>

                    <div class="w-full bg-gray-300 rounded-full h-3 overflow-hidden">
                      <div
                        class="h-3 rounded-full bg-linear-to-r from-yellow-400 to-red-500 transition-all duration-700"
                        :style="{ width: Math.min(s.base_stat, 100) + '%' }"
                      ></div>
                    </div>

                  </div>
                </div>
              </div>

              <!-- HABILIDADES -->
              <div class="mt-8">
                <h3 class="text-lg font-bold text-gray-700 mb-3 tracking-wide">
                  Habilidades
                </h3>

                <div class="flex flex-wrap gap-3">
                  <span
                    v-for="a in pokemon.abilities"
                    :key="a.ability.name"
                    class="px-4 py-2 bg-white border-2 border-yellow-400 rounded-xl shadow
                           text-sm font-semibold capitalize
                           hover:scale-105 transition"
                  >
                    {{ a.ability.name }}
                  </span>
                </div>
              </div>

              <!-- ALTURA Y PESO -->
              <div class="mt-8 flex gap-8">
                <div class="bg-white p-4 rounded-xl shadow text-center flex-1">
                  <p class="text-xs text-gray-500 uppercase tracking-wider">Altura</p>
                  <p class="text-lg font-bold">{{ pokemon.height }}</p>
                </div>
                <div class="bg-white p-4 rounded-xl shadow text-center flex-1">
                  <p class="text-xs text-gray-500 uppercase tracking-wider">Peso</p>
                  <p class="text-lg font-bold">{{ pokemon.weight }}</p>
                </div>
              </div>

            </div>

          </div>

        </div>
      </div>

      <!-- LOADING -->
      <div v-else class="text-center py-20">
        <div class="inline-block w-16 h-16 border-8 border-red-500 border-t-white rounded-full animate-spin"></div>
        <p class="mt-6 text-gray-600 font-semibold">Cargando datos...</p>
      </div>

    </div>
  </div>
</template>