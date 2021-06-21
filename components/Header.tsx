import {Menu, Transition} from "@headlessui/react";
import {DotsVerticalIcon} from "@heroicons/react/solid";
import React, {Fragment} from "react";
import c from "classnames";

interface Props {
  title: string;
  menuItems?: ({
    icon?: JSX.Element;
    id?: string;
    name: string;
    onClick: (id?: string) => void
  } | 'divider')[];
}

export default function Header({menuItems, title}: Props) {
  return (
    <header className="bg-white border-b border-gray-300">
      <div className="flex items-center max-w-screen-xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
        <h1 className="flex-grow text-lg font-medium leading-6 text-gray-900 sm:truncate">{title}</h1>

        {menuItems && <div className="mt-4 flex sm:mt-0 sm:ml-4">
          <Menu as="div" className="ml-3 relative inline-block text-left z-20">
            {({open}) => (
              <>
                <div>
                  <Menu.Button
                    className="-my-2 p-2 rounded-full bg-white flex items-center text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-600">
                    <span className="sr-only">Open options</span>
                    <DotsVerticalIcon className="h-5 w-5" aria-hidden="true"/>
                  </Menu.Button>
                </div>

                <Transition show={open} as={Fragment}
                            enter="transition ease-out duration-100"
                            enterFrom="transform opacity-0 scale-95"
                            enterTo="transform opacity-100 scale-100"
                            leave="transition ease-in duration-75"
                            leaveFrom="transform opacity-100 scale-100"
                            leaveTo="transform opacity-0 scale-95"
                >
                  <Menu.Items static
                              className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div className="py-1">
                      {
                        menuItems.map((menu, i) => (
                          menu === 'divider'
                            ? <div key={i} className="my-1 w-full h-px bg-gray-200" />
                            : <Menu.Item key={menu.id || menu.name}>
                              {({active}) => (
                                <button type="button"
                                        className={c(
                                          active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                                          'w-full flex px-4 py-2 text-sm space-x-2'
                                        )}
                                        onClick={() => menu.onClick(menu.id)}
                                >
                                  {menu.icon}
                                  <span>{menu.name}</span>
                                </button>
                              )}
                            </Menu.Item>
                        ))
                      }
                    </div>
                  </Menu.Items>
                </Transition>
              </>
            )}
          </Menu>
        </div>}
      </div>
    </header>
  )
}
