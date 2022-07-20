import { Loader } from '@components/utils/loader';
import { database } from '@interfaces/firestore';
import { db } from 'config/firebase';
import { doc, increment, writeBatch } from 'firebase/firestore';
import { useDocument } from 'react-firebase-hooks/firestore';
import { HeartIcon as SolidHeartIcon } from '@heroicons/react/solid';
import { HeartIcon as OutLineHeartIcon } from '@heroicons/react/outline';

export const Hearts = (props: { slug: string; uid: string }) => {
  const { slug, uid } = props;

  // Reference the product document
  const productRef = doc(db, "products", slug);

  // Reference the heart document
  const heartRef = doc(
    db,
		database.products,
		slug,
		database.collections.products.hearts,
    uid
  );

  const [heartDoc, loading] = useDocument(heartRef);

  // Add an heart for the product
  const addHeart = async () => {
    const batch = writeBatch(db);
    batch.set(productRef, {
      hearts: increment(1),
    }, { merge: true });
    batch.set(heartRef, {
      uid,
    });

    await batch.commit();
  };

  // Remove an heart from a product
  const unHeart = async () => {
    const batch = writeBatch(db);
    batch.update(productRef, {
      hearts: increment(-1),
    });
    batch.delete(heartRef);

    await batch.commit();
  };

  return loading ? (
    <Loader />
  ) : (
    <>
      {heartDoc?.exists() ? (
        <SolidHeartIcon
          type="button"
          onClick={unHeart}
          className="w-9 h-9 text-red-600"
        />
      ) : (
        <OutLineHeartIcon
          type="button"
          onClick={addHeart}
          className="w-9 h-9 text-red-600"
        />
      )}
    </>
  );
};
