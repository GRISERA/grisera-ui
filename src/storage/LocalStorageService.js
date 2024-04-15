import RelationConfig from '@/const/relations/RelationConfig';
import Storage from '@/storage/Storage';
import ModelConfig from '@/const/relations/ModelConfig';

export default {
  init() {
    (new Storage()).init();
  },
  clear() {
    (new Storage()).clear();
  },
  get(path, id = undefined, modelType = undefined) {
    return new Promise((resolve, reject) => {
      try {
        const builder = (new Storage())
          .getByPath(path)
          .model(modelType)
          .fetchRelated();

        const data = id ? builder.whereId(id).get() : builder.all();

        resolve({ data });
      } catch (e) {
        reject(e);
      }
    });
  },
  post(path, value, modelType = undefined) {
    return new Promise((resolve, reject) => {
      try {
        const lastItem = (new Storage())
          .getByPath(path)
          .last();

        const nextIndex = lastItem?.id + 1 || 1;
        const { db, relations, reverse_relations } = ModelConfig[modelType];

        if (relations) {
          Object.entries(relations).forEach(([relation, { many }]) => {
            const { model: relatedModel, db: relatedDatabase } = RelationConfig[relation];
            let related = value[relatedDatabase];

            if (!related) {
              return;
            }

            related = many ? related : [related];

            value.relations = value.relations || [];

            related.forEach(e => {
              value.relations.push({
                model_id: e.id,
                relation,
              });
            });

            delete value[relatedDatabase];
          });
        }

        if (reverse_relations) {
          Object.entries(reverse_relations).forEach(([model, { relation }]) => {
            const { db: reverseRelatedDatabase } = ModelConfig[model];

            (new Storage())
              .getByPath(reverseRelatedDatabase)
              .whereFunction(e => e.id === value[model])
              .all()
              .map(e => ({
                ...e,
                relations: [...e.relations || [], { model_id: nextIndex, relation }],
              }))
              .forEach(e => {
                this.update(reverseRelatedDatabase, e.id, e, model).then();
              });

            delete value[model];
          });
        }

        (new Storage()).getByPath(path).model(modelType).store({ ...value, ...{ id: nextIndex } });
        resolve();
      } catch (e) {
        reject(e);
      }
    });
  },
  update(path, id, data, modelType = undefined) {
    return new Promise((resolve, reject) => {
      try {
        const items = (new Storage())
          .getByPath(path)
          .model(modelType)
          .all();

        const index = items.findIndex(e => e.id === id);

        if (index === -1) {
          const message = `Item with ID = ${id} does not exist at PATH = ${path}!`;
          reject(new Error(message));
        }

        const { db, relations, reverse_relations } = ModelConfig[modelType];

        if (relations) {
          Object.entries(relations).forEach(([relation, { many }]) => {
            const { model: relatedModel, db: relatedDatabase } = RelationConfig[relation];
            let related = data[relatedDatabase];

            if (!related) {
              return;
            }

            related = many ? related : [related];

            data.relations = data.relations || [];
            data.relations = [
              ...data.relations.filter(e => !(e.relation === relation)),
            ];

            related.forEach(e => {
              data.relations.push({
                model_id: e.id,
                relation,
              });
            });

            delete data[relatedDatabase];
          });
        }

        items[index] = data;
        (new Storage()).builder().model(modelType).storeMany(items);
        resolve();
      } catch (e) {
        reject(e);
      }
    });
  },
  delete(path, id, modelType = undefined) {
    return new Promise((resolve, reject) => {
      try {
        const items = (new Storage())
          .getByPath(path)
          .model(modelType)
          .all();

        const index = items.findIndex(e => e.id === id);

        if (index === -1) {
          const message = `Item with ID = ${id} does not exist at PATH = ${path}!`;
          reject(new Error(message));
        }

        const { db, relations, reverse_relations } = ModelConfig[modelType];

        if (reverse_relations) {
          Object.entries(reverse_relations).forEach(([model, { relation }]) => {
            const { db: reverseRelatedDatabase } = ModelConfig[model];

            (new Storage())
              .getByPath(reverseRelatedDatabase)
              .all()
              .map(e => ({
                ...e,
                relations: [
                  ...(e.relations || []).filter(
                    e => !(e.model_id === id && e.relation === relation),
                  ),
                ],
              }))
              .forEach(e => {
                this.update(reverseRelatedDatabase, e.id, e, model).then();
              });
          });
        }

        items.splice(index, 1);
        (new Storage()).builder().model(modelType).storeMany(items);
        resolve();
      } catch (e) {
        reject(e);
      }
    });
  },
  count(path) {
    return new Promise((resolve, reject) => {
      try {
        resolve((new Storage()).getByPath(path).all().length);
      } catch (e) {
        reject(e);
      }
    });
  },
};