/**
 * Validation middleware for API requests
 */

export const validateMember = (req, res, next) => {
  const { first_name, last_name, email, phone, membership_type } = req.body;

  const errors = [];

  if (!first_name || first_name.trim() === "") {
    errors.push("First name is required");
  }

  if (!last_name || last_name.trim() === "") {
    errors.push("Last name is required");
  }

  if (!email || !isValidEmail(email)) {
    errors.push("Valid email is required");
  }

  if (phone && !isValidPhone(phone)) {
    errors.push("Invalid phone number");
  }

  if (!membership_type || membership_type.trim() === "") {
    errors.push("Membership type is required");
  }

  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  next();
};

export const validateTrainer = (req, res, next) => {
  const { first_name, last_name, email, phone, specialization, specializations } = req.body;

  const errors = [];

  // Only validate required fields
  if (!first_name || (typeof first_name === 'string' && first_name.trim() === "")) {
    errors.push("First name is required");
  }

  if (!last_name || (typeof last_name === 'string' && last_name.trim() === "")) {
    errors.push("Last name is required");
  }

  if (!email || (typeof email === 'string' && !isValidEmail(email))) {
    errors.push("Valid email is required");
  }

  if (phone && typeof phone === 'string' && !isValidPhone(phone)) {
    errors.push("Invalid phone number");
  }

  // Specialization can come from either 'specialization' field or 'specializations' array
  // For updates, allow empty specialization if it's an update (check if ID exists in URL)
  const isUpdate = req.method === 'PUT' || req.method === 'PATCH';
  const hasSpecialization = (specialization && typeof specialization === 'string' && specialization.trim() !== "") || 
                            (Array.isArray(specializations) && specializations.length > 0);
  
  // Only require specialization for new trainers, not updates
  if (!isUpdate && !hasSpecialization) {
    errors.push("At least one specialization is required");
  }

  if (errors.length > 0) {
    console.log('❌ Validation errors:', errors);
    console.log('❌ Request body:', JSON.stringify(req.body, null, 2));
    return res.status(400).json({ errors });
  }

  next();
};

export const validateEquipment = (req, res, next) => {
  const { name, category, quantity } = req.body;

  const errors = [];

  if (!name || name.trim() === "") {
    errors.push("Equipment name is required");
  }

  if (!category || category.trim() === "") {
    errors.push("Category is required");
  }

  if (!quantity || isNaN(quantity) || quantity < 1) {
    errors.push("Valid quantity is required");
  }

  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  next();
};

/**
 * Helper functions
 */

function isValidEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

function isValidPhone(phone) {
  const regex = /^[\d\s()+\-]+$/;
  return regex.test(phone) && phone.replace(/\D/g, "").length >= 10;
}

export default {
  validateMember,
  validateTrainer,
  validateEquipment
};
