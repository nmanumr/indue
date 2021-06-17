import React from "react";
import Header from "../../components/Header";
import {useForm} from "react-hook-form";
import FormInput from "components/FormInput";

export default function WalletEdit() {
  const form = useForm({mode: 'onBlur'});

  return (
    <div className="flex flex-col h-full">
      <Header title="Edit Wallet" />

      <div className="flex-grow px-4 sm:px-6 lg:px-8 max-w-screen-xl mx-auto w-full py-10">
        <div className="gap-5 max-w-32 max-w-2xl grid grid-cols-2">
          <div className="col-span-2">
            <FormInput form={form} autoComplete="name" name="name" label="Your Name" type="text"
                       required={true} minLength={3}/>
          </div>
        </div>
      </div>
    </div>
  );
}

WalletEdit.hasSidebar = true;
