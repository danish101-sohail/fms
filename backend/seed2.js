// backend/scripts/seedData.js
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('./models/user');
const Hall = require('./models/hall');

const venues = [
  "BR Ambedkar auditorium", "Pragya Hall", "Room No 307", "Pragya Bhawan",
  "SPS 1", "SPS 2", "SPS 3", "SPS 4", "SPS 5", "SPS 6", "SPS 7", "SPS 8",
  "SPS 9", "SPS 10", "SPS 11", "SPS 12", "Vigyan Hall", "SPS 13", "SPS 14",
  "Civil Convection", "OAT", "Amul Lane", "Civil raised platform", "T&P Ground Floor",
  "Aya Public Ground", "T3 classrooms", "Dept Admin Block", "Concert Ground",
  "Mech C Parking", "Mini OAT", "Raj Soin Hall"
];

const slots = ["Forenoon", "Afternoon"];

const users = [
  { name: 'Faculty1', email: 'faculty1@example.com', password: 'password1', role: 'Faculty', department: 'CS' },
  { name: 'Faculty2', email: 'faculty2@example.com', password: 'password2', role: 'Faculty', department: 'EE' },
  { name: 'HOD1', email: 'hod1@example.com', password: 'password3', role: 'HOD', department: 'CS' },
  { name: 'HOD2', email: 'hod2@example.com', password: 'password4', role: 'HOD', department: 'EE' },
  { name: 'Registrar', email: 'registrar@example.com', password: 'password5', role: 'Registrar' },
  { name: 'CPO', email: 'cpo@example.com', password: 'password6', role: 'CPO' },
  { name: 'Admin', email: 'admin@dtu.ac.in', password: 'admin123', role: 'Admin', isAdmin: true } // Added admin
];

async function seedData() {
  await mongoose.connect('mongodb://localhost:27017/new_new_clone', { useNewUrlParser: true, useUnifiedTopology: true });

  // Clear existing data
  await User.deleteMany({});
  await Hall.deleteMany({});

  // Seed users
  for (const userData of users) {
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const newUser = new User({
      ...userData,
      password: hashedPassword
    });
    await newUser.save();
  }

  // Seed venues
  for (const venue of venues) {
    const newVenue = new Hall({
      name: venue,
      slots: slots.map(slot => ({ slot, status: 'Not Filled' })),
      reservedForOfficial: ["SPS 13", "SPS 14"].includes(venue)
    });
    await newVenue.save();
  }

  mongoose.disconnect();
}

seedData().then(() => {
  console.log('Database seeded successfully');
}).catch(err => {
  console.error('Error seeding database:', err);
});