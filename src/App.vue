<template>
  <div class="min-h-screen flex flex-col">

    <!-- NAVBAR -->
    <nav class="bg-white shadow-md">
      <div class="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">

        <!-- Logo / Título -->
        <RouterLink 
          to="/" 
          class="text-2xl font-bold text-red-600 tracking-wide"
        >
          Pokédex
        </RouterLink>

        <!-- Links -->
        <div class="flex gap-8 font-medium text-gray-600">

          <RouterLink 
            to="/" 
            class="hover:text-red-500 transition"
            active-class="text-red-600 font-semibold"
          >
            Home
          </RouterLink>

          <RouterLink 
            to="/about" 
            class="hover:text-red-500 transition"
            active-class="text-red-600 font-semibold"
          >
            About
          </RouterLink>

          <RouterLink 
            to="/pokemon" 
            class="hover:text-red-500 transition"
            active-class="text-red-600 font-semibold"
          >
            Pokémon
          </RouterLink>

          <RouterLink 
            to="/login" 
            class="hover:text-red-500 transition"
            active-class="text-red-600 font-semibold"
          >
            Login
          </RouterLink>

        </div>
      </div>
    </nav>

    <!-- CONTENIDO -->
    <main class="flex-1">
      <RouterView />
    </main>

  </div>
</template>