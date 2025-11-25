<template>
	<section>
		<div class="mb-8">
			<h1 class="text-2xl font-semibold">Thanh toán</h1>
		</div>

		<!-- Step Indicator -->
		<div class="mb-8 flex justify-between">
			<div 
				v-for="step in [1, 2, 3, 4]" 
				:key="step"
				class="flex flex-1 items-center"
			>
				<!-- Step Circle -->
				<div 
					:class="{
						'bg-gray-900 text-white dark:bg-gray-100 dark:text-black': checkout.currentStep >= step,
						'bg-gray-200 text-gray-700 dark:bg-gray-800 dark:text-gray-400': checkout.currentStep < step
					}"
					class="flex h-10 w-10 items-center justify-center rounded-full font-semibold transition-all"
				>
					{{ step }}
				</div>

				<!-- Step Line -->
				<div 
					v-if="step < 4"
					:class="{
						'bg-gray-900 dark:bg-gray-100': checkout.currentStep > step,
						'bg-gray-200 dark:bg-gray-800': checkout.currentStep <= step
					}"
					class="mx-2 flex-1 h-1 transition-all"
				/>
			</div>
		</div>

		<!-- Step Labels -->
		<div class="mb-8 flex justify-between text-center text-sm font-medium">
			<span :class="{ 'text-gray-900 dark:text-gray-100': checkout.currentStep >= 1, 'text-gray-500': checkout.currentStep < 1 }">
				Xem lại
			</span>
			<span :class="{ 'text-gray-900 dark:text-gray-100': checkout.currentStep >= 2, 'text-gray-500': checkout.currentStep < 2 }">
				Giao hàng
			</span>
			<span :class="{ 'text-gray-900 dark:text-gray-100': checkout.currentStep >= 3, 'text-gray-500': checkout.currentStep < 3 }">
				Thanh toán
			</span>
			<span :class="{ 'text-gray-900 dark:text-gray-100': checkout.currentStep >= 4, 'text-gray-500': checkout.currentStep < 4 }">
				Hoàn tất
			</span>
		</div>

		<!-- Step 4: Order Complete - Full Width -->
		<div v-if="checkout.currentStep === 4" class="space-y-6">
			<div class="text-center py-8 rounded-lg border-2 border-green-500 bg-green-50 dark:bg-green-950/20 dark:border-green-600">
				<svg class="h-16 w-16 text-green-500 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke-width="2"/><path stroke-width="2" d="M8 12l2 2 4-4"/></svg>
				<h2 class="text-3xl font-bold text-green-700 dark:text-green-400 mb-2">Đặt hàng thành công!</h2>
				<p class="text-gray-700 dark:text-gray-300">Cảm ơn bạn đã tin tưởng chúng tôi. Đơn hàng của bạn đã được ghi nhận.</p>
			</div>

			<!-- Order Details -->
			<div class="rounded-lg border p-6 dark:border-gray-800 space-y-4">
				<h3 class="text-lg font-bold mb-4">Chi tiết đơn hàng</h3>
				
				<!-- Products -->
				<div class="border-b pb-4 dark:border-gray-700">
					<h4 class="font-semibold text-gray-900 dark:text-gray-100 mb-3">Sản phẩm đã đặt</h4>
					<div class="space-y-3">
						<div v-for="item in cartItems" :key="item.id" class="flex justify-between items-start p-3 bg-gray-50 dark:bg-gray-900 rounded">
							<div class="flex gap-3 flex-1">
								<img :src="item.image" :alt="item.name" class="h-16 w-16 rounded object-cover" />
								<div>
									<p class="font-semibold text-gray-900 dark:text-gray-100">{{ item.name }}</p>
									<p class="text-sm text-gray-600 dark:text-gray-400">Số lượng: {{ item.quantity }}</p>
									<p v-if="item.selectedColor || item.selectedSize" class="text-xs text-gray-500 dark:text-gray-500 mt-1">
										<span v-if="item.selectedColor">Màu: {{ item.selectedColor }}</span>
										<span v-if="item.selectedSize" class="ml-2">Size: {{ item.selectedSize }}</span>
									</p>
								</div>
							</div>
							<p class="font-semibold text-gray-900 dark:text-gray-100 whitespace-nowrap ml-4">{{ formatCurrency(item.price * item.quantity) }}</p>
						</div>
					</div>
				</div>

				<!-- Price Summary -->
				<div class="border-b pb-4 dark:border-gray-700 space-y-2">
					<div class="flex justify-between">
						<span class="text-gray-700 dark:text-gray-300">Tổng tiền hàng:</span>
						<span class="font-semibold text-gray-900 dark:text-gray-100">{{ formatCurrency(cart.subtotal) }}</span>
					</div>
					<div class="flex justify-between">
						<span class="text-gray-700 dark:text-gray-300">Phí vận chuyển:</span>
						<span class="font-semibold text-green-600">Miễn phí</span>
					</div>
					<div class="flex justify-between text-lg border-t pt-2 dark:border-gray-700">
						<span class="font-bold text-gray-900 dark:text-gray-100">Tổng cộng:</span>
						<span class="font-bold text-2xl text-green-600 dark:text-green-400">{{ formatCurrency(cart.subtotal) }}</span>
					</div>
				</div>

				<!-- Shipping Address -->
				<div class="border-b pb-4 dark:border-gray-700">
					<h4 class="font-semibold text-gray-900 dark:text-gray-100 mb-3">Địa chỉ giao hàng</h4>
					<div class="bg-gray-50 dark:bg-gray-900 p-4 rounded space-y-2">
						<p><strong>Họ và tên:</strong> {{ checkout.shippingInfo.fullName }}</p>
						<p><strong>Email:</strong> {{ checkout.shippingInfo.email }}</p>
						<p><strong>Số điện thoại:</strong> {{ checkout.shippingInfo.phone }}</p>
						<p><strong>Địa chỉ:</strong> {{ checkout.shippingInfo.address }}</p>
						<p><strong>Phường/Xã:</strong> {{ checkout.shippingInfo.ward }}</p>
						<p><strong>Quận/Huyện:</strong> {{ checkout.shippingInfo.district }}</p>
						<p><strong>Tỉnh/Thành phố:</strong> {{ checkout.shippingInfo.province }}</p>
						<p v-if="checkout.shippingInfo.note"><strong>Ghi chú:</strong> {{ checkout.shippingInfo.note }}</p>
					</div>
				</div>

				<!-- Payment Method -->
				<div class="pb-4">
					<h4 class="font-semibold text-gray-900 dark:text-gray-100 mb-3">Thông tin thanh toán</h4>
					<div class="bg-gray-50 dark:bg-gray-900 p-4 rounded space-y-2">
						<p><strong>Phương thức thanh toán:</strong> {{ paymentMethods.find(m => m.value === checkout.paymentMethod)?.label }}</p>
						<p><strong>Trạng thái:</strong> <span class="text-green-600 font-semibold">Đã thanh toán</span></p>
						<p><strong>Thời gian thanh toán:</strong> {{ new Date().toLocaleString('vi-VN') }}</p>
					</div>
				</div>
			</div>

			<!-- Action Buttons -->
			<div class="flex gap-3 pt-4">
				<RouterLink to="/orders" class="flex-1 rounded-lg bg-blue-600 px-4 py-3 text-center font-semibold text-white hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800">
					Xem lịch sử đơn hàng
				</RouterLink>
				<RouterLink to="/" class="flex-1 rounded-lg bg-gray-900 px-4 py-3 text-center font-semibold text-white hover:bg-gray-800 dark:bg-gray-100 dark:text-black dark:hover:bg-gray-200">
					Tiếp tục mua sắm
				</RouterLink>
			</div>
		</div>

		<!-- Content Grid (Steps 1-3) -->
		<div v-else class="grid gap-6 md:grid-cols-[1fr_360px]">
			<!-- Main Content -->
			<div>
				<!-- Step 1: Review Order -->
				<div v-if="checkout.currentStep === 1" class="space-y-4">
					<h2 class="mb-4 text-lg font-semibold">Xem lại đơn hàng</h2>
					<div v-if="!cartItems.length" class="rounded-lg border p-8 text-center dark:border-gray-800">
						<p class="text-gray-600 dark:text-gray-400">Giỏ hàng trống</p>
						<RouterLink to="/products" class="mt-3 inline-block text-blue-600 hover:underline">
							Tiếp tục mua sắm
						</RouterLink>
					</div>

					<div v-else class="space-y-3">
						<div 
							v-for="item in cartItems" 
							:key="item.id"
							class="flex gap-4 rounded-lg border p-4 dark:border-gray-800"
						>
							<img :src="item.image" :alt="item.name" class="h-20 w-20 rounded object-cover" />
							<div class="flex-1">
								<p class="font-semibold">{{ item.name }}</p>
								<p class="mt-1 text-sm text-gray-600 dark:text-gray-400">
									{{ item.quantity }} × {{ formatCurrency(item.price) }} = {{ formatCurrency(item.price * item.quantity) }}
								</p>
							</div>
						</div>
					</div>

					<div class="pt-4">
						<button 
							@click="checkout.nextStep"
							class="w-full rounded-lg bg-gray-900 px-4 py-3 font-semibold text-white hover:bg-gray-800 dark:bg-gray-100 dark:text-black dark:hover:bg-gray-200"
						>
							Tiếp tục
						</button>
					</div>
				</div>

				<!-- Step 2: Shipping Information -->
				<div v-if="checkout.currentStep === 2" class="space-y-4">
					<h2 class="mb-4 text-lg font-semibold">Thông tin giao hàng</h2>
					<form @submit.prevent="proceedToPayment" class="space-y-4">
						<!-- Full Name -->
						<div>
							<label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Họ và tên *</label>
							<input 
								v-model="checkout.shippingInfo.fullName"
								type="text"
								class="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 dark:border-gray-700 dark:bg-gray-900"
								placeholder="Nhập họ và tên"
								required
							/>
							<p v-if="errors.fullName" class="mt-1 text-xs text-red-600">{{ errors.fullName }}</p>
						</div>

						<!-- Email -->
						<div>
							<label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Email *</label>
							<input 
								v-model="checkout.shippingInfo.email"
								type="email"
								class="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 dark:border-gray-700 dark:bg-gray-900"
								placeholder="Nhập email"
								required
							/>
							<p v-if="errors.email" class="mt-1 text-xs text-red-600">{{ errors.email }}</p>
						</div>

						<!-- Phone -->
						<div>
							<label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Số điện thoại *</label>
							<input 
								v-model="checkout.shippingInfo.phone"
								type="tel"
								class="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 dark:border-gray-700 dark:bg-gray-900"
								placeholder="Nhập số điện thoại"
								required
							/>
							<p v-if="errors.phone" class="mt-1 text-xs text-red-600">{{ errors.phone }}</p>
						</div>

						<!-- Address -->
						<div>
							<label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Địa chỉ *</label>
							<input 
								v-model="checkout.shippingInfo.address"
								type="text"
								class="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 dark:border-gray-700 dark:bg-gray-900"
								placeholder="Nhập địa chỉ (số nhà, tên đường)"
								required
							/>
							<p v-if="errors.address" class="mt-1 text-xs text-red-600">{{ errors.address }}</p>
						</div>

						<!-- Ward -->
						<div>
							<label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Phường/Xã *</label>
							<input 
								v-model="checkout.shippingInfo.ward"
								type="text"
								class="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 dark:border-gray-700 dark:bg-gray-900"
								placeholder="Nhập phường/xã"
								required
							/>
							<p v-if="errors.ward" class="mt-1 text-xs text-red-600">{{ errors.ward }}</p>
						</div>

						<!-- District -->
						<div>
							<label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Quận/Huyện *</label>
							<input 
								v-model="checkout.shippingInfo.district"
								type="text"
								class="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 dark:border-gray-700 dark:bg-gray-900"
								placeholder="Nhập quận/huyện"
								required
							/>
							<p v-if="errors.district" class="mt-1 text-xs text-red-600">{{ errors.district }}</p>
						</div>

						<!-- Province -->
						<div>
							<label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Tỉnh/Thành phố *</label>
							<input 
								v-model="checkout.shippingInfo.province"
								type="text"
								class="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 dark:border-gray-700 dark:bg-gray-900"
								placeholder="Nhập tỉnh/thành phố"
								required
							/>
							<p v-if="errors.province" class="mt-1 text-xs text-red-600">{{ errors.province }}</p>
						</div>

						<!-- Note (Optional) -->
						<div>
							<label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Ghi chú (Tùy chọn)</label>
							<textarea 
								v-model="checkout.shippingInfo.note"
								class="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 dark:border-gray-700 dark:bg-gray-900"
								placeholder="Ghi chú về đơn hàng..."
								rows="3"
							></textarea>
						</div>

						<!-- Payment Method Selection -->
						<div>
							<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Phương thức thanh toán *</label>
							<div class="space-y-3">
								<label 
									v-for="method in paymentMethods"
									:key="method.value"
									class="flex items-center gap-4 rounded-lg border p-4 cursor-pointer transition-all dark:border-gray-800"
									:class="{
										'border-gray-900 bg-gray-50 dark:border-gray-100 dark:bg-gray-900/50': checkout.paymentMethod === method.value,
										'border-gray-300 hover:border-gray-400 dark:border-gray-700 dark:hover:border-gray-600': checkout.paymentMethod !== method.value
									}"
								>
									<input 
										type="radio"
										:value="method.value"
										:checked="checkout.paymentMethod === method.value"
										@change="checkout.setPaymentMethod(method.value)"
										class="h-4 w-4"
									/>
									<div>
										<p class="font-semibold">{{ method.label }}</p>
										<p class="text-sm text-gray-600 dark:text-gray-400">{{ method.description }}</p>
									</div>
								</label>
							</div>
							<p v-if="errors.paymentMethod" class="mt-1 text-xs text-red-600">{{ errors.paymentMethod }}</p>
						</div>

						<!-- Validation Error Message -->
						<div v-if="validationError" class="rounded-lg bg-red-50 p-4 text-sm text-red-700 dark:bg-red-950/20 dark:text-red-400">
							{{ validationError }}
						</div>

						<!-- Buttons -->
						<div class="flex gap-3 pt-4">
							<button 
								type="button"
								@click="checkout.previousStep"
								class="flex-1 rounded-lg border border-gray-300 px-4 py-3 font-semibold text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
							>
								Quay lại
							</button>
							<button 
								type="submit"
								class="flex-1 rounded-lg bg-gray-900 px-4 py-3 font-semibold text-white hover:bg-gray-800 dark:bg-gray-100 dark:text-black dark:hover:bg-gray-200"
							>
								Tiếp tục thanh toán
							</button>
						</div>
					</form>
				</div>

				<!-- Step 3: Payment -->
				<div v-if="checkout.currentStep === 3" class="space-y-4">
					<h2 class="mb-4 text-lg font-semibold">Xác nhận đơn hàng</h2>

					<!-- Order Info -->
					<div class="rounded-lg border p-4 dark:border-gray-800">
						<h3 class="font-semibold mb-2">Thông tin sản phẩm</h3>
						<ul class="space-y-2">
							<li v-for="item in cartItems" :key="item.id" class="flex justify-between text-sm">
								<span>{{ item.name }} x{{ item.quantity }}</span>
								<span>{{ formatCurrency(item.price * item.quantity) }}</span>
							</li>
						</ul>
						<div class="mt-2 flex justify-between font-semibold">
							<span>Tổng cộng:</span>
							<span>{{ formatCurrency(cart.subtotal) }}</span>
						</div>
					</div>

					<!-- Shipping Info -->
					<div class="rounded-lg border p-4 dark:border-gray-800 mt-4">
						<h3 class="font-semibold mb-2">Địa chỉ giao hàng</h3>
						<ul class="text-sm space-y-1">
							<li><strong>Họ và tên:</strong> {{ checkout.shippingInfo.fullName }}</li>
							<li><strong>Email:</strong> {{ checkout.shippingInfo.email }}</li>
							<li><strong>Số điện thoại:</strong> {{ checkout.shippingInfo.phone }}</li>
							<li><strong>Địa chỉ:</strong> {{ checkout.shippingInfo.address }}</li>
							<li><strong>Phường/Xã:</strong> {{ checkout.shippingInfo.ward }}</li>
							<li><strong>Quận/Huyện:</strong> {{ checkout.shippingInfo.district }}</li>
							<li><strong>Tỉnh/Thành phố:</strong> {{ checkout.shippingInfo.province }}</li>
							<li v-if="checkout.shippingInfo.note"><strong>Ghi chú:</strong> {{ checkout.shippingInfo.note }}</li>
							<li><strong>Phương thức thanh toán:</strong> {{ paymentMethods.find(m => m.value === checkout.paymentMethod)?.label }}</li>
						</ul>
					</div>

					<!-- Momo QR Payment -->
					<div v-if="checkout.paymentMethod === 'momo'" class="rounded-lg border p-4 dark:border-gray-800 mt-4 flex flex-col items-center">
						<h3 class="font-semibold mb-2 text-center">Quét mã QR Momo để thanh toán</h3>
						<img :src="momoQrUrl" alt="QR Momo" class="w-48 h-48 mb-2" />
						<p class="text-sm text-gray-600 dark:text-gray-400 text-center">Vui lòng quét mã QR bằng ứng dụng Momo để thanh toán số tiền <span class="font-bold">{{ formatCurrency(cart.subtotal) }}</span></p>
						<div class="flex gap-3 w-full pt-4">
							<button 
								@click="checkout.previousStep"
								class="flex-1 rounded-lg border border-gray-300 px-4 py-3 font-semibold text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
							>
								Quay lại
							</button>
							<button 
								@click="completeOrder"
								class="flex-1 rounded-lg bg-green-600 px-4 py-3 font-semibold text-white hover:bg-green-700"
							>
								Xác nhận đã thanh toán
							</button>
						</div>
					</div>

					<!-- COD Button -->
					<div v-else class="flex gap-3 pt-4">
						<button 
							@click="checkout.previousStep"
							class="flex-1 rounded-lg border border-gray-300 px-4 py-3 font-semibold text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
						>
							Quay lại
						</button>
						<button 
							@click="completeOrder"
							class="flex-1 rounded-lg bg-green-600 px-4 py-3 font-semibold text-white hover:bg-green-700"
						>
							Xác nhận thanh toán
						</button>
					</div>
				</div>
			</div>

			<!-- Order Summary Sidebar -->
			<aside class="h-fit rounded-lg border border-gray-200 p-6 dark:border-gray-800">
				<h2 class="mb-4 text-lg font-semibold">Tóm tắt đơn hàng</h2>

				<div class="mb-4 space-y-2 border-b pb-4 dark:border-gray-700">
					<div class="flex justify-between text-sm">
						<span class="text-gray-600 dark:text-gray-400">Số lượng:</span>
						<span class="font-medium">{{ cart.itemCount }} sản phẩm</span>
					</div>
					<div class="flex justify-between text-sm">
						<span class="text-gray-600 dark:text-gray-400">Tổng tiền hàng:</span>
						<span class="font-medium">{{ formatCurrency(cart.subtotal) }}</span>
					</div>
					<div class="flex justify-between text-sm">
						<span class="text-gray-600 dark:text-gray-400">Vận chuyển:</span>
						<span class="font-medium text-green-600">Miễn phí</span>
					</div>
				</div>

				<div class="mb-6 flex justify-between">
					<span class="font-semibold">Tổng cộng:</span>
					<span class="text-2xl font-bold">{{ formatCurrency(cart.subtotal) }}</span>
				</div>

				<!-- Current Step Info -->
				<div class="rounded-lg bg-blue-50 p-3 text-sm text-blue-700 dark:bg-blue-950/20 dark:text-blue-400">
					<p class="font-semibold">
						Bước {{ checkout.currentStep }}/4:
						<span v-if="checkout.currentStep === 1">Xem lại đơn hàng</span>
						<span v-else-if="checkout.currentStep === 2">Nhập thông tin giao hàng</span>
						<span v-else>Xác nhận đơn hàng</span>
					</p>
				</div>
			</aside>
		</div>
	</section>
