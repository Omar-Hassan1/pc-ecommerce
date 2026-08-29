import { QueryInterface, DataTypes } from 'sequelize';

export const up = async ({ context: queryInterface }: { context: QueryInterface }): Promise<void> => {
  // 1. Users
  await queryInterface.createTable('users', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    firstName: { type: DataTypes.STRING(50), allowNull: false },
    lastName: { type: DataTypes.STRING(50), allowNull: false },
    email: { type: DataTypes.STRING(100), allowNull: false, unique: true },
    phone: { type: DataTypes.STRING(30), allowNull: true },
    password: { type: DataTypes.STRING(255), allowNull: false },
    role: {
      type: DataTypes.ENUM('CUSTOMER', 'TECHNICIAN', 'ADMIN', 'SUPER_ADMIN'),
      defaultValue: 'CUSTOMER'
    },
    avatar: { type: DataTypes.STRING(255), allowNull: true },
    isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
    resetPasswordToken: { type: DataTypes.STRING, allowNull: true },
    resetPasswordExpires: { type: DataTypes.DATE, allowNull: true },
    createdAt: { type: DataTypes.DATE, allowNull: false },
    updatedAt: { type: DataTypes.DATE, allowNull: false }
  });

  // 2. Addresses
  await queryInterface.createTable('addresses', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: 'users', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    addressLine1: { type: DataTypes.STRING(255), allowNull: false },
    addressLine2: { type: DataTypes.STRING(255), allowNull: true },
    city: { type: DataTypes.STRING(100), allowNull: false },
    state: { type: DataTypes.STRING(100), allowNull: false },
    postalCode: { type: DataTypes.STRING(20), allowNull: false },
    country: { type: DataTypes.STRING(100), allowNull: false },
    isDefault: { type: DataTypes.BOOLEAN, defaultValue: false },
    addressType: {
      type: DataTypes.ENUM('SHIPPING', 'BILLING', 'BOTH'),
      defaultValue: 'BOTH'
    },
    createdAt: { type: DataTypes.DATE, allowNull: false },
    updatedAt: { type: DataTypes.DATE, allowNull: false }
  });

  // 3. Categories
  await queryInterface.createTable('categories', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    name: { type: DataTypes.STRING(100), allowNull: false },
    slug: { type: DataTypes.STRING(120), allowNull: false, unique: true },
    description: { type: DataTypes.TEXT, allowNull: true },
    image: { type: DataTypes.STRING(255), allowNull: true },
    parentId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: { model: 'categories', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    },
    icon: { type: DataTypes.STRING(50), allowNull: true },
    createdAt: { type: DataTypes.DATE, allowNull: false },
    updatedAt: { type: DataTypes.DATE, allowNull: false }
  });

  // 4. Brands
  await queryInterface.createTable('brands', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    name: { type: DataTypes.STRING(100), allowNull: false },
    slug: { type: DataTypes.STRING(120), allowNull: false, unique: true },
    logo: { type: DataTypes.STRING(255), allowNull: true },
    description: { type: DataTypes.TEXT, allowNull: true },
    createdAt: { type: DataTypes.DATE, allowNull: false },
    updatedAt: { type: DataTypes.DATE, allowNull: false }
  });

  // 5. Products
  await queryInterface.createTable('products', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    name: { type: DataTypes.STRING(255), allowNull: false },
    slug: { type: DataTypes.STRING(280), allowNull: false, unique: true },
    sku: { type: DataTypes.STRING(50), allowNull: false, unique: true },
    categoryId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: 'categories', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    brandId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: 'brands', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    description: { type: DataTypes.TEXT, allowNull: true },
    shortDescription: { type: DataTypes.TEXT, allowNull: true },
    price: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    salePrice: { type: DataTypes.DECIMAL(10, 2), allowNull: true },
    cost: { type: DataTypes.DECIMAL(10, 2), allowNull: true },
    stockQuantity: { type: DataTypes.INTEGER, defaultValue: 0 },
    lowStockThreshold: { type: DataTypes.INTEGER, defaultValue: 5 },
    weight: { type: DataTypes.DECIMAL(8, 2), defaultValue: 1.0 },
    dimensions: { type: DataTypes.STRING(100), allowNull: true },
    warranty: { type: DataTypes.STRING(100), defaultValue: '2 Years Manufacturer Warranty' },
    isFeatured: { type: DataTypes.BOOLEAN, defaultValue: false },
    isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
    averageRating: { type: DataTypes.DECIMAL(3, 2), defaultValue: 0.0 },
    reviewCount: { type: DataTypes.INTEGER, defaultValue: 0 },
    createdAt: { type: DataTypes.DATE, allowNull: false },
    updatedAt: { type: DataTypes.DATE, allowNull: false }
  });

  await queryInterface.addIndex('products', ['slug']);
  await queryInterface.addIndex('products', ['sku']);
  await queryInterface.addIndex('products', ['categoryId']);
  await queryInterface.addIndex('products', ['brandId']);
  await queryInterface.addIndex('products', ['price']);
  await queryInterface.addIndex('products', ['isFeatured']);

  // 6. Product Images
  await queryInterface.createTable('product_images', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    productId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: 'products', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    imageUrl: { type: DataTypes.STRING(500), allowNull: false },
    isPrimary: { type: DataTypes.BOOLEAN, defaultValue: false },
    sortOrder: { type: DataTypes.INTEGER, defaultValue: 0 },
    createdAt: { type: DataTypes.DATE, allowNull: false },
    updatedAt: { type: DataTypes.DATE, allowNull: false }
  });

  // 7. Product Specifications
  await queryInterface.createTable('product_specifications', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    productId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: 'products', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    specKey: { type: DataTypes.STRING(100), allowNull: false },
    specValue: { type: DataTypes.TEXT, allowNull: false },
    groupName: { type: DataTypes.STRING(100), defaultValue: 'General' },
    createdAt: { type: DataTypes.DATE, allowNull: false },
    updatedAt: { type: DataTypes.DATE, allowNull: false }
  });

  // 8. Inventory
  await queryInterface.createTable('inventory', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    productId: {
      type: DataTypes.UUID,
      allowNull: false,
      unique: true,
      references: { model: 'products', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    stockQuantity: { type: DataTypes.INTEGER, defaultValue: 0 },
    reservedQuantity: { type: DataTypes.INTEGER, defaultValue: 0 },
    availableQuantity: { type: DataTypes.INTEGER, defaultValue: 0 },
    lowStockThreshold: { type: DataTypes.INTEGER, defaultValue: 5 },
    createdAt: { type: DataTypes.DATE, allowNull: false },
    updatedAt: { type: DataTypes.DATE, allowNull: false }
  });

  // 9. Carts
  await queryInterface.createTable('carts', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    userId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: { model: 'users', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    },
    sessionId: { type: DataTypes.STRING(100), allowNull: true },
    createdAt: { type: DataTypes.DATE, allowNull: false },
    updatedAt: { type: DataTypes.DATE, allowNull: false }
  });

  // 10. Cart Items
  await queryInterface.createTable('cart_items', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    cartId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: 'carts', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    productId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: 'products', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    quantity: { type: DataTypes.INTEGER, defaultValue: 1, allowNull: false },
    price: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    createdAt: { type: DataTypes.DATE, allowNull: false },
    updatedAt: { type: DataTypes.DATE, allowNull: false }
  });

  // 11. Wishlists
  await queryInterface.createTable('wishlists', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      unique: true,
      references: { model: 'users', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    createdAt: { type: DataTypes.DATE, allowNull: false },
    updatedAt: { type: DataTypes.DATE, allowNull: false }
  });

  // 12. Wishlist Items
  await queryInterface.createTable('wishlist_items', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    wishlistId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: 'wishlists', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    productId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: 'products', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    createdAt: { type: DataTypes.DATE, allowNull: false },
    updatedAt: { type: DataTypes.DATE, allowNull: false }
  });

  // 13. Shipping Methods
  await queryInterface.createTable('shipping_methods', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    name: { type: DataTypes.STRING(100), allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: true },
    estimatedDays: { type: DataTypes.STRING(50), allowNull: false },
    basePrice: { type: DataTypes.DECIMAL(10, 2), allowNull: false, defaultValue: 15.00 },
    pricePerKg: { type: DataTypes.DECIMAL(10, 2), allowNull: false, defaultValue: 2.50 },
    isInternational: { type: DataTypes.BOOLEAN, defaultValue: true },
    isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
    createdAt: { type: DataTypes.DATE, allowNull: false },
    updatedAt: { type: DataTypes.DATE, allowNull: false }
  });

  // 14. Orders
  await queryInterface.createTable('orders', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    orderNumber: { type: DataTypes.STRING(30), allowNull: false, unique: true },
    userId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: { model: 'users', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    },
    guestEmail: { type: DataTypes.STRING(100), allowNull: true },
    guestPhone: { type: DataTypes.STRING(30), allowNull: true },
    status: {
      type: DataTypes.ENUM(
        'Order Received',
        'Payment Confirmed',
        'Processing',
        'Preparing Shipment',
        'Shipped',
        'In Transit',
        'Out for Delivery',
        'Delivered',
        'Cancelled',
        'Refunded'
      ),
      defaultValue: 'Order Received'
    },
    totalAmount: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    subtotal: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    taxAmount: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0.0 },
    shippingAmount: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0.0 },
    discountAmount: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0.0 },
    shippingAddress: { type: DataTypes.JSON, allowNull: false },
    billingAddress: { type: DataTypes.JSON, allowNull: true },
    shippingMethodId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: { model: 'shipping_methods', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    },
    notes: { type: DataTypes.TEXT, allowNull: true },
    createdAt: { type: DataTypes.DATE, allowNull: false },
    updatedAt: { type: DataTypes.DATE, allowNull: false }
  });

  await queryInterface.addIndex('orders', ['orderNumber']);
  await queryInterface.addIndex('orders', ['userId']);
  await queryInterface.addIndex('orders', ['status']);

  // 15. Order Items
  await queryInterface.createTable('order_items', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    orderId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: 'orders', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    productId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: 'products', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    productName: { type: DataTypes.STRING(255), allowNull: false },
    sku: { type: DataTypes.STRING(50), allowNull: true },
    quantity: { type: DataTypes.INTEGER, allowNull: false },
    unitPrice: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    totalPrice: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    createdAt: { type: DataTypes.DATE, allowNull: false },
    updatedAt: { type: DataTypes.DATE, allowNull: false }
  });

  // 16. Payments
  await queryInterface.createTable('payments', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    orderId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: 'orders', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    paymentMethod: { type: DataTypes.STRING(50), defaultValue: 'Stripe' },
    transactionId: { type: DataTypes.STRING(100), allowNull: true },
    amount: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    currency: { type: DataTypes.STRING(10), defaultValue: 'USD' },
    status: {
      type: DataTypes.ENUM('Pending', 'Paid', 'Failed', 'Refunded', 'Partially Refunded'),
      defaultValue: 'Pending'
    },
    paymentDetails: { type: DataTypes.JSON, allowNull: true },
    createdAt: { type: DataTypes.DATE, allowNull: false },
    updatedAt: { type: DataTypes.DATE, allowNull: false }
  });

  // 17. Shipments
  await queryInterface.createTable('shipments', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    orderId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: 'orders', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    shippingMethodId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: { model: 'shipping_methods', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    },
    trackingNumber: { type: DataTypes.STRING(100), allowNull: true },
    carrier: { type: DataTypes.STRING(100), defaultValue: 'DHL Express International' },
    status: { type: DataTypes.STRING(50), defaultValue: 'Preparing' },
    shippedAt: { type: DataTypes.DATE, allowNull: true },
    estimatedDelivery: { type: DataTypes.DATE, allowNull: true },
    deliveredAt: { type: DataTypes.DATE, allowNull: true },
    createdAt: { type: DataTypes.DATE, allowNull: false },
    updatedAt: { type: DataTypes.DATE, allowNull: false }
  });

  // 18. Coupons
  await queryInterface.createTable('coupons', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    code: { type: DataTypes.STRING(30), allowNull: false, unique: true },
    type: { type: DataTypes.ENUM('percentage', 'fixed'), defaultValue: 'percentage' },
    value: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    minPurchase: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0.0 },
    maxDiscount: { type: DataTypes.DECIMAL(10, 2), allowNull: true },
    usageLimit: { type: DataTypes.INTEGER, defaultValue: 100 },
    timesUsed: { type: DataTypes.INTEGER, defaultValue: 0 },
    expiresAt: { type: DataTypes.DATE, allowNull: true },
    isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
    createdAt: { type: DataTypes.DATE, allowNull: false },
    updatedAt: { type: DataTypes.DATE, allowNull: false }
  });

  // 19. Coupon Usage
  await queryInterface.createTable('coupon_usage', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    couponId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: 'coupons', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: { model: 'users', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    },
    orderId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: 'orders', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    createdAt: { type: DataTypes.DATE, allowNull: false },
    updatedAt: { type: DataTypes.DATE, allowNull: false }
  });

  // 20. Reviews
  await queryInterface.createTable('reviews', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    productId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: 'products', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: 'users', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    rating: { type: DataTypes.INTEGER, allowNull: false },
    title: { type: DataTypes.STRING(150), allowNull: false },
    comment: { type: DataTypes.TEXT, allowNull: false },
    isVerifiedPurchase: { type: DataTypes.BOOLEAN, defaultValue: true },
    isApproved: { type: DataTypes.BOOLEAN, defaultValue: true },
    createdAt: { type: DataTypes.DATE, allowNull: false },
    updatedAt: { type: DataTypes.DATE, allowNull: false }
  });

  // 21. Repair Requests
  await queryInterface.createTable('repair_requests', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    repairNumber: { type: DataTypes.STRING(30), allowNull: false, unique: true },
    userId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: { model: 'users', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    },
    customerName: { type: DataTypes.STRING(100), allowNull: false },
    email: { type: DataTypes.STRING(100), allowNull: false },
    phone: { type: DataTypes.STRING(30), allowNull: false },
    country: { type: DataTypes.STRING(100), allowNull: false },
    deviceType: {
      type: DataTypes.ENUM('Laptop', 'Desktop PC', 'Gaming PC', 'Mac', 'Other'),
      allowNull: false
    },
    brand: { type: DataTypes.STRING(100), allowNull: false },
    model: { type: DataTypes.STRING(100), allowNull: false },
    serialNumber: { type: DataTypes.STRING(100), allowNull: true },
    problemCategory: {
      type: DataTypes.ENUM(
        'Does not turn on',
        'Overheating',
        'Broken screen',
        'Slow performance',
        'Blue screen',
        'Storage problem',
        'Battery problem',
        'Keyboard problem',
        'GPU problem',
        'Internet/Wi-Fi problem',
        'Virus/Malware',
        'Data recovery',
        'Upgrade request',
        'Other'
      ),
      allowNull: false
    },
    problemDescription: { type: DataTypes.TEXT, allowNull: false },
    hasBeenRepairedBefore: { type: DataTypes.BOOLEAN, defaultValue: false },
    status: {
      type: DataTypes.ENUM(
        'Request Submitted',
        'Waiting for Device',
        'Device Received',
        'Initial Inspection',
        'Diagnostics',
        'Quote Prepared',
        'Waiting for Customer Approval',
        'Repair Approved',
        'Repair In Progress',
        'Testing',
        'Repair Completed',
        'Preparing Return Shipment',
        'Shipped',
        'Delivered',
        'Cancelled'
      ),
      defaultValue: 'Request Submitted'
    },
    technicianNotes: { type: DataTypes.TEXT, allowNull: true },
    createdAt: { type: DataTypes.DATE, allowNull: false },
    updatedAt: { type: DataTypes.DATE, allowNull: false }
  });

  await queryInterface.addIndex('repair_requests', ['repairNumber']);
  await queryInterface.addIndex('repair_requests', ['email']);
  await queryInterface.addIndex('repair_requests', ['status']);

  // 22. Repair Files
  await queryInterface.createTable('repair_files', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    repairRequestId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: 'repair_requests', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    fileUrl: { type: DataTypes.STRING(500), allowNull: false },
    fileType: { type: DataTypes.STRING(50), allowNull: true },
    originalName: { type: DataTypes.STRING(255), allowNull: true },
    fileSize: { type: DataTypes.INTEGER, allowNull: true },
    createdAt: { type: DataTypes.DATE, allowNull: false },
    updatedAt: { type: DataTypes.DATE, allowNull: false }
  });

  // 23. Repair Status History
  await queryInterface.createTable('repair_status_history', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    repairRequestId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: 'repair_requests', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    status: { type: DataTypes.STRING(100), allowNull: false },
    comment: { type: DataTypes.TEXT, allowNull: true },
    updatedBy: { type: DataTypes.STRING(100), allowNull: true },
    createdAt: { type: DataTypes.DATE, allowNull: false },
    updatedAt: { type: DataTypes.DATE, allowNull: false }
  });

  // 24. Repair Quotes
  await queryInterface.createTable('repair_quotes', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    repairRequestId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: 'repair_requests', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    diagnosticFee: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0.0 },
    laborCost: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0.0 },
    shippingCost: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0.0 },
    tax: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0.0 },
    discount: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0.0 },
    totalAmount: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    status: {
      type: DataTypes.ENUM('PENDING', 'APPROVED', 'REJECTED'),
      defaultValue: 'PENDING'
    },
    customerDecision: { type: DataTypes.STRING(50), allowNull: true },
    approvedAt: { type: DataTypes.DATE, allowNull: true },
    notes: { type: DataTypes.TEXT, allowNull: true },
    createdAt: { type: DataTypes.DATE, allowNull: false },
    updatedAt: { type: DataTypes.DATE, allowNull: false }
  });

  // 25. Repair Quote Items
  await queryInterface.createTable('repair_quote_items', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    repairQuoteId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: 'repair_quotes', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    description: { type: DataTypes.STRING(255), allowNull: false },
    partNumber: { type: DataTypes.STRING(100), allowNull: true },
    quantity: { type: DataTypes.INTEGER, defaultValue: 1 },
    unitPrice: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    totalPrice: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    createdAt: { type: DataTypes.DATE, allowNull: false },
    updatedAt: { type: DataTypes.DATE, allowNull: false }
  });

  // 26. Repair Messages
  await queryInterface.createTable('repair_messages', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    repairRequestId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: 'repair_requests', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    senderId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: { model: 'users', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    },
    senderName: { type: DataTypes.STRING(100), allowNull: false },
    senderRole: {
      type: DataTypes.ENUM('CUSTOMER', 'TECHNICIAN', 'ADMIN'),
      allowNull: false
    },
    message: { type: DataTypes.TEXT, allowNull: false },
    attachmentUrl: { type: DataTypes.STRING(500), allowNull: true },
    isInternal: { type: DataTypes.BOOLEAN, defaultValue: false },
    createdAt: { type: DataTypes.DATE, allowNull: false },
    updatedAt: { type: DataTypes.DATE, allowNull: false }
  });

  // 27. Technician Assignments
  await queryInterface.createTable('technician_assignments', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    repairRequestId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: 'repair_requests', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    technicianId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: 'users', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    assignedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    notes: { type: DataTypes.TEXT, allowNull: true },
    createdAt: { type: DataTypes.DATE, allowNull: false },
    updatedAt: { type: DataTypes.DATE, allowNull: false }
  });

  // 28. Contact Messages
  await queryInterface.createTable('contact_messages', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    name: { type: DataTypes.STRING(100), allowNull: false },
    email: { type: DataTypes.STRING(100), allowNull: false },
    phone: { type: DataTypes.STRING(30), allowNull: true },
    subject: { type: DataTypes.STRING(150), allowNull: false },
    message: { type: DataTypes.TEXT, allowNull: false },
    status: {
      type: DataTypes.ENUM('NEW', 'IN_PROGRESS', 'RESOLVED'),
      defaultValue: 'NEW'
    },
    createdAt: { type: DataTypes.DATE, allowNull: false },
    updatedAt: { type: DataTypes.DATE, allowNull: false }
  });

  // 29. Newsletter Subscribers
  await queryInterface.createTable('newsletter_subscribers', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    email: { type: DataTypes.STRING(100), allowNull: false, unique: true },
    isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
    createdAt: { type: DataTypes.DATE, allowNull: false },
    updatedAt: { type: DataTypes.DATE, allowNull: false }
  });
};

