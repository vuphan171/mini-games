interface Props {
  label: string;
}

const TimeBadge = ({ label }: Props) => {
  return (
    <div
      className="rounded-full border-4 px-6 py-0.5 text-2xl font-extrabold"
      style={{
        borderColor: "#21351f",
        background: "#ffd54f",
        color: "#8a5a00",
        boxShadow: "0 4px 0 #21351f",
      }}
    >
      {label}
    </div>
  );
};

export default TimeBadge;
