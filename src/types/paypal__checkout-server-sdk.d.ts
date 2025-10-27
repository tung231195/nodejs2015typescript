declare module "@paypal/checkout-server-sdk" {
  export namespace core {
    class PayPalHttpClient {
      constructor(environment: any);
      execute(request: any): Promise<any>;
    }
    class SandboxEnvironment {
      constructor(clientId: string, clientSecret: string);
    }
    class LiveEnvironment {
      constructor(clientId: string, clientSecret: string);
    }
  }

  export namespace orders {
    class OrdersCreateRequest {
      constructor();
      requestBody(body: any): void;
      prefer(value: string): void;
    }
    class OrdersCaptureRequest {
      constructor(orderId: string);
      requestBody(body: any): void;
    }
  }
}
