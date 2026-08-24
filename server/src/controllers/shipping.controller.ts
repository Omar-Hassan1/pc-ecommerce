import { Request, Response, NextFunction } from 'express';
import { ShippingMethod } from '../models';
import { sendSuccess } from '../utils/response.handler';

export const getShippingMethods = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const methods = await ShippingMethod.findAll({
      where: { isActive: true }
    });
    return sendSuccess(res, methods);
  } catch (error) {
    next(error);
  }
};

export const calculateShippingRate = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const { country, weight = 1.0, orderTotal = 0 } = req.body;

    const methods = await ShippingMethod.findAll({ where: { isActive: true } });

    const calculatedMethods = methods.map((method: any) => {
      let cost = parseFloat(method.basePrice) + (parseFloat(method.pricePerKg) * parseFloat(weight));
      // Free shipping over $1000 for standard shipping
      if (orderTotal >= 1000 && method.name.toLowerCase().includes('standard')) {
        cost = 0;
      }
      return {
        id: method.id,
        name: method.name,
        estimatedDays: method.estimatedDays,
        cost: Math.round(cost * 100) / 100
      };
    });

    return sendSuccess(res, calculatedMethods);
  } catch (error) {
    next(error);
  }
};
