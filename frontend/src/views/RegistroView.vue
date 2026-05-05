<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
// Importamos nuestra instancia de API con interceptores y el store si fuera necesario
import api from '@/api/axios'; 
import '@/assets/css/login.css'; // Reutilizamos estilos de login

const email = ref('');
const password = ref('');
const mensaje = ref('');
const router = useRouter();

const handleRegister = async () => {
  try {
    const res = await api.post('/auth/registrar', {
      correo: email.value,
      password: password.value
    });

    // Si el registro es exitoso, mandamos al login
    alert("Usuario registrado con éxito");
    router.push('/login');
  } catch (error) {
    // Aquí capturamos los errores de validación (como los que configuramos en el middleware)
    mensaje.value = error.response?.data?.mensaje || "Error al registrar usuario";
  }
};
</script>

<template>
  <div class="login-container">
    <div class="login-card">
      <h1>Registro</h1>
      <p>Crea una cuenta para empezar a facturar</p>

      <form @submit.prevent="handleRegister">
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
          <label>Contraseña (mínimo 8 caracteres)</label>
          <input 
            type="password" 
            v-model="password" 
            placeholder="••••••••" 
            minlength="8"
            required 
          />
        </div>

        <button type="submit" class="btn-login">Registrarse</button>
      </form>

      <p v-if="mensaje" style="color: #ef4444; margin-top: 1rem; font-weight: 600;">
        {{ mensaje }}
      </p>

      <div class="register-link">
        ¿Ya tienes cuenta? 
        <router-link to="/login">Inicia sesión aquí</router-link>
      </div>
    </div>
  </div>
</template>