<template>
  <div class="settings-container">
    <h2>Settings</h2>
    <input v-model="nickname" placeholder="New nickname" />
    <button @click="save">Save</button>
  </div>
</template>

<script>
export default {
  data() {
    return { nickname: '' }
  },
  created() {
    const user = JSON.parse(localStorage.getItem('user'))
    this.nickname = user?.nickname || ''
  },
  methods: {
    save() {
      const user = JSON.parse(localStorage.getItem('user'))
      user.nickname = this.nickname
      localStorage.setItem('user', JSON.stringify(user))
      this.$router.push('/chat')
    }
  }
}
</script>

<style scoped>
.settings-container {
  max-width: 320px;
  margin: 100px auto;
  display: flex;
  flex-direction: column;
  gap: 12px;
}
input {
  padding: 10px;
}
button {
  padding: 10px;
  background: #42b883;
  color: white;
  border: none;
  cursor: pointer;
}
</style>