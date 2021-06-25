import express, { Request, Response } from 'express';
import { body } from 'express-validator';
/* Commons */
import { requireAuth, validateRequest, BadRequestError } from '@movers/common';
/* Models */
import { Client } from '../models/client';
import { User } from '../models/user';
const router = express.Router();

router.post(
  '/api/clients',
  requireAuth(),
  [
    body('name').not().isEmpty().withMessage('Name is required'),
    body('nit').not().isEmpty().withMessage('Nit is required'),
    body('logo').not().isEmpty().withMessage('Logo is required'),
    body('mebAdmin').not().isEmpty().withMessage('MEB admin is required'),
    body('superAdminClient')
      .not()
      .isEmpty()
      .withMessage('Super admin client is required'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { name, nit, logo, mebAdmin, superAdminClient } = req.body;

    const existingMebAdmin = await User.findById(mebAdmin);
    if (!existingMebAdmin) {
      throw new BadRequestError('El administrador Mejor en Bici no existe');
    }
    const existingSuperAdminClient = await User.findById(superAdminClient);
    if (!existingSuperAdminClient) {
      throw new BadRequestError('El super administrador del cliente no existe');
    }

    const client = Client.build({
      name,
      nit,
      logo,
      mebAdmin,
      superAdminClient,
    });
    await client.save();

    const populatedClient = await Client.findById(client.id).populate([
      'meb_admin',
      'super_admin_client',
    ]);

    res.status(201).send(populatedClient);
  }
);

export { router as newClientRouter };
