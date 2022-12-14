const catchAsync = require('../utils/catchAsync');
const Event = require('../models/eventModel');
const AppError = require('../utils/appError');

exports.getHomepage = catchAsync(async (req, res, next) => {});

exports.createEvent = catchAsync(async (req, res, next) => {
  res.status(200).render('createEvent', {
    title: 'Create Event',
    GOOGLE_MAPS_API_KEY: process.env.GOOGLE_MAPS_API_KEY,
    MAPBOX_API_KEY: process.env.MAPBOX_API_KEY,
  });
});

exports.shareEvent = catchAsync(async (req, res, next) => {
  // 1) Get tour data from collection
  const event = await Event.findById(req.params.id);

  if (!event) {
    return next(new AppError('No Event found with that ID', 404));
  }

  // 2) Build & Render template using tour data from 1
  res.status(200).render('shareEvent', {
    title: `Share - ${event.name}`,
    event: event,
    hostname: process.env.NODE_ENV === 'development' ? `http://127.0.0.1:8000/event/${event._id}` : `https://${req.hostname}.com/event/${event._id}`,
  });
});

exports.getEvent = catchAsync(async (req, res, next) => {
  // 1) Get tour data from collection
  const event = await Event.findById(req.params.id).populate('participants').select('-__v');

  if (!event) {
    return next(new AppError('No Event found with that ID', 404));
  }

  // 2) Build & Render template using tour data from 1
  res.status(200).render('getEvent', {
    title: event.name,
    event,
  });
});
