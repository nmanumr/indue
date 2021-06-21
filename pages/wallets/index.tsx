import React, {useState} from "react";
import useSWR from "swr";
import {WalletDocument} from "models";
import Header from "components/Header";
import FormInput from "components/FormInput";
import Table from "components/Table";
import CreateEditModel from "components/CreateEditModel";
import {formatNumber} from "src/utils";
import {signOut, useSession} from "next-auth/client";
import {useRouter} from "next/router";
import {LogoutIcon} from "@heroicons/react/outline";


export default function WalletsList() {
  const {data: wallets} = useSWR<WalletDocument[]>('/api/wallets');
  const [isOpen, setOpenState] = useState<boolean>(false);
  const [selectedId, setSelectedId] = useState<string>();
  const [session, loading] = useSession();
  const router = useRouter();


  if (loading) return null;
  if (!loading && !session) {
    router.replace('/auth/signin').then();
    return null;
  }

  function openModel(id?: string) {
    setSelectedId(id);
    setOpenState(true);
  }

  function closeModel() {
    setOpenState(false);
    setSelectedId(undefined);
  }

  return (
    <div className="flex flex-col h-full">
      <Header title="Accounts" menuItems={[{
        name: 'Sign Out',
        icon: <LogoutIcon className="h-5 w-5 opacity-90"/>,
        onClick: () => signOut({callbackUrl: '/auth/signin'}),
      }]}/>

      <CreateEditModel
        baseUrl="/api/wallets"
        isOpen={isOpen} onClose={closeModel}
        id={selectedId}
        data={selectedId ? {name: wallets?.find((w) => w._id === selectedId)?.name} : undefined}
        title="Transactions"
      >
        {(form, isEditMode) => (
          <>
            <FormInput form={form} name="name" label="Account Name" type="text"
                       required={true} minLength={3}/>

            {!isEditMode && <FormInput form={form} name="initialBalance" label="Initial Balance" type="number"
                                       required={true}/>}
          </>
        )}
      </CreateEditModel>

      <div className="flex-grow px-4 sm:px-6 lg:px-8 max-w-screen-xl mx-auto w-full py-10">
        {wallets && <Table
            onEditClicked={(id) => openModel(id)}
            onNewClicked={() => openModel()}
            data={wallets}
            columns={[
              {
                key: "name",
                title: 'Name'
              },
              {
                key: "amount",
                title: 'Balance',
                render: (data) => formatNumber(data)
              },
            ]}
        />}
      </div>
    </div>
  )
}

WalletsList.hasSidebar = true;
