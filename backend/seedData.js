/**
 * Database Seed Script
 * Populates the database with sample content for demonstration
 * 
 * Run: node seedData.js
 */

require('dotenv').config();
const mongoose = require('mongoose');

// Sample content data
const sampleContent = [
  {
    title: "Introduction to Fractions",
    description: "Learn the basics of fractions with visual aids and interactive examples. Perfect for beginners!",
    subject: "math",
    difficulty: "beginner",
    contentType: "lesson",
    format: ["visual", "interactive"],
    duration: 15,
    points: 10,
    tags: ["math", "fractions", "beginner", "visual"],
    accessibility: {
      hasTranscript: true,
      hasSubtitles: true,
      hasAudioDescription: true,
      wcagCompliant: true
    }
  },
  {
    title: "Understanding Photosynthesis",
    description: "Explore how plants make their own food through photosynthesis with animated diagrams.",
    subject: "science",
    difficulty: "intermediate",
    contentType: "video",
    format: ["video", "visual"],
    duration: 20,
    points: 15,
    tags: ["science", "biology", "plants", "photosynthesis"],
    accessibility: {
      hasTranscript: true,
      hasSubtitles: true,
      hasAudioDescription: false,
      wcagCompliant: true
    }
  },
  {
    title: "Basic Programming Concepts",
    description: "Introduction to programming: variables, loops, and functions explained with simple examples.",
    subject: "programming",
    difficulty: "beginner",
    contentType: "interactive",
    format: ["interactive", "text"],
    duration: 30,
    points: 20,
    tags: ["programming", "coding", "computer science"],
    accessibility: {
      hasTranscript: true,
      hasSubtitles: false,
      hasAudioDescription: false,
      wcagCompliant: true
    }
  },
  {
    title: "Reading Comprehension Strategies",
    description: "Learn effective reading strategies with audio support and visual guides.",
    subject: "english",
    difficulty: "beginner",
    contentType: "reading",
    format: ["text", "audio"],
    duration: 25,
    points: 12,
    tags: ["english", "reading", "comprehension"],
    accessibility: {
      hasTranscript: true,
      hasSubtitles: false,
      hasAudioDescription: true,
      wcagCompliant: true
    }
  },
  {
    title: "World War II Overview",
    description: "A comprehensive look at World War II with interactive timelines and maps.",
    subject: "history",
    difficulty: "intermediate",
    contentType: "lesson",
    format: ["visual", "interactive", "text"],
    duration: 35,
    points: 18,
    tags: ["history", "world war", "20th century"],
    accessibility: {
      hasTranscript: true,
      hasSubtitles: true,
      hasAudioDescription: true,
      wcagCompliant: true
    }
  },
  {
    title: "Multiplication Tables Practice",
    description: "Interactive multiplication practice with immediate feedback and hints.",
    subject: "math",
    difficulty: "beginner",
    contentType: "practice",
    format: ["interactive", "game"],
    duration: 15,
    points: 10,
    tags: ["math", "multiplication", "practice", "game"],
    accessibility: {
      hasTranscript: false,
      hasSubtitles: false,
      hasAudioDescription: false,
      wcagCompliant: true
    }
  },
  {
    title: "Geometry Fundamentals",
    description: "Learn shapes, angles, and geometric concepts with visual demonstrations.",
    subject: "math",
    difficulty: "intermediate",
    contentType: "lesson",
    format: ["visual", "interactive"],
    duration: 28,
    points: 16,
    tags: ["math", "geometry", "shapes"],
    accessibility: {
      hasTranscript: true,
      hasSubtitles: true,
      hasAudioDescription: true,
      wcagCompliant: true
    }
  },
  {
    title: "Creative Writing Basics",
    description: "Develop your creative writing skills with guided exercises and examples.",
    subject: "english",
    difficulty: "beginner",
    contentType: "lesson",
    format: ["text", "audio"],
    duration: 22,
    points: 14,
    tags: ["english", "writing", "creative"],
    accessibility: {
      hasTranscript: true,
      hasSubtitles: false,
      hasAudioDescription: true,
      wcagCompliant: true
    }
  },
  {
    title: "Solar System Exploration",
    description: "Journey through our solar system with interactive 3D models and videos.",
    subject: "science",
    difficulty: "beginner",
    contentType: "interactive",
    format: ["interactive", "video", "visual"],
    duration: 25,
    points: 15,
    tags: ["science", "astronomy", "space", "planets"],
    accessibility: {
      hasTranscript: true,
      hasSubtitles: true,
      hasAudioDescription: true,
      wcagCompliant: true
    }
  },
  {
    title: "Python Programming Quiz",
    description: "Test your Python knowledge with this interactive quiz. Includes hints and explanations.",
    subject: "programming",
    difficulty: "intermediate",
    contentType: "quiz",
    format: ["interactive", "text"],
    duration: 20,
    points: 25,
    tags: ["programming", "python", "quiz", "assessment"],
    accessibility: {
      hasTranscript: true,
      hasSubtitles: false,
      hasAudioDescription: false,
      wcagCompliant: true
    }
  }
];

// Content schema (simplified for seeding)
const contentSchema = new mongoose.Schema({
  title: String,
  description: String,
  subject: String,
  difficulty: String,
  contentType: String,
  format: [String],
  duration: Number,
  points: Number,
  tags: [String],
  accessibility: {
    hasTranscript: Boolean,
    hasSubtitles: Boolean,
    hasAudioDescription: Boolean,
    wcagCompliant: Boolean
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  isActive: { type: Boolean, default: true }
});

const Content = mongoose.model('Content', contentSchema);

async function seedDatabase() {
  try {
    // Connect to MongoDB
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/neurolearn', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✓ Connected to MongoDB');

    // Clear existing content
    console.log('\nClearing existing content...');
    await Content.deleteMany({});
    console.log('✓ Existing content cleared');

    // Insert sample content
    console.log('\nInserting sample content...');
    const result = await Content.insertMany(sampleContent);
    console.log(`✓ ${result.length} content items inserted successfully!`);

    // Display inserted content
    console.log('\n📚 Inserted Content:');
    result.forEach((content, index) => {
      console.log(`  ${index + 1}. ${content.title} (${content.subject} - ${content.difficulty})`);
    });

    console.log('\n✅ Database seeded successfully!');
    console.log('You can now start the application and see the content.');
    
  } catch (error) {
    console.error('❌ Error seeding database:', error.message);
  } finally {
    await mongoose.connection.close();
    console.log('\n🔒 Database connection closed');
  }
}

// Run the seed function
seedDatabase();
