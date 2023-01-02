import { database, ITimestamp } from '@interfaces/firestore';
import { DocumentSnapshot, Timestamp } from 'firebase/firestore';

/**
 * @description - Serialize the document to JSON
 * @param {DocumentSnapshot} doc - The firebase docuemnt with timestamps to serailize
 * @return {DocumentData} - The data of the passed document
 * */
export const postToJSON = (doc: DocumentSnapshot) => {
  const data = doc?.data();
  return {
    ...data,
    [database.collections.orders.orderedAt]: data?.orderedAt.toMillis(),
  };
};

/**
 * @description - Get the javascript date from the firebase serverTimestamp
 * @param {Timestamp | number} time - The firestore timestamp
 * @returns {Date} - The javascript date object
 **/
export const getJSDate = (time: ITimestamp | number) => {
  if (typeof time === 'number') {
    return new Date(time);
  }

  return new Date(time.seconds * 1000);
};
