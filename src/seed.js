require('dotenv').config();
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const connectDB = require('./config/database');
const { User, Course, Chapter, Enrollment, ChapterCompletion } = require('./models');

const coursesData = [
  {
    title: 'Full-Stack Web Development Bootcamp',
    description: 'Master modern web development from scratch. Learn HTML, CSS, JavaScript, React, Node.js, Express, and PostgreSQL. Build real-world projects and deploy them to the cloud.',
    instructor: 'Aishwarya Achari',
    duration: '48 hours', level: 'Beginner', category: 'Web Development', price: 0, totalLessons: 8,
    thumbnail: 'https://images.unsplash.com/photo-1593720213428-28a5b9e94613?w=800&q=80',
    chapters: [
      { title: 'Introduction to Web Development', description: 'Overview of how the web works, browsers, and the developer setup.', duration: '45 min', order: 1 },
      { title: 'HTML Fundamentals', description: 'Semantic HTML5 structure, forms, tables, and accessibility.', duration: '60 min', order: 2 },
      { title: 'CSS & Flexbox / Grid', description: 'Styling pages, responsive layouts, and modern CSS techniques.', duration: '75 min', order: 3 },
      { title: 'JavaScript Essentials', description: 'Variables, functions, DOM manipulation, and events.', duration: '90 min', order: 4 },
      { title: 'React Basics', description: 'Components, props, state, and hooks in React.', duration: '90 min', order: 5 },
      { title: 'Node.js & Express', description: 'Building REST APIs with Express and middleware.', duration: '80 min', order: 6 },
      { title: 'Databases & PostgreSQL', description: 'Relational databases, SQL queries, and ORM basics.', duration: '70 min', order: 7 },
      { title: 'Deployment & CI/CD', description: 'Deploy apps to the cloud using Render, Vercel, and GitHub Actions.', duration: '50 min', order: 8 },
    ],
  },
  {
    title: 'Python for Data Science & Machine Learning',
    description: 'Learn Python programming and apply it to data science and machine learning. Covers NumPy, Pandas, Matplotlib, Scikit-learn, and TensorFlow with hands-on projects.',
    instructor: 'Aishwarya Achari',
    duration: '36 hours', level: 'Intermediate', category: 'Data Science', price: 0, totalLessons: 7,
    thumbnail: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&q=80',
    chapters: [
      { title: 'Python Refresher & Setup', description: 'Data types, loops, functions, and Jupyter Notebook setup.', duration: '50 min', order: 1 },
      { title: 'NumPy for Numerical Computing', description: 'Arrays, vectorised operations, and broadcasting.', duration: '60 min', order: 2 },
      { title: 'Data Wrangling with Pandas', description: 'DataFrames, merging, groupby, and cleaning messy data.', duration: '75 min', order: 3 },
      { title: 'Data Visualisation with Matplotlib & Seaborn', description: 'Charts, heatmaps, and storytelling with data.', duration: '55 min', order: 4 },
      { title: 'Machine Learning with Scikit-learn', description: 'Regression, classification, cross-validation, and pipelines.', duration: '90 min', order: 5 },
      { title: 'Deep Learning with TensorFlow', description: 'Neural networks, activation functions, and model training.', duration: '90 min', order: 6 },
      { title: 'Capstone Project', description: 'End-to-end ML project from EDA to deployment.', duration: '60 min', order: 7 },
    ],
  },
  {
    title: 'UI/UX Design Fundamentals',
    description: 'Learn the principles of user interface and user experience design. Covers wireframing, prototyping, Figma, design systems, and usability testing with real client projects.',
    instructor: 'Aishwarya Achari',
    duration: '20 hours', level: 'Beginner', category: 'Design', price: 0, totalLessons: 6,
    thumbnail: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&q=80',
    chapters: [
      { title: 'Design Thinking & UX Process', description: 'Empathy mapping, user research, and design thinking framework.', duration: '50 min', order: 1 },
      { title: 'Wireframing & Information Architecture', description: 'Low-fidelity wireframes, sitemaps, and user flows.', duration: '60 min', order: 2 },
      { title: 'Figma Essentials', description: 'Frames, components, auto-layout, and prototyping in Figma.', duration: '80 min', order: 3 },
      { title: 'Visual Design Principles', description: 'Typography, colour theory, spacing, and contrast.', duration: '65 min', order: 4 },
      { title: 'Building a Design System', description: 'Tokens, component libraries, and style guides.', duration: '55 min', order: 5 },
      { title: 'Usability Testing & Handoff', description: 'User testing methods, feedback analysis, and developer handoff.', duration: '50 min', order: 6 },
    ],
  },
  {
    title: 'Advanced JavaScript & TypeScript',
    description: 'Deep dive into modern JavaScript — closures, async/await, Promises, event loop, and TypeScript. Learn design patterns and write production-quality code.',
    instructor: 'Aishwarya Achari',
    duration: '24 hours', level: 'Advanced', category: 'Web Development', price: 0, totalLessons: 6,
    thumbnail: 'https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?w=800&q=80',
    chapters: [
      { title: 'JavaScript Engine & Event Loop', description: 'Call stack, task queue, microtasks, and how JS runs.', duration: '60 min', order: 1 },
      { title: 'Closures, Scope & Prototypes', description: 'Lexical scope, closures in practice, and prototype chain.', duration: '65 min', order: 2 },
      { title: 'Async JS: Callbacks, Promises & Async/Await', description: 'Error handling, chaining, and async patterns.', duration: '75 min', order: 3 },
      { title: 'TypeScript Fundamentals', description: 'Types, interfaces, generics, and tsconfig.', duration: '70 min', order: 4 },
      { title: 'Design Patterns in JS/TS', description: 'Module, observer, factory, and dependency injection patterns.', duration: '70 min', order: 5 },
      { title: 'Testing & Code Quality', description: 'Jest unit testing, ESLint, Prettier, and CI integration.', duration: '60 min', order: 6 },
    ],
  },
  {
    title: 'Cloud Computing with AWS',
    description: 'Get hands-on with Amazon Web Services. Learn EC2, S3, Lambda, RDS, API Gateway, and IAM. Build and deploy scalable cloud applications and prepare for AWS certifications.',
    instructor: 'Aishwarya Achari',
    duration: '30 hours', level: 'Intermediate', category: 'Cloud & DevOps', price: 0, totalLessons: 6,
    thumbnail: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=800&q=80',
    chapters: [
      { title: 'AWS Core Concepts & IAM', description: 'Regions, AZs, IAM users/roles, and security best practices.', duration: '55 min', order: 1 },
      { title: 'Compute: EC2 & Lambda', description: 'Launching instances, auto-scaling, and serverless functions.', duration: '75 min', order: 2 },
      { title: 'Storage: S3 & EBS', description: 'Buckets, lifecycle policies, versioning, and block storage.', duration: '60 min', order: 3 },
      { title: 'Networking: VPC & API Gateway', description: 'Virtual private clouds, subnets, and REST APIs on AWS.', duration: '70 min', order: 4 },
      { title: 'Databases: RDS & DynamoDB', description: 'Managed relational and NoSQL databases on AWS.', duration: '65 min', order: 5 },
      { title: 'Monitoring & Cost Optimisation', description: 'CloudWatch, billing alarms, and cost management tools.', duration: '50 min', order: 6 },
    ],
  },
  {
    title: 'Cybersecurity Essentials',
    description: 'Learn the fundamentals of cybersecurity, ethical hacking, and network security. Covers threat modeling, cryptography, penetration testing, and security best practices.',
    instructor: 'Aishwarya Achari',
    duration: '28 hours', level: 'Intermediate', category: 'Cybersecurity', price: 0, totalLessons: 6,
    thumbnail: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&q=80',
    chapters: [
      { title: 'Security Fundamentals & Threat Landscape', description: 'CIA triad, threat actors, attack vectors, and CVEs.', duration: '55 min', order: 1 },
      { title: 'Network Security', description: 'Firewalls, VPNs, packet analysis, and port scanning.', duration: '70 min', order: 2 },
      { title: 'Cryptography & PKI', description: 'Symmetric/asymmetric encryption, hashing, and certificates.', duration: '65 min', order: 3 },
      { title: 'Web Application Security (OWASP Top 10)', description: 'SQL injection, XSS, CSRF, and secure coding.', duration: '75 min', order: 4 },
      { title: 'Ethical Hacking & Penetration Testing', description: 'Reconnaissance, exploitation, and reporting.', duration: '80 min', order: 5 },
      { title: 'Incident Response & Security Policies', description: 'SIEM, playbooks, and compliance frameworks.', duration: '55 min', order: 6 },
    ],
  },
  {
    title: 'React & Next.js Masterclass',
    description: 'Build production-ready React applications using hooks, context, Redux Toolkit, and Next.js. Covers SSR, SSG, API routes, authentication, and deployment on Vercel.',
    instructor: 'Aishwarya Achari',
    duration: '32 hours', level: 'Intermediate', category: 'Web Development', price: 0, totalLessons: 7,
    thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&q=80',
    chapters: [
      { title: 'React Hooks Deep Dive', description: 'useState, useEffect, useRef, useMemo, and useCallback.', duration: '70 min', order: 1 },
      { title: 'State Management with Context & Redux Toolkit', description: 'Global state, slices, thunks, and middleware.', duration: '75 min', order: 2 },
      { title: 'React Router & Navigation', description: 'Dynamic routes, protected routes, and navigation guards.', duration: '55 min', order: 3 },
      { title: 'Next.js Fundamentals', description: 'File-based routing, SSR, SSG, and ISR.', duration: '80 min', order: 4 },
      { title: 'API Routes & Server Actions', description: 'Building backend endpoints inside Next.js.', duration: '65 min', order: 5 },
      { title: 'Authentication with NextAuth', description: 'Credential, OAuth, and JWT session strategies.', duration: '70 min', order: 6 },
      { title: 'Performance & Deployment on Vercel', description: 'Image optimisation, code splitting, and CI/CD.', duration: '55 min', order: 7 },
    ],
  },
  {
    title: 'Database Design & SQL Mastery',
    description: 'Master relational databases from ground up. Learn SQL, database normalisation, indexing, query optimisation, PostgreSQL, and database design patterns for scalable systems.',
    instructor: 'Aishwarya Achari',
    duration: '18 hours', level: 'Beginner', category: 'Database', price: 0, totalLessons: 6,
    thumbnail: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&q=80',
    chapters: [
      { title: 'Relational Model & ER Diagrams', description: 'Tables, keys, relationships, and ER design.', duration: '55 min', order: 1 },
      { title: 'SQL Basics: SELECT, INSERT, UPDATE, DELETE', description: 'CRUD operations and filtering with WHERE.', duration: '65 min', order: 2 },
      { title: 'JOINs & Subqueries', description: 'INNER, LEFT, RIGHT, FULL joins and nested queries.', duration: '70 min', order: 3 },
      { title: 'Normalisation & Indexing', description: '1NF to 3NF normalisation and B-tree indexes.', duration: '60 min', order: 4 },
      { title: 'Advanced SQL & Window Functions', description: 'CTEs, window functions, and query optimisation.', duration: '65 min', order: 5 },
      { title: 'PostgreSQL in Production', description: 'Migrations, transactions, roles, and performance tuning.', duration: '60 min', order: 6 },
    ],
  },
  {
    title: 'Mobile App Development with React Native',
    description: 'Build cross-platform mobile apps for iOS and Android using React Native and Expo. Learn navigation, state management, device APIs, and publish your app to app stores.',
    instructor: 'Aishwarya Achari',
    duration: '26 hours', level: 'Intermediate', category: 'Mobile Development', price: 0, totalLessons: 6,
    thumbnail: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&q=80',
    chapters: [
      { title: 'React Native & Expo Setup', description: 'Project structure, Expo Go, and running on device.', duration: '50 min', order: 1 },
      { title: 'Core Components & Styling', description: 'View, Text, Image, StyleSheet, and Flexbox on mobile.', duration: '65 min', order: 2 },
      { title: 'Navigation with React Navigation', description: 'Stack, tab, and drawer navigators.', duration: '70 min', order: 3 },
      { title: 'State Management & API Calls', description: 'Context, Redux Toolkit, and Axios in React Native.', duration: '65 min', order: 4 },
      { title: 'Device APIs: Camera, Location & Notifications', description: 'Expo modules for hardware access.', duration: '70 min', order: 5 },
      { title: 'Publishing to App Stores', description: 'EAS Build, TestFlight, and Google Play submission.', duration: '60 min', order: 6 },
    ],
  },
  {
    title: 'DevOps & CI/CD Pipeline',
    description: 'Learn DevOps practices including Docker, Kubernetes, GitHub Actions, Jenkins, and Terraform. Build automated pipelines to test, build, and deploy applications reliably.',
    instructor: 'Aishwarya Achari',
    duration: '22 hours', level: 'Advanced', category: 'Cloud & DevOps', price: 0, totalLessons: 6,
    thumbnail: 'https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=800&q=80',
    chapters: [
      { title: 'DevOps Culture & Principles', description: 'Agile, SDLC, shift-left testing, and SRE basics.', duration: '45 min', order: 1 },
      { title: 'Docker & Containerisation', description: 'Dockerfiles, images, containers, and Docker Compose.', duration: '80 min', order: 2 },
      { title: 'Kubernetes Fundamentals', description: 'Pods, services, deployments, and kubectl.', duration: '85 min', order: 3 },
      { title: 'CI/CD with GitHub Actions', description: 'Workflows, triggers, secrets, and matrix builds.', duration: '70 min', order: 4 },
      { title: 'Infrastructure as Code with Terraform', description: 'Providers, resources, state, and modules.', duration: '75 min', order: 5 },
      { title: 'Monitoring & Observability', description: 'Prometheus, Grafana, and distributed tracing.', duration: '60 min', order: 6 },
    ],
  },
];

