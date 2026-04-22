<template>
  <div class="login-container"> <div class="login-card">     <h1>Crear Cuenta</h1>
      <p>Regístrate para empezar a facturar</p>

      <form @submit.prevent="handleRegistro">
        <div class="form-group">
          <label>Correo Electrónico</label>
          <input 
            v-model="correo" 
            type="email" 
            placeholder="ejemplo@correo.com" 
            required 
          />
        </div>

        <div class="form-group">
          <label>Contraseña</label>
          <input 
            v-model="password" 
            type="password" 
            placeholder="Crea una contraseña segura" 
            required 
          />
        </div>

        <button type="submit" class="btn-login">Crear Cuenta</button>
      </form>

      <p v-if="mensaje" :class="mensaje.includes('éxito') ? 'msg-success' : 'msg-error'">
        {{ mensaje }}
      </p>

      <div class="register-link">
        ¿Ya tienes una cuenta? 
        <router-link to="/login">Inicia sesión aquí</router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';
import '@/assets/css/login.css'; // Importante para que use el nuevo diseño

const correo = ref('');
const password = ref('');
const mensaje = ref('');

const handleRegistro = async () => {
  try {
    const res = await axios.post('http://localhost:3000/api/auth/registrar', {
      correo: correo.value,
      password: password.value
    });
    mensaje.value = "¡Registro exitoso! Ya puedes iniciar sesión.";
  } catch (error) {
    mensaje.value = error.response 
      ? "Error: " + error.response.data.mensaje 
      : "Error: No se pudo conectar con el servidor.";
  }
};
</script>

<style scoped>
/* Unos toques extra para los mensajes de error/éxito */
.msg-success { color: #10b981; margin-top: 1rem; font-weight: 600; }
.msg-error { color: #ef4444; margin-top: 1rem; font-weight: 600; }
</style>

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