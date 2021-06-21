import React, {useState} from "react";
import Header from "components/Header";
import Table from "components/Table";
import CreateEditModel from "components/CreateEditModel";
import FormInput from "components/FormInput";
import {signOut, useSession} from "next-auth/client";
import {useRouter} from "next/router";
import {LogoutIcon} from "@heroicons/react/outline";

export default function TransactionsList() {
  const [session, loading] = useSession();
  const router = useRouter();
  if (loading) return null;
  if (!loading && !session) {
    router.replace('/auth/signin').then();
    return null;
  }
  // const [openModel, CreateEditModel] = useCreateEditModel('/api/transactions');

  const [isOpen, setOpenState] = useState<boolean>(false);

  function openModel(id?: string, data?: Record<string, any>) {
    setOpenState(true);
  }

  return (
    <div>
      <Header title="Transactions" menuItems={['divider', {
        name: 'Sign Out',
        icon: <LogoutIcon className="h-5 w-5 opacity-90"/>,
        onClick: () => signOut({callbackUrl: '/auth/signin'}),
      }]}/>

      <CreateEditModel isOpen={isOpen} onClose={() => setOpenState(false)} baseUrl="/api/transactions"
                       title="Transactions">
        {(form, isEditMode) => (
          <>
            <FormInput form={form} name="wallet" label="Wallet" type="text"
                       required={true}/>

            <FormInput form={form} name="category" label="Category" type="text"
                       required={true}/>

            <FormInput form={form} name="amount" label="Amount" type="number"
                       required={true}/>
          </>
        )}
      </CreateEditModel>

      <div className="flex-grow px-4 sm:px-6 lg:px-8 max-w-screen-xl mx-auto w-full py-10">
        <Table
          onNewClicked={() => openModel()}
          data={[]}
          columns={[
            {key: "date", title: 'Date'},
            {key: "amount", title: 'Amount'},
            {key: "account", title: 'Account'},
            {key: "category", title: 'Category'},
          ]}
        />
      </div>
    </div>
  )
}

TransactionsList.hasSidebar = true;
