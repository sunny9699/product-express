const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const connection = require('./dbConnection/dbConnection');
const Products = require('./model/product.model');
const uploadImageMiddleware = require('./middleware/multer');
const { v4 } = require('uuid');
const moment = require('moment');
const path = require('path');
const { Op } = require('sequelize');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

(async () => {
    try {
        await connection.authenticate();
        await Products.sync({ alter: true });
    } catch (error) {
        console.log('Error while connection database');
    }
})();

/**
 * create Product API
 */
app.post('/product', uploadImageMiddleware.single('image'), async (req, res) => {
    try {
        const { name } = req.body;
        if (!req.file) {
            return res.status(401).json({ message: 'IMAGE_DOES_NOT_EXIST' });
        }
        if (!name) {
            return res.status(401).json({ message: 'ENTER_PRODUCT_NAME' });
        }
        const imagePath = path.join(__dirname, req.file.path);
        const product = {
            id: v4(),
            name,
            image: imagePath,
            createdAt: moment().unix(),
            updatedAt: moment().unix(),
        };
        const createdProduct = await Products.create(product);
        return res.status(201).json(createdProduct);
    } catch (error) {
        console.log('Error on post /product', error);
        return res.status(400).json({ message: 'PRODUCT_CREATION_FAILED' });
    }
});

/**
 * get products API for filter (API can filter and )
 */
app.get('/get-product', async (req, res) => {
    try {
        const { id, createdAtFirst, createdAtSecond, name, pageSize, perPage, sort } = req.query;
        const whereOption = {
            ...(id && id !== undefined && { id }),
            ...(createdAtFirst && createdAtSecond && createdAtFirst !== undefined && createdAtSecond !== undefined && {
                createdAt: {
                    [Op.between]: [createdAtFirst, createdAtSecond]
                }
            }),
            ...(name && name !== undefined && { name }),
        };
        const products = await Products.findAndCountAll({
            where: whereOption,
            ...(pageSize && pageSize !== undefined && { limit: pageSize }),
            ...(perPage && perPage !== undefined && { offset: perPage }),
            order: [['createdAt', `${sort ? sort : 'ASC'}`]]
        });
        return res.status(200).json(products);
    } catch (error) {
        console.error('Error on /get-product API', error);
        return res.status(400).json({ message: 'PRODUCT_RETRIVE_FAILED' });
    }
});

/**
 * Update product name and Image
 */
app.put('/update-product/:id', uploadImageMiddleware.single('image'), async (req, res) => {
    try {
        const { id } = req.params;
        const { name } = req.body;
        if (!req.file && !name) {
            return res.status(401).json({ message: 'IMAGE_OR_NAME_FIELD_REQUIRED' });
        }
        let imagePath = '';
        if (req?.file) {
            imagePath = path.join(__dirname, req.file.path);
        }
        const product = {
            ...(name && name !== undefined && { name: name }),
            ...(imagePath && imagePath !== undefined && { image: imagePath }),
            updatedAt: moment().unix(),
        };
        const [updateProduct] = await Products.update(product, { where: { id } });
        if (updateProduct === 0) {
            return res.status(401).json({ message: 'PRODUCT_NOT_FOUND' });
        }
        return res.status(200).json({ message: 'PRODUCT_UPDATED_SUCCESSFULLY' });
    } catch (error) {
        console.log('Error on put /update-product', error);
        return res.status(400).json({ message: 'PRODUCT_UPDATE_FAILED' });
    }
});

app.listen(3000, () => {
    console.log('App is listening on 3000');
});

module.exports = app;