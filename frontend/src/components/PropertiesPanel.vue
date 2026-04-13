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

onMounted(()=>{
  changeColor()
})

</script>

<template>

  <div v-if="selectedObject" class="property-panel bg-gray-300 p-4 border rounded-sm shadow-sm h-[255px] hover:shadow-lg ">
    <h3 class="font-bold mb-2 text-gray-900">Object Properties</h3>
    
    <div class="flex flex-col gap-3">
      <div>
        <label class="block text-xs text-gray-900">Left (X)</label>
        <input type="number" v-model="positionX" @input="updateObjectPosition" class="border text-gray-900 rounded p-1  w-[40%]">
      </div>

      <div>
        <label class="block text-xs text-gray-900">Top (Y)</label>
        <input type="number" v-model="positionY" @input="updateObjectPosition" class="border text-gray-900 rounded p-1 w-[40%]">
      </div>

      <div>
        <label class="block text-xs text-gray-900">Change Color</label>
        <input type="color" v-model="colors" @input="changeColor" class=" h-8 cursor-pointer">
      </div>
    </div>
  </div>
</template>
