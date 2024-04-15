import RelationConfig from '@/const/relations/RelationConfig';
import ModelConfig from '@/const/relations/ModelConfig';
import Storage from '@/storage/Storage';

export default class Builder {
  constructor(data) {
    this.data = [...data];
    this.filters = [];
    this._variable_model = undefined;
    this._variable_fetchRelated = false;
  }

  model(model) {
    this._variable_model = model;

    return this;
  }

  whereFunction(func) {
    this.filters.push(e => func(e));

    return this;
  }

  whereId(id) {
    this.whereFunction(e => e.id === id);

    return this;
  }

  store(object) {
    this.data.push(object);
    const { db } = ModelConfig[this._variable_model];
    (new Storage()).storeByPath(db, this.data);
  }

  storeMany(items) {
    const { db } = ModelConfig[this._variable_model];
    (new Storage()).storeByPath(db, items);
  }

  all() {
    this._function__query();

    return this.data;
  }

  get() {
    this._function__query();

    return this.data[0] ?? undefined;
  }

  last() {
    return this.data[this.data.length - 1] ?? undefined;
  }

  _function__query() {
    this.applyFilters();
    !this._variable_fetchRelated || this._function__fetchRelated();
  }

  applyFilters() {
    this.filters.forEach(filterFunction => {
      this.data = this.data.filter(e => filterFunction(e));
    });
  }

  fetchRelated() {
    this._variable_fetchRelated = true;

    return this;
  }

  _function__fetchRelated() {
    const data = [];

    this.data.reduce((previousValue, currentValue) => {
      if (currentValue?.relations) {
        currentValue.relations.forEach(({ model_id, relation }) => {
          const modelConfig = ModelConfig[this._variable_model];
          const db = RelationConfig?.[relation]?.db;
          const many = modelConfig?.relations[relation]?.many;
          const relatedModel = RelationConfig?.[relation]?.model;

          currentValue[db] = currentValue[db] || (many ? [] : undefined);

          const related = (new Storage())
            .getByPath(db)
            .model(relatedModel)
            .whereId(model_id)
            .fetchRelated()
            .get();

          if (many) {
            currentValue[db].push({ ...related });
          } else {
            currentValue[db] = { ...related };
          }
        });
      }

      previousValue.push(currentValue);

      return previousValue;
    }, data);

    this.data = [...data];
  }
}
