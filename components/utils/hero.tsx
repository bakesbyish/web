import Image from 'next/image';
import Link from 'next/link';

export const Hero = () => {
  return (
    <div className="relative bg-white dark:bg-gray-800 overflow-hidden w-full mt-0 sm:mt-4">
      <div className="pt-16 pb-80 sm:pt-24 sm:pb-40 lg:pt-40 lg:pb-48">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 sm:static">
          <div className="sm:max-w-lg">
            <h1 className="text-4xl font font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-6xl">
              BAKES BY ISH
            </h1>
            <p className="mt-4 text-xl text-gray-500 dark:text-white/80">
              The one stop for all your baking needs, At BAKES BY ISH we are
              commited to provide you with higest quality products at the most
              affordable prices
            </p>
          </div>
          <div>
            <div className="mt-10">
              {/* Decorative image grid */}
              <div
                aria-hidden="true"
                className="pointer-events-none lg:absolute lg:inset-y-0 lg:max-w-7xl lg:mx-auto lg:w-full"
              >
                <div className="absolute transform sm:left-1/2 sm:top-0 sm:translate-x-8 lg:left-1/2 lg:top-1/2 lg:-translate-y-1/2 lg:translate-x-8">
                  <div className="flex items-center space-x-6 lg:space-x-8">
                    <div className="flex-shrink-0 grid grid-cols-1 gap-y-6 lg:gap-y-8">
                      <div className="w-44 h-64 rounded-lg overflow-hidden sm:opacity-0 lg:opacity-100">
                        <Image
                          src="/hero/1.webp"
                          priority={true}
                          alt="Bakes By Ish Image 1"
                          height={1400}
                          width={1000}
                          className="w-full h-full object-center object-cover"
                        />
                      </div>
                      <div className="w-44 h-64 rounded-lg overflow-hidden">
                        <Image
                          src="/hero/2.webp"
                          priority={true}
                          alt="Bakes By Ish Image 2"
                          height={1400}
                          width={1000}
                          className="w-full h-full object-center object-cover"
                        />
                      </div>
                    </div>
                    <div className="flex-shrink-0 grid grid-cols-1 gap-y-6 lg:gap-y-8">
                      <div className="w-44 h-64 rounded-lg overflow-hidden">
                        <Image
                          src="/hero/3.webp"
                          priority={true}
                          alt="Bakes By Ish Image 3"
                          height={1400}
                          width={1000}
                          className="w-full h-full object-center object-cover"
                        />
                      </div>
                      <div className="w-44 h-64 rounded-lg overflow-hidden">
                        <Image
                          src="/hero/4.webp"
                          priority={true}
                          alt="Bakes By Ish Image 4"
                          height={1400}
                          width={1000}
                          className="w-full h-full object-center object-cover"
                        />
                      </div>
                      <div className="w-44 h-64 rounded-lg overflow-hidden">
                        <Image
                          src="/hero/5.webp"
                          priority={true}
                          alt="Bakes By Ish Image 5"
                          height={1400}
                          width={1000}
                          className="w-full h-full object-center object-cover"
                        />
                      </div>
                    </div>
                    <div className="flex-shrink-0 grid grid-cols-1 gap-y-6 lg:gap-y-8">
                      <div className="w-44 h-64 rounded-lg overflow-hidden">
                        <Image
                          src="/hero/6.webp"
                          priority={true}
                          alt="Bakes By Ish Image 6"
                          height={1400}
                          width={1000}
                          className="w-full h-full object-center object-cover"
                        />
                      </div>
                      <div className="w-44 h-64 rounded-lg overflow-hidden">
                        <Image
                          src="/hero/7.webp"
                          priority={true}
                          alt="Bakes By Ish Image 7"
                          height={1400}
                          width={1000}
                          className="w-full h-full object-center object-cover"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <Link href="/shop">
                <a className="inline-block text-center bg-rose-400 border border-transparent rounded-md py-3 px-8 font-medium text-black hover:bg-rose-400">
                  Shop
                </a>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
