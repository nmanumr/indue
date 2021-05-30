import React from "react";
import { useForm } from "react-hook-form";

export default function SignUp() {
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const onSubmit = (data: any) => console.log(data);

  return (
    <div className="flex h-full justify-center items-center">
      <form onSubmit={handleSubmit(onSubmit)}
            className="bg-white border border-gray-300 rounded-md px-4 py-6 sm:px-6 lg:px-8 sm:max-w-md sm:w-full">
        <div className="text-center">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Create new Account
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Enter your details to create a new account
          </p>
        </div>
        <div className="border-b border-gray-200 mt-4 -mx-4 sm:-mx-6 lg:-mx-8" />
        <div className="pt-6 pb-2 space-y-5">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Your Name
            </label>
            <div className="mt-1">
              <input id="name" type="text" autoComplete="name"
                     {...register("name", {required: true, minLength: 3})}
                     className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
            </div>
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Your Email
            </label>
            <div className="mt-1">
              <input id="email" type="email" autoComplete="email"
                     {...register("email", {required: true})}
                     className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              New Password
            </label>
            <div className="mt-1">
              <input id="password" type="password" autoComplete="new-password"
                     {...register("password", {required: true, minLength: 5, maxLength: 26})}
                     className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
            </div>
          </div>

          <div>
            <label htmlFor="password2" className="block text-sm font-medium text-gray-700">
              Confirm Password
            </label>
            <div className="mt-1">
              <input id="password2" type="password" autoComplete="new-password"
                     {...register("password2", {required: true, minLength: 5, maxLength: 26})}
                     className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
            </div>
          </div>

          <div className="pt-2">
            <button type="submit"
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              Sign Up
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}
