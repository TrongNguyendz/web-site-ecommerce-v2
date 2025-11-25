<template>
	<section class="mx-auto max-w-md">
		<div class="mb-6 flex items-center justify-between">
			<h1 class="text-xl font-semibold">{{ isLogin ? 'Đăng nhập' : 'Đăng ký' }}</h1>
			<button
				@click="toggleMode"
				class="rounded bg-gray-200 px-4 py-2 text-sm font-medium text-gray-800 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
			>
				{{ isLogin ? 'Tạo tài khoản' : 'Đăng nhập' }}
			</button>
		</div>

		<!-- Login Form -->
		<form v-if="isLogin" class="space-y-3 rounded-lg border p-6 dark:border-gray-800" @submit.prevent="login">
			<h2 class="mb-4 text-lg font-semibold">Đăng nhập vào tài khoản của bạn</h2>
			<InputField v-model="loginForm.username" label="Tên đăng nhập" type="text" required />
			<InputField v-model="loginForm.password" label="Mật khẩu" type="password" required />
			<button type="submit" class="w-full rounded bg-gray-900 px-3 py-2 text-white hover:bg-gray-800 dark:bg-gray-100 dark:text-black dark:hover:bg-gray-200">
				Đăng nhập
			</button>
		</form>

		<!-- Register Form -->
		<form v-else class="space-y-3 rounded-lg border p-6 dark:border-gray-800" @submit.prevent="register">
			<h2 class="mb-4 text-lg font-semibold">Tạo tài khoản mới</h2>
			<InputField v-model="registerForm.fullName" label="Tên đầy đủ" type="text" required />
			<InputField v-model="registerForm.username" label="Tên đăng nhập" type="text" required />
			<InputField v-model="registerForm.email" label="Email" type="email" required />
			<InputField v-model="registerForm.phone" label="Số điện thoại" type="tel" required />
			<InputField v-model="registerForm.address" label="Địa chỉ" type="text" required />
			<InputField v-model="registerForm.password" label="Mật khẩu" type="password" required />
			<InputField v-model="registerForm.confirm" label="Xác nhận mật khẩu" type="password" required />
			<button type="submit" class="w-full rounded bg-gray-900 px-3 py-2 text-white hover:bg-gray-800 dark:bg-gray-100 dark:text-black dark:hover:bg-gray-200">
				Tạo tài khoản
			</button>
		</form>
	</section>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useUserStore } from '../stores/user';
import { useUIStore } from '../stores/ui';
import InputField from '../components/forms/InputField.vue';

const route = useRoute();
const router = useRouter();
const user = useUserStore();
const ui = useUIStore();

const isLogin = ref(true);
const loginForm = reactive({ username: '', password: '' });
const registerForm = reactive({ 
	fullName: '', 
	username: '', 
	email: '', 
	phone: '',
	address: '',
	password: '', 
	confirm: '' 
});

function toggleMode() {
	isLogin.value = !isLogin.value;
}

async function login() {
	// Demo login
	// Check if username is admin username
	const isAdmin = loginForm.username === 'admin';
	user.login({
		token: 'demo-token',
		profile: { id: 1, name: isAdmin ? 'Admin' : 'Demo User', username: loginForm.username },
		role: isAdmin ? 'admin' : 'user'
	});
	ui.pushToast({ type: 'success', message: 'Đăng nhập thành công' });
	// Redirect to admin welcome if admin, otherwise use redirect query or home
	if (isAdmin) {
		router.replace('/admin/welcome');
	} else {
		const redirect = route.query.redirect || '/';
		router.replace(String(redirect));
	}
}

async function register() {
	if (registerForm.password !== registerForm.confirm) {
		ui.pushToast({ type: 'error', message: 'Mật khẩu không khớp' });
		return;
	}
	// Check if username is admin username
	const isAdmin = registerForm.username === 'admin';
	user.login({
		token: 'demo-token',
		profile: { 
			id: 2, 
			name: registerForm.fullName, 
			username: registerForm.username, 
			email: registerForm.email,
			phone: registerForm.phone,
			address: registerForm.address
		},
		role: isAdmin ? 'admin' : 'user'
	});
	ui.pushToast({ type: 'success', message: 'Tạo tài khoản thành công' });
	// Redirect to admin welcome if admin, otherwise go home
	if (isAdmin) {
		router.replace('/admin/welcome');
	} else {
		router.replace('/');
	}
}
</script>


