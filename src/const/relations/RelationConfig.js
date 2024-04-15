import RelationName from '@/const/relations/RelationName';
import ModelType from '@/const/relations/ModelType';
import DatabaseName from '@/const/relations/DatabaseName';

export default {
  [RelationName.RELATION_HAS_SCENARIO]: {
    model: ModelType.SCENARIO,
    db: DatabaseName.SCENARIOS,
  },
  [RelationName.RELATION_HAS_EXPERIMENT]: {
    model: ModelType.EXPERIMENT,
    db: DatabaseName.EXPERIMENTS,
  },
  [RelationName.RELATION_HAS_ACTIVITY]: {
    model: ModelType.ACTIVITY,
    db: DatabaseName.ACTIVITIES,
  },
  [RelationName.RELATION_HAS_PARTICIPANT]: {
    model: ModelType.PARTICIPANT,
    db: DatabaseName.PARTICIPANTS,
  },
  [RelationName.RELATION_HAS_SCENARIO_EXECUTION]: {
    model: ModelType.SCENARIO_EXECUTION,
    db: DatabaseName.SCENARIO_EXECUTIONS,
  },
  [RelationName.RELATION_HAS_ACTIVITY_EXECUTION]: {
    model: ModelType.ACTIVITY_EXECUTION,
    db: DatabaseName.ACTIVITY_EXECUTIONS,
  },
  [RelationName.RELATION_HAS_RECORDING]: {
    model: ModelType.RECORDING,
    db: DatabaseName.RECORDINGS,
  },
  [RelationName.RELATION_HAS_CHANNEL]: {
    model: ModelType.CHANNEL,
    db: DatabaseName.CHANNELS,
  },
  [RelationName.RELATION_HAS_LIFE_ACTIVITY]: {
    model: ModelType.LIFE_ACTIVITY,
    db: DatabaseName.LIFE_ACTIVITIES,
  },
  [RelationName.RELATION_HAS_MEASURE]: {
    model: ModelType.MEASURE,
    db: DatabaseName.MEASURES,
  },
  [RelationName.RELATION_HAS_MODALITY]: {
    model: ModelType.MODALITY,
    db: DatabaseName.MODALITIES,
  },
  [RelationName.RELATION_HAS_DATASET]: {
    model: ModelType.DATASET,
    db: DatabaseName.DATASETS,
  },
  [RelationName.RELATION_HAS_PARAMETER]: {
    model: ModelType.PARAMETER,
    db: DatabaseName.PARAMETERS,
  },
};
