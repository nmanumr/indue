import React from "react";
import {PencilIcon, PlusIcon} from "@heroicons/react/solid";

interface Props<T = any> {
  columns: { title: JSX.Element | string, key: string, render?: (text: any, row: any) => string | JSX.Element }[];
  data: T[];
  newButton?: string | JSX.Element;
  onNewClicked?: () => void;
  onEditClicked?: (id: string) => void;
}

export default function Table({columns, newButton, data, onNewClicked, onEditClicked}: Props) {
  return (
    <div className="flex flex-col">
      <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
          <div className="border border-gray-300 bg-white overflow-hidden sm:rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
              <tr className="bg-gray-100">
                {columns.map((col) => (
                  <th key={col.key} scope="col"
                      className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >{col.title}</th>
                ))}

                {onEditClicked && <td className="relative px-4 py-3 w-0"><span className="sr-only">Edit</span></td>}
              </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
              {data.map((row, i) => (
                <tr key={row._id ?? i}>
                  {columns.map((col, j) => (
                    <td key={col.key}
                        className={"px-4 py-3 text-sm " + (j === 0 ? 'font-medium text-gray-900' : 'text-gray-500')}>
                      {col.render ? col.render(row[col.key], row) : row[col.key]}
                    </td>
                  ))}
                  {
                    onEditClicked &&
                    <td className="px-4 py-3 whitespace-nowrap text-right w-0">
                      <button type="button" aria-haspopup="true" onClick={() => onEditClicked(row._id)}
                              className="-my-2 p-2 rounded flex items-center text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-600">
                        <span className="sr-only">Edit</span>
                        <PencilIcon className="h-5 w-5"/>
                      </button>
                    </td>
                  }
                </tr>
              ))}
              {onNewClicked && <tr>
                <td colSpan={3} className="px-4 py-2 text-sm font-medium">
                  <button onClick={onNewClicked}
                          className="flex text-indigo-500 hover:text-indigo-700 py-0.5 pl-1 pr-2.5">
                    <PlusIcon className="h-5 w-5 opacity-90"/>
                    <span className="ml-2">{newButton ?? "Add New"}</span>
                  </button>
                </td>
              </tr>}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
