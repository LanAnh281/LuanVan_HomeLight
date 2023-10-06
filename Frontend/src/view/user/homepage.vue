<script>
import {
  ref,
  reactive,
  onMounted,
  onBeforeMount,
  onBeforeUnmount,
  computed,
  watch,
} from "vue";
import { useRoute, useRouter } from "vue-router";
import axios from "axios";

//service
import boardinghouseService from "../../service/boardinghouse.service";
import roomService from "../../service/room.service";
//component
import Select from "../../components/select/selectdependent.vue";
import selectNormal from "../../components/select/select.vue";
import paginationVue from "../../components/pagination/pagination.vue";

//asset/js
import { checkAccessToken } from "../../assets/js/common.login";
import { formatCurrency } from "../../assets/js/format.common";
export default {
  components: { Select, selectNormal, paginationVue },

  setup() {
    const router = useRouter();
    const data = reactive({
      items: [{ name: "", long: "", wide: "" }],
      city: {},
      district: { data: { districts: [] } },
      ward: { data: { wards: [] } },
      address: "",
      price: [
        {
          _id: "under 1000",
          name: "Dưới 1 triệu",
        },
        { _id: "from 1000 to 1500", name: "Từ 1 - 1.5 triệu" },
        { _id: "under 1500", name: "Trên 1.5 triệu" },
      ],
      selectPrice: "",
      searchText: "",
      setPage: "",
      searchPage: "",
      totalPage: 0,
      currentPage: 1,
      length: 0,
      sizePage: 4,
    });
    let intervalId = null;
    const position = ref("");
    data.searchPage = computed(
      () => (
        (data.currentPage = 1),
        data.items
          ? data.items.filter((item) => {
              if (item.BoardingHouse && item.BoardingHouse.name) {
                return item.BoardingHouse.name
                  .toLowerCase()
                  .includes(data.searchText.toLocaleLowerCase());
              }
            })
          : []
      )
    );
    data.totalPage = computed(() =>
      data.searchPage ? Math.ceil(data.searchPage.length / data.sizePage) : 0
    );
    data.length = computed(() =>
      data.searchPage ? data.searchPage.length : 0
    );
    data.setPage = computed(() =>
      data.searchPage
        ? data.searchPage.slice(
            (data.currentPage - 1) * data.sizePage,
            data.currentPage * data.sizePage
          )
        : []
    );
    const change = async (value) => {
      const code = value;

      try {
        const response = await axios.get(
          `https://provinces.open-api.vn/api/p/${code}?depth=2`,
          {}
        );
        data.district = response;
        data.address = data.district.data.name;
        await refresh();
      } catch (error) {
        if (error.response) {
          console.log("Server-side errors", error.response.data);
        } else if (error.request) {
          console.log("Client-side errors", error.request);
        } else {
          console.log("Errors:", error.message);
        }
      }
    };
    const changeDistrict = async (value) => {
      const code = value;
      try {
        const response = await axios.get(
          `https://provinces.open-api.vn/api/d/${code}?depth=2`,
          {}
        );
        data.ward = response;
        data.address = data.ward.data.name;
        await refresh();
      } catch (error) {
        if (error.response) {
          console.log("Server-side errors", error.response.data);
        } else if (error.request) {
          console.log("Client-side errors", error.request);
        } else {
          console.log("Errors:", error.message);
        }
      }
    };
    const changeWard = async (value) => {
      try {
        for (let item of data.ward.data.wards) {
          if (item.code == value) {
            data.address = item.name;
            break;
          }
        }
        await refresh();
        console.log(data.address);
      } catch (error) {
        if (error.response) {
          console.log("Server-side errors", error.response.data);
        } else if (error.request) {
          console.log("Client-side errors", error.request);
        } else {
          console.log("Errors:", error.message);
        }
      }
    };

    watch(
      () => data.selectPrice,
      async (newValue, oldValue) => {
        await refresh();
      }
    );
    const handleRoom = (value) => {
      try {
        console.log("Phòng đã chọn:", value);
      } catch (error) {
        if (error.response) {
          console.log("Server-side errors", error.response.data);
        } else if (error.request) {
          console.log("Client-side errors", error.request);
        } else {
          console.log("Errors:", error.message);
        }
      }
    };
    const refresh = async () => {
      try {
        const documentRoom = await roomService.getAll();
        data.items = documentRoom.message;
        data.items = data.items.filter((item) => item.status == false);
        if (data.address != "") {
          data.items = data.items.filter((item) =>
            item.BoardingHouse.address.includes(data.address)
          );
        }
        if (data.selectPrice != "") {
          switch (data.selectPrice) {
            case "under 1000": {
              data.items = data.items.filter((item) => item.price < 1000000);
              break;
            }
            case "from 1000 to 1500": {
              data.items = data.items.filter(
                (item) => item.price >= 1000000 && item.price <= 1500000
              );

              break;
            }
            case "under 1500": {
              data.items = data.items.filter((item) => item.price > 1500000);

              break;
            }
            default: {
              console.log("không chọn");
            }
          }
        }
      } catch (error) {
        if (error.response) {
          console.log("Server-side errors", error.response.data);
        } else if (error.request) {
          console.log("Client-side errors", error.request);
        } else {
          console.log("Errors:", error.message);
        }
      }
    };
    onBeforeMount(async () => {
      try {
        position.value = localStorage.getItem("position");
        // if (position.value != null) {
        //   checkAccessToken(router);
        //   intervalId = setInterval(async () => {
        //     await checkAccessToken(router);
        //   }, 180 * 60 * 1001); // 60000 milliseconds = 1 minutes
        // }

        await axios
          .get(`https://provinces.open-api.vn/api/?depth=1`, {})
          .then((response) => {
            data.city = response;
          });
        await refresh();
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
    onBeforeUnmount(() => {
      clearInterval(intervalId); // Xóa khoảng thời gian khi component bị hủy
    });

    return {
      data,
      formatCurrency,
      change,
      changeDistrict,
      changeWard,
      handleRoom,
    };
  },
};
</script>
<template>
  <div class="body container-fluid m-0 pr-5" v-if="data.items">
    <div class="row m-0 text-center mt-2">
      <div class="input-group col-2" style="margin-left: 5%">
        <Select
          :title="`Chọn thành phố`"
          :data="data.city.data"
          @choose="(value) => change(value)"
        ></Select>
      </div>
      <div class="input-group col-2">
        <Select
          :title="`Chọn quận huyện`"
          :data="data.district.data.districts"
          @choose="(value) => changeDistrict(value)"
        ></Select>
      </div>

      <div class="input-group col-2">
        <Select
          :title="`Chọn phường xã`"
          :data="data.ward.data.wards"
          @choose="(value) => changeWard(value)"
        ></Select>
      </div>
      <div class="input-group col-2">
        <selectNormal
          :title="`Chọn giá thuê`"
          :data="data.price"
          @choose="(value) => (data.selectPrice = value)"
        ></selectNormal>
      </div>
      <div class="input-group col-3" style="z-index: 0">
        <input
          type="search"
          v-model="data.searchText"
          class="w-100 px-2"
          placeholder="tìm kiếm theo tên nhà trọ"
          style="border: 1px solid #ccc; border-radius: 4px"
        />
      </div>
    </div>

    <div class="row m-2">
      <div
        class="card p-2 mb-2 col-2"
        v-for="(value, index) in data.setPage"
        :key="index"
        @click="handleRoom(value)"
      >
        <img
          class="card-img-top"
          :src="
            value.Media.length > 0
              ? `http://localhost:3000/static/images/${value.Media[0].name}`
              : `http://localhost:3000/static/images/lightHouse.png`
          "
          alt="ảnh phòng trọ"
          style="height: 120px; object-fit: contain"
        />

        <div class="card-body m-0 p-0">
          <p class="card-text">Phòng: {{ value.name }}</p>
          <p class="card-text">
            Diện tích: {{ value.long }} x {{ value.wide }} m²
          </p>
          <p class="card-text">Giá phòng: {{ formatCurrency(value.price) }}</p>
        </div>
      </div>
    </div>
    <paginationVue
      class="m-0 p-0 mt-1"
      :currentPage="data.currentPage"
      :totalPage="data.totalPage"
      :size="data.sizePage"
      :length="data.length"
      @page="(value) => (data.currentPage = value)"
      @previous="
        () => {
          if (data.currentPage > 1) {
            data.currentPage = data.currentPage - 1;
          }
        }
      "
      @next="
        () => {
          if (data.currentPage < data.totalPage) {
            data.currentPage = data.currentPage + 1;
          }
        }
      "
    ></paginationVue>
    <div class="row"></div>
  </div>
</template>
<style scoped>
.body {
  height: 240vh;
}
</style>
<!-- 
    <div
          id="carouselExampleCaptions"
          class="carousel slide"
          data-ride="carousel"
        >
          <ol class="carousel-indicators">
            <li
              data-target="#carouselExampleCaptions"
              data-slide-to="0"
              class="active"
            ></li>
            <li data-target="#carouselExampleCaptions" data-slide-to="1"></li>
            <li data-target="#carouselExampleCaptions" data-slide-to="2"></li>
          </ol>

          <div class="carousel-inner">
            <div class="carousel-item active">
              <img
                src="../../assets/image/background.jpg"
                class="d-block w-100"
                alt="ảnh nhà trọ"
              />
            </div>
            <div class="carousel-item">
              <img
                src="../../assets/image/background.jpg"
                class="d-block w-100"
                alt="ảnh nhà trọ"
              />
            </div>
          </div>
          <button
            class="carousel-control-prev"
            type="button"
            data-target="#carouselExampleCaptions"
            data-slide="prev"
          >
            <span class="carousel-control-prev-icon" aria-hidden="true"></span>
            <span class="sr-only">Previous</span>
          </button>
          <button
            class="carousel-control-next"
            type="button"
            data-target="#carouselExampleCaptions"
            data-slide="next"
          >
            <span class="carousel-control-next-icon" aria-hidden="true"></span>
            <span class="sr-only">Next</span>
          </button>
        </div>
 -->
