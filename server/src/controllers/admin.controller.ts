import { Request, Response, NextFunction } from 'express';
import { Order, Product, User, RepairRequest, RepairQuote, sequelize } from '../models';
import { Op } from 'sequelize';
import { sendSuccess } from '../utils/response.handler';

export const getDashboardStats = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const totalRevenue = await Order.sum('totalAmount', {
      where: { status: { [Op.ne]: 'Cancelled' } }
    }) || 0;

    const totalOrders = await Order.count();
    const pendingOrders = await Order.count({ where: { status: 'Processing' } });
    const totalCustomers = await User.count({ where: { role: 'CUSTOMER' } });
    const totalProducts = await Product.count({ where: { isActive: true } });
    const lowStockProducts = await Product.count({
      where: { stockQuantity: { [Op.lte]: sequelize.col('lowStockThreshold') }, isActive: true }
    });

    const activeRepairs = await RepairRequest.count({
      where: { status: { [Op.notIn]: ['Delivered', 'Cancelled'] } }
    });

    const completedRepairs = await RepairRequest.count({
      where: { status: 'Delivered' }
    });

    const repairRevenue = await RepairQuote.sum('totalAmount', {
      where: { status: 'APPROVED' }
    }) || 0;

    // Monthly revenue simulation data for admin charts
    const monthlySales = [
      { month: 'Jan', sales: 45000, repairs: 8500 },
      { month: 'Feb', sales: 52000, repairs: 9200 },
      { month: 'Mar', sales: 61000, repairs: 11400 },
      { month: 'Apr', sales: 58000, repairs: 10800 },
      { month: 'May', sales: 74000, repairs: 14500 },
      { month: 'Jun', sales: 89000, repairs: 16200 },
      { month: 'Jul', sales: 95000, repairs: 18100 },
      { month: 'Aug', sales: 110000, repairs: 21000 }
    ];

    return sendSuccess(res, {
      stats: {
        totalRevenue: Math.round(totalRevenue * 100) / 100,
        totalOrders,
        pendingOrders,
        totalCustomers,
        totalProducts,
        lowStockProducts,
        activeRepairs,
        completedRepairs,
        repairRevenue: Math.round(repairRevenue * 100) / 100
      },
      charts: {
        monthlySales
      }
    });
  } catch (error) {
    next(error);
  }
};
