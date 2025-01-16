import { useTerminalStore } from "@/store/chatStore";

const Terminal = () => {
  const terminal = useTerminalStore((state) => state.terminal);
  return (
    <div className="bg-black text-white p-4 shadow-lg h-full">
      <h2 className="text-lg font-bold mb-2">Terminal</h2>
      <div className="overflow-y-auto h-64  p-2">
        <pre>
          <code>
            {terminal.map((command, index) => (
              <p key={index}>CodeGen ~ {command}</p>
            ))}
          </code>
        </pre>
      </div>
    </div>
  );
};

export default Terminal;
