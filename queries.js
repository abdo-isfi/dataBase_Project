// Phase 3: queries.js
// Queries and Aggregations

// Use the existing db connection
const db = db.getSiblingDB("socialMediaDB");

// 1. Find the complete profile of a user, and using $lookup, retrieve full documents of users they are following
print("=== Query 1: User profile with following details ===");
const user1 = db.users.findOne({ username: "alice_wonder" });
if (user1) {
  db.users
    .aggregate([
      {
        $match: { username: "alice_wonder" },
      },
      {
        $lookup: {
          from: "users",
          localField: "following",
          foreignField: "_id",
          as: "following_details",
        },
      },
      {
        $project: {
          username: 1,
          email: 1,
          join_date: 1,
          profile: 1,
          follower_count: { $size: "$followers" },
          following_count: { $size: "$following" },
          groups: 1,
          "following_details.username": 1,
          "following_details.email": 1,
          "following_details.profile": 1,
        },
      },
    ])
    .forEach(printjson);
} else {
  print("User 'alice_wonder' not found");
}

// 2. List all posts made within a specific group
print("\n=== Query 2: All posts in MongoDB Enthusiasts group ===");
const mongoGroup = db.groups.findOne({
  group_name: "MongoDB Enthusiasts",
});
if (mongoGroup) {
  db.posts
    .find({
      group_id: mongoGroup._id,
    })
    .sort({ timestamp: -1 })
    .forEach(printjson);
} else {
  print("Group 'MongoDB Enthusiasts' not found");
}

// 3. For a specific post, retrieve all its parent comments. Then for a specific parent comment, retrieve all replies
print("\n=== Query 3a: Parent comments for a post ===");
const samplePost = db.posts.findOne({ content: /aggregation pipelines/ });
if (samplePost) {
  const parentComments = db.comments
    .find({
      post_id: samplePost._id,
      parent_comment_id: null,
    })
    .toArray();
  printjson(parentComments);

  print("\n=== Query 3b: Replies to a specific parent comment ===");
  if (parentComments.length > 0) {
    const firstParent = parentComments[0];
    db.comments
      .find({
        parent_comment_id: firstParent._id,
      })
      .forEach(printjson);
  } else {
    print("No parent comments found for this post");
  }
} else {
  print("Post about 'aggregation pipelines' not found");
}

// 4. Find all posts from the last 24 hours that contain the tag '#mongodb'
print("\n=== Query 4: Posts with #mongodb tag from last 24 hours ===");
const twentyFourHoursAgo = new Date(new Date().getTime() - 24 * 60 * 60 * 1000);
db.posts
  .find({
    timestamp: { $gte: twentyFourHoursAgo },
    tags: "mongodb",
  })
  .sort({ timestamp: -1 })
  .forEach(printjson);

// 5. Generate an Advanced User Feed: posts from followed users AND group posts, sorted by timestamp, limit 20
print("\n=== Query 5: Advanced User Feed for alice_wonder ===");
const user5 = db.users.findOne({ username: "alice_wonder" });
if (user5) {
  db.posts
    .aggregate([
      {
        $match: {
          $or: [
            { author_id: { $in: user5.following } },
            { group_id: { $in: user5.groups } },
          ],
        },
      },
      {
        $sort: { timestamp: -1 },
      },
      {
        $limit: 20,
      },
      {
        $lookup: {
          from: "users",
          localField: "author_id",
          foreignField: "_id",
          as: "author",
        },
      },
      {
        $unwind: "$author",
      },
      {
        $project: {
          content: 1,
          post_type: 1,
          timestamp: 1,
          likes_count: { $size: "$likes" },
          tags: 1,
          "author.username": 1,
        },
      },
    ])
    .forEach(printjson);
} else {
  print("User 'alice_wonder' not found");
}

