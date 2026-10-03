import { PlusOutlined } from "@ant-design/icons";

const NewButton = ({ onClick }) => {
  return (
    <button
      type="button"
      className="flex items-center text-xs sm:text-sm rounded-md bg-blue-600 px-3 sm:px-5 h-9 sm:h-10 text-white hover:bg-blue-500 cursor-pointer"
      onClick={onClick}
    >
      <PlusOutlined className="mr-1.5 sm:mr-2" />
      New Task
    </button>
  );
};

export default NewButton;