interface Props {
  score: number;
}

const ScoreBadge = ({ score }: Props) => {
  return (
    <div className="bg-score-gradient px-10 py-2 rounded-xl">
      <p className="text-2xl font-bold text-white uppercase">Điểm: {score}</p>
    </div>
  );
};

export default ScoreBadge;
