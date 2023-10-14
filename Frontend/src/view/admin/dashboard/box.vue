<script>
import {
  ref,
  reactive,
  onMounted,
  onBeforeUnmount,
  computed,
  watch,
} from "vue";

//service
import boardinghouseService from "../../../service/boardinghouse.service";
import roomService from "../../../service/room.service";
import userService from "../../../service/user.service";
//asset/js
//component

export default {
  components: {},
  props: {},
  setup(props, { emit }) {
    const data = reactive({
      boardings: 0,
      customers: 0,
      rooms: 0,
      unRooms: 0,
    });
    onMounted(async () => {
      try {
        //số nhà trọ
        const documentBoarding = await boardinghouseService.getAllUser();
        data.boardings = documentBoarding.message.length;
        // số phòng
        let totalRoom = 0;
        let totalUnRoom = 0;
        for (let value of documentBoarding.message) {
          let documentRoom = await roomService.getAll();
          documentRoom = documentRoom.message.filter((item) => {
            if (item.boardingId == value._id && item.status == false) {
              totalUnRoom = totalUnRoom + 1;
            }
            return item.boardingId == value._id;
          });
          totalRoom = totalRoom + documentRoom.length;
        }
        data.rooms = totalRoom;
        data.unRooms = totalUnRoom;
        // khách trọ
        const documentCustomer = await userService.getAllTenant("Landloard");
        data.customers = documentCustomer.message.length;
      } catch (error) {
        if (error.response) {
          console.log("Server-side errors", error.response.data);
        } else if (error.request) {
          console.log("Client-side errors", error.request);
        } else {
          console.log("Errors:", error.message);
        }
      }
    });
    return { data };
  },
};
</script>
<template>
  <div class="row mx-2 justify-content-around">
    <div class="col-md-3col-12 mb-4">
      <div class="card border-left-primary shadow h-100 py-2 boardingCard">
        <div class="card-body">
          <div class="row no-gutters align-items-center">
            <div class="col mr-2">
              <div
                class="text-xs font-weight-bold text-white text-uppercase mb-1"
              >
                Số nhà trọ
              </div>
              <div class="h5 mb-0 font-weight-bold text-white">
                {{ data.boardings }}
              </div>
            </div>
            <div class="col-auto">
              <span class="material-symbols-outlined text-white"
                >domain_add</span
              >
            </div>
          </div>
        </div>
      </div>
    </div>
    <!--  -->
    <div class="col-md-3col-12 mb-4">
      <div class="card border-left-primary shadow h-100 py-2 roomCard">
        <div class="card-body">
          <div class="row no-gutters align-items-center">
            <div class="col mr-2">
              <div
                class="text-xs font-weight-bold text-uppercase mb-1 text-white"
              >
                phòng trọ
              </div>
              <div class="h5 mb-0 font-weight-bold text-white">
                {{ data.rooms }}
              </div>
            </div>
            <div class="col-auto">
              <span class="material-symbols-outlined text-white">
                holiday_village</span
              >
            </div>
          </div>
        </div>
      </div>
    </div>
    <!--  -->
    <div class="col-md-3col-12 mb-4">
      <div class="card border-left-primary shadow h-100 py-2 customerCard">
        <div class="card-body">
          <div class="row no-gutters align-items-center">
            <div class="col mr-2">
              <div
                class="text-xs font-weight-bold text-uppercase mb-1 text-white"
              >
                Khách trọ
              </div>
              <div class="h5 mb-0 font-weight-bold text-white">
                {{ data.customers }}
              </div>
            </div>
            <div class="col-auto">
              <span class="material-symbols-outlined text-white">groups</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="col-md-3col-12 mb-4">
      <div class="card border-left-primary shadow h-100 py-2 roomCard">
        <div class="card-body">
          <div class="row no-gutters align-items-center">
            <div class="col mr-2">
              <div
                class="text-xs font-weight-bold text-uppercase mb-1 text-white"
              >
                phòng trống
              </div>
              <div class="h5 mb-0 font-weight-bold text-white">
                {{ data.unRooms }}
              </div>
            </div>
            <div class="col-auto">
              <span class="material-symbols-outlined text-white">
                holiday_village</span
              >
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
.boardingCard,
.customerCard {
  background: #ffa07a;
}

.roomCard {
  background: var(--purple);
}
</style>
