import mongoose from 'mongoose';
import { recipeCategories } from '../../util/constants.js';

const recipeSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true,
    minLength: 3,
    maxLength: 100,
  },
  description: { 
    type: String, 
    required: true,
    minLength: 10,
    maxLength: 5000,
  },
  ingredients: { 
    type: [String], 
    required: true,
  },
  instructions: { 
    type: [String], 
    required: true,
  },
  category: { 
    type: String, 
    enum: recipeCategories, 
    required: true,
  },
  calories: {
    type: Number, 
    required: false,
    min: 0,
  },
  likes: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  dislikes: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  // foreign key to list
  // this is an array of recipe ids
  // many to many
  recipeLists: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'RecipeList', 
    required: false,
  }],
}, { timestamps: true, collection: 'recipes' });

export default mongoose.model('Recipe', recipeSchema);