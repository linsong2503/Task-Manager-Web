
import { Spin } from "antd";
import { useAxiosLoader } from "../../api/restApi.js";

export default function Loader() {
  const loading = useAxiosLoader();

  if (!loading) return null;

  return (
    <div className="fixed inset-0 z-9999 flex items-center justify-center bg-white/60 backdrop-blur-[2px]">
      <div className="flex flex-col items-center gap-3 rounded-xl bg-white px-6 py-5 shadow-lg">
        <Spin size="large" />
        <span className="text-sm text-gray-500">Loading...</span>
      </div>
    </div>
  );
}