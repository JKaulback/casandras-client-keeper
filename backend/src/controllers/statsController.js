const Customer = require('../models/Customer');
const Dog = require('../models/Dog');
const Appointment = require('../models/Appointment');

// @desc    Get dashboard statistics
// @route   GET /api/stats/dashboard
// @access  Public
exports.getDashboardStats = async (req, res) => {
  try {
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const endOfToday = new Date(startOfToday);
    endOfToday.setDate(endOfToday.getDate() + 1);
    const endOfTomorrow = new Date(endOfToday);
    endOfTomorrow.setDate(endOfTomorrow.getDate() + 1);

    // Run all queries in parallel for better performance
    const [
      totalCustomers,
      totalDogs,
      todayAppointments,
      upcomingAppointments
    ] = await Promise.all([
      Customer.countDocuments(),
      Dog.countDocuments(),
      Appointment.countDocuments({
        dateTime: {
          $gte: startOfToday,
          $lt: endOfToday
        }
      }),
      Appointment.countDocuments({
        dateTime: 
        { $gte: endOfToday,
          $lt: endOfTomorrow
         }
      })
    ]);

    res.json({
      success: true,
      data: {
        totalCustomers,
        totalDogs,
        todayAppointments,
        upcomingAppointments
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Get appointment statistics
// @route   GET /api/stats/appointments
// @access  Public
exports.getAppointmentStats = async (req, res) => {
  try {
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay()); // Start of current week (Sunday)
    startOfWeek.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 7);

    const [
      totalAppointments,
      thisWeekAppointments,
      pastAppointments
    ] = await Promise.all([
      Appointment.countDocuments(),
      Appointment.countDocuments({
        dateTime: {
          $gte: startOfWeek,
          $lt: endOfWeek
        }
      }),
      Appointment.countDocuments({
        dateTime: { $lt: now }
      })
    ]);

    res.json({
      success: true,
      data: {
        totalAppointments,
        thisWeekAppointments,
        pastAppointments,
        upcomingAppointments: totalAppointments - pastAppointments
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};
