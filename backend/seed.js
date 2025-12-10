import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Court from './models/Court.js';
import Coach from './models/Coach.js';
import Equipment from './models/Equipment.js';
import PricingRule from './models/PricingRule.js';

dotenv.config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected');

    // Clear existing data
    await User.deleteMany({});
    await Court.deleteMany({});
    await Coach.deleteMany({});
    await Equipment.deleteMany({});
    await PricingRule.deleteMany({});

    console.log('Cleared existing data');

    // Create Admin User
    const adminUser = await User.create({
      name: 'Admin',
      email: process.env.ADMIN_EMAIL || 'admin@sportsbooking.com',
      password: process.env.ADMIN_PASSWORD || 'Admin@123',
      role: 'admin',
      phone: '1234567890',
    });

    console.log('✅ Admin user created');

    // Create Sample Courts
    const courts = await Court.insertMany([
      // Basketball Courts
      {
        name: 'Indoor Basketball Court A',
        type: 'indoor',
        sport: 'Basketball',
        basePrice: 1500,
        description: 'Premium indoor basketball court with AC and modern facilities',
        capacity: 10,
        amenities: ['AC', 'LED Lighting', 'Scoreboard', 'Changing Rooms', 'Water Dispenser'],
        images: ['https://images.unsplash.com/photo-1546519638-68e109498ffc'],
        isActive: true,
      },
      {
        name: 'Indoor Basketball Court B',
        type: 'indoor',
        sport: 'Basketball',
        basePrice: 1600,
        description: 'Professional indoor court with wooden flooring and premium facilities',
        capacity: 10,
        amenities: ['AC', 'Wooden Floor', 'Professional Lighting', 'Locker Rooms', 'Shower'],
        images: ['https://images.unsplash.com/photo-1546519638-68e109498ffc'],
        isActive: true,
      },
      {
        name: 'Outdoor Basketball Court C',
        type: 'outdoor',
        sport: 'Basketball',
        basePrice: 900,
        description: 'Open-air basketball court with synthetic surface',
        capacity: 10,
        amenities: ['LED Lighting', 'Seating Area', 'Water Fountain'],
        images: ['https://images.unsplash.com/photo-1546519638-68e109498ffc'],
        isActive: true,
      },
      {
        name: 'Outdoor Basketball Court D',
        type: 'outdoor',
        sport: 'Basketball',
        basePrice: 850,
        description: 'Community basketball court with floodlights',
        capacity: 10,
        amenities: ['Floodlights', 'Benches'],
        images: ['https://images.unsplash.com/photo-1546519638-68e109498ffc'],
        isActive: true,
      },
      {
        name: 'Indoor Basketball Court E',
        type: 'indoor',
        sport: 'Basketball',
        basePrice: 1800,
        description: 'Elite indoor basketball arena with spectator seating',
        capacity: 12,
        amenities: ['AC', 'Premium Flooring', 'Spectator Seats', 'Audio System', 'Cafe'],
        images: ['https://images.unsplash.com/photo-1546519638-68e109498ffc'],
        isActive: true,
      },

      // Tennis Courts
      {
        name: 'Outdoor Tennis Court A',
        type: 'outdoor',
        sport: 'Tennis',
        basePrice: 800,
        description: 'Professional outdoor tennis court with synthetic surface',
        capacity: 4,
        amenities: ['Net', 'Seating Area', 'LED Lighting'],
        images: ['https://images.unsplash.com/photo-1554068865-24cecd4e34b8'],
        isActive: true,
      },
      {
        name: 'Indoor Tennis Court B',
        type: 'indoor',
        sport: 'Tennis',
        basePrice: 1200,
        description: 'Climate-controlled tennis court with premium surface',
        capacity: 4,
        amenities: ['AC', 'Professional Net', 'LED Lighting', 'Changing Rooms'],
        images: ['https://images.unsplash.com/photo-1554068865-24cecd4e34b8'],
        isActive: true,
      },
      {
        name: 'Outdoor Tennis Court C',
        type: 'outdoor',
        sport: 'Tennis',
        basePrice: 750,
        description: 'Standard outdoor tennis court with clay surface',
        capacity: 4,
        amenities: ['Net', 'Benches', 'Water Fountain'],
        images: ['https://images.unsplash.com/photo-1554068865-24cecd4e34b8'],
        isActive: true,
      },
      {
        name: 'Indoor Tennis Court D',
        type: 'indoor',
        sport: 'Tennis',
        basePrice: 1300,
        description: 'Premium indoor tennis court with hard surface',
        capacity: 4,
        amenities: ['AC', 'Hard Court Surface', 'Locker Rooms', 'Shower'],
        images: ['https://images.unsplash.com/photo-1554068865-24cecd4e34b8'],
        isActive: true,
      },
      {
        name: 'Outdoor Tennis Court E',
        type: 'outdoor',
        sport: 'Tennis',
        basePrice: 900,
        description: 'Tournament-grade outdoor tennis court',
        capacity: 4,
        amenities: ['Championship Net', 'Line Judges Chairs', 'Floodlights', 'Seating'],
        images: ['https://images.unsplash.com/photo-1554068865-24cecd4e34b8'],
        isActive: true,
      },

      // Badminton Courts
      {
        name: 'Indoor Badminton Court A',
        type: 'indoor',
        sport: 'Badminton',
        basePrice: 1000,
        description: 'Air-conditioned badminton court with wooden flooring',
        capacity: 4,
        amenities: ['AC', 'Wooden Floor', 'LED Lighting', 'Equipment Storage'],
        images: ['https://images.unsplash.com/photo-1626224583764-f87db24ac4ea'],
        isActive: true,
      },
      {
        name: 'Indoor Badminton Court B',
        type: 'indoor',
        sport: 'Badminton',
        basePrice: 950,
        description: 'Professional badminton court with premium flooring',
        capacity: 4,
        amenities: ['AC', 'Synthetic Floor', 'Professional Nets', 'Changing Rooms'],
        images: ['https://images.unsplash.com/photo-1626224583764-f87db24ac4ea'],
        isActive: true,
      },
      {
        name: 'Indoor Badminton Court C',
        type: 'indoor',
        sport: 'Badminton',
        basePrice: 1100,
        description: 'Elite badminton court with spectator area',
        capacity: 4,
        amenities: ['AC', 'Premium Flooring', 'Gallery Seating', 'Locker Rooms'],
        images: ['https://images.unsplash.com/photo-1626224583764-f87db24ac4ea'],
        isActive: true,
      },
      {
        name: 'Indoor Badminton Court D',
        type: 'indoor',
        sport: 'Badminton',
        basePrice: 900,
        description: 'Standard indoor badminton court',
        capacity: 4,
        amenities: ['AC', 'Standard Flooring', 'LED Lighting'],
        images: ['https://images.unsplash.com/photo-1626224583764-f87db24ac4ea'],
        isActive: true,
      },
      {
        name: 'Indoor Badminton Court E',
        type: 'indoor',
        sport: 'Badminton',
        basePrice: 1050,
        description: 'Multi-court badminton hall - Court 1',
        capacity: 4,
        amenities: ['AC', 'Wooden Floor', 'Multiple Courts', 'Cafe', 'Pro Shop'],
        images: ['https://images.unsplash.com/photo-1626224583764-f87db24ac4ea'],
        isActive: true,
      },

      // Football Grounds
      {
        name: 'Outdoor Football Ground A',
        type: 'outdoor',
        sport: 'Football',
        basePrice: 2000,
        description: 'Full-size outdoor football ground with artificial turf',
        capacity: 22,
        amenities: ['Artificial Turf', 'Goal Posts', 'Floodlights', 'Dugouts'],
        images: ['https://images.unsplash.com/photo-1575361204480-aadea25e6e68'],
        isActive: true,
      },
      {
        name: 'Outdoor Football Ground B',
        type: 'outdoor',
        sport: 'Football',
        basePrice: 1800,
        description: 'Natural grass football field with professional markings',
        capacity: 22,
        amenities: ['Natural Grass', 'Goal Posts', 'Floodlights', 'Changing Rooms'],
        images: ['https://images.unsplash.com/photo-1575361204480-aadea25e6e68'],
        isActive: true,
      },
      {
        name: 'Indoor Football Arena C',
        type: 'indoor',
        sport: 'Football',
        basePrice: 2500,
        description: 'Climate-controlled indoor futsal court',
        capacity: 10,
        amenities: ['AC', 'Indoor Turf', 'LED Lighting', 'Locker Rooms', 'Spectator Seating'],
        images: ['https://images.unsplash.com/photo-1575361204480-aadea25e6e68'],
        isActive: true,
      },
      {
        name: 'Outdoor Football Ground D',
        type: 'outdoor',
        sport: 'Football',
        basePrice: 1500,
        description: '5-a-side football ground with synthetic surface',
        capacity: 10,
        amenities: ['Synthetic Turf', 'Small Goals', 'Floodlights', 'Benches'],
        images: ['https://images.unsplash.com/photo-1575361204480-aadea25e6e68'],
        isActive: true,
      },
      {
        name: 'Outdoor Football Ground E',
        type: 'outdoor',
        sport: 'Football',
        basePrice: 2200,
        description: 'Tournament-grade football stadium with seating',
        capacity: 22,
        amenities: ['Premium Turf', 'Professional Goals', 'Stadium Lights', 'Seating', 'Scoreboard'],
        images: ['https://images.unsplash.com/photo-1575361204480-aadea25e6e68'],
        isActive: true,
      },
    ]);

    console.log('✅ Sample courts created');

    // Create Sample Coaches
    const coaches = await Coach.insertMany([
      {
        name: 'Rajesh Kumar',
        email: 'rajesh.kumar@sportsbooking.com',
        phone: '9876543210',
        specialization: 'Basketball',
        experience: 10,
        bio: '10 years of professional basketball coaching experience',
        pricePerHour: 500,
        availability: [],
        isActive: true,
      },
      {
        name: 'Priya Sharma',
        email: 'priya.sharma@sportsbooking.com',
        phone: '9876543211',
        specialization: 'Tennis',
        experience: 8,
        bio: 'Former state-level tennis player and certified coach',
        pricePerHour: 400,
        availability: [],
        isActive: true,
      },
      {
        name: 'Amit Patel',
        email: 'amit.patel@sportsbooking.com',
        phone: '9876543212',
        specialization: 'Badminton',
        experience: 8,
        bio: 'National level badminton coach with 8 years experience',
        pricePerHour: 450,
        availability: [],
        isActive: true,
      },
    ]);

    console.log('✅ Sample coaches created');

    // Create Sample Equipment
    const equipment = await Equipment.insertMany([
      {
        name: 'Basketball',
        category: 'Ball',
        description: 'Professional basketball - Size 7',
        totalStock: 20,
        availableStock: 20,
        pricePerHour: 50,
        isActive: true,
      },
      {
        name: 'Tennis Racket',
        category: 'Racket',
        description: 'Premium tennis racket with cover',
        totalStock: 15,
        availableStock: 15,
        pricePerHour: 100,
        isActive: true,
      },
      {
        name: 'Badminton Racket',
        category: 'Racket',
        description: 'Lightweight badminton racket',
        totalStock: 25,
        availableStock: 25,
        pricePerHour: 80,
        isActive: true,
      },
      {
        name: 'Football',
        category: 'Ball',
        description: 'Standard size 5 football',
        totalStock: 30,
        availableStock: 30,
        pricePerHour: 50,
        isActive: true,
      },
    ]);

    console.log('✅ Sample equipment created');

    // Create Pricing Rules
    const pricingRules = await PricingRule.insertMany([
      {
        name: 'Weekend Surcharge',
        type: 'weekend',
        multiplier: 1.5,
        conditions: {
          days: ['Sunday', 'Saturday'],
        },
        isActive: true,
      },
      {
        name: 'Peak Hours Premium',
        type: 'peak_hour',
        multiplier: 1.3,
        conditions: {
          startHour: 17, // 5 PM
          endHour: 21,   // 9 PM
        },
        isActive: true,
      },
      {
        name: 'Indoor Court Premium',
        type: 'indoor_premium',
        multiplier: 1.2,
        conditions: {},
        isActive: true,
      },
    ]);

    console.log('✅ Pricing rules created');

    console.log('\n========================================');
    console.log('✅ Database seeded successfully!');
    console.log('========================================');
    console.log('\nAdmin Credentials:');
    console.log(`Email: ${process.env.ADMIN_EMAIL || 'admin@sportsbooking.com'}`);
    console.log(`Password: ${process.env.ADMIN_PASSWORD || 'Admin@123'}`);
    console.log('========================================\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedData();
