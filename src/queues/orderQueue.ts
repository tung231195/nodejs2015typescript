import Queue from "bull";

const orderQueue = new Queue("orderQueue", {
  redis: { host: "127.0.0.1", port: 6379 },
});

// Consumer
orderQueue.process(2, async (job) => {
  const order = job.data;
  console.log(`Processing order ${order._id} for ${order.reference}`);

  await new Promise((resolve, reject) => {
    const stockAvailable = 1;
    const paymentSuccess = 1;

    setTimeout(() => {
      if (!stockAvailable) return reject(new Error("Out of stock"));
      if (!paymentSuccess) return reject(new Error("Payment failed"));
      resolve(" processed successfully");
    }, 1000);
  });
});

// Event logging
orderQueue.on("completed", (job) => console.log(`Order ${job.data._id} completed`));

orderQueue.on("failed", (job, err) => console.log(`Order ${job.data._id} failed: ${err.message}`));

export default orderQueue;