export const down = async ({ context: queryInterface }: { context: QueryInterface }): Promise<void> => {
  await queryInterface.dropTable('newsletter_subscribers');
  await queryInterface.dropTable('contact_messages');
  await queryInterface.dropTable('technician_assignments');
  await queryInterface.dropTable('repair_messages');
  await queryInterface.dropTable('repair_quote_items');
  await queryInterface.dropTable('repair_quotes');
  await queryInterface.dropTable('repair_status_history');
  await queryInterface.dropTable('repair_files');
  await queryInterface.dropTable('repair_requests');
  await queryInterface.dropTable('reviews');
  await queryInterface.dropTable('coupon_usage');
  await queryInterface.dropTable('coupons');
  await queryInterface.dropTable('shipments');
  await queryInterface.dropTable('payments');
  await queryInterface.dropTable('order_items');
  await queryInterface.dropTable('orders');
  await queryInterface.dropTable('shipping_methods');
  await queryInterface.dropTable('wishlist_items');
  await queryInterface.dropTable('wishlists');
  await queryInterface.dropTable('cart_items');
  await queryInterface.dropTable('carts');
  await queryInterface.dropTable('inventory');
  await queryInterface.dropTable('product_specifications');
  await queryInterface.dropTable('product_images');
  await queryInterface.dropTable('products');
  await queryInterface.dropTable('brands');
  await queryInterface.dropTable('categories');
  await queryInterface.dropTable('addresses');
  await queryInterface.dropTable('users');
};
