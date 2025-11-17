import { Request, Response } from "express";
import Stripe from "stripe";
import paypalCheckout from "@paypal/checkout-server-sdk";
import crypto, { sign } from "crypto";
import axios from "axios";
import qs from "qs";
import QRCode from "qrcode";

export const paypalStripe = async (req: Request, res: Response) => {
  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
    console.log(
      "env srip",
      process.env.STRIPE_SECRET_KEY,
      `${process.env.FRONTEND_ORIGIN}/checkout/success`,
    );
    const { items, shippingAddress, userId } = req.body || [];
    console.log("items checkout", req.body, items, shippingAddress, userId);
    // map giỏ hàng thành line_items

    const line_items = items.map((item: any) => {
      item.image = item.image ? `${process.env.BACKEND_ORIGIN}/${item.image}` : "";
      return {
        price_data: {
          currency: "usd",
          product_data: { name: item.name, images: [item.image || ""] },
          unit_amount: Math.round(item.price * 100),
        },
        quantity: item.quantity,
      };
    });
    console.log("line item", line_items);
    const frontend = process.env.FRONTEND_ORIGIN?.replace(/\/$/, ""); // ✅ remove trailing slash

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items,
      mode: "payment",
      success_url: `${frontend}/checkout/success`,
      cancel_url: `${frontend}/cart`,
      metadata: {
        userId,
        cartItems: JSON.stringify(items),
        shippingAddress: JSON.stringify(shippingAddress),
      },
    });
    console.log("session", session);
    return res.status(200).json({ id: session.id, url: session.url });
  } catch (err: any) {
    console.error("Stripe error:", err);
  }
  return {};
};

