import { useCandidateStore } from "../stores/Candidates";

type CandidatePropType = {
  candidate: CandidateType;
};

const CandidateCard = (props: CandidatePropType) => {
  const { candidate } = props;
  const openModal = useCandidateStore((state) => state.openModal);

  return (
    <div
      className="bg-amber-50 rounded-2xl text-black p-3 shadow"
      onClick={() => openModal(candidate)}
    >
      {candidate.name}
    </div>
  );
};

export default CandidateCard;
