<template>
  <div class="login-container">
    <h2>Login or Register</h2>
    <input v-model="username" placeholder="Username" autocomplete="username" />
    <input v-model="password" type="password" placeholder="Password" autocomplete="current-password" />
    <div class="btn-row">
      <button @click="login">Login</button>
      <button @click="register">Register</button>
    </div>
    <div v-if="message" :class="{'success': isSuccess, 'error': !isSuccess}" class="info-msg">
      {{ message }}
    </div>
  </div>
</template>

<script>
export default {
  name: "Login",
  data() {
    return {
      username: "",
      password: "",
      message: "",
      isSuccess: false,
    };
  },
  methods: {
    register() {
      if (!this.username || !this.password) {
        this.setMsg("Please input both username and password.", false);
        return;
      }
      let users = JSON.parse(localStorage.getItem("users") || "{}");
      if (users[this.username]) {
        this.setMsg("Username already exists.", false);
        return;
      }
      users[this.username] = this.password;
      localStorage.setItem("users", JSON.stringify(users));
      this.setMsg("Registration successful. Please login.", true);
    },
    login() {
      let users = JSON.parse(localStorage.getItem("users") || "{}");
      if (users[this.username] === this.password) {
        localStorage.setItem("currentUser", this.username);
        this.setMsg("Login successful. Redirecting...", true);
        setTimeout(() => {
          this.$router.push("/chat");
        }, 500);
      } else {
        this.setMsg("Invalid username or password.", false);
      }
    },
    setMsg(msg, success) {
      this.message = msg;
      this.isSuccess = success;
    }
  }
};
</script>

<style scoped>
.login-container {
  max-width: 360px;
  margin: 120px auto;
  background: #fff;
  padding: 36px 28px 32px 28px;
  border-radius: 10px;
  box-shadow: 0 6px 32px rgba(0,0,0,0.08);
  display: flex;
  flex-direction: column;
  gap: 16px;
  align-items: stretch;
}
input {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 16px;
}
.btn-row {
  display: flex;
  gap: 18px;
  justify-content: center;
  margin-top: 12px;
}
button {
  padding: 10px 32px;
  border-radius: 6px;
  border: none;
  background: #f2f2f2;
  font-size: 16px;
  cursor: pointer;
  transition: background .2s;
}
button:hover {
  background: #e3e3e3;
}
.info-msg {
  margin-top: 12px;
  padding: 8px;
  border-radius: 6px;
  font-size: 15px;
  text-align: center;
}
.success {
  color: #157a32;
  background: #e6ffe7;
}
.error {
  color: #c40000;
  background: #fff0f0;
}
</style>