<script setup>
import { onMounted, ref } from 'vue';
import { useFabric } from '../composables/useCanvas'


import {
    Circle,
    RectangleHorizontal,
    Triangle,
    Minus,
    Spline,
    Undo, Redo, Pentagon
} from 'lucide-vue-next'

const {
    addRect,
    addCircle,
    changeBrushWidth,
    addTriangle,
    fetchAllData,
    enableDrawingMode,
    SaveDb,
    addLine,
    disableDrawingMode,
    undo,
    redo,
    addArc,
    addSpline,
    enableSnapping,
    sentToFront,
    sentToBack,
    fetchDataById, startPointSelection, createPolylineFromPoints,
    fetchLatest, addPentagon
} = useFabric()

const data = ref([]);
const size = ref(5);
const selectedId = ref('')


function formatDateTime(date) {
    return new Date(date).toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
    });
}

const hangleSave = async () => {
    await SaveDb();
    data.value = await fetchAllData();
}

onMounted(async () => {
    data.value = await fetchAllData();
})
</script>

<template>
    <div class="flex justify-center mt-1">
        <div class="flex justify-around flex-wrap items-center gap-4 border w-full p-3 border-gray-600 rounded-2xl bg-[#202020]">

            <div class="flex items-center gap-1 border pr-3 border-gray-800 p-2">
                <button @click="addRect" class="tool-btn" title="Add Rectangle">
                    <RectangleHorizontal :size="60" color="#fff" fill="#202020" :stroke-width="0.5" />
                </button>
                <button @click="addPentagon" class="tool-btn" title="Add Rectangle">
                    <Pentagon :size="60" color="#fff" fill="#202020" :stroke-width="0.5" />
                </button>
                <button @click="addCircle" class="tool-btn" title="Add Circle">
                    <Circle :size="60" color="#fff" fill="#202020" :stroke-width="0.5" />
                </button>
                <button @click="addTriangle" class="tool-btn" title="Add Triangle">
                    <Triangle :size="60" color="#fff" fill="#202020" :stroke-width="0.5" />
                </button>
                <button @click="addLine" class="tool-btn" title="Add Line">
                    <Minus :size="60" color="#fff" :stroke-width="0.5" />
                </button>
                <button @click="addSpline" class="tool-btn" title="Add Arc">
                    <Spline :size="60" color="#fff" :stroke-width="0.5" />
                </button>
            </div>

             <div class="flex justify-around flex-wrap items-center gap-4 border  p-3 border-gray-600 rounded-2xl bg-[#202020]">
            <button @click="startPointSelection" class="flex cursor-pointer items-center text-white gap-1 border pr-3 border-gray-800 p-2">
                1. Select Points
            </button>

            <button @click="createPolylineFromPoints" class="flex cursor-pointer items-center text-white gap-1 border pr-3 border-gray-800 p-2">
                2. Create Polyline
            </button>
        </div>

            <div class="flex items-center gap-2 border-r border  border-gray-800 p-2.5 pl-5 pr-5">
                <div class="flex flex-col gap-1">
                    <button @click="enableDrawingMode"
                        class="text-[13px] px-2 py-0.5 p-3  text-white border border-gray-500 rounded hover:bg-green-700">
                        Brush ON
                    </button>
                    <button @click="disableDrawingMode"
                        class="text-[13px] px-2 py-0.5 p-3 border border-gray-500 text-white rounded hover:bg-gray-700">
                        Brush OFF
                    </button>
                </div>
                <input @change="changeBrushWidth(size)" v-model="size" type="range" min="5" max="50"
                    class="w-16 h-1 bg-blue-200 rounded-lg appearance-none cursor-pointer">
            </div>

            <div class="flex items-center gap-1.5 border border-r  border-gray-800 p-3 pl-5 pr-5">
                <button @click="undo"
                    class="action-btn text-white  border border-gray-500 p-1 cursor-pointer hover:bg-gray-400 ">
                    <Undo />
                </button>
                <button @click="redo"
                    class="action-btn text-white  border border-gray-500 p-1 cursor-pointer hover:bg-gray-400 ">
                    <Redo />
                </button>
            </div>

            <div class="flex items-center gap-1 border p-1.5 border-gray-800 pl-5 pr-5">
                <button @click="sentToFront"
                    class="action-btn text-white border border-gray-500 p-1 cursor-pointer hover:bg-gray-400">Front</button>
                <button @click="sentToBack"
                    class="action-btn text-white  border border-gray-500 p-1 cursor-pointer hover:bg-gray-400">Back</button>
                <button @click="enableSnapping"
                    class="action-btn text-white border  border-gray-500 p-1 cursor-pointer hover:bg-gray-400">Snap</button>
            </div>

            <div class="flex items-center border p-2 border-gray-800 gap-2 pl-5 pr-5">
                <button @click="hangleSave"
                    class="px-3 py-1.5 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 text-sm font-bold transition-colors">
                    SAVE
                </button>
                <button @click="fetchLatest"
                    class="px-3 py-1.5 bg-sky-600 text-white rounded-md hover:bg-sky-700 text-sm transition-colors">
                    LOAD
                </button>

                <select
                    class="cursor-pointer p-1.5  text-white border border-gray-300 rounded-md text-xs shadow-sm focus:ring-2 focus:ring-blue-400 outline-none"
                    v-model="selectedId" @change="() => fetchDataById(selectedId)">
                    <option disabled value="">History</option>
                    <option v-for="item in data" :key="item._id" :value="item._id" class="text-white bg-[#202020]">
                        {{ formatDateTime(item.createdAt) }}
                    </option>
                </select>
            </div>
        </div>
    </div>
</template>
