import Realm from 'realm';

export class User extends Realm.Object<User> {
  _id!: Realm.BSON.ObjectId;
  nombre!: string;
  apellido1!: string;
  apellido2!: string;
  email!: string;
  password!: string;
  fechaNacimiento!: Date;

  static schema = {
    name: 'User',
    primaryKey: '_id',
    properties: {
      _id: 'objectId',
      nombre: 'string',
      apellido1: 'string',
      apellido2: 'string',
      email: 'string',
      password: 'string',
      fechaNacimiento: 'date',
    },
  };
}
