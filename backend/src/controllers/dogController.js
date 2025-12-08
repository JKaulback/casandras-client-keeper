const Dog = require('../models/Dog');

// @desc    Get all dogs
// @route   GET /api/dogs
// @access  Public
exports.getAllDogs = async (req, res) => {
  try {
    const dogs = await Dog.find()
      .populate('ownerId', '_id name phone email')
      .sort({ createdAt: -1 });
    
    res.json({
      success: true,
      count: dogs.length,
      data: dogs
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Get single dog by ID
// @route   GET /api/dogs/:id
// @access  Public
exports.getDogById = async (req, res) => {
  try {
    const dog = await Dog.findById(req.params.id)
      .populate('ownerId', '_id name phone email');
    
    if (!dog) {
      return res.status(404).json({
        success: false,
        error: 'Dog not found'
      });
    }
    
    res.json({
      success: true,
      data: dog
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Get dogs by owner (customer) ID
// @route   GET /api/dogs/owner/:ownerId
// @access  Public
exports.getDogsByOwner = async (req, res) => {
  try {
    const dogs = await Dog.find({ ownerId: req.params.ownerId })
      .populate('ownerId', '_id name phone email')
      .sort({ name: 1 });
    
    res.json({
      success: true,
      count: dogs.length,
      data: dogs
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Create new dog
// @route   POST /api/dogs
// @access  Public
exports.createDog = async (req, res) => {
  try {
    const {
      ownerId,
      name,
      sex,
      breed,
      dob,
      color,
      weight,
      vet,
      medicalInfo,
      rabiesVaccineDate,
      areVaccinesCurrent,
      isFixed,
      temperament,
      imageURL,
      notes
    } = req.body;
    
    // Validate that the customer/owner exists
    const Customer = require('../models/Customer');
    const owner = await Customer.findById(ownerId);
    if (!owner) {
      return res.status(404).json({
        success: false,
        error: 'Customer not found. Please provide a valid ownerId.'
      });
    }
    
    const dog = await Dog.create({
      ownerId,
      name,
      sex,
      breed,
      dob,
      color,
      weight,
      vet,
      medicalInfo,
      rabiesVaccineDate,
      areVaccinesCurrent,
      isFixed,
      temperament,
      imageURL,
      notes
    });
    
    // Populate owner info in response
    await dog.populate('ownerId', 'name phone email');
    
    res.status(201).json({
      success: true,
      data: dog
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Update dog
// @route   PUT /api/dogs/:id
// @access  Public
exports.updateDog = async (req, res) => {
  try {
    const {
      name,
      sex,
      breed,
      dob,
      color,
      weight,
      vet,
      medicalInfo,
      rabiesVaccineDate,
      areVaccinesCurrent,
      isFixed,
      temperament,
      imageURL,
      notes
    } = req.body;
    
    const dog = await Dog.findByIdAndUpdate(
      req.params.id,
      {
        name,
        sex,
        breed,
        dob,
        color,
        weight,
        vet,
        medicalInfo,
        rabiesVaccineDate,
        areVaccinesCurrent,
        isFixed,
        temperament,
        imageURL,
        notes
      },
      {
        new: true,
        runValidators: true
      }
    ).populate('ownerId', 'name phone email');
    
    if (!dog) {
      return res.status(404).json({
        success: false,
        error: 'Dog not found'
      });
    }
    
    res.json({
      success: true,
      data: dog
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Delete dog
// @route   DELETE /api/dogs/:id
// @access  Public
exports.deleteDog = async (req, res) => {
  try {
    const dog = await Dog.findByIdAndDelete(req.params.id);
    
    if (!dog) {
      return res.status(404).json({
        success: false,
        error: 'Dog not found'
      });
    }
    
    res.json({
      success: true,
      data: {},
      message: 'Dog deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Search dogs by name or breed
// @route   GET /api/dogs/search?q=searchTerm
// @access  Public
exports.searchDogs = async (req, res) => {
  try {
    const searchTerm = req.query.q;
    
    if (!searchTerm) {
      return res.status(400).json({
        success: false,
        error: 'Search term is required'
      });
    }
    
    const dogs = await Dog.find({
      $or: [
        { name: { $regex: searchTerm, $options: 'i' } },
        { breed: { $regex: searchTerm, $options: 'i' } }
      ]
    }).populate('ownerId', 'name phone email');
    
    res.json({
      success: true,
      count: dogs.length,
      data: dogs
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};
