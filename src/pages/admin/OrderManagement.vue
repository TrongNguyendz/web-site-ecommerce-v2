<template>
	<h1 class="mb-4 text-xl font-semibold">Quản lý đơn hàng</h1>
	<div class="mb-4 flex gap-3">
		<SelectDropdown v-model="status" :options="statusOptions" />
		<button class="rounded border px-3 py-2 dark:border-gray-700" @click="load">Tải</button>
	</div>
	<div class="overflow-x-auto rounded-lg border dark:border-gray-800">
		<table class="min-w-full text-sm">
			<thead class="bg-gray-50 text-left dark:bg-gray-900">
				<tr>
					<th class="p-3">Mã</th>
					<th class="p-3">Ngày</th>
					<th class="p-3">Khách</th>
					<th class="p-3">Trạng thái</th>
					<th class="p-3">Hành động</th>
				</tr>
			</thead>
			<tbody>
				<tr v-for="o in orders" :key="o.id" class="border-t dark:border-gray-800">
					<td class="p-3">#{{ o.id }}</td>
					<td class="p-3">{{ o.date }}</td>
					<td class="p-3">{{ o.customer }}</td>
					<td class="p-3">{{ o.status }}</td>
					<td class="p-3">
						<div class="flex items-center gap-2">
							<button @click="update(o, 'Shipped')" aria-label="Giao hàng"
								class="flex items-center gap-2 rounded-md bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700 hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-300">
								<svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7h13l3 4v6a1 1 0 01-1 1h-1a2 2 0 11-4 0H9a2 2 0 11-4 0H4a1 1 0 01-1-1V7z"/></svg>
								<span>Giao hàng</span>
							</button>

							<button @click="update(o, 'Cancelled')" aria-label="Huỷ"
								class="flex items-center gap-2 rounded-md bg-red-50 px-3 py-1 text-sm font-medium text-red-700 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-300">
								<svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
								<span>Huỷ</span>
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
import SelectDropdown from '../../components/forms/SelectDropdown.vue';
import { useUIStore } from '../../stores/ui';

const ui = useUIStore();
const status = ref('all');
const statusOptions = [
	{ value: 'all', label: 'Tất cả' },
	{ value: 'Processing', label: 'Đang xử lý' },
	{ value: 'Shipped', label: 'Đã giao' },
	{ value: 'Cancelled', label: 'Đã hủy' }
];
const orders = ref([
	{ id: 401, date: '2025-11-11', customer: 'Nguyễn A', status: 'Processing' },
	{ id: 402, date: '2025-11-10', customer: 'Trần B', status: 'Shipped' }
]);

function load() {
	/* demo filters */
}
function update(o, s) {
	o.status = s;
	ui.pushToast({ type: 'success', message: `Đã cập nhật #${o.id} → ${s}` });
}
</script>


