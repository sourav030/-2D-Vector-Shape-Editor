<script setup>
import { ref, onMounted,onUnmounted } from 'vue'
import { useFabric } from '../composables/useCanvas'

const canvasId = ref(null)

const { initCanvas ,destroyCanvas,undo,redo,} = useFabric()

onMounted(() => {
  initCanvas(canvasId)
  window.addEventListener('keydown',(e)=>{
    const isControl = e.ctrlKey || e.metaKey;
    if(isControl && e.key.toLowerCase() === 'z'){
      undo()
    }
    else if(isControl && e.key.toLowerCase() === 'x'){
      console.log(`redo call`)
      redo()
    }
  })
})

onUnmounted(async()=>{
await destroyCanvas()
})

</script>

<template>
  

    <div class="flex justify-center border rounded-sm  shadow-sm hover:shadow-xl hover:translate-y-1 bg-white">
      <canvas  class="box" ref="canvasId"></canvas>
    </div>
  
  
</template>

<style>

</style>