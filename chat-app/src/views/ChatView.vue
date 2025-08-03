<template>
  <div class="chat-container">
    <!-- Logout at top-right -->
    <button class="logout-btn" @click="logout">Logout</button>
    <!-- Left: Contact List -->
    <div class="contact-list">
      <div
        v-for="contact in contacts"
        :key="contact.id"
        :class="['contact', { active: contact.id === selectedContact?.id }]"
        @click="selectContact(contact)"
      >
        <span>{{ contact.name }}</span>
        <span class="status" :class="contact.online ? 'online' : 'offline'"></span>
      </div>
    </div>

    <!-- Right: Chat Panel -->
    <div class="chat-panel" v-if="selectedContact">
      <div class="chat-header">
        <h3>{{ selectedContact.name }}</h3>
      </div>
      <div class="chat-messages">
        <div
          v-for="(msg, index) in messages"
          :key="index"
          :class="['chat-message', msg.failed ? 'failed' : '', {self: msg.from === currentUser}]"
        >
          <span class="msg-meta">
            [{{ msg.timestamp }}] [{{ msg.from }}]
          </span>
          <span class="msg-text">{{ msg.text }}</span>
          <span v-if="msg.failed" class="error">❗️</span>
        </div>
      </div>
      <div class="chat-input">
        <input
          v-model="newMessage"
          @keydown.enter="sendMessage"
          placeholder="Type a message..."
        />
        <button @click="sendMessage">Send</button>
        <button @click="sendGroupMessage">Send to All</button>
      </div>
      <div class="file-upload">
        <input type="file" ref="fileInput" @change="sendFile" />
        <button @click="inviteUser">Invite User</button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

function sanitizeInput(text) {
  return text.replace(/[<>&"'\/]/g, function (c) {
    return ({
      '<': '&lt;',
      '>': '&gt;',
      '&': '&amp;',
      '"': '&quot;',
      "'": '&#39;',
      '/': '&#x2F;'
    })[c];
  });
}

export default {
  name: "ChatView",
  data() {
    return {
      contacts: [
        { id: 1, name: "Alice", online: true },
        { id: 2, name: "Bob", online: false },
      ],
      selectedContact: null,
      newMessage: "",
      messages: [],
      currentUser: localStorage.getItem('currentUser') || "You",
    };
  },
  methods: {
    selectContact(contact) {
      this.selectedContact = contact;
      this.loadMessages(contact.id);
    },
    loadMessages(contactId) {
      // TODO: Load messages from backend/database by contactId
      this.messages = [];
    },
    sendMessage() {
      if (!this.newMessage.trim() || !this.selectedContact) return;
      const now = new Date();
      const safeText = sanitizeInput(this.newMessage.trim());
      const msg = {
        text: safeText,
        from: this.currentUser,
        failed: !this.selectedContact.online,
        timestamp: now.toLocaleString(),
      };
      this.messages.push(msg);
      this.newMessage = "";
      if (!msg.failed) {
        // POST /api/send for one-to-one message
        axios.post('/api/send', {
          to: this.selectedContact.name,
          from: this.currentUser,
          text: safeText,
          timestamp: msg.timestamp
        }).catch(() => {});
      }
    },
    sendGroupMessage() {
      if (!this.newMessage.trim()) return;
      const now = new Date();
      const safeText = sanitizeInput(this.newMessage.trim());
      this.contacts.forEach(contact => {
        if (contact.online) {
          if (this.selectedContact && this.selectedContact.id === contact.id) {
            this.messages.push({
              text: safeText,
              from: this.currentUser,
              failed: false,
              timestamp: now.toLocaleString(),
            });
          }
          // POST /api/sendGroup for group message
          axios.post("/api/sendGroup", {
            to: contact.name,
            from: this.currentUser,
            text: safeText,
            timestamp: now.toLocaleString(),
          }).catch(() => {});
        }
      });
      this.newMessage = "";
    },
    sendFile(e) {
      const file = e.target.files[0];
      if (!file || !this.selectedContact) return;
      const now = new Date();
      const msg = {
        text: `[File] ${file.name}`,
        from: this.currentUser,
        failed: !this.selectedContact.online,
        timestamp: now.toLocaleString(),
      };
      this.messages.push(msg);
      if (!msg.failed) {
        // POST /api/sendFile for file sending
        const formData = new FormData();
        formData.append('file', file);
        formData.append('to', this.selectedContact.name);
        formData.append('from', this.currentUser);
        axios.post('/api/sendFile', formData).catch(() => {});
      }
    },
    inviteUser() {
      // POST /api/inviteUser (not implemented)
      alert("Invite user feature coming soon!");
    },
    logout() {
      localStorage.removeItem('currentUser');
      alert("You have logged out.");
      this.$router.replace('/login');
    }
  },
};
</script>

<style scoped>
.chat-container {
  display: flex;
  height: 100vh;
  font-family: sans-serif;
  position: relative;
}
.logout-btn {
  position: absolute;
  top: 16px;
  right: 32px;
  z-index: 10;
  padding: 7px 24px;
  border-radius: 7px;
  border: none;
  background: #f2f2f2;
  font-weight: bold;
  cursor: pointer;
}
.logout-btn:hover {
  background: #e0e0e0;
}
.contact-list {
  width: 250px;
  background-color: #f2f2f2;
  padding: 10px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
}
.contact {
  padding: 10px;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.contact.active {
  background-color: #e6e6e6;
  font-weight: bold;
}
.status {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  display: inline-block;
}
.status.online {
  background-color: green;
}
.status.offline {
  border: 2px solid gray;
  background-color: white;
}
.chat-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
}
.chat-header {
  padding: 10px;
  border-bottom: 1px solid #ccc;
}
.chat-messages {
  flex: 1;
  padding: 10px;
  overflow-y: auto;
  background: #fff;
}
.chat-message {
  margin-bottom: 10px;
  background: #f1f1f1;
  padding: 8px;
  border-radius: 5px;
  display: flex;
  flex-direction: column;
}
.chat-message.self {
  background: #e6f7ff;
  align-items: flex-end;
}
.chat-message.failed {
  background-color: #ffe5e5;
  border: 1px solid red;
}
.msg-meta {
  color: #888;
  font-size: 12px;
  margin-bottom: 2px;
}
.msg-text {
  font-size: 15px;
}
.error {
  color: red;
  margin-left: 5px;
  font-weight: bold;
}
.chat-input {
  display: flex;
  gap: 10px;
  padding: 10px;
  border-top: 1px solid #ccc;
}
.chat-input input[type="text"], .chat-input input {
  flex: 1;
  padding: 6px;
  font-size: 15px;
}
.chat-input button {
  padding: 6px 18px;
  border-radius: 5px;
  background: #f8f8f8;
  border: 1px solid #ccc;
  cursor: pointer;
}
.chat-input button:hover {
  background: #e6e6e6;
}
.file-upload {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px;
}
.file-upload input[type="file"] {
  width: 220px;
}
.file-upload button {
  padding: 6px 12px;
  border-radius: 5px;
  background: #f8f8f8;
  border: 1px solid #ccc;
  cursor: pointer;
}
</style>