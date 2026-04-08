<script setup>
import { onMounted,ref } from 'vue';
import {useFabric} from '../composables/useCanvas'

const {addRect,
        addCircle,
        addTriangle,fetchAllData,
        enableDrawingMode,SaveDb,
        disableDrawingMode,undo,redo,
        sentToFront,sentToBack,fetchDataById,fetchLatest}=useFabric()

const data=ref([]);

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

onMounted(async()=>{
    data.value=await fetchAllData();
})
</script>

<template>
    <div class="flex  justify-center">
        <div class="border  p-2  bg-white shadow-md rounded-2xl">
            <button @click="addRect" class="p-1 m-2 border pl-1">Add Rectangle +</button>
            <button @click="addCircle" class="p-1 m-2 border pl-1">Add Circle +</button>
            <button @click="addTriangle" class="p-1 m-2  border pl-1">Add Triangle +</button>
            <button @click="enableDrawingMode" class="p-1 m-2 border pl-1">Enable brush </button>
            <button @click="disableDrawingMode" class="p-1 m-2 border pl-1">Disable brush</button>
            <button @click="undo" class="p-1 m-2 border pl-1">undo</button>
            <button @click="redo" class="p-1 m-2 border pl-1">Redo</button>
            <button @click="sentToFront" class="p-1 m-2 border pl-1">setFront</button>
            <button @click="sentToBack" class="p-1 m-2 border pl-1">setBack</button>
            <button @click="SaveDb" class="p-1 m-2 border pl-1">save</button>
            <button @click="fetchLatest" class="p-1 m-2 border pl-1">load</button>
             <select class="border" v-model="selectedId" @change="()=>fetchDataById(selectedId)">
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