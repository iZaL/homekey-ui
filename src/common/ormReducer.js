import orm from './orm';
import map from 'lodash/map';
import {ACTION_TYPES as PROPERTY_ACTIONS} from '../property/common/actions';
import {ACTION_TYPES as AUTH_ACTIONS} from '../auth/common/actions';
import {ACTION_TYPES as USER_ACTIONS} from '../user/common/actions';
import {ACTION_TYPES as COMPANY_ACTIONS} from '../company/common/actions';

export default function ormReducer(state, action) {
  const session = orm.session(state);
  const {Property, User, Thread} = session;
  switch (action.type) {
    case AUTH_ACTIONS.LOGIN_SUCCESS: {
      let user = action.payload;
      if (!User.hasId(user._id)) {
        User.create(user);
      }
      break;
    }
    case COMPANY_ACTIONS.DOMESTIC_COMPANIES_SUCCESS: {
      const collections = action.payload.data;
      map(collections, entity => {
        User.hasId(entity._id)
          ? User.withId(entity._id).update({...entity})
          : User.create(entity);
      });
      break;
    }
    case USER_ACTIONS.USER_UPDATE_SUCCESS: {
      let user = action.payload;
      if (!User.hasId(user._id)) {
        User.create(user);
      } else {
        User.withId(user._id).update(action.payload);
      }
      break;
    }
    case PROPERTY_ACTIONS.PROPERTY_SUCCESS:
    case PROPERTY_ACTIONS.MY_PROPERTY_SUCCESS:
    case USER_ACTIONS.USER_PROPERTIES_SUCCESS:
    case PROPERTY_ACTIONS.PROPERTY_RELATED_SUCCESS:
    case PROPERTY_ACTIONS.FAVORITES_SUCCESS: {
      const propertyCollections = action.payload.data;
      map(propertyCollections, entity => {
        let user = entity.user;
        if (!user) return;
        if (!User.hasId(user._id)) {
          User.create(user);
        }
        Property.hasId(entity._id)
          ? Property.withId(entity._id).update({...entity, user: user._id})
          : Property.create({...entity, user: user._id});
      });
      break;
    }
    case PROPERTY_ACTIONS.PROPERTY_FAVORITE_OPTIMISTIC_UPDATE: {
      const {itemID, newItemAttributes} = action.payload.params;
      if (Property.hasId(itemID)) {
        const modelInstance = Property.withId(itemID);
        modelInstance.update(newItemAttributes);
      }
      break;
    }
    case PROPERTY_ACTIONS.PROPERTY_FAVORITE_SUCCESS:
    case PROPERTY_ACTIONS.PROPERTY_SAVE_SUCCESS: {
      if (action.payload && action.payload.data) {
        const response = action.payload.data;
        if (Property.hasId(response._id)) {
          const property = Property.withId(response._id);
          property.update({...response, user: response.user_id});
        } else {
          Property.create({...response, user: response.user_id});
        }
      }
      break;
    }

    case PROPERTY_ACTIONS.PROPERTY_DELETE_REQUEST: {
      if (action.params && action.params.itemID) {
        const itemID = action.params.itemID;
        if (Property.hasId(itemID)) {
          const property = Property.withId(itemID);
          property.delete();
        }
      }
      break;
    }

    case USER_ACTIONS.PROPERTY_THREAD_FETCH_SUCCESS: {
      let thread = action.payload;

      if (thread) {
        if (!Thread.hasId(thread._id)) {
          Thread.create(thread);
        } else {
          Thread.withId(thread._id).update({
            ...thread,
          });
        }
      }
      break;
    }

    case USER_ACTIONS.THREAD_CREATE_SUCCESS: {
      let entity = action.payload;
      try {
        Thread.create(entity);
      } catch (error) {
        console.log('err', error);
      }
      break;
    }

    case USER_ACTIONS.MESSAGE_ADD_SUCCESS: {
      let entity = action.payload;
      try {
        let thread = Thread.withId(entity._id);
        if (thread) {
          thread.update({
            recent: entity.recent,
          });
        }
      } catch (error) {
        console.log('err', error);
      }
      break;
    }
    case USER_ACTIONS.SOCKET_RECEIVE_MESSAGE: {
      let entity = action.payload;
      try {
        let thread = Thread.withId(entity.thread_id).ref;

        if (thread) {
          let newMessages = thread.messages
            ? thread.messages.concat(entity)
            : [entity];
          Thread.withId(entity.thread_id).update({
            ...thread,
            messages: newMessages,
          });
        }
      } catch (error) {}
      break;
    }
    case USER_ACTIONS.THREAD_FETCH_SUCCESS: {
      const threadCollections = action.payload.data;
      try {
        map(threadCollections, entity => {
          let {property} = entity;

          if (!Property.hasId(property._id)) {
            Property.create({...entity.property, user: property.user._id});
          }

          if (!User.hasId(property.user._id)) {
            User.create({...property.user});
          }

          Thread.hasId(entity._id)
            ? Thread.withId(entity._id).update({
                ...entity,
              })
            : Thread.create({
                ...entity,
              });
        });
      } catch (error) {
        console.log('err', error);
      }

      break;
    }
    case USER_ACTIONS.THREAD_DETAIL_FETCH_SUCCESS: {
      const entity = action.payload;
      let {property} = entity;

      try {
        let users = entity.users;
        users.map(user => {
          if (!User.hasId(user._id)) {
            User.create(user);
          }
        });
        //

        if (!Property.hasId(property._id)) {
          Property.create({...entity.property, user: property.user._id});
        }

        if (!User.hasId(property.user._id)) {
          User.create({...property.user});
        }

        Thread.hasId(entity._id)
          ? Thread.withId(entity._id).update({
              ...entity,
              // property: entity.property._id,
              users: users.map(user => user._id),
            })
          : Thread.create({
              ...entity,
              // property: entity.property._id,
              users: users.map(user => user._id),
            });
      } catch (error) {
        console.log('err', error);
      }

      break;
    }
    default:
      break;
  }
  return session.state;
}
