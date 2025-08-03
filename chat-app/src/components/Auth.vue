<template>
  <div class="auth">
    <input v-model="nickname" placeholder="Enter nickname" />
    <input v-model="password" placeholder="Password" type="password" />
    <button @click="login">Login</button>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const nickname = ref('')
const password = ref('')
const router = useRouter()

const login = () => {
  if (nickname.value && password.value) {
    localStorage.setItem('nickname', nickname.value)
    router.push('/chat')
  }
}
</script>

<style scoped>
.auth {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 150px;
  gap: 10px;
}
input {
  padding: 8px;
  width: 200px;
}
button {
  padding: 8px;
  width: 200px;
  background-color: #42b883;
  color: white;
  border: none;
  cursor: pointer;
}
</style>