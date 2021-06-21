import React, {Fragment, useEffect, useState} from "react";
import {Dialog, Transition} from "@headlessui/react";
import FormInput from "./FormInput";
import {useForm, UseFormReturn} from "react-hook-form";
import {mutate} from "swr";


interface Props {
  isOpen: boolean;
  id?: string;
  data?: Record<string, any>;
  onClose: () => void;
  baseUrl: string;
  title: string;
  children: (form: UseFormReturn, isEditMode: boolean) => JSX.Element;
}

export default function CreateEditModel(props: Props) {
  const form = useForm({mode: "onBlur"});
  const [apiError, setApiError] = useState<string>();
  const [selectedItem, setSelectedItem] = useState<string>();

  async function onSubmit() {
    let response;
    if (!selectedItem) {
      response = await fetch(props.baseUrl, {
        method: "POST",
        body: JSON.stringify(form.getValues()),
        headers: {'Content-Type': 'application/json'}
      });
    } else {
      response = await fetch(`${props.baseUrl}/${selectedItem}`, {
        method: "PUT",
        body: JSON.stringify(form.getValues()),
        headers: {'Content-Type': 'application/json'}
      });
    }

    if (response.status !== 201 && response.status !== 200) {
      return setApiError("Oops something went wring.");
    } else {
      mutate(props.baseUrl).then();
    }

    props.onClose();
  }

  async function onDelete() {
    let response = await fetch(`${props.baseUrl}/${selectedItem}`, {method: "DELETE"});
    if (response.status !== 201 && response.status !== 200) {
      return setApiError("Oops something went wring.");
    } else {
      mutate(props.baseUrl).then();
    }

    props.onClose();
  }

  useEffect(() => {
    if (!props.isOpen) return;

    form.reset();
    setApiError(undefined);

    if (props.id) {
      setSelectedItem(props.id);
      for (let [key, val] of Object.entries(props.data || {})) {
        form.setValue(key, val);
      }
    } else {
      setSelectedItem(undefined);
    }
  }, [props.isOpen]);

  return (
    <Transition appear show={props.isOpen} as={Fragment}>
      <Dialog as="div" className="fixed inset-0 z-10 overflow-y-auto" onClose={props.onClose}>
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
                  onClick={props.onClose}
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
  );
}
