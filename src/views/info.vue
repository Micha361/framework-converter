<script>
  export default {
    name: 'Info',
  };
  </script>

  <template>
    <div class="info-container">
      <h1>Welcome to the Framework Converter</h1>
      <p>
        The <strong>framework-converter</strong> project is a web application designed to simplify the process of converting your existing web applications into different frameworks.
      </p>
      <p>
        By uploading a folder containing your web application, you can effortlessly transform it into the framework of your choice. Our tool ensures that your application is restructured and optimized according to the selected framework's best practices, saving you time and effort in manual conversion.
      </p>
      <p>
        Whether you're migrating to a new framework or just exploring different options, <strong>framework-converter</strong> provides a seamless and efficient solution.
      </p>
      
      <h2>How it works</h2>
      <p>
        For the converter to work, you must organize your project in the following way before uploading it:
      </p>
      <ul>
        <li>All your JS files should be in a <code>scripts</code> folder.</li>
        <li>All your CSS files should be in a <code>styles</code> folder.</li>
        <li>All HTML files should be in the root directory of the ZIP file.</li>
      </ul>
  
      <p>
        Please note that the converter is designed to work only with simple projects.
      </p>
  
      <h2>Supported Frameworks</h2>
      <p>
        Currently, you can convert your project to <strong>Vue.js</strong>. More frameworks will be supported in future updates.
      </p>
    </div>
  </template>
  
  <style scoped>
  .info-container {
    font-family: Arial, sans-serif;
    padding: 20px;
    max-width: 800px;
    margin: 0 auto;
    text-align: center;
  }
  
  h1 {
    color: #333;
    font-size: 2em;
  }
  
  h2 {
    margin-top: 20px;
    font-size: 1.5em;
    color: #555;
  }
  
  ul {
    text-align: left;
    margin-left: 20px;
  }
  
  code {
    background-color: #555555;
    padding: 2px 6px;
    font-size: 1.1em;
    border-radius: 4px;
  }
  </style>
  