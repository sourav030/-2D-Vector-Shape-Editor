<script setup>
import { onMounted,ref } from 'vue';
import {useFabric} from '../composables/useCanvas'

const {addRect,
        addCircle,changeBrushWidth,
        addTriangle,fetchAllData,
        enableDrawingMode,SaveDb,
        disableDrawingMode,undo,redo,
        sentToFront,sentToBack,fetchDataById,fetchLatest}=useFabric()

const data=ref([]);
const size=ref(5);
const selectedId=ref('')

function formatDateTime(date) {
  return new Date(date).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
}

const hangleSave=async()=>{
    await SaveDb();
    data.value=await fetchAllData();
}

onMounted(async()=>{
    data.value=await fetchAllData();
})
</script>

<template>
    <div class="flex  justify-center mt-2 ">
        <div class="border p-2  shadow-md rounded-2xl ">
            <button @click="addRect" class="p-1 cursor-pointer bg-blue-500 hover:bg-blue-600 text-white rounded-sm m-2 border  pl-1">Add Rectangle +</button>
            <button @click="addCircle" class="p-1 cursor-pointer bg-blue-500 hover:bg-blue-600 text-white rounded-sm m-2 border pl-1">Add Circle +</button>
            <button @click="addTriangle" class="p-1 cursor-pointer bg-blue-500 hover:bg-blue-600 text-white rounded-sm m-2  border pl-1">Add Triangle +</button>
            <button @click="enableDrawingMode" class="p-1 cursor-pointer bg-green-500 hover:bg-green-600 text-white rounded-sm m-2 border pl-1">Enable brush </button>
            <button @click="disableDrawingMode" class="p-1 cursor-pointer bg-gray-500 hover:bg-gray-600 text-white rounded-sm m-2 border pl-1">Disable brush</button>
            <button @click="undo" class="p-1 cursor-pointer bg-purple-500 hover:bg-purple-600 text-white rounded-sm m-2 border pl-1">undo</button>
            <button @click="redo" class="p-1 cursor-pointer bg-purple-500 hover:bg-purple-600 text-white rounded-sm m-2 border pl-1">Redo</button>
            <button @click="sentToFront" class="p-1 cursor-pointer bg-orange-500 hover:bg-orange-600 text-white rounded-sm m-2 border pl-1">setFront</button>
            <button @click="sentToBack" class="p-1 cursor-pointer bg-orange-500 hover:bg-orange-600 text-white rounded-sm m-2 border pl-1">setBack</button>
            <button @click="hangleSave" class="p-1 cursor-pointer bg-emerald-500 hover:bg-emerald-600 text-white m-2 rounded-sm border pl-1">save</button>
            <button @click="fetchLatest" class="p-1 cursor-pointer bg-sky-500 hover:bg-sky-600 text-white rounded-sm m-2 border pl-1">load</button>
            <input @change="changeBrushWidth(size)" v-model="size" type="range" min="5" max="50" class="p-1 cursor-pointer bg-sky-500 hover:bg-sky-600 text-white rounded-sm m-2 border pl-1">
             <select class=" cursor-pointer p-1 bg-slate-700 text-white border border-slate-600  rounded-sm" v-model="selectedId" @change="()=>fetchDataById(selectedId)">
                <option disabled value="">Select image</option>
                <option 
                v-for="item in data" 
                :key="item._id" 
                :value="item._id"
                >
                {{ formatDateTime(item.createdAt) }}
                </option>
            </select>
        </div>
    </div>
</template>