import { FacebookIcon } from '@components/icons/facebook';
import { TrashIcon } from '@heroicons/react/outline';
import { IOrder } from '@interfaces/firestore';
import { getJSDate } from '@lib/firestore';
import { getOrderDetails, getOrderStatus } from '@lib/orders';
import { getPrefixForTheDay } from '@lib/utils';
import { Item } from './item';
import { OrderStatusIcon } from './order-status-icon';

export const Order = ({
  oid,
  orderedAt,
  items,
  discount,
  discountCode,
  shippingPrice,
  orderStatus,
}: IOrder) => {
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
            onClick={() => {
              // Notify the user via a toast
              navigator.clipboard.writeText(oid);
            }}
            className="text-3xl lg:text-4xl font-semibold leading-7 lg:leading-9 break-all"
          >
            Order #{oid}
          </h1>
          <p className="text-base font-medium leading-6 underline">
            {time.getDay()}
            {getPrefixForTheDay(time.getDay())} {time.getMonth()}{' '}
            {time.getFullYear()} at {time.getHours()}:{time.getMinutes()}
          </p>
        </div>

        <TrashIcon className="w-10 h-10 text-red-600 mt-6" />
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
                    LKR {subTotal}
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
                      -LKR {discount} ({(parseFloat(discount) * 100) / subTotal}
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
                      {shippingPrice}
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
                  {subTotal -
                    (discount ? parseFloat(discount) : 0) +
                    (shippingPrice ? shippingPrice : 0)}
                </p>
              </div>
            </div>
            <div className="flex flex-col justify-center px-4 py-6 md:p-6 xl:p-8 w-full bg-gray-50 dark:bg-gray-900 space-y-6">
              <h3 className="text-xl font-semibold leading-5 text-gray-800 dark:text-white capitalize">
                {getOrderStatus(orderStatus)}
              </h3>
              <div className="flex justify-between items-start w-full">
                <div className="flex justify-center items-center space-x-4">
                  <div className="w-8 h-8">
										<OrderStatusIcon status={orderStatus} />
                  </div>
                  <div className="flex flex-col justify-start items-center">
                    <p className="text-lg leading-6 font-semibold text-gray-800 dark:text-white">
                      <span className="font-normal">
												{getOrderDetails(orderStatus).description}
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
