import { Request, Response } from 'express';
import PetshopProduct from '../models/PetshopProduct.model';

//Gets all products, ordered by ID
export const getPSProducts = async (req: Request, res: Response) => {
    const products = await PetshopProduct.findAll({
        order: [['id', 'DESC']],
        attributes: { exclude: ['createdAt', 'updatedAt'] },
    });
    res.json({ data: products });
};

//Gets one product by ID
export const getPSProductById = async (req: Request, res: Response) => {
    const { id } = req.params;
    const product = await PetshopProduct.findByPk(id);

    if (!product) {
        return res.status(404).json({
            error: 'Product not found',
        });
    }

    res.json({ data: product });
};

//Creates product. Validations are in router
export const createPSProduct = async (req: Request, res: Response) => {
    const product = await PetshopProduct.create(req.body);
    res.status(201).json({ data: product });
};

//Updates product
export const updatePSProduct = async (req: Request, res: Response) => {
    const { id } = req.params;
    const product = await PetshopProduct.findByPk(id);

    if (!product) {
        return res.status(404).json({
            error: 'Product not found',
        });
    }

    product.update(req.body);
    product.save();

    res.json({ data: product });
};

//Updates the availability Boolean variable
export const updateAvailability = async (req: Request, res: Response) => {
    const { id } = req.params;
    const product = await PetshopProduct.findByPk(id);

    if (!product) {
        return res.status(404).json({
            error: 'Product not found',
        });
    }
    product.availability = !product.dataValues.availability;
    product.save();

    res.json({ data: product });
};

//Deletes product
export const deletePSProduct = async (req: Request, res: Response) => {
    const { id } = req.params;
    const product = await PetshopProduct.findByPk(id);

    if (!product) {
        return res.status(404).json({
            error: 'Product not found',
        });
    }

    await product.destroy();

    res.json({ data: 'product deleted' });
};
