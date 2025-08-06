import mongoose from 'mongoose';
import ApartmentOwner from './models/ApartmentOwner';
import Payment from './models/Payment';

// This is just a test file to verify the models work
async function testModels() {
  try {
    // Connect to test database
    await mongoose.connect('mongodb://localhost:27017/condominium-test');
    
    // Test creating an apartment owner
    const owner = new ApartmentOwner({
      name: 'Test Owner',
      email: 'test@example.com',
      apartmentNumber: 'A101',
      phoneNumber: '+1234567890'
    });
    
    const savedOwner = await owner.save();
    console.log('✅ Apartment owner created:', savedOwner.name);
    
    // Test creating a payment
    const payment = new Payment({
      apartmentOwnerId: savedOwner._id,
      amount: 500.00,
      month: '2024-01',
      description: 'Monthly maintenance fee',
      status: 'pending'
    });
    
    const savedPayment = await payment.save();
    console.log('✅ Payment created:', savedPayment.amount);
    
    // Clean up
    await ApartmentOwner.findByIdAndDelete(savedOwner._id);
    await Payment.findByIdAndDelete(savedPayment._id);
    await mongoose.disconnect();
    
    console.log('✅ All tests passed!');
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Uncomment to run test
// testModels(); 