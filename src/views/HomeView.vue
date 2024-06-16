<template>
  <div class="chat-container">
    <div class="chat-header">
      <div class="premium">
        <ATag v-if="isPremium" color="gold">Premium</ATag>
        <div v-else>
          <AButton type="primary" @click="triggerSubscription"
            >Premium Subscriptions</AButton
          >
          <AButton @click="checkSubscription" style="margin-left: 20px">
            <ReloadOutlined /> Refresh
          </AButton>
        </div>
      </div>
      <div class="wallet-connector">
        <Account v-if="isConnected" />
        <Connect v-else />
      </div>
    </div>
    <div class="prompt">
      <h3
        style="
          color: #fff;
          font-weight: 600;
          margin-left: 7%;
          line-height: 50px;
        "
      >
        常见问题
      </h3>
      <div
        v-for="(item, index) in commonIssues"
        :key="index"
        class="issue"
        @click="quickQuestion(item)"
      >
        {{ item }}
      </div>
      <Popconfirm
        title="确定清空对话记录吗?"
        ok-text="确定"
        cancel-text="取消"
        @confirm="clear"
        @cancel="cancel"
      >
        <div class="clear">
          <ClearOutlined /><span style="margin-left: 10px">清空记录</span>
        </div>
      </Popconfirm>
    </div>
    <div class="chat-box">
      <div class="chat-list" ref="chatListRef">
        <div
          v-for="(item, index) in chatList"
          :key="index"
          :class="['message', item.sender]"
        >
          <img class="avatar" :src="item.avatar" alt="" />

          <div v-if="item.loading" class="message-text">
            <div class="blink"></div>
          </div>
          <div v-else class="message-block">
            <div style="margin-bottom: 5px">
              <span style="color: #bbb; margin-right: 10px">{{
                item.time
              }}</span>
              <CopyOutlined @click="copyToClipboard(item.message)" />
            </div>
            <div class="message-text">
              {{ item.message }}
            </div>
          </div>
        </div>
      </div>

      <div class="user-input-container">
        <input
          v-model="userInput"
          class="user-input"
          placeholder="Send a message..."
        />
        <div
          @click="sendMessage()"
          @keyup.enter="sendMessage()"
          class="send-button"
          v-if="userInput !== ''"
        >
          <img
            src="../assets/send.png"
            style="width: 20px; margin-right: 10px"
            alt=""
          />Send
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive } from "vue";
import { message as antMessage, Popconfirm, Button, Tag } from "ant-design-vue";
import {
  CopyOutlined,
  ClearOutlined,
  ReloadOutlined,
} from "@ant-design/icons-vue";
import dayjs from "dayjs";
import Account from "../components/account.vue";
import Connect from "../components/connect.vue";
import { useAccount, useWriteContract } from "@wagmi/vue";
import { ERC20_ABI, ERC20_ADDRESS } from "../constants.js";

export default {
  components: {
    Popconfirm,
    CopyOutlined,
    ClearOutlined,
    Account,
    Connect,
    AButton: Button,
    ATag: Tag,
    ReloadOutlined,
  },
  setup() {
    const userInput = ref("");
    const message = ref("");
    let chatList = reactive([]);
    const chatListRef = ref(null);
    const commonIssues = ref([
      " ZeroGravity（0G）是什么？它的主要特点是什么？",
    ]);

    const sendMessage = () => {
      const sse = new EventSource(
        `http://127.0.0.1:5001/api/chat?msg=${userInput.value}`
      );
      const userMessage = {
        sender: "user",
        avatar: "/src/assets/user_avatar.png",
        message: userInput.value,
        time: dayjs().format("YYYY-MM-DD HH:mm:ss"),
      };
      chatList.push(userMessage);
      chatListRef.value.scrollTop = chatListRef.value.scrollHeight;

      const loadingMessage = {
        sender: "ai",
        avatar: "/src/assets/ai_avatar.png",
        loading: true,
      };
      chatListRef.value.scrollTop = chatListRef.value.scrollHeight;

      userInput.value = "";

      chatList.push(loadingMessage);

      sse.onmessage = (event) => {
        console.log(event);

        userInput.value = "";
        if (event.data === "END") {
          sse.close();
          message.value = "";
          return;
        }
        message.value += event.data;
        const aiMessage = {
          sender: "ai",
          avatar: "/src/assets/ai_avatar.png",
          message: message.value,
          time: dayjs().format("YYYY-MM-DD HH:mm:ss"),
        };

        chatList[chatList.length - 1] = aiMessage;
        chatListRef.value.scrollTop = chatListRef.value.scrollHeight;
      };

      sse.onerror = (error) => {
        sse.close();
      };
    };

    const clear = () => {
      chatList.splice(0, chatList.length);
      antMessage.success("清除成功");
    };

    const cancel = () => {};

    const copyToClipboard = (message) => {
      navigator.clipboard
        .writeText(message)
        .then(() => {
          antMessage.success("复制成功");
        })
        .catch((error) => {
          console.error("复制失败:", error);
        });
    };

    const quickQuestion = (value) => {
      userInput.value = value;
      sendMessage();
    };

    const { isConnected } = useAccount();
    const { writeContractAsync: subscribe } = useWriteContract({
      abi: ERC20_ABI,
      address: ERC20_ADDRESS,
      functionName: 'subscribe',
      args: [1],
    });
    const isPremium = ref(false);
    const triggerSubscription = async() => {
       try {
        const tx = await subscribe();
        await tx.wait();
        antMessage.success('Subscription function triggered successfully!');
      } catch (error) {
        console.error(error);
        antMessage.error('Failed to trigger subscription function.');
      }
    };

    const checkSubscription = () => {
      setTimeout(() => {
        const currentStatus = Math.random() > 0.5; // 随机模拟订阅状态
        isPremium.value = currentStatus;
        message.info("Subscription status refreshed.");
      }, 1000);
    };

    

    return {
      userInput,
      chatList,
      sendMessage,
      chatListRef,
      clear,
      cancel,
      copyToClipboard,
      commonIssues,
      quickQuestion,
      isConnected,
      isPremium,
      triggerSubscription,
      checkSubscription,
    };
  },
};
</script>

