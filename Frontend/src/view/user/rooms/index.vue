<script>
import {
  ref,
  reactive,
  onBeforeMount,
  onBeforeUnmount,
  computed,
  watch,
} from "vue";
import { useRoute, useRouter } from "vue-router";
import axios from "axios";

//service
import roomService from "../../../service/room.service";
//component
import Select from "../../../components/select/selectdependent.vue";
import selectNormal from "../../../components/select/select.vue";
import paginationVue from "../../../components/pagination/pagination.vue";

//asset/js
import { formatCurrency } from "../../../assets/js/format.common";
export default {
  components: { Select, selectNormal, paginationVue },

  setup() {
    const router = useRouter();
    const route = useRoute();
    const data = reactive({
      items: [{ name: "", long: "", wide: "", Media: [{ name: "" }] }],
      city: {},
      district: { data: { districts: [] } },
      ward: { data: { wards: [] } },
      address: "",
      price: 0,
      max: 0,
      min: 0,
      selectPrice: "",
      searchText: "",
      setPage: "",
      searchPage: "",
      totalPage: 0,
      currentPage: 1,
      length: 0,
      sizePage: 10,
    });
    let intervalId = null;
    const position = ref("");
    data.searchPage = computed(() => {
      return (
        (data.currentPage = 1),
        data.items
          ? data.items.filter((item) => {
              if (item && item.name) {
                return item.name
                  .toLowerCase()
                  .includes(data.searchText.toLocaleLowerCase());
              }
            })
          : []
      );
    });
    data.totalPage = computed(() => {
      return data.searchPage
        ? Math.ceil(data.searchPage.length / data.sizePage)
        : 0;
    });
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
      () => data.price,
      async (newValue, oldValue) => {
        data.price = newValue;
        await refresh();
      }
    );

    const refresh = async () => {
      try {
        const documentRoom = await roomService.getAllRoom(route.query["_id"]);
        data.items = documentRoom.message;
        if (data.address != "") {
          data.items = data.items.filter((item) =>
            item.BoardingHouse.address.includes(data.address)
          );
        }

        data.max = data.items[0].price;
        data.min = data.items[0].price;
        for (let value of data.items) {
          if (Number(value.price) > data.max) {
            data.max = value.price;
          }
          if (Number(value.price) < data.min) {
            data.min = value.price;
          }
        }
        if (data.price == 0) {
          data.price = data.min;
        }

        data.items = data.items.filter(
          (item) => Number(item.price) <= data.price
        );

        data.items = data.items.sort((a, b) => a.status - b.status);
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
    const first = () => {
      console.log("first");
      const scrollToTopButton = document.getElementById("scrollToTopButton");

      window.onscroll = () => {
        if (
          document.body.scrollTop > 20 ||
          document.documentElement.scrollTop > 20
        ) {
          scrollToTopButton.style.display = "block";
        } else {
          scrollToTopButton.style.display = "none";
        }
      };

      scrollToTopButton.addEventListener("click", () => {
        document.body.scrollTop = 0; // For Safari
        document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
      });
    };
    const sliderValue = ref(0);
    return {
      data,
      formatCurrency,
      change,
      changeDistrict,
      changeWard,
      first,
      sliderValue,
    };
  },
};
</script>
<template>
  <div class="body container-fluid m-0 pr-5" v-if="data.items">
    <router-link :to="{ name: 'boarding' }" class="text-primary mx-2">
      <span class="" style="font-size: 16px; text-transform: uppercase"
        >Nhà trọ /
      </span>
      <span class="title" style="font-size: 16px">Phòng </span>
    </router-link>
    <div class="row m-0 text-center mt-2">
      <!-- <div class="input-group col-2" style="margin-left: 5%">
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
      </div> -->
      <div class="input-group col-3" style="z-index: 0">
        <input
          type="search"
          v-model="data.searchText"
          class="w-100 px-2"
          placeholder="tìm kiếm theo tên phòng trọ"
          style="border: 1px solid #ccc; border-radius: 4px; height: 38px"
        />
      </div>
      <div class="input-group col-4 m-0">
        <!-- <selectNormal
          :title="`Chọn giá thuê`"
          :data="data.price"
          @choose="(value) => (data.selectPrice = value)"
        ></selectNormal> -->

        <label for="customRange1" class="form-label">Giá thuê</label>
        <input
          type="range"
          class="form-range"
          id="customRange1"
          :min="data.min"
          :max="data.max"
          v-model="data.price"
        />

        {{ formatCurrency(data.price) }} đ
      </div>
    </div>
    <!-- <input type="range" min="0" max="100" v-model="sliderValue" />
    {{ sliderValue }} -->

    <div
      class="row m-1"
      style="display: grid; grid-template-columns: repeat(5, 1fr)"
    >
      <router-link
        :to="{ name: 'roomDetail', query: { _id: value._id } }"
        class="card p-2 mb-2 mx-1"
        v-for="(value, index) in data.setPage"
        :key="index"
      >
        <img
          v-if="value.status == true"
          src="https://theme.hstatic.net/1000367813/1000963523/14/sold.png?v=170"
          alt="ảnh sold out"
          style="position: absolute; z-index: 1; margin-left: 72%; width: 25%"
        />
        <img
          class="card-img-top room-img"
          :src="
            value.Media.length > 0
              ? `http://localhost:3000/static/images/${value.Media[0].name}`
              : `http://localhost:3000/static/images/lightHouse.png`
          "
          alt="ảnh phòng trọ"
          style="width: 100%; height: 200px; object-fit: cover"
        />

        <div class="card-body m-0 p-0">
          <p class="card-text">Phòng {{ value.name }}</p>
          <p class="card-text">
            Diện tích: {{ value.long }} x {{ value.wide }} m²
          </p>
          <p class="card-text">Giá phòng: {{ formatCurrency(value.price) }}</p>
          <!-- <p class="card-text">
            Trạng thái: {{ value.status ? "Đã thuê" : "Chưa thuê" }}
          </p> -->
        </div>
      </router-link>
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
    <button id="scrollToTopButton" @click="first">
      <span class="material-symbols-outlined text-white"> arrow_upward </span>
    </button>
  </div>
</template>
<style scoped>
.body {
  height: 160vh;
}
a:hover {
  text-decoration: none;
  background: #f9f9f9;
}
#scrollToTopButton {
  display: block;
  position: fixed;
  bottom: 50px;
  right: 30px;
  z-index: 5;
  background-color: var(--chocolate);
  color: #fff;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  padding: 15px;
  font-size: 16px;
}
.room-img:hover {
  scale: 1.02;
  transition: 0.3s ease-in-out;
  border-radius: 4px;
}
</style>
