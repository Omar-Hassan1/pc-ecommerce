import { Request, Response, NextFunction } from 'express';
import { Category } from '../models';
import { sendSuccess } from '../utils/response.handler';
import { slugify } from '../utils/helpers.util';

export const getCategories = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const categories = await Category.findAll({
      where: { parentId: null },
      include: [{ model: Category, as: 'subcategories' }]
    });
    return sendSuccess(res, categories);
  } catch (error) {
    next(error);
  }
};

export const createCategory = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const { name, description, image, parentId, icon } = req.body;
    const slug = slugify(name);

    const category = await Category.create({
      name,
      slug,
      description,
      image,
      parentId,
      icon
    });

    return sendSuccess(res, category, 'Category created successfully', 201);
  } catch (error) {
    next(error);
  }
};
