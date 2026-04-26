const { body, param, query } = require('express-validator');
const asyncHandler = require('../utils/asyncHandler');
const validate = require('../middleware/validate');
const { Contact } = require('../models');
const { sendContactAdminEmail } = require('../utils/email');
const { contactSerializer } = require('../utils/serializers');
const { AppError, createPagination } = require('../utils/api');

const createContact = [
  validate([
    body('name').trim().isLength({ min: 2, max: 100 }).withMessage('Name must be 2-100 characters long.'),
    body('email').trim().isEmail().withMessage('Valid email is required.'),
    body('phone').optional({ nullable: true }).trim().isLength({ min: 7, max: 20 }).withMessage('Phone number is invalid.'),
    body('message').trim().isLength({ min: 10, max: 2000 }).withMessage('Message must be 10-2000 characters long.'),
  ]),
  asyncHandler(async (req, res) => {
    const contact = await Contact.create({
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone || null,
      message: req.body.message,
    });

    await sendContactAdminEmail(contact);

    res.status(201).json({ data: contactSerializer(contact) });
  }),
];

const listContactsAdmin = [
  validate([
    query('page').optional().isInt({ min: 1 }).toInt(),
    query('limit').optional().isInt({ min: 1, max: 100 }).toInt(),
    query('status').optional().isIn(['new', 'responded']),
  ]),
  asyncHandler(async (req, res) => {
    const page = req.query.page || 1;
    const limit = req.query.limit || 10;
    const offset = (page - 1) * limit;
    const where = req.query.status ? { status: req.query.status } : {};

    const { count, rows } = await Contact.findAndCountAll({
      where,
      order: [['created_at', 'DESC']],
      limit,
      offset,
    });

    res.json({
      data: rows.map(contactSerializer),
      meta: createPagination(page, limit, count),
    });
  }),
];

const updateContact = [
  validate([
    param('id').isInt({ min: 1 }),
    body('status').isIn(['new', 'responded']).withMessage('Invalid status.'),
  ]),
  asyncHandler(async (req, res) => {
    const contact = await Contact.findByPk(req.params.id);
    if (!contact) {
      throw new AppError(404, 'Message not found.');
    }

    contact.status = req.body.status;
    await contact.save();

    res.json({ data: contactSerializer(contact) });
  }),
];

const deleteContact = [
  validate([param('id').isInt({ min: 1 })]),
  asyncHandler(async (req, res) => {
    const contact = await Contact.findByPk(req.params.id);
    if (!contact) {
      throw new AppError(404, 'Message not found.');
    }

    await contact.destroy();
    res.json({ data: { success: true } });
  }),
];

module.exports = {
  createContact,
  deleteContact,
  listContactsAdmin,
  updateContact,
};
