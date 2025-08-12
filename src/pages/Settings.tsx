import React, { useState } from "react";
import { SearchInput } from "../components/ui/SearchInput";

import { Transaction } from "../types";
import { Settings_Profiles } from "./Settings_Profiles";
import { Settings_Notifications } from "./Settings_Notifications";

type SettingsTab = "Profile" | "Notifications" | "Payments" | "Security";

export const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState<SettingsTab>("Profile");
  const [searchQuery, setSearchQuery] = useState("");

  const [transactions] = useState<Transaction[]>([
    {
      id: "1",
      date: "May 15, 2023",
      description: "Website Redesign Project",
      amount: 750.0,
      status: "completed",
    },
    {
      id: "2",
      date: "May 8, 2023",
      description: "Social Media Graphics",
      amount: 350.0,
      status: "completed",
    },
    {
      id: "3",
      date: "May 15, 2023",
      description: "Blog Content Creation",
      amount: -1200.0,
      status: "processed",
    },
    {
      id: "4",
      date: "May 1, 2023",
      description: "Product Promo Video",
      amount: 450.0,
      status: "completed",
    },
  ]);


  const tabs: SettingsTab[] = [
    "Profile",
    "Notifications",
    "Payments",
    "Security",
  ];



  const getTransactionStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
            Completed
          </span>
        );
      case "processed":
        return (
          <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
            Processed
          </span>
        );
      default:
        return (
          <span className="px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded-full">
            Pending
          </span>
        );
    }
  };

  return (
    <div className="flex flex-col gap-8 p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
            Settings
          </h1>
          <p className="text-gray-600">
            Manage your account preferences and settings
          </p>
        </div>
        <SearchInput
          placeholder="Search jobs, formats, keywords..."
          value={searchQuery}
          onChange={setSearchQuery}
          className="w-full lg:w-80"
        />
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl p-2">
        <div className="flex gap-1">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`relative px-5 py-3 text-lg font-medium rounded-xl transition-all ${
                activeTab === tab
                  ? "text-purple-600 font-bold"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab}
              {activeTab === tab && (
                <div className="absolute inset-0 rounded-xl border-2 border-purple-600 -m-0.5"></div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Profile Tab Content */}
      {activeTab === "Profile" && <Settings_Profiles />}

      {/* Notifications Tab Content */}
      {activeTab === "Notifications" && <Settings_Notifications/>  
      }

      {/* Recent Transactions */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium text-gray-900">
              Recent Transactions
            </h2>
            <button className="text-purple-600 hover:text-purple-700 font-medium">
              View all transactions
            </button>
          </div>

          {/* Transactions Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                    Date
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                    Description
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                    Amount
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {transactions.map((transaction) => (
                  <tr key={transaction.id}>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {transaction.date}
                    </td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">
                      {transaction.description}
                    </td>
                    <td
                      className={`px-4 py-3 text-sm font-medium ${
                        transaction.amount > 0
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {transaction.amount > 0 ? "+" : ""}$
                      {Math.abs(transaction.amount).toFixed(2)}
                    </td>
                    <td className="px-4 py-3">
                      {getTransactionStatusBadge(transaction.status)}
                    </td>
                    <td className="px-4 py-3">
                      <button className="text-gray-600 hover:text-gray-800">
                        <svg
                          className="w-6 h-6"
                          viewBox="0 0 24 24"
                          fill="none"
                        >
                          <path
                            d="M15.8798 12.43L12.5298 15.78C12.2398 16.07 11.7598 16.07 11.4698 15.78L8.11984 12.43C7.82984 12.14 7.82984 11.66 8.11984 11.37C8.40984 11.08 8.88984 11.08 9.17984 11.37L11.2498 13.44V2.75C11.2498 2.34 11.5898 2 11.9998 2C12.4098 2 12.7498 2.34 12.7498 2.75V13.44L14.8198 11.37C14.9698 11.22 15.1598 11.15 15.3498 11.15C15.5398 11.15 15.7298 11.22 15.8798 11.37C16.1798 11.66 16.1798 12.13 15.8798 12.43Z"
                            fill="currentColor"
                          />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
