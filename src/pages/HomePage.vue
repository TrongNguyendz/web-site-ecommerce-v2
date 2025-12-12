<template>
	<section>
		<BannerCarousel :slides="bannerData" class="mb-6" />

		<h2 class="mb-3 flex items-center justify-between text-lg font-semibold">
			<span>Sản phẩm nổi bật</span>
		</h2>
        
        <Chatbot />

        <!-- Loading Skeleton -->
        <div v-if="productsStore.loading" class="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
			<div v-for="i in 4" :key="i" class="h-64 animate-pulse rounded-lg bg-gray-100 dark:bg-gray-800"></div>
		</div>

        <!-- Product Grid -->
		<div v-else class="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
			<ProductCard
				v-for="p in productsList"
				:key="p.id"
				:product="p"
				@add="addToCart"
				@wishlist="addWishlist"
			/>
		</div>

		<div v-if="totalPages > 1" class="mt-6 flex items-center justify-center space-x-3">
			<button
				@click="prevPage"
				:disabled="page === 1"
				class="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200 text-gray-700 transition-colors hover:bg-gray-300 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
			>
				<span class="sr-only">Trang trước</span>
				<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
				</svg>
			</button>
			<span class="text-sm font-medium text-gray-700 dark:text-gray-300">
				Trang <span class="font-bold">{{ page }}</span> / <span class="font-bold">{{ totalPages }}</span>
			</span>
			<button
				@click="nextPage"
				:disabled="page === totalPages"
				class="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200 text-gray-700 transition-colors hover:bg-gray-300 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
			>
				<span class="sr-only">Trang kế tiếp</span>
				<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
				</svg>
			</button>
		</div>
	</section>
</template>

<script setup>
import { onMounted, ref, computed, watch } from 'vue';
import ProductCard from '../components/common/ProductCard.vue';
import BannerCarousel from '../components/common/BannerCarousel.vue';
import Chatbot from '../components/common/chatbot.vue'; // Component Chatbot 
import { useCartStore } from '../stores/cart';
import { useProductsStore } from '../stores/products'; // Store sản phẩm mới
import { useUserStore } from "../stores/user";
import { getListBanners } from '../utils/banner_service_api'; // API Banner

const user = useUserStore();
const cart = useCartStore();
const productsStore = useProductsStore();

const bannerData = ref([]);
const bannerLoading = ref(true);

async function loadBanners() {
  try {
    bannerLoading.value = true;
    const response = await getListBanners();
    const rawBanners = response.data.data || [];
    
    if (rawBanners.length > 0) {
        bannerData.value = rawBanners.map(banner => ({
            type: banner.link_type === 'video' ? 'video' : 'image',
            src: banner.image_url.startsWith('http') ? banner.image_url : `http://localhost:3006${banner.image_url}`,
            title: banner.title,
            subtitle: banner.description,
            link: banner.link || null
        }));
    } else {
        throw new Error('No banner data');
    }
  } catch (err) {
    console.error('Lỗi tải banner, dùng dữ liệu mẫu:', err);
    // Banner mẫu dự phòng
    bannerData.value = [
      {
        type: 'image',
        src: 'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?q=80&w=2070&auto=format&fit=crop',
        title: 'Bộ sưu tập mùa hè',
        subtitle: 'Giảm giá đặc biệt cho tất cả các mặt hàng.'
      },
      {
        type: 'image',
        src: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2070&auto=format&fit=crop',
        title: 'Siêu giảm giá cuối tuần',
        subtitle: 'Đừng bỏ lỡ các ưu đãi tuyệt vời.'
      }
    ];
  } finally {
    bannerLoading.value = false;
  }
}


const page = ref(1);
const pageSize = 12;

// Map dữ liệu từ Store (backend mới) sang UI
const productsList = computed(() => {
    // Lưu ý: Dùng store.products (số nhiều) thay vì store.items
    const items = productsStore.products || [];
    
    return items.map((p) => {
        // Logic lấy ảnh chuẩn: Ưu tiên ảnh primary
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
            discount: p.discount_percent
        };
    });
});

// Tính tổng trang từ Pagination của Backend
const totalPages = computed(() => {
    if (productsStore.pagination && productsStore.pagination.pages) {
        return productsStore.pagination.pages;
    }
    return 1;
});

// Hàm gọi API lấy sản phẩm
async function loadPage() {
    // SỬA: Dùng fetchProducts({ page, limit }) thay vì fetchList({ skip })
    await productsStore.fetchProducts({ 
        page: page.value, 
        limit: pageSize 
    });

    if (typeof window !== 'undefined') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

// Các hàm sự kiện
function addToCart(p) {
  cart.addItem(p, 1);
}
function addWishlist() { console.log('Wishlist click'); }

function prevPage() {
  if (page.value > 1) page.value -= 1;
}
function nextPage() {
  if (page.value < totalPages.value) page.value += 1;
}

watch(page, () => {
  loadPage();
});

// ===== 3. LIFECYCLE =====
onMounted(async () => {
  await Promise.all([
      loadBanners(), // Load banner từ port 3006
      loadPage()     // Load sản phẩm từ port 3002
  ]);
});
</script>