const seed = async () => {
  try {
    await connectDB();
    console.log('✅ Database connected.');

    // Clear existing data
    await User.deleteMany({});
    await Course.deleteMany({});
    await Chapter.deleteMany({});
    await Enrollment.deleteMany({});
    await ChapterCompletion.deleteMany({});
    console.log('✅ Collections cleared.');

    // Admin
    const adminPassword = await bcrypt.hash('admin123', 12);
    await User.create({ name: 'Admin User', email: 'admin@techacademy.com', password: adminPassword, role: 'admin' });
    console.log('✅ Admin — admin@techacademy.com / admin123');

    // Demo student
    const studentPassword = await bcrypt.hash('student123', 12);
    await User.create({ name: 'Demo Student', email: 'student@techacademy.com', password: studentPassword, role: 'student' });
    console.log('✅ Student — student@techacademy.com / student123');

    // Courses + Chapters
    for (const data of coursesData) {
      const { chapters, ...courseFields } = data;
      const course = await Course.create(courseFields);
      
      const chaptersWithIds = chapters.map(ch => ({
        ...ch,
        courseId: course._id
      }));
      
      await Chapter.insertMany(chaptersWithIds);
    }
    
    console.log(`✅ ${coursesData.length} courses seeded with chapters.`);
    console.log('\n🎉 Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  }
};

seed();
