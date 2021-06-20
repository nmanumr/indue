import React, {useState} from "react";
import Header from "components/Header";
import Table from "components/Table";
import CreateEditModel from "components/CreateEditModel";
import FormInput from "components/FormInput";

export default function TransactionsList() {
  // const [openModel, CreateEditModel] = useCreateEditModel('/api/transactions');

  const [isOpen, setOpenState] = useState<boolean>(false);

  function openModel(id?: string, data?: Record<string, any>) {
    setOpenState(true);
  }

  return (
    <div>
      <Header title="Transactions"/>

      <CreateEditModel isOpen={isOpen} onClose={() => setOpenState(false)} baseUrl="/api/transactions" title="Transactions">
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