</template>

<script setup>
import { ref, computed, reactive, onMounted } from 'vue';
import { useRouter, RouterLink } from 'vue-router';
import { useCartStore } from '../stores/cart';
import { useCheckoutStore } from '../stores/checkout';
import { useUIStore } from '../stores/ui';
import { useOrderStore } from '../stores/order';
import { formatCurrency } from '../utils/helpers';

const router = useRouter();
const cart = useCartStore();
const checkout = useCheckoutStore();
const ui = useUIStore();
const orderStore = useOrderStore();

// Ensure checkout always starts at step 1 when entering the page
onMounted(() => {
	checkout.currentStep = 1;
});

const cartItems = computed(() => cart.items);
const validationError = ref('');

const paymentMethods = [
	{
		value: 'cod',
		label: 'Thanh toán khi nhận hàng (COD)',
		description: 'Thanh toán trực tiếp cho nhân viên giao hàng'
	},
	{
		value: 'momo',
		label: 'Thanh toán Momo',
		description: 'Thanh toán qua ứng dụng Momo'
	}
];

const errors = reactive({
	fullName: '',
	email: '',
	phone: '',
	address: '',
	ward: '',
	district: '',
	province: '',
	paymentMethod: ''
});

const momoQrUrl = computed(() => {
	const amount = cart.subtotal;
	const info = checkout.shippingInfo;
	const content = `Thanh toan don hang ${amount} cho ${info.fullName}`;
	return `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(content)}`;
});