<style scoped>
.chat-header {
  position: absolute;
  top: 0px;
  height: 50px;
  width: 100vw;
  background-color: #fff;
  line-height: 50px;
  display: flex;
  flex-direction: row;
}

.chat-container {
  width: 100%;
  height: 90vh;
  margin: 50px auto;
  border-radius: 10px;
  display: flex;
}

.wallet-connector {
  position: absolute;
  top: -10px;
  right: 20px;
}

.chat-box {
  width: 78%;
  height: 100%;
  margin-bottom: 10px;
  position: relative;
  background: #fff;
  background-image: linear-gradient(rgb(245, 244, 246), rgb(230, 235, 247));
  border-radius: 20px;
  padding: 20px;
  /* box-shadow: 0 0 10px #bbb; */
}

.user,
.ai {
  padding: 10px;
  border-radius: 6px;
}

.ai {
  align-self: flex-start;
}

.user {
  justify-content: flex-end;
}

.chat-list {
  height: 90%;
  overflow-y: auto;
}

.chat-list::-webkit-scrollbar {
  width: 8px; /* 设置滚动条宽度 */
}

.chat-list::-webkit-scrollbar-thumb {
  background-color: #bbb; /* 设置滑块颜色 */
  border-radius: 4px; /* 设置滑块圆角 */
}

.chat-list::-webkit-scrollbar-thumb:hover {
  background-color: #555;
}

.chat-list::-webkit-scrollbar-track {
  background-color: #f1f1f1;
}

.message {
  display: flex;
  margin-bottom: 10px;
}

.avatar {
  width: 35px;
  height: 35px;
  margin: 0 10px;
  border-radius: 50%;
  background-color: #ccc;
  background-size: cover;
  background-position: center;
}

.ai .avatar {
  order: -1;
  object-fit: cover;
  margin-top: 2px;
}

.user .avatar {
  order: 1;
  margin-top: 2px;
}

.message-block {
  max-width: 65%;
  display: flex;
  flex-direction: column;
}

.message-text {
  padding: 10px 20px;
  min-height: 50px;
  border-radius: 10px;
  line-height: 25px;
  width: fit-content;
  background-color: #fff;
}

.user .message-block {
  align-items: end;
}

.ai .message-block {
  align-items: start;
}

.user-input-container {
  width: 50%;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  bottom: 30px;
  right: 0;
  left: 0;
  margin: auto;
  /* box-shadow: 0 0 10px #bbb; */
  padding: 20px;
  border-radius: 10px;
  background-color: #fff;
}

.user-input {
  flex: 1;
  border: none;
  padding: 10px;
  font-size: 16px;
  outline: none;
  background-color: transparent;
}

.send-button {
  background-color: #4c5158;
  color: white;
  border: none;
  border-radius: 10px;
  padding: 10px 20px;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
}

.send-button:hover {
  background-color: rgb(23, 100, 163);
}

.blink {
  height: 100%;
  font-size: 16px;
  position: relative;
}

.blink::after {
  content: "";
  position: absolute;
  top: 4px;
  right: -6px;
  width: 3px;
  height: 16px;
  background-color: black;
  animation: blink 1s infinite;
}

@keyframes blink {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0;
  }
}

.prompt {
  width: 20%;
  background: #081832;
  position: relative;
}

.issue {
  width: 90%;
  margin: auto;
  height: 60px;
  padding-left: 16px;
  padding-right: 16px;
  display: flex;
  margin-bottom: 10px;
  justify-content: center;
  align-items: center;
  border-radius: 10px;
  background: #4c5158;
  color: #fff;
  font-weight: 600;
}

.issue:hover {
  cursor: pointer;
  background: rgb(23, 100, 163);
  transition: all 0.5s;
}

.clear {
  width: 90%;
  position: absolute;
  bottom: 0px;
  left: 0;
  right: 0;
  margin: auto;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 10px;
  /* background: #034c6a; */
  background: #4c5158;
  color: #fff;
  font-weight: 600;
}

.clear:hover {
  cursor: pointer;
  background: rgb(23, 100, 163);
  transition: all 0.5s;
}
</style>
