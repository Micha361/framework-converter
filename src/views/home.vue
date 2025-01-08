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
          //this.message = `Server error: ${error.response.status} - ${error.response.data}`;
        } else if (error.request) {
          //this.message = 'No response from server. Check your network connection.';
        } else {
          //this.message = 'Error: ' + error.message;
        }
      }
    },
  },
};
</script>

<template>
  <div>
    <div class="title-container">
    <h2 class="title">Convert your project</h2>
  </div>
    <select v-model="selectedFramework">
      <option value="vue">Vue.js</option>
    </select>

    <input class="fileselect" type="file" accept=".zip" @change="onFileSelect" multiple />
    <button class="convertbtn" @click="startConversion">Convert</button> <br><br>
    <button class="downloadbtn" @click="downloadConversion">download file</button>

    <p v-if="message">{{ message }}</p>
  </div>
</template>

<style>
.title {
  margin-top: 100px;
}

.title-container {
  justify-content: center;
  margin: auto 0;
  margin-left: 170px;
  margin-right: 170px;
  border-radius: 17px;
}

.convertbtn {
  margin-left: 20px;
  border-radius: 8px;
  border: 1px solid transparent;
  padding: 0.6em 1.2em;
  font-size: 1em;
  font-weight: 500;
  font-family: inherit;
  background-color: #1a1a1a;
  cursor: pointer;
  transition: border-color 0.25s;
}

.convertbtn:hover {
  border-color: #ffffff;
  background-color: #333;
}

.fileselect {
  margin-left: 10px;
}

</style>