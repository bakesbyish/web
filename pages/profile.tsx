import { Layout } from '@components/layout/layout';
import { Border } from '@components/profile/border';
import { Notifications } from '@components/profile/notifications';
import { PersonalInformation } from '@components/profile/personal-information';
import { Profile } from '@components/profile/profile';
import { DefaultSeo } from '@components/seo/default';
import { Loader } from '@components/utils/loader';
import { ProfileContext } from '@context/profile';
import { database, IUserDocument } from '@interfaces/firestore';
import { ISession } from '@interfaces/session';
import { db } from 'config/firebase';
import { sessionOptions } from 'config/session';
import { doc } from 'firebase/firestore';
import { withIronSessionSsr } from 'iron-session/next';
import { GetServerSideProps } from 'next';
import { ReactElement } from 'react';
import { useDocumentData } from 'react-firebase-hooks/firestore';

export default function ProfilePage(props: { uid: string }) {
  const { uid } = props;
  const [user, loading] = useDocumentData(
    doc(db, database.users, uid)
  ) as unknown[] as [IUserDocument | undefined, boolean];

  return !loading ? (
    <>
      <DefaultSeo
        title={user?.displayName || 'Profile'}
        disableRobots={true}
        url={'/profile'}
      />
      <ProfileContext.Provider
        value={{
          user,
        }}
      >
        <div className="flex flex-col items-center justify-center min-h-screen py-20">
          <main className="flex flex-col items-center justify-center max-w-7xl">
            <Profile />
            <Border />
            <PersonalInformation />
            <Border />
            <Notifications />
          </main>
        </div>
      </ProfileContext.Provider>
    </>
  ) : (
    <>
      <DefaultSeo title={'Profile'} disableRobots={true} url={'/login'} />
      <main className="flex flex-col items-center justify-center min-h-screen">
        <Loader />
      </main>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = withIronSessionSsr(
  async function getServerSideProps({ req, res }) {
    // Cache
    res.setHeader(
      'Cache-Control',
      'public, s-maxage=10, stale-while-revalidate=3600'
    );

    const session = (req.session as ISession) || null;
    const uid = session.uid || null;

    if (!(session && uid)) {
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

ProfilePage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};
