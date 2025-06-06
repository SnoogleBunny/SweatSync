const Trainer = require('../models/trainer.model');
const { ApiError } = require('@sweatsync/shared/errors');

exports.getTrainers = async (req, res, next) => {
    try {
        const queryObj = {};
        
        if (req.query.specialties) {
          queryObj.specialties = { $in: req.query.specialties.split(',') };
        }

        if (req.query.maxRate) {
          queryObj.hourlyRate = { $lte: Number(req.query.maxRate) };
        }

        if (req.query.location) {
          queryObj.location = {
              $regex: req.query.location,
              $options: 'i'
          };
        }

        // Pagination
        const page = Math.max(1, parseInt(req.query.page, 10) || 1);
        const limit = Math.max(1, parseInt(req.query.limit, 10) || 10);
        const skip = (page - 1) * limit;

        const [total, trainers] = await Promise.all([
        Trainer.countDocuments(queryObj),
        Trainer.find(queryObj)
            .select('name specialties hourlyRate location active availability') // Make sure this lines up with Schema
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

exports.getTrainerById = async (req, res, next) => {
  try {
    const trainer = await Trainer.findOne(
      { userId: req.params.id },
      { availability: 0 },
      { __v: 0, createdAt: 0 } // exclude all the metadata idgaf about those
    ).lean();

    if(!trainer) throw new ApiError('Trainer not found', 404);

    res.status(200).json({
      sucecss: true,
      data: trainer
    });
  } catch (err) {
    next(err);
  }
}

exports.createTrainerProfile = async (req, res, next) => {
  try {
    const { userId, specialties, hourlyRate, availability, active } = req.body;

    // 1. Input Validation (Concise version)
    if (!Array.isArray(specialties)) {
      throw new ApiError('Specialties must be an array', 400);
    }

    // 2. Create with default values
    const trainer = await Trainer.create({
      userId,
      specialties,
      hourlyRate,
      availability,
      active // Default for new trainers
    });

    res.status(201).json({
      success: true,
      data: trainer
    });

  } catch (err) {
    // 3. Handle Mongoose validation errors automatically
    if (err.name === 'ValidationError') {
      return next(new ApiError(err.message, 400));
    }
    next(err);
  }
};

exports.updateAvailability = async (req, res, next) => {
  try {
    const { userId, availability } = req.body;

    const trainer = await Trainer.findOneAndUpdate(
      { userId: userId },
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
    const { userId, availability } = req.body;

    const trainer = await Trainer.findOneAndUpdate(
      { userId: userId },
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


// Administrative Controllers (We will move these in a decoupled service later)
exports.deleteUsers = async (req, res, next) => {
  try {
    const result = await Trainer.deleteMany({ active: true });

    res.status(200).json({
      success: true,
      message: `Deleted ${result.deletedCount} active trainers`,
      deletedCount: result.deletedCount
    });

  } catch (err) {
    // 5. Special handling for bulk operation errors
    if (err.message.includes('batch operation')) {
      return next(new ApiError('Database batch operation failed', 500));
    }
    next(err);
  }
};