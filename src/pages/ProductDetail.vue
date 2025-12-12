<template>
  <section v-if="product">
    <!-- Breadcrumb -->
    <nav class="mb-4 text-sm text-gray-500">
      <RouterLink to="/" class="hover:underline">Trang chủ</RouterLink> / 
      <RouterLink to="/products" class="hover:underline">Sản phẩm</RouterLink> / 
      <span class="text-gray-700 dark:text-gray-300 font-medium">{{ product.name }}</span>
    </nav>

    <div class="grid gap-8 md:grid-cols-2">
      <!-- CỘT TRÁI: ẢNH SẢN PHẨM -->
      <div>
        <div class="relative h-[500px] w-full rounded-lg border bg-gray-50 dark:border-gray-800 dark:bg-gray-900 flex items-center justify-center overflow-hidden">
          <img 
            :src="selectedImage || 'https://via.placeholder.com/600x600?text=No+Image'" 
            :alt="product.name" 
            class="max-h-full max-w-full object-contain transition-opacity duration-300"
          />
          
          <!-- Nút điều hướng ảnh -->
          <button v-if="productImages.length > 1" @click="previousImage" class="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-2 shadow-md hover:bg-white dark:bg-gray-800/80 dark:hover:bg-gray-800 transition">
            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" /></svg>
          </button>
          <button v-if="productImages.length > 1" @click="nextImage" class="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-2 shadow-md hover:bg-white dark:bg-gray-800/80 dark:hover:bg-gray-800 transition">
            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>
          </button>
          <div v-if="productImages.length > 1" class="absolute bottom-2 right-2 rounded-full bg-black/60 px-3 py-1 text-xs text-white backdrop-blur-sm">
            {{ currentImageIndex + 1 }} / {{ productImages.length }}
          </div>
        </div>

        <!-- Gallery -->
        <div v-if="productImages.length > 1" class="mt-4 flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
          <img 
            v-for="(img, idx) in productImages" :key="idx" :src="img" 
            @click="selectImageByIndex(idx)"
            class="h-20 w-20 shrink-0 cursor-pointer rounded border bg-white object-contain p-1 transition-all hover:border-gray-400 dark:bg-gray-800 dark:border-gray-700"
            :class="{ 'ring-2 ring-gray-900 dark:ring-gray-100 border-transparent': selectedImage === img }"
          />
        </div>
      </div>

      <!-- CỘT PHẢI: THÔNG TIN -->
      <div>
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">{{ product.name }}</h1>
        <p class="mt-2 text-sm text-gray-500 font-mono">SKU: {{ product.sku }}</p>
        
        <!-- Rating -->
        <div class="mt-3 flex items-center gap-2">
          <div class="flex items-center text-yellow-400 text-lg">
            <span v-for="i in 5" :key="i">{{ i <= Math.round(product.rating || 5) ? '★' : '☆' }}</span>
          </div>
          <span class="text-sm text-blue-600 hover:underline cursor-pointer" @click="activeTab = 'reviews'">
            ({{ product.reviews || 0 }} đánh giá)
          </span>
        </div>

        <p class="mt-4 text-3xl font-bold text-red-600 dark:text-red-400">
          {{ formatCurrency(product.price) }}
        </p>

        <!-- 1. CHỌN MÀU SẮC -->
        <div v-if="colors.length > 0" class="mt-6">
            <label class="block text-sm font-semibold mb-2">Màu sắc: <span class="text-gray-600 font-normal">{{ selectedColor?.name }}</span></label>
            <div class="flex gap-3">
                <button
                    v-for="color in colors"
                    :key="color.hex"
                    @click="selectedColor = color"
                    class="h-8 w-8 rounded-full border-2 transition-all relative"
                    :style="{ backgroundColor: color.hex }"
                    :class="{ 'ring-2 ring-offset-2 ring-gray-900 dark:ring-gray-100 border-transparent': selectedColor?.hex === color.hex, 'border-gray-300 dark:border-gray-600': selectedColor?.hex !== color.hex }"
                    :title="color.name"
                >
                </button>
            </div>
        </div>

        <!-- 2. CHỌN KÍCH CỠ -->
        <div v-if="sizes.length > 0" class="mt-6">
            <label class="block text-sm font-semibold mb-2">Kích cỡ: <span class="text-gray-600 font-normal">{{ selectedSize }}</span></label>
            <div class="flex gap-2 flex-wrap">
                <button
                    v-for="size in sizes"
                    :key="size"
                    @click="selectedSize = size"
                    class="rounded border px-4 py-2 font-medium transition-all min-w-[3rem]"
                    :class="{ 
                        'bg-gray-900 text-white border-gray-900 dark:bg-gray-100 dark:text-black': selectedSize === size,
                        'border-gray-300 hover:border-gray-400 text-gray-700 dark:border-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800': selectedSize !== size
                    }"
                >
                    {{ size }}
                </button>
            </div>
        </div>

        <!-- Mô tả ngắn -->
        <div class="mt-6 p-4 bg-gray-50 rounded-lg dark:bg-gray-800/50">
           <p class="text-sm text-gray-600 dark:text-gray-300 line-clamp-3">
             {{ product.shortDescription || product.description }}
           </p>
        </div>

        <!-- Trạng thái kho -->
        <div class="mt-6 flex items-center gap-2">
          <div class="h-2.5 w-2.5 rounded-full" :class="product.inStock ? 'bg-green-500' : 'bg-red-500'"></div>
          <p v-if="product.inStock" class="text-sm font-semibold text-green-600 dark:text-green-400">
            Còn hàng ({{ product.stock }})
          </p>
          <p v-else class="text-sm font-semibold text-red-600 dark:text-red-400">Hết hàng</p>
        </div>

        <!-- Nút Mua Hàng -->
        <div class="mt-6 flex gap-3">
          <div class="flex items-center rounded border bg-white dark:bg-gray-900 dark:border-gray-700">
            <button @click="qty = Math.max(1, qty - 1)" class="px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition">−</button>
            <input v-model.number="qty" type="number" min="1" :max="product.stock" class="w-12 border-0 bg-transparent text-center focus:ring-0 appearance-none" />
            <button @click="qty = Math.min(product.stock, qty + 1)" class="px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition">+</button>
          </div>

          <button 
            :disabled="!product.inStock"
            class="flex-1 rounded-lg bg-gray-900 px-6 py-3 font-bold text-white shadow-lg hover:bg-gray-800 hover:shadow-xl active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed transition-all dark:bg-gray-100 dark:text-black dark:hover:bg-gray-200" 
            @click="addToCart"
          >
            THÊM VÀO GIỎ HÀNG
          </button>
          
          <button @click="toggleWishlist" class="rounded-lg border px-4 py-2 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800 transition">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" :fill="wishlist.isInWishlist(product.id) ? 'currentColor' : 'none'" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- TABS -->
    <div class="mt-16 border-t pt-8 dark:border-gray-800">
      <div class="flex gap-8 border-b dark:border-gray-800 overflow-x-auto">
        <button 
            @click="activeTab = 'description'" 
            class="pb-4 text-lg font-semibold transition-colors relative whitespace-nowrap" 
            :class="activeTab === 'description' ? 'text-gray-900 dark:text-white' : 'text-gray-500 hover:text-gray-700'"
        >
          Mô tả <div v-if="activeTab === 'description'" class="absolute bottom-0 left-0 w-full h-0.5 bg-gray-900 dark:bg-white"></div>
        </button>
        <button 
            @click="activeTab = 'reviews'" 
            class="pb-4 text-lg font-semibold transition-colors relative whitespace-nowrap" 
            :class="activeTab === 'reviews' ? 'text-gray-900 dark:text-white' : 'text-gray-500 hover:text-gray-700'"
        >
          Đánh giá ({{ product.reviews }}) <div v-if="activeTab === 'reviews'" class="absolute bottom-0 left-0 w-full h-0.5 bg-gray-900 dark:bg-white"></div>
        </button>
        <!-- Tab Thử đồ Mới -->
        <button 
            @click="activeTab = 'tryon'" 
            class="pb-4 text-lg font-semibold transition-colors relative whitespace-nowrap" 
            :class="activeTab === 'tryon' ? 'text-gray-900 dark:text-white' : 'text-gray-500 hover:text-gray-700'"
        >
          Thử đồ với AI <div v-if="activeTab === 'tryon'" class="absolute bottom-0 left-0 w-full h-0.5 bg-gray-900 dark:bg-white"></div>
        </button>
      </div>

      <div class="py-8 min-h-[300px]">
        <!-- Nội dung Mô tả -->
        <div v-if="activeTab === 'description'" class="prose max-w-none text-gray-700 dark:prose-invert dark:text-gray-300">
          <p class="whitespace-pre-line leading-relaxed text-lg">{{ product.description || 'Chưa có mô tả chi tiết.' }}</p>
        </div>

       <!-- Nội dung Đánh giá -->
        <div v-else-if="activeTab === 'reviews'" class="space-y-8">
          
          <!-- PHẦN 1: FORM VIẾT ĐÁNH GIÁ (Thêm mới) -->
          <div class="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl border dark:border-gray-700">
              <h3 class="font-bold text-lg mb-4 text-gray-900 dark:text-white">Viết đánh giá của bạn</h3>
              
              <!-- Kiểm tra: Có Token (Đã đăng nhập) thì hiện Form -->
              <div v-if="userStore.token">
                  <form @submit.prevent="submitReview">
                      <!-- Chọn sao -->
                      <div class="mb-4">
                          <label class="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Bạn cảm thấy thế nào?</label>
                          <div class="flex gap-2">
                              <button 
                                  type="button" 
                                  v-for="star in 5" 
                                  :key="star"
                                  @click="newReview.rating = star"
                                  class="text-2xl transition-transform hover:scale-110"
                                  :class="star <= newReview.rating ? 'text-yellow-400' : 'text-gray-300'"
                              >
                                  ★
                              </button>
                          </div>
                      </div>

                      <!-- Nhập nội dung -->
                      <div class="mb-4">
                          <label class="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Nội dung đánh giá</label>
                          <textarea 
                              v-model="newReview.comment" 
                              rows="3" 
                              class="w-full p-3 rounded border dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 dark:text-white"
                              placeholder="Chia sẻ cảm nhận của bạn về sản phẩm..."
                              required
                          ></textarea>
                      </div>

                      <button 
                          type="submit" 
                          class="bg-gray-900 text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition disabled:opacity-50 dark:bg-white dark:text-black dark:hover:bg-gray-200"
                          :disabled="isSubmitting"
                      >
                          {{ isSubmitting ? 'Đang gửi...' : 'Gửi đánh giá' }}
                      </button>
                  </form>
              </div>

              <!-- Nếu chưa đăng nhập -->
              <div v-else class="text-center py-4 text-gray-500">
                  Vui lòng <router-link to="/auth" class="text-blue-600 hover:underline font-medium">đăng nhập</router-link> để viết đánh giá.
              </div>
          </div>

          <!-- PHẦN 2: DANH SÁCH ĐÁNH GIÁ (Giữ nguyên) -->
          <div>
            <h3 class="font-bold text-xl mb-4 text-gray-900 dark:text-white">Khách hàng nhận xét ({{ reviews.length }})</h3>
            
            <div v-if="reviews.length === 0" class="text-center py-10 text-gray-500 border border-dashed rounded-lg">
              Chưa có đánh giá nào. Hãy là người đầu tiên!
            </div>

            <div v-else class="space-y-6">
               <div v-for="review in reviews" :key="review.id" class="border-b pb-6 dark:border-gray-700 last:border-0">
                 <div class="flex justify-between items-start mb-2">
                   <div class="flex gap-3">
                      <div class="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center font-bold text-gray-600">
                          {{ (review.author || 'U').charAt(0).toUpperCase() }}
                      </div>
                      <div>
                          <h4 class="font-bold text-gray-900 dark:text-white">{{ review.author || 'Người dùng' }}</h4>
                          <div class="flex text-yellow-400 text-sm mt-1"><span v-for="i in 5" :key="i">{{ i <= review.rating ? '★' : '☆' }}</span></div>
                      </div>
                   </div>
                   <span class="text-xs text-gray-400">{{ formatDate(review.created_at) }}</span>
                 </div>
                 <p class="text-gray-700 dark:text-gray-300 ml-14">{{ review.comment }}</p>
                 <div v-if="review.admin_reply" class="ml-14 mt-3 bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg border border-blue-100 dark:border-blue-800">
    <div class="flex items-center gap-2 mb-1">
        <span class="bg-blue-600 text-white text-[10px] px-1.5 py-0.5 rounded font-bold uppercase">Shop phản hồi</span>
        <span class="text-xs text-gray-400">{{ formatDate(review.updated_at) }}</span>
    </div>
    <p class="text-sm text-gray-800 dark:text-gray-200">
        {{ review.admin_reply }}
    </p>
