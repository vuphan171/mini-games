interface Props {
  time: string;
}

const TimeBadge = ({ time }: Props) => {
  return (
    <div className="bg-score-gradient px-10 py-2 rounded-xl">
      <p className="text-2xl font-bold text-white uppercase">{time}</p>
    </div>
  );
};

export default TimeBadge;
