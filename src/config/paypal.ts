// config/paypal.ts
import { Client, Environment } from "@paypal/paypal-server-sdk";

const paypalClient = new Client({
  clientCredentialsAuthCredentials: {
    oAuthClientId: process.env.PAYPAL_CLIENT_ID!,
    oAuthClientSecret: process.env.PAYPAL_CLIENT_SECRET!,
  },
  environment: process.env.NODE_ENV === "production" ? Environment.Production : Environment.Sandbox,
  // các tùy chọn khác nếu muốn như timeout, logging...
});

export default paypalClient;
