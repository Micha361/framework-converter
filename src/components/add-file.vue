<template>
<div class="modal">
  <div class="modal-header">
    <div class="modal-logo">
      <span class="logo-circle">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          xmlns:xlink="http://www.w3.org/1999/xlink"
          width="25"
          height="25"
          viewBox="0 0 512 419.116"
        >
          <defs>
            <clipPath id="clip-folder-new">
              <rect width="512" height="419.116"></rect>
            </clipPath>
          </defs>
          <g id="folder-new" clip-path="url(#clip-folder-new)">
            <path
              id="Union_1"
              data-name="Union 1"
              d="M16.991,419.116A16.989,16.989,0,0,1,0,402.125V16.991A16.989,16.989,0,0,1,16.991,0H146.124a17,17,0,0,1,10.342,3.513L227.217,57.77H437.805A16.989,16.989,0,0,1,454.8,74.761v53.244h40.213A16.992,16.992,0,0,1,511.6,148.657L454.966,405.222a17,17,0,0,1-16.6,13.332H410.053v.562ZM63.06,384.573H424.722L473.86,161.988H112.2Z"
              fill="var(--c-action-primary)"
              stroke=""
              stroke-width="1"
            ></path>
          </g>
        </svg>
      </span>
    </div>

  </div>
  <div class="modal-body">
    <p class="modal-title">Upload a zip-file</p>
    <p class="modal-description">Attach the zip-file below</p>
    <button class="upload-area">
      <span class="upload-area-icon">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          xmlns:xlink="http://www.w3.org/1999/xlink"
          width="35"
          height="35"
          viewBox="0 0 340.531 419.116"
        >
          <g id="files-new" clip-path="url(#clip-files-new)">
            <path
              id="Union_2"
              data-name="Union 2"
              d="M-2904.708-8.885A39.292,39.292,0,0,1-2944-48.177V-388.708A39.292,39.292,0,0,1-2904.708-428h209.558a13.1,13.1,0,0,1,9.3,3.8l78.584,78.584a13.1,13.1,0,0,1,3.8,9.3V-48.177a39.292,39.292,0,0,1-39.292,39.292Zm-13.1-379.823V-48.177a13.1,13.1,0,0,0,13.1,13.1h261.947a13.1,13.1,0,0,0,13.1-13.1V-323.221h-52.39a26.2,26.2,0,0,1-26.194-26.195v-52.39h-196.46A13.1,13.1,0,0,0-2917.805-388.708Zm146.5,241.621a14.269,14.269,0,0,1-7.883-12.758v-19.113h-68.841c-7.869,0-7.87-47.619,0-47.619h68.842v-18.8a14.271,14.271,0,0,1,7.882-12.758,14.239,14.239,0,0,1,14.925,1.354l57.019,42.764c.242.185.328.485.555.671a13.9,13.9,0,0,1,2.751,3.292,14.57,14.57,0,0,1,.984,1.454,14.114,14.114,0,0,1,1.411,5.987,14.006,14.006,0,0,1-1.411,5.973,14.653,14.653,0,0,1-.984,1.468,13.9,13.9,0,0,1-2.751,3.293c-.228.2-.313.485-.555.671l-57.019,42.764a14.26,14.26,0,0,1-8.558,2.847A14.326,14.326,0,0,1-2771.3-147.087Z"
              transform="translate(2944 428)"
              fill="var(--c-action-primary)"
            ></path>
          </g>
        </svg>
      </span>
      <span class="upload-area-title">Drag zip-file(s) here to upload.</span>
      <span class="upload-area-description">
        Alternatively, you can select a zip-file by <br /><strong
          >clicking here</strong
        >
      </span>
    </button>
  </div>
  <div class="modal-footer">
    <button class="btn-secondary">Cancel</button>
    <button class="btn-primary">Upload File</button>
  </div>
</div>

</template>

<style>
.modal {
  width: 90%;
  max-width: 500px;
  margin-left: auto;
  margin-right: auto;
  margin-top: 10px;
  margin-bottom: 10px;
  background-color: #fff;
  border-radius: 0.5rem;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
}

.modal-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 1.5rem 1.5rem 1rem;
}

.logo-circle {
  width: 3.5rem;
  height: 3.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  background-color: #e9e5ff;
  fill: #1cc972;
}



.btn-close:hover,
.btn-close:focus {
  background-color: #e9e5ff;
}

.modal-body {
  padding: 1rem 1.5rem;
}

.modal-title {
  font-weight: 700;
  color: black;
}

.modal-description {
  color: #6a6b76;
}

.upload-area {
  margin-top: 1.25rem;
  background-color: transparent;
  padding: 3rem;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  border: 1px dashed #6a6b76;
  transition-duration: 0.3s;
}

.upload-area:hover,
.upload-area:focus {
  cursor: pointer;
  border: 1px solid #6a6b76;
  transition-duration: 0.3s;
}

.upload-area:hover .upload-area-icon,
.upload-area:focus .upload-area-icon {
  transform: scale(1.3);
  transition-duration: 0.3s;
}

.upload-area-icon {
  display: block;
  width: 2.25rem;
  height: 2.25rem;
  fill: #1cc972;
}

.upload-area-title {
  margin-top: 1rem;
  display: block;
  font-weight: 700;
  color: #0d0f21;
}

.upload-area-description {
  display: block;
  color: #6a6b76;
}

.upload-area-description strong {
  color: #1cc972;
  font-weight: 700;
}

.modal-footer {
  padding: 1rem 1.5rem 1.5rem;
  display: flex;
  justify-content: flex-end;
}

.modal-footer [class*="btn-"] {
  margin-left: 0.75rem;
}

.btn-secondary,
.btn-primary {
  padding: 0.5rem 1rem;
  font-weight: 500;
  border: 2px solid #e5e5e5;
  border-radius: 0.25rem;
  background-color: transparent;
  cursor: pointer;
  color: black;
}

.btn-primary {
  color: #fff;
  background-color: #000000;
  border-color: #000000;
  cursor: pointer;
}
</style>