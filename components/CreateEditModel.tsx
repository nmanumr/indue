import React, {Fragment, useState} from "react";
import {Dialog, Transition} from "@headlessui/react";
import FormInput from "./FormInput";
import {useForm, UseFormReturn} from "react-hook-form";
import {mutate} from "swr";


interface Props {
  title: string;
  children: (form: UseFormReturn, isEditMode: boolean) => JSX.Element;
}

export default function useCreateEditModel(baseUrl: string): [
  (id?: string, data?: Record<string, any>) => void,
  (props: Props) => JSX.Element,
] {

  const form = useForm();
  const [apiError, setApiError] = useState<string>();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<string>();

  async function onSubmit() {
    let response;
    if (!selectedItem) {
      response = await fetch(baseUrl, {
        method: "POST",
        body: JSON.stringify(form.getValues()),
        headers: {'Content-Type': 'application/json'}
      });
    } else {
      response = await fetch(`${baseUrl}/${selectedItem}`, {
        method: "PUT",
        body: JSON.stringify(form.getValues()),
        headers: {'Content-Type': 'application/json'}
      });
    }

    if (response.status !== 201 && response.status !== 200) {
      return setApiError("Oops something went wring.");
    } else {
      mutate(baseUrl).then();
    }

    setIsOpen(false);
  }

  async function onDelete() {
    let response = await fetch(`${baseUrl}/${selectedItem}`, {method: "DELETE"});
    if (response.status !== 201 && response.status !== 200) {
      return setApiError("Oops something went wring.");
    } else {
      mutate(baseUrl).then();
    }

    setIsOpen(false);
  }

  function openDialog(id?: string, data: Record<string, any> = {}) {
    form.reset();
    setApiError(undefined);

    if (id) {
      setSelectedItem(id);
      for (let [key, val] of Object.entries(data)) {
        form.setValue(key, val);
      }
    } else {
      setSelectedItem(undefined);
    }
    setIsOpen(true);
  }

  let createEditModel = (props: Props) => {
    return (
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
                    {props.title}
                  </Dialog.Title>
                  <div className="pt-6 mt-2 space-y-5">
                    {props.children(form, !!selectedItem)}

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
                  {selectedItem && <button
                      type="button"
                      className="w-full inline-flex justify-center rounded-md border border-transparent px-4 py-2 text-base font-medium text-red-600 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:w-auto sm:text-sm"
                      onClick={() => onDelete()}
                  >
                    Delete
                  </button>}
                </div>
              </form>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    )
  }

  return [openDialog, createEditModel];
}
