import React, { useEffect, useState } from "react";
import { MapPin } from "lucide-react";
import type { ReportCreateData } from "@/types";
import { useLocation } from "@/hooks/useLocation";
import type {
  IConstituency,
  IDistrict,
  IMunicipality,
  IWard,
} from "@/types/location";

interface LocationPickerProps {
  form: ReportCreateData;
  setForm: React.Dispatch<React.SetStateAction<ReportCreateData>>;
}

const LocationPicker: React.FC<LocationPickerProps> = ({ form, setForm }) => {
  const {
    allProvincesData: provinces,
    fetchDistrictsByProvinceId: fetchDistricts,
    fetchConstituencyByWardId: fetchConstituency,
    fetchMunicipalitiesByDistrictId: fetchMunicipalities,
    fetchWardsByMunicipalityId: fetchWards,
  } = useLocation();

  const [districts, setDistricts] = useState<IDistrict[]>([]);
  const [municipalities, setMunicipalities] = useState<IMunicipality[]>([]);
  const [wards, setWards] = useState<IWard[]>([]);
  const [constituency, setConstituency] = useState<IConstituency>();

  useEffect(() => {
    if (form.provinceId) {
      setForm((prev) => ({
        ...prev,
        districtId: "",
        constituencyId: "",
        municipalityId: "",
        wardId: "",
      }));
      fetchDistricts(form.provinceId).then((districts) => {
        setDistricts(districts);
      });
    }
  }, [form.provinceId]);

  useEffect(() => {
    if (form.districtId) {
      setForm((prev) => ({
        ...prev,
        constituencyId: "",
        wardId: "",
        municipalityId: "",
      }));
      fetchMunicipalities(form.districtId).then((municipalities) => {
        setMunicipalities(municipalities);
      });
    }
  }, [form.provinceId, form.districtId]);

  useEffect(() => {
    if (form.municipalityId) {
      setForm((prev) => ({ ...prev, constituencyId: "", wardId: "" }));
      fetchWards(form.municipalityId).then((wards) => {
        setWards(wards);
      });
    }
  }, [form.provinceId, form.districtId, form.municipalityId]);

  useEffect(() => {
    if (form.wardId) {
      setForm((prev) => ({ ...prev, constituencyId: "" }));
      fetchConstituency(form.wardId).then((constituency) => {
        setConstituency(constituency);
      });
    }
  }, [form.provinceId, form.districtId, form.municipalityId, form.wardId]);

  useEffect(() => {
    if (constituency) {
      setForm((prev) => ({ ...prev, constituencyId: constituency.id }));
    }
  }, [constituency]);

  const selectedDistrictName = districts.find(
    (district) => district.id === form.districtId,
  )?.name;
  let constituencyName = "";
  if (constituency) {
    constituencyName = `${selectedDistrictName} - ${constituency.constituencyNumber}`;
  }

  return (
    <div className="mb-6">
      <div className="flex items-center mb-4">
        <MapPin className="w-5 h-5 text-red-600 mr-2" />
        <p className="font-bold text-gray-800 text-lg">Location Information</p>
      </div>

      {/* Province Field */}
      <div>
        <div className="flex items-center mb-1">
          <MapPin className="text-gray-500 w-4 h-4 mr-2" />
          <p className="text-sm font-medium text-gray-700">Province</p>
        </div>
        <select
          className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md text-sm focus:border-red-500 focus:ring-red-500 bg-white"
          value={form.provinceId}
          onChange={(e) => {
            setForm((prev) => ({
              ...prev,
              provinceId: e.target.value,
              districtId: "",
              constituencyId: "",
              municipalityId: "",
              wardId: "",
            }));
          }}
        >
          <option value="">Select Province</option>
          {provinces?.map((province) => (
            <option key={province.id} value={province.id}>
              {province.name}
            </option>
          ))}
        </select>
      </div>

      {/* District Field */}
      {form.provinceId && (
        <div>
          <div className="flex items-center mb-1">
            <MapPin className="text-gray-500 w-4 h-4 mr-2" />
            <p className="text-sm font-medium text-gray-700">District</p>
          </div>
          <select
            className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md text-sm focus:border-red-500 focus:ring-red-500 bg-white"
            value={form.districtId}
            onChange={(e) => {
              setForm((prev) => ({
                ...prev,
                districtId: e.target.value,
              }));
            }}
            disabled={!form.provinceId}
          >
            <option value="">Select District</option>
            {districts.map((district) => (
              <option key={district.id} value={district.id}>
                {district.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Municipality Field */}
      {form.districtId && (
        <div>
          <div className="flex items-center mb-1">
            <MapPin className="text-gray-500 w-4 h-4 mr-2" />
            <p className="text-sm font-medium text-gray-700">Municipality</p>
          </div>
          <select
            className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md text-sm focus:border-red-500 focus:ring-red-500 bg-white"
            value={form.municipalityId}
            onChange={(e) => {
              setForm((prev) => ({
                ...prev,
                municipalityId: e.target.value,
              }));
            }}
            disabled={!form.districtId}
          >
            <option value="">Select Municipality</option>
            {municipalities.map((municipality) => (
              <option key={municipality.id} value={municipality.id}>
                {municipality.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Ward Field */}
      {form.municipalityId && (
        <div>
          <div className="flex items-center mb-1">
            <MapPin className="text-gray-500 w-4 h-4 mr-2" />
            <p className="text-sm font-medium text-gray-700">Ward</p>
          </div>
          <select
            className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md text-sm focus:border-red-500 focus:ring-red-500 bg-white"
            value={form.wardId}
            onChange={(e) => {
              setForm((prev) => ({
                ...prev,
                wardId: e.target.value,
              }));
            }}
            disabled={!form.municipalityId}
          >
            <option value="">Select Ward Number</option>
            {wards.map((ward) => (
              <option key={ward.id} value={ward.id}>
                {ward.wardNumber}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Constituency Field */}
      {form.wardId && (
        <div>
          <div className="flex items-center mb-1">
            <MapPin className="text-gray-500 w-4 h-4 mr-2" />
            <p className="text-sm font-medium text-gray-700">Constituency</p>
          </div>
          <select
            className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md text-sm focus:border-red-500 focus:ring-red-500 bg-white disabled:bg-gray-100 hover:disabled:cursor-not-allowed"
            value={form.constituencyId}
            disabled
          >
            <option value="">
              {form.constituencyId ? (
                <option value={constituency?.id}>{constituencyName}</option>
              ) : null}
            </option>
          </select>
        </div>
      )}

      {/* Location Description */}
      <div className="mb-4">
        <p className="font-bold text-gray-800 mb-2">
          Location Description (Optional)
        </p>
        <textarea
          value={form.locationDescription || ""}
          onChange={(e) =>
            setForm((prev) => ({
              ...prev,
              locationDescription: e.target.value,
            }))
          }
          placeholder="Provide additional details about the location..."
          rows={3}
          className="w-full p-3 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
        />
      </div>
    </div>
  );
};

export default LocationPicker;
