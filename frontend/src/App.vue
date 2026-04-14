<script setup>
import { ref } from 'vue';
import CanvasBoard from './components/CanvasBoard.vue';
import PropertiesPanel from './components/PropertiesPanel.vue';
import Toolbar from './components/Toolbar.vue';
import axios from 'axios'
import color from 'color'
import { useFabric } from './composables/useCanvas'

const text = ref('')
const loading = ref(false)
const { addRect, addTriangle, addCircle, canvas } = useFabric()

const drawShape = async () => {
  if (!text.value.trim() || loading.value) return;

  const currentCommand = text.value;
  text.value = '';
  loading.value = true;

  try {
    const response = await axios.post('http://localhost:4000/api/ai-command', {
      input: currentCommand
    });

    console.log("Shapes Received:", response.data);
    for (let i = 0; i < response.data.shapes.length; i++) {

      if (response.data.shapes[i].type === "rectangle")
        addRect(response.data.shapes[i].height, response.data.shapes[i].width, response.data.shapes[i].left, response.data.shapes[i].top, response.data.shapes[i].color)

      else if (response.data.shapes[i].type === "triangle") {
        addTriangle(response.data.shapes[i].height, response.data.shapes[i].width, response.data.shapes[i].left, response.data.shapes[i].top, response.data.shapes[i].color)
      }

      else if (response.data.shapes[i].type === "circle") {
        addCircle(response.data.shapes[i].height, response.data.shapes[i].width, response.data.shapes[i].left, response.data.shapes[i].top, response.data.shapes[i].color, response.data.shapes[i].radius)
      }

    }

    // MODIFY LOGIC
    if (response.data.modify && canvas.value) {
      const activeObj = canvas.value.getActiveObject();

      if (!activeObj) {
        console.warn("No active object selected");
        return;
      }

      const action = response.data.modify.action;

      //  COLOR
      if (action === "change_color") {
        const hex = color(response.data.modify.color).hex();
        activeObj.set("fill", hex);
      }

      //  ROTATION
      else if (action === "change_rotation") {
        activeObj.set("angle", response.data.modify.angle || 50);
      }

      //  POSITION
      else if (action === "change_position") {
        activeObj.set({
          left: response.data.modify.left,
          top: response.data.modify.top
        });
      }

     
      else if (action === "change_size") {
        const { width, height } = response.data.modify;

        if (width) activeObj.set("width", width);
        if (height) activeObj.set("height", height);

        
        activeObj.setCoords();
      }

    
      else if (action === "change_radius") {
        const { radius } = response.data.modify;

        if (activeObj.type === "circle" && radius) {
          activeObj.set("radius", radius);
        } else {
          console.warn("Radius can only be applied to circle");
        }

        activeObj.setCoords();
      }

      canvas.value.renderAll();
    }
  } catch (error) {
    console.error("Error:", error.response?.data || error.message);

  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <div class="min-h-screen bg-[#202020] text-black flex flex-col font-sans">
    
    <div class="bg-[#202020] border-b border-[#424242] px-2 py-0.5 text-xs flex gap-4">
      <span class="cursor-default hover:bg-[#000080] text-white px-2">File</span>
      <span class="cursor-default hover:bg-[#000080] text-white px-2">Edit</span>
      <span class="cursor-default hover:bg-[#000080] text-white px-2">View</span>
      <span class="cursor-default hover:bg-[#000080] text-white px-2">Help</span>
    </div>

    <Toolbar />

    <main class="flex-1 p-4 overflow-auto flex justify-center items-start">
      <div class="flex flex-col lg:flex-row gap-4 items-start max-w-full">
        
        <div class="bg-[#c0c0c0] p-1 border-t-white border-l-white border-b-[#424242] border-r-[#424242] border-2">
           <CanvasBoard class="bg-white" />
        </div>

        <div class="w-full lg:w-64 bg-[#c0c0c0] p-2 border-t-white border-l-white border-b-[#424242] border-r-[#424242] border-2">
          <PropertiesPanel />
        </div>

      </div>
    </main>

    <div class="bg-[#202020] border border-gray-600 p-2">
      <div class="  max-w-5xl mx-auto flex flex-col sm:flex-row items-center gap-2">
        
        <label class="text-xs text-white font-bold whitespace-nowrap">AI Command:</label>

        <div class="relative w-full bg-[#202020]">
          <input 
            v-model="text" 
            @keyup.enter="drawShape" 
            :disabled="loading" 
            type="text"
            class="w-full p-2 border-2 bg-[#202020] border-gray-600 text-white"
            placeholder="e.g. 'draw 2 blue circles'"
          >
        </div>

        <button 
          @click="drawShape" 
          :disabled="loading"
          class="w-full sm:w-auto min-w-25 bg-[#202020] text-white rounded-sm p-2  border border-gray-600"
        >
          <span v-if="loading" class="animate-spin border-2 border-black border-t-transparent rounded-full w-3 h-3"></span>
          {{ loading ? '...' : 'Create' }}
        </button>

      </div>
      
      <div class="mt-2 text-[10px]  bg-[#202020] text-white flex justify-between px-2">
        <span>Ready</span>
        <span v-if="loading">AI is thinking...</span>
        <span>100% Zoom</span>
      </div>
    </div>
  </div>
</template>

<style scoped>

::-webkit-scrollbar {
  width: 16px;
  background: #d4d0c8;
}

::-webkit-scrollbar-thumb {
  background: #c0c0c0;
  border: 2px solid;
  border-color: #ffffff #808080 #808080 #ffffff;
}

::-webkit-scrollbar-button {
  background: #c0c0c0;
  border: 1px solid;
  border-color: #ffffff #808080 #808080 #ffffff;
  display: block;
  height: 16px;
}
</style>