// 6. Identify users who are members of a group but have never posted in it
print("\n=== Query 6: Group members who never posted ===");
const targetGroup = db.groups.findOne({ group_name: "DevOps Community" });
if (targetGroup) {
  const postersInGroup = db.posts.distinct("author_id", {
    group_id: targetGroup._id,
  });
  db.users
    .find(
      {
        groups: targetGroup._id,
        _id: { $nin: postersInGroup },
      },
      {
        username: 1,
        email: 1,
      }
    )
    .forEach(printjson);
} else {
  print("Group 'DevOps Community' not found");
}

// 7. Find posts that have more than 10 likes but zero comments
print("\n=== Query 7: Posts with 10+ likes but no comments ===");
const postsWithComments = db.comments.distinct("post_id");
db.posts
  .find({
    $expr: { $gt: [{ $size: "$likes" }, 10] },
    _id: { $nin: postsWithComments },
  })
  .limit(10)
  .forEach(printjson);

// 8. Count the number of members in each group
print("\n=== Query 8: Member count per group ===");
db.groups
  .aggregate([
    {
      $project: {
        group_name: 1,
        description: 1,
        member_count: { $size: "$members" },
      },
    },
    {
      $sort: { member_count: -1 },
    },
  ])
  .forEach(printjson);

// 9. Generate a list of unread notifications for a user
print("\n=== Query 9: Unread notifications for bob_builder ===");
const bobUser = db.users.findOne({ username: "bob_builder" });
if (bobUser) {
  db.notifications
    .aggregate([
      {
        $match: {
          recipient_id: bobUser._id,
          is_read: false,
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "sender_id",
          foreignField: "_id",
          as: "sender",
        },
      },
      {
        $unwind: "$sender",
      },
      {
        $sort: { timestamp: -1 },
      },
      {
        $project: {
          type: 1,
          timestamp: 1,
          "sender.username": 1,
          post_id: 1,
        },
      },
    ])
    .forEach(printjson);
} else {
  print("User 'bob_builder' not found");
}

// 10. List the top 10 most influential users (most followers)
print("\n=== Query 10: Top 10 most influential users ===");
db.users
  .aggregate([
    {
      $project: {
        username: 1,
        email: 1,
        follower_count: { $size: "$followers" },
        following_count: { $size: "$following" },
      },
    },
    {
      $sort: { follower_count: -1 },
    },
    {
      $limit: 10,
    },
  ])
  .forEach(printjson);

// 11. Calculate the average number of likes per post for each user
print("\n=== Query 11: Average likes per post for each user ===");
db.posts
  .aggregate([
    {
      $group: {
        _id: "$author_id",
        total_posts: { $sum: 1 },
        total_likes: { $sum: { $size: "$likes" } },
        avg_likes: { $avg: { $size: "$likes" } },
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "_id",
        foreignField: "_id",
        as: "user",
      },
    },
    {
      $unwind: "$user",
    },
    {
      $project: {
        username: "$user.username",
        total_posts: 1,
        total_likes: 1,
        avg_likes: { $round: ["$avg_likes", 2] },
      },
    },
    {
      $sort: { avg_likes: -1 },
    },
    {
      $limit: 20,
    },
  ])
  .forEach(printjson);

// 12. Find the 'trending' tags of the day by counting tag occurrences in posts from the last 24 hours
print("\n=== Query 12: Trending tags from last 24 hours ===");
const oneDayAgo = new Date(new Date().getTime() - 24 * 60 * 60 * 1000);
db.posts
  .aggregate([
    {
      $match: {
        timestamp: { $gte: oneDayAgo },
      },
    },
    {
      $unwind: "$tags",
    },
    {
      $group: {
        _id: "$tags",
        count: { $sum: 1 },
      },
    },
    {
      $sort: { count: -1 },
    },
    {
      $limit: 10,
    },
    {
      $project: {
        tag: "$_id",
        occurrences: "$count",
        _id: 0,
      },
    },
  ])
  .forEach(printjson);

