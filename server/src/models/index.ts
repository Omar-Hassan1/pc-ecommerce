import { sequelize } from '../config/database.config';

import User from './user.model';
import Address from './address.model';
import Category from './category.model';
import Brand from './brand.model';
import Product from './product.model';
import ProductImage from './product-image.model';
import ProductSpecification from './product-specification.model';
import Inventory from './inventory.model';
import Cart from './cart.model';
import CartItem from './cart-item.model';
import Wishlist from './wishlist.model';
import WishlistItem from './wishlist-item.model';
import Order from './order.model';
import OrderItem from './order-item.model';
import Payment from './payment.model';
import ShippingMethod from './shipping-method.model';
import Shipment from './shipment.model';
import Coupon from './coupon.model';
import CouponUsage from './coupon-usage.model';
import Review from './review.model';
import RepairRequest from './repair-request.model';
import RepairFile from './repair-file.model';
import RepairStatusHistory from './repair-status-history.model';
import RepairQuote from './repair-quote.model';
import RepairQuoteItem from './repair-quote-item.model';
import RepairMessage from './repair-message.model';
import TechnicianAssignment from './technician-assignment.model';
import ContactMessage from './contact-message.model';
import NewsletterSubscriber from './newsletter-subscriber.model';

// --- User Associations ---
User.hasMany(Address, { foreignKey: 'userId', as: 'addresses' });
Address.belongsTo(User, { foreignKey: 'userId', as: 'user' });

User.hasMany(Order, { foreignKey: 'userId', as: 'orders' });
Order.belongsTo(User, { foreignKey: 'userId', as: 'user' });

User.hasMany(Review, { foreignKey: 'userId', as: 'reviews' });
Review.belongsTo(User, { foreignKey: 'userId', as: 'user' });

User.hasOne(Wishlist, { foreignKey: 'userId', as: 'wishlist' });
Wishlist.belongsTo(User, { foreignKey: 'userId', as: 'user' });

User.hasOne(Cart, { foreignKey: 'userId', as: 'cart' });
Cart.belongsTo(User, { foreignKey: 'userId', as: 'user' });

User.hasMany(RepairRequest, { foreignKey: 'userId', as: 'repairRequests' });
RepairRequest.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// --- Category & Brand Associations ---
Category.hasMany(Category, { foreignKey: 'parentId', as: 'subcategories' });
Category.belongsTo(Category, { foreignKey: 'parentId', as: 'parentCategory' });

Category.hasMany(Product, { foreignKey: 'categoryId', as: 'products' });
Product.belongsTo(Category, { foreignKey: 'categoryId', as: 'category' });

Brand.hasMany(Product, { foreignKey: 'brandId', as: 'products' });
Product.belongsTo(Brand, { foreignKey: 'brandId', as: 'brand' });

// --- Product Associations ---
Product.hasMany(ProductImage, { foreignKey: 'productId', as: 'images' });
ProductImage.belongsTo(Product, { foreignKey: 'productId', as: 'product' });

Product.hasMany(ProductSpecification, { foreignKey: 'productId', as: 'specifications' });
ProductSpecification.belongsTo(Product, { foreignKey: 'productId', as: 'product' });

Product.hasOne(Inventory, { foreignKey: 'productId', as: 'inventory' });
Inventory.belongsTo(Product, { foreignKey: 'productId', as: 'product' });

Product.hasMany(Review, { foreignKey: 'productId', as: 'reviews' });
Review.belongsTo(Product, { foreignKey: 'productId', as: 'product' });

// --- Cart Associations ---
Cart.hasMany(CartItem, { foreignKey: 'cartId', as: 'items' });
CartItem.belongsTo(Cart, { foreignKey: 'cartId', as: 'cart' });

Product.hasMany(CartItem, { foreignKey: 'productId', as: 'cartItems' });
CartItem.belongsTo(Product, { foreignKey: 'productId', as: 'product' });

// --- Wishlist Associations ---
Wishlist.hasMany(WishlistItem, { foreignKey: 'wishlistId', as: 'items' });
WishlistItem.belongsTo(Wishlist, { foreignKey: 'wishlistId', as: 'wishlist' });

