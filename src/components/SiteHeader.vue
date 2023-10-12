<template>
  <header>
    <RouterLink to="/search">
      <h1>💣 Giant Bomb Rentals</h1>
    </RouterLink>
  </header>
</template>

<style scoped>
header {
  display: grid;
  align-items: center;
  justify-items: left;
}

h1 {
  font-weight: 500;
  font-size: calc(var(--header-height) / 2);
  color: white;
}
</style>
