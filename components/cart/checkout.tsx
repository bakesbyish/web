import { Loader } from '@components/utils/loader';
import { Disclosure } from '@headlessui/react';
import { yupResolver } from '@hookform/resolvers/yup';
import { database, IAddress } from '@interfaces/firestore';
import { notifyOrder } from '@lib/communication';
import { ICheckoutForm } from '@lib/forms';
import { validateDiscount } from '@lib/products';
import { classNames } from '@lib/utils';
import kebabCase from 'lodash.kebabcase';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useCart } from 'react-use-cart';
import * as yup from 'yup';
import * as fbq from '@lib/fbpixel';
import { useBakesbyIshcontext } from '@context/context';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from 'config/firebase';

const Modal = dynamic<any>(() =>
  import('@components/utils/modal').then((mod) => mod.Modal)
);

export const Checkout = (props: {
  address: IAddress | null;
  contactNumber: number | null;
}) => {
  const { address, contactNumber } = props;
  const { items, removeItem, emptyCart } = useCart();
  const { user } = useBakesbyIshcontext();

  const subtotal = items.length
    ? items.reduce(
        (append, current) => append + (current.price ? current.price : 0),
        0
      )
    : 0;

  const formSchema = yup.object().shape({
    address: yup
      .string()
      .required('Address is required for delivery')
      .max(200, 'Address cannot be greater than 200 characters'),
    state: yup
      .string()
      .required('Enter the state')
      .max(200, 'State cannot be greater than 100 characters'),
    city: yup
      .string()
      .required('Enter the city')
      .max(100, 'City cannot be greater than 100 characters'),
    contactNumber: yup
      .string()
      .required('Enter your number')
      .matches(
        /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/,
        'Phone number is not valid'
      )
      .max(20, 'Phone number is not valid'),
  });

  const { register, handleSubmit, formState } = useForm<ICheckoutForm>({
    resolver: yupResolver(formSchema),
    defaultValues: {
      address: address?.address,
      state: address?.state,
      city: address?.city,
      contactNumber: contactNumber?.toString(),
    },
  });

  const { errors } = formState;

  const [formData, setFormData] = useState<ICheckoutForm | null>(null);

  const [discount, setDiscount] = useState<number | null>(null);
  const [discountCode, setDiscountCode] = useState<string>('');
  const [discountError, setDiscountError] = useState<string | null>(null);

  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [saveAddressModalOpen, setSaveAddressModalOpen] =
    useState<boolean>(false);

  const [validatingDiscount, setValidatingDiscount] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const router = useRouter();

  useEffect(() => {
    if (formData) {
      if (!saveAddressModalOpen) {
        (async () => {
          if (process.env.NODE_ENV !== 'development') {
            fbq.event('Purchase', {
              content_ids: items.map((item) => item.sku),
              content_name: items.map((item) => item.name),
              currency: 'LKR',
              value: discount ? subtotal - discount : subtotal,
            });
          }

          await notifyOrder(items, formData, discountCode);

          setModalOpen(true);
          setLoading(false);
        })();
      }
    }

    // eslint-disable-next-line
  }, [formData, saveAddressModalOpen]);

  const submitOrder = async (data: ICheckoutForm) => {
    setLoading(true);
    if (!address && !contactNumber && user) {
      setSaveAddressModalOpen(true);
    }
    setFormData(data);
  };

  const handleSubmitDiscountcode = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setDiscountError(null);
    setValidatingDiscount(true);
    if (!discountCode) {
      setValidatingDiscount(false);
      setDiscountError('Discount code is not valid');
      return;
    }

    const { discount, exsists } = await validateDiscount(
      discountCode.toString()
    );

    if (!exsists) {
      setValidatingDiscount(false);
      setDiscountError('Discount code is not valid');
      return;
    }

    setValidatingDiscount(false);
    setDiscount(discount);
  };

  const onDiscountCodeChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = kebabCase(encodeURI(event.target.value));
    setDiscountCode(value);
  };

  const onModalClose = async () => {
    await router.push('/');
    emptyCart();
  };

  const saveAddress = async () => {
    if (!formData && !user) {
      return;
    }

    const userDatabaseRef = database.collections.users;
    const userRef = doc(db, database.users, user!.uid);
    await updateDoc(userRef, {
      [userDatabaseRef.address]: formData?.address,
      [userDatabaseRef.state]: formData?.state,
      [userDatabaseRef.city]: formData?.city,
      [userDatabaseRef.contactNumber]: formData?.contactNumber,
    });
  };

  return items.length ? (
    <>
      <main className="flex flex-col items-center justify-center py-10 sm:py-20">
        <div className="lg:min-h-full lg:overflow-hidden lg:flex lg:flex-row-reverse">
          <div className="px-4 py-6 sm:px-6 lg:hidden">
            <div className="max-w-lg mx-auto flex">
              <Link href="/" passHref>
                <a>
                  <span className="sr-only">Workflow</span>
                  <Image
                    src="/bakesbyish.svg"
                    alt="Bakes By Ish"
                    width={50}
                    height={50}
                    className="h-8 w-auto"
                  />
                </a>
              </Link>
            </div>
          </div>

          <h1 className="sr-only">Checkout</h1>

          {/* Mobile order summary */}
          <section
            aria-labelledby="order-heading"
            className="bg-gray-50 dark:bg-gray-900 py-6 lg:hidden"
          >
            <Disclosure as="div" className="w-80 px-2 mx-auto">
              {({ open }) => (
                <>
                  <div className="flex items-center justify-between">
                    <h2
                      id="order-heading"
                      className="text-lg font-medium text-gray-900 dark:text-white"
                    >
                      Your Order
                    </h2>
                    <Disclosure.Button className="font-medium text-rose-400 hover:text-rose-400 ml-6">
                      {open ? (
                        <span>Hide full summary</span>
                      ) : (
                        <span>Show full summary</span>
                      )}
                    </Disclosure.Button>
                  </div>

                  <Disclosure.Panel>
                    <ul
                      role="list"
                      className="divide-y divide-gray-200 border-b border-gray-200"
                    >
                      {items.map((item) => (
                        <li key={item.id} className="flex py-6 space-x-6">
                          <Image
                            src={item.url}
                            alt={item.name}
                            width={125}
                            height={125}
                            className="flex-none w-40 h-40 object-center object-cover bg-gray-200 rounded-md"
                          />
                          <div className="flex flex-col justify-between space-y-4">
                            <div className="text-sm font-medium space-y-1">
                              <h3 className="text-gray-900 dark:text-white">
                                {item.name}
                              </h3>
                              <p className="text-gray-900 dark:text-white">
                                LKR {item.price.toLocaleString()}
                              </p>
                              <p className="text-gray-900 dark:text-white">
                                qty {item.quantity}
                              </p>
                              <p className="text-gray-500 dark:text-white/80">
                                {item.color}
                              </p>
                              <p className="text-gray-500 dark:text-white/80">
                                {item.size}
                              </p>
                            </div>
                            <div className="flex space-x-4">
                              <Link href={`/shop/${item.slug}`}>
                                <a className="text-sm font-medium text-rose-300 hover:text-rose-400">
                                  Edit
                                </a>
                              </Link>
                              <div className="flex border-l border-gray-300 pl-4">
                                <button
                                  type="button"
                                  onClick={() => removeItem(item.id)}
                                  className="text-sm font-medium text-rose-300 hover:text-rose-400"
                                >
                                  Remove
                                </button>
                              </div>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>

                    <form className="mt-10" onSubmit={handleSubmitDiscountcode}>
                      <label
                        htmlFor="discount-code-mobile"
                        className="block text-sm font-medium text-gray-700 dark:text-white"
                      >
                        Discount code
                      </label>
                      <div className="flex space-x-4 mt-1">
                        <input
                          type="text"
                          id="discount-code-mobile"
                          name="discount-code-mobile"
                          value={discountCode}
                          onChange={onDiscountCodeChange}
                          className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-rose-400 focus:border-rose-400 sm:text-sm dark:text-black"
                        />
                        <button
                          type="submit"
                          className={classNames(
                            'bg-gray-200 text-sm font-medium text-gray-600 rounded-md px-4 hover:bg-gray-300',
                            'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-rose-400'
                          )}
                        >
                          {validatingDiscount ? (
                            <Loader width={6} height={6} />
                          ) : (
                            <span>Apply</span>
                          )}
                        </button>
                      </div>

                      {discountError && (
                        <p className="text-red-600 text-sm mt-2 ml-2">
                          {discountError}
                        </p>
                      )}
                    </form>

                    <dl className="text-sm font-medium text-gray-500 dark:text-white/80 mt-10 space-y-6">
                      <div className="flex justify-between">
                        <dt>Subtotal</dt>
                        <dd className="text-gray-900 dark:text-white">
                          LKR {subtotal.toLocaleString()}
                        </dd>
                      </div>

                      {discount && discountCode && (
                        <div className="flex justify-between">
                          <dt className="flex">
                            Discount
                            <span className="ml-2 rounded-full bg-gray-200 text-xs text-gray-600 py-0.5 px-2 tracking-wide">
                              {discountCode}
                            </span>
                          </dt>
                          <dd className="text-gray-900 dark:text-white">
                            - LKR {discount.toLocaleString()}
                          </dd>
                        </div>
                      )}
                    </dl>
                  </Disclosure.Panel>

                  <p className="flex items-center justify-between text-sm font-medium text-gray-900 dark:text-white border-t border-gray-200 pt-6 mt-6">
                    <span className="text-base">Total</span>
                    <span className="text-base">
                      LKR{' '}
                      {discount
                        ? (subtotal - discount).toLocaleString()
                        : subtotal.toLocaleString()}
                    </span>
                  </p>
                </>
              )}
            </Disclosure>
          </section>

          {/* Order summary */}
          <section
            aria-labelledby="summary-heading"
            className="hidden bg-gray-50 dark:bg-gray-900 w-full max-w-md flex-col lg:flex"
          >
            <h2 id="summary-heading" className="sr-only">
              Order summary
            </h2>

            <ul
              role="list"
              className="flex-auto overflow-y-auto divide-y divide-gray-200 px-6"
            >
              {items.map((item) => (
                <li key={item.id} className="flex py-6 space-x-6">
                  <Image
                    src={item.url}
                    alt={item.name}
                    width={150}
                    height={150}
                    className="flex-none w-40 h-40 object-center object-cover bg-gray-200 rounded-md"
                  />
                  <div className="flex flex-col justify-between space-y-4">
                    <div className="text-sm font-medium space-y-1">
                      <h3 className="text-gray-900 dark:text-white">
                        {item.name}
                      </h3>
                      <p className="text-gray-900 dark:text-white">
                        LKR {item.price.toLocaleString()}
                      </p>
                      <p className="text-gray-900 dark:text-white">
                        qty {item.quantity}
                      </p>
                      <p className="text-gray-500 dark:text-white/80">
                        {item.color}
                      </p>
                      <p className="text-gray-500 dark:text-white/80">
                        {item.size}
                      </p>
                    </div>
                    <div className="flex space-x-4">
                      <Link href={`/shop/${item.slug}`}>
                        <a className="text-sm font-medium text-rose-300 hover:text-rose-400">
                          Edit
                        </a>
                      </Link>
                      <div className="flex border-l border-gray-300 pl-4">
                        <button
                          type="button"
                          onClick={() => removeItem(item.id)}
                          className="text-sm font-medium text-rose-300 hover:text-rose-400"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <div className="sticky bottom-0 flex-none bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-slate-400 p-6">
              <form onSubmit={handleSubmitDiscountcode}>
                <label
                  htmlFor="discount-code"
                  className="block text-sm font-medium text-gray-700 dark:text-white"
                >
                  Discount code
                </label>
                <div className="flex space-x-4 mt-1">
                  <input
                    type="text"
                    id="discount-code"
                    name="discount-code"
                    onChange={onDiscountCodeChange}
                    className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-rose-400 focus:border-rose-400 sm:text-sm dark:text-black"
                  />
                  <button
                    type="submit"
                    className={classNames(
                      'bg-gray-200 text-sm font-medium text-gray-600 rounded-md px-4 hover:bg-gray-300',
                      'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-rose-400'
                    )}
                  >
                    {validatingDiscount ? (
                      <Loader width={6} height={6} />
                    ) : (
                      <span>Apply</span>
                    )}
                  </button>
                </div>

                {discountError && (
                  <p className="text-red-600 text-sm mt-2">{discountError}</p>
                )}
              </form>

              <dl className="text-sm font-medium text-gray-500 dark:text-white/80 mt-10 space-y-6">
                <div className="flex justify-between">
                  <dt>Subtotal</dt>
                  <dd className="text-gray-900 dark:text-white">
                    LKR {subtotal.toLocaleString()}
                  </dd>
                </div>

                {discount && discountCode && (
                  <div className="flex justify-between">
                    <dt className="flex">
                      Discount
                      <span className="ml-2 rounded-full bg-gray-200 text-xs text-gray-600 py-0.5 px-2 tracking-wide">
                        {discountCode}
                      </span>
                    </dt>
                    <dd className="text-gray-900 dark:text-white">
                      - LKR {discount.toLocaleString()}
                    </dd>
                  </div>
                )}

                <div className="flex items-center justify-between border-t border-gray-200 dark:border-slate-400 text-gray-900 dark:text-white pt-6">
                  <dt className="text-base">Total</dt>
                  <dd className="text-base">
                    LKR{' '}
                    {discount
                      ? (subtotal - discount).toLocaleString()
                      : subtotal.toLocaleString()}
                  </dd>
                </div>
              </dl>
            </div>
          </section>

          {/* Checkout form */}
          <section
            aria-labelledby="payment-heading"
            className="flex-auto overflow-y-auto px-4 pt-12 pb-16 sm:px-6 sm:pt-16 lg:px-8 lg:pt-0 lg:pb-24"
          >
            <div className="max-w-lg mx-auto">
              <div className="hidden pt-10 pb-16 lg:flex">
                <Link href="/" passHref>
                  <a>
                    <span className="sr-only">Workflow</span>
                    <Image
                      src="/bakesbyish.svg"
                      alt="Bakes By Ish"
                      width={50}
                      height={50}
                      className="h-8 w-auto"
                    />
                  </a>
                </Link>
              </div>

              <form onSubmit={handleSubmit(submitOrder)}>
                <div className="grid grid-cols-12 gap-y-6 gap-x-4">
                  <div className="col-span-full">
                    <label
                      htmlFor="address"
                      className="block text-sm font-medium text-gray-700 dark:text-white"
                    >
                      Address
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        id="address"
                        autoComplete="street-address"
                        {...register('address')}
                        className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-rose-300 focus:border-rose-400 sm:text-sm dark:text-black"
                      />
                      {errors.address && (
                        <p className="text-red-600 text-sm">
                          {errors.address.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="col-span-full sm:col-span-4">
                    <label
                      htmlFor="city"
                      className="block text-sm font-medium text-gray-700 dark:text-white"
                    >
                      City
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        id="city"
                        autoComplete="address-level2"
                        {...register('city')}
                        className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-rose-500 focus:border-rose-400 sm:text-sm dark:text-black"
                      />
                      {errors.city && (
                        <p className="text-red-600 text-sm">
                          {errors.city.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="col-span-full sm:col-span-4">
                    <label
                      htmlFor="region"
                      className="block text-sm font-medium text-gray-700 dark:text-white"
                    >
                      State / Province
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        id="region"
                        autoComplete="address-level1"
                        {...register('state')}
                        className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-rose-400 focus:border-rose-400 sm:text-sm dark:text-black"
                      />
                      {errors.state && (
                        <p className="text-red-600 text-sm">
                          {errors.state.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="col-span-full sm:col-span-4">
                    <label
                      htmlFor="telephone"
                      className="block text-sm font-medium text-gray-700 dark:text-white"
                    >
                      Telephone
                    </label>
                    <div className="mt-1">
                      <input
                        type="tel"
                        id="phone"
                        autoComplete="telephone"
                        {...register('contactNumber')}
                        className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-rose-400 focus:border-rose-400 sm:text-sm dark:text-black"
                      />
                      {errors.contactNumber && (
                        <p className="text-red-600 text-sm">
                          {errors.contactNumber.message}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className={classNames(
                    'w-full mt-6 bg-rose-400 border border-transparent rounded-md shadow-sm py-2 px-4 text-sm font-medium text-black',
                    'hover:bg-rose-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-400'
                  )}
                  disabled={loading}
                >
                  {loading ? (
                    <Loader width={5} height={5} />
                  ) : (
                    <>
                      Pay LKR{' '}
                      {discount
                        ? (subtotal - discount).toLocaleString()
                        : subtotal.toLocaleString()}
                    </>
                  )}
                </button>
              </form>
            </div>
          </section>
        </div>
      </main>

      {saveAddressModalOpen ? (
        <Modal
          isOpen={saveAddressModalOpen}
          setIsOpen={setSaveAddressModalOpen}
          heading={'Save address ?'}
          content={
            'Do you want to save the current address and contact number for future use ? (you can always change it while checkout or seperatly in your profile page)'
          }
          buttonText={'Okay'}
          onModalClose={saveAddress}
          showCloseButton={true}
        />
      ) : null}

      {modalOpen ? (
        <Modal
          isOpen={modalOpen}
          setIsOpen={setModalOpen}
          heading={'Order confirmed'}
          content={
            'Your order has been confirmed, If you are available on WhatsApp with the contact number that you provided we will reach you there to inform about your order or else you will receive a call or SMS depending on the time'
          }
          buttonText={'Okay'}
          onModalClose={onModalClose}
        />
      ) : null}
    </>
  ) : (
    <section className="flex flex-col items-center justfiy-center">
      <h1 className="text-2xl mb-2">Your cart is empty</h1>
      <Link href="/shop">
        <a className="text-rose-300 underline">Continue shopping</a>
      </Link>
    </section>
  );
};
