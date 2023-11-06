<template>
  <div>
    <button>
      <router-link :to="{ name: 'testParams', params: { _id: 1 } }">
        TestParams
      </router-link>
    </button>
  </div>
</template>
<script></script>
