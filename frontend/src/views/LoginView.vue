<script setup>
import { ref } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';
import '@/assets/css/login.css'; // Importamos el diseño profesional

const email = ref(''); // Usamos email para que coincida con el v-model del input
const password = ref('');
const mensaje = ref('');
const router = useRouter();

const handleLogin = async () => {
  try {
    const res = await axios.post('http://localhost:3000/api/auth/login', {
      correo: email.value,
      password: password.value
    });

    // Guardamos el token para la sesión
    localStorage.setItem('token', res.data.token);
    
    // Redirigimos al Dashboard
    router.push('/dashboard');
  } catch (error) {
    // Mostramos el error de forma más elegante
    mensaje.value = error.response?.data?.mensaje || "Credenciales incorrectas";
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