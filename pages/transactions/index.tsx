import React from "react";
import Header from "components/Header";
import Table from "components/Table";

export default function TransactionsList() {
  return (
    <div>
      <Header title="Transactions"/>

      <div className="flex-grow px-4 sm:px-6 lg:px-8 max-w-screen-xl mx-auto w-full py-10">
        <Table
          onNewClicked={() => {
          }}
          onEditClicked={() => {
          }}
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
