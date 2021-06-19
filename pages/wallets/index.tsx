import React, {Fragment, useState} from "react";
import Header from "components/Header";
import {Dialog, Transition} from '@headlessui/react'
import {useForm} from "react-hook-form";
import FormInput from "components/FormInput";
import {formatNumber} from "src/utils";
import useSWR, {mutate} from "swr";
import {WalletDocument} from "models";
import Table from "components/Table";

export default function WalletsList() {
  const form = useForm({mode: 'onBlur'});
  const [isOpen, setIsOpen] = useState(false);
  const [apiError, setApiError] = useState<string>();
  const [selectedAccount, setSelectedAccount] = useState<string>();
  const {data: wallets} = useSWR<WalletDocument[]>('/api/wallets/');

  function openDialog(id?: string) {
    form.reset();
    setApiError(undefined);

    if (id) {
      setSelectedAccount(id);
      form.setValue("name", wallets?.find((w) => w._id === id)?.name);
    }
    setIsOpen(true);
  }

  async function onSubmit() {
    let response;
    if (!selectedAccount) {
      response = await fetch('/api/wallets', {
        method: "POST",
        body: JSON.stringify(form.getValues()),
        headers: {'Content-Type': 'application/json'}
      });
    } else {
      response = await fetch(`/api/wallets/${selectedAccount}`, {
        method: "PUT",
        body: JSON.stringify(form.getValues()),
        headers: {'Content-Type': 'application/json'}
      });
    }

    if (response.status !== 201 && response.status !== 200) {
      return setApiError("Oops something went wring.");
    } else {
      mutate('/api/wallets').then();
    }

    setIsOpen(false);
  }

  async function deleteAccount() {
    let response = await fetch(`/api/wallets/${selectedAccount}`, {method: "DELETE"});
    if (response.status !== 201 && response.status !== 200) {
      return setApiError("Oops something went wring.");
    } else {
      mutate('/api/wallets').then();
    }

    setIsOpen(false);
  }

  return (
    <div className="flex flex-col h-full">
      <Header title="Accounts"/>

      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="fixed inset-0 z-10 overflow-y-auto" onClose={() => setIsOpen(false)}>
          <div className="min-h-screen px-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75"/>
            </Transition.Child>

            <span className="inline-block h-screen align-middle" aria-hidden="true">
              &#8203;
            </span>

            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <form onSubmit={form.handleSubmit(onSubmit)}
                    className="inline-block w-full max-w-md my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-md">
                <div className="p-6">
                  <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                    Add Account
                  </Dialog.Title>
                  <div className="pt-6 mt-2 space-y-5">
                    <FormInput form={form} name="name" label="Account Name" type="text"
                               required={true} minLength={3}/>

                    {!selectedAccount &&
                    <FormInput form={form} name="initialBalance" label="Initial Balance" type="number"
                               required={true}/>}

                    {apiError && <p className="text-sm text-red-600">{apiError}</p>}
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="submit"
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Submit
                  </button>
                  <button
                    type="button"
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                    onClick={() => setIsOpen(false)}
                  >
                    Cancel
                  </button>
                  <div className="flex-grow"/>
                  {selectedAccount && <button
                      type="button"
                      className="w-full inline-flex justify-center rounded-md border border-transparent px-4 py-2 text-base font-medium text-red-600 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:w-auto sm:text-sm"
                      onClick={() => deleteAccount()}
                  >
                    Delete
                  </button>}
                </div>
              </form>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>

      <div className="flex-grow px-4 sm:px-6 lg:px-8 max-w-screen-xl mx-auto w-full py-10">
        {wallets && <Table
            onEditClicked={(id) => openDialog(id)}
            onNewClicked={openDialog}
            data={wallets}
            columns={[
              {
                key: "name",
                title: 'Name'
              },
              {
                key: "balance",
                title: 'Balance',
                render: () => formatNumber(10000.23)
              },
            ]}
        />}
      </div>
    </div>
  )
}

WalletsList.hasSidebar = true;
