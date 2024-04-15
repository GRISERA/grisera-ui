import RelationName from '@/const/relations/RelationName';

export default [
  {
    'id': 1,
    'name': 'Eksperyment 1',
    'description': 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla quam velit, vulputate eu pharetra nec, mattis ac neque. Duis vulputate commodo lectus, ac blandit elit. Etiam sit amet orci eget eros faucibus tincidunt.',
    'creator': 'Jan Kowalski',
    'created_at': '2022-01-01',
    relations: [
      {
        model_id: 1,
        relation: RelationName.RELATION_HAS_SCENARIO,
      },
      {
        model_id: 2,
        relation: RelationName.RELATION_HAS_SCENARIO,
      },
    ],
  },
  {
    'id': 2,
    'name': 'Eksperyment 2',
    'description': 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce nec purus aliquet, volutpat eros ac, vehicula justo. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.',
    'creator': 'Adam Nowak',
    'created_at': '2022-01-02',
  },
  {
    'id': 3,
    'name': 'Eksperyment 3',
    'description': 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer euismod, tellus vel molestie commodo, purus dolor ullamcorper elit, vel aliquam nunc enim sit amet urna.',
    'creator': 'Karolina Wojciechowska',
    'created_at': '2022-01-03',
  },
];
