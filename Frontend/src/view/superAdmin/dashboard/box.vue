<!-- -Thống kê hệ thống có bao nhiêu chủ trọ, bao nhiêu nhà trọ, bao nhiêu phòng
trọ,khách trọ -->

<script>
import { reactive, onMounted } from "vue";
//service
import userService from "../../../service/user.service";
//component

export default {
  components: {},
  props: {},
  setup(props, { emit }) {
    const data = reactive({
      item: [],
      boardings: 0,
      customers: 0,
      rooms: 0,
      unRooms: 0,
    });
    onMounted(async () => {
      try {
        // tất cả người dùng
        const document = await userService.getAll();
        data.item = document.message;
        let totalLandlord = 0; // tổng chủ trọ
        let totalTenant = 0; // tổng khách trọ
        let totalBoarding = 0;
        let totalRoom = 0;
        data.item = data.item.map((item) => {
          if (item.isUser == true) {
            totalLandlord++;
            totalBoarding = totalBoarding + item.BoardingHouses.length;
            for (let value of item.BoardingHouses) {
              totalRoom = totalRoom + value.Rooms.length;
            }
          } else totalTenant++;
          return {
            ...item,
          };
        });

        data.item.totalLandloard = totalLandlord;
        data.item.totalTenant = totalTenant - 1;
        data.item.totalBoarding = totalBoarding;
        data.item.totalRoom = totalRoom;
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
    <div class="col-md-3 col-6 mb-4">
      <div class="card border-left-primary shadow h-100 py-2 boardingCard">
        <div class="card-body">
          <div class="row no-gutters align-items-center">
            <div class="col mr-2">
              <div class="font-weight-bold text-white text-uppercase mb-1">
                chủ trọ
              </div>
              <div class="h5 mb-0 font-weight-bold text-white">
                {{ data.item.totalLandloard }}
              </div>
            </div>
            <div class="col-auto">
              <span class="material-symbols-outlined text-white">person</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!--  -->
    <div class="col-md-3 col-6 mb-4">
      <div class="card border-left-primary shadow h-100 py-2 roomCard">
        <div class="card-body">
          <div class="row no-gutters align-items-center">
            <div class="col mr-2">
              <div class="font-weight-bold text-uppercase mb-1 text-white">
                nhà trọ
              </div>
              <div class="h5 mb-0 font-weight-bold text-white">
                {{ data.item.totalBoarding }}
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
    <div class="col-md-3 col-6 mb-4">
      <div class="card border-left-primary shadow h-100 py-2 customerCard">
        <div class="card-body">
          <div class="row no-gutters align-items-center">
            <div class="col mr-2">
              <div class="font-weight-bold text-uppercase mb-1 text-white">
                phòng trọ
              </div>
              <div class="h5 mb-0 font-weight-bold text-white">
                {{ data.item.totalRoom }}
              </div>
            </div>
            <div class="col-auto">
              <span class="material-symbols-outlined text-white">house</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="col-md-3 col-6 mb-4">
      <div class="card border-left-primary shadow h-100 py-2 roomCard">
        <div class="card-body">
          <div class="row no-gutters align-items-center">
            <div class="col mr-2">
              <div class="font-weight-bold text-uppercase mb-1 text-white">
                khách trọ
              </div>
              <div class="h5 mb-0 font-weight-bold text-white">
                {{ data.item.totalTenant }}
              </div>
            </div>
            <div class="col-auto">
              <span class="material-symbols-outlined text-white"> people</span>
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
.font-weight-bold {
  font-size: 18px;
}
</style>
