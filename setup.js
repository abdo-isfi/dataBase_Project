// Phase 1: setup.js
// Initial database setup with base data

// Switch to the database
const db = db.getSiblingDB("socialMediaDB");

// Insert initial users

db.users.insertMany([
  {
    username: "alice_wonder",
    email: "alice@example.com",
    join_date: new Date("2024-01-15"),
    profile: {
      bio: "Adventure seeker and photographer",
      location: "San Francisco, USA",
    },
    followers: [],
    following: [],
    groups: [],
  },

  {
    username: "bob_builder",
    email: "bob@example.com",
    join_date: new Date("2024-02-20"),
    profile: {
      bio: "Full-stack developer and coffee enthusiast",
      location: "Seattle, USA",
    },
    followers: [],
    following: [],
    groups: [],
  },
  {
    username: "carol_coding",
    email: "carol@example.com",
    join_date: new Date("2024-03-10"),
    profile: {
      bio: "MongoDB expert and tech blogger",
      location: "Austin, USA",
    },
    followers: [],
    following: [],
    groups: [],
  },
  {
    username: "david_data",
    email: "david@example.com",
    join_date: new Date("2024-04-05"),
    profile: {
      bio: "Data scientist passionate about NoSQL",
      location: "Boston, USA",
    },
    followers: [],
    following: [],
    groups: [],
  },
  {
    username: "emma_tech",
    email: "emma@example.com",
    join_date: new Date("2024-05-12"),
    profile: {
      bio: "Tech writer and community organizer",
      location: "New York, USA",
    },
    followers: [],
    following: [],
    groups: [],
  },
]);

// Insert initial groups
db.groups.insertMany([
  {
    group_name: "MongoDB Enthusiasts",
    description: "A group for all things MongoDB and NoSQL databases",
    created_by: db.users.findOne({ username: "carol_coding" })._id,
    members: [],
  },
  {
    group_name: "JavaScript Developers",
    description: "Community for JavaScript and Node.js developers",
    created_by: db.users.findOne({ username: "bob_builder" })._id,
    members: [],
  },
  {
    group_name: "Photography Lovers",
    description: "Share your best shots and photography tips",
    created_by: db.users.findOne({ username: "alice_wonder" })._id,
    members: [],
  },
]);

// Insert initial posts
db.posts.insertMany([
  {
    author_id: db.users.findOne({ username: "alice_wonder" })._id,
    content: "Just captured an amazing sunset! #photography #nature",
    post_type: "image",
    image_url: "https://example.com/images/sunset1.jpg",
    group_id: null,
    timestamp: new Date("2024-10-10T18:30:00Z"),
    likes: [],
    tags: ["photography", "nature"],
  },
  {
    author_id: db.users.findOne({ username: "bob_builder" })._id,
    content:
      "Learning MongoDB aggregation pipelines today. So powerful! #mongodb #learning",
    post_type: "text",
    image_url: null,
    group_id: db.groups.findOne({ group_name: "MongoDB Enthusiasts" })._id,
    timestamp: new Date("2024-10-11T10:15:00Z"),
    likes: [],
    tags: ["mongodb", "learning"],
  },
  {
    author_id: db.users.findOne({ username: "carol_coding" })._id,
    content: "New blog post: Understanding document modeling in MongoDB",
    post_type: "text",
    image_url: null,
    group_id: null,
    timestamp: new Date("2024-10-12T14:20:00Z"),
    likes: [],
    tags: ["mongodb", "blogging"],
  },
  {
    author_id: db.users.findOne({ username: "david_data" })._id,
    content: "Data visualization with MongoDB Charts is incredible!",
    post_type: "text",
    image_url: null,
    group_id: null,
    timestamp: new Date("2024-10-13T09:45:00Z"),
    likes: [],
    tags: ["mongodb", "dataviz"],
  },
  {
    author_id: db.users.findOne({ username: "emma_tech" })._id,
    content: "Who's attending the MongoDB conference next month?",
    post_type: "text",
    image_url: null,
    group_id: db.groups.findOne({ group_name: "MongoDB Enthusiasts" })._id,
    timestamp: new Date("2024-10-13T16:00:00Z"),
    likes: [],
    tags: ["mongodb", "conference"],
  },
]);

// Insert initial comments
db.comments.insertMany([
  {
    post_id: db.posts.findOne({ content: /sunset/ })._id,
    author_id: db.users.findOne({ username: "bob_builder" })._id,
    parent_comment_id: null,
    text: "Wow! The colors are stunning!",
    timestamp: new Date("2024-10-10T19:00:00Z"),
  },
  {
    post_id: db.posts.findOne({ content: /sunset/ })._id,
    author_id: db.users.findOne({ username: "carol_coding" })._id,
    parent_comment_id: null,
    text: "Beautiful shot! What camera did you use?",
    timestamp: new Date("2024-10-10T19:15:00Z"),
  },
  {
    post_id: db.posts.findOne({ content: /aggregation pipelines/ })._id,
    author_id: db.users.findOne({ username: "carol_coding" })._id,
    parent_comment_id: null,
    text: "Great to see you diving into aggregations! They're a game changer.",
    timestamp: new Date("2024-10-11T11:00:00Z"),
  },
  {
    post_id: db.posts.findOne({ content: /aggregation pipelines/ })._id,
    author_id: db.users.findOne({ username: "david_data" })._id,
    parent_comment_id: null,
    text: "Check out the $lookup stage next!",
    timestamp: new Date("2024-10-11T11:30:00Z"),
  },
  {
    post_id: db.posts.findOne({ content: /conference/ })._id,
    author_id: db.users.findOne({ username: "alice_wonder" })._id,
    parent_comment_id: null,
    text: "I'll be there! Looking forward to it.",
    timestamp: new Date("2024-10-13T16:30:00Z"),
  },
]);

print("Setup complete! Base data inserted successfully.");