// 13. Find the most active user in a specific group (most posts + comments)
print("\n=== Query 13: Most active user in JavaScript Developers group ===");
const jsGroup = db.groups.findOne({
  group_name: "JavaScript Developers",
});

if (jsGroup) {
  // Get post counts
  const postCounts = db.posts
    .aggregate([
      { $match: { group_id: jsGroup._id } },
      { $group: { _id: "$author_id", post_count: { $sum: 1 } } },
    ])
    .toArray();

  // Get post IDs in the group
  const groupPostIds = db.posts
    .find({ group_id: jsGroup._id })
    .toArray()
    .map((p) => p._id);

  // Get comment counts for those posts
  const commentCounts = db.comments
    .aggregate([
      { $match: { post_id: { $in: groupPostIds } } },
      { $group: { _id: "$author_id", comment_count: { $sum: 1 } } },
    ])
    .toArray();

  // Combine activity
  const activityMap = {};
  postCounts.forEach((pc) => {
    activityMap[pc._id.toString()] = { posts: pc.post_count, comments: 0 };
  });
  commentCounts.forEach((cc) => {
    const id = cc._id.toString();
    if (activityMap[id]) {
      activityMap[id].comments = cc.comment_count;
    } else {
      activityMap[id] = { posts: 0, comments: cc.comment_count };
    }
  });

  const activities = Object.keys(activityMap)
    .map((id) => ({
      user_id: ObjectId(id),
      posts: activityMap[id].posts,
      comments: activityMap[id].comments,
      total: activityMap[id].posts + activityMap[id].comments,
    }))
    .sort((a, b) => b.total - a.total);

  if (activities.length > 0) {
    const mostActive = activities[0];
    const activeUser = db.users.findOne({ _id: mostActive.user_id });
    if (activeUser) {
      print("Most active user: " + activeUser.username);
      print("Posts: " + mostActive.posts);
      print("Comments: " + mostActive.comments);
      print("Total activity: " + mostActive.total);
    } else {
      print("Most active user ID not found in users collection!");
    }
  } else {
    print("No activity found in this group");
  }
} else {
  print("Group 'JavaScript Developers' not found");
}

// 14. Generate a report showing the daily user registration count for the last 30 days
print("\n=== Query 14: Daily user registrations for last 30 days ===");
const thirtyDaysAgo = new Date(new Date().getTime() - 30 * 24 * 60 * 60 * 1000);
db.users
  .aggregate([
    {
      $match: {
        join_date: { $gte: thirtyDaysAgo },
      },
    },
    {
      $group: {
        _id: {
          $dateToString: { format: "%Y-%m-%d", date: "$join_date" },
        },
        registrations: { $sum: 1 },
      },
    },
    {
      $sort: { _id: 1 },
    },
    {
      $project: {
        date: "$_id",
        registrations: 1,
        _id: 0,
      },
    },
  ])
  .forEach(printjson);

// 15. For a user's profile, aggregate total post count, total likes received, and follower count
print("\n=== Query 15: User profile statistics for carol_coding ===");
const carolUser = db.users.findOne({ username: "carol_coding" });
if (carolUser) {
  db.users
    .aggregate([
      {
        $match: { _id: carolUser._id },
      },
      {
        $lookup: {
          from: "posts",
          localField: "_id",
          foreignField: "author_id",
          as: "user_posts",
        },
      },
      {
        $project: {
          username: 1,
          email: 1,
          profile: 1,
          follower_count: { $size: "$followers" },
          following_count: { $size: "$following" },
          total_posts: { $size: "$user_posts" },
          total_likes_received: {
            $sum: {
              $map: {
                input: "$user_posts",
                as: "post",
                in: { $size: "$$post.likes" },
              },
            },
          },
        },
      },
    ])
    .forEach(printjson);
} else {
  print("User 'carol_coding' not found");
}

print("\n=== All queries completed successfully ===");