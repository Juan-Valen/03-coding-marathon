const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  type: { type: String, required: true }, 
  description: { type: String, required: true },
  company: {
    name: { type: String, required: true },
    contactEmail: { type: String, required: true },
    contactPhone: { type: String, required: true },
    website: { type: String }, 
    size: { type: Number }, 
  },
  location: { type: String, required: true }, 
  salary: { type: Number, required: true }, 
  experienceLevel: { type: String, enum: ['Entry', 'Mid', 'Senior'], default: 'Entry' }, 
  postedDate: { type: Date, default: Date.now },
  status: { type: String, enum: ['open', 'closed'], default: 'open' }, 
  applicationDeadline: { type: Date },  
  requirements: [String], 
});

jobSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id = ret._id;
    return ret;
  }
});

const Job = mongoose.model('Job', jobSchema);

module.exports = Job;
