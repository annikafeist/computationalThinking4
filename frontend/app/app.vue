<template>
  <!-- Every board has its own address; switching boards starts the page fresh. -->
  <NuxtPage :page-key="route => route.fullPath" />
</template>
