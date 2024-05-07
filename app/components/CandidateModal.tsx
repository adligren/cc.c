import { FormEvent, useEffect, useState } from "react";
import {
  Button,
  Description,
  Dialog,
  DialogPanel,
  DialogTitle,
  Field,
  Input,
  Label,
} from "@headlessui/react";
import { useCandidateStore } from "../stores/Candidates";

const CandidateModal = () => {
  const [candidateData, setCandidateData] = useState<Partial<CandidateType>>(
    {}
  );
  const closeModal = useCandidateStore((state) => state.closeModal);
  const candidate = useCandidateStore((state) => state.modalCandidate);
  const addCandidate = useCandidateStore((state) => state.addCandidate);
  const updateCandidate = useCandidateStore((state) => state.updateCandidate);
  const open = candidate !== null;
  const title = candidate?.id ? "Edit Candidate" : "New Candidate";

  const handleFormChange = (event: FormEvent<HTMLFormElement>) => {
    const { name, value } = event.target as HTMLInputElement;
    const nonNullCandidate = candidate as CandidateType;
    const addressFields = ["street", "city", "zip", "country"];
    if (addressFields.includes(name)) {
      const savedAddress = nonNullCandidate.address;
      const newAddress = candidateData?.address;
      setCandidateData({
        ...candidateData,
        address: { ...savedAddress, ...newAddress, [name]: value },
      });
      return;
    } else {
      setCandidateData({ ...candidateData, [name]: value });
    }
  };

  const handleSave = async () => {
    if (candidate?.id) {
      updateCandidate(candidateData as CandidateType);
    } else {
      addCandidate(candidateData);
    }
    closeModal();
  };

  useEffect(() => {
    setCandidateData(candidate ?? {});
  }, [candidate]);

  return (
    <Dialog open={open} onClose={closeModal}>
      <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
        <DialogPanel className="max-w-lg space-y-8 modal-container p-12">
          <DialogTitle className="font-bold">{title}</DialogTitle>
          <Description>
            Update the information and share with everyone.
          </Description>
          <form onChange={handleFormChange}>
            <div className="space-y-8">
              <div className="space-y-4">
                <div className="flex justify-between">
                  <Field className="flex flex-col">
                    <Input
                      className="input"
                      name="name"
                      defaultValue={candidate?.name}
                      autoFocus
                    />
                    <Label className="label">Full name</Label>
                  </Field>
                  <Field className="flex flex-col max-w-32">
                    <Input
                      className="input"
                      name="birth"
                      defaultValue={candidate?.birth}
                    />
                    <Label className="label">Day of birth</Label>
                  </Field>
                </div>
                <Field className="flex flex-col">
                  <Input
                    className="input"
                    name="email"
                    defaultValue={candidate?.email}
                  />
                  <Label className="label">Email</Label>
                </Field>
              </div>
              <div className="space-y-4">
                <Field className="flex flex-col">
                  <Input
                    className="input"
                    name="street"
                    defaultValue={candidate?.address?.street}
                  />
                  <Label className="label">Street address</Label>
                </Field>
                <div className="flex gap-1">
                  <Field className="flex flex-col">
                    <Input
                      className="input"
                      name="city"
                      defaultValue={candidate?.address?.city}
                    />
                    <Label className="label">City</Label>
                  </Field>
                  <Field className="flex flex-col max-w-20">
                    <Input
                      className="input"
                      name="zip"
                      defaultValue={candidate?.address?.zip}
                    />
                    <Label className="label">Zip code</Label>
                  </Field>
                  <Field className="flex flex-col max-w-36">
                    <Input
                      className="input"
                      name="country"
                      defaultValue={candidate?.address?.country}
                    />
                    <Label className="label">Country</Label>
                  </Field>
                </div>
              </div>
            </div>
          </form>
          <div className="flex gap-4 justify-end">
            <Button className="button ghost" onClick={closeModal}>
              Cancel
            </Button>
            <Button className="button" onClick={handleSave}>
              Save
            </Button>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
};

export default CandidateModal;
