// data.js - Phase 2: Enrich dataset with realistic social interactions
// Use the existing db connection instead of redeclaring it
const db = db.getSiblingDB("socialMediaDB");

// === 1. Insert 45 additional users (user_6 to user_50) ===

const bios = [
  "Tech enthusiast",
  "Web developer",
  "Mobile app developer",
  "DevOps engineer",
  "Cloud architect",
  "UI/UX designer",
  "Backend specialist",
  "Frontend developer",
  "Security analyst",
  "Machine learning engineer",
  "Database admin",
  "Product manager",
  "Startup founder",
  "Tech blogger",
  "Podcast host",
  "Software tester",
  "Agile coach",
  "Tech recruiter",
  "Open source contributor",
  "API developer",
  "System architect",
  "Data analyst",
  "Technical writer",
  "Game developer",
  "IoT engineer",
  "Blockchain developer",
  "AI researcher",
  "Network engineer",
  "Site reliability engineer",
  "Full stack developer",
  "Mobile designer",
  "Solutions architect",
  "Platform engineer",
  "Integration specialist",
  "Embedded systems",
  "Release manager",
  "Performance engineer",
  "QA engineer",
  "Build engineer",
  "Infrastructure engineer",
  "Automation engineer",
  "Software architect",
  "Tech lead",
  "Engineering manager",
  "CTO",
];

const locations = [
  "LA, USA",
  "Chicago, USA",
  "Miami, USA",
  "Denver, USA",
  "Portland, USA",
  "Phoenix, USA",
  "Dallas, USA",
  "Houston, USA",
  "Atlanta, USA",
  "Nashville, USA",
  "Vegas, USA",
  "Detroit, USA",
  "Raleigh, USA",
  "Columbus, USA",
  "Philly, USA",
  "Tampa, USA",
  "Memphis, USA",
  "KC, USA",
  "Baltimore, USA",
  "Milwaukee, USA",
  "Albuquerque, USA",
  "Tucson, USA",
  "Fresno, USA",
  "Sacramento, USA",
  "Mesa, USA",
  "Oakland, USA",
  "Minneapolis, USA",
  "Cleveland, USA",
  "Wichita, USA",
  "New Orleans, USA",
  "Bakersfield, USA",
  "Arlington, USA",
  "Aurora, USA",
  "Anaheim, USA",
  "Santa Ana, USA",
  "St Louis, USA",
  "Pittsburgh, USA",
  "Cincinnati, USA",
  "Henderson, USA",
  "Lincoln, USA",
  "Greensboro, USA",
  "Plano, USA",
  "Newark, USA",
  "Chandler, USA",
  "Orlando, USA",
];

const newUsers = [];
for (let i = 0; i < 45; i++) {
  const num = i + 6;
  newUsers.push({
    username: `user_${num}`,
    email: `user${num}@example.com`,
    join_date: new Date(
      new Date("2024-06-01").getTime() + i * 12 * 60 * 60 * 1000
    ),
    profile: { bio: bios[i], location: locations[i] },
    followers: [],
    following: [],
    groups: [],
  });
}
const insertResult = db.users.insertMany(newUsers);

const newUserIds = {};
for (let i = 0; i < 45; i++) {
  newUserIds[`user_${i + 6}`] = insertResult.insertedIds[i];
}

// === 2. Get original user IDs (from setup.js) ===
const aliceId = db.users.findOne({ username: "alice_wonder" })._id;
const bobId = db.users.findOne({ username: "bob_builder" })._id;
const carolId = db.users.findOne({ username: "carol_coding" })._id;
const davidId = db.users.findOne({ username: "david_data" })._id;
const emmaId = db.users.findOne({ username: "emma_tech" })._id;

