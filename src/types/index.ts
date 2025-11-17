import mongoose, { Document, Types } from "mongoose";
export type AuthProvider = "local" | "google" | "facebook";
export interface IUser {
  googleId: string;
  authProvider: AuthProvider;
  role: "user" | "admin" | "superadmin";
  picture: string;
  name: string;
  email: string;
  password?: string;
  status?: "enable" | "disabled";
  resetPasswordToken?: string;
  resetPasswordExpire?: Date;
}

export interface IUserDoc extends IUser, Document {
  comparePassword(password: string): Promise<boolean>;
}

export interface IUserInput {
  googleId?: string;
  email: string;
  name?: string;
  picture?: string;
  authProvider?: "local" | "google" | "facebook";
  password?: string;
}
export interface IPost {
  user: string;
  content: string;
  likes: string[];
  images?: string[];
}

export interface IPostDoc extends IPost, Document {}

export interface IComment {
  post: string;
  user: string;
  content: string;
  likes: string[];
}

export interface ICommentDoc extends IComment, Document {}

export enum AttributeScope {
  PRODUCT = "product", // thuộc về product
  VARIANT = "variant", // dùng để sinh variant
}
export type AttributeType = "string" | "number" | "boolean" | "enum";

export interface IAttributeOption {
  value: string;
  label: string;
}

export interface IAttribute {
  name: string;
  slug: string;
  type: AttributeType;
  options?: IAttributeOption[];
  unit?: string;
  isFilterable: boolean;
  isVisible: boolean;
}

export interface IAttributeDoc extends IAttribute, Document {}

export interface IProductAttributeValue {
  attribute: mongoose.Types.ObjectId | IAttribute;
  valueString?: string;
  valueNumber?: number;
  valueBoolean?: boolean;
}
export interface IProductAttributeValueDoc extends IProductAttributeValue, Document {}

export interface IVariant {
  sku?: string;
  price: number;
  compareAtPrice?: number;
  stock: number;
  attributes?: IProductAttributeValue[];
  images?: string[];
}

export interface IVariantDoc extends IVariant, Document {}

export interface ICategory {
  name: string;
  description: string;
  slug: string;
}

export interface ICategoryDoc extends ICategory, Document {}

export type DiscountType = {
  type: "percent" | "amount";
  value: number;
};

export interface IProduct {
  name: string;
  type: "simple" | "variant";
  slug: string;
  variants?: Types.DocumentArray<IVariant>;
  attributes: IProductAttributeValue[];
  description?: string;
  price: number;
  discount: DiscountType;
  finalPrice: number;
  endDate?: Date;
  stock: number;
  category: mongoose.Types.ObjectId;
  images: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface IProductDoc extends IProduct, Document {}

export interface IOrderItem {
  product: mongoose.Types.ObjectId; // tham chiếu tới Product
  name: string; // tên lúc mua (tránh thay đổi khi product update)
  quantity: number;
  price: number;
  image: string;
}

export interface IOrderItemDoc extends IOrderItem, Document {}
export interface IOPTION {
  label: string;
  value: string | number;
}
export interface IAddress {
  name: string; // Họ và tên người nhận
  phone: string; // Số điện thoại
  country: string; // Quốc gia (VD: "Vietnam")
  province: IOPTION | null; // Tỉnh / Thành phố
  district: IOPTION | null; // Quận / Huyện
  ward?: IOPTION | null; // Phường / Xã
  email?: string; // (Tùy chọn) email người nhận
  postalCode?: string; // Mã bưu điện (tùy chọn)
  company?: string; // Công ty (nếu có)
  note?: string; // Ghi chú giao hàng
  isDefault?: boolean; // Đặt làm địa chỉ mặc định
}
export interface IAddressItemDoc extends IAddress, Document {}

export interface IPayment {
  method: "paypal" | "stripe" | "momo" | "cod" | "qrcode";
  status: "pending" | "paid" | "failed" | "refunded";
  transactionId?: string;
  paidAt?: Date;
  amount?: number;
  currency?: string;
  rawResponse?: any; // optional log raw API response
}
export interface IPaymentItemDoc extends IPayment, Document {}

export interface IDelivery {
  method: "ghn" | "ghtk" | "vnpost" | "grab" | "manual";
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  trackingNumber?: string;
  shippedAt?: Date;
  deliveredAt?: Date;
  shippingFee: number;
}
export interface IDeliveryItemDoc extends IDelivery, Document {}

export interface IOrder extends Document {
  user: mongoose.Types.ObjectId; // tham chiếu tới User
  reference: string;
  items: IOrderItem[];
  shippingAddress: IAddress;
  paymentMethod: string; // COD, PayPal, Stripe...
  paymentResult?: {
    id: string;
    status: string;
    update_time: string;
    email_address: string;
  };
  itemsPrice: number; // tổng giá sản phẩm
  shippingPrice: number; // phí ship
  taxPrice: number; // thuế
  totalPrice: number; // tổng cộng
  isPaid: boolean;
  paidAt?: Date;
  isDelivered: boolean;
  deliveredAt?: Date;
  status: "pending" | "processing" | "delivered" | "cancel";
}

export interface IOrderDoc extends IOrder, Document {}

export interface ISLideshow {
  title: string;
  description?: string;
  image: string[];
  link: string;
  status: "enable" | "disabled";
}

export interface ISlideshowDoc extends ISLideshow, Document {}
