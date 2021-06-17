import React, {Fragment, useState} from "react";
import Header from "components/Header";
import {PencilIcon, PlusIcon} from "@heroicons/react/solid";
import { Dialog, Transition } from '@headlessui/react'
import {useForm} from "react-hook-form";
import FormInput from "../../components/FormInput";
import {formatNumber} from "../../src/utils";

const people = [
  {id: 1, name: 'Habib Bank Limited', balance: Math.random() * 10000},
  {id: 2, name: 'Habib Metro Bank', balance: Math.random() * 10000},
  {id: 3, name: 'Meezan Bank', balance: Math.random() * 10000},
  {id: 4, name: 'United Bank Limited', balance: Math.random() * 10000},
  {id: 5, name: 'Faysal Bank Limited', balance: Math.random() * 10000},
  {id: 6, name: 'Alfalah Bank Limited', balance: Math.random() * 10000},
]

export default function WalletsList() {
  let [isOpen, setIsOpen] = useState(false);
  const form = useForm({mode: 'onBlur'});

  return (
    <div className="flex flex-col h-full">
      <Header title="Wallets"/>

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
              <Dialog.Overlay className="fixed inset-0 bg-gray-900 bg-opacity-70" />
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
              <div className="inline-block w-full max-w-md my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-md">
                <div className="p-6">
                  <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                    Add Wallet
                  </Dialog.Title>
                  <form className="pt-6 mt-2 space-y-5">
                    <FormInput form={form} name="name" label="Wallet Name" type="text"
                               required={true} minLength={3}/>

                    <FormInput form={form} name="initialBalance" label="Initial Balance" type="number"
                               required={true}/>
                  </form>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="button"
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
                    onClick={() => setIsOpen(false)}
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                    onClick={() => setIsOpen(false)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>

      <div className="flex-grow px-4 sm:px-6 lg:px-8 max-w-screen-xl mx-auto w-full py-10">
        <div className="flex flex-col">
          <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
              <div className="border border-gray-300 bg-white overflow-hidden sm:rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                  <tr className="bg-gray-100">
                    <th scope="col"
                        className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Name
                    </th>
                    <th scope="col"
                        className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Balance
                    </th>
                    <th scope="col" className="relative px-4 py-3 w-0">
                      <span className="sr-only">Edit</span>
                    </th>
                  </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                  {people.map((person, personIdx) => (
                    <tr key={person.id}>
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{person.name}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{formatNumber(person.balance)}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium w-0">
                        <button type="button" aria-haspopup="true"
                                className="-my-2 p-2 rounded flex items-center text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-600">
                          <span className="sr-only">Edit</span>
                          <PencilIcon className="h-5 w-5"/>
                        </button>
                      </td>
                    </tr>
                  ))}
                  <tr>
                    <td colSpan={3} className="px-4 py-2 text-sm font-medium">
                      <button onClick={() => setIsOpen(true)} className="flex text-indigo-500 hover:text-indigo-700 py-0.5 pl-1 pr-2.5">
                        <PlusIcon className="h-5 w-5 opacity-90"/>
                        <span className="ml-2">New Wallet</span>
                      </button>
                    </td>
                  </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

WalletsList.hasSidebar = true;
