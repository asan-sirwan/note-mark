import {
  ActionButtonsRow,
  Content,
  MarkdownEditor,
  NotePreviewList,
  RootLayout,
  Sidebar
} from "@/components";
import { selectedNoteAtom } from "@/store";
import { useAtomValue } from "jotai";
import { useEffect, useRef } from "react";

function App() {
	const contentContainerRef = useRef<HTMLDivElement>(null);
  const selectedNote = useAtomValue(selectedNoteAtom);

	const resetScroll = () => {
		contentContainerRef.current?.scrollTo(0, 0);
	}

	useEffect(() => {
		document.title = selectedNote?.title ?? "NoteMark";
	}, [selectedNote])
	
  return (
    <RootLayout>
      <Sidebar className="p-2 bg-zinc-800">
        <ActionButtonsRow className="flex justify-between mt-1" />
        <NotePreviewList className="mt-3 space-y-1" onSelect={resetScroll} />
      </Sidebar>
      <Content ref={contentContainerRef} className="border-l bg-zinc-900 border-l-white/15">
        <MarkdownEditor />
      </Content>
    </RootLayout>
  );
}

export default App;