// === 3. Insert 7 additional groups ===
db.groups.insertMany([
  {
    group_name: "Python Developers",
    description: "Python programming community",
    created_by: newUserIds["user_10"],
    members: [],
  },
  {
    group_name: "Cloud Computing",
    description: "AWS, Azure, GCP discussions",
    created_by: newUserIds["user_15"],
    members: [],
  },
  {
    group_name: "Data Science Hub",
    description: "Data science and analytics",
    created_by: davidId,
    members: [],
  },
  {
    group_name: "DevOps Community",
    description: "CI/CD, Docker, Kubernetes",
    created_by: newUserIds["user_20"],
    members: [],
  },
  {
    group_name: "Mobile Development",
    description: "iOS and Android development",
    created_by: newUserIds["user_8"],
    members: [],
  },
  {
    group_name: "AI & Machine Learning",
    description: "ML models and AI discussions",
    created_by: newUserIds["user_32"],
    members: [],
  },
  {
    group_name: "Cybersecurity",
    description: "Security best practices",
    created_by: newUserIds["user_14"],
    members: [],
  },
]);

// === 4. Build social graph: followers/following ===
const allUsers = db.users.find().toArray();
const userIds = allUsers.map((u) => u._id);

function getRandomUniqueIds(excludeId, count, pool) {
  const result = new Set();
  while (result.size < count && result.size < pool.length - 1) {
    const idx = Math.floor(Math.random() * pool.length);
    const id = pool[idx];
    if (!id.equals(excludeId)) result.add(id);
  }
  return Array.from(result);
}

// Update core users
db.users.updateOne(
  { username: "alice_wonder" },
  {
    $set: {
      followers: getRandomUniqueIds(userIds[0], 14, userIds),
      following: getRandomUniqueIds(userIds[0], 3, userIds),
    },
  }
);
// ... update other core users similarly

db.users.updateOne(
  { username: "bob_builder" },
  {
    $set: {
      followers: getRandomUniqueIds(userIds[1], 8, userIds),
      following: getRandomUniqueIds(userIds[1], 5, userIds),
    },
  }
);

db.users.updateOne(
  { username: "carol_coding" },
  {
    $set: {
      followers: getRandomUniqueIds(userIds[2], 13, userIds),
      following: getRandomUniqueIds(userIds[2], 3, userIds),
    },
  }
);

db.users.updateOne(
  { username: "david_data" },
  {
    $set: {
      followers: getRandomUniqueIds(userIds[3], 6, userIds),
      following: getRandomUniqueIds(userIds[3], 4, userIds),
    },
  }
);

db.users.updateOne(
  { username: "emma_tech" },
  {
    $set: {
      followers: getRandomUniqueIds(userIds[4], 5, userIds),
      following: getRandomUniqueIds(userIds[4], 4, userIds),
    },
  }
);

// Update remaining users (user_6 to user_50)
for (let i = 5; i < userIds.length; i++) {
  const followers = getRandomUniqueIds(
    userIds[i],
    Math.floor(Math.random() * 8) + 1,
    userIds
  );
  const following = getRandomUniqueIds(
    userIds[i],
    Math.floor(Math.random() * 8) + 1,
    userIds
  );
  db.users.updateOne({ _id: userIds[i] }, { $set: { followers, following } });
}

// === 5. Assign users to groups ===
const allGroups = db.groups.find().toArray();
const groupMap = {};
allGroups.forEach((g) => (groupMap[g.group_name] = g));

function assignGroupMembers(groupName, memberUsernames) {
  const group = groupMap[groupName];
  const memberIds = memberUsernames.map(
    (un) => db.users.findOne({ username: un })._id
  );
  // Update group members
  db.groups.updateOne({ _id: group._id }, { $set: { members: memberIds } });
  // Update user groups
  db.users.updateMany(
    { _id: { $in: memberIds } },
    { $addToSet: { groups: group._id } }
  );
}

