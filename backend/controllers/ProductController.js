import { response } from 'express';
import Product from '../models/ProductModel.js';
import Users from '../models/UserModel.js';
import { Op } from 'sequelize';

export const getProduct = async(req, res) => {
    try {
        let response;
        if (req.role === 'admin') {
            response = await Product.findAll({
                attributes:['uuid', 'name', 'price'],
                include: [{
                    model: Users,
                    attributes:['name', 'email']
                }]
            });
        } else {
            response = await Product.findAll({
                attributes: ['uuid', 'name', 'price'],
                where: {
                    userId: req.userId
                },
                include: [{
                    model: Users,
                    attributes: ['name', 'email']
                }]
            });
        }
        res.status(200).json(response);
    } catch (error) {
        console.log(error);
    }
}
export const getProductById = async (req, res) => {
    try {
        const product = await Product.findOne({
            where: {
                uuid: req.params.id
            }
        });
        if (!product) return res.status(404).json({ msg: "Product tidak ditemukan" });
        let response;
        if (req.role === 'admin') {
            response = await Product.findOne({
                attributes: ['uuid', 'name', 'price'],
                where: {
                    id: product.id
                },
                include: [{
                    model: Users,
                    attributes: ['name', 'email']
                }]
            });
        } else {
            response = await Product.findOne({
                attributes: ['uuid', 'name', 'price'],
                where: {
                    [Op.and]: [{ id: product.id }, { userId: req.userId }]
                },
                include: [{
                    model: Users,
                    attributes: ['name', 'email']
                }]
            });
        }
        res.status(200).json(response);
    } catch (error) {
        console.log(error);
    }
}
export const createProduct = async(req, res) => {
    const { name, price } = req.body;
    try {
        await Product.create({
            name: name,
            price: price,
            userId: req.userId
        });
        res.status(201).json({ msg: "Product berhasil ditambahkan" });
    } catch (error) {
        console.log(error);
    }
}
export const editProduct = async(req, res) => {
    try {
        const product = await Product.findOne({
            where: {
                uuid: req.params.id
            }
        });
        if (!product) return res.status(404).json({ msg: "Product tidak ditemukan" });
        const { name, price } = req.body;
        if (req.role === 'admin') {
            await Product.update({ name, price }, {
                where: {
                    id: product.id
                }
            });
        } else {
            if (req.userId !== product.userId) return res.status(403).json({ msg: "Akses dibatasi" });
            await Product.update({ name, price }, {
                where: {
                    [Op.and]: [{ id: product.id }, { userId: req.userId }]
                }
            });
        }
        res.status(200).json({ msg: "Product updated"});
    } catch (error) {
        console.log(error);
    }
}
export const deleteProduct = async(req, res) => {
    try {
        const product = await Product.findOne({
            where: {
                uuid: req.params.id
            }
        });
        if (!product) return res.status(404).json({ msg: "Product tidak ditemukan" });
        const { name, price } = req.body;
        if (req.role === 'admin') {
            await Product.destroy({
                where: {
                    id: product.id
                }
            });
        } else {
            if (req.userId !== product.userId) return res.status(403).json({ msg: "Akses dibatasi" });
            await Product.destroy({
                where: {
                    [Op.and]: [{ id: product.id }, { userId: req.userId }]
                }
            });
        }
        res.status(200).json({ msg: "Product deleted" });
    } catch (error) {
        console.log(error);
    }
}