import mongoose from "mongoose";

const recipeListSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true,
    unique: false,
    minLength: 3,
    maxLength: 100,
  },
  // foreign key to user
  // one to many
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true,
  },
  // foreign key to recipe
  // this is an array of recipe ids
  // many to many
  // currently not used, might set up in the future
  // recipes: [{ 
  //   type: mongoose.Schema.Types.ObjectId, 
  //   ref: 'Recipe', 
  //   required: true,
  // }],
}, { timestamps: true, collection: 'recipe_lists' });

export default mongoose.model('RecipeList', recipeListSchema);