<template>
	<section v-if="product">
		<nav class="mb-4 text-sm text-gray-500">
			<RouterLink to="/" class="hover:underline">Trang chủ</RouterLink> / 
			<RouterLink to="/products" class="hover:underline">Sản phẩm</RouterLink> / 
			<span class="text-gray-700 dark:text-gray-300">{{ product.name }}</span>
		</nav>
		<div class="grid gap-8 md:grid-cols-2">
			<!-- Product Images -->
			<div>
				<!-- Main Image with Navigation -->
				<div class="relative">
					<img :src="selectedImage" :alt="product.name" class="w-full rounded-lg border object-cover dark:border-gray-800" />
					
					<!-- Previous Button -->
					<button 
						v-if="productImages.length > 1"
						@click="previousImage"
						class="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-2 hover:bg-white dark:bg-gray-800/80 dark:hover:bg-gray-800"
						title="Ảnh trước (←)"
					>
						<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
						</svg>
					</button>
					
					<!-- Next Button -->
					<button 
						v-if="productImages.length > 1"
						@click="nextImage"
						class="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-2 hover:bg-white dark:bg-gray-800/80 dark:hover:bg-gray-800"
						title="Ảnh tiếp theo (→)"
					>
						<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
						</svg>
					</button>

					<!-- Image Counter -->
					<div v-if="productImages.length > 1" class="absolute bottom-2 right-2 rounded-full bg-black/60 px-3 py-1 text-sm text-white">
						{{ currentImageIndex + 1 }}/{{ productImages.length }}
					</div>
				</div>

				<!-- Thumbnail Gallery -->
				<div v-if="productImages.length > 1" class="mt-4 flex gap-2 overflow-x-auto">
					<img 
						v-for="(img, idx) in productImages" 
						:key="idx"
						:src="img" 
						:alt="`Product ${idx}`"
						@click="selectImageByIndex(idx)"
						class="h-20 w-20 shrink-0 cursor-pointer rounded border object-cover transition-all dark:border-gray-700"
						:class="{ 'ring-2 ring-gray-900 dark:ring-gray-100': selectedImage === img }"
					/>
				</div>
			</div>

			<!-- Product Info -->
			<div>
				<h1 class="text-2xl font-semibold">{{ product.name }}</h1>
				<p class="mt-2 text-gray-500">{{ product.brand }}</p>
				
				<!-- Rating -->
				<div class="mt-3 flex items-center gap-2">
					<div class="flex items-center">
						<span v-for="i in 5" :key="i" class="text-yellow-400">★</span>
					</div>
					<span class="text-sm text-gray-600 dark:text-gray-400">({{ product.reviews ?? 23 }} đánh giá)</span>
				</div>

				<p class="mt-4 text-2xl font-bold">{{ formatCurrency(product.price) }}</p>

				<!-- Color Selection -->
				<div class="mt-6">
					<label class="block text-sm font-semibold">Màu sắc: <span class="text-gray-600">{{ selectedColor }}</span></label>
					<div class="mt-2 flex gap-3">
						<button
							v-for="color in product.colors"
							:key="color"
							@click="selectedColor = color"
							class="h-8 w-8 rounded-full border-2 transition-all"
							:style="{ backgroundColor: color }"
							:class="{ 'ring-2 ring-offset-2 ring-gray-900 dark:ring-gray-100': selectedColor === color }"
							:title="color"
						/>
					</div>
				</div>

				<!-- Size Selection -->
				<div class="mt-6">
					<label class="block text-sm font-semibold">Kích cỡ: <span class="text-gray-600">{{ selectedSize }}</span></label>
					<div class="mt-2 flex gap-2">
						<button
							v-for="size in product.sizes"
							:key="size"
							@click="selectedSize = size"
							class="rounded border px-4 py-2 font-medium transition-all dark:border-gray-700"
							:class="{ 
								'bg-gray-900 text-white dark:bg-gray-100 dark:text-black': selectedSize === size,
								'border-gray-300 hover:border-gray-400 dark:hover:border-gray-600': selectedSize !== size
							}"
						>
							{{ size }}
						</button>
					</div>
				</div>

				<!-- Product Description -->
				<p class="mt-6 text-sm text-gray-600 dark:text-gray-300">{{ product.description }}</p>

				<!-- Stock Status -->
				<div class="mt-4">
					<p v-if="product.inStock" class="text-sm font-semibold text-green-600 dark:text-green-400">Còn {{ product.stock ?? 'nhiều' }} hàng</p>
					<p v-else class="text-sm font-semibold text-red-600 dark:text-red-400">Hết hàng</p>
				</div>

				<!-- Quantity & Buttons -->
				<div class="mt-6 flex gap-3">
					<div class="flex items-center rounded border dark:border-gray-700">
						<button @click="qty = Math.max(1, qty - 1)" class="px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-800">−</button>
						<input v-model.number="qty" type="number" min="1" class="w-16 border-0 bg-transparent text-center" />
						<button @click="qty += 1" class="px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-800">+</button>
					</div>
					<button 
						:disabled="!product.inStock"
						class="flex-1 rounded bg-gray-900 px-4 py-2 text-white hover:bg-gray-800 disabled:opacity-50 dark:bg-gray-100 dark:text-black dark:hover:bg-gray-200" 
						@click="addToCart"
					>
						THÊM VÀO GIỎ HÀNG
					</button>
					<button 
						@click="toggleWishlist"
						:class="{ 'text-red-500': wishlist.isInWishlist(product.id) }"
						class="rounded border px-4 py-2 hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-800"
						:title="wishlist.isInWishlist(product.id) ? 'Bỏ yêu thích' : 'Thêm vào yêu thích'"
					>
						{{ wishlist.isInWishlist(product.id) ? '♥' : '♡' }}
					</button>
				</div>

				<!-- Additional Info -->
				<div class="mt-6 border-t pt-4 dark:border-gray-700">
					<p class="text-sm text-blue-600 dark:text-blue-400">
						<a href="#" class="hover:underline">Tìm sản phẩm còn hàng trong của hàng</a>
					</p>
				</div>
			</div>
		</div>

		<!-- Product Details Section -->
		<div class="mt-12 border-t pt-8 dark:border-gray-800">
			<div class="flex gap-4 border-b dark:border-gray-800">
				<button 
					@click="activeTab = 'description'"
					class="px-4 py-2 font-semibold"
					:class="{ 'border-b-2 border-gray-900 dark:border-gray-100': activeTab === 'description' }"
				>
					Mô tả
				</button>
				<button 
					@click="activeTab = 'reviews'"
					class="px-4 py-2 font-semibold"
					:class="{ 'border-b-2 border-gray-900 dark:border-gray-100': activeTab === 'reviews' }"
				>
					Đánh giá ({{ product.reviews ?? 23 }})
				</button>
			</div>

			<!-- Description Tab -->
			<div v-if="activeTab === 'description'" class="mt-6">
				<h3 class="mb-3 text-lg font-semibold">Mô tả chi tiết</h3>
				<div class="prose max-w-none text-gray-700 dark:prose-invert dark:text-gray-300">
					<p>{{ product.longDescription ?? 'Đang cập nhật...' }}</p>
				</div>
			</div>

			<!-- Reviews Tab -->
			<div v-else class="mt-6">
				<h3 class="mb-6 text-lg font-semibold">Đánh giá sản phẩm</h3>
				
				<!-- Review Summary -->
				<div class="mb-8 flex gap-8">
					<div>
						<p class="text-3xl font-bold">5.0</p>
						<div class="mt-2 flex items-center">
							<span v-for="i in 5" :key="i" class="text-yellow-400">★</span>
						</div>
						<p class="mt-2 text-sm text-gray-600 dark:text-gray-400">{{ product.reviews ?? 23 }} đánh giá</p>
					</div>
					<div class="flex flex-1 flex-col gap-2">
						<div v-for="rating in [5, 4, 3, 2, 1]" :key="rating" class="flex items-center gap-2">
							<span class="w-8 text-sm">{{ rating }}★</span>
							<div class="h-2 flex-1 rounded-full bg-gray-200 dark:bg-gray-700">
								<div class="h-full rounded-full bg-yellow-400" :style="{ width: (rating === 5 ? 80 : rating === 4 ? 15 : 5) + '%' }"></div>
							</div>
							<span class="w-8 text-right text-sm text-gray-600 dark:text-gray-400">{{ rating === 5 ? 19 : rating === 4 ? 3 : 1 }}</span>
						</div>
					</div>
				</div>

				<!-- Individual Reviews -->
				<div class="space-y-4 border-t pt-6 dark:border-gray-700">
					<div v-for="review in productReviews" :key="review.id" class="border-b pb-4 dark:border-gray-700">
						<div class="flex items-start justify-between">
							<div>
								<p class="font-semibold">{{ review.author }}</p>
								<div class="mt-1 flex items-center gap-2">
									<span v-for="i in review.rating" :key="i" class="text-sm text-yellow-400">★</span>
									<span v-for="i in (5 - review.rating)" :key="i" class="text-sm text-gray-300">★</span>
								</div>
							</div>
							<span class="text-sm text-gray-500">{{ review.date }}</span>
						</div>
						<p class="mt-2 text-sm text-gray-700 dark:text-gray-300">{{ review.comment }}</p>
					</div>
				</div>
			</div>
		</div>
	</section>
	<div v-else class="h-64 animate-pulse rounded-lg bg-gray-100 dark:bg-gray-800"></div>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue';
