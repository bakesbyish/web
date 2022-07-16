import { Layout } from '@components/layout/layout';
import { Order } from '@components/orders/order';
import { Meta } from '@components/seo/metatags';
import { Loader } from '@components/utils/loader';
import { useBakesbyIshcontext } from '@context/context';
import { database, IOrder } from '@interfaces/firestore';
import { ISession } from '@interfaces/session';
import { getJSDate, postToJSON } from '@lib/firestore';
import { db } from 'config/firebase';
import { sessionOptions } from 'config/session';
import {
  collection,
  DocumentData,
  getDocs,
  limit,
  orderBy,
  query,
  QuerySnapshot,
  startAfter,
  Timestamp,
  where,
} from 'firebase/firestore';
import { withIronSessionSsr } from 'iron-session/next';
import { GetServerSideProps } from 'next';
import Link from 'next/link';
import { Fragment, ReactElement, useEffect, useState } from 'react';
import { useCollectionDataOnce } from 'react-firebase-hooks/firestore';

const LIMIT = 2;

export default function Orders(props: { uid: string }) {
  const { uid } = props;

  const ref = database.collections.orders;
  const ordersRef = collection(db, database.orders);
  const ordersQuery = query(
    ordersRef,
    where(ref.uid, '==', uid),
    orderBy(ref.orderedAt, 'desc'),
    limit(LIMIT)
  );

  // Fetch data from firestore
  const [initialOrders, loading] = useCollectionDataOnce(ordersQuery);
  const [orders, setOrders] = useState<IOrder[]>([]);

  useEffect(() => {
    if (initialOrders?.length) {
      const initialData = Array.from(new Set(initialOrders));
      setOrders((previousOrders) => [
        ...previousOrders,
        ...(initialData as IOrder[]),
      ]);
    }
  }, [initialOrders]);

  const getMoreOrders = async () => {
    if (!orders.length) {
      return;
    }

    const lastVisibleOrder = orders[orders.length - 1];
    const cursor =
      typeof lastVisibleOrder.orderedAt === 'number'
        ? Timestamp.fromMillis(lastVisibleOrder.orderedAt)
        : lastVisibleOrder.orderedAt;

    const moreOrdersQuery = query(
      ordersRef,
      where(ref.uid, '==', uid),
      orderBy(ref.orderedAt, 'desc'),
      startAfter(cursor),
      limit(LIMIT)
    );

    const newOrdersArray: IOrder[] = [];

    const ordersSnapshot = await getDocs(moreOrdersQuery);
    ordersSnapshot.docs.forEach((doc) => {
      const order = postToJSON(doc) as IOrder;

      if (!order.orderedAt) {
        return;
      }

      newOrdersArray.push(order);
    });

    const newOrders = Array.from(new Set(newOrdersArray));

    if (newOrders.length < LIMIT) {
      console.log('Add hide loade more');
    }

    setOrders((previousOrders) => [...previousOrders, ...newOrders]);
  };

  return !loading ? (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <Meta title="Your previous orders" />

      {orders.length ? (
        <main className="flex flex-col items-center justify-center py-20">
					{orders.map((order, index: number) => (
						<Order key={index} {...order} />
					))}
        </main>
      ) : (
        <section className="flex flex-col items-center justfiy-center">
          <h1 className="text-2xl mb-2">Your have not ordered anything</h1>
          <Link href="/shop">
            <a className="text-rose-300 underline">Continue shopping</a>
          </Link>
        </section>
      )}
    </div>
  ) : (
    <main className="flex flex-col items-center justify-center min-h-screen">
      <Loader />
    </main>
  );
}

export const getServerSideProps: GetServerSideProps = withIronSessionSsr(
  async function getServerSideProps({ req, res }) {
    // Cache
    res.setHeader(
      'Cache-Control',
      'public, s-maxage=10, stale-while-revalidate=59'
    );

    const session = (req.session as ISession) || null;
    const uid = session?.uid || null;

    if (!(uid && session)) {
      return {
        redirect: {
          destination: '/register',
          permanent: false,
        },
      };
    }

    return {
      props: {
        uid,
      },
    };
  },
  sessionOptions
);

Orders.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};
