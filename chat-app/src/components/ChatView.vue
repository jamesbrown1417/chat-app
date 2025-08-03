<template>
  <div class="chat-app">
    <aside class="contacts">
      <h3>Contacts</h3>
      <ul>
        <li v-for="contact in contacts" :key="contact.id">
          <span :style="{color: contact.online ? 'green' : 'gray'}">
            ●
          </span>
          {{ contact.nickname }}
          <span v-if="!contact.online" title="User offline"> (offline) </span>
        </li>
      </ul>
    </aside>
    <main class="chat-main">
      <header>
        <button @click="openSettings">Settings</button>
        <button @click="logout">Logout</button>
      </header>
      <section class="messages">
        <div v-for="msg in messages" :key="msg.id" class="msg-row">
          <pre>{{ JSON.stringify(msg, null, 2) }}</pre>
          <span v-if="msg.error" class="error-mark">!</span>
        </div>
      </section>
      <div class="chat-controls">
        <input
          v-model="message"
          class="message-input"
          placeholder="Type your message..."
        />
        <button @click="sendMessage">Send</button>
      </div>
      <div class="file-controls">
        <input type="file" @change="sendFile" />
        <button @click="inviteUser">Invite User</button>
      </div>
    </main>
  </div>
</template>
<script>
export default {
  data() {
    return {
      message: '',
      messages: [],
      contacts: [
        { id: 1, nickname: 'Alice', online: true },
        { id: 2, nickname: 'Bob', online: false }
      ]
    }
  },
  methods: {
    sendMessage() {
      if (!this.message) return
      const isOnline = this.contacts[0].online // mock: always first user
      const msg = {
        id: Date.now(),
        type: 'text',
        user: JSON.parse(localStorage.getItem('user')).nickname,
        text: this.message,
        time: new Date().toISOString(),
        error: !isOnline // show error if offline
      }
      this.messages.push(msg)
      this.saveHistory()
      this.message = ''
    },
    sendFile(e) {
      // File sending logic (JSON meta info)
      const file = e.target.files[0]
      if (!file) return
      const msg = {
        id: Date.now(),
        type: 'file',
        user: JSON.parse(localStorage.getItem('user')).nickname,
        file: { name: file.name, size: file.size },
        time: new Date().toISOString()
      }
      this.messages.push(msg)
      this.saveHistory()
    },
    inviteUser() {
      navigator.clipboard.writeText('Invite link: https://yourapp/invite/xxx')
      alert('Invite link copied to clipboard!')
    },
    logout() {
      localStorage.removeItem('user')
      this.$router.push('/login')
    },
    openSettings() {
      this.$router.push('/settings')
    },
    saveHistory() {
      localStorage.setItem('messages', JSON.stringify(this.messages))
    }
  },
  created() {
    // Load history
    this.messages = JSON.parse(localStorage.getItem('messages')) || []
  }
}
</script>
<style scoped>
.chat-app { display: flex; height: 100vh; }
.contacts { width: 260px; background: #f3f3f3; padding: 16px; }
.chat-main { flex: 1; display: flex; flex-direction: column; }
header { display: flex; justify-content: flex-end; gap: 10px; padding: 8px 0; }
.messages { flex: 1; overflow-y: auto; padding: 16px; }
.msg-row { margin-bottom: 8px; display: flex; align-items: center; }
.error-mark { color: red; font-weight: bold; margin-left: 8px; }
.chat-controls { display: flex; gap: 10px; margin: 10px 0; }
.message-input { flex: 1; padding: 10px; }
.file-controls { display: flex; gap: 10px; margin: 10px 0; }
</style>