</div>
                 <!-- Nút Xóa -->
                 <div class="ml-14 mt-2" v-if="userStore.profile?.role === 'admin' || userStore.profile?.id === review.user_id">
                      <button @click="handleDeleteReview(review.id)" class="text-xs text-red-500 hover:underline">Xóa bình luận này</button>
                 </div>
               </div>
            </div>
          </div>
        </div>

        <!-- Nội dung Thử đồ -->
        <div v-else-if="activeTab === 'tryon'" class="mt-2">
            <h3 class="mb-6 text-xl font-bold">Phòng thử đồ ảo</h3>
            <p class="mb-6 text-gray-600 dark:text-gray-400">Tải ảnh của bạn lên và chọn sản phẩm để ướm thử.</p>
            
            <div class="grid gap-8 md:grid-cols-2">
                <!-- Cột 1: Upload Ảnh User -->
                <div>
                    <div class="rounded-lg border-2 border-dashed border-gray-300 p-8 text-center dark:border-gray-600 bg-gray-50 dark:bg-gray-800">
                        <div v-if="!tryOnImage">
                            <svg class="mx-auto mb-4 h-16 w-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" /></svg>
                            <p class="mb-4 text-gray-600 dark:text-gray-400">Kéo thả hoặc chọn ảnh của bạn</p>
                            <button @click="$refs.fileInput.click()" class="inline-block rounded-lg bg-gray-900 px-6 py-2 text-white hover:bg-gray-800 dark:bg-white dark:text-black">Chọn ảnh</button>
                        </div>
                        <div v-else class="relative">
                            <img :src="tryOnImage" class="mx-auto max-h-80 rounded shadow-md object-contain" />
                            <button @click="clearTryOnImage" class="mt-4 text-red-600 hover:underline">Xóa ảnh</button>
                        </div>
                        <input ref="fileInput" type="file" accept="image/*" @change="handleTryOnImageUpload" class="hidden" />
                    </div>
                </div>

                <!-- Cột 2: Chọn sản phẩm (Search) -->
                <div>
                    <div v-if="selectedTryOnProduct" class="rounded-lg border bg-blue-50 p-6 dark:border-blue-800 dark:bg-blue-900/20">
                        <h4 class="mb-4 font-semibold text-blue-900 dark:text-blue-100">Đang thử sản phẩm:</h4>
                        <div class="flex gap-4">
                            <img :src="selectedTryOnProduct.image" class="h-24 w-24 rounded-lg object-cover bg-white" />
                            <div class="flex-1">
                                <h5 class="text-lg font-bold">{{ selectedTryOnProduct.name }}</h5>
                                <p class="text-blue-600 font-bold mt-1">{{ formatCurrency(selectedTryOnProduct.price) }}</p>
                                <button @click="selectedTryOnProduct = null; tryOnSearch = ''" class="mt-3 text-sm text-blue-700 hover:underline">Chọn sản phẩm khác</button>
                            </div>
                        </div>
                    </div>

                    <div v-else>
                        <h4 class="mb-4 font-semibold">Tìm sản phẩm để thử</h4>
                        <input v-model="tryOnSearch" type="text" placeholder="Nhập tên sản phẩm..." class="w-full rounded border p-3 dark:bg-gray-900 dark:border-gray-700 mb-4" />
                        
                        <div class="max-h-80 overflow-y-auto space-y-2 border rounded p-2 dark:border-gray-700">
                            <div v-if="loadingTryOnProducts" class="text-center py-4">Đang tìm kiếm...</div>
                            <div v-else-if="storeProducts.length === 0" class="text-center py-4 text-gray-500">Không tìm thấy sản phẩm.</div>
                            
                            <div 
                                v-for="prod in storeProducts" 
                                :key="prod.id" 
                                @click="selectedTryOnProduct = prod"
                                class="flex cursor-pointer gap-3 rounded border p-2 hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-800 transition"
                            >
                                <img :src="prod.image" class="h-16 w-16 rounded object-cover bg-gray-200" />
                                <div>
                                    <p class="font-medium text-sm">{{ prod.name }}</p>
                                    <p class="text-xs text-gray-500">{{ formatCurrency(prod.price) }}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Nút Action -->
                    <div class="mt-6">
                        <button :disabled="!tryOnImage || !selectedTryOnProduct" class="w-full rounded-lg bg-blue-600 py-3 font-bold text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed">
                            🤖 BẮT ĐẦU THỬ ĐỒ (AI)
                        </button>
                        <p class="text-xs text-center mt-2 text-gray-500">Tính năng đang phát triển</p>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  </section>
  <div v-else class="container mx-auto px-4 py-8 animate-pulse"><div class="h-64 bg-gray-200 rounded"></div></div>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useProductsStore } from '../stores/products';
