<template>
  <div>
    <h2>Convert your project</h2>
    <select v-model="selectedFramework">
      <option value="vue">Vue.js</option>
      <option value="react">React</option>
    </select>

    <input type="file" accept=".zip" @change="onFileSelect" multiple />
    <button @click="startConversion">Convert</button>
    <button @click="downloadZip" v-if="conversionComplete">Download ZIP</button>

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
      conversionComplete: false,
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
        this.conversionComplete = true;
      } catch (error) {
        console.error(error);
        this.message = 'An error occurred while converting!';
      }
    },
    async downloadZip() {
      try {
        const response = await fetch('http://localhost:3000/download');
        if (!response.ok) throw new Error('Download failed');

        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'converted_project.zip';
        a.click();
        window.URL.revokeObjectURL(url);
      } catch (error) {
        console.error('Error downloading ZIP:', error);
        this.message = 'An error occurred while downloading the ZIP file!';
      }
    },
  },
};
</script>
