type StepType = {
  id: string;
  label: string;
};

type CandidateType = {
  id: string;
  name: string;
  birth: string;
  email: string;
  stepId: string;
  address: {
    street: string;
    city: string;
    zip: string;
    country: string;
  };
  coll?: {
    name: string;
  };
  ts?: {
    isoString: string;
  };
};
