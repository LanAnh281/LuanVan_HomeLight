<template>
  <div>
    <h1>Vue.js Socket.io Example</h1>
    <input
      v-model="message"
      @keyup.enter="sendMessage"
      placeholder="Nhập tin nhắn"
    />
    <ul>
      <li v-for="msg in messages">{{ msg }}</li>
    </ul>
  </div>
</template>

<script>
import io from "socket.io-client";

export default {
  data() {
    return {
      message: "",
      messages: [],
    };
  },
  mounted() {
    // Kết nối đến máy chủ Socket.io
    this.socket = io("http://localhost:3000");
    console.log("Lắng nghe sự kiện từ máy chủ");
    // Lắng nghe sự kiện từ máy chủ
    this.socket.on("message1", (data) => {
      this.messages.push(data);
    });
  },
  methods: {
    sendMessage() {
      // Gửi tin nhắn tới máy chủ
      this.socket.emit("message", this.message);
      this.message = "";
    },
  },
};
</script>
