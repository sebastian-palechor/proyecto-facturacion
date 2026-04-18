<script setup>
import { ref } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

const correo = ref('');
const password = ref('');
const mensaje = ref('');
const router = useRouter();

const handleLogin = async () => {
  try {
    const res = await axios.post('http://localhost:3000/api/auth/login', {
      correo: correo.value,
      password: password.value
    });

    // Guardamos el token para que el sistema sepa que estamos logueados
    localStorage.setItem('token', res.data.token);
    
    // Nos vamos al Dashboard
    router.push('/dashboard');
  } catch (error) {
    mensaje.value = "Error: " + (error.response?.data.mensaje || "Credenciales incorrectas");
  }
};
</script>

<template>
  <div>
    <h2>Iniciar Sesión</h2>
    <form @submit.prevent="handleLogin">
      <input v-model="correo" type="email" placeholder="Correo" required />
      <input v-model="password" type="password" placeholder="Contraseña" required />
      <button type="submit">Entrar</button>
    </form>
    <p v-if="mensaje">{{ mensaje }}</p>
  </div>
</template>