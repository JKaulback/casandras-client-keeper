const Customer = require('../models/Customer');

exports.getAllCustomers = async (req, res) => {
  try {
    const customers = await Customer.find()
      .populate('userId', 'name email')
      .sort({ createdAt: -1 });
    
    res.json({
      success: true,
      count: customers.length,
      data: customers
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

exports.getCustomerById = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id)
      .populate('userId', 'name email');
    
    if (!customer) {
      return res.status(404).json({
        success: false,
        error: 'Customer not found'
      });
    }
    
    res.json({
      success: true,
      data: customer
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

exports.createCustomer = async (req, res) => {
  try {
    const { name, phone, email, occupation, address, userId } = req.body;
    
    const customer = await Customer.create({
      name,
      phone,
      email,
      occupation,
      address,
      userId
    });
    
    res.status(201).json({
      success: true,
      data: customer
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

exports.updateCustomer = async (req, res) => {
  try {
    const { name, phone, email, occupation, address, userId } = req.body;
    
    const customer = await Customer.findByIdAndUpdate(
      req.params.id,
      { name, phone, email, occupation, address, userId },
      {
        new: true,
        runValidators: true
      }
    ).populate('userId', 'name email');
    
    if (!customer) {
      return res.status(404).json({
        success: false,
        error: 'Customer not found'
      });
    }
    
    res.json({
      success: true,
      data: customer
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

exports.deleteCustomer = async (req, res) => {
  try {
    const customer = await Customer.findByIdAndDelete(req.params.id);
    
    if (!customer) {
      return res.status(404).json({
        success: false,
        error: 'Customer not found'
      });
    }
    
    res.json({
      success: true,
      data: {},
      message: 'Customer deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

exports.searchCustomers = async (req, res) => {
  try {
    const searchTerm = req.query.q;
    
    if (!searchTerm) {
      return res.status(400).json({
        success: false,
        error: 'Search term is required'
      });
    }
    
    const customers = await Customer.find({
      $or: [
        { name: { $regex: searchTerm, $options: 'i' } },
        { phone: { $regex: searchTerm, $options: 'i' } },
        { email: { $regex: searchTerm, $options: 'i' } }
      ]
    }).populate('userId', 'name email');
    
    res.json({
      success: true,
      count: customers.length,
      data: customers
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};