const environment = new paypalCheckout.core.SandboxEnvironment(
  process.env.PAYPAL_CLIENT_ID ?? "123",
  process.env.PAYPAL_CLIENT_SECRET ?? "333",
);
const client = new paypalCheckout.core.PayPalHttpClient(environment);
export async function paypalCheckoutSDK(req: Request, res: Response) {
  if (req.method === "POST") {
    const request = new paypalCheckout.orders.OrdersCreateRequest();
    request.prefer("return=representation");
    request.requestBody({
      intent: "CAPTURE",
      purchase_units: [
        {
          amount: {
            currency_code: "USD",
            value: "10.00",
          },
        },
      ],
    });

    try {
      const order = await client.execute(request);
      res.status(200).json(order.result);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
}

export async function paypalMomo(req: Request, res: Response) {
  console.log("aaaaaaaaaaaaaaaaaaa");
  const partnerCode = "MOMO_TESTER";
  const accessKey = "F8BBA842ECF85";
  const secretKey = "K951B6PE1waDMi640xX08PD3vg6EkVlz";

  const orderId = Date.now().toString();
  const requestId = Date.now().toString();
  const amount = "10000";
  const orderInfo = "Test Payment"; // không có dấu
  const redirectUrl = "http://127.0.0.1:3000/momo-return";
  const ipnUrl = "http://127.0.0.1:3000/api/momo-webhook";

  const rawSignature = `accessKey=${accessKey}&amount=${amount}&extraData=&ipnUrl=${ipnUrl}&orderId=${orderId}&orderInfo=${orderInfo}&partnerCode=${partnerCode}&redirectUrl=${redirectUrl}&requestId=${requestId}&requestType=captureMoMoWallet`;

  const signature = crypto.createHmac("sha256", secretKey).update(rawSignature).digest("hex");
  console.log("raw", rawSignature, "sign", signature);
  const body = {
    partnerCode,
    accessKey,
    requestId,
    amount,
    orderId,
    orderInfo,
    redirectUrl,
    ipnUrl,
    extraData: "",
    requestType: "captureMoMoWallet",
    signature,
  };

  axios
    .post("https://test-payment.momo.vn/v2/gateway/api/create", body, {
      headers: { "Content-Type": "application/json" },
    })
    .then((res) => console.log(res.data))
    .catch((err) => console.error(err.response?.data || err.message));
}

export async function vnPay(req: Request, res: Response) {
  console.log("Run to VNPay");

  const { amount, orderId } = req.body;
  const vnp_TmnCode = process.env.VNP_TMNCODE!;
  const vnp_HashSecret = process.env.VNP_HASHSECRET!;
  const vnp_Url = process.env.VNP_URL!;
  const vnp_ReturnUrl = process.env.VNP_RETURN_URL!;

  const date = new Date();
  const createDate = date
    .toISOString()
    .replace(/[-T:\.Z]/g, "")
    .slice(0, 14);
  const ipAddr = "127.0.0.1";

  let vnp_Params: Record<string, string | number> = {
    vnp_Version: "2.1.0",
    vnp_Command: "pay",
    vnp_TmnCode,
    vnp_Locale: "vn",
    vnp_CurrCode: "VND",
    vnp_TxnRef: orderId.toString(),
    vnp_OrderInfo: `Thanh toan don hang #${orderId}`,
    vnp_OrderType: "other",
    vnp_Amount: amount * 100,
    vnp_ReturnUrl,
    vnp_IpAddr: ipAddr,
    vnp_CreateDate: createDate,
  };

  // ✅ Bước 1: Sort alphabet (theo chuẩn VNPAY)
  const sortedKeys = Object.keys(vnp_Params).sort();
  const sortedParams: Record<string, string | number> = {};
  sortedKeys.forEach((key) => {
    sortedParams[key] = vnp_Params[key];
  });

  // ✅ Bước 2: Tạo chuỗi signData đã encode
  const signData = sortedKeys
    .map((key) => `${key}=${encodeURIComponent(String(sortedParams[key]))}`)
    .join("&");
  console.log("signData =", signData);
  // ✅ Bước 3: Tạo chữ ký
  const hmac = crypto.createHmac("sha512", vnp_HashSecret);
  const signed = hmac.update(signData).digest("hex");

  // ✅ Bước 4: Gắn chữ ký vào params
  sortedParams["vnp_SecureHash"] = signed;

  // ✅ Bước 5: Tạo URL thanh toán
  const paymentUrl = `${vnp_Url}?${qs.stringify(sortedParams, { encode: true })}`;

  return res.status(200).json({ paymentUrl });
}

export async function processStripeWebhook(req: Request, res: Response) {
  console.log("run to processing webhook");
  if (!process.env.STRIPE_SECRET_KEY) return;
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

  const sig = req.headers["stripe-signature"];

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig as string,
      process.env.STRIPE_WEBHOOK_SECRET!,
    );
  } catch (err: any) {
    console.error("❌ Webhook error:", err.message);
    res.status(400).json({ error: err.message });
  }
  console.log("run to webhook");
  if (event && event.type === "checkout.session.completed") {
    const session = event.data.object;
    console.log("✅ Payment success 123:", session.metadata);
    try {
      const userId = session.metadata?.userId;
      const items = JSON.parse(session.metadata?.cartItems || "[]");
      const shippingAddress = JSON.parse(session.metadata?.shippingAddress || "{}");

      const newOrder = {
        user: userId,
        reference: session.id,
        items,
        shippingAddress,
        paymentMethod: "stripe",
        paymentResult: {
          id: session.payment_intent,
          status: session.payment_status,
          update_time: new Date().toISOString(),
          email_address: session.customer_email ?? "",
        },
        itemsPrice: Number(session.amount_subtotal) / 100,
        shippingPrice: 0,
        taxPrice: 0,
        totalPrice: Number(session.amount_total) / 100,
        isPaid: true,
        paidAt: new Date(),
        isDelivered: false,
        status: "processing",
      };
    } catch (error) {
      console.error("❌ Failed to save order:", error);
    }
  }
}

// src/controllers/payment.controller.ts

export const createQrPayment = async (req: Request, res: Response) => {
  try {
    const { amount, orderId, bankAccount, bankName, content } = req.body;

    // Nội dung QR (giả lập VNPay hoặc ngân hàng)
    const qrData = `PAYMENT|BANK:${bankName}|ACCOUNT:${bankAccount}|AMOUNT:${amount}|CONTENT:${content || `ORDER_${orderId}`}`;

    // Tạo ảnh QR base64
    const qrImage = await QRCode.toDataURL(qrData);

    res.status(200).json({
      success: true,
      qrImage,
      message: "QR code created successfully",
    });
  } catch (error) {
    console.error("QR error:", error);
    res.status(500).json({ success: false, message: "Failed to create QR" });
  }
};
