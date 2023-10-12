<template>
  <div>
    <button @click="handlePay">Pay with PayPal</button>
  </div>
</template>

<script>
import paypal from "paypal-rest-sdk";

export default {
  setup() {
    const handlePay = async () => {
      // Tạo đơn hàng PayPal
      const createPayment = {
        intent: "sale",
        payer: {
          payment_method: "paypal",
        },
        transactions: [
          {
            amount: {
              total: "10.00",
              currency: "USD",
            },
          },
        ],
        redirect_urls: {
          return_url: "http://localhost:3000/success",
          cancel_url: "http://localhost:3000/cancel",
        },
      };

      paypal.payment.create(createPayment, (error, payment) => {
        if (error) {
          console.error(error);
        } else {
          // Chuyển người dùng đến trang thanh toán PayPal
          for (let link of payment.links) {
            if (link.method === "redirect") {
              window.location.href = link.href;
            }
          }
        }
      });
    };

    return {
      handlePay,
    };
  },
};
</script>
