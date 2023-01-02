import { Dialog, Transition } from '@headlessui/react';
import { classNames } from '@lib/utils';
import { Dispatch, Fragment, SetStateAction } from 'react';

export const Modal = (props: {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  heading: string;
  content: string;
  buttonText: string;
  onModalClose: () => void;
  showCloseButton?: boolean;
}) => {
  const { isOpen, setIsOpen, heading, content, buttonText, onModalClose } =
    props;

  const showCloseButton = props.showCloseButton ? true : false;

  const closeModal = () => {
    setIsOpen(false);
    !showCloseButton ? onModalClose() : null;
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={closeModal}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel
                className={classNames(
                  'w-full max-w-md transform overflow-hidden rounded-2xl bg-white dark:bg-gray-900 p-6 text-left align-middle shadow-xl transition-all'
                )}
              >
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900 dark:text-white"
                >
                  {heading}
                </Dialog.Title>
                <div className="mt-2">
                  <p className="text-sm text-gray-500 dark:text-white/80">
                    {content}
                  </p>
                </div>

                <div className="flex mt-4 gap-2">
                  <button
                    type="button"
                    className={classNames(
                      'inline-flex justify-center rounded-md border border-transparent bg-rose-300 px-4 py-2 text-sm font-medium text-black',
                      'hover:bg-rose-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-400 focus-visible:ring-offset-2'
                    )}
                    onClick={() => {
                      closeModal();
                      onModalClose();
                    }}
                  >
                    {buttonText}
                  </button>
                  {showCloseButton ? (
                    <button
                      type="button"
                      className={classNames(
                        'inline-flex justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-black',
                        'hover:bg-red-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-600 focus-visible:ring-offset-2'
                      )}
                      onClick={() => {
                        closeModal();
                      }}
                    >
                      Cancel
                    </button>
                  ) : null}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};
