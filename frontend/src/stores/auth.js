import { defineStore } from 'pinia';
import axios from 'axios';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    usuario: null,
    token: localStorage.getItem('token') || null,
  }),
  actions: {
    async login(credenciales) {
      try {
        const res = await axios.post('http://localhost:3000/api/auth/login', credenciales);
        this.token = res.data.token;
        this.usuario = res.data.usuario;
        localStorage.setItem('token', this.token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${this.token}`;
        return { success: true };
      } catch (error) {
        return { success: false, error: error.response.data.mensaje };
      }
    },
    logout() {
      this.token = null;
      this.usuario = null;
      localStorage.removeItem('token');
      delete axios.defaults.headers.common['Authorization'];
    }
  }
});