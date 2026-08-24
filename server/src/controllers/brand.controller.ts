import { Request, Response, NextFunction } from 'express';
import { Brand } from '../models';
import { sendSuccess } from '../utils/response.handler';
import { slugify } from '../utils/helpers.util';

export const getBrands = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const brands = await Brand.findAll({ order: [['name', 'ASC']] });
    return sendSuccess(res, brands);
  } catch (error) {
    next(error);
  }
};

export const createBrand = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const { name, logo, description } = req.body;
    const slug = slugify(name);

    const brand = await Brand.create({
      name,
      slug,
      logo,
      description
    });

    return sendSuccess(res, brand, 'Brand created successfully', 201);
  } catch (error) {
    next(error);
  }
};
