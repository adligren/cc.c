import { Client, StreamClient, StreamToken, fql } from "fauna";
import { create } from "zustand";
import { append, getCandidateData, remove, replace } from "../utils";

type StreamResponseType = {
  initialCandidates: {
    data: CandidateType[];
  };
  streamToken: StreamToken;
};

type CandidateStoreType = {
  candidates: CandidateType[];
  stream: { start: () => void; close: () => void };
  modalCandidate: Partial<CandidateType> | null;
  openModal: (candidate: Partial<CandidateType>) => void;
  closeModal: () => void;
  addCandidate: (candidate: Partial<CandidateType>, silent?: boolean) => void;
  updateCandidate: (candidate: CandidateType, silent?: boolean) => void;
  removeCandidate: (candidateId: string, silent?: boolean) => void;
};

export const useCandidateStore = create<CandidateStoreType>()((set) => {
  const client = new Client({ secret: process.env.NEXT_PUBLIC_FAUNA_KEY });
  let stream = null as StreamClient<CandidateType> | null;

  const refreshStream = async () => {
    const response = await client.query<StreamResponseType>(fql`
    let set = Candidate.all()

    {
        initialCandidates: set,
        streamToken: set.toStream()
    }
    `);
    const { initialCandidates, streamToken } = response.data;
    stream = client.stream(streamToken);
    set({ candidates: initialCandidates.data });
  };
  refreshStream();

  const openModal = (candidate: Partial<CandidateType>) => {
    set({ modalCandidate: candidate });
  };

  const closeModal = () => {
    set({ modalCandidate: null });
  };

  const addCandidate = async (
    candidate: Partial<CandidateType>,
    silent?: boolean
  ) => {
    if (!silent) {
      const safeCandidateData = getCandidateData(candidate);
      const res = await client.query<CandidateType>(
        fql`Candidate.create(${safeCandidateData})`
      );
      candidate = res.data;
    }
    set((state) => ({
      candidates: state.candidates.every(({ id }) => id !== candidate.id)
        ? append(state.candidates, candidate as CandidateType)
        : replace(state.candidates, candidate as CandidateType),
    }));
  };

  const updateCandidate = (candidate: CandidateType, silent?: boolean) => {
    if (!silent) {
      const safeCandidateData = getCandidateData(candidate);
      client.query(
        fql`Candidate.byId(${candidate.id})!.update(${safeCandidateData})`
      );
    }
    set((state) => ({
      candidates: replace(state.candidates, candidate),
    }));
  };

  const removeCandidate = (candidateId: string, silent?: boolean) => {
    if (!silent) {
      client.query(fql`Candidate.byId(${candidateId})!.delete()`);
    }
    set((state) => ({
      candidates: remove(state.candidates, candidateId),
    }));
  };

  return {
    candidates: [],
    stream: {
      start: async () => {
        if (stream === null || stream.closed) await refreshStream();
        try {
          for await (const event of stream as StreamClient<CandidateType>) {
            switch (event.type) {
              case "update":
                updateCandidate(event.data, true);
                break;
              case "add":
                addCandidate(event.data, true);
                break;
              case "remove":
                removeCandidate(event.data.id, true);
                break;
            }
          }
        } catch (error) {
          // TODO ask user to reload the page
          console.error("Close due to a stream error:", error);
          if (stream !== null && !stream.closed) stream.close();
        }
      },
      close: () => {
        if (stream !== null && !stream.closed) stream.close();
      },
    },
    modalCandidate: null,
    openModal,
    closeModal,
    addCandidate,
    updateCandidate,
    removeCandidate,
  };
});
