import { AddEmail } from '@components/mail/add-email';
import Image from 'next/image';

export const Newsletter = () => {
  return (
    <>
      <span className="sr-only">Subscribe to mail list</span>
      <div className="p-6 container md:w-2/3 xl:w-auto mx-auto flex flex-col xl:items-stretch justify-between xl:flex-row">
        <div className="xl:w-1/2 md:mb-14 xl:mb-0 relative h-auto flex items-center justify-center">
          <Image
            src="/email-campaign.svg"
            alt="Envelope with a newsletter"
            role="img"
            width={700}
            height={500}
            className="h-full xl:w-full lg:w-1/2 w-full "
          />
        </div>
        <div className="w-full xl:w-1/2 xl:pl-40 xl:py-28 ">
          <h1 className="text-2xl md:text-4xl xl:text-5xl font-bold leading-10 text-gray-800 dark:text-white mb-4 text-center xl:text-left md:mt-0 mt-4">
            Subscribe
          </h1>
          <p className="text-base leading-normal text-gray-600 dark:text-white/80 text-center xl:text-left">
            Whether article spirits new her covered hastily sitting her. Money
            witty books nor son add.
          </p>
          <AddEmail />
        </div>
      </div>
    </>
  );
};
