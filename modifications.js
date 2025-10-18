// Phase 4: modifications.js - Data Modification Examples
// This file demonstrates common update operations in the social media platform

// ============================================================================
// 1. A user follows another user
// ============================================================================
// Scenario: User with username "jane_doe" follows user with username "john_smith"

const janeUser = db.users.findOne({ username: "jane_doe" });
const johnUser = db.users.findOne({ username: "john_smith" });

db.users.updateOne(
  { _id: janeUser._id },
  { $addToSet: { following: johnUser._id } }
);

db.users.updateOne(
  { _id: johnUser._id },
  { $addToSet: { followers: janeUser._id } }
);

db.notifications.insertOne({
  recipient_id: johnUser._id,
  sender_id: janeUser._id,
  type: "follow",
  is_read: false,
  timestamp: new Date()
});

print("User follow operation completed successfully");

// ============================================================================
// 2. A user posts a reply to a comment
// ============================================================================
// Scenario: User replies to an existing comment on a post

// Get a sample post and parent comment
const samplePost = db.posts.findOne();
const parentComment = db.comments.findOne({ post_id: samplePost._id, parent_comment_id: null });
const replyingUser = db.users.findOne({ username: "jane_doe" });

const replyResult = db.comments.insertOne({
  post_id: samplePost._id,
  author_id: replyingUser._id,
  parent_comment_id: parentComment._id,
  text: "Great point! I totally agree with you.",
  timestamp: new Date()
});

db.notifications.insertOne({
  recipient_id: parentComment.author_id,
  sender_id: replyingUser._id,
  type: "comment",
  post_id: samplePost._id,
  is_read: false,
  timestamp: new Date()
});

print("Comment reply operation completed successfully");

// ============================================================================
// 3. A user joins a group
// ============================================================================
// Scenario: User joins a group

// Get a sample user and group
const joiningUser = db.users.findOne({ username: "jane_doe" });
const targetGroup = db.groups.findOne({ group_name: "MongoDB Enthusiasts" });

db.users.updateOne(
  { _id: joiningUser._id },
  { $addToSet: { groups: targetGroup._id } }
);

db.groups.updateOne(
  { _id: targetGroup._id },
  { $addToSet: { members: joiningUser._id } }
);

print("User join group operation completed successfully");