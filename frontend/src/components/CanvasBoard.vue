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
  <div class="flex justify-center bg-[#f3f3f3] p-10 min-h-[500px]">
    <div class="bg-white rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-200 overflow-hidden">
      <canvas ref="canvasId" class="block"></canvas>
    </div>
  </div>
</template>

<style scoped>

</style>