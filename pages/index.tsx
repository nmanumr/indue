import React, {Fragment, useState} from "react";
import {Disclosure, Menu, Popover, Transition} from '@headlessui/react'
import {ChevronUpIcon, DotsVerticalIcon, XIcon} from '@heroicons/react/solid'
import {CalendarIcon} from '@heroicons/react/outline'
import c from 'classnames';
import {formatNumber} from "../src/utils";
import MonthSelector from "../components/monthSelector";
import {signIn, useSession} from "next-auth/client";

let data = {
  overview: {
    budgeted: 7568.31,
    spent: 3101.79,
    balance: 7702.31,
  },
  categories: [
    {
      name: 'Usual Expenses',
      overview: {
        budgeted: 5733.31,
        spent: 1521.799,
        balance: 7447.31,
      },
      children: [
        {
          name: 'Food',
          overview: {
            budgeted: 700,
            spent: 132,
            balance: 1305,
          },
        },
        {
          name: 'Restaurants',
          overview: {
            budgeted: 700,
            spent: 132,
            balance: 1305,
          },
        },
        {
          name: 'Entertainment',
          overview: {
            budgeted: 700,
            spent: 132,
            balance: 1305,
          },
        },
        {
          name: 'General',
          overview: {
            budgeted: 700,
            spent: 132,
            balance: 1305,
          },
        },
        {
          name: 'Medical',
          overview: {
            budgeted: 700,
            spent: 132,
            balance: 1305,
          },
        },
        {
          name: 'Savings',
          overview: {
            budgeted: 700,
            spent: 0,
            balance: 1305,
          },
        },
      ]
    },
    {
      name: 'Bills',
      overview: {
        budgeted: 5733.31,
        spent: 1521.799,
        balance: 7447.31,
      },
      children: [
        {
          name: 'Cell',
          overview: {
            budgeted: 700,
            spent: 132,
            balance: 1305,
          },
        },
        {
          name: 'Internet',
          overview: {
            budgeted: 700,
            spent: 132,
            balance: 1305,
          },
        },
        {
          name: 'Water',
          overview: {
            budgeted: 700,
            spent: 132,
            balance: 1305,
          },
        },
        {
          name: 'Power',
          overview: {
            budgeted: 700,
            spent: 132,
            balance: 1305,
          },
        },
      ]
    }
  ]
}

