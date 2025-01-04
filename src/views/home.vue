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
        console.log('Selected file:', this.selectedFiles);
        console.log('Selected framework:', this.selectedFramework);

        const response = await convertProject(this.selectedFiles, this.selectedFramework);
        this.message = response.message || 'Conversion successful!';
      } catch (error) {
        console.error('Error during conversion:', error);
        if (error.response) {
          this.message = `Server error: ${error.response.status} - ${error.response.data}`;
        } else if (error.request) {
          this.message = 'No response from server. Check your network connection.';
        } else {
          this.message = 'Error: ' + error.message;
        }
      }
    },
  },
};
</script>

<template>
  <div>
    <h2>Convert your project</h2>
    <select v-model="selectedFramework">
      <option value="vue">Vue.js</option>
    </select>

    <input type="file" accept=".zip" @change="onFileSelect" multiple />
    <button @click="startConversion">Convert</button>

    <p v-if="message">{{ message }}</p>
  </div>
</template>

<style>
h2 {
  margin-top: 100px;
}
</style>