import {Model} from 'redux-orm';

export class User extends Model {
  static modelName = 'User';
  static options() {
    return {
      idAttribute: '_id',
    };
  }
}

export class Thread extends Model {
  static modelName = 'Thread';
  static options() {
    return {
      idAttribute: '_id',
    };
  }
}
