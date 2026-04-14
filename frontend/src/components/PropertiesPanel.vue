<script setup>
import { onMounted, onUpdated, ref } from 'vue'
import { useFabric } from '../composables/useCanvas'

const { selectedObject, positionX, positionY, updateObjectPosition, fill } = useFabric()
const colors = ref(fill)

const changeColor = () => {
  if (selectedObject.value) {
    selectedObject.value.set('fill', colors.value)
    selectedObject.value.canvas.renderAll()
  }
}

onMounted(() => {
  changeColor()
})

</script>

<template>

  <div v-if="selectedObject"
    class="bg-[#2b2b2b] p-5 text-white border border-[#3d3d3d] rounded-xl shadow-2xl w-full max-w-xs animate-in fade-in slide-in-from-right-4 duration-300">

    <div class="flex items-center justify-between mb-4 border-b border-white/10 pb-2">
      <h3 class="text-sm font-semibold tracking-wide uppercase text-gray-400">Object Properties</h3>
      <span class="text-[10px] bg-blue-600 px-2 py-0.5 rounded-full text-white">Active</span>
    </div>

    <div class="space-y-4">
      <div class="grid grid-cols-2 gap-4">
        <div class="space-y-1">
          <label class="block text-[10px] font-bold text-gray-500 uppercase tracking-tighter">Position X</label>
          <div class="relative">
            <input type="number" v-model="positionX" @input="updateObjectPosition"
              class="w-full bg-[#1c1c1c] border border-[#4d4d4d] text-white text-sm rounded-lg p-2 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all">
          </div>
        </div>

        <div class="space-y-1">
          <label class="block text-[10px] font-bold text-gray-500 uppercase tracking-tighter">Position Y</label>
          <input type="number" v-model="positionY" @input="updateObjectPosition"
            class="w-full bg-[#1c1c1c] border border-[#4d4d4d] text-white text-sm rounded-lg p-2 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all">
        </div>
      </div>

      <div class="pt-2">
        <label class="block text-[10px] font-bold text-gray-500 uppercase tracking-tighter mb-2">Appearance</label>
        <div class="flex items-center gap-3 bg-[#1c1c1c] p-2 rounded-lg border border-[#4d4d4d]">
          <div class="relative w-10 h-10 shrink-0 overflow-hidden rounded-md border border-white/10">
            <input type="color" v-model="colors" @input="changeColor"
              class="absolute -inset-2 w-14 h-14 cursor-pointer">
          </div>
          <div class="flex flex-col">
            <span class="text-xs text-gray-300 font-mono uppercase">{{ colors }}</span>
            <span class="text-[10px] text-gray-500">Click to change fill</span>
          </div>
        </div>
      </div>
    </div>

    <div class="mt-6 pt-4 border-t border-white/5 flex gap-2">
    </div>
  </div>
</template>
