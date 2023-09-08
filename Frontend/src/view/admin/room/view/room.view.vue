<script>
import { reactive, onMounted, ref, onBeforeMount } from "vue";
import _ from "lodash";

//service
import boardinghouseService from "../../../../service/boardinghouse.service";
import roomService from "../../../../service/room.service";
import mediaService from "../../../../service/media.service";
// view
import room from "./room.view.vue";
export default {
  props: { _id: { type: String, default: "" } },
  setup(props, { emit }) {
    const data = reactive({
      item: { name: "", price: "", area: "" },
      medias: [{ name: "" }],
    });
    onMounted(async () => {
      console.log("PropsId view room", props._id);
      const documentRoom = await roomService.get(props._id);
      data.item = documentRoom.message;

      const documentMedia = await mediaService.get(props._id);
      data.medias = documentMedia.message;
    });
    return { data };
  },
};
</script>
<template>
  <div>
    room {{ data.item }}
    <div v-for="(value, index) in data.medias" :key="index">
      <img
        v-if="data.medias[0].name != ''"
        style="width: 100px; height: 100px"
        :src="`http://localhost:3000/static/images/${value.name}`"
      />
    </div>
  </div>
</template>
