const DepartmentSchema = require('../models/department');

// @desc    Create new department
// @route   POST /api/department
// @access  Public or Protected (based on auth)
const createDepartment = async (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ message: 'Department name is required' });
  }
  console.log(name);
  try {
    // Check if it already exists
    const existing = await DepartmentSchema.findOne({ name });
    if (existing) {
      return res.status(409).json({ message: 'Department already exists' });
    }

    const department = await DepartmentSchema.create({ name });
    res.status(201).json({
      message: 'Department created successfully',
      department
    });
  } catch (error) {
    res.status(500).json({
      message: 'Internal Server Error',
      error: error.message
    });
  }
};


const getalldepartment = async (req, res) =>{
    try {
       const Departments  = await DepartmentSchema.find();
       res.status(200).json({
         status : true,
         message: "Departments retrieved successfully",
         //   data : districts
         data: [
           ...Departments.map((dep) => ({
             id: dep._id,
             department: dep.name,
           })),
         ],
       });
     } catch (error) {
       console.error("Error in get districts controller:", error);
       res.status(500).json({
          status : false,
          message: "Server error" });
     }
}


module.exports = {createDepartment, getalldepartment}
