const { sequelize } = require('../config/database');

const User = require('./User');
const Address = require('./Address');
const Category = require('./Category');
const Brand = require('./Brand');
const Product = require('./Product');
const ProductImage = require('./ProductImage');
const ProductSpecification = require('./ProductSpecification');
const Inventory = require('./Inventory');
const Cart = require('./Cart');
const CartItem = require('./CartItem');
const Wishlist = require('./Wishlist');
const WishlistItem = require('./WishlistItem');
const Order = require('./Order');
const OrderItem = require('./OrderItem');
const Payment = require('./Payment');
const ShippingMethod = require('./ShippingMethod');
const Shipment = require('./Shipment');
const Coupon = require('./Coupon');
const CouponUsage = require('./CouponUsage');
const Review = require('./Review');
const RepairRequest = require('./RepairRequest');
const RepairFile = require('./RepairFile');
const RepairStatusHistory = require('./RepairStatusHistory');
const RepairQuote = require('./RepairQuote');
const RepairQuoteItem = require('./RepairQuoteItem');
const RepairMessage = require('./RepairMessage');
const TechnicianAssignment = require('./TechnicianAssignment');
const ContactMessage = require('./ContactMessage');
const NewsletterSubscriber = require('./NewsletterSubscriber');

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

module.exports = {
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
