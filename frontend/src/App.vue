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

      // 🎨 COLOR
      if (action === "change_color") {
        const hex = color(response.data.modify.color).hex();
        activeObj.set("fill", hex);
      }

      // 🔄 ROTATION
      else if (action === "change_rotation") {
        activeObj.set("angle", response.data.modify.angle || 50);
      }

      // 📍 POSITION
      else if (action === "change_position") {
        activeObj.set({
          left: response.data.modify.left,
          top: response.data.modify.top
        });
      }

      // 📏 SIZE (rectangle / triangle etc.)
      else if (action === "change_size") {
        const { width, height } = response.data.modify;

        if (width) activeObj.set("width", width);
        if (height) activeObj.set("height", height);

        // important for fabric
        activeObj.setCoords();
      }

      // 🔵 RADIUS (circle only)
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
  <div class="bg-slate-900 min-h-screen text-white flex flex-col">
    <Toolbar />

    <main class="flex-1 p-4 md:p-6 lg:p-8">
      <div class="flex flex-col lg:flex-row gap-5 justify-center items-start">

        <div class="w-full lg:flex-1 flex justify-center">
          <CanvasBoard class="max-w-full h-auto overflow-hidden shadow-2xl" />
        </div>

        <div class="w-full lg:w-80">
          <PropertiesPanel />
        </div>
      </div>
    </main>

    <div class="sticky bottom-0 bg-slate-900/90 backdrop-blur-md p-4 border-t border-slate-700">
      <div class="max-w-4xl mx-auto flex flex-col sm:flex-row items-center gap-3">

        <div class="relative w-full">
          <input v-model="text" @keyup.enter="drawShape" :disabled="loading" type="text"
            class="w-full p-3 pr-12 border border-slate-600 bg-slate-800 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none disabled:opacity-50 transition-all"
            placeholder="e.g. 'draw 2 blue circles'">
        </div>

        <button @click="drawShape" :disabled="loading"
          class="w-full sm:w-auto min-w-[120px] bg-blue-600 hover:bg-blue-700 disabled:bg-slate-700 text-white font-medium py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-lg">
          <span v-if="loading"
            class="animate-spin border-2 border-white border-t-transparent rounded-full w-4 h-4"></span>
          {{ loading ? '...' : 'Create' }}
        </button>
      </div>
    </div>
  </div>
</template>