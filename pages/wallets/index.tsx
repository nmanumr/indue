import React from "react";
import useSWR from "swr";
import {WalletDocument} from "models";
import Header from "components/Header";
import FormInput from "components/FormInput";
import Table from "components/Table";
import useCreateEditModel from "components/CreateEditModel";
import {formatNumber} from "src/utils";


export default function WalletsList() {
  const {data: wallets} = useSWR<WalletDocument[]>('/api/wallets');
  const [openModel, CreateEditModel] = useCreateEditModel('/api/wallets');

  return (
    <div className="flex flex-col h-full">
      <Header title="Accounts"/>

      <CreateEditModel title="Transactions">
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
            onEditClicked={(id) => openModel(id, {name: wallets?.find((w) => w._id === id)?.name})}
            onNewClicked={() => openModel()}
            data={wallets}
            columns={[
              {
                key: "name",
                title: 'Name'
              },
              {
                key: "balance",
                title: 'Balance',
                render: () => formatNumber(10000.23)
              },
            ]}
        />}
      </div>
    </div>
  )
}

WalletsList.hasSidebar = true;
