import ModelType from '@/const/relations/ModelType';
import RelationName from '@/const/relations/RelationName';
import DatabaseName from '@/const/relations/DatabaseName';

export default {
  [ModelType.ACTIVITY]: {
    db: DatabaseName.ACTIVITIES,
  },
  [ModelType.CHANNEL]: {
    db: DatabaseName.CHANNELS,
  },
  [ModelType.EXPERIMENT]: {
    db: DatabaseName.EXPERIMENTS,
    relations: {
      [RelationName.RELATION_HAS_SCENARIO]: {
        many: true,
      },
      [RelationName.RELATION_HAS_PARTICIPANT]: {
        many: true,
      },
      [RelationName.RELATION_HAS_SCENARIO_EXECUTION]: {
        many: true,
      },
    },
  },
  [ModelType.LIFE_ACTIVITY]: {
    db: DatabaseName.LIFE_ACTIVITIES,
  },
  [ModelType.TIME_SERIE]: {
    db: DatabaseName.TIME_SERIES,
  },
  [ModelType.MODALITY]: {
    db: DatabaseName.MODALITIES,
  },
  [ModelType.PARAMETER]: {
    db: DatabaseName.PARAMETERS,
  },
  [ModelType.PARTICIPANT]: {
    db: DatabaseName.PARTICIPANTS,
  },
  [ModelType.SCENARIO]: {
    db: DatabaseName.SCENARIOS,
    relations: {
      [RelationName.RELATION_HAS_ACTIVITY]: {
        many: true,
      },
    },
    reverse_relations: {
      [ModelType.EXPERIMENT]: {
        relation: RelationName.RELATION_HAS_SCENARIO,
      },
    },
  },
  [ModelType.ACTIVITY_EXECUTION]: {
    db: DatabaseName.ACTIVITY_EXECUTIONS,
    relations: {
      [RelationName.RELATION_HAS_RECORDING]: {
        many: true,
      },
    },
  },
  [ModelType.SCENARIO_EXECUTION]: {
    db: DatabaseName.SCENARIO_EXECUTIONS,
    relations: {
      [RelationName.RELATION_HAS_ACTIVITY_EXECUTION]: {
        many: true,
      },
    },
    reverse_relations: {
      [ModelType.EXPERIMENT]: {
        relation: RelationName.RELATION_HAS_SCENARIO_EXECUTION,
      },
    },
  },
  [ModelType.RECORDING]: {
    db: DatabaseName.RECORDINGS,
    reverse_relations: {
      [ModelType.ACTIVITY_EXECUTION]: {
        relation: RelationName.RELATION_HAS_RECORDING,
      },
    },
  },
  [ModelType.MEASURE]: {
    db: DatabaseName.MEASURES,
  },
  [ModelType.PARTICIPANT_STATE]: {
    db: DatabaseName.PARTICIPANT_STATES,
  },
  [ModelType.DATASET]: {
    db: DatabaseName.DATASETS,
  },
};
