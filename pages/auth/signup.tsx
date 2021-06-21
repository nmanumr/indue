import React, {useState} from "react";
import {useForm} from "react-hook-form";
import FormInput from "components/FormInput";
import {signIn} from 'next-auth/client'
import {useRouter} from "next/router";
import Link from "next/link";

export default function SignUp() {
  const form = useForm({mode: 'onBlur'});
  const [apiError, setApiError] = useState<string>();
  const router = useRouter();

  const onSubmit = async (data: { name: string, email: string, password: string, password2?: string }) => {
    if (data.password !== data.password2) {
      form.setError('password2', {message: 'Password doesn\'t match.'});
      return;
    }

    delete data.password2;
    try {
      let response = await fetch('/api/auth/signup', {
        method: "POST",
        body: JSON.stringify(data),
        headers: {'Content-Type': 'application/json'}
      });

      if (response.status === 400) {
        return setApiError((await response.json()).message);
      }

      await signIn('credentials', { username: data.email, password: data.password });
      await router.push('/auth/signin');
    } catch (e) {
      console.log(e);
    }
  }

  return (
    <div className="flex h-full justify-center items-center">
      <form onSubmit={form.handleSubmit(onSubmit)}
            className="bg-white border border-gray-300 rounded-md px-4 py-6 sm:px-6 lg:px-8 sm:max-w-md sm:w-full">
        <div className="text-center">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Create new Account
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Or&nbsp;
            <Link href="/auth/signin">
              <a className="font-medium text-indigo-600 hover:text-indigo-500">Use existing Account</a>
            </Link>
          </p>
        </div>
        <div className="border-b border-gray-200 mt-4 -mx-4 sm:-mx-6 lg:-mx-8"/>
        <div className="pt-6 pb-2 space-y-5">

          <FormInput form={form} autoComplete="name" name="name" label="Your Name" type="text"
                     required={true} minLength={3}/>

          <FormInput form={form} autoComplete="email" name="email" label="Your Email" type="email"
                     required={true}/>

          <FormInput form={form} autoComplete="new-password" name="password" label="New Password" type="password"
                     required={true} minLength={5}/>

          <FormInput form={form} autoComplete="new-password" name="password2" label="Confirm Password" type="password"
                     required={true} minLength={5}/>


          {apiError && <p className="text-sm text-red-600">{apiError}</p>}

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
