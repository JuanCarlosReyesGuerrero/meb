import express, { Request, Response } from 'express';
import { body } from 'express-validator';
/* Commons */
import { requireAuth, validateRequest, NotFoundError } from '@movers/common';
/* Models */
import { Client } from '../models/client';

const router = express.Router();

router.put(
  '/api/clients/:id',
  requireAuth(),
  [
    body('name').not().isEmpty().withMessage('Name is required'),
    body('address').not().isEmpty().withMessage('Address is required'),
    body('logo').not().isEmpty().withMessage('Logo is required'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const client = await Client.findById(req.params.id);
    if (!client) {
      throw new NotFoundError();
    }
    const { name, address, logo } = req.body;
    client.set({
      name,
      address,
      logo,
    });
    await client.save();
    res.send(client);
  }
);

export { router as updateClientRouter };
