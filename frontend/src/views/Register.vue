<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const username = ref('');
const password = ref('');
const errorMessage = ref('');
const router = useRouter();

const register = async () => {
  errorMessage.value = '';

  try {
    const res = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: username.value, password: password.value })
    });

    const data = await res.json();

    if (data.success) {
      router.push('/login');
    } else {
      errorMessage.value = data.message || '注册失败';
    }
  } catch (err) {
    errorMessage.value = '网络错误，请稍后再试';
  }
};
</script>

<template>
  <div class="auth-container">
    <div class="auth-card">
      <h2>注册</h2>
      <input v-model="username" placeholder="用户名" />
      <input v-model="password" type="password" placeholder="密码" />
      <button @click="register">注册</button>
      <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
    </div>
  </div>
</template>

<style scoped>
.auth-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: #eef2f7;
}

.auth-card {
  background: white;
  padding: 30px 40px;
  border-radius: 10px;
  box-shadow: 0 0 12px rgba(0,0,0,0.1);
  width: 320px;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.auth-card h2 {
  margin: 0 0 10px;
  font-size: 22px;
  text-align: center;
}

input {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 14px;
}

button {
  padding: 10px;
  background: #67c23a;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  cursor: pointer;
  transition: 0.2s;
}

button:hover {
  background: #529b2e;
}

.error {
  color: red;
  font-size: 13px;
  text-align: center;
}
</style>
