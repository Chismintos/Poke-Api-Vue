<script setup>
import axios from 'axios'
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

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
    <div class="p-6">
        <button
            @click="back"
            class="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
            ← Volver
        </button>

        <div v-if="pokemon" class="max-w-lg mx-auto bg-white shadow rounded-lg p-6">
            <div class="flex justify-center">
                <img
                    :src="pokemon.sprites.front_default"
                    :alt="pokemon.name"
                    class="w-32 h-32"
                />
            </div>
            <h2 class="text-2xl font-bold capitalize text-center mt-4">
                {{ pokemon.name }}
            </h2>
            <div class="mt-4">
                <h3 class="font-semibold">Tipos</h3>
                <ul class="flex space-x-2 mt-1">
                    <li
                        v-for="t in pokemon.types"
                        :key="t.type.name"
                        class="px-2 py-1 bg-blue-200 rounded capitalize"
                    >
                        {{ t.type.name }}
                    </li>
                </ul>
            </div>
            <div class="mt-4">
                <h3 class="font-semibold">Stats</h3>
                <ul class="mt-1">
                    <li
                        v-for="s in pokemon.stats"
                        :key="s.stat.name"
                        class="capitalize"
                    >
                        {{ s.stat.name }}: {{ s.base_stat }}
                    </li>
                </ul>
            </div>
        </div>
        <div v-else class="text-center text-gray-500">Cargando...</div>
    </div>
</template>