Product.hasMany(WishlistItem, { foreignKey: 'productId', as: 'wishlistItems' });
WishlistItem.belongsTo(Product, { foreignKey: 'productId', as: 'product' });

// --- Order Associations ---
Order.hasMany(OrderItem, { foreignKey: 'orderId', as: 'items' });
OrderItem.belongsTo(Order, { foreignKey: 'orderId', as: 'order' });

Product.hasMany(OrderItem, { foreignKey: 'productId', as: 'orderItems' });
OrderItem.belongsTo(Product, { foreignKey: 'productId', as: 'product' });

Order.hasOne(Payment, { foreignKey: 'orderId', as: 'payment' });
Payment.belongsTo(Order, { foreignKey: 'orderId', as: 'order' });

Order.hasOne(Shipment, { foreignKey: 'orderId', as: 'shipment' });
Shipment.belongsTo(Order, { foreignKey: 'orderId', as: 'order' });

ShippingMethod.hasMany(Order, { foreignKey: 'shippingMethodId', as: 'orders' });
Order.belongsTo(ShippingMethod, { foreignKey: 'shippingMethodId', as: 'shippingMethod' });

ShippingMethod.hasMany(Shipment, { foreignKey: 'shippingMethodId', as: 'shipments' });
Shipment.belongsTo(ShippingMethod, { foreignKey: 'shippingMethodId', as: 'shippingMethod' });

// --- Coupon Associations ---
Coupon.hasMany(CouponUsage, { foreignKey: 'couponId', as: 'usages' });
CouponUsage.belongsTo(Coupon, { foreignKey: 'couponId', as: 'coupon' });

// --- Repair System Associations ---
RepairRequest.hasMany(RepairFile, { foreignKey: 'repairRequestId', as: 'files' });
RepairFile.belongsTo(RepairRequest, { foreignKey: 'repairRequestId', as: 'repairRequest' });

RepairRequest.hasMany(RepairStatusHistory, { foreignKey: 'repairRequestId', as: 'statusHistory' });
RepairStatusHistory.belongsTo(RepairRequest, { foreignKey: 'repairRequestId', as: 'repairRequest' });

RepairRequest.hasMany(RepairQuote, { foreignKey: 'repairRequestId', as: 'quotes' });
RepairQuote.belongsTo(RepairRequest, { foreignKey: 'repairRequestId', as: 'repairRequest' });

RepairQuote.hasMany(RepairQuoteItem, { foreignKey: 'repairQuoteId', as: 'items' });
RepairQuoteItem.belongsTo(RepairQuote, { foreignKey: 'repairQuoteId', as: 'quote' });

RepairRequest.hasMany(RepairMessage, { foreignKey: 'repairRequestId', as: 'messages' });
RepairMessage.belongsTo(RepairRequest, { foreignKey: 'repairRequestId', as: 'repairRequest' });

User.hasMany(RepairMessage, { foreignKey: 'senderId', as: 'sentRepairMessages' });
RepairMessage.belongsTo(User, { foreignKey: 'senderId', as: 'sender' });

RepairRequest.hasMany(TechnicianAssignment, { foreignKey: 'repairRequestId', as: 'technicianAssignments' });
TechnicianAssignment.belongsTo(RepairRequest, { foreignKey: 'repairRequestId', as: 'repairRequest' });

User.hasMany(TechnicianAssignment, { foreignKey: 'technicianId', as: 'assignments' });
TechnicianAssignment.belongsTo(User, { foreignKey: 'technicianId', as: 'technician' });

export {
  sequelize,
  User,
  Address,
  Category,
  Brand,
  Product,
  ProductImage,
  ProductSpecification,
  Inventory,
  Cart,
  CartItem,
  Wishlist,
  WishlistItem,
  Order,
  OrderItem,
  Payment,
  ShippingMethod,
  Shipment,
  Coupon,
  CouponUsage,
  Review,
  RepairRequest,
  RepairFile,
  RepairStatusHistory,
  RepairQuote,
  RepairQuoteItem,
  RepairMessage,
  TechnicianAssignment,
  ContactMessage,
  NewsletterSubscriber
};