function validateEmail(email) {
	const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	return re.test(email);
}

function validatePhone(phone) {
	const re = /^[0-9]{10,11}$/;
	return re.test(phone.replace(/\s/g, ''));
}

function validateShippingInfo() {
	validationError.value = '';
	Object.keys(errors).forEach(key => (errors[key] = ''));

	const info = checkout.shippingInfo;
	let isValid = true;

	if (!info.fullName.trim()) {
		errors.fullName = 'Vui lòng nhập họ và tên';
		isValid = false;
	}

	if (!info.email.trim()) {
		errors.email = 'Vui lòng nhập email';
		isValid = false;
	} else if (!validateEmail(info.email)) {
		errors.email = 'Email không hợp lệ';
		isValid = false;
	}

	if (!info.phone.trim()) {
		errors.phone = 'Vui lòng nhập số điện thoại';
		isValid = false;
	} else if (!validatePhone(info.phone)) {
		errors.phone = 'Số điện thoại không hợp lệ (10-11 chữ số)';
		isValid = false;
	}

	if (!info.address.trim()) {
		errors.address = 'Vui lòng nhập địa chỉ';
		isValid = false;
	}

	if (!info.ward.trim()) {
		errors.ward = 'Vui lòng nhập phường/xã';
		isValid = false;
	}

	if (!info.district.trim()) {
		errors.district = 'Vui lòng nhập quận/huyện';
		isValid = false;
	}

	if (!info.province.trim()) {
		errors.province = 'Vui lòng nhập tỉnh/thành phố';
		isValid = false;
	}

	if (!checkout.paymentMethod) {
		errors.paymentMethod = 'Vui lòng chọn phương thức thanh toán';
		isValid = false;
	}

	if (!isValid) {
		validationError.value = 'Vui lòng điền đầy đủ tất cả các trường bắt buộc';
		return false;
	}

	return true;
}

function proceedToPayment() {
	if (validateShippingInfo()) {
		checkout.nextStep();
		validationError.value = '';
	}
}

function completeOrder() {
	// Prepare order data
	const orderData = {
		items: cartItems.value.map(item => ({
			id: item.id,
			name: item.name,
			price: item.price,
			image: item.image,
			quantity: item.quantity,
			color: item.selectedColor || '',
			size: item.selectedSize || '',
			sku: item.sku || ''
		})),
		shippingInfo: checkout.shippingInfo,
		paymentMethod: checkout.paymentMethod,
		subtotal: cart.subtotal
	};

	// Save order to store
	orderStore.addOrder(orderData);

	// Clear cart
	if (typeof cart.clear === 'function') {
		cart.clear();
	} else if (typeof cart.reset === 'function') {
		cart.reset();
	} else {
		// fallback: directly set items empty
		cart.items = [];
	}

	// Move to step 4
	checkout.currentStep = 4;

	// Show success message
	ui.pushToast({ type: 'success', message: 'Đặt hàng thành công!' });
}
</script>
