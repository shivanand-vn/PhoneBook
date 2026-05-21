const Contact = require('../models/Contact');
const { uploadImage, deleteImage } = require('../utils/cloudinaryHelper');

// Helper to parse tags from request body
const parseTags = (tagsInput) => {
  if (!tagsInput) return [];
  if (Array.isArray(tagsInput)) return tagsInput.map(t => t.trim()).filter(Boolean);
  if (typeof tagsInput === 'string') {
    try {
      const parsed = JSON.parse(tagsInput);
      if (Array.isArray(parsed)) return parsed.map(t => t.trim()).filter(Boolean);
    } catch (e) {
      // Not JSON, parse as comma-separated
    }
    return tagsInput.split(',').map(t => t.trim()).filter(Boolean);
  }
  return [];
};

// @desc    Get all contacts for the authenticated user (with pagination, filtering, sorting)
// @route   GET /api/contacts
// @access  Private
const getContacts = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, favorite, tag, company, sortBy } = req.query;
    
    // Build query object
    const query = { user: req.user._id };

    if (favorite === 'true') {
      query.favorite = true;
    }
    if (tag) {
      query.tags = tag;
    }
    if (company) {
      query.company = { $regex: new RegExp(company, 'i') };
    }

    // Pagination setup
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    // Sorting setup
    let sortOptions = {};
    if (sortBy === 'name') {
      sortOptions = { name: 1 };
    } else if (sortBy === 'recently_added') {
      sortOptions = { createdAt: -1 };
    } else if (sortBy === 'company') {
      sortOptions = { company: 1 };
    } else {
      // Default sort is alphabetical by name
      sortOptions = { name: 1 };
    }

    // Execute query
    const total = await Contact.countDocuments(query);
    const contacts = await Contact.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(limitNum);

    res.json({
      success: true,
      count: contacts.length,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        pages: Math.ceil(total / limitNum),
        showingFrom: skip + 1,
        showingTo: Math.min(skip + contacts.length, total)
      },
      contacts
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get a single contact details
// @route   GET /api/contacts/:id
// @access  Private
const getContactById = async (req, res, next) => {
  try {
    const contact = await Contact.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!contact) {
      res.status(404);
      return next(new Error('Contact not found'));
    }

    res.json({
      success: true,
      contact
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add a new contact
// @route   POST /api/contacts
// @access  Private
const addContact = async (req, res, next) => {
  try {
    const { name, phone, email, company, address, tags, favorite } = req.body;

    // Check duplicate phone or email for this user
    if (phone) {
      const phoneExists = await Contact.findOne({ user: req.user._id, phone });
      if (phoneExists) {
        res.status(400);
        return next(new Error(`A contact with the phone number '${phone}' already exists in your phonebook`));
      }
    }

    if (email) {
      const emailExists = await Contact.findOne({ user: req.user._id, email });
      if (emailExists) {
        res.status(400);
        return next(new Error(`A contact with the email '${email}' already exists in your phonebook`));
      }
    }

    let profileImageUrl = '';
    if (req.file) {
      profileImageUrl = await uploadImage(req.file.buffer, 'contacts');
    }

    const contact = await Contact.create({
      name,
      phone,
      email: email || undefined,
      company: company || undefined,
      address: address || undefined,
      tags: parseTags(tags),
      favorite: favorite === 'true' || favorite === true,
      profileImage: profileImageUrl,
      user: req.user._id
    });

    res.status(201).json({
      success: true,
      message: 'Contact added successfully',
      contact
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a contact
// @route   PUT /api/contacts/:id
// @access  Private
const updateContact = async (req, res, next) => {
  try {
    const { name, phone, email, company, address, tags, favorite } = req.body;

    const contact = await Contact.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!contact) {
      res.status(404);
      return next(new Error('Contact not found'));
    }

    // Check duplicate phone or email if changing
    if (phone && phone !== contact.phone) {
      const phoneExists = await Contact.findOne({ user: req.user._id, phone });
      if (phoneExists) {
        res.status(400);
        return next(new Error(`Another contact with phone number '${phone}' already exists`));
      }
    }

    if (email && email !== contact.email) {
      const emailExists = await Contact.findOne({ user: req.user._id, email });
      if (emailExists) {
        res.status(400);
        return next(new Error(`Another contact with email '${email}' already exists`));
      }
    }

    // If new image file is provided, upload and delete old image
    let profileImageUrl = contact.profileImage;
    if (req.file) {
      if (contact.profileImage) {
        await deleteImage(contact.profileImage);
      }
      profileImageUrl = await uploadImage(req.file.buffer, 'contacts');
    }

    contact.name = name || contact.name;
    contact.phone = phone || contact.phone;
    contact.email = email !== undefined ? email : contact.email;
    contact.company = company !== undefined ? company : contact.company;
    contact.address = address !== undefined ? address : contact.address;
    if (tags !== undefined) {
      contact.tags = parseTags(tags);
    }
    if (favorite !== undefined) {
      contact.favorite = favorite === 'true' || favorite === true;
    }
    contact.profileImage = profileImageUrl;

    const updatedContact = await contact.save();

    res.json({
      success: true,
      message: 'Contact updated successfully',
      contact: updatedContact
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a contact
// @route   DELETE /api/contacts/:id
// @access  Private
const deleteContact = async (req, res, next) => {
  try {
    const contact = await Contact.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!contact) {
      res.status(404);
      return next(new Error('Contact not found'));
    }

    // Clean up image on Cloudinary
    if (contact.profileImage) {
      await deleteImage(contact.profileImage);
    }

    await Contact.deleteOne({ _id: contact._id });

    res.json({
      success: true,
      message: 'Contact deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// Helper to escape regex special characters
const escapeRegExp = (string) => {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

// @desc    Smart Search contacts
// @route   GET /api/contacts/search
// @access  Private
const searchContacts = async (req, res, next) => {
  try {
    const { q } = req.query;
    if (!q) {
      return res.json({ success: true, contacts: [] });
    }

    const escapedQ = escapeRegExp(q.trim());
    const regex = new RegExp(escapedQ, 'i');
    
    // Performance optimized lookup with indexes
    const contacts = await Contact.find({
      user: req.user._id,
      $or: [
        { name: regex },
        { phone: regex },
        { email: regex },
        { company: regex }
      ]
    }).limit(20);

    res.json({
      success: true,
      contacts
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get autocomplete suggestions
// @route   GET /api/contacts/suggestions
// @access  Private
const getSuggestions = async (req, res, next) => {
  try {
    const { q } = req.query;
    if (!q) {
      return res.json({ success: true, suggestions: [] });
    }

    const escapedQ = escapeRegExp(q.trim());
    const regex = new RegExp(escapedQ, 'i');
    
    // Fetch contacts matching partial query across name, phone, email, and company
    const contacts = await Contact.find({
      user: req.user._id,
      $or: [
        { name: regex },
        { phone: regex },
        { email: regex },
        { company: regex }
      ]
    })
    .select('name company email phone profileImage')
    .limit(10);

    // Format suggestions
    const suggestions = contacts.map(c => {
      // Create detailed subtext depending on what matched (company, email, or phone)
      let subtext = c.company || '';
      if (c.email && c.email.toLowerCase().includes(q.toLowerCase())) {
        subtext = c.email;
      } else if (c.phone && c.phone.includes(q)) {
        subtext = c.phone;
      } else if (!subtext && c.email) {
        subtext = c.email;
      }
      
      return {
        id: c._id,
        text: c.name,
        subtext: subtext || 'No company/email',
        avatar: c.profileImage || ''
      };
    });

    res.json({
      success: true,
      suggestions
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle Contact Favorite status
// @route   PATCH /api/contacts/:id/favorite
// @access  Private
const toggleFavorite = async (req, res, next) => {
  try {
    const contact = await Contact.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!contact) {
      res.status(404);
      return next(new Error('Contact not found'));
    }

    contact.favorite = !contact.favorite;
    await contact.save();

    res.json({
      success: true,
      message: `Contact ${contact.favorite ? 'added to' : 'removed from'} favorites`,
      favorite: contact.favorite
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getContacts,
  getContactById,
  addContact,
  updateContact,
  deleteContact,
  searchContacts,
  getSuggestions,
  toggleFavorite
};
