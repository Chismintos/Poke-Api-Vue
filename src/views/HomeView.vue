<template setup>
    <div class="min-h-screen flex items-center justify-center bg-linear-to-b from-blue-50 via-white to-yellow-50 p-6">
        <div class="w-full max-w-2xl text-center bg-white/80 backdrop-blur-md rounded-2xl shadow-lg p-10">
            <h1 class="text-4xl font-extrabold text-gray-800 mb-6">Bienvenido a Poké Lección</h1>
            <p class="text-gray-600 mb-8">Explora la Pokédex o comienza la lección interactiva.</p>

            <div class="flex flex-col sm:flex-row gap-4 justify-center">
                <router-link to="/pokemon" class="inline-block px-6 py-3 bg-red-500 text-white rounded-lg font-semibold shadow hover:bg-red-600 transition">Ver Pokédex</router-link>
                <router-link to="/about" class="inline-block px-6 py-3 bg-yellow-400 text-gray-800 rounded-lg font-semibold shadow hover:bg-yellow-500 transition">Comenzar Lección</router-link>
            </div>
        </div>
    </div>
</template>