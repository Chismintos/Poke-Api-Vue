<template>
    <div class="login">
        <form @submit.prevent="submit" class="login-form">
            <h2>Login rápido</h2>

            <label class="field">
                <span>Email</span>
                <input v-model="email" type="email" placeholder="usuario@ejemplo.com" required />
            </label>

            <label class="field">
                <span>Contraseña</span>
                <input v-model="password" type="password" placeholder="••••••" required />
            </label>

            <div class="actions">
                <button type="submit" :disabled="loading">{{ loading ? 'Entrando…' : 'Entrar' }}</button>
            </div>

            <p v-if="error" class="error">{{ error }}</p>
            <p class="note">(Demo: cualquier credencial válida funciona; usar email que contenga "fail" para simular error)</p>
        </form>
    </div>
</template>

<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

export default {
    name: 'Login',
    setup() {
        const email = ref('')
        const password = ref('')
        const error = ref('')
        const loading = ref(false)
        const router = useRouter()

        const submit = async () => {
            error.value = ''
            if (!email.value || !password.value) {
                error.value = 'Completa los campos.'
                return
            }

            loading.value = true
            // Simular llamada a API
            await new Promise((r) => setTimeout(r, 600))

            // Lógica demo: si el email contiene "fail" forzamos error
            if (email.value.includes('fail')) {
                error.value = 'Credenciales inválidas.'
                loading.value = false
                return
            }

            // Guardar token demo y redirigir
            const token = btoa(`${email.value}:${password.value}`)
            localStorage.setItem('auth_token', token)
            loading.value = false
            router.push({ name: 'home' })
        }

        return { email, password, error, loading, submit }
    },
}
</script>

<style scoped>
.login { max-width: 380px; margin: 48px auto; padding: 20px; }
.login-form { display: flex; flex-direction: column; gap: 12px; border: 1px solid #e6e6e6; padding: 18px; border-radius: 8px; background: #fff; }
.login-form h2 { margin: 0 0 6px 0; font-size: 1.25rem; }
.field { display: flex; flex-direction: column; font-size: 0.9rem; }
.field span { margin-bottom: 6px; color: #333; }
.field input { padding: 8px 10px; border: 1px solid #ccc; border-radius: 6px; }
.actions { display:flex; justify-content:flex-end; }
button { background:#2b8aef; color:#fff; border:none; padding:8px 14px; border-radius:6px; cursor:pointer; }
button[disabled] { opacity:0.7; cursor:not-allowed; }
.error { color: #b00020; font-size: 0.9rem; margin-top:6px }
.note { font-size:0.8rem; color:#666; margin-top:6px }
</style>