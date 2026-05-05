<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
// Importamos el store de Pinia y nuestra instancia de API con interceptores
import { useAuthStore } from '@/stores/auth'; 
import api from '@/api/axios'; 
import '@/assets/css/login.css';

const email = ref(''); 
const password = ref('');
const mensaje = ref('');
const router = useRouter();
const auth = useAuthStore(); // Instanciamos el store

const handleLogin = async () => {
  try {
    // Usamos el método login del store para manejar el estado global
    const result = await auth.login({
      correo: email.value,
      password: password.value
    });

    if (result.success) {
      router.push('/dashboard');
    } else {
      mensaje.value = result.error || "Credenciales incorrectas";
    }
  } catch (error) {
    mensaje.value = error.response?.data?.mensaje || "Error al conectar con el servidor";
  }
};
</script>

<template>
  <div class="login-container">
    <div class="login-card">
      <h1>Facturacion</h1>
      <p>Ingresa a tu cuenta para gestionar ventas</p>

      <form @submit.prevent="handleLogin">
        <div class="form-group">
          <label>Correo Electrónico</label>
          <input 
            type="email" 
            v-model="email" 
            placeholder="ejemplo@correo.com" 
            required 
          />
        </div>

        <div class="form-group">
          <label>Contraseña</label>
          <input 
            type="password" 
            v-model="password" 
            placeholder="••••••••" 
            required 
          />
        </div>

        <button type="submit" class="btn-login">Iniciar Sesión</button>
      </form>

      <p v-if="mensaje" style="color: #ef4444; margin-top: 1rem; font-weight: 600;">
        {{ mensaje }}
      </p>

      <div class="register-link">
        ¿No tienes una cuenta? 
        <router-link to="/registrar">Regístrate aquí</router-link>
      </div>
    </div>
  </div>
</template>