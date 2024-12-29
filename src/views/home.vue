<template>
  <div>
    <h2>Convert youre project</h2>
    <select v-model="selectedFramework">
      <option value="vue">Vue.js</option>
      <option value="react">React</option>
    </select>

    <input type="file" accept=".zip" @change="onFileSelect" multiple />
    <button @click="startConversion">convert</button>

    <p v-if="message">{{ message }}</p>
  </div>
</template>

<script>
import { convertProject } from '../services/ConversionService';

export default {
  data() {
    return {
      selectedFramework: 'vue',
      selectedFiles: null,
      message: '',
    };
  },
  methods: {
    onFileSelect(event) {
      this.selectedFiles = event.target.files[0];
    },
    async startConversion() {
      try {
        const response = await convertProject(this.selectedFiles, this.selectedFramework);
        this.message = response.message;
      } catch (error) {
        console.error(error);
        this.message = 'An error acured while converting!';
      }
    },
  },
};
</script>
