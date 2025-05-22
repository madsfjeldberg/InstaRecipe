import prisma from '../database/prismaClient.js';

const main = async () => {
  
  const categories = [
    'Breakfast',
    'Lunch',
    'Dinner',
    'Snack',
    'Dessert',
    'Beverage'
  ];

  const tags = [
    'Vegan',
    'Vegetarian',
    'Gluten-Free',
    'Dairy-Free',
    'High-Protein',
    'Italian',
    'Chinese',
    'Mexican',
    'Indian',
    'Japanese',
    'Mediterranean',
    'American',
    'French',
    'Spanish',
    'Thai',
  ];

  for (const name of tags) {
    await prisma.tag.upsert({
      where: { name },
      update: {},
      create: { name }
    });
  };
  console.log('Tags seeded!');

  for (const name of categories) {
    await prisma.category.upsert({
      where: { name },
      update: {},
      create: { name }
    });
  };
  console.log('Categories seeded!');

}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
  