// Assign members
assignGroupMembers("MongoDB Enthusiasts", [
  "bob_builder",
  "carol_coding",
  "david_data",
  "user_10",
  "user_12",
  "user_15",
  "user_16",
  "user_20",
  "user_25",
  "user_30",
  "user_35",
  "user_40",
  "user_45",
]);
assignGroupMembers("JavaScript Developers", [
  "alice_wonder",
  "bob_builder",
  "emma_tech",
  "user_6",
  "user_7",
  "user_8",
  "user_11",
  "user_13",
  "user_17",
  "user_19",
  "user_22",
  "user_24",
  "user_27",
  "user_31",
  "user_33",
  "user_36",
  "user_38",
  "user_41",
  "user_44",
  "user_47",
]);
assignGroupMembers("Photography Lovers", [
  "alice_wonder",
  "emma_tech",
  "user_9",
  "user_14",
  "user_18",
  "user_23",
  "user_28",
  "user_34",
]);
assignGroupMembers("Python Developers", [
  "user_9",
  "user_15",
  "user_21",
  "user_26",
  "user_29",
  "user_32",
  "user_37",
  "user_39",
  "user_42",
  "user_46",
  "user_48",
  "user_49",
]);
assignGroupMembers("Cloud Computing", [
  "user_9",
  "user_14",
  "user_19",
  "user_24",
  "user_29",
  "user_34",
  "user_37",
  "user_40",
  "user_43",
  "user_46",
]);
assignGroupMembers("Data Science Hub", [
  "david_data",
  "user_14",
  "user_15",
  "user_20",
  "user_25",
  "user_26",
  "user_30",
  "user_32",
  "user_35",
  "user_38",
  "user_41",
  "user_44",
  "user_47",
  "user_49",
]);
assignGroupMembers("DevOps Community", [
  "user_8",
  "user_11",
  "user_16",
  "user_19",
  "user_21",
  "user_23",
  "user_28",
  "user_31",
  "user_33",
  "user_36",
  "user_39",
  "user_41",
  "user_43",
  "user_45",
  "user_48",
  "user_49",
]);
assignGroupMembers("Mobile Development", [
  "user_7",
  "user_11",
  "user_17",
  "user_22",
  "user_27",
  "user_35",
  "user_40",
  "user_42",
  "user_47",
]);
assignGroupMembers("AI & Machine Learning", [
  "user_14",
  "user_15",
  "user_20",
  "user_26",
  "user_31",
  "user_32",
  "user_37",
  "user_41",
  "user_44",
  "user_46",
  "user_49",
]);
assignGroupMembers("Cybersecurity", [
  "user_13",
  "user_18",
  "user_21",
  "user_24",
  "user_28",
  "user_30",
  "user_33",
  "user_36",
  "user_38",
  "user_42",
  "user_45",
  "user_47",
  "user_48",
]);

// === 6. Insert 195 additional posts ===
const tagOptions = [
  "mongodb",
  "javascript",
  "python",
  "nodejs",
  "react",
  "aws",
  "docker",
  "kubernetes",
  "ai",
  "machinelearning",
  "cloud",
  "devops",
  "cybersecurity",
  "webdev",
  "mobile",
];
const now = new Date();
const posts = [];

// Recent posts (last 24h)
for (let i = 0; i < 30; i++) {
  const authorId = userIds[Math.floor(Math.random() * userIds.length)];
  const tags =
    Math.random() < 0.3
      ? ["mongodb"]
      : [tagOptions[Math.floor(Math.random() * tagOptions.length)]];
  posts.push({
    author_id: authorId,
    content: `Recent post about ${tags[0]} #${tags[0]}`,
    post_type: "text",
    image_url: null,
    group_id:
      Math.random() > 0.5
        ? allGroups[Math.floor(Math.random() * allGroups.length)]._id
        : null,
    timestamp: new Date(now - Math.random() * 24 * 60 * 60 * 1000),
    likes: [],
    tags,
  });
}

// Older posts
for (let i = 0; i < 165; i++) {
  const authorId = userIds[Math.floor(Math.random() * userIds.length)];
  const numTags = Math.floor(Math.random() * 3) + 1;
  const tags = [];
  for (let j = 0; j < numTags; j++) {
    const tag = tagOptions[Math.floor(Math.random() * tagOptions.length)];
    if (!tags.includes(tag)) tags.push(tag);
  }
  const daysAgo = Math.floor(Math.random() * 120) + 1;
  const timestamp = new Date(now - daysAgo * 24 * 60 * 60 * 1000);
  const userDoc = db.users.findOne({ _id: authorId });
  const groupId = userDoc.groups.length > 0 && Math.random() > 0.4
      ? userDoc.groups[Math.floor(Math.random() * userDoc.groups.length)]
      : null;
  posts.push({
    author_id: authorId,
    content: `Post discussing ${tags.join(", ")}. ${tags
      .map((t) => "#" + t)
      .join(" ")}`,
    post_type: "text",
    image_url: null,
    group_id: groupId,
    timestamp: timestamp,
    likes: [],
    tags,
  });
}

