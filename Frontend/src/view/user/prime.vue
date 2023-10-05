<template>
  <div>
    <button>A</button> clic me

    <button type="button" class="mybutton">My Button</button>
    <Button title="my btn"></Button>

    <Dialog :showHeader="false"></Dialog>

    <!-- can be written as -->

    <Dialog :show-header="false"></Dialog>
  </div>
</template>

<script>
import Button from "primevue/button";
export default {
  components: {
    Button,
  },
};
</script>
<style></style>
