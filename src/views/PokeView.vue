<script setup>
import axios from 'axios'
import { ref } from 'vue';
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

getData();
</script>

<template>
    <div class="min-h-screen p-6 bg-linear-to-br from-indigo-50 via-white to-yellow-50">
        <div class="max-w-2xl mx-auto">
            <button
                @click="back"
                class="mb-6 px-4 py-2 bg-red-500 text-white rounded-lg shadow hover:bg-red-600 transition"
            >
                ← Volver
            </button>

            <div v-if="pokemon" class="bg-white rounded-2xl shadow-lg p-6">
                <div class="flex items-center gap-6">
                    <div class="shrink-0">
                        <img :src="pokemon.sprites.front_default" :alt="pokemon.name" class="w-36 h-36" />
                    </div>
                    <div class="flex-1">
                        <h2 class="text-3xl font-extrabold capitalize">{{ pokemon.name }}</h2>
                        <p class="text-sm text-gray-500 mt-1">#{{ pokemon.id || pokemon.id }}</p>

                        <div class="mt-4">
                            <h3 class="font-semibold text-gray-700">Tipos</h3>
                            <div class="flex flex-wrap gap-2 mt-2">
                                <span
                                    v-for="t in pokemon.types"
                                    :key="t.type.name"
                                    :class="`px-3 py-1 rounded-full text-sm font-medium capitalize ${typeColor(t.type.name)}`"
                                >
                                    {{ t.type.name }}
                                </span>
                            </div>
                        </div>

                        <div class="mt-4">
                            <h3 class="font-semibold text-gray-700">Stats</h3>
                            <ul class="mt-2 space-y-1">
                                <li v-for="s in pokemon.stats" :key="s.stat.name" class="flex justify-between text-sm">
                                    <span class="capitalize">{{ s.stat.name }}</span>
                                    <span class="font-semibold">{{ s.base_stat }}</span>
                                </li>
                            </ul>
                        </div>

                        <div class="mt-4 flex gap-4">
                            <div>
                                <h4 class="text-xs text-gray-500">Altura</h4>
                                <div class="font-medium">{{ pokemon.height }}</div>
                            </div>
                            <div>
                                <h4 class="text-xs text-gray-500">Peso</h4>
                                <div class="font-medium">{{ pokemon.weight }}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div v-else class="text-center text-gray-500 mt-8">Cargando...</div>
        </div>
    </div>
</template>