<template>
	<form @submit.prevent="submit" class="relative">
		<input
			v-model="q"
			@input="onInput"
			@focus="showSuggestions = true"
			@blur="closeSuggestions"
			type="search"
			placeholder="Tìm kiếm sản phẩm..."
			class="w-full rounded-md border-gray-300 pl-10 shadow-sm focus:border-gray-900 focus:ring-gray-900 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
		/>
		<span class="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔎</span>

		<!-- Suggestions dropdown -->
		<transition name="fade">
			<div
				v-if="showSuggestions && filteredSuggestions.length > 0"
				class="absolute left-0 right-0 top-full z-50 mt-1 max-h-80 overflow-y-auto rounded-md border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800"
			>
				<div v-for="(product, index) in filteredSuggestions" :key="product.id" class="border-b border-gray-100 last:border-b-0 dark:border-gray-700">
					<button
						type="button"
						@click="selectSuggestion(product)"
						@mousedown.prevent
						class="group flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-gray-100 dark:hover:bg-gray-700"
					>
						<div class="h-10 w-10 overflow-hidden rounded bg-gray-100">
                            <!-- CẬP NHẬT: Dùng hàm lấy ảnh thật -->
							<img :src="getProductImage(product)" :alt="product.name" class="h-10 w-10 object-cover transition-transform duration-200 transform group-hover:scale-110" />
						</div>
						<div class="flex-1">
                            <!-- CẬP NHẬT: Dùng product.name thay vì title -->
							<p class="text-sm font-medium text-gray-900 dark:text-gray-100">{{ product.name }}</p>
                            <!-- CẬP NHẬT: Format tiền Việt -->
							<p class="text-xs text-red-600 font-bold dark:text-red-400">{{ formatPrice(product.price) }}</p>
						</div>
						<span class="text-xs text-gray-400">→</span>
					</button>
				</div>

				<!-- Show all results option -->
				<button
					type="button"
					@click="submit"
					@mousedown.prevent
					v-if="filteredSuggestions.length > 0"
					class="w-full bg-gray-50 px-4 py-2 text-center text-sm font-medium text-gray-700 hover:bg-gray-100 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
				>
					Xem tất cả kết quả ({{ filteredSuggestions.length }})
				</button>
			</div>
		</transition>
	</form>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useProductsStore } from '../../stores/products'; 
import { useRouter } from 'vue-router';

const productsStore = useProductsStore();
const router = useRouter();
const q = ref('');
const showSuggestions = ref(false);
const emit = defineEmits(['search']);

// CẬP NHẬT: Logic lấy ảnh an toàn
const getProductImage = (p) => {
    if (p.images && p.images.length > 0) {
        const primary = p.images.find(img => img.is_primary);
        return primary ? primary.image_url : p.images[0].image_url;
    }
    return 'https://via.placeholder.com/100?text=No+Img';
};

// CẬP NHẬT: Logic format tiền tệ
const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
};

onMounted(async () => {
    // CẬP NHẬT: Dùng products.length và fetchProducts
	if (productsStore.products.length === 0) {
		await productsStore.fetchProducts({ limit: 100 });
	}
});

const filteredSuggestions = computed(() => {
	if (!q.value?.trim()) return [];
	
	const query = q.value.trim().toLowerCase();
    // CẬP NHẬT: Lấy từ productsStore.products
	const items = productsStore.products || [];
	
	// Filter và sort
	const filtered = items.filter(product => {
        // CẬP NHẬT: Tìm theo name và sku
		const name = product.name?.toLowerCase() || '';
		const sku = product.sku?.toLowerCase() || '';
		
		return name.includes(query) || sku.includes(query);
	});
	
	const sorted = filtered.sort((a, b) => {
		const aName = a.name?.toLowerCase() || '';
		const bName = b.name?.toLowerCase() || '';
		
		const aStartsWith = aName.startsWith(query) ? 0 : 1;
		const bStartsWith = bName.startsWith(query) ? 0 : 1;
		
		return aStartsWith - bStartsWith;
	});
	
	return sorted.slice(0, 8); // Limit 8 suggestions
});

function onInput() {
	showSuggestions.value = true;
}

function closeSuggestions() {
	setTimeout(() => {
		showSuggestions.value = false;
	}, 150);
}

function selectSuggestion(product) {
    // CẬP NHẬT: Dùng product.name
	q.value = product.name;
	showSuggestions.value = false;
    
    // Điều hướng thẳng đến trang chi tiết
    router.push(`/product/${product.id}`);
	emit('search', product.name);
}

function submit() {
	if (!q.value?.trim()) return;
	showSuggestions.value = false;
	emit('search', q.value.trim());
}
</script>

<style scoped>
.fade-enter-active, .fade-leave-active {
	transition: opacity 0.2s ease;
}

.fade-enter-from, .fade-leave-to {
	opacity: 0;
}
</style>