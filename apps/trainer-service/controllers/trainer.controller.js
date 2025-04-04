const Trainer = require('../models/trainer.model');
const { ApiError } = require('@sweatsync/shared/errors');

exports.getTrainers = async (req, res, next) => {
    try {
        const queryObj = {};
        
        if (req.query.specialties) {
          queryObj.specialties = { $in: req.query.specialties.split(',') };
        }

        if (req.query.location) {
          queryObj.location = {
              $regex: req.query.location,
              $options: 'i'
          };
        }

        

        // Pagination
        const page = Math.max(1, parseInt(req.query.page, 10) || 1); // Default page 1
        const limit = Math.max(1, parseInt(req.query.limit, 10) || 10); // Default 10 items
        const skip = (page - 1) * limit;

        const [total, trainers] = await Promise.all([
        Trainer.countDocuments(queryObj),
        Trainer.find(queryObj)
            .skip(skip)
            .limit(limit)
            //  We will add this later when we have a UserSchema
            // .populate('userId', 'name email')
            .lean()
        ]);

        const totalPages = Math.ceil(total / limit);

        res.status(200).json({
        success: true,
        data: trainers,
        pagination: {
            total,
            page,
            limit,
            totalPages,
            hasNextPage: page < totalPages
        }
        });
  
    } catch (err) {
        next(err);
    }
};

exports.createTrainerProfile = async (req, res, next) => {
  try {
    const { userId, specialties, hourlyRate, availability } = req.body;

    if (!userId) {
      throw new ApiError('User ID is required', 400);
    }

    const trainer = await Trainer.create({
      userId,
      specialties,
      hourlyRate,
      availability
    });

    res.status(201).json({
      success: true,
      data: trainer
    });

  } catch (err) {
    next(err);
  }
};

exports.updateAvailability = async (req, res, next) => {
  try {
    const { userId, availability } = req.body;

    const trainer = await Trainer.findByIdAndUpdate(
      userId,
      { $set: { availability } },
      { new: true, runValidators: true }
    );

    if (!trainer) {
      throw new ApiError('Trainer not found', 404);
    }

    res.status(200).json({
      success: true,
      data: trainer.availability
    });

  } catch (err) {
    next(err);
  }
};

exports.updateTrainer = async (req, res, next) => {
  try {
    const { trainerId, availability } = req.body;

    const trainer = await Trainer.findByIdAndUpdate(
      trainerId,
      { $set: { availability } },
      { new: true, runValidators: true }
    );

    if (!trainer) {
      throw new ApiError('Trainer not found', 404);
    }

    res.status(200).json({
      success: true,
      data: trainer.availability
    });

  } catch (err) {
    next(err);
  }
};