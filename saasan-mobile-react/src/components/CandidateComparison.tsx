import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Vote,
  ChevronRight,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { useBilingual } from "@/hooks/useBilingual";
import {
  campaignApi,
  type ElectionCandidate as Candidate,
} from "@/services/campaignApi";

interface CandidateComparisonProps {
  constituencyId: number;
  electionType?: "federal" | "provincial";
}

export default function CandidateComparison({
  constituencyId,
  electionType = "federal",
}: CandidateComparisonProps) {
  const { getText } = useBilingual();
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [selectedCandidates, setSelectedCandidates] = useState<{
    candidate1: Candidate | null;
    candidate2: Candidate | null;
  }>({
    candidate1: null,
    candidate2: null,
  });
  const [showComparison, setShowComparison] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCandidates();
  }, [constituencyId, electionType]);

  const loadCandidates = async () => {
    try {
      setLoading(true);
      const candidatesData = await campaignApi.getCandidatesByConstituency(
        constituencyId,
        electionType
      );
      setCandidates(candidatesData);
    } catch (error) {
      console.error("Error loading candidates:", error);
      // Alert.alert(
      //   getText("त्रुटि", "Error"),
      //   getText("उम्मेदवारहरू लोड गर्न असफल।", "Failed to load candidates.")
      // );
    } finally {
      setLoading(false);
    }
  };

  const selectCandidate = (
    candidate: Candidate,
    position: "candidate1" | "candidate2"
  ) => {
    setSelectedCandidates((prev) => ({
      ...prev,
      [position]: candidate,
    }));
  };

  const startComparison = () => {
    if (selectedCandidates.candidate1 && selectedCandidates.candidate2) {
      setShowComparison(true);
    } else {
      // Alert.alert(
      //   getText("चयन अपूर्ण", "Selection Incomplete"),
      //   getText(
      //     "कृपया तुलना गर्नका लागि दुई उम्मेदवार चयन गर्नुहोस्।",
      //     "Please select two candidates to compare."
      //   )
      // );
    }
  };

  const CandidateCard = ({
    candidate,
    onSelect,
    isSelected,
  }: {
    candidate: Candidate;
    onSelect: () => void;
    isSelected: boolean;
  }) => (
    <Button onClick={onSelect}>
      <Card
        className={`p-4 mb-3 ${isSelected ? "border-blue-500 bg-blue-50" : ""}`}
      >
        <div className="flex-row items-start gap-3">
          {/* <Image
            source={{
              uri: candidate.photoUrl || "https://via.placeholder.com/60",
            }}
            className="w-15 h-15 rounded-full"
          /> */}

          <div className="flex-1">
            <div className="flex-row items-center gap-2 mb-1">
              <p className="text-lg font-bold text-gray-900">
                {getText(
                  candidate.fullNameNepali || candidate.fullName,
                  candidate.fullName
                )}
              </p>
              {isSelected && <CheckCircle size={20} color="#3b82f6" />}
            </div>

            <div className="flex-row items-center gap-2 mb-2">
              <Badge className="bg-blue-100 text-blue-800">
                #{candidate.candidateNumber}
              </Badge>
              <Badge className="bg-green-100 text-green-800">
                {getText(
                  candidate.symbolNepali || candidate.symbol || "",
                  candidate.symbol || ""
                )}
              </Badge>
            </div>

            <p className="text-sm text-gray-600 mb-1">
              {getText(
                candidate.party.nameNepali || candidate.party.name,
                candidate.party.name
              )}
            </p>

            <p className="text-sm text-gray-500">
              {candidate.age} {getText("वर्ष", "years old")}
            </p>

            <div className="flex-row items-center gap-1 mt-2">
              <Vote size={14} color="#6b7280" />
              <p className="text-sm text-gray-600">
                {candidate.voteCount.toLocaleString()} {getText("मत", "votes")}
              </p>
            </div>
          </div>
        </div>
      </Card>
    </Button>
  );

  // const ComparisonModal = () => (
  //   <Modal
  //     visible={showComparison}
  //     animationType="slide"
  //     presentationStyle="pageSheet"
  //   >
  //     <div className="flex-1 bg-white">
  //       {/* Header */}
  //       <div className="flex-row items-center justify-between p-4 border-b border-gray-200">
  //         <p className="text-xl font-bold text-gray-900">
  //           {getText("उम्मेदवार तुलना", "Candidate Comparison")}
  //         </p>
  //         <Button onPress={() => setShowComparison(false)}>
  //           <XCircle size={24} color="#6b7280" />
  //         </Button>
  //       </div>

  //       <div className="flex-1 p-4">
  //         {/* Basic Info Comparison */}
  //         <Card className="p-4 mb-4">
  //           <p className="text-lg font-semibold text-gray-900 mb-3">
  //             {getText("मूल जानकारी", "Basic Information")}
  //           </p>

  //           <div className="space-y-4">
  //             {/* Names */}
  //             <div className="flex-row gap-4">
  //               <div className="flex-1">
  //                 <p className="text-sm font-medium text-gray-600 mb-1">
  //                   {getText("नाम", "Name")}
  //                 </p>
  //                 <p className="text-base font-semibold text-gray-900">
  //                   {getText(
  //                     selectedCandidates.candidate1?.fullNameNepali ||
  //                       selectedCandidates.candidate1?.fullName ||
  //                       "",
  //                     selectedCandidates.candidate1?.fullName || ""
  //                   )}
  //                 </p>
  //               </div>
  //               <div className="flex-1">
  //                 <p className="text-sm font-medium text-gray-600 mb-1">
  //                   {getText("नाम", "Name")}
  //                 </p>
  //                 <p className="text-base font-semibold text-gray-900">
  //                   {getText(
  //                     selectedCandidates.candidate2?.fullNameNepali ||
  //                       selectedCandidates.candidate2?.fullName ||
  //                       "",
  //                     selectedCandidates.candidate2?.fullName || ""
  //                   )}
  //                 </p>
  //               </div>
  //             </div>

  //             {/* Age */}
  //             <div className="flex-row gap-4">
  //               <div className="flex-1">
  //                 <p className="text-sm font-medium text-gray-600 mb-1">
  //                   {getText("उमेर", "Age")}
  //                 </p>
  //                 <p className="text-base text-gray-900">
  //                   {selectedCandidates.candidate1?.age}{" "}
  //                   {getText("वर्ष", "years")}
  //                 </p>
  //               </div>
  //               <div className="flex-1">
  //                 <p className="text-sm font-medium text-gray-600 mb-1">
  //                   {getText("उमेर", "Age")}
  //                 </p>
  //                 <p className="text-base text-gray-900">
  //                   {selectedCandidates.candidate2?.age}{" "}
  //                   {getText("वर्ष", "years")}
  //                 </p>
  //               </div>
  //             </div>

  //             {/* Party */}
  //             <div className="flex-row gap-4">
  //               <div className="flex-1">
  //                 <p className="text-sm font-medium text-gray-600 mb-1">
  //                   {getText("दल", "Party")}
  //                 </p>
  //                 <p className="text-base text-gray-900">
  //                   {getText(
  //                     selectedCandidates.candidate1?.party.nameNepali ||
  //                       selectedCandidates.candidate1?.party.name ||
  //                       "",
  //                     selectedCandidates.candidate1?.party.name || ""
  //                   )}
  //                 </p>
  //               </div>
  //               <div className="flex-1">
  //                 <p className="text-sm font-medium text-gray-600 mb-1">
  //                   {getText("दल", "Party")}
  //                 </p>
  //                 <p className="text-base text-gray-900">
  //                   {getText(
  //                     selectedCandidates.candidate2?.party.nameNepali ||
  //                       selectedCandidates.candidate2?.party.name ||
  //                       "",
  //                     selectedCandidates.candidate2?.party.name || ""
  //                   )}
  //                 </p>
  //               </div>
  //             </div>

  //             {/* Vote Count */}
  //             <div className="flex-row gap-4">
  //               <div className="flex-1">
  //                 <p className="text-sm font-medium text-gray-600 mb-1">
  //                   {getText("मत गणना", "Vote Count")}
  //                 </p>
  //                 <p className="text-base font-semibold text-blue-600">
  //                   {selectedCandidates.candidate1?.voteCount.toLocaleString()}
  //                 </p>
  //               </div>
  //               <div className="flex-1">
  //                 <p className="text-sm font-medium text-gray-600 mb-1">
  //                   {getText("मत गणना", "Vote Count")}
  //                 </p>
  //                 <p className="text-base font-semibold text-blue-600">
  //                   {selectedCandidates.candidate2?.voteCount.toLocaleString()}
  //                 </p>
  //               </div>
  //             </div>
  //           </div>
  //         </Card>

  //         {/* Education Comparison */}
  //         <Card className="p-4 mb-4">
  //           <p className="text-lg font-semibold text-gray-900 mb-3">
  //             {getText("शिक्षा", "Education")}
  //           </p>

  //           <div className="space-y-3">
  //             <div className="flex-row gap-4">
  //               <div className="flex-1">
  //                 <p className="text-base text-gray-900">
  //                   {getText(
  //                     selectedCandidates.candidate1
  //                       ?.educationBackgroundNepali ||
  //                       selectedCandidates.candidate1?.educationBackground ||
  //                       "",
  //                     selectedCandidates.candidate1?.educationBackground || ""
  //                   )}
  //                 </p>
  //               </div>
  //               <div className="flex-1">
  //                 <p className="text-base text-gray-900">
  //                   {getText(
  //                     selectedCandidates.candidate2
  //                       ?.educationBackgroundNepali ||
  //                       selectedCandidates.candidate2?.educationBackground ||
  //                       "",
  //                     selectedCandidates.candidate2?.educationBackground || ""
  //                   )}
  //                 </p>
  //               </div>
  //             </div>
  //           </div>
  //         </Card>

  //         {/* Key Promises Comparison */}
  //         <Card className="p-4 mb-4">
  //           <p className="text-lg font-semibold text-gray-900 mb-3">
  //             {getText("मुख्य वादा", "Key Promises")}
  //           </p>

  //           <div className="space-y-4">
  //             {selectedCandidates.candidate1?.keyPromises?.map(
  //               (promise: any, index: number) => (
  //                 <div key={index} className="flex-row gap-4">
  //                   <div className="flex-1">
  //                     <div className="flex-row items-start gap-2">
  //                       <CheckCircle
  //                         size={16}
  //                         color="#10b981"
  //                         className="mt-1"
  //                       />
  //                       <p className="text-sm text-gray-900 flex-1">
  //                         {getText(
  //                           selectedCandidates.candidate1?.keyPromisesNepali?.[
  //                             index
  //                           ] || promise,
  //                           promise
  //                         )}
  //                       </p>
  //                     </div>
  //                   </div>
  //                   <div className="flex-1">
  //                     <p className="text-sm text-gray-900">
  //                       {selectedCandidates.candidate2?.keyPromises?.[index] ? (
  //                         getText(
  //                           selectedCandidates.candidate2?.keyPromisesNepali?.[
  //                             index
  //                           ] ||
  //                             selectedCandidates.candidate2?.keyPromises?.[
  //                               index
  //                             ] ||
  //                             "",
  //                           selectedCandidates.candidate2?.keyPromises?.[
  //                             index
  //                           ] || ""
  //                         )
  //                       ) : (
  //                         <p className="text-gray-400">-</p>
  //                       )}
  //                     </p>
  //                   </div>
  //                 </div>
  //               )
  //             )}
  //           </div>
  //         </Card>

  //         {/* Professional Experience */}
  //         <Card className="p-4">
  //           <p className="text-lg font-semibold text-gray-900 mb-3">
  //             {getText("व्यावसायिक अनुभव", "Professional Experience")}
  //           </p>

  //           <div className="flex-row gap-4">
  //             <div className="flex-1">
  //               <p className="text-base text-gray-900">
  //                 {getText(
  //                   selectedCandidates.candidate1
  //                     ?.professionalExperienceNepali ||
  //                     selectedCandidates.candidate1?.professionalExperience ||
  //                     "",
  //                   selectedCandidates.candidate1?.professionalExperience || ""
  //                 )}
  //               </p>
  //             </div>
  //             <div className="flex-1">
  //               <p className="text-base text-gray-900">
  //                 {getText(
  //                   selectedCandidates.candidate2
  //                     ?.professionalExperienceNepali ||
  //                     selectedCandidates.candidate2?.professionalExperience ||
  //                     "",
  //                   selectedCandidates.candidate2?.professionalExperience || ""
  //                 )}
  //               </p>
  //             </div>
  //           </div>
  //         </Card>
  //       </div>
  //     </div>
  //   </Modal>
  // );

  if (loading) {
    return (
      <div className="flex-1 justify-center items-center">
        <p className="text-gray-600">
          {getText("लोड हुँदै...", "Loading...")}
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-gray-50">
      <div className="flex-1 p-4">
        <p className="text-xl font-bold text-gray-900 mb-4">
          {getText("उम्मेदवार चयन", "Select Candidates")}
        </p>

        <p className="text-gray-600 mb-4">
          {getText(
            "तुलना गर्नका लागि दुई उम्मेदवार चयन गर्नुहोस्",
            "Select two candidates to compare"
          )}
        </p>

        {/* Candidate Selection */}
        <div className="mb-6">
          <p className="text-lg font-semibold text-gray-900 mb-3">
            {getText("उम्मेदवारहरू", "Candidates")}
          </p>

          {candidates.map((candidate) => (
            <CandidateCard
              key={candidate.id}
              candidate={candidate}
              onSelect={() => {
                if (selectedCandidates.candidate1?.id === candidate.id) {
                  setSelectedCandidates((prev) => ({
                    ...prev,
                    candidate1: null,
                  }));
                } else if (selectedCandidates.candidate2?.id === candidate.id) {
                  setSelectedCandidates((prev) => ({
                    ...prev,
                    candidate2: null,
                  }));
                } else if (!selectedCandidates.candidate1) {
                  selectCandidate(candidate, "candidate1");
                } else if (!selectedCandidates.candidate2) {
                  selectCandidate(candidate, "candidate2");
                } else {
                  // Alert.alert(
                  //   getText("अधिकतम चयन", "Maximum Selection"),
                  //   getText(
                  //     "तपाईंले पहिले नै दुई उम्मेदवार चयन गर्नुभएको छ।",
                  //     "You have already selected two candidates."
                  //   )
                  // );
                }
              }}
              isSelected={
                selectedCandidates.candidate1?.id === candidate.id ||
                selectedCandidates.candidate2?.id === candidate.id
              }
            />
          ))}
        </div>

        {/* Compare Button */}
        <Button
          onClick={startComparison}
          disabled={
            !selectedCandidates.candidate1 || !selectedCandidates.candidate2
          }
          className="mb-4"
        >
          <p className="text-white font-semibold">
            {getText("तुलना गर्नुहोस्", "Compare Candidates")}
          </p>
          <ChevronRight size={20} color="white" className="ml-2" />
        </Button>

        {/* Selected Candidates Summary */}
        {(selectedCandidates.candidate1 || selectedCandidates.candidate2) && (
          <Card className="p-4">
            <p className="text-lg font-semibold text-gray-900 mb-3">
              {getText("चयनित उम्मेदवार", "Selected Candidates")}
            </p>

            <div className="space-y-2">
              {selectedCandidates.candidate1 && (
                <div className="flex-row items-center gap-2">
                  <CheckCircle size={16} color="#3b82f6" />
                  <p className="text-gray-900">
                    {getText(
                      selectedCandidates.candidate1.fullNameNepali ||
                        selectedCandidates.candidate1.fullName,
                      selectedCandidates.candidate1.fullName
                    )}
                  </p>
                </div>
              )}

              {selectedCandidates.candidate2 && (
                <div className="flex-row items-center gap-2">
                  <CheckCircle size={16} color="#3b82f6" />
                  <p className="text-gray-900">
                    {getText(
                      selectedCandidates.candidate2.fullNameNepali ||
                        selectedCandidates.candidate2.fullName,
                      selectedCandidates.candidate2.fullName
                    )}
                  </p>
                </div>
              )}
            </div>
          </Card>
        )}
      </div>

      {/* <ComparisonModal /> */}
    </div>
  );
}
