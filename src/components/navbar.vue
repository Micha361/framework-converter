<script setup>
  </script>

<template>
    <nav>
      <ul>
        <li><router-link to="/">Home</router-link></li>
        <li><router-link to="/info">Info</router-link></li>
      </ul>
    </nav>
  </template>
  
  <style scoped>
  nav {
    padding: 10px;
    text-align: center;
  }
  
  ul {
    list-style: none;
    display: flex;
    justify-content: center;
    padding: 0;
  }
  
  li {
    margin: 0 15px;
  }
  
  a {
    color: rgb(0, 0, 0);
    text-decoration: none;
    font-size: 18px;
    font-weight: bold;
  }
  
  a:hover {
    text-decoration: underline;
  }
  </style>
  