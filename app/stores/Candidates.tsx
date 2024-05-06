import { Client, StreamClient, StreamToken, fql } from "fauna";
import { create } from "zustand";
import { append, remove, replace } from "../utils";

type StreamResponseType = {
  initialCandidates: {
    data: CandidateType[];
  };
  streamToken: StreamToken;
};

type CandidateStoreType = {
  candidates: CandidateType[];
  stream: { start: () => void; close: () => void };
  addCandidate: (candidate: CandidateType, silent: boolean) => void;
  updateCandidate: (candidate: CandidateType, silent: boolean) => void;
  removeCandidate: (candidateId: string, silent: boolean) => void;
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

  const addCandidate = (candidate: CandidateType, silent: boolean) => {
    if (!silent) {
        console.log("Push candidate:", candidate);
        fql`Candidates.create(${candidate})`;
    }
    set((state) => ({
      candidates: state.candidates.every(({ id }) => id !== candidate.id)
        ? append(state.candidates, candidate)
        : replace(state.candidates, candidate),
    }));
  };

  const updateCandidate = (candidate: CandidateType, silent: boolean) => {
    if (!silent) {
        console.log("Push candidate edit:", candidate);
        fql`Candidates.byId(${candidate.id}).update(${candidate})`;
    }
    set((state) => ({
      candidates: replace(state.candidates, candidate),
    }));
  };

  const removeCandidate = (candidateId: string, silent: boolean) => {
    if (!silent) {
        console.log("Remove candidate:", candidateId);
        fql`Candidates.byId(${candidateId}).delete()`;
    }
    set((state) => ({
      candidates: remove(state.candidates, candidateId),
    }));
  };

  return {
    candidates: [],
    stream: {
      start: async () => {
        console.log("Start stream");
        if (stream === null || stream.closed) await refreshStream();
        try {
          for await (const event of stream as StreamClient<CandidateType>) {
            console.log("Stream event:", event);
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
        console.log("Close stream");
        if (stream !== null && !stream.closed) stream.close();
      },
    },
    addCandidate,
    updateCandidate,
    removeCandidate,
  };
});
