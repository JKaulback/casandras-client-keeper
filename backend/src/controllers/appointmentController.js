const Appointment = require('../models/Appointment');
const Customer = require('../models/Customer');
const Dog = require('../models/Dog');

// @desc    Get all appointments
// @route   GET /api/appointments
// @access  Public
exports.getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .populate('customerId', '_id name phone email')
      .populate('dogId', '_id name breed')
      .sort({ dateTime: 1 }); // Sort by date/time ascending
    
    res.json({
      success: true,
      count: appointments.length,
      data: appointments
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Get single appointment by ID
// @route   GET /api/appointments/:id
// @access  Public
exports.getAppointmentById = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate('customerId', '_id name phone email')
      .populate('dogId', '_id name breed');
    
    if (!appointment) {
      return res.status(404).json({
        success: false,
        error: 'Appointment not found'
      });
    }
    
    res.json({
      success: true,
      data: appointment
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Get appointments by customer ID
// @route   GET /api/appointments/customer/:customerId
// @access  Public
exports.getAppointmentsByCustomer = async (req, res) => {
  try {
    const appointments = await Appointment.find({ customerId: req.params.customerId })
      .populate('customerId', '_id name phone email')
      .populate('dogId', '_id name breed')
      .sort({ dateTime: 1 });
    
    res.json({
      success: true,
      count: appointments.length,
      data: appointments
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Get appointments by dog ID
// @route   GET /api/appointments/dog/:dogId
// @access  Public
exports.getAppointmentsByDog = async (req, res) => {
  try {
    const appointments = await Appointment.find({ dogId: req.params.dogId })
      .populate('customerId', '_id name phone email')
      .populate('dogId', '_id name breed')
      .sort({ dateTime: 1 });
    
    res.json({
      success: true,
      count: appointments.length,
      data: appointments
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Get appointments by date range
// @route   GET /api/appointments/range?start=YYYY-MM-DD&end=YYYY-MM-DD
// @access  Public
exports.getAppointmentsByDateRange = async (req, res) => {
  try {
    const { start, end } = req.query;
    
    if (!start || !end) {
      return res.status(400).json({
        success: false,
        error: 'Start and end dates are required'
      });
    }
    
    const appointments = await Appointment.find({
      dateTime: {
        $gte: new Date(start),
        $lte: new Date(end)
      }
    })
      .populate('customerId', '_id name phone email')
      .populate('dogId', '_id name breed')
      .sort({ dateTime: 1 });
    
    res.json({
      success: true,
      count: appointments.length,
      data: appointments
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Get appointments by status
// @route   GET /api/appointments/status/:status
// @access  Public
exports.getAppointmentsByStatus = async (req, res) => {
  try {
    const { status } = req.params;
    
    const validStatuses = ['pending', 'confirmed', 'completed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid status. Must be: pending, confirmed, completed, or cancelled'
      });
    }
    
    const appointments = await Appointment.find({ status })
      .populate('customerId', '_id name phone email')
      .populate('dogId', '_id name breed')
      .sort({ dateTime: 1 });
    
    res.json({
      success: true,
      count: appointments.length,
      data: appointments
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Create new appointment
// @route   POST /api/appointments
// @access  Public
exports.createAppointment = async (req, res) => {
  try {
    const {
      customerId,
      dogId,
      dateTime,
      durationMinutes,
      cost,
      notes,
      status,
      isRecurring,
      recurrenceRule,
      paymentStatus
    } = req.body;
    
    // Validate that customer exists
    const customer = await Customer.findById(customerId);
    if (!customer) {
      return res.status(404).json({
        success: false,
        error: 'Customer not found. Please select a valid customer.'
      });
    }
    
    // Validate that dog exists
    const dog = await Dog.findById(dogId);
    if (!dog) {
      return res.status(404).json({
        success: false,
        error: 'Dog not found. Please select a valid dog.'
      });
    }
    
    // Validate that dog belongs to customer
    if (dog.ownerId.toString() !== customerId) {
      return res.status(400).json({
        success: false,
        error: 'Dog does not belong to the specified customer.'
      });
    }
    
    const appointment = await Appointment.create({
      customerId,
      dogId,
      dateTime,
      durationMinutes,
      cost,
      notes,
      status,
      isRecurring,
      recurrenceRule,
      paymentStatus
    });
    
    // Populate customer and dog info in response
    await appointment.populate('customerId', '_id name phone email');
    await appointment.populate('dogId', '_id name breed');
    
    res.status(201).json({
      success: true,
      data: appointment
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Update appointment
// @route   PUT /api/appointments/:id
// @access  Public
exports.updateAppointment = async (req, res) => {
  try {
    const {
      dateTime,
      durationMinutes,
      cost,
      notes,
      status,
      isRecurring,
      recurrenceRule,
      conflictFlag,
      conflictNote,
      paymentStatus,
      transactionId
    } = req.body;
    
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      {
        dateTime,
        durationMinutes,
        cost,
        notes,
        status,
        isRecurring,
        recurrenceRule,
        conflictFlag,
        conflictNote,
        paymentStatus,
        transactionId
      },
      {
        new: true,
        runValidators: true
      }
    )
      .populate('customerId', '_id name phone email')
      .populate('dogId', '_id name breed');
    
    if (!appointment) {
      return res.status(404).json({
        success: false,
        error: 'Appointment not found'
      });
    }
    
    res.json({
      success: true,
      data: appointment
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Delete appointment
// @route   DELETE /api/appointments/:id
// @access  Public
exports.deleteAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndDelete(req.params.id);
    
    if (!appointment) {
      return res.status(404).json({
        success: false,
        error: 'Appointment not found'
      });
    }
    
    res.json({
      success: true,
      data: {},
      message: 'Appointment deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Cancel appointment (soft delete)
// @route   PATCH /api/appointments/:id/cancel
// @access  Public
exports.cancelAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { status: 'cancelled' },
      { new: true }
    )
      .populate('customerId', '_id name phone email')
      .populate('dogId', '_id name breed');
    
    if (!appointment) {
      return res.status(404).json({
        success: false,
        error: 'Appointment not found'
      });
    }
    
    res.json({
      success: true,
      data: appointment,
      message: 'Appointment cancelled successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};
