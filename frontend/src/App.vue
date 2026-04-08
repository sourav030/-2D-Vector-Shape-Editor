<script setup>
import CanvasBoard from './components/CanvasBoard.vue';
import PropertiesPanel from './components/PropertiesPanel.vue';
import Toolbar from './components/Toolbar.vue';


</script>

<template>
  <Toolbar/>
  <div class="flex gap-5 pt-4 lg:ml-70 md:ml-50 sm:lg-20">
    <CanvasBoard/>
    <PropertiesPanel/>
  </div>
</template>
