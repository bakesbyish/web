import { DefaultSeo } from '@components/seo/default';
import { Loader } from '@components/utils/loader';
import { database, IAddress, IUserDocument } from '@interfaces/firestore';
import { ISession } from '@interfaces/session';
import { db } from 'config/firebase';
import { sessionOptions } from 'config/session';
import { doc, getDoc } from 'firebase/firestore';
import { withIronSessionSsr } from 'iron-session/next';
import { GetServerSideProps } from 'next';
import dynamic from 'next/dynamic';

const CheckoutComponent = dynamic<any>(
  () => import('@components/cart/checkout').then((mod) => mod.Checkout),
  { ssr: false, loading: () => <Loader /> }
);

export default function Checkout(props: {
  address: IAddress | null;
  contactNumber: number | null;
}) {
  const { address, contactNumber } = props;

  return (
    <div className="flex flex-col item-center justify-center min-h-screen">
      <DefaultSeo
        title={'Checkout'}
        description={'Get your items to your home and pay later'}
        paths={[
          {
            name: 'checkout',
            url: '/checkout',
          },
        ]}
        url={'/checkout'}
      />
      <CheckoutComponent address={address} contactNumber={contactNumber} />
    </div>
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

    if (!session || !uid) {
      return {
        props: {
          address: null,
          contactNumber: null,
        },
      };
    }

    const userRef = doc(db, database.users, uid);
    const userSnapshot = await getDoc(userRef);

    const { address, contactNumber } = userSnapshot.data() as IUserDocument;
    console.log(address, contactNumber);

    return {
      props: {
        address: address ? address : null,
        contactNumber: contactNumber ? contactNumber : null,
      },
    };
  },
  sessionOptions
);
