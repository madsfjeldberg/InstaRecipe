

const handleLike = ({ event, likes, dislikes, userId, recipeId, socket }) => {
  // prevent outer button from firing, if it exists
  event?.stopPropagation?.();

  if (likes.includes(userId)) {
    // remove like from local state
    likes = likes.filter((like) => like !== userId);
    // emit event to server to remove like
    socket.emit("remove-like", { recipeId, userId });

  } else if (dislikes.includes(userId)) {
    // if user has disliked the recipe, remove dislike from local state
    // and add like to local state
    dislikes = dislikes.filter((dislike) => dislike !== userId);
    likes.push(userId);
    // emit event to server to remove dislike and add like
    socket.emit("remove-dislike", { recipeId, userId });
    socket.emit("add-like", { recipeId, userId });

  } else {
    // just add like to local state, and emit
    likes.push(userId);
    socket.emit("add-like", { recipeId, userId });
  }

  return { likes, dislikes };
}

const handleDislike = ({ event, likes, dislikes, userId, recipeId, socket }) => {
  // prevent outer button from firing, if it exists
  event?.stopPropagation?.();

  if (dislikes.includes(userId)) {

    // remove dislike from local state
    dislikes = dislikes.filter((dislike) => dislike !== userId);
    // emit event to server to remove dislike
    socket.emit("remove-dislike", { recipeId, userId });

  } else if (likes.includes(userId)) {

    // if user has liked the recipe, remove like from local state
    likes = likes.filter((like) => like !== userId);
    // add dislike to local state
    dislikes.push(userId);
    // emit event to server to remove like and add dislike
    socket.emit("remove-like", { recipeId, userId });
    socket.emit("add-dislike", { recipeId, userId });

  } else {
    // just add dislike to local state, and emit
    dislikes.push(userId);
    socket.emit("add-dislike", { recipeId, userId });
  }

  return { likes, dislikes };
}

export { handleLike, handleDislike };