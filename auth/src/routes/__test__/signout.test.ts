import request from 'supertest';
import { app } from '../../app';

it('clears cookie after signing out', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'password',
      firstName: 'Regular',
      lastName: 'User',
      city: 'Bogota',
      country: 'Colombia',
      mainTransportationMethod: 'Carro',
      secondaryTransportationMethod: 'Moto',
      termsDate: true,
      comodatoDate: true,
    })
    .expect(201);

  const response = await request(app)
    .post('/api/users/signout')
    .send({})
    .expect(200);
  expect(response.get('Set-Cookie')[0]).toEqual(
    // 'express:sess=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; domain=.moversapp.co'
    'express:sess=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; domain=.meb.dev'
  );
});
