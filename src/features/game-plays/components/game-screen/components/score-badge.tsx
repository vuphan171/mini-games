interface Props {
  score: number;
}

const ScoreBadge = ({ score }: Props) => {
  return (
    <div
      className="rounded-full border-4 px-6 py-0.5 text-2xl font-extrabold"
      style={{
        borderColor: "#21351f",
        background: "#fff8e7",
        color: "#2c7a37",
        boxShadow: "0 4px 0 #21351f",
      }}
    >
      ⭐ {score}
    </div>
  );
};

export default ScoreBadge;
