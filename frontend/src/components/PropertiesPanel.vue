<script setup>
import { ref } from 'vue'
import { useFabric } from '../composables/useCanvas'

const { selectedObject, positionX, positionY, updateObjectPosition } = useFabric()
const colors = ref('#ff0000')

const changeColor = () => {
  if (selectedObject.value) {
    selectedObject.value.set('fill', colors.value)
  
    selectedObject.value.canvas.renderAll()
  }
}
</script>

<template>

  <div v-if="selectedObject" class="property-panel p-4 border rounded shadow h-[255px]">
    <h3 class="font-bold mb-2">Object Properties</h3>
    
    <div class="flex flex-col gap-3">
      <div>
        <label class="block text-xs">Left (X)</label>
        <input type="number" v-model="positionX" @input="updateObjectPosition" class="border rounded p-1  w-[40%]">
      </div>

      <div>
        <label class="block text-xs">Top (Y)</label>
        <input type="number" v-model="positionY" @input="updateObjectPosition" class="border rounded p-1 w-[40%]">
      </div>

      <div>
        <label class="block text-xs">Color</label>
        <input type="color" v-model="colors" @input="changeColor" class=" h-8">
      </div>
    </div>
  </div>
</template>
