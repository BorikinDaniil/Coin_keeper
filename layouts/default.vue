<template>
  <div class="body">
    <div>
      <TheHeader />
      <TheDate />
      <nuxt />
      <TheFooter />
    </div>
  </div>
</template>

<style scoped lang="css">
  .body {
    background: linear-gradient(to bottom, rgb(255, 232, 99), rgb(225, 227, 110), rgb(195, 222, 121), rgb(166, 217, 133), rgb(136, 212, 144), rgb(106, 207, 155), rgb(106, 210, 145), rgb(107, 213, 134), rgb(107, 216, 124), rgb(107, 218, 113), rgb(108, 221, 103), rgb(108, 224, 92));
    height: 100vh;
    margin: 0;
    background-attachment: fixed;
  }

</style>
<script>
  import TheHeader from "../components/TheHeader";
  import TheFooter from "../components/TheFooter";
  import TheDate from "../components/TheDate";
  export default {
    components: {TheDate, TheFooter, TheHeader,}
  }
</script>
