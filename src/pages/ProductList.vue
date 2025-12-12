<template>
  <section>
    <h1 class="mb-4 text-xl font-semibold">Danh sách sản phẩm</h1>
    <div class="grid gap-6 md:grid-cols-[240px_1fr]">
      <!-- Sidebar Bộ lọc -->
      <aside class="space-y-4">
        <!-- Tìm kiếm -->
        <InputField 
          v-model="filters.q" 
          @keyup.enter="applyFilters"
          label="Từ khóa" 
          placeholder="Tìm kiếm..." 
        />
        
        <!-- Sắp xếp -->
        <SelectDropdown 
          v-model="filters.sort" 
          label="Sắp xếp" 
          :options="sortOptions" 
        />
        
        <!-- Khoảng giá -->
        <InputField 
          v-model="filters.min" 
          label="Giá từ" 
          type="number" 
          placeholder="0"
        />
        <InputField 
          v-model="filters.max" 
          label="Giá đến" 
          type="number" 
          placeholder="Max"
        />
        
        <button 
          class="w-full rounded bg-gray-900 px-3 py-2 text-white hover:bg-gray-800 transition dark:bg-gray-100 dark:text-black dark:hover:bg-gray-200" 
          @click="applyFilters"
        >
          Lọc
        </button>
      </aside>

      <!-- Danh sách sản phẩm -->
      <div>
        <!-- Loading State -->
        <div v-if="loading" class="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          <div v-for="i in 8" :key="i" class="h-64 animate-pulse rounded-lg bg-gray-100 dark:bg-gray-800"></div>
        </div>

        <!-- Empty State -->
        <div v-else-if="items.length === 0" class="text-center py-10 text-gray-500">
          Không tìm thấy sản phẩm nào phù hợp.
        </div>

        <!-- Product Grid -->
        <div v-else class="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          <!-- Truyền prop product đã được map dữ liệu chuẩn -->
          <ProductCard 
            v-for="p in items" 
            :key="p.id" 
            :product="p" 
            @add="addToCart" 
          />
        </div>

        <!-- Pagination -->
        <div v-if="totalPages > 1" class="mt-6 flex items-center justify-center space-x-3">
          <button
            @click="prevPage"
            :disabled="currentPage === 1"
            class="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200 text-gray-700 transition-colors hover:bg-gray-300 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
          >
            <span class="sr-only">Trang trước</span>
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <span class="text-sm font-medium text-gray-700 dark:text-gray-300">
            Trang <span class="font-bold">{{ currentPage }}</span> / <span class="font-bold">{{ totalPages }}</span>
          </span>
          
          <button
            @click="nextPage"
            :disabled="currentPage === totalPages"
            class="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200 text-gray-700 transition-colors hover:bg-gray-300 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
          >
            <span class="sr-only">Trang kế tiếp</span>
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { onMounted, reactive, computed, ref, watch } from 'vue';
import { useProductsStore } from '../stores/products';
import { useCartStore } from '../stores/cart';
import InputField from '../components/forms/InputField.vue';
import SelectDropdown from '../components/forms/SelectDropdown.vue';
import ProductCard from '../components/common/ProductCard.vue';

// Init Stores
const productsStore = useProductsStore();
const cartStore = useCartStore();

// Reactive State
const loading = computed(() => productsStore.loading);
const filters = reactive({ q: '', sort: 'newest', min: '', max: '' });

// Pagination State
const currentPage = ref(1);
const itemsPerPage = ref(24);

// Map dữ liệu từ Store sang định dạng mà ProductCard cần
const items = computed(() => {
  const list = productsStore.products || []; // Fallback mảng rỗng nếu chưa có data
  return list.map((p) => {
    // Logic lấy ảnh: Ưu tiên ảnh primary, nếu không có lấy ảnh đầu tiên
    let imageUrl = 'https://via.placeholder.com/400x400?text=No+Image';
    if (p.images && p.images.length > 0) {
      const primary = p.images.find(img => img.is_primary);
      imageUrl = primary ? primary.image_url : p.images[0].image_url;
    }

    return {
      id: p.id,
      name: p.name,
      price: p.price,
      brand: p.category_name || 'Fashion', 
      image: imageUrl,
      
    };
  });
});

// Tính tổng số trang từ dữ liệu pagination của Backend
const totalPages = computed(() => {
  // Nếu backend trả về pagination.pages thì dùng luôn
  if (productsStore.pagination && productsStore.pagination.pages) {
    return productsStore.pagination.pages;
  }
  return 1;
});

const sortOptions = [
  { value: 'newest', label: 'Mới nhất' },
  { value: 'price_asc', label: 'Giá tăng dần' },
  { value: 'price_desc', label: 'Giá giảm dần' }
];

// Hàm gọi API
async function fetchProducts() {
  const params = {
    page: currentPage.value,
    limit: itemsPerPage.value,
    search: filters.q,      // Backend nhận 'search'
    minPrice: filters.min,  // Backend nhận 'minPrice'
    maxPrice: filters.max,  // Backend nhận 'maxPrice'
    // sort: filters.sort   // Backend cần implement thêm logic sort này nếu muốn
  };

  // Gọi action từ Store
  await productsStore.fetchProducts(params);
}

// Lifecycle & Watchers
onMounted(() => {
  fetchProducts();
});

// Khi đổi trang -> Gọi lại API
watch(currentPage, () => {
  fetchProducts();
  // Cuộn lên đầu trang cho UX tốt hơn
  if (typeof window !== 'undefined') {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
});

// Các hàm xử lý sự kiện
function applyFilters() {
  currentPage.value = 1; // Reset về trang 1 khi lọc
  fetchProducts();
}

function addToCart(product) {
  // ProductCard emit event 'add', ta gọi store cart
  cartStore.addItem(product, 1);
}

function nextPage() {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
  }
}

function prevPage() {
  if (currentPage.value > 1) {
    currentPage.value--;
  }
}
</script>