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
		<form v-if="isLogin" class="space-y-3 rounded-lg border p-6 dark:border-gray-800" @submit.prevent="handleLogin">
			<h2 class="mb-4 text-lg font-semibold">Đăng nhập vào tài khoản của bạn</h2>
			<InputField v-model="loginForm.username" label="Email đăng nhập" type="text" required />
			<InputField v-model="loginForm.password" label="Mật khẩu" type="password" required />
			<button type="submit" class="w-full rounded bg-gray-900 px-3 py-2 text-white hover:bg-gray-800 dark:bg-gray-100 dark:text-black dark:hover:bg-gray-200">
				Đăng nhập
			</button>
		</form>

		<!-- Register Form -->
		<form v-else class="space-y-3 rounded-lg border p-6 dark:border-gray-800" @submit.prevent="handleRegister">
			<h2 class="mb-4 text-lg font-semibold">Tạo tài khoản mới</h2>
			<InputField v-model="registerForm.fullName" label="Tên đầy đủ" type="text" required />
			<InputField v-model="registerForm.username" label="Tên đăng nhập" type="text" required />
			<InputField v-model="registerForm.email" label="Email" type="email" required />
			<InputField v-model="registerForm.phone" label="Số điện thoại" type="tel" required />
			<!-- <InputField v-model="registerForm.address" label="Địa chỉ" type="text" required /> -->
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
import { Login, Register } from '../utils/user_service_api';

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
	// address: '',
	password: '', 
    avatar_url: 'heheheh',
	role: 'customer',
	status : 'active'
});

function toggleMode() {
	isLogin.value = !isLogin.value;
}

// async function logins() {
// 	// Demo login
// 	// Check if username is admin username
// 	const isAdmin = loginForm.username === 'admin';
// 	user.login({
// 		token: 'demo-token',
// 		profile: { id: 1, name: isAdmin ? 'Admin' : 'Demo User', username: loginForm.username },
// 		role: isAdmin ? 'admin' : 'user'
// 	});
// 	ui.pushToast({ type: 'success', message: 'Đăng nhập thành công' });
// 	// Redirect to admin welcome if admin, otherwise use redirect query or home
// 	if (isAdmin) {
// 		router.replace('/admin/welcome');
// 	} else {
// 		const redirect = route.query.redirect || '/';
// 		router.replace(String(redirect));
// 	}
// }

const handleLogin = async () => {
    // Xóa form lỗi cũ nếu có
    loginForm.username = loginForm.username.trim();

    if (!loginForm.username || !loginForm.password) {
        ui.pushToast({ type: 'error', message: 'Vui lòng nhập đầy đủ thông tin' });
        return;
    }

    try {
        const res = await Login({
            // Backend của bạn nhận "email" hay "username"?
            // Nhìn token thì thấy có email, nhưng username cũng được lưu → chắc chắn backend chấp nhận cả 2
            // Nhưng để an toàn, mình gửi cả 2 trường (backend sẽ lấy cái nào nó cần)
            username: loginForm.username,
            email: loginForm.username,     // nhiều backend cho login bằng email hoặc username
            password: loginForm.password,
        });

        // Axios luôn vào đây nếu server trả 2xx
        const result = res.data;

        if (result.success) {
            // Lưu thông tin user vào Pinia store
            user.login({
                token: result.data.token,
                profile: {
                    id: result.data.user.id,
                    username: result.data.user.username,
                    email: result.data.user.email,
                    fullname: result.data.user.full_name,
                    phone: result.data.user.phone,
                    avatar_url: result.data.user.avatar_url,
                    role: result.data.user.role,
                },
                role: result.data.user.role  // "customer" hoặc "admin"
            });

            // Thông báo thành công
            ui.pushToast({ type: 'success', message: result.message || 'Đăng nhập thành công!' });

            // Xóa form
            loginForm.username = '';
            loginForm.password = '';

            // Chuyển hướng

            const redirect = route.query.redirect || '/';
            
            if (result.data.user.role === 'admin') {
                router.replace('/admin/welcome');
            } else {
                router.replace(redirect);
            }

        } else {
            ui.pushToast({ type: 'error', message: result.message || 'Đăng nhập thất bại' });
        }

    } catch (err) {
        console.error('Login error:', err);

        let errorMsg = 'Lỗi kết nối đến server';

        if (err.response?.data?.message) {
            errorMsg = err.response.data.message;
        } else if (err.response?.status === 401) {
            errorMsg = 'Tài khoản hoặc mật khẩu không đúng';
        } else if (err.response?.status === 400) {
            errorMsg = 'Dữ liệu gửi lên không hợp lệ';
        }

        ui.pushToast({ type: 'error', message: errorMsg });
    }
};

