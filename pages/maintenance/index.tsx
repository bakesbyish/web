import Image from 'next/image';
import { AddEmail } from '@components/mail/add-email';
import { DefaultSeo } from '@components/seo/default';

export default function Maintenance() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
			<DefaultSeo
				title={"Under maintainance"}
			/>
      <main className="container">
        <nav className="flex flex-row items-center justify-center gap-2 mt-16">
          <Image
            src={
              'https://ik.imagekit.io/bakesbyish/bakesbyish/public/bakesbyish_NtjDJFQdk.svg'
            }
            alt={'Bakes By Ish Logo'}
            width={40}
            height={40}
          />
          <h1 className="text-center font-bold text-2xl sm:text-4xl text-red-200">
            Under maintainance
          </h1>
        </nav>

        <div className="container px-6 py-16 mx-auto">
          <div className="items-center lg:flex">
            <div className="w-full lg:w-1/2">
              <div className="lg:max-w-lg">
                <h1 className="text-2xl font-semibold text-gray-800 dark:text-white lg:text-3xl mx-auto">
                  Subscribe To The{' '}
                  <span className="text-rose-300">Newsletter</span>
                </h1>

                <p className="mt-4 text-gray-600 dark:text-gray-400">
                  Be the first to know when{' '}
                  <span className="font-medium text-rose-400 mr-2">
                    BAKES BY ISH
                  </span>
                  is live
                </p>

                <AddEmail />
              </div>
            </div>

            <div className="flex items-center justify-center w-full mt-6 lg:mt-0 lg:w-1/2">
              <Image
                src={
                  'https://ik.imagekit.io/bakesbyish/bakesbyish/public/email-campaign_YKfrkQa-C.svg'
                }
                alt={'Be the first to know when we launch'}
                width={400}
                height={400}
                className="w-full h-full max-w-md"
              />
            </div>
          </div>
        </div>

        <h1 className="ml-4 mb-4 text-rose-400">Mean while visit us on,</h1>
        <article className="flex flex-row gap-2 ml-4 mb-4">
          <a href="https://wa.link/bakesbyish" target="blank">
						<Image
							src={"https://ik.imagekit.io/bakesbyish/bakesbyish/public/whatsapp_xORs99V0T.svg"}
							alt={"Whatsapp logo"}
							width={40}
							height={40}
						/>
          </a>
          <a href="https://facebook.com/bakesbyishani" target="blank">
						<Image
							src={"https://ik.imagekit.io/bakesbyish/bakesbyish/public/facebook_Sn0Wr8dce.svg"}
							alt={"Facebook logo"}
							width={40}
							height={40}
						/>
          </a>
          <a href="https://g.page/bakesbyish?share" target="blank">
						<Image
							src={"https://ik.imagekit.io/bakesbyish/bakesbyish/public/google-maps_SO9Bs_3--.svg"}
							alt={"GoogleMaps logo"}
							width={40}
							height={40}
						/>
          </a>
          <a href="tel:0717121856">
						<Image
							src={"https://ik.imagekit.io/bakesbyish/bakesbyish/public/phone_lmFIU5EmX.svg"}
							alt={"Phone logo"}
							width={40}
							height={40}
						/>
          </a>
        </article>
      </main>
    </div>
  );
}
