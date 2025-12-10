<template>
  <!-- Nút nổi góc phải dưới -->
  <div class="fixed bottom-6 right-6 z-50">
    <!-- Cửa sổ chat (hiện khi isOpen = true) -->
    <transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="transform scale-95 opacity-0"
      enter-to-class="transform scale-100 opacity-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="transform scale-100 opacity-100"
      leave-to-class="transform scale-95 opacity-0"
    >
      <div
        v-if="isOpen"
        class="absolute bottom-20 right-0 w-96 h-96 md:h-[520px] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden"
      >
        <!-- Header chat -->
        <div class="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 flex justify-between items-center">
          <div class="flex items-center space-x-3">
            <div class="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6 2a10 10 0 100 20h4a1 1 0 001-1v-3a3 3 0 00-3-3H8.414l-2.707 2.707A1 1 0 014 20V6a4 4 0 014-4h8z"/>
              </svg>
            </div>
            <div>
              <h3 class="font-semibold">Trợ lý ảo</h3>
              <p class="text-xs opacity-90">Đang trực tuyến</p>
            </div>
          </div>
          <button
            @click="isOpen = false"
            class="hover:bg-white/20 rounded-lg p-2 transition"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <!-- Khu vực tin nhắn (cuộn xuống dưới mới nhất) -->
        <div ref="messagesContainer" class="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
          <div v-for="(msg, i) in messages" :key="i" :class="msg.isBot ? 'flex justify-start' : 'flex justify-end'">
            <div
              :class="msg.isBot
                ? 'bg-white text-gray-800 max-w-xs lg:max-w-md px-4 py-3 rounded-2xl rounded-tl-none shadow'
                : 'bg-blue-600 text-white max-w-xs lg:max-w-md px-4 py-3 rounded-2xl rounded-tr-none'"
            >
              <p class="text-sm">{{ msg.text }}</p>
              <p class="text-xs mt-1 opacity-70">{{ msg.time }}</p>
            </div>
          </div>
        </div>

        <!-- Input gửi tin nhắn -->
        <div class="border-t bg-white p-4">
          <div class="flex space-x-2">
            <input
              v-model="newMessage"
              @keyup.enter="sendMessage"
              type="text"
              placeholder="Nhập tin nhắn..."
              class="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              @click="sendMessage"
              class="bg-blue-600 hover:bg-blue-700 text-white rounded-full p-3 transition"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-11-11L2 12l9 2 7-7 2 9z"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </transition>

    <!-- Nút tròn để mở chat -->
    <button
      @click="toggleChat"
      class="w-14 h-14 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-full shadow-lg hover:shadow-2xl transform hover:scale-110 transition-all duration-300 flex items-center justify-center"
    >
      <svg v-if="!isOpen" class="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
        <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/>
      </svg>
      <svg v-else class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
      </svg>
    </button>
  </div>
</template>

<script setup>
import { ref, nextTick, onMounted } from 'vue'
// Import thư viện Gemini cho Frontend
import { GoogleGenAI } from '@google/genai';

// Lấy API Key từ biến môi trường (ví dụ: Vite)
// Cần thay thế 'VITE_GEMINI_API_KEY' bằng tên biến môi trường thực tế của bạn
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY; 

// Khởi tạo Gemini API
const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
const chat = ai.chats.create({ model: "gemini-2.5-flash" }); // Tạo session chat

const isOpen = ref(false)
const newMessage = ref('')
const messages = ref([
  {
    text: 'Xin chào! Mình là trợ lý ảo. Bạn cần hỗ trợ gì hôm nay?',
    isBot: true,
    time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
  }
])

const messagesContainer = ref(null)

const toggleChat = () => {
  isOpen.value = !isOpen.value
  if (isOpen.value) {
    // Khi mở chat → cuộn xuống tin nhắn xuống cuối
    nextTick(() => {
      scrollToBottom()
    })
  }
}

// const sendMessage = () => {
//   if (!newMessage.value.trim()) return

//   const userMsg = {
//     text: newMessage.value,
//     isBot: false,
//     time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
//   }
//   messages.value.push(userMsg)
//   newMessage.value = ''

//   // Giả lập bot trả lời sau 1 giây
//   setTimeout(() => {
//     messages.value.push({
//       text: 'Cảm ơn bạn đã nhắn tin! Mình sẽ hỗ trợ ngay đây',
//       isBot: true,
//       time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
//     })
//     nextTick(() => scrollToBottom())
//   }, 1000)

//   nextTick(() => scrollToBottom())
// }

// SỬA HÀM sendMessage để gọi API trực tiếp
const sendMessage = async () => {
  const messageText = newMessage.value.trim();
  if (!messageText) return

  const userMsg = {
    text: messageText,
    isBot: false,
    time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
  }
  messages.value.push(userMsg)
  newMessage.value = ''

  nextTick(() => scrollToBottom())
  
  // ----------------------------------------------------
  // GỌI GEMINI API TRỰC TIẾP
  // ----------------------------------------------------
  try {
      // 1. Gửi tin nhắn
      const response = await chat.sendMessage({ message: messageText });
      const botResponse = response.text; 

      // 2. Thêm phản hồi của bot vào tin nhắn
      messages.value.push({
          text: botResponse,
          isBot: true,
          time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
      });

  } catch (error) {
      console.error("Lỗi gọi API Gemini:", error);
      messages.value.push({
          text: 'Xin lỗi, đã xảy ra lỗi khi kết nối với trợ lý ảo. (Kiểm tra console)',
          isBot: true,
          time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
      });
  }

  nextTick(() => scrollToBottom())
}

const scrollToBottom = () => {
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
}

onMounted(() => {
  // Có thể load lịch sử chat từ localStorage hoặc API ở đây
})
</script>