const paypal = require("paypal-rest-sdk");
const {
  Payment,
  Users,
  BorardingHouse,
  Bill,
  Receipt,
} = require("../models/index.model");
exports.hien = (req, res, next) => {
  res.json({ hi: "hello" });
};
// paypal.configure({
//   mode: "sandbox", //sandbox or live
//   client_id:
//     "AUx79GN75wtsieggQqfykauj9mYDTmnb9sWjkkx-qCwP1NiaJX59Kg5jypChJ-mxfpT1lfsbnD52ImEI",
//   client_secret:
//     "EJMEPqAIH2Goh-iXFt79S18RSpvkH6lkNdF4YD9ClBYn7un_TRsn_47ZdybtHPTS9YnT5gpbsb6_E8la",
// });
exports.taopaypal = async (req, res, next) => {
  console.log("Body pay,", req.body._id, req.body.boardingId);
  const documentLand = await BorardingHouse.findOne({
    where: {
      _id: req.body.boardingId,
    },
  });
  console.log("----land:", documentLand);
  const documentPay = await Payment.findOne({
    where: {
      userId: documentLand.userId,
    },
  });
  console.log("-----PPPPay", documentPay);
  paypal.configure({
    mode: "sandbox", //sandbox or live
    // client_id:
    //   "AUx79GN75wtsieggQqfykauj9mYDTmnb9sWjkkx-qCwP1NiaJX59Kg5jypChJ-mxfpT1lfsbnD52ImEI",
    // client_secret:
    //   "EJMEPqAIH2Goh-iXFt79S18RSpvkH6lkNdF4YD9ClBYn7un_TRsn_47ZdybtHPTS9YnT5gpbsb6_E8la",
    client_id: documentPay.clientId,
    client_secret: documentPay.secretId,
  });
  const create_payment_json = {
    intent: "sale",
    payer: {
      payment_method: "paypal",
    },
    redirect_urls: {
      return_url: `http://localhost:3000/api/paypal/success?received=${req.body.total}&_id=${req.body._id}&clientId=${documentPay.clientId}&secretId=${documentPay.secretId}`,
      cancel_url: "http://localhost:3000/api/paypal/cancel",
    },
    transactions: [
      {
        item_list: {
          items: [
            {
              name: "Thanh toán hóa đơn tiền trọ",
              sku: "001",
              // price: `${req.body.tongtien}`,
              price: `${req.body.total}`,
              currency: "USD",
              quantity: 1,
            },
          ],
        },
        amount: {
          currency: "USD",
          // total: `${req.body.tongtien}`,
          total: `${req.body.total}`,
        },
        description: "Thanh toán hóa đơn tiền trọ",
      },
    ],
  };
  paypal.payment.create(create_payment_json, function (error, payment) {
    if (error) {
      throw error;
    } else {
      for (let i = 0; i < payment.links.length; i++) {
        if (payment.links[i].rel === "approval_url") {
          // res.redirect(payment.links[i].href);
          res.send(payment.links[i].href);
        }
      }
    }
  });
};
exports.thanhcong = (req, res) => {
  console.log(req.query.received);
  paypal.configure({
    mode: "sandbox", //sandbox or live
    // client_id:
    //   "AUx79GN75wtsieggQqfykauj9mYDTmnb9sWjkkx-qCwP1NiaJX59Kg5jypChJ-mxfpT1lfsbnD52ImEI",
    // client_secret:
    //   "EJMEPqAIH2Goh-iXFt79S18RSpvkH6lkNdF4YD9ClBYn7un_TRsn_47ZdybtHPTS9YnT5gpbsb6_E8la",
    client_id: req.query.clientId,
    client_secret: req.query.secretId,
  });
  const payerId = req.query.PayerID;
  const paymentId = req.query.paymentId;

  const execute_payment_json = {
    payer_id: payerId,
    transactions: [
      {
        amount: {
          currency: "USD",
          total: `${req.query.received}`,
        },
      },
    ],
  };
  paypal.payment.execute(
    paymentId,
    execute_payment_json,

    async (error, payment) => {
      if (error) {
        console.log(error.response);
        throw error;
      } else {
        // console.log(JSON.stringify(payment));
        // console.log("---Total:", payment.transactions[0].amount.total);
        // res.send('Success (Mua hàng thành công)');

        // tìm hóa đơn
        const documentBill = await Bill.findOne({
          where: { _id: req.query._id },
        });
        console.log("--Bill:", documentBill);
        // cập nhật lại hóa đơn sau khi thanh toán
        const updateBill = await Bill.update(
          {
            debt:
              Number(documentBill.debt) -
              Number(payment.transactions[0].amount.total),
          },
          { where: { _id: req.query._id } }
        );
        console.log("--update:", updateBill);
        //tạo hoặc update
        const documentReceipt = await Receipt.findOne({
          where: {
            billId: req.query._id,
          },
        });
        console.log("---Receipt:", documentReceipt);
        if (documentReceipt != null) {
          //update

          const updateReceipt = await Receipt.update(
            {
              receive:
                Number(documentReceipt.receive) +
                Number(payment.transactions[0].amount.total),
              debt:
                Number(documentReceipt.debt) -
                Number(payment.transactions[0].amount.total),
            },
            {
              where: {
                _id: documentReceipt._id,
              },
            }
          );
          console.log("---Update receipt:", updateReceipt);
        } else {
          //create
          const createReceipt = await Receipt.create({
            receive: payment.transactions[0].amount.total,
            debt:
              Number(documentBill.total) -
              Number(payment.transactions[0].amount.total),
            billId: req.query._id,
          });
          console.log("---create receipt:", createReceipt);
        }
      }

      res.writeHead(302, {
        Location: `http://localhost:3001/billCustomer?status=1`,
        //add other headers here...
      });
      res.end();
    }
  );
};
exports.thatbai = (req, res) => {
  res.writeHead(302, {
    Location: "http://localhost:3001/post",
  });
  res.end();
};
