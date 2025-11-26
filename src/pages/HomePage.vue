<template>
	<section>
		<BannerCarousel :slides="bannerData" class="mb-6" />

		<h2 class="mb-3 flex items-center justify-between text-lg font-semibold">
			<span>Sản phẩm</span>
		</h2>

		<div class="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
			<ProductCard
				v-for="p in productsList"
				:key="p.id"
				:product="p"
				@add="addToCart"
				@wishlist="addWishlist"
			/>
		</div>

		<!-- Pagination -->
		<div class="mt-6 flex items-center justify-center space-x-3">
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
import { useCartStore } from '../stores/cart';
import { useProductsStore } from '../stores/products';

const bannerData = ref([
	{
		type: 'image',
		src: 'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?q=80&w=2070&auto=format&fit=crop',
		title: 'Bộ sưu tập mùa hè',
		subtitle: 'Giảm giá đặc biệt cho tất cả các mặt hàng.'
	},
	{
		type: 'video',
		src: 'https://videos.pexels.com/video-files/854171/854171-hd_1920_1080_25fps.mp4',
		title: 'Phong cách mới, Năng lượng mới',
		subtitle: 'Khám phá ngay.'
	},
	{
		type: 'image',
		src: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2070&auto=format&fit=crop',
		title: 'Siêu giảm giá cuối tuần',
		subtitle: 'Đừng bỏ lỡ các ưu đãi tuyệt vời.'
	}
]);

const cart = useCartStore();
const productsStore = useProductsStore();

const page = ref(1);
const pageSize = 12;
const productsList = ref([]);

const totalPages = computed(() => Math.max(1, Math.ceil((productsStore.total || 0) / pageSize)));

async function loadPage() {
	const skip = (page.value - 1) * pageSize;
	await productsStore.fetchList({ limit: pageSize, skip });
	const items = productsStore.items ?? [];
	productsList.value = (items ?? []).map((p) => ({
		id: p.id,
		name: p.title ?? p.name,
		price: p.price,
		brand: p.brand ?? 'Brand',
		images: p.images ?? (p.thumbnail ? [p.thumbnail] : []),
		image: p.thumbnail ?? (p.images?.[0] || 'https://picsum.photos/400')
	}));
	// Scroll to top after loading a new page so user sees the top of product list
	if (typeof window !== 'undefined') {
		window.scrollTo({ top: 0, behavior: 'smooth' });
	}
}

function addToCart(p) {
	cart.addItem(p, 1);
}
function addWishlist() {
	/* no-op demo */
}

function prevPage() {
	if (page.value > 1) page.value -= 1;
}
function nextPage() {
	if (page.value < totalPages.value) page.value += 1;
}

watch(page, () => {
	loadPage();
});

onMounted(async () => {
	await loadPage();
});
</script>
