import { notesAtom, selectedNoteIndexAtom } from "@renderer/store";
import { useAtom, useAtomValue } from "jotai";

export const useNotesList = ({ onSelect }: { onSelect?: () => void }) => {
  const notes = useAtomValue(notesAtom);
  const [selectedNoteIndex, setSelectedNoteIndex] = useAtom(selectedNoteIndexAtom);

  const handleNotesSelect = async (index: number) => {		
    setSelectedNoteIndex(index);

    if (onSelect) {
      onSelect();
    }
  };

  return {
    notes,
    selectedNoteIndex,
    handleNotesSelect
  };
};
