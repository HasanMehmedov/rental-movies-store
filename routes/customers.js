const express = require('express');
const { Customer, validate } = require('../models/customer');
const router = express.Router();

router.get('/', async (req, res) => {

    try {
        const customers = await getCustomers();
        res.send(customers);
    }
    catch (err) {
        res.status(err.status).send(err.message);
    }
});

router.get('/:id', async (req, res) => {

    const customerId = req.params.id;

    try {
        const customer = await getCustomer(customerId);
        res.send(customer);
    }
    catch (err) {
        res.status(err.status).send(err.message);
    }
});

router.post('/', async (req, res) => {

    try {
        validate(req.body);

        const result = await createCustomer(req.body);
        res.send(result);
    }
    catch (err) {
        res.status(err.status).send(err.message);
    }
});

router.put('/:id', async (req, res) => {

    const customerId = req.params.id;

    try {
        const result = await updateCustomer(customerId, req.body);
        res.send(result);
    }
    catch (err) {
        res.status(err.status).send(err.message);
    }
});

async function getCustomers() {

    const customers = await Customer.find();

    if (!customers || customers.length === 0) {
        const notFoundError = new Error('There are no saved customers.');
        notFoundError.status = 404;
        throw notFoundError;
    }

    return customers;
}

async function getCustomer(id) {

    const customer = await Customer.findById(id);

    if (!customer) {
        const notFoundError = new Error(`Customer with id: ${id} was not found.`);
        notFoundError.status = 404;
        throw notFoundError;
    }

    return customer;
}

async function createCustomer(params) {

    const customer = new Customer({
        name: params.name,
        email: params.email,
        phone: params.phone,
        isGold: params.isGold
    });

    await customer.save();

    return customer;
}

async function updateCustomer(id, params) {
    const customer = await getCustomer(id);

    if(!params.name) {
        params.name = customer.name;
    }
    if(!params.email) {
        params.email = customer.email;
    }
    if(!params.phone) {
        params.phone = customer.phone;
    }
    if(!params.isGold) {
        params.isGold = customer.isGold;
    }

    validate(params);

    customer.set({
        name: params.name,
        email: params.email,
        phone: params.phone,
        isGold: params.isGold
    });

    await customer.save();

    return customer;
}

module.exports = router;