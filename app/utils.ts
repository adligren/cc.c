export const append = <T>(arr: T[], item: T) => [...arr, item];
export const replace = <T extends CandidateType>(arr: T[], item: T) =>
  arr.map((current) => (current.id === item.id ? item : current));
export const remove = <T extends CandidateType>(arr: T[], id: string) =>
  arr.filter((item) => item.id !== id);

export const getCandidateData = (candidate: Partial<CandidateType>) => {
  const { id, ts, coll, ...safeCandidateData } = candidate;
  return safeCandidateData;
};

export const createNewCandidate = (stepId = ""): Partial<CandidateType> => ({
  name: "",
  birth: "",
  email: "",
  stepId,
  address: {
    street: "",
    city: "",
    zip: "",
    country: "",
  },
});
