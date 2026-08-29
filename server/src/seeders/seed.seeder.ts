import {
  User,
  Category,
  Brand,
  Product,
  ProductImage,
  ProductSpecification,
  Inventory,
  ShippingMethod,
  Coupon,
  RepairRequest,
  RepairQuote,
  RepairQuoteItem,
  RepairStatusHistory
} from '../models';
import { verifyAndConnect } from '../config/database.config';
import logger from '../config/logger.config';

export const seedDatabase = async (): Promise<void> => {
  try {
    await verifyAndConnect();

    const userCount = await User.count();

    if (userCount > 0) {
      logger.info('[Seeder] Database already populated. Skipping seed.');
      return;
    }

    logger.info('[Seeder] Seeding database with realistic NEXORA COMPUTERS data...');

    // 1. Create Default Users (Admin, Technician, Customer)
    await User.create({
      firstName: 'Omar',
      lastName: 'Admin',
      email: 'admin@nexora.com',
      password: 'Password123!',
      role: 'ADMIN',
      phone: '+1 (800) 555-0199'
    });

    await User.create({
      firstName: 'Omar',
      lastName: 'Tech',
      email: 'tech@nexora.com',
      password: 'Password123!',
      role: 'TECHNICIAN',
      phone: '+1 (800) 555-0144'
    });

    const customer = await User.create({
      firstName: 'Omar',
      lastName: 'Customer',
      email: 'customer@nexora.com',
      password: 'Password123!',
      role: 'CUSTOMER',
      phone: '+1 (555) 234-5678'
    });

    logger.info('[Seeder] Created default accounts (Admin: admin@nexora.com)');

    // 2. Create Categories & Subcategories
    const computersCat = await Category.create({ name: 'Computers', slug: 'computers', description: 'Pre-built Gaming PCs & Desktop Workstations' });
    const gamingPcsCat = await Category.create({ name: 'Gaming PCs', slug: 'gaming-pcs', parentId: computersCat.id });
    const laptopsCat = await Category.create({ name: 'Laptops', slug: 'laptops', parentId: computersCat.id });

    const componentsCat = await Category.create({ name: 'PC Components', slug: 'pc-components', description: 'CPUs, GPUs, Motherboards, RAM, Power Supplies' });
    const cpusCat = await Category.create({ name: 'CPUs / Processors', slug: 'cpus', parentId: componentsCat.id });
    const gpusCat = await Category.create({ name: 'Graphics Cards (GPUs)', slug: 'gpus', parentId: componentsCat.id });
    const mobosCat = await Category.create({ name: 'Motherboards', slug: 'motherboards', parentId: componentsCat.id });
    const ramCat = await Category.create({ name: 'RAM', slug: 'ram', parentId: componentsCat.id });
    const ssdsCat = await Category.create({ name: 'Storage (SSDs)', slug: 'ssds', parentId: componentsCat.id });
    const psusCat = await Category.create({ name: 'Power Supplies', slug: 'power-supplies', parentId: componentsCat.id });
    await Category.create({ name: 'PC Cases', slug: 'cases', parentId: componentsCat.id });
    await Category.create({ name: 'Cooling', slug: 'cooling', parentId: componentsCat.id });

    const accessoriesCat = await Category.create({ name: 'Accessories', slug: 'accessories', description: 'Gaming Keyboards, Mice, Monitors' });
    await Category.create({ name: 'Monitors', slug: 'monitors', parentId: accessoriesCat.id });
    await Category.create({ name: 'Keyboards', slug: 'keyboards', parentId: accessoriesCat.id });

    // 3. Create Brands
    const asus = await Brand.create({ name: 'ASUS', slug: 'asus', description: 'ROG Strix & TUF Gaming' });
    await Brand.create({ name: 'MSI', slug: 'msi', description: 'Dragon Gaming Performance' });
    await Brand.create({ name: 'Gigabyte', slug: 'gigabyte', description: 'AORUS & Gaming Components' });
    const amd = await Brand.create({ name: 'AMD', slug: 'amd', description: 'Ryzen Processors & Radeon Graphics' });
    await Brand.create({ name: 'Intel', slug: 'intel', description: 'Core Ultra & Core Processors' });
    const nvidia = await Brand.create({ name: 'NVIDIA', slug: 'nvidia', description: 'GeForce RTX Graphics' });
    const corsair = await Brand.create({ name: 'Corsair', slug: 'corsair', description: 'High Performance RAM, Power & Cases' });
    const samsung = await Brand.create({ name: 'Samsung', slug: 'samsung', description: 'NVMe SSDs & QD-OLED Gaming Monitors' });
    await Brand.create({ name: 'Logitech G', slug: 'logitech', description: 'PRO Wireless Gear' });

    // 4. Create Shipping Methods
    await ShippingMethod.create({
      name: 'Standard International Shipping',
      description: 'Reliable worldwide delivery via DHL/FedEx Ground (5-7 Business Days)',
      estimatedDays: '5-7 Business Days',
      basePrice: 15.00,
      pricePerKg: 2.50,
      isInternational: true
    });

    await ShippingMethod.create({
      name: 'Express Priority Air Shipping',
      description: 'Ultra-fast express air freight (2-3 Business Days)',
      estimatedDays: '2-3 Business Days',
      basePrice: 35.00,
      pricePerKg: 5.00,
      isInternational: true
    });

    // 5. Create Sample Coupons
    await Coupon.create({
      code: 'WELCOME10',
      type: 'percentage',
      value: 10.00,
      minPurchase: 100.00,
      maxDiscount: 150.00,
      usageLimit: 500,
      isActive: true
    });

    await Coupon.create({
      code: 'SUMMER50',
      type: 'fixed',
      value: 50.00,
      minPurchase: 500.00,
      usageLimit: 200,
      isActive: true
    });

    // 6. Create Realistic Computer Products
    const productsData = [
      {
        name: 'NEXORA Vanguard X1 RTX 5080 Gaming PC',
        slug: 'nexora-vanguard-x1-rtx-5080',
        sku: 'NX-PC-5080-V1',
        categoryId: gamingPcsCat.id,
        brandId: asus.id,
        description: 'Ultimate 4K Gaming Monster powered by AMD Ryzen 7 9800X3D and NVIDIA GeForce RTX 5080 16GB. Liquid cooled, 32GB DDR5 6000MHz, 2TB PCIe 4.0 NVMe SSD.',
        shortDescription: 'AMD Ryzen 7 9800X3D | RTX 5080 16GB | 32GB DDR5 | 2TB NVMe SSD',
        price: 3299.99,
        salePrice: 2999.99,
        stockQuantity: 15,
        isFeatured: true,
        averageRating: 4.9,
        reviewCount: 28,
        images: ['https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=1000&q=80'],
        specs: [
          { specKey: 'CPU', specValue: 'AMD Ryzen 7 9800X3D (8-Core 5.2GHz)' },
          { specKey: 'GPU', specValue: 'NVIDIA GeForce RTX 5080 16GB GDDR7' },
          { specKey: 'RAM', specValue: '32GB DDR5-6000MHz Corsair Vengeance RGB' },
          { specKey: 'Storage', specValue: '2TB Samsung 990 Pro PCIe 4.0 NVMe SSD' },
          { specKey: 'Motherboard', specValue: 'ASUS ROG Strix X670E-F Gaming WiFi (Socket AM5)' },
          { specKey: 'Power Supply', specValue: '850W Corsair RM850x 80+ Gold Fully Modular' },
          { specKey: 'Cooling', specValue: 'NEXORA 360mm AIO Liquid Cooler' }
        ]
      },
      {
        name: 'ASUS ROG Strix SCAR 18 (2026) Gaming Laptop',
        slug: 'asus-rog-strix-scar-18-2026',
        sku: 'NX-LAP-ROG18',
        categoryId: laptopsCat.id,
        brandId: asus.id,
        description: 'Dominate esports with Intel Core i9 14900HX and RTX 4090 16GB Laptop GPU. 18-inch 2.5K 240Hz ROG Nebula HDR Mini-LED Display.',
        shortDescription: 'Intel Core i9 14900HX | RTX 4090 16GB | 18" 240Hz Mini-LED | 32GB DDR5',
        price: 3899.99,
        salePrice: 3599.99,
        stockQuantity: 8,
        isFeatured: true,
        averageRating: 4.8,
        reviewCount: 19,
        images: ['https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=1000&q=80'],
        specs: [
          { specKey: 'CPU', specValue: 'Intel Core i9 14900HX (24 Cores, up to 5.8GHz)' },
          { specKey: 'GPU', specValue: 'NVIDIA GeForce RTX 4090 16GB GDDR6' },
          { specKey: 'RAM', specValue: '32GB DDR5 5600MHz' },
          { specKey: 'Storage', specValue: '2TB PCIe 4.0 NVMe SSD RAID 0' },
          { specKey: 'Display', specValue: '18-inch QHD+ 240Hz 3ms Mini-LED G-Sync' }
        ]
      },
      {
        name: 'AMD Ryzen 7 9800X3D Processor',
        slug: 'amd-ryzen-7-9800x3d-processor',
        sku: 'NX-CPU-9800X3D',
        categoryId: cpusCat.id,
        brandId: amd.id,
        description: 'The world\'s fastest gaming processor featuring 2nd Gen 3D V-Cache technology. 8 cores, 16 threads, 5.2GHz boost clock, Socket AM5.',
        shortDescription: '8 Cores / 16 Threads | Socket AM5 | 104MB Cache | 120W TDP',
        price: 479.99,
        stockQuantity: 45,
        isFeatured: true,
        averageRating: 5.0,
        reviewCount: 42,
        images: ['https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&w=1000&q=80'],
        specs: [
          { specKey: 'Socket', specValue: 'Socket AM5' },
          { specKey: 'Cores / Threads', specValue: '8 Cores / 16 Threads' },
          { specKey: 'Base / Boost Clock', specValue: '4.7GHz / 5.2GHz' },
          { specKey: 'L3 Cache', specValue: '96MB 3D V-Cache (104MB Total)' },
          { specKey: 'TDP', specValue: '120W' },
          { specKey: 'RAM Support', specValue: 'DDR5' }
        ]
      },
      {
        name: 'ASUS ROG Strix GeForce RTX 5080 16GB OC Edition',
        slug: 'asus-rog-strix-rtx-5080-16gb-oc',
        sku: 'NX-GPU-5080-STRIX',
        categoryId: gpusCat.id,
        brandId: nvidia.id,
        description: 'Next-generation Blackwell architecture GPU. Unprecedented 4K ray tracing, DLSS 4 AI rendering, and axial-tech triple fan cooling.',
        shortDescription: '16GB GDDR7 | PCIe 5.0 | Triple Axial Fans | Aura Sync RGB',
        price: 1399.99,
        stockQuantity: 12,
        isFeatured: true,
        averageRating: 4.9,
        reviewCount: 15,
        images: ['https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1000&q=80'],
        specs: [
          { specKey: 'Memory', specValue: '16GB GDDR7' },
          { specKey: 'Memory Interface', specValue: '256-bit' },
          { specKey: 'Interface', specValue: 'PCI Express 5.0 x16' },
          { specKey: 'Power Requirement', specValue: '320W TDP (850W PSU Recommended)' }
        ]
      },
      {
        name: 'ASUS ROG Strix X670E-F Gaming WiFi Motherboard',
        slug: 'asus-rog-strix-x670e-f-motherboard',
        sku: 'NX-MOBO-X670EF',
        categoryId: mobosCat.id,
        brandId: asus.id,
        description: 'Premium AMD Socket AM5 motherboard featuring PCIe 5.0, 16+2 Power Stages, WiFi 6E, DDR5 support, and quadruplet M.2 slots.',
        shortDescription: 'AMD Socket AM5 | DDR5 | PCIe 5.0 | WiFi 6E | ATX',
        price: 429.99,
        stockQuantity: 20,
        isFeatured: false,
        averageRating: 4.7,
        reviewCount: 11,
        images: ['https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1000&q=80'],
        specs: [
          { specKey: 'Socket', specValue: 'Socket AM5' },
          { specKey: 'Memory Type', specValue: 'DDR5 (Up to 6400MHz+ OC)' },
          { specKey: 'Form Factor', specValue: 'ATX' },
          { specKey: 'PCIe Slots', specValue: '1x PCIe 5.0 x16, 2x PCIe 4.0' }
        ]
      },
      {
        name: 'Corsair Vengeance RGB 32GB (2x16GB) DDR5 6000MHz',
        slug: 'corsair-vengeance-rgb-32gb-ddr5-6000',
        sku: 'NX-RAM-COR32D5',
        categoryId: ramCat.id,
        brandId: corsair.id,
        description: 'High performance DDR5 memory engineered for AMD EXPO & Intel XMP 3.0 with dynamic ten-zone RGB lighting.',
        shortDescription: '32GB (2x16GB) | DDR5-6000MHz | CL30 | Intel XMP & AMD EXPO',
        price: 139.99,
        stockQuantity: 60,
        isFeatured: false,
        averageRating: 4.8,
        reviewCount: 34,
        images: ['https://images.unsplash.com/photo-1562976540-1502c2145186?auto=format&fit=crop&w=1000&q=80'],
        specs: [
          { specKey: 'Type', specValue: 'DDR5' },
          { specKey: 'Capacity', specValue: '32GB (2 x 16GB)' },
          { specKey: 'Speed', specValue: '6000MHz' },
          { specKey: 'Latency', specValue: 'CL30-36-36-76' }
        ]
      },
      {
        name: 'Samsung 990 PRO 2TB PCIe 4.0 NVMe SSD',
        slug: 'samsung-990-pro-2tb-nvme-ssd',
        sku: 'NX-SSD-SAM990-2TB',
        categoryId: ssdsCat.id,
        brandId: samsung.id,
        description: 'Blazing fast sequential read speeds up to 7450 MB/s. Perfect for hardcore gamers, tech enthusiasts and video editors.',
        shortDescription: '2TB NVMe M.2 2280 | Read: 7450MB/s | Write: 6900MB/s',
        price: 179.99,
        stockQuantity: 50,
        isFeatured: true,
        averageRating: 4.9,
        reviewCount: 65,
        images: ['https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?auto=format&fit=crop&w=1000&q=80'],
        specs: [
          { specKey: 'Form Factor', specValue: 'M.2 2280' },
          { specKey: 'Interface', specValue: 'PCIe Gen 4.0 x4, NVMe 2.0' },
          { specKey: 'Sequential Read', specValue: '7450 MB/s' },
          { specKey: 'Sequential Write', specValue: '6900 MB/s' }
        ]
      },
      {
        name: 'Corsair RM850x 80+ Gold Fully Modular Power Supply',
        slug: 'corsair-rm850x-80-gold-psu',
        sku: 'NX-PSU-RM850X',
        categoryId: psusCat.id,
        brandId: corsair.id,
        description: '850 Watt 80 PLUS Gold certified fully modular power supply built with 100% Japanese 105°C capacitors and Zero RPM fan mode.',
        shortDescription: '850W | 80+ Gold Certified | Fully Modular | 10 Year Warranty',
        price: 139.99,
        stockQuantity: 35,
        isFeatured: false,
        averageRating: 4.9,
        reviewCount: 22,
        images: ['https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=1000&q=80'],
        specs: [
          { specKey: 'Wattage', specValue: '850 Watts' },
          { specKey: 'Efficiency Rating', specValue: '80 PLUS Gold' },
          { specKey: 'Modular', specValue: 'Fully Modular' },
          { specKey: 'Fan Size', specValue: '135mm Magnetic Levitation' }
        ]
      }
    ];

    for (const prodData of productsData) {
      const { images: imgUrls, specs: specItems, ...pDetails } = prodData;

      const product = await Product.create(pDetails);

      // Create Inventory
      await Inventory.create({
        productId: product.id,
        stockQuantity: pDetails.stockQuantity,
        availableQuantity: pDetails.stockQuantity,
        lowStockThreshold: 5
      });

      // Images
      if (imgUrls && imgUrls.length > 0) {
        await ProductImage.create({
          productId: product.id,
          imageUrl: imgUrls[0],
          isPrimary: true
        });
      }

      // Specs
      if (specItems && specItems.length > 0) {
        for (const spec of specItems) {
          await ProductSpecification.create({
            productId: product.id,
            specKey: spec.specKey,
            specValue: spec.specValue,
            groupName: 'Specifications'
          });
        }
      }
    }

    logger.info('[Seeder] Realistic products seeded successfully.');

    // 7. Seed Sample Repair Request
    const sampleRepair = await RepairRequest.create({
      repairNumber: 'REP-2026-000101',
      userId: customer.id,
      customerName: 'Omar Customer',
      email: 'customer@nexora.com',
      phone: '+1 (555) 234-5678',
      country: 'United States',
      deviceType: 'Gaming PC',
      brand: 'Custom Build',
      model: 'NEXORA Custom X',
      serialNumber: 'SN-9982-X2',
      problemCategory: 'GPU problem',
      problemDescription: 'System crashes with blue screen when launching 4K games. Screen shows artifacting lines after 10 minutes.',
      hasBeenRepairedBefore: false,
      status: 'Waiting for Customer Approval'
    });

    await RepairStatusHistory.create({
      repairRequestId: sampleRepair.id,
      status: 'Waiting for Customer Approval',
      comment: 'Diagnostic complete. Replaced thermal pads and prepared quotation.',
      updatedBy: 'Omar Tech'
    });

    const quote = await RepairQuote.create({
      repairRequestId: sampleRepair.id,
      diagnosticFee: 49.00,
      laborCost: 65.00,
      shippingCost: 20.00,
      tax: 12.00,
      discount: 0.00,
      totalAmount: 496.00,
      status: 'PENDING',
      notes: 'GPU Thermal pad degradation & VRAM repaste'
    });

    await RepairQuoteItem.create({
      repairQuoteId: quote.id,
      description: 'RTX 4080 VRAM Thermal Pad Kit & High-Performance Paste',
      partNumber: 'TP-4080-PRO',
      quantity: 1,
      unitPrice: 350.00,
      totalPrice: 350.00
    });

    logger.info('[Seeder] Sample repair ticket & quotation seeded successfully.');
    logger.info('[Seeder] Complete database seeding finished!');

  } catch (error) {
    logger.error({ error }, '[Seeder Error]');
  }
};

if (require.main === module) {
  seedDatabase();
}

export default seedDatabase;
