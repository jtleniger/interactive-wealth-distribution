<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<style lang="scss">
* {
  box-sizing: border-box;
}

$light-color: #BDBDBD;

body {
  background-color: #212121;
  font-family: Verdana, Geneva, Tahoma, sans-serif;
  color: $light-color;
  font-size: 13px;
  display: flex;
  justify-content: center;
  height: 100vh;
  margin: 0;
}

a {
  color: $light-color;
  text-decoration: none;
  background-color: #424242;
  border: 1px solid $light-color;
  padding: 0.5rem;
  border-radius: 0.5rem;
  display: block;
}

#app {
  max-width: 1080px;
  height: 100%;
}

.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  height: 100%;

  div {
    &:first-child {
      padding-top: 1rem;
    }

    &:last-child {
      padding-bottom: 2rem;
    }

    text-align: center;
    width: 90%;
  }
}
</style>
