<template>
	<h1 class="mb-4 text-xl font-semibold">Quản lý người dùng</h1>
	<div class="overflow-x-auto rounded-lg border dark:border-gray-800">
		<table class="min-w-full text-sm">
			<thead class="bg-gray-50 text-left dark:bg-gray-900">
				<tr>
					<th class="p-3">ID</th>
					<th class="p-3">Tên</th>
					<th class="p-3">Email</th>
					<th class="p-3">Vai trò</th>
					<th class="p-3">Hành động</th>
				</tr>
			</thead>
			<tbody>
				<tr v-for="u in users" :key="u.id" class="border-t dark:border-gray-800">
					<td class="p-3">#{{ u.id }}</td>
					<td class="p-3">{{ u.name }}</td>
					<td class="p-3">{{ u.email }}</td>
					<td class="p-3">{{ u.role }}</td>
					<td class="p-3">
						<div class="flex items-center gap-2">
							<button @click="promote(u)" aria-label="Thăng cấp"
								class="flex items-center gap-2 rounded-md bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-300">
								<svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7M12 3v18"/></svg>
								<span>Thăng cấp</span>
							</button>

							<button @click="ban(u)" aria-label="Cấm"
								class="flex items-center gap-2 rounded-md bg-red-50 px-3 py-1 text-sm font-medium text-red-700 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-300">
								<svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 5.636l-12.728 12.728M5.636 5.636l12.728 12.728"/></svg>
								<span>Cấm</span>
							</button>
						</div>
					</td>
				</tr>
			</tbody>
		</table>
	</div>
</template>

<script setup>
import { ref } from 'vue';
import AdminLayout from '../../components/layout/AdminLayout.vue';
import { useUIStore } from '../../stores/ui';
const ui = useUIStore();
const users = ref([
	{ id: 1, name: 'Demo Admin', email: 'admin@example.com', role: 'admin' },
	{ id: 2, name: 'Demo User', email: 'user@example.com', role: 'user' }
]);
function promote(u) {
	u.role = 'admin';
	ui.pushToast({ type: 'success', message: `Đã thăng cấp ${u.name}` });
}
function ban(u) {
	ui.pushToast({ type: 'success', message: `Đã cấm ${u.name}` });
}
</script>


