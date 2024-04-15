import RelationName from '@/const/relations/RelationName';

export default [
  {
    id: 1,
    name: 'First scenario',
    description: 'Description of first scenario',
    relations: [
      {
        model_id: 1,
        relation: RelationName.RELATION_HAS_ACTIVITY,
      },
    ],
  },
  {
    id: 2,
    name: 'Second scenario',
    description: 'Description of second scenario',
    relations: [],
  },
];