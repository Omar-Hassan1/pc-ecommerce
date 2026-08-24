import { Request, Response, NextFunction } from 'express';
import { Product, Category, ProductSpecification, ProductImage } from '../models';
import { sendSuccess } from '../utils/response.handler';

const BUILD_STEPS = [
  { id: 'cpu', name: 'CPU / Processor', categorySlug: 'cpus' },
  { id: 'motherboard', name: 'Motherboard', categorySlug: 'motherboards' },
  { id: 'gpu', name: 'Graphics Card (GPU)', categorySlug: 'gpus' },
  { id: 'ram', name: 'Memory (RAM)', categorySlug: 'ram' },
  { id: 'storage', name: 'Storage (SSD / HDD)', categorySlug: 'ssds' },
  { id: 'psu', name: 'Power Supply (PSU)', categorySlug: 'power-supplies' },
  { id: 'case', name: 'PC Case', categorySlug: 'cases' },
  { id: 'cooler', name: 'CPU Cooler', categorySlug: 'cooling' },
  { id: 'os', name: 'Operating System', categorySlug: 'software' }
];

export const getBuilderComponents = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const componentsByStep: Record<string, any[]> = {};

    for (const step of BUILD_STEPS) {
      const category = await Category.findOne({ where: { slug: step.categorySlug } });
      let products: any[] = [];
      if (category) {
        products = await Product.findAll({
          where: { categoryId: category.id, isActive: true },
          include: [
            { model: ProductImage, as: 'images' },
            { model: ProductSpecification, as: 'specifications' }
          ]
        });
      }
      componentsByStep[step.id] = products;
    }

    return sendSuccess(res, {
      steps: BUILD_STEPS,
      components: componentsByStep
    });
  } catch (error) {
    next(error);
  }
};

export const validateBuildCompatibility = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const { selections } = req.body; // Map of stepId -> product Object

    const warnings: string[] = [];
    let estimatedWattage = 50; // Base motherboard + fans wattage
    let cpuSocket: string | null = null;
    let moboSocket: string | null = null;
    let moboRamType: string | null = null;
    let ramType: string | null = null;
    let psuWattage = 0;

    if (selections.cpu && selections.cpu.specifications) {
      const socketSpec = selections.cpu.specifications.find((s: any) => s.specKey.toLowerCase().includes('socket'));
      if (socketSpec) cpuSocket = socketSpec.specValue.trim();

      const wattageSpec = selections.cpu.specifications.find((s: any) => s.specKey.toLowerCase().includes('tdp') || s.specKey.toLowerCase().includes('watt'));
      if (wattageSpec) estimatedWattage += parseInt(wattageSpec.specValue) || 125;
      else estimatedWattage += 105;
    }

    if (selections.motherboard && selections.motherboard.specifications) {
      const socketSpec = selections.motherboard.specifications.find((s: any) => s.specKey.toLowerCase().includes('socket'));
      if (socketSpec) moboSocket = socketSpec.specValue.trim();

      const ramSpec = selections.motherboard.specifications.find((s: any) => s.specKey.toLowerCase().includes('memory') || s.specKey.toLowerCase().includes('ram'));
      if (ramSpec) moboRamType = ramSpec.specValue.toLowerCase().includes('ddr5') ? 'DDR5' : 'DDR4';
    }

    if (selections.gpu && selections.gpu.specifications) {
      const powerSpec = selections.gpu.specifications.find((s: any) => s.specKey.toLowerCase().includes('power') || s.specKey.toLowerCase().includes('tdp'));
      if (powerSpec) estimatedWattage += parseInt(powerSpec.specValue) || 280;
      else estimatedWattage += 250;
    }

    if (selections.ram && selections.ram.specifications) {
      const ramTypeSpec = selections.ram.specifications.find((s: any) => s.specKey.toLowerCase().includes('type') || s.specKey.toLowerCase().includes('memory'));
      if (ramTypeSpec) ramType = ramTypeSpec.specValue.toLowerCase().includes('ddr5') ? 'DDR5' : 'DDR4';
      estimatedWattage += 15;
    }

    if (selections.psu && selections.psu.specifications) {
      const psuSpec = selections.psu.specifications.find((s: any) => s.specKey.toLowerCase().includes('watt'));
      if (psuSpec) psuWattage = parseInt(psuSpec.specValue) || 750;
      else psuWattage = 750;
    }

    // Socket compatibility check
    if (cpuSocket && moboSocket && cpuSocket.toLowerCase() !== moboSocket.toLowerCase()) {
      warnings.push(`Socket mismatch: Selected CPU socket (${cpuSocket}) is incompatible with Motherboard socket (${moboSocket}).`);
    }

    // RAM compatibility check
    if (ramType && moboRamType && ramType !== moboRamType) {
      warnings.push(`RAM mismatch: Selected RAM (${ramType}) is incompatible with Motherboard supported RAM (${moboRamType}).`);
    }

    // Power Supply sufficiency check
    if (psuWattage > 0 && psuWattage < estimatedWattage + 100) {
      warnings.push(`Power Supply warning: Selected PSU (${psuWattage}W) may be insufficient for total estimated draw (${estimatedWattage}W + 100W headroom recommended).`);
    }

    return sendSuccess(res, {
      isCompatible: warnings.length === 0,
      warnings,
      estimatedWattage,
      recommendedPsuWattage: estimatedWattage + 150
    });
  } catch (error) {
    next(error);
  }
};
