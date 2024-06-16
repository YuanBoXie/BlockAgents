<template>
  <div class="w-container">
    <div class="issue">Address: {{ address }}</div>
    <button class="disconnect-button" @click="disconnect()">Disconnect</button>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useAccount, useDisconnect } from '@wagmi/vue';

const { address } = useAccount();
const { disconnect } = useDisconnect();

</script>

<style scoped>
.w-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 90%;
  margin: auto;
  height: 60px;
  padding: 0 16px;
  margin-bottom: 10px;
  border-radius: 10px;
  background: #aaccf6;
  color: #FFF;
  font-weight: 600;
  width: 700px;
}

.issue {
  display: flex;
  align-items: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.disconnect-button {
  background-color: #f44336;
  color: white;
  border: none;
  padding: 10px 20px;
  font-size: 16px;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.disconnect-button:hover {
  background-color: #d32f2f;
}
</style>
