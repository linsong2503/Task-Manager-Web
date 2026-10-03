
const UserCard = ({ title, nums, icon, bgColor, iconColor }) => {
  return (
    <div className="flex-1 min-w-33.75 rounded-2xl border p-4 bg-white">
      <div className="flex items-center justify-between">
        <div className="grow">
          <span className="block">{title}</span>
          <h1 className="text-black font-bold text-2xl">{nums}</h1>
        </div>

        <div className={`rounded-lg p-2 ${bgColor} ${iconColor}`}>
          {icon}
        </div>
      </div>
    </div>
  );
};

export default UserCard;