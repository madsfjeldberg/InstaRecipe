<script>
  import * as Table from '$lib/components/ui/table';
</script>

<Table.Root>
  <Table.Header>
   <Table.Row>
    <Table.Head class="w-[100px]">Name</Table.Head>
    <Table.Head>Description</Table.Head>
    <Table.Head>Category</Table.Head>
    <Table.Head class="text-right">Calories</Table.Head>
   </Table.Row>
  </Table.Header>
  <Table.Body>
   <Table.Row>
    <Table.Cell class="font-medium">Recipe 1</Table.Cell>
    <Table.Cell>Delicious recipe</Table.Cell>
    <Table.Cell>Main Course</Table.Cell>
    <Table.Cell class="text-right">350kcal</Table.Cell>
   </Table.Row>
   <Table.Row>
    <Table.Cell class="font-medium">Recipe 2</Table.Cell>
    <Table.Cell>Yummy dessert</Table.Cell>
    <Table.Cell>Dessert</Table.Cell>
    <Table.Cell class="text-right">280kcal</Table.Cell>
   </Table.Row>
  </Table.Body>
 </Table.Root>