const handleRegister = async () => {
    // Trim các trường có thật
    registerForm.username = registerForm.username.trim();
    registerForm.email = registerForm.email.trim();
    registerForm.phone = registerForm.phone.trim();
    registerForm.fullName = registerForm.fullName.trim();

    // BỎ ĐOẠN KIỂM TRA VÀ TRIM address NẾU KHÔNG DÙNG NỮA
    if (!registerForm.fullName || !registerForm.username || !registerForm.email ||
        !registerForm.phone || !registerForm.password || !registerForm.confirm) {
        ui.pushToast({ type: 'error', message: 'Vui lòng nhập đầy đủ thông tin' });
        return;
    }

    if (registerForm.password !== registerForm.confirm) {
        ui.pushToast({ type: 'error', message: 'Mật khẩu xác nhận không khớp' });
        return;
    }

    if (registerForm.password.length < 6) {
        ui.pushToast({ type: 'error', message: 'Mật khẩu phải từ 6 ký tự trở lên' });
        return;
    }

    try {
        const res = await Register({
            username: registerForm.username,
            email: registerForm.email,
            password: registerForm.password,
            full_name: registerForm.fullName,
            phone: registerForm.phone,
            role: ""
        });

        const result = res.data;

        if (result.success) {
            ui.pushToast({ type: 'success', message: 'Đăng ký thành công!' });

            // TỰ ĐỘNG ĐĂNG NHẬP SAU KHI ĐĂNG KÝ (gợi ý cực mạnh)
            user.login({
                token: result.data.token,
                profile: {
                    id: result.data.user.id,
                    username: result.data.user.username,
                    email: result.data.user.email,
                    name: result.data.user.full_name,
                    phone: result.data.user.phone,
                    avatar: result.data.user.avatar_url,
                    role: result.data.user.role,
                },
                role: result.data.user.role
            });

            // Xóa form
            registerForm.fullName = '';
            registerForm.username = '';
            registerForm.email = '';
            registerForm.phone = '';
            registerForm.password = '';
            registerForm.confirm = '';

            // Chuyển về trang chủ luôn
            router.replace('/');
        }

    } catch (err) {
        console.error(err);
        const msg = err.response?.data?.message || 'Đăng ký thất bại, vui lòng thử lại';
        ui.pushToast({ type: 'error', message: msg });
    }
};

// async function register() {
// 	if (registerForm.password !== registerForm.confirm) {
// 		ui.pushToast({ type: 'error', message: 'Mật khẩu không khớp' });
// 		return;
// 	}
// 	// Check if username is admin username
// 	const isAdmin = registerForm.username === 'admin';
// 	user.login({
// 		token: 'demo-token',
// 		profile: { 
// 			id: 2, 
// 			name: registerForm.fullName, 
// 			username: registerForm.username, 
// 			email: registerForm.email,
// 			phone: registerForm.phone,
// 			address: registerForm.address
// 		},
// 		role: isAdmin ? 'admin' : 'user'
// 	});
// 	ui.pushToast({ type: 'success', message: 'Tạo tài khoản thành công' });
// 	// Redirect to admin welcome if admin, otherwise go home
// 	if (isAdmin) {
// 		router.replace('/admin/welcome');
// 	} else {
// 		router.replace('/');
// 	}
// }
</script>


