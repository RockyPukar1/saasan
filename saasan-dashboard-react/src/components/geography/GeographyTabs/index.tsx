import { MapPin, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import RenderTabularView from "@/components/geography/RenderTabularView";
import RenderPagination from "@/components/geography/RenderPagination";
import type { Dispatch, SetStateAction } from "react";
import type { EntityType } from "@/screens/GeographyScreen";

interface TabsProps {
  activeTab: EntityType;
  setActiveTab: Dispatch<SetStateAction<EntityType>>;
  pageSize: number;
}

interface TabularData {
  detailsPage: string;
  label: string;
  total: number;
  isLoading: boolean;
  tabData: any[];
  columns: { key: string; label: string }[];
  page: number;
  setPage: (page: number) => void;
}

interface IGeographyTabsProps {
  tabs: TabsProps;
  data: Partial<Record<EntityType, TabularData>>;
}

export default function GeographyTabs({
  tabs: { activeTab, setActiveTab, pageSize },
  data,
}: IGeographyTabsProps) {
  return (
    <>
      <Tabs
        value={activeTab}
        onValueChange={(value) => setActiveTab(value as EntityType)}
      >
        <TabsList className="grid w-full grid-cols-5">
          {Object.entries(data).map(([key, { label, total }]) => (
            <TabsTrigger value={key} className="flex items-center space-x-2">
              <MapPin className="h-4 w-4" />
              <span>
                {label} ({total})
              </span>
            </TabsTrigger>
          ))}
        </TabsList>
        {Object.entries(data).map(
          ([key, { isLoading, tabData, columns, detailsPage }]) => (
            <>
              <TabsContent value={key} key={key} className="space-y-4">
                {isLoading ? (
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-center">
                        <Loader2 className="h-6 w-6 animate-spin" />
                        <span className="ml-2">Loading provinces...</span>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <RenderTabularView
                    data={tabData}
                    columns={columns}
                    detailsPage={detailsPage}
                  />
                )}
              </TabsContent>
            </>
          ),
        )}
      </Tabs>
      <RenderPagination
        currentPage={data[activeTab]!.page}
        totalPages={Math.ceil(data[activeTab]!.total / pageSize)}
        onPageChange={(page) => {
          data[activeTab]!.setPage(page);
        }}
        totalItems={data[activeTab]!.total}
        pageSize={pageSize}
        itemName={activeTab}
      />
    </>
  );
}
