<template>
	<section>
		<div class="mb-6">
			<h1 class="text-2xl font-semibold">Giỏ hàng</h1>
			<p class="mt-1 text-sm text-gray-600 dark:text-gray-400">{{ items.length }} sản phẩm</p>
		</div>

		<div v-if="!items.length" class="rounded-lg border border-gray-200 p-12 text-center dark:border-gray-800">
			<p class="text-lg font-semibold text-gray-700 dark:text-gray-300">Giỏ hàng trống</p>
			<p class="mt-2 text-sm text-gray-600 dark:text-gray-400">Thêm sản phẩm để bắt đầu mua sắm</p>
			<RouterLink to="/products" class="mt-4 inline-block rounded bg-gray-900 px-6 py-2 text-white hover:bg-gray-800 dark:bg-gray-100 dark:text-black dark:hover:bg-gray-200">
				Tiếp tục mua sắm
			</RouterLink>
		</div>

		<div v-else class="grid gap-6 md:grid-cols-[1fr_320px]">
			<!-- Cart Items -->
			<ul class="space-y-3">
				<li 
					v-for="it in items" 
					:key="it.id" 
					class="group flex gap-4 rounded-lg border border-gray-200 p-4 transition-all hover:border-gray-300 dark:border-gray-800 dark:hover:border-gray-700"
				>
					<!-- Product Image -->
					<div class="relative shrink-0">
						<img :src="it.image" :alt="it.name" class="h-24 w-24 rounded-lg object-cover" />
					</div>

					<!-- Product Info -->
					<div class="flex flex-1 flex-col justify-between">
						<div>
							<p class="font-semibold text-gray-900 dark:text-gray-100">{{ it.name }}</p>
							<p class="mt-1 text-sm text-gray-600 dark:text-gray-400">{{ formatCurrency(it.price) }}</p>
							<p v-if="it.selectedColor || it.selectedSize" class="mt-2 text-xs text-gray-500">
								<span v-if="it.selectedColor" class="inline-flex items-center gap-1">
									Màu: 
									<span 
										class="h-3 w-3 rounded-full border border-gray-300"
										:style="{ backgroundColor: it.selectedColor }"
									/>
								</span>
								<span v-if="it.selectedSize" class="ml-3">Size: {{ it.selectedSize }}</span>
							</p>
						</div>

						<!-- Quantity & Remove -->
						<div class="flex items-center gap-3">
							<div class="flex items-center rounded border border-gray-300 dark:border-gray-700">
								<button 
									@click="updateQty(it.id, it.quantity - 1)"
									class="px-2 py-1 text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
									:disabled="it.quantity <= 1"
								>
									−
								</button>
								<input 
									type="number" 
									min="1" 
									class="w-12 border-0 bg-transparent text-center text-sm"
									:value="it.quantity" 
									@input="updateQty(it.id, $event.target.value)" 
								/>
								<button 
									@click="updateQty(it.id, it.quantity + 1)"
									class="px-2 py-1 text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
								>
									+
								</button>
							</div>

							<!-- Remove Button -->
							<button 
								@click="remove(it.id)"
								class="ml-auto rounded p-2 text-gray-400 transition-all hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-950/20 dark:hover:text-red-400"
								title="Xóa khỏi giỏ hàng"
							>
								<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
								</svg>
							</button>
						</div>
					</div>
				</li>
			</ul>

			<!-- Cart Summary -->
			<aside class="h-fit rounded-lg border border-gray-200 p-6 dark:border-gray-800">
				<h2 class="mb-4 font-semibold text-gray-900 dark:text-gray-100">Tạm tính</h2>
				
				<div class="mb-4 space-y-2 border-b pb-4 dark:border-gray-700">
					<div class="flex justify-between text-sm">
						<span class="text-gray-600 dark:text-gray-400">Tổng tiền:</span>
						<span class="font-medium">{{ formatCurrency(subtotal) }}</span>
					</div>
					<div class="flex justify-between text-sm">
						<span class="text-gray-600 dark:text-gray-400">Vận chuyển:</span>
						<span class="font-medium text-green-600">Miễn phí</span>
					</div>
				</div>

				<div class="mb-6 flex justify-between">
					<span class="font-semibold text-gray-900 dark:text-gray-100">Tổng cộng:</span>
					<span class="text-2xl font-bold text-gray-900 dark:text-gray-100">{{ formatCurrency(subtotal) }}</span>
				</div>

				<RouterLink 
					to="/checkout" 
					class="block rounded bg-gray-900 px-4 py-3 text-center font-semibold text-white hover:bg-gray-800 dark:bg-gray-100 dark:text-black dark:hover:bg-gray-200"
				>
					Thanh toán
				</RouterLink>

				<RouterLink 
					to="/products" 
					class="mt-3 block rounded border border-gray-300 px-4 py-2 text-center text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
				>
					Tiếp tục mua sắm
				</RouterLink>
			</aside>
		</div>
	</section>
</template>

<script setup>
import { computed } from 'vue';
import { useCartStore } from '../stores/cart';
import { RouterLink } from 'vue-router';
import { formatCurrency } from '../utils/helpers';

const cart = useCartStore();
const items = computed(() => cart.items);
const subtotal = computed(() => cart.subtotal);

function updateQty(id, q) {
	const num = Number(q || 1);
	if (num > 0) {
		cart.updateQuantity(id, num);
	}
}

function remove(id) {
	cart.removeItem(id);
}
</script>


