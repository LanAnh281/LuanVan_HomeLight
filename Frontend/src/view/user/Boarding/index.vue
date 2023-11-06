<script>
import {
  ref,
  reactive,
  onBeforeMount,
  onBeforeUnmount,
  computed,
  watch,
} from "vue";
import { useRouter } from "vue-router";
import axios from "axios";

//service
import boardinghouseService from "../../../service/boardinghouse.service";
//component
import Select from "../../../components/select/selectdependent.vue";
import selectNormal from "../../../components/select/select.vue";
import paginationVue from "../../../components/pagination/pagination.vue";

//asset/js
import { checkAccessToken } from "../../../assets/js/common.login";
import { formatCurrency } from "../../../assets/js/format.common";
export default {
  components: { Select, selectNormal, paginationVue },

  setup() {
    const router = useRouter();
    const data = reactive({
      items: [{ name: "" }],
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
              return item.name
                .toLowerCase()
                .includes(data.searchText.toLocaleLowerCase());
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
        const documentBoarding = await boardinghouseService.getAll();
        data.items = documentBoarding.message;

        if (data.address != "") {
          data.items = data.items.filter((item) =>
            item.address.includes(data.address)
          );
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
    return {
      data,
      formatCurrency,
      change,
      changeDistrict,
      changeWard,
      first,
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
          style="height: 38px"
        ></Select>
      </div>
      <div class="input-group col-2">
        <Select
          :title="`Chọn quận huyện`"
          :data="data.district.data.districts"
          @choose="(value) => changeDistrict(value)"
          style="height: 38px"
        ></Select>
      </div>

      <div class="input-group col-2">
        <Select
          :title="`Chọn phường xã`"
          :data="data.ward.data.wards"
          @choose="(value) => changeWard(value)"
          style="height: 38px"
        ></Select>
      </div>
      <!-- <div class="input-group col-2">
        <selectNormal
          :title="`Chọn giá thuê`"
          :data="data.price"
          @choose="(value) => (data.selectPrice = value)"
        ></selectNormal>
      </div> -->
      <div class="input-group col-3" style="z-index: 0">
        <input
          type="search"
          v-model="data.searchText"
          class="w-100 px-2"
          placeholder="tìm kiếm theo tên nhà trọ"
          style="border: 1px solid #ccc; border-radius: 4px; height: 38px"
        />
      </div>
    </div>

    <div
      class="row m-2"
      style="display: grid; grid-template-columns: repeat(5, 1fr)"
    >
      <router-link
        :to="{ name: 'rooms', query: { _id: value._id } }"
        class="card p-2 mb-2 mx-1"
        style=""
        v-for="(value, index) in data.setPage"
        :key="index"
      >
        <img
          class="card-img-top boarding-img border"
          :src="
            Array.isArray(value.Media) && value.Media.length > 0
              ? `http://localhost:3000/static/images/${value.Media[0].name}`
              : `http://localhost:3000/static/images/lightHouse.png`
          "
          alt="ảnh phòng trọ"
          style="object-fit: cover"
        />

        <div class="card-body m-0 p-0 mt-2">
          <h6>Nhà trọ : {{ value.name }}</h6>
          <p class="card-text m-0 p-0">
            <strong> SĐT: </strong>
            {{ value.phone }}
          </p>
          <p class="card-text m-0 p-0">
            <strong> Địa chỉ:</strong>
            {{ value.address }}
          </p>
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
  height: 100vh; /* Đặt chiều cao cho .body theo chiều cao của viewport */
  overflow: auto; /* Cho phép nội dung trượt khi vượt quá chiều cao của .body */
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
.boarding-img:hover {
  scale: 1.05;
  transition: 0.3s ease-in-out;
  border-radius: 4px;
}
</style>
<!-- 1.Ảnh nhà trọ
2. trang homepage
3. thêm quản trị viên -->
