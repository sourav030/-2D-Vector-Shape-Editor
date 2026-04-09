<script setup>
import { ref } from 'vue';
import CanvasBoard from './components/CanvasBoard.vue';
import PropertiesPanel from './components/PropertiesPanel.vue';
import Toolbar from './components/Toolbar.vue';
const text=ref('')
</script>

<template>
  <div class="bg-slate-900 min-h-screen text-white">
    <Toolbar/>
    <div class="flex gap-5 pt-4 lg:ml-70 md:ml-50 sm:lg-20">
      <CanvasBoard/>
      <PropertiesPanel/>
    </div>
   <div class="">
     <input v-model="text"  type="text" class=" w-[41%] p-2 ml-70 mt-5 mb-5 border border-gray-400" placeholder="Enter  a command to draw circle triangle and rectangle">
     <button @click="console.log(text)" class="border rounded-sm p-2 ml-2 shadow-sm cursor-pointer">Create</button>
   </div>
  </div>
</template>
