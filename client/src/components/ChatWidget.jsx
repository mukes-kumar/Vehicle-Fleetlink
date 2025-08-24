"use client";
import { useEffect, useRef, useState } from "react";
import styles from "../styles/ChatWidget.module.css";
import { useAppContext } from "../context/AppContext";

const ChatWidget = () => {
  const { isOpen, toggleChat, axios } = useAppContext();
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hi there! How can I help you today?" },
  ]);
  const [loading, setLoading] = useState(false);
  const chatBodyRef = useRef(null);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await axios.post("/api/chat", {
        messages: [...messages, userMessage],
      });

      const reply = res.data.reply;
      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
    } catch (error) {
      console.error("Chat error:", error);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Sorry, something went wrong." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // On load
    const savedState = localStorage.getItem("chatOpened");
    // setIsOpen(savedState === "true");

    // Listen to external changes
    const handleStorageChange = (event) => {
      if (event.key === "chatOpened") {
        // setIsOpen(event.newValue === "true");
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);



  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [messages, loading]);

  return (
    <div className={styles.chatContainer}>
      {isOpen && (
        <div className={styles.chatBox}>
          <div className={styles.chatHeader}>
            <img
              src="/favicon.svg"
              alt="Agent"
              width={40}
              height={40}
              className={styles.avatar}
            />
            <p className={styles.agentName}>GoRent Car</p>
          </div>

          <div className={styles.chatBodyIntro}>
            <p>
              Experience hassle-free car rentals with GoRent! Choose from a wide range of
              vehicles, book instantly, and hit the road with confidence. Whether it's a
              short trip or a long drive, GoRent makes your journey smooth, affordable, and
              reliable. Drive your way with GoRent today!
            </p>

          </div>

          <div className={styles.chatBody} ref={chatBodyRef}>
            {messages.map((msg, i) => (
              <div key={i} className={msg.role === "user" ? styles.userMsg : styles.botMsg}>
                {msg.content}
              </div>
            ))}
            {loading && <p className={styles.botMsg}>Typing...</p>}
          </div>

          <div className={styles.chatInput}>
            <input
              type="text"
              value={input}
              placeholder="Write a message..."
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <button onClick={sendMessage}>➤ 😊</button>
          </div>
        </div>
      )}

      <button className={styles.floatingButton} onClick={toggleChat}>
        {isOpen ? "✖" : (
          <img
            src="/comment.png"
            width={50}
            height={50}
            alt="chat icon"
          />
        )}
      </button>
    </div>
  );
};

export default ChatWidget;