function Home() {
  let [months, setMonths] = useState(["2021-03"]);
  const [session, loading] = useSession()

  return (
    <div className="overflow-y-auto w-full">
      {
        !session
          ? <button onClick={() => signIn()}>Sign in</button>
          : ''
      }
      <header className="bg-white border-b border-gray-300">
        <div className="flex items-center max-w-screen-xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <h1 className="flex-grow text-lg font-medium leading-6 text-gray-900 sm:truncate">Home</h1>
          <div className="mt-4 flex sm:mt-0 sm:ml-4">
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

                  <Transition
                    show={open}
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items
                      static
                      className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
                    >
                      <div className="py-1">
                        <Menu.Item>
                          {({active}) => (
                            <button
                              type="button"
                              className={c(
                                active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                                'w-full flex justify-between px-4 py-2 text-sm'
                              )}
                              onClick={() => setMonths([...months, "2021-03"])}
                            >
                              <span>Add month</span>
                            </button>
                          )}
                        </Menu.Item>
                        <Menu.Item>
                          {({active}) => (
                            <a
                              href="#"
                              className={c(
                                active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                                'flex justify-between px-4 py-2 text-sm'
                              )}
                            >
                              <span>Dummy Option 2</span>
                            </a>
                          )}
                        </Menu.Item>
                        <Menu.Item>
                          {({active}) => (
                            <a
                              href="#"
                              className={c(
                                active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                                'flex justify-between px-4 py-2 text-sm'
                              )}
                            >
                              <span>Dummy Option 3</span>
                            </a>
                          )}
                        </Menu.Item>
                      </div>
                    </Menu.Items>
                  </Transition>
                </>
              )}
            </Menu>
          </div>
        </div>
      </header>

      <div className="overflow-x-auto w-full">
        <div className="px-4 py-4 mt-6 sm:px-6 lg:px-8 mx-auto w-min">
          <div className="border border-gray-300 rounded-md overflow-hidden bg-white">
            <div className={c("flex border-b border-gray-200", {"divide-x": months.length > 1})}>
              <div className="w-52"/>
              {months.map((month, i) => (
                <div key={i} className="w-[calc(24rem+1px)] flex flex-col items-end p-4 relative">
                  {
                    months.length > 1
                      ? <button
                        onClick={() => {
                          let _months = [...months];
                          _months.splice(i, 1);
                          setMonths(_months);
                        }}
                        className="absolute left-5 top-5 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-1 transition duration-100 focus:outline-none">
                        <XIcon className="w-5 h-5"/>
                      </button>
                      : ""}
                  <Popover className="relative">
                    <Popover.Button
                      className="flex items-center mt-2 py-1 px-2 cursor-pointer hover:border-solid border-b border-dashed border-gray-400 space-x-4">
                      <div className="text-xl leading-6 font-medium text-gray-900 flex">
                        May 2021
                      </div>
                      <CalendarIcon className="w-5 h-5 text-gray-500"/>
                    </Popover.Button>
                    <Popover.Panel className="absolute z-10 right-0 top-0">
                      <MonthSelector/>
                    </Popover.Panel>
                  </Popover>
                  <div className="grid mt-2" style={{gridTemplateColumns: '1fr auto'}}>
                    <div
                      className="font-medium text-right text-xs text-gray-400 uppercase tracking-wider py-1.5 pr-4">BUDGETED
                    </div>
                    <div className="font-medium text-right text-gray-600">{formatNumber(data.overview.budgeted)}</div>

                    <div
                      className="font-medium text-right text-xs text-gray-400 uppercase tracking-wider py-1.5 pr-4">Spent
                    </div>
                    <div className="font-medium text-right text-gray-600">{formatNumber(data.overview.spent)}</div>

                    <div
                      className="font-medium text-right text-xs text-gray-400 uppercase tracking-wider py-1.5 pr-4">Balance
                    </div>
                    <div className="font-medium text-right text-gray-600">{formatNumber(data.overview.balance)}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="divide-y divide-gray-200">
              <div className={c("flex items-center", {"divide-x": months.length > 1})}>
                <div className="w-52 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </div>
                {months.map((month, i) => (
                  <div key={i} className="flex items-center">
                    <div className="w-32 px-4 py-3 text-left text-right text-xs">
                      <span className="font-medium text-gray-500 uppercase tracking-wider">Budgeted</span>
                      <br/>
                      <span className="font-medium text-gray-700">{formatNumber(data.overview.budgeted)}</span>
                    </div>
                    <div className="w-32 px-4 py-3 text-left text-right text-xs">
                      <span className="font-medium text-gray-500 uppercase tracking-wider">Spent</span>
                      <br/>
                      <span className="font-medium text-gray-700">{formatNumber(data.overview.spent)}</span>
                    </div>
                    <div className="w-32 px-4 py-3 text-left text-right text-xs">
                      <span className="font-medium text-gray-500 uppercase tracking-wider">Balance</span>
                      <br/>
                      <span className="font-medium text-gray-700">{formatNumber(data.overview.balance)}</span>
                    </div>
                  </div>
                ))}
              </div>
              {data.categories.map((category, i) => {
                return <Disclosure key={i} defaultOpen={true}>
                  {({open}) => (
                    <>
                      <div className={c("flex items-center bg-gray-100", {"divide-x": months.length > 1})}>
                        <div
                          className="flex items-center w-52 px-4 py-2 whitespace-nowrap text-sm text-gray-900 flex items-center">
                          <Disclosure.Button>
                            <ChevronUpIcon
                              className={`${
                                open ? '' : 'transform rotate-180'
                              } w-5 h-5 transition-all duration-200`}
                            />
                          </Disclosure.Button>
                          <span className="ml-2">{category.name}</span>
                        </div>
                        {months.map((month, i) => (
                          <div key={i} className="flex items-center">
                            <div className="w-32 px-4 py-2 whitespace-nowrap text-sm text-gray-500 text-right">
                              {formatNumber(category.overview.budgeted)}
                            </div>
                            <div className="w-32 px-4 py-2 whitespace-nowrap text-sm text-gray-500 text-right">
                              {formatNumber(category.overview.spent)}
                            </div>
                            <div className="w-32 px-4 py-2 whitespace-nowrap text-sm text-gray-500 text-right">
                              {formatNumber(category.overview.balance)}
                            </div>
                          </div>
                        ))}
                      </div>
                      <Disclosure.Panel className="divide-y divide-gray-200">
                        {category.children.map((subcategory, i2) => (
                          <div key={i2} className={c("flex items-center", {"divide-x": months.length > 1})}>
                            <div
                              className="w-52 pl-8 pr-4 py-2 whitespace-nowrap text-sm text-gray-900 flex items-center">
                              {subcategory.name}
                            </div>
                            {months.map((month, i3) => (
                              <div key={i3} className="flex items-center">
                                <div className="w-32 px-4 py-2 whitespace-nowrap text-sm text-gray-500 text-right">
                                  {formatNumber(subcategory.overview.budgeted)}
                                </div>
                                <div className="w-32 px-4 py-2 whitespace-nowrap text-sm text-gray-500 text-right">
                                  {formatNumber(subcategory.overview.spent)}
                                </div>
                                <div className="w-32 px-4 py-2 whitespace-nowrap text-sm text-gray-500 text-right">
                                  {formatNumber(subcategory.overview.balance)}
                                </div>
                              </div>
                            ))}
                          </div>
                        ))}
                      </Disclosure.Panel>
                    </>
                  )}
                </Disclosure>
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

Home.hasSidebar = true;

export default Home;
