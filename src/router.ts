import { Router } from 'express';
import {
    createPSProduct,
    deletePSProduct,
    getPSProductById,
    getPSProducts,
    updateAvailability,
    updatePSProduct,
} from './handlers/petshopProduct';
import { body, param } from 'express-validator';
import { handleInputErrors } from './middleware';
import { categories } from './utils';

//Create instance of router
const router = Router();
/**
 * @swagger
 * components:
 *  schemas:
 *      PetshopProduct:
 *          type: object
 *          properties:
 *              id:
 *                  type: integer
 *                  description: Product ID
 *                  example: 1
 *              name:
 *                  type: string
 *                  description: Product name
 *                  example: Purina Pro Plan Dry Cat Food
 *              price:
 *                  type: number
 *                  description: Product price
 *                  example: 50
 *              amount:
 *                  type: number
 *                  description: Amount of product
 *                  example: 25
 *              category:
 *                  type: string
 *                  description: Product category ["Cat food", "Dog food", "Bird food", "Cat accesories", "Dog Accesories"]
 *                  example: Cat food
 *              availability:
 *                  type: boolean
 *                  description: Product availability
 *                  example: true
 *
 */

/**
 * @swagger
 * /api/products:
 *      get:
 *          summary: Get a list of products
 *          tags:
 *              - PetshopProducts
 *          description: returns a list of products
 *          responses:
 *              200:
 *                  description: Successful response
 *                  content:
 *                      application/json:
 *                          schema:
 *                                  type: array
 *                                  items:
 *                                      $ref: '#/components/schemas/PetshopProduct'
 *
 */
router.get('/', getPSProducts);

/**
 * @swagger
 * /api/products/{id}:
 *  get:
 *      summary: Get a product by ID
 *      tags:
 *          - PetshopProducts
 *      description: Return a product based on its unique id
 *      parameters:
 *        - in : path
 *          name : id
 *          description : the id of the product to retrieve
 *          required: true
 *          schema:
 *              type: integer
 *      responses:
 *          200:
 *              description: successful response
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/PetshopProduct'
 *
 *          400:
 *              description: bad request - invalid id
 *          404:
 *              description: not found
 */
router.get(
    '/:id',
    param('id').isInt().withMessage('invalid Id'),

    handleInputErrors,
    getPSProductById
);

/**
 *
 * @swagger
 * /api/products:
 *  post:
 *      summary: Creates a new product
 *      tags:
 *          - PetshopProducts
 *      description: returns a new record in the database
 *      requestBody:
 *          required : true
 *          content :
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          name:
 *                              type: string
 *                              example: "Purina Dry Cat Food"
 *                          price:
 *                              type: number
 *                              example: 55
 *                          amount:
 *                              type: number
 *                              example: 10
 *                          category:
 *                              type: string
 *                              example: "Cat food"
 *      responses:
 *          201:
 *              description: product created succesfuly
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/PetshopProduct'
 *
 *          400:
 *              description: bad request - invalid data
 */
router.post(
    '/',
    body('name').notEmpty().withMessage("Product name can't be empty"),

    body('price')
        .isNumeric()
        .withMessage('Invalid value')
        .notEmpty()
        .withMessage("Product price can't be empty")
        .custom((value) => value > 0)
        .withMessage('Product price must be 1 or more'),

    body('amount')
        .isNumeric()
        .withMessage('Invalid value')
        .notEmpty()
        .withMessage("Product amount can't be empty")
        .custom((value) => value >= 0)
        .withMessage('Product amount must be 0 or more'),

    body('category')
        .notEmpty()
        .withMessage("Product amount can't be empty")
        .custom((value) => categories.includes(value))
        .withMessage(
            `Product category must be one of these options ${categories}`
        ),

    handleInputErrors,
    createPSProduct
);

/**
 * @swagger
 * /api/products/{id}:
 *  put:
 *      summary: updates a product with user input
 *      tags:
 *          - PetshopProducts
 *      description: returns the updated product
 *      parameters:
 *        - in : path
 *          name : id
 *          description : the id of the  product to retrieve
 *          required: true
 *          schema:
 *              type: integer
 *      requestBody:
 *          required : true
 *          content :
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          name:
 *                              type: string
 *                              example: "Purina Dry Cat Food"
 *                          price:
 *                              type: number
 *                              example: 55
 *                          amount:
 *                              type: number
 *                              example: 15
 *                          category:
 *                              type: string
 *                              example:  "Cat food"
 *                          availability:
 *                              type: boolean
 *                              example: true
 *      responses:
 *          200:
 *              description: product edited succesfuly
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/PetshopProduct'
 *          404:
 *              description: bad request - invalid request or invalid data
 *          400:
 *              description: bad request - invalid data
 *
 *
 */
router.put(
    '/:id',
    param('id').isInt().withMessage('invalid Id'),
    body('name').notEmpty().withMessage("Product name can't be empty"),

    body('price')
        .isNumeric()
        .withMessage('Invalid value')
        .notEmpty()
        .withMessage("Product price can't be empty")
        .custom((value) => value > 0)
        .withMessage('Product price must be 1 or more'),

    body('amount')
        .isNumeric()
        .withMessage('Invalid value')
        .notEmpty()
        .withMessage("Product amount can't be empty")
        .custom((value) => value >= 0)
        .withMessage('Product amount must be 0 or more'),

    body('category')
        .notEmpty()
        .withMessage("Product amount can't be empty")
        .custom((value) => categories.includes(value))
        .withMessage(
            `Product category must be one of these options ${categories}`
        ),

    body('availability').isBoolean().withMessage('Invalid value'),

    handleInputErrors,

    updatePSProduct
);

/**
 * @swagger
 * /api/products/{id}:
 *  patch:
 *      summary: modifies availavility field of a selected product
 *      tags:
 *          - PetshopProducts
 *      description: Returns product with updated availability
 *      parameters:
 *        - in : path
 *          name : id
 *          description : the id of the  product to retrieve
 *          required: true
 *          schema:
 *              type: integer
 *      responses:
 *          200:
 *              description: successful response
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/PetshopProduct'
 *
 *          400:
 *              description: bad request - invalid id
 *          404:
 *              description: not found
 */
router.patch(
    '/:id',
    param('id').isInt().withMessage('invalid Id'),
    handleInputErrors,
    updateAvailability
);

/**
 * @swagger
 * /api/products/{id}:
 *  delete:
 *      summary: deletes a selected product
 *      tags:
 *          - PetshopProducts
 *      description: Returns message of succesful deletion
 *      parameters:
 *        - in : path
 *          name : id
 *          description : the id of the  product to retrieve
 *          required: true
 *          schema:
 *              type: integer
 *      responses:
 *          200:
 *              description: successful response
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: string
 *                          example: "Deleted product"
 *
 *          400:
 *              description: bad request - invalid id
 *          404:
 *              description: not found
 */
router.delete(
    '/:id',
    param('id').isInt().withMessage('invalid Id'),
    handleInputErrors,
    deletePSProduct
);

export default router;
