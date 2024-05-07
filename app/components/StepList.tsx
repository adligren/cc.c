"use client";

import { useEffect } from "react";
import { useCandidateStore } from "../stores/Candidates";
import CandidateCard from "./CandidateCard";
import CandidateModal from "./CandidateModal";
import { Button } from "@headlessui/react";
import { createNewCandidate } from "../utils";
import GlobalFilter from "./GlobalFilter";
import usePreferences from "../stores/Preferences";

type StepListPropType = {
  steps: StepType[];
};

const StepList = (props: StepListPropType) => {
  const { steps } = props;

  const candidateStream = useCandidateStore((state) => state.stream);

  useEffect(() => {
    candidateStream.start();
    return function cleanUp() {
      candidateStream.close();
    };
  }, [candidateStream]);

  return (
    <div className="my-3">
      <GlobalFilter />
      <div className="flex justify-between gap-3 my-3">
        {steps.map((step) => (
          <Step key={step.id} step={step} />
        ))}
      </div>
      <CandidateModal />
    </div>
  );
};

type StepPropType = {
  step: StepType;
};

const Step = (props: StepPropType) => {
  const { id, label } = props.step;
  const openModal = useCandidateStore((state) => state.openModal);
  const candidates = useCandidateStore((state) => state.candidates);
  const filter = usePreferences((state) => state.filter);

  const onAddCandidate = () => {
    const candidate = createNewCandidate(id);
    openModal(candidate);
  };

  const candidateCards = candidates
    .filter(
      ({ stepId, name }) =>
        stepId === id && name.toLowerCase().includes(filter.toLowerCase())
    )
    .map((candidate) => (
      <CandidateCard key={candidate.id} candidate={candidate} />
    ));

  return (
    <div className="flex-1 min-w-52 bg-amber-300 p-3 rounded">
      <div className="flex justify-between items-center mb-2">
        <h1 className="text-black">{label}</h1>
        <Button className="button ghost" onClick={onAddCandidate}>
          +
        </Button>
      </div>
      <div className="flex flex-col justify-between min-h-128">
        <div className="flex flex-col pb-16 gap-3">{candidateCards}</div>
        <Button className="button ghost" onClick={onAddCandidate}>
          Add +
        </Button>
      </div>
    </div>
  );
};

export default StepList;