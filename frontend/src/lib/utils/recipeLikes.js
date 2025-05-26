const handleLike = ({ likes, dislikes, userId, recipeId, socket }) => {
  const currentLikes = new Set(likes);
  const currentDislikes = new Set(dislikes);

  if (currentLikes.has(userId)) {
    currentLikes.delete(userId);
  } else {
    currentLikes.add(userId);
    currentDislikes.delete(userId);
  }

  socket.emit("toggle-like", { recipeId, userId });

  return { likes: Array.from(currentLikes), dislikes: Array.from(currentDislikes) };
};



const handleDislike = ({ likes, dislikes, userId, recipeId, socket }) => {
  const currentLikes = new Set(likes);
  const currentDislikes = new Set(dislikes);

  if (currentDislikes.has(userId)) {
    currentDislikes.delete(userId);
  } else {
    currentDislikes.add(userId);
    currentLikes.delete(userId);
  }

  socket.emit("toggle-dislike", { recipeId, userId });

  return { likes: Array.from(currentLikes), dislikes: Array.from(currentDislikes) };
};

export { handleLike, handleDislike };
