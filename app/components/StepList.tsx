"use client";

import { useEffect, useRef } from "react";
import { useCandidateStore } from "../stores/Candidates";
import CandidateCard from "./CandidateCard";
import CandidateModal from "./CandidateModal";
import { Button } from "@headlessui/react";
import { ItemTypes, createNewCandidate } from "../utils";
import GlobalFilter from "./GlobalFilter";
import usePreferences from "../stores/Preferences";
import { DndProvider, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

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
    <DndProvider backend={HTML5Backend}>
      <div className="my-3">
        <GlobalFilter />
        <div className="flex justify-between gap-3 my-3">
          {steps.map((step, i) => (
            <Step key={step.id} i={i} step={step} />
          ))}
        </div>
        <CandidateModal />
      </div>
    </DndProvider>
  );
};

type StepPropType = {
  step: StepType;
  i: number;
};

const Step = (props: StepPropType) => {
  const { step, i } = props;
  const { id, label } = step;
  const openModal = useCandidateStore((state) => state.openModal);
  const candidates = useCandidateStore((state) => state.candidates);
  const updateCandidate = useCandidateStore((state) => state.updateCandidate);
  const filter = usePreferences((state) => state.filter);
  const ref = useRef<HTMLDivElement>(null);
  const [, drop] = useDrop<CandidateType>(
    () => ({
      accept: ItemTypes.CARD,
      drop: (candidate) => {
        updateCandidate({ ...candidate, stepId: id });
      },
    }),
    [id]
  );

  drop(ref);

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
    <div
      ref={ref}
      style={{ backgroundPosition: `left -${i * 200}px top` }}
      className={`flex-1 min-w-52 p-3 rounded card-container`}
    >
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
