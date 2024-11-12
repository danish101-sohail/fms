const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  venue: { type: mongoose.Schema.Types.ObjectId, ref: 'Hall', required: true },
  date: { type: Date, required: true },
  slot: { type: String, enum: ['Forenoon', 'Afternoon'], required: true },
  type: { type: String, enum: ['Cultural', 'Official'], required: true },
  status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
  priority: { type: Number, default: 0 },
  applicant: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  approver: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  alternateDate: {type: Date},
  alternateSlot: { type: String, enum: ['Forenoon', 'Afternoon']},
  approvedByHOD: { type: Boolean, default: false },
  approvedByFinalApprover: { type: Boolean, default: false },
  applicantName: String,
  branch: String,
  rollNo: String,
  studentMobile: String,
  facultyMobile: String,
  facultyEmail: String,
  eventPurpose: String,
  hoardingsCount: String,
  hoardingsLocations: String,
  equipmentsRequired: String,
  operatorsDuringOfficeHours: { type: Boolean, default: false },
  operatorTypes: String,
  operatorsAfterOfficeHours: { type: Boolean, default: false },
  operatorCompensation: String,
  justification: String,
  undertaking: { type: Boolean, default: false }
});

bookingSchema.pre('save', async function(next) {
  try {
    const User = mongoose.model('User');
    const applicant = await User.findById(this.applicant);

    if (!applicant) {
      return next(new Error('Invalid applicant'));
    }

    // Set priority based on role and event type
    if (applicant.role === 'CPO' || applicant.role === 'Registrar') {
      this.priority = 2; // Highest priority
    } else if (this.type === 'Official') {
      this.priority = 1; // Medium priority
    } else {
      this.priority = 0; // Lowest priority
    }

    // Validate booking dates
    const currentDate = new Date();
    const eventDate = new Date(this.date);
    const alternateEventDate = this.alternateDate ? new Date(this.alternateDate) : null;

    if (applicant.role === 'Faculty' || applicant.role === 'HOD') {
      const minBookingDate = new Date(currentDate);
      minBookingDate.setDate(minBookingDate.getDate() + 7);

      if (eventDate < minBookingDate) {
        return next(new Error('Bookings by Faculty and HODs must be made 7 or more days before the event date.'));
      }

      if (this.alternateDate && alternateEventDate < minBookingDate) {
        return next(new Error('Alternate date for bookings by Faculty and HODs must be 7 or more days before the event date.'));
      }
    } else {
      if (eventDate <= currentDate) {
        return next(new Error('Booking date must be in the future.'));
      }

      if (this.alternateDate && alternateEventDate <= currentDate) {
        return next(new Error('Alternate booking date must be in the future.'));
      }
    }

    next();
  } catch (error) {
    next(error);
  }
});

const Booking = mongoose.model('Booking', bookingSchema);
module.exports = Booking;