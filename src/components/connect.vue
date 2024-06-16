<template>
  <button
    v-if="metaMaskConnector"
    @click="connect({ connector: metaMaskConnector, chainId })"
    class="connect-button"
  >
    Connect MetaMask
  </button>
</template>

<script setup>
import { useConnect, useChainId } from '@wagmi/vue';
import { ref } from 'vue';

const chainId = useChainId();
const { connectors, connect } = useConnect();

const metaMaskConnector = ref(connectors.find(connector => connector.name === 'MetaMask'));
</script>

<style scoped>
.connect-button {
  margin-top: 20px;
  background-color: #ccc;
  color: white;
  border: none;
  padding: 10px 20px;
  font-size: 16px;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.connect-button:hover {
  background-color: #2f45be;
}
</style>
