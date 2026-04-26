require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const bcrypt = require('bcryptjs');
const { sequelize, Admin, Room, MenuCategory, MenuItem, GalleryImage, Testimonial } = require('../models');

async function seed() {
  try {
    console.log('Connecting to database...');
    await sequelize.authenticate();
    console.log('Connected. Syncing models (force: true)...');
    await sequelize.sync({ force: true });
    console.log('Tables created.\n');

    // 1. Seed Admin
    const passwordHash = await bcrypt.hash('admin123', 10);
    await Admin.create({
      username: 'admin',
      email: 'admin@kaafaltree.com',
      password_hash: passwordHash,
      role: 'superadmin',
    });
    console.log('Admin created (email: admin@kaafaltree.com, password: admin123)');

    // 2. Seed Rooms (mirrors RoomsPage.jsx)
    const rooms = await Room.bulkCreate([
      {
        name: 'Deluxe Room',
        description: 'Spacious room with a comfortable double bed, mountain-themed wall art, attached bathroom with hot water geyser, and ceiling fan. Perfect for couples and solo travelers.',
        price_per_night: 1500.00,
        total_units: 3,
        capacity: '2 Guests',
        amenities: JSON.stringify(['Double Bed', 'Attached Bathroom', 'Hot Water (Geyser)', 'Ceiling Fan', 'Mountain View Photo', 'Clean Linens']),
        image_url: '/images/room-deluxe.jpg',
        is_available: true,
      },
      {
        name: 'Mountain View Room',
        description: 'Wake up to breathtaking Himalayan views through your window and private balcony. Features traditional bedding, seating area, and a door opening directly to mountain panoramas.',
        price_per_night: 2000.00,
        total_units: 2,
        capacity: '2 Guests',
        amenities: JSON.stringify(['Mountain View Balcony', 'Double Bed', 'Seating Area', 'Attached Bathroom', 'Hot Water (Geyser)', 'Natural Ventilation']),
        image_url: '/images/room-mountain-view.jpg',
        is_available: true,
      },
      {
        name: 'Standard Room',
        description: 'Comfortable and clean room with a double bed, attached bathroom with wash basin and mirror, and all essential amenities. Great value for pilgrims and budget travelers.',
        price_per_night: 1000.00,
        total_units: 4,
        capacity: '2 Guests',
        amenities: JSON.stringify(['Double Bed', 'Attached Bathroom', 'Hot Water (Geyser)', 'Wash Basin & Mirror', 'Seating Chair', 'Clean Linens']),
        image_url: '/images/room-standard-1.jpg',
        is_available: true,
      },
      {
        name: 'Family Room',
        description: 'Larger room ideal for families, with a spacious double bed, extra bedding options, side table, and attached bathroom. Comfortable stay for the entire family.',
        price_per_night: 2500.00,
        total_units: 2,
        capacity: '3-4 Guests',
        amenities: JSON.stringify(['Large Double Bed', 'Extra Bedding', 'Attached Bathroom', 'Hot Water (Geyser)', 'Side Table', 'Clean Linens']),
        image_url: '/images/room-standard-2.jpg',
        is_available: true,
      },
    ]);
    console.log(`${rooms.length} rooms seeded`);

    // 3. Seed Menu Categories & Items (mirrors RestaurantPage.jsx)
    const menuData = [
      {
        name: 'Garhwali Specials',
        display_order: 1,
        items: [
          { name: 'Kafuli', description: 'Traditional spinach & fenugreek curry cooked in iron kadhai', price: 150 },
          { name: 'Chainsoo', description: 'Slow-roasted black gram dal, a Garhwali staple', price: 120 },
          { name: 'Phaanu', description: 'Mixed lentil preparation, slow-cooked overnight', price: 130 },
          { name: 'Aloo Ke Gutke', description: 'Spiced potato preparation with local herbs', price: 100 },
        ],
      },
      {
        name: 'Main Course',
        display_order: 2,
        items: [
          { name: 'Dal Tadka', description: 'Yellow lentil tempered with ghee & cumin', price: 100 },
          { name: 'Rajma Chawal', description: 'Kidney bean curry with steamed rice', price: 120 },
          { name: 'Mix Veg Curry', description: 'Seasonal vegetables in aromatic gravy', price: 130 },
          { name: 'Paneer Butter Masala', description: 'Cottage cheese in rich tomato-cream gravy', price: 180 },
        ],
      },
      {
        name: 'Breads & Rice',
        display_order: 3,
        items: [
          { name: 'Mandua Ki Roti', description: 'Finger millet flatbread - local superfood', price: 30 },
          { name: 'Jhangora Kheer', description: 'Barnyard millet sweet pudding', price: 80 },
          { name: 'Fresh Chapati', description: 'Handmade whole wheat flatbread', price: 15 },
          { name: 'Steamed Rice', description: 'Fluffy Basmati rice', price: 60 },
        ],
      },
      {
        name: 'Beverages & Snacks',
        display_order: 4,
        items: [
          { name: 'Chai (Masala Tea)', description: 'Hot spiced tea with mountain herbs', price: 20 },
          { name: 'Maggi Noodles', description: 'The mountain classic - hot & spicy', price: 50 },
          { name: 'Pakoras', description: 'Crispy vegetable fritters, perfect for rainy days', price: 60 },
          { name: 'Buransh Juice', description: 'Refreshing rhododendron flower drink', price: 40 },
        ],
      },
    ];

    let totalItems = 0;
    for (const cat of menuData) {
      const category = await MenuCategory.create({
        name: cat.name,
        display_order: cat.display_order,
      });
      for (const item of cat.items) {
        await MenuItem.create({
          category_id: category.id,
          name: item.name,
          description: item.description,
          price: item.price,
          is_vegetarian: true,
          is_available: true,
        });
        totalItems++;
      }
    }
    console.log(`${menuData.length} menu categories and ${totalItems} items seeded`);

    // 4. Seed Gallery Images (mirrors GalleryPage.jsx)
    const galleryData = [
      { image_url: '/images/mountain-view.jpg', alt_text: 'Snow-capped mountain view', category: 'Surroundings', display_order: 1 },
      { image_url: '/images/aerial-view.jpg', alt_text: 'Aerial view of the property', category: 'Property', display_order: 2 },
      { image_url: '/images/outdoor-dining.jpg', alt_text: 'Outdoor dining with fairy lights', category: 'Restaurant', display_order: 3 },
      { image_url: '/images/cottage-veranda.jpg', alt_text: 'Cottage veranda', category: 'Property', display_order: 4 },
      { image_url: '/images/room-deluxe.jpg', alt_text: 'Deluxe room', category: 'Rooms', display_order: 5 },
      { image_url: '/images/room-mountain-view.jpg', alt_text: 'Mountain view room', category: 'Rooms', display_order: 6 },
      { image_url: '/images/property-entrance.jpg', alt_text: 'Property entrance and parking', category: 'Property', display_order: 7 },
      { image_url: '/images/restaurant-interior.jpg', alt_text: 'Indoor restaurant', category: 'Restaurant', display_order: 8 },
      { image_url: '/images/cottage-exterior-1.jpg', alt_text: 'Cottage exterior with mountains', category: 'Property', display_order: 9 },
      { image_url: '/images/room-standard-1.jpg', alt_text: 'Standard room', category: 'Rooms', display_order: 10 },
      { image_url: '/images/outdoor-pergola-1.jpg', alt_text: 'Outdoor seating with umbrellas', category: 'Restaurant', display_order: 11 },
      { image_url: '/images/cottage-front.jpg', alt_text: 'Cottage front view', category: 'Property', display_order: 12 },
      { image_url: '/images/room-standard-2.jpg', alt_text: 'Family room', category: 'Rooms', display_order: 13 },
      { image_url: '/images/cottage-veranda-2.jpg', alt_text: 'Cottage veranda corridor', category: 'Property', display_order: 14 },
      { image_url: '/images/signboard.jpg', alt_text: 'Kaafal Tree signboard', category: 'Property', display_order: 15 },
      { image_url: '/images/room-overview.jpg', alt_text: 'Room overview with attached bath', category: 'Rooms', display_order: 16 },
      { image_url: '/images/cottage-side.jpg', alt_text: 'Cottage side view', category: 'Property', display_order: 17 },
      { image_url: '/images/outdoor-pergola-2.jpg', alt_text: 'Pergola area', category: 'Restaurant', display_order: 18 },
      { image_url: '/images/room-bed.jpg', alt_text: 'Room with bed', category: 'Rooms', display_order: 19 },
      { image_url: '/images/bathroom-1.jpg', alt_text: 'Bathroom with hot water', category: 'Rooms', display_order: 20 },
    ];

    await GalleryImage.bulkCreate(galleryData);
    console.log(`${galleryData.length} gallery images seeded`);

    // 5. Seed Testimonials (mirrors HomePage.jsx)
    const testimonials = await Testimonial.bulkCreate([
      {
        guest_name: 'Rajesh Kumar',
        review_text: 'The perfect stop before our Kedarnath yatra. Rooms were clean, food was amazing, and the mountain view from the cottage was unforgettable.',
        rating: 5,
        is_approved: true,
      },
      {
        guest_name: 'Priya Sharma',
        review_text: 'We loved the outdoor dining area with fairy lights! The homemade food reminded us of our grandmother\'s kitchen. Will definitely visit again.',
        rating: 5,
        is_approved: true,
      },
      {
        guest_name: 'Amit Verma',
        review_text: 'Hidden gem on the Kedarnath route. The forest surroundings and fresh mountain air made our stay truly refreshing. Highly recommended!',
        rating: 5,
        is_approved: true,
      },
    ]);
    console.log(`${testimonials.length} testimonials seeded`);

    console.log('\nSeed completed successfully!');
    console.log('Admin login: admin@kaafaltree.com / admin123');
    process.exit(0);
  } catch (error) {
    console.error('Seed failed:', error);
    process.exit(1);
  }
}

seed();