db.posts.insertMany(posts);

// === 7. Add likes to posts ===
const allPosts = db.posts.find().toArray();
for (let i = 0; i < 15; i++) {
  const post = allPosts[i];
  const likers = getRandomUniqueIds(
    post.author_id,
    Math.floor(Math.random() * 10) + 11,
    userIds
  );
  db.posts.updateOne({ _id: post._id }, { $set: { likes: likers } });
}
for (let i = 15; i < allPosts.length; i++) {
  const post = allPosts[i];
  const numLikes = Math.floor(Math.random() * 12);
  const likers = getRandomUniqueIds(post.author_id, numLikes, userIds);
  db.posts.updateOne({ _id: post._id }, { $set: { likes: likers } });
}

// === 8. Insert 495 additional comments ===
const comments = [];
const allPostsRefreshed = db.posts.find().toArray();

// Parent comments
for (let i = 0; i < 300; i++) {
  const post =
    allPostsRefreshed[Math.floor(Math.random() * allPostsRefreshed.length)];
  const authorId = userIds[Math.floor(Math.random() * userIds.length)];
  if (authorId.equals(post.author_id)) continue;
  comments.push({
    post_id: post._id,
    author_id: authorId,
    parent_comment_id: null,
    text: `Great post! Comment ${i + 1}`,
    timestamp: new Date(
      post.timestamp.getTime() + Math.random() * 5 * 24 * 60 * 60 * 1000
    ),
  });
}

db.comments.insertMany(comments);

// Get inserted parent comments to create replies
const insertedParentComments = db.comments
  .find({ parent_comment_id: null })
  .toArray();

// Reply comments
for (let i = 0; i < 195; i++) {
  const parent =
    insertedParentComments[
      Math.floor(Math.random() * insertedParentComments.length)
    ];
  const authorId = userIds[Math.floor(Math.random() * userIds.length)];
  comments.push({
    post_id: parent.post_id,
    author_id: authorId,
    parent_comment_id: parent._id,
    text: `Reply to your comment!`,
    timestamp: new Date(
      parent.timestamp.getTime() + Math.random() * 48 * 60 * 60 * 1000
    ),
  });
}

db.comments.insertMany(comments.filter((c) => c.parent_comment_id !== null));

// === 9. Insert notifications ===
const notifications = [];
const finalUsers = db.users.find().toArray();
const finalPosts = db.posts.find().toArray();
const finalComments = db.comments.find().toArray();

// Follow notifications
finalUsers.forEach((user) => {
  user.followers.forEach((followerId) => {
    notifications.push({
      recipient_id: user._id,
      sender_id: followerId,
      type: "follow",
      post_id: null,
      is_read: Math.random() > 0.3,
      timestamp: new Date(),
    });
  });
});

// Like notifications
finalPosts.forEach((post) => {
  post.likes.forEach((likerId) => {
    notifications.push({
      recipient_id: post.author_id,
      sender_id: likerId,
      type: "like",
      post_id: post._id,
      is_read: Math.random() > 0.4,
      timestamp: new Date(),
    });
  });
});

// Comment notifications (only top-level)
finalComments.forEach((comment) => {
  if (!comment.parent_comment_id) {
    const post = finalPosts.find(
      (p) => p._id.toString() === comment.post_id.toString()
    );
    if (post) {
      notifications.push({
        recipient_id: post.author_id,
        sender_id: comment.author_id,
        type: "comment",
        post_id: post._id,
        is_read: Math.random() > 0.5,
        timestamp: comment.timestamp,
      });
    }
  }
});

db.notifications.insertMany(notifications);

print("Data enrichment complete!");
print("Total users: " + db.users.countDocuments());
print("Total groups: " + db.groups.countDocuments());
print("Total posts: " + db.posts.countDocuments());
print("Total comments: " + db.comments.countDocuments());
print("Total notifications: " + db.notifications.countDocuments());
