import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seeding...');

  // Create test user
  const hashedPassword = await bcrypt.hash('password123', 10);
  const user = await prisma.user.upsert({
    where: { email: 'test@example.com' },
    update: {},
    create: {
      name: 'Test User',
      email: 'test@example.com',
      password: hashedPassword,
    },
  });

  console.log('Created test user:', user.email);

  // Clear existing colleges for a fresh slate
  await prisma.savedCollege.deleteMany({});
  await prisma.review.deleteMany({});
  await prisma.course.deleteMany({});
  await prisma.college.deleteMany({});

  const realColleges = [
    { name: 'Indian Institute of Technology (IIT) Bombay', location: 'Mumbai', fees: 250000, rating: 4.9, pkg: 1800000 },
    { name: 'Indian Institute of Technology (IIT) Delhi', location: 'Delhi', fees: 225000, rating: 4.8, pkg: 1750000 },
    { name: 'Indian Institute of Technology (IIT) Madras', location: 'Chennai', fees: 200000, rating: 4.8, pkg: 1600000 },
    { name: 'Birla Institute of Technology and Science (BITS)', location: 'Pilani', fees: 550000, rating: 4.7, pkg: 1500000 },
    { name: 'National Institute of Technology (NIT) Trichy', location: 'Trichy', fees: 150000, rating: 4.6, pkg: 1200000 },
    { name: 'Vellore Institute of Technology (VIT)', location: 'Vellore', fees: 300000, rating: 4.2, pkg: 850000 },
    { name: 'Delhi Technological University (DTU)', location: 'Delhi', fees: 166000, rating: 4.4, pkg: 1100000 },
    { name: 'Jadavpur University', location: 'Kolkata', fees: 25000, rating: 4.5, pkg: 1000000 },
    { name: 'SRM Institute of Science and Technology', location: 'Chennai', fees: 350000, rating: 4.0, pkg: 700000 },
    { name: 'Manipal Institute of Technology', location: 'Manipal', fees: 400000, rating: 4.1, pkg: 800000 },
    { name: 'College of Engineering, Pune (COEP)', location: 'Pune', fees: 120000, rating: 4.4, pkg: 900000 },
    { name: 'RV College of Engineering', location: 'Bangalore', fees: 250000, rating: 4.3, pkg: 950000 },
    { name: 'Indian Institute of Management (IIM) Ahmedabad', location: 'Ahmedabad', fees: 1200000, rating: 4.9, pkg: 2600000 },
    { name: 'Indian Institute of Management (IIM) Bangalore', location: 'Bangalore', fees: 1150000, rating: 4.9, pkg: 2500000 },
    { name: 'Indian Institute of Management (IIM) Calcutta', location: 'Kolkata', fees: 1100000, rating: 4.8, pkg: 2400000 },
    { name: 'XLRI Xavier School of Management', location: 'Jamshedpur', fees: 1150000, rating: 4.8, pkg: 2200000 },
    { name: 'SPJIMR', location: 'Mumbai', fees: 1000000, rating: 4.7, pkg: 2000000 },
    { name: 'Symbiosis Institute of Business Management (SIBM)', location: 'Pune', fees: 900000, rating: 4.5, pkg: 1500000 },
    { name: 'National Institute of Technology (NIT) Surathkal', location: 'Mangalore', fees: 155000, rating: 4.6, pkg: 1150000 },
    { name: 'Indian Institute of Technology (IIT) Kanpur', location: 'Kanpur', fees: 210000, rating: 4.8, pkg: 1650000 },
    { name: 'Indian Institute of Technology (IIT) Kharagpur', location: 'Kharagpur', fees: 205000, rating: 4.7, pkg: 1550000 },
    { name: 'Thapar Institute of Engineering and Technology', location: 'Patiala', fees: 450000, rating: 4.2, pkg: 800000 },
    { name: 'Netaji Subhas University of Technology (NSUT)', location: 'Delhi', fees: 160000, rating: 4.3, pkg: 1050000 },
    { name: 'IIIT Hyderabad', location: 'Hyderabad', fees: 300000, rating: 4.8, pkg: 2100000 },
    { name: 'IIIT Allahabad', location: 'Allahabad', fees: 180000, rating: 4.5, pkg: 1400000 },
  ];

  const images = [
    'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1562774053-701939374585?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1606761568499-6d2451b08c66?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
  ];
  
  const coursesList = [
    { name: 'B.Tech Computer Science', duration: '4 Years' },
    { name: 'B.Tech Information Technology', duration: '4 Years' },
    { name: 'B.Tech Electronics', duration: '4 Years' },
    { name: 'B.Tech Mechanical', duration: '4 Years' },
    { name: 'MBA Finance', duration: '2 Years' },
    { name: 'MBA Marketing', duration: '2 Years' },
    { name: 'BCA', duration: '3 Years' },
    { name: 'MCA', duration: '2 Years' },
  ];

  async function getWikiImage(title: string): Promise<string | null> {
    const url = `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(title)}&prop=pageimages&format=json&pithumbsize=800`;
    try {
      const res = await fetch(url);
      const data = await res.json();
      const pages = data.query.pages;
      const pageId = Object.keys(pages)[0];
      if (pageId !== '-1' && pages[pageId].thumbnail) {
        return pages[pageId].thumbnail.source;
      }
    } catch(e) {
      console.log('Error fetching image for', title);
    }
    return null;
  }

  for (let i = 0; i < realColleges.length; i++) {
    const data = realColleges[i];
    
    // Clean up name for Wikipedia search (remove bracketed acronyms)
    const cleanName = data.name.replace(/\s*\(.*?\)\s*/g, ' ').trim();
    let image = await getWikiImage(cleanName);
    
    // If Wikipedia fails, use a generic fallback image
    if (!image) {
      image = images[Math.floor(Math.random() * images.length)];
    }

    const highestPackage = data.pkg + Math.floor(Math.random() * 2000000) + 500000;
    
    const college = await prisma.college.create({
      data: {
        name: data.name,
        location: data.location,
        fees: data.fees,
        rating: data.rating,
        averagePackage: data.pkg,
        highestPackage: highestPackage,
        image,
        description: `This is a premier institution located in ${data.location}. It offers state-of-the-art facilities and excellent placement opportunities. The college is known for its strong alumni network and industry connections.`,
        contactEmail: `admissions@${data.name.replace(/[^a-zA-Z0-9]/g, '').toLowerCase()}.edu.in`,
        
        courses: {
          create: [
            ...Array.from({ length: 3 + Math.floor(Math.random() * 4) }).map(() => {
              const course = coursesList[Math.floor(Math.random() * coursesList.length)];
              return {
                courseName: course.name,
                duration: course.duration,
                fees: data.fees + Math.floor(Math.random() * 50000)
              };
            })
          ]
        },
        reviews: {
          create: [
            {
              userId: user.id,
              rating: Math.floor(data.rating),
              comment: 'Great infrastructure and faculties. Placement is also good.'
            },
            {
              userId: user.id,
              rating: Math.min(5, Math.floor(data.rating) + 1),
              comment: 'Loved my time here. The campus life is amazing.'
            }
          ]
        }
      }
    });

    console.log(`Created college ${i + 1}: ${college.name}`);
  }

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
