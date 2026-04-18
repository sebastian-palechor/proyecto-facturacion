<template>
  <div class="auth-container">
    <h2>Registrar Usuario</h2>
    <form @submit.prevent="handleRegistro">
      <input v-model="correo" type="email" placeholder="Correo electrónico" required />
      <input v-model="password" type="password" placeholder="Contraseña" required />
      <button type="submit">Crear Cuenta</button>
    </form>
    <p v-if="mensaje">{{ mensaje }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';

const correo = ref('');
const password = ref('');
const mensaje = ref('');

// Busca la función handleRegistro y cámbiala por esta:
const handleRegistro = async () => {
  try {
    const res = await axios.post('http://localhost:3000/api/auth/registrar', {
      correo: correo.value,
      password: password.value
    });
    mensaje.value = "¡Registro exitoso! Ya puedes iniciar sesión.";
  } catch (error) {
    // Esta es la parte importante para evitar el error de la consola
    mensaje.value = error.response 
      ? "Error: " + error.response.data.mensaje 
      : "Error: No se pudo conectar con el servidor. ¿Está encendido el backend?";
  }
};
</script>