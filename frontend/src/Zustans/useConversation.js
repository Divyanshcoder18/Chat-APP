import { create } from "zustand";

const userConversation = create((set) => ({
    selectedConversation: null,
    setSelectedConversation: (selectedConversation) => {
        console.log("🔷 [ZUSTAND] setSelectedConversation called with:", selectedConversation);
        set({ selectedConversation });
    },
    messages: [],
    setMessage: (messages) => {
        console.log("🔷 [ZUSTAND] setMessage called with:", messages);
        console.log("🔷 [ZUSTAND] Is it a function?", typeof messages === 'function');
        if (typeof messages === 'function') {
            set((state) => {
                const newMessages = messages(state.messages);
                console.log("🔷 [ZUSTAND] Previous messages:", state.messages);
                console.log("🔷 [ZUSTAND] New messages:", newMessages);
                return { messages: newMessages };
            });
        } else {
            console.log("🔷 [ZUSTAND] Setting messages directly:", messages);
            set({ messages });
        }
    }
}));

export default userConversation