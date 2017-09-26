import {ORM} from 'redux-orm';
import {Property} from '../property/common/model';
import {Thread, User} from '../user/common/model';

const orm = new ORM();
orm.register(Property, User, Thread);

export default orm;
