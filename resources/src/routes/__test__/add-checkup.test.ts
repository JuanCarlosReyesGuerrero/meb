import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';
import { Resource } from '../../models/resource';
import { ResourceType } from '../../models/resource-type';
import { Component } from '../../models/component';
import { Checkup } from '../../models/checkup';
import { ResourceStatus } from '@movers/common';

const getResource = async () => {
  const resourceType = ResourceType.build({
    resourceTypeBrand: 'Marca',
    resourceTypeModel: 'Modelo',
    checkupTime: 20,
    photo: 'Photo',
    type: 'Bicicleta',
    measureIndicators: true,
  });
  const component = Component.build({
    name: 'Frenos',
    resourceType: 'Bicicleta',
    componentBrand: 'Marca',
    componentModel: 'Modelo',
    regularCondition: {
      disables: false,
      ticket: false,
    },
    badCondition: {
      disables: false,
      ticket: false,
    },
  });
  await component.save();

  await resourceType.save();
  const resource = Resource.build({
    type: 'Bicicleta',
    reference: '0001',
    qrCode: 'https://meb.moversapp.co',
    lockerPassword: 123456,
    client: 'Claro',
    office: 'Sede principal',
    loanTime: 24,
    status: ResourceStatus.Available,
  });

  await resource.save();
  return resource;
};

it('has a POST route handler for /api/resources/:id/checkup ', async () => {
  const resource = await getResource();
  const response = await request(app)
    .post(`/api/resources/${resource.id}/checkups`)
    .send({});
  expect(response.status).not.toEqual(404);
});

it('can only be accessed by logged users', async () => {
  const resource = await getResource();
  const response = await request(app)
    .post(`/api/resources/${resource.id}/checkups`)
    .send({});
  expect(response.status).toEqual(401);
});

it('returns status other than 401 if the user is logged in', async () => {
  const cookie = global.signin();
  const resource = await getResource();
  const response = await request(app)
    .post(`/api/resources/${resource.id}/checkups`)
    .set('Cookie', cookie)
    .send({});
  expect(response.status).not.toEqual(401);
});

it('returns an error when the resource does not exists', async () => {
  const cookie = global.signin();
  const id = mongoose.Types.ObjectId().toHexString();
  const response = await request(app)
    .post(`/api/resources/${id}/checkups`)
    .set('Cookie', cookie)
    .send({});
  expect(response.status).toEqual(400);
});

it('returns status 201 and creates checkup when given valid params', async () => {
  let checkups = await Checkup.find({});
  expect(checkups.length).toEqual(0);
  const cookie = global.signin();
  const resource = await getResource();
  const response = await request(app)
    .post(`/api/resources/${resource.id}/checkups`)
    .set('Cookie', cookie)
    .send({});
  expect(response.status).toEqual(201);
  checkups = await Checkup.find({});
  expect(checkups.length).toEqual(1);
});