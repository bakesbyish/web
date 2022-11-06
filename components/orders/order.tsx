import { Loader } from '@components/utils/loader';
import { TrashIcon } from '@heroicons/react/outline';
import { database, IOrder } from '@interfaces/firestore';
import { getJSDate } from '@lib/firestore';
import { getOrderDetails, getOrderStatus } from '@lib/orders';
import { getPrefixForTheDay } from '@lib/utils';
import { db } from 'config/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { Dispatch, SetStateAction, useState } from 'react';
import toast from 'react-hot-toast';
import { Item } from './item';
import { OrderStatusIcon } from './order-status-icon';

export const Order = (props: {
  index: number;
  order: IOrder;
  setOrders: Dispatch<SetStateAction<IOrder[]>>;
}) => {
  const { order, setOrders, index } = props;
  const {
    oid,
    orderedAt,
    items,
    discount,
    discountCode,
    shippingPrice,
    orderStatus,
    deliveryTime,
    shippingProvider,
  } = order;
  const [removingOrder, setRemovingOrder] = useState<boolean>(false);

  const time = getJSDate(orderedAt);
  const subTotal = items.length
    ? items.reduce(
        (appended, current) =>
          appended + (current.itemTotal ? current.itemTotal : 0),
        0
      )
    : 0;

  return (
    <div className="py-14 px-4 md:px-6 2xl:px-20 2xl:container 2xl:mx-auto">
      <div className="flex items-between justify-between w-full">
        <div className="flex justify-start item-start space-y-2 flex-col ">
          <h1
            id={order.oid}
            onClick={() => {
              toast.success('order# copied');
              navigator.clipboard.writeText(oid);
            }}
            className="text-lg lg:text-3xl font-semibold leading-7 lg:leading-9 break-all cursor-pointer"
          >
            #{oid}
          </h1>
          <p className="text-base font-medium leading-6 underline">
            {time.getDate()}
            {getPrefixForTheDay(time.getDate())}{' '}
            {time.toLocaleString('default', { month: 'long' })}{' '}
            {time.getFullYear()} at{' '}
            {time.toLocaleString('en-US', {
              hour: 'numeric',
              minute: 'numeric',
              hour12: true,
            })}
          </p>
        </div>

        {orderStatus === 'shipped' ? (
          <button
            disabled={removingOrder}
            onClick={async () => {
              setRemovingOrder(true);
              const orderRef = doc(db, database.orders, oid);
              await updateDoc(orderRef, {
                [database.collections.orders.visible]: false,
              });

              setOrders((previousOrders) => [
                ...previousOrders.slice(0, index),
                ...previousOrders.slice(index + 1),
              ]);

              setRemovingOrder(false);
            }}
          >
            {removingOrder ? (
              <span className="mt-6">
                <Loader />
              </span>
            ) : (
              <TrashIcon
                type="button"
                className="w-8 h-8 text-red-600 cursor-pointer"
              />
            )}
          </button>
        ) : null}
      </div>
      <div className="mt-10 flex flex-col xl:flex-row jusitfy-center items-stretch  w-full xl:space-x-8 space-y-4 md:space-y-6 xl:space-y-0">
        <div className="flex flex-col justify-start items-start w-full space-y-4 md:space-y-6 xl:space-y-8">
          <div className="flex flex-col justify-start items-start bg-gray-50 dark:bg-gray-900 px-4 py-4 md:py-6 md:p-6 xl:p-8 w-full">
            <p className="text-lg md:text-xl font-semibold leading-6 xl:leading-5 text-gray-800 dark:text-white">
              Items
            </p>
            <Item items={items} />
          </div>
          <div className="flex justify-center md:flex-row flex-col items-stretch w-full space-y-4 md:space-y-0 md:space-x-6 xl:space-x-8">
            <div className="flex flex-col px-4 py-6 md:p-6 xl:p-8 w-full bg-gray-50 dark:bg-gray-900 space-y-6   ">
              <h3 className="text-xl font-semibold leading-5 text-gray-800 dark:text-white">
                Summary
              </h3>
              <div className="flex justify-center items-center w-full space-y-4 flex-col border-gray-200 border-b pb-4">
                <div className="flex justify-between  w-full">
                  <p className="text-base leading-4 text-gray-800 dark:text-white">
                    Subtotal
                  </p>
                  <p className="text-base leading-4 text-gray-600 dark:text-slate-300">
                    LKR {subTotal.toLocaleString()}
                  </p>
                </div>
                {discount && discountCode && (
                  <div className="flex justify-between items-center w-full">
                    <p className="text-base leading-4 text-gray-800 dark:text-white">
                      Discount{' '}
                      <span className="bg-gray-200 p-1 text-xs font-medium leading-3 text-gray-800 dark:text-black">
                        {discountCode}
                      </span>
                    </p>
                    <p className="text-base leading-4 text-gray-600 dark:text-slate-300">
                      -LKR {discount} (
                      {((parseFloat(discount) * 100) / subTotal).toFixed(1)}
                      %)
                    </p>
                  </div>
                )}
                {shippingPrice ? (
                  <div className="flex justify-between items-center w-full">
                    <p className="text-base leading-4 text-gray-800 dark:text-white">
                      Shipping
                    </p>
                    <p className="text-base leading-4 text-gray-600 dark:text-slate-300">
                      LKR {shippingPrice.toLocaleString()}
                    </p>
                  </div>
                ) : null}
              </div>
              <div className="flex justify-between items-center w-full">
                <p className="text-base font-semibold leading-4 text-gray-800 dark:text-white">
                  Total
                </p>
                <p className="text-base font-semibold leading-4 text-gray-600 dark:text-slate-300">
                  LKR{' '}
                  {(
                    subTotal -
                    (discount ? parseFloat(discount) : 0) +
                    (shippingPrice ? shippingPrice : 0)
                  ).toLocaleString()}
                </p>
              </div>
            </div>
            <div className="flex flex-col justify-center px-4 py-6 md:p-6 xl:p-8 w-full bg-gray-50 dark:bg-gray-900 space-y-6">
              <h3 className="text-xl font-semibold leading-5 text-gray-800 dark:text-white capitalize">
                {getOrderStatus(orderStatus)}
              </h3>
              <div className="flex justify-between items-start w-full">
                <div className="flex justify-center items-center space-x-4">
                  <>
                    <OrderStatusIcon
                      status={orderStatus}
                      shippingProvider={shippingProvider}
                    />
                  </>
                  <div className="flex flex-col justify-start items-center">
                    <p className="text-lg leading-6 font-semibold text-gray-800 dark:text-white">
                      <span className="font-normal">
                        {getOrderDetails(orderStatus, deliveryTime).description}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