import { useRoute } from 'vue-router';
import { useCartStore } from '../stores/cart';
import { useWishlistStore } from '../stores/wishlist';
import api from '../utils/api';
import { formatCurrency } from '../utils/helpers';

const route = useRoute();
const cart = useCartStore();
const wishlist = useWishlistStore();
const product = ref(null);
const qty = ref(1);
const activeTab = ref('description');
const selectedColor = ref('#8b5cf6');
const selectedSize = ref('M');
const selectedImage = ref('');
const productImages = ref([]);
const currentImageIndex = ref(0);

// Sample reviews data
const productReviews = ref([
	{ id: 1, author: 'Nguyễn Văn A', rating: 5, date: '2 ngày trước', comment: 'Sản phẩm tuyệt vời! Chất lượng rất tốt, giao hàng nhanh.' },
	{ id: 2, author: 'Trần Thị B', rating: 4, date: '1 tuần trước', comment: 'Rất hài lòng với mua hàng này. Size vừa vặn và màu sắc đúng như mô tả.' },
	{ id: 3, author: 'Lê Văn C', rating: 5, date: '2 tuần trước', comment: 'Tuyệt vời! Mặc rất thoải mái và ấm áp.' }
]);

	function generateProductImages(productId, baseImage, w = 800, h = 800) {
		// Generate multiple images for testing image carousel
		// Using picsum.photos with different seeds to get different images
		// Accept width and height so generated images match the original aspect/size
		const sizeUrl = (seed) => `https://picsum.photos/${w}/${h}?random=${productId}_${seed}`;
		return [
			baseImage,
			sizeUrl(1),
			sizeUrl(2),
			sizeUrl(3),
			sizeUrl(4),
		];
	}

	onMounted(async () => {
		const productId = route.params.id;
		const { data } = await api.get(`/products/${productId}`);
		const p = data ?? {};
		const baseImage = p.thumbnail || p.images?.[0] || 'https://picsum.photos/800/800';

		// Set product basic info (immediate)
		product.value = {
			id: p.id,
			name: p.title ?? p.name,
			price: p.price,
			brand: p.brand ?? 'Brand',
			description: p.description ?? 'Mô tả ngắn sản phẩm',
			longDescription: p.description ?? 'Chi tiết sản phẩm sẽ được cập nhật sớm',
			image: p.thumbnail ?? (p.images?.[0] || 'https://picsum.photos/800'),
			colors: ['#e5e7eb', '#a78bfa', '#000000', '#d8b4fe', '#374151', '#0f766e', '#c4b5fd'],
			sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
			stock: 10,
			inStock: true,
			reviews: 23
		};

		// Try to load base image to detect natural dimensions so generated picsum images match original size
		const imgProbe = new Image();
		imgProbe.crossOrigin = 'anonymous';
		imgProbe.src = baseImage;

		imgProbe.onload = () => {
			const w = imgProbe.naturalWidth || 800;
			const h = imgProbe.naturalHeight || Math.round(w * 0.75);
			const images = generateProductImages(productId, baseImage, w, h);
			productImages.value = images;
			selectedImage.value = images[0];
			currentImageIndex.value = 0;
		};

		imgProbe.onerror = () => {
			// fallback generator
			const images = generateProductImages(productId, baseImage);
			productImages.value = images;
			selectedImage.value = images[0];
			currentImageIndex.value = 0;
		};

		// safety timeout in case image load hangs
		setTimeout(() => {
			if (!productImages.value.length) {
				const images = generateProductImages(productId, baseImage);
				productImages.value = images;
				selectedImage.value = images[0];
				currentImageIndex.value = 0;
			}
		}, 1200);


	// Listen for keyboard navigation
	window.addEventListener('keydown', handleKeyboard);
});

function nextImage() {
	if (productImages.value.length === 0) return;
	currentImageIndex.value = (currentImageIndex.value + 1) % productImages.value.length;
	selectedImage.value = productImages.value[currentImageIndex.value];
}

function previousImage() {
	if (productImages.value.length === 0) return;
	currentImageIndex.value = (currentImageIndex.value - 1 + productImages.value.length) % productImages.value.length;
	selectedImage.value = productImages.value[currentImageIndex.value];
}

function selectImageByIndex(idx) {
	currentImageIndex.value = idx;
	selectedImage.value = productImages.value[idx];
}

function handleKeyboard(e) {
	if (e.key === 'ArrowLeft') {
		previousImage();
	} else if (e.key === 'ArrowRight') {
		nextImage();
	}
}

function addToCart() {
	if (!product.value) return;
	cart.addItem({
		...product.value,
		selectedColor: selectedColor.value,
		selectedSize: selectedSize.value
	}, qty.value || 1);
}

function toggleWishlist() {
	if (!product.value) return;
	wishlist.toggleItem({
		...product.value,
		selectedColor: selectedColor.value,
		selectedSize: selectedSize.value
	});
}
</script>


