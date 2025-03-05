import "../styles/toolbar.css"

interface ToolbarProps {
  activeTool: string;
  setActiveTool: (tool: string) => void;
  undo: () => void;
  redo: () => void;
  deleteObject: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

const Toolbar: React.FC<ToolbarProps> = ({ activeTool, setActiveTool, undo, redo, deleteObject, canUndo, canRedo }) => {
  return (
    <div className="toolbar">
      <div className="tool-group">
        <button
          className={`tool-button ${activeTool === "select" ? "active" : ""}`}
          onClick={() => setActiveTool("select")}
          title="Select Tool"
        >
          <span className="tool-icon">🔍</span>
        </button>

        <button
          className={`tool-button ${activeTool === "position" ? "active" : ""}`}
          onClick={() => setActiveTool("position")}
          title="Position Tool"
        >
          <span className="tool-icon">↔️</span>
        </button>

        <button
          className={`tool-button ${activeTool === "rotate" ? "active" : ""}`}
          onClick={() => setActiveTool("rotate")}
          title="Rotate Tool"
        >
          <span className="tool-icon">🔄</span>
        </button>

        <button
          className={`tool-button ${activeTool === "scale" ? "active" : ""}`}
          onClick={() => setActiveTool("scale")}
          title="Scale Tool"
        >
          <span className="tool-icon">⤧</span>
        </button>
      </div>

      <div className="tool-group">
        <button className="tool-button" onClick={undo} disabled={!canUndo} title="Undo">
          <span className="tool-icon">↩️</span>
        </button>

        <button className="tool-button" onClick={redo} disabled={!canRedo} title="Redo">
          <span className="tool-icon">↪️</span>
        </button>
      </div>

      <div className="tool-group">
        <button className="tool-button delete" onClick={deleteObject} title="Delete Selected">
          <span className="tool-icon">🗑️</span>
        </button>
      </div>
    </div>
  )
}

export default Toolbar;
