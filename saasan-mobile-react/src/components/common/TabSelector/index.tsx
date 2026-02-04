import type { Dispatch, SetStateAction } from "react";

interface ITabSelector<TSetActiveTab> {
  activeTab: string;
  setActiveTab: Dispatch<SetStateAction<TSetActiveTab>>;
  tabs: {
    label: string;
    value: string;
  }[];
}

export default function TabSelector<TSetActiveTab>({ activeTab, setActiveTab, tabs }: ITabSelector<TSetActiveTab>) {
  return (
    <div className="bg-white border-b border-gray-200">
      <div className="flex px-4 py-2">
        {tabs.map((tab) => (
          <div
            onClick={() => setActiveTab(tab.value as TSetActiveTab)}
            className={`bg-white flex-1 py-3 flex items-center justify-center border-b-2 ${
              activeTab === tab.value ? "border-red-600" : "border-transparent"
            }`}
          >
            <p
              className={`font-bold ${
                activeTab === tab.value ? "text-red-600" : "text-gray-600"
              }`}
            >
              {tab.label}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}