import { useCartStore } from '../stores/cart';
import { useWishlistStore } from '../stores/wishlist';
import { useUserStore } from '../stores/user'; // Import user store
import { useUIStore } from '../stores/ui'; // Import ui store
import api from '../utils/product_service_api'; 
import { formatCurrency } from '../utils/helpers';

const route = useRoute();
const productStore = useProductsStore();
const cart = useCartStore();
const wishlist = useWishlistStore();
const userStore = useUserStore(); // Init user store
const ui = useUIStore(); // Init ui store

// State Product Detail
const product = ref(null);
const reviews = ref([]);
const qty = ref(1);
const activeTab = ref('description');
const selectedImage = ref('');
const productImages = ref([]);
const currentImageIndex = ref(0);
const colors = ref([]);
const sizes = ref([]);
const selectedColor = ref(null);
const selectedSize = ref('M');
const imageColorMap = ref({});
const newReview = ref({ rating: 5, comment: '' });
const isSubmitting = ref(false);

// State Try On
const tryOnImage = ref('');
const tryOnSearch = ref('');
const selectedTryOnProduct = ref(null);
const storeProducts = ref([]);
const loadingTryOnProducts = ref(false);
const fileInput = ref(null);

onMounted(async () => {
  const id = route.params.id;
  await productStore.fetchProductById(id);
  const data = productStore.currentProduct;

  if (data) {
    product.value = {
      id: data.id,
      sku: data.sku,
      name: data.name,
      price: data.price,
      description: data.description,
      stock: data.stock_quantity,
      inStock: data.stock_quantity > 0,
      rating: data.rating || 0,
      reviews: data.review_count || 0,
    };

    if (data.attributes) {
      data.attributes.forEach(attr => {
        if (attr.attribute_name.toLowerCase() === 'màu') {
          const match = attr.attribute_value.match(/^(.*)\s\((#.*)\)$/);
          if (match) colors.value.push({ name: match[1], hex: match[2] });
          else colors.value.push({ name: attr.attribute_value, hex: '#000000' });
        } else if (attr.attribute_name === 'size') {
          sizes.value.push(attr.attribute_value);
        }
      });
    }
    if (!sizes.value.length) sizes.value = ['XS', 'S', 'M', 'L', 'XL'];
    if (colors.value.length > 0) selectedColor.value = colors.value[0];
    if (sizes.value.length > 0) selectedSize.value = sizes.value[0];

    if (data.images && data.images.length > 0) {
      const sortedImages = [...data.images].sort((a, b) => a.sort_order - b.sort_order);
      productImages.value = sortedImages.map(img => img.image_url);
      imageColorMap.value = {};
      sortedImages.forEach((img, index) => {
        if (img.color) imageColorMap.value[img.color.toLowerCase()] = index;
      });
    } else {
      productImages.value = ['https://via.placeholder.com/600x600?text=No+Image'];
    }
    
    if (data.images?.[0]?.color && colors.value.length > 0) {
        const firstColor = data.images[0].color.toLowerCase();
        const matching = colors.value.find(c => c.hex.toLowerCase() === firstColor);
        if (matching) selectedColor.value = matching;
    }

    selectedImage.value = productImages.value[0];
    fetchReviews(id);
  }
});

watch(selectedColor, (newColor) => {
  if (newColor && newColor.hex) {
    const targetIndex = imageColorMap.value[newColor.hex.toLowerCase()];
    if (targetIndex !== undefined) selectImageByIndex(targetIndex);
  }
});

watch(tryOnSearch, async (newVal) => {
    if (newVal.length > 1) {
        loadingTryOnProducts.value = true;
        try {
            const res = await api.get('/products', { params: { search: newVal, limit: 10 } });
            if (res.data.success) {
                storeProducts.value = res.data.data.map(p => {
                    let thumb = 'https://via.placeholder.com/100';
                    if (p.images?.length) thumb = p.images.find(i => i.is_primary)?.image_url || p.images[0].image_url;
                    return { id: p.id, name: p.name, price: p.price, image: thumb };
                });
            }
        } catch (e) { console.error(e); }
        finally { loadingTryOnProducts.value = false; }
    } else {
        storeProducts.value = [];
    }
});

function handleTryOnImageUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => tryOnImage.value = e.target.result;
    reader.readAsDataURL(file);
}
function clearTryOnImage() { tryOnImage.value = ''; if(fileInput.value) fileInput.value.value = ''; }

// src/pages/ProductDetail.vue

async function handleDeleteReview(reviewId) {
    if (!confirm('Bạn có chắc chắn muốn xóa bình luận này không?')) return;

    try {
        // Log ra để kiểm tra xem ID có đúng không
        console.log('Đang xóa review ID:', reviewId);

        // Gọi API
        const response = await api.delete(`/products/reviews/${reviewId}`);
        
        // Kiểm tra kết quả trả về
        if (response.data && response.data.success) {
            // Dùng alert thay vì ui.pushToast nếu chưa cấu hình xong ui store
            alert('Đã xóa bình luận thành công!'); 
            
            // Reload lại danh sách đánh giá ngay lập tức
            await fetchReviews(product.value.id);
        } else {
            alert('Không thể xóa: ' + (response.data.message || 'Lỗi không xác định'));
        }
    } catch (e) {
        console.error('Lỗi API Xóa:', e);
        // Hiển thị chi tiết lỗi để dễ debug
        alert('Lỗi Server (500): ' + (e.response?.data?.error || e.message));
    }
}

async function submitReview() {
    if (!newReview.value.comment.trim()) return;
    
    isSubmitting.value = true;
    try {
        // Gọi API tạo review
        // Cấu trúc payload tùy thuộc vào Backend yêu cầu
        const payload = {
            user_id: userStore.profile?.id, // ID người dùng
            rating: newReview.value.rating,
            comment: newReview.value.comment,
            title: 'Đánh giá sản phẩm' // Backend có thể yêu cầu title
        };

        // Gọi qua axios instance
        await api.post(`/products/${product.value.id}/reviews`, payload);
        
        // Thông báo thành công (Dùng ui store nếu có, hoặc alert tạm)
        // ui.pushToast({ type: 'success', message: 'Cảm ơn bạn đã đánh giá!' });
        alert('Cảm ơn bạn đã đánh giá!');

        // Reset form
        newReview.value.comment = '';
        newReview.value.rating = 5;

        // Load lại danh sách để hiện review mới
        fetchReviews(product.value.id);

    } catch (error) {
        console.error(error);
        alert('Lỗi khi gửi đánh giá: ' + (error.response?.data?.message || error.message));
    } finally {
        isSubmitting.value = false;
    }
}

async function fetchReviews(productId) { try { const res = await api.get(`/products/${productId}/reviews`); if (res.data.success) reviews.value = res.data.data; } catch (e) { console.error(e); } }
function formatDate(d) { if(!d) return ''; return new Date(d).toLocaleDateString('vi-VN'); }
function nextImage() { if (!productImages.value.length) return; currentImageIndex.value = (currentImageIndex.value + 1) % productImages.value.length; selectedImage.value = productImages.value[currentImageIndex.value]; }
function previousImage() { if (!productImages.value.length) return; currentImageIndex.value = (currentImageIndex.value - 1 + productImages.value.length) % productImages.value.length; selectedImage.value = productImages.value[currentImageIndex.value]; }
function selectImageByIndex(idx) { currentImageIndex.value = idx; selectedImage.value = productImages.value[idx]; }
function addToCart() {
  if (!product.value) return;
  cart.addItem({ id: product.value.id, name: product.value.name, price: product.value.price, image: selectedImage.value, selectedColor: selectedColor.value, selectedSize: selectedSize.value }, qty.value);
}
function toggleWishlist() {
  if (!product.value) return;
  wishlist.toggleItem({ id: product.value.id, name: product.value.name, price: product.value.price, image: selectedImage.value });
}
</script>