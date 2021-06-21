import React, {useState} from "react";
import Header from "components/Header";
import Table from "components/Table";
import CreateEditModel from "components/CreateEditModel";
import FormInput from "components/FormInput";
import {signOut, useSession} from "next-auth/client";
import {useRouter} from "next/router";
import {LogoutIcon} from "@heroicons/react/outline";
import useSWR from "swr";
import {CategoryDocument, TransactionDocument, WalletDocument} from "../../models";

export default function TransactionsList() {
  const {data: wallets} = useSWR<WalletDocument[]>('/api/wallets');
  const {data: categories} = useSWR<CategoryDocument[]>('/api/categories');
  const {data: transactions} = useSWR<TransactionDocument[]>('/api/transactions');

  const [isOpen, setOpenState] = useState<boolean>(false);
  const [session, loading] = useSession();
  const router = useRouter();

  if (loading) return null;
  if (!loading && !session) {
    router.replace('/auth/signin').then();
    return null;
  }

  function openModel(id?: string, data?: Record<string, any>) {
    setOpenState(true);
  }

  return (
    <div>
      <Header title="Transactions" menuItems={[{
        name: 'Sign Out',
        icon: <LogoutIcon className="h-5 w-5 opacity-90"/>,
        onClick: () => signOut({callbackUrl: '/auth/signin'}),
      }]}/>

      <CreateEditModel isOpen={isOpen} onClose={() => setOpenState(false)} baseUrl="/api/transactions"
                       title="Transactions">
        {(form, isEditMode) => (
          <>
            <FormInput form={form} name="type" label="Transaction Type" type="select" required={true}>
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </FormInput>

            <FormInput form={form} name="wallet" label="Wallet" type="select" required={true}>
              {wallets?.map((wallet) => (
                <option key={wallet._id} value={wallet._id}>{wallet.name}</option>
              ))}
            </FormInput>

            <FormInput form={form} name="category" label="Category" type="select" required={true}>
              {categories?.map((category) => (
                <optgroup key={category._id} label={category.name}>
                  {category.subCategories.map((sc) => (
                    <option key={category._id + sc} value={`${category._id}/${sc}`}>{sc}</option>
                  ))}
                </optgroup>
              ))}
            </FormInput>

            <FormInput form={form} name="amount" label="Amount" type="number"
                       required={true}/>
          </>
        )}
      </CreateEditModel>

      <div className="flex-grow px-4 sm:px-6 lg:px-8 max-w-screen-xl mx-auto w-full py-10">
        {transactions && <Table
          onNewClicked={() => openModel()}
          data={transactions}
          columns={[
            {key: "createdAt", title: 'Date', render: (data) => new Intl.DateTimeFormat('en-GB', { dateStyle: 'medium', timeStyle: 'short', hour12: true }).format(new Date(data))},
            {key: "amount", title: 'Amount'},
            {key: "wallet", title: 'Account', render: (data, row) => row.wallet.name},
            {key: "category", title: 'Category', render: (data, row) => `${data.name} / ${row.subCategory}`},
          ]}
        />}
      </div>
    </div>
  )
}

TransactionsList.hasSidebar = true;
