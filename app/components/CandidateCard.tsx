import { useDrag } from "react-dnd";
import { useCandidateStore } from "../stores/Candidates";
import { ItemTypes } from "../utils";
import { useRef, useState } from "react";
import { Button, Description, Dialog, DialogPanel, DialogTitle } from "@headlessui/react";

type CandidatePropType = {
  candidate: CandidateType;
};

const CandidateCard = (props: CandidatePropType) => {
  const { candidate } = props;
  const [openDeleteModal, setDeleteModalOpen] = useState(false);
  const openCandidateModal = useCandidateStore((state) => state.openModal);
  const ref = useRef<HTMLDivElement>(null);
  const [, drag] = useDrag(() => ({
    type: ItemTypes.CARD,
    item: candidate,
    end: (item, monitor) => {
      if (!monitor.didDrop()) {
        setDeleteModalOpen(true);
        
      }
    }
  }))

  drag(ref);

  return (
    <div
      ref={ref}
      className="bg-amber-50 rounded-2xl text-black p-3 shadow"
      onClick={() => openCandidateModal(candidate)}
    >
      {candidate.name}
      <ConfirmDeleteModal open={openDeleteModal} closeModal={() => setDeleteModalOpen(false)} candidate={candidate} />
    </div>
  );
};

type ConfirmDeleteModalPropType = {
  open: boolean;
  closeModal: () => void;
  candidate: CandidateType;
};

const ConfirmDeleteModal = (props: ConfirmDeleteModalPropType) => {
  const { open, closeModal, candidate } = props;
  const removeCandidate = useCandidateStore((state) => state.removeCandidate);

  const onDelete = () => {
    removeCandidate(candidate.id);
    closeModal();
  }

  return (
    <Dialog open={open} onClose={closeModal}>
      <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
        <DialogPanel className="max-w-lg space-y-8 shadow bg-amber-100 rounded-2xl p-12">
          <DialogTitle className="font-bold">Confirmation</DialogTitle>
          <Description>
            Do you want to remove the candidate {candidate.name}?
          </Description>
          <div className="flex gap-4 justify-end">
            <Button className="button ghost" onClick={closeModal}>
              Cancel
            </Button>
            <Button className="button" onClick={onDelete}>
              Remove
            </Button>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
}

export default CandidateCard;
