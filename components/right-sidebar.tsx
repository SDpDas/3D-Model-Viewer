import "../styles/right-sidebar.css"

  interface ObjectType {
    id: string;
    position: [number, number, number];
    rotation: [number, number, number];
    scale: [number, number, number];
  }
  
  interface RightSidebarProps {
    selectedObject: ObjectType | null;
    updateObject: (id: string, updates: Partial<ObjectType>) => void;
    publishScene: () => void;
  }

export default function RightSidebar({ selectedObject, updateObject, publishScene }: RightSidebarProps)  {
    const handlePositionChange = (axis: number, value: string) => {
        if (!selectedObject) return;
        const newPosition = [...selectedObject.position] as [number, number, number];
        newPosition[axis] = Number.parseFloat(value);
        updateObject(selectedObject.id, { position: newPosition });
    };
    
    const handleRotationChange = (axis: number, value: string) => {
        if (!selectedObject) return;
        const newRotation = [...selectedObject.rotation] as [number, number, number];
        newRotation[axis] = Number.parseFloat(value);
        updateObject(selectedObject.id, { rotation: newRotation });
    };
    
    const handleScaleChange = (axis: number, value: string) => {
        if (!selectedObject) return;
        const newScale = [...selectedObject.scale] as [number, number, number];
        newScale[axis] = Number.parseFloat(value);
        updateObject(selectedObject.id, { scale: newScale });
    };

    const handleUniformScaleChange = (value: number) => {
        if (!selectedObject) return
        updateObject(selectedObject.id, { scale: [value, value, value] })
    }

  return (
    <div className="right-sidebar">
      {selectedObject ? (
        <div className="properties-panel">
          <h3>Object Properties</h3>

          <div className="property-group">
            <h4>Position</h4>
            <div className="property-row">
              <label>X:</label>
              <input
                type="number"
                value={selectedObject.position[0]}
                onChange={(e) => handlePositionChange(0, e.target.value)}
                step="0.1"
              />
            </div>
            <div className="property-row">
              <label>Y:</label>
              <input
                type="number"
                value={selectedObject.position[1]}
                onChange={(e) => handlePositionChange(1, e.target.value)}
                step="0.1"
              />
            </div>
            <div className="property-row">
              <label>Z:</label>
              <input
                type="number"
                value={selectedObject.position[2]}
                onChange={(e) => handlePositionChange(2, e.target.value)}
                step="0.1"
              />
            </div>
          </div>

          <div className="property-group">
            <h4>Rotation (degrees)</h4>
            <div className="property-row">
              <label>X:</label>
              <input
                type="number"
                value={selectedObject.rotation[0]}
                onChange={(e) => handleRotationChange(0, e.target.value)}
                step="15"
              />
            </div>
            <div className="property-row">
              <label>Y:</label>
              <input
                type="number"
                value={selectedObject.rotation[1]}
                onChange={(e) => handleRotationChange(1, e.target.value)}
                step="15"
              />
            </div>
            <div className="property-row">
              <label>Z:</label>
              <input
                type="number"
                value={selectedObject.rotation[2]}
                onChange={(e) => handleRotationChange(2, e.target.value)}
                step="15"
              />
            </div>
          </div>

          <div className="property-group">
            <h4>Scale</h4>
            <div className="property-row">
              <label>Uniform:</label>
              <input 
              type="checkbox" 
              id="uniform-scale" 
              onChange={(e) => {
                if (e.target.checked) handleUniformScaleChange(selectedObject?.scale[0] || 1);
              }}
              />
            </div>
            <div className="property-row">
              <label>X:</label>
              <input
                type="number"
                value={selectedObject.scale[0]}
                onChange={(e) => handleScaleChange(0, e.target.value)}
                step="0.1"
                min="0.1"
              />
            </div>
            <div className="property-row">
              <label>Y:</label>
              <input
                type="number"
                value={selectedObject.scale[1]}
                onChange={(e) => handleScaleChange(1, e.target.value)}
                step="0.1"
                min="0.1"
              />
            </div>
            <div className="property-row">
              <label>Z:</label>
              <input
                type="number"
                value={selectedObject.scale[2]}
                onChange={(e) => handleScaleChange(2, e.target.value)}
                step="0.1"
                min="0.1"
              />
            </div>
          </div>
        </div>
      ) : (
        <div className="no-selection">
          <p>No object selected</p>
          <p>Select an object to edit its properties</p>
        </div>
      )}

      <div className="publish-section">
        <button className="publish-button" onClick={publishScene}>
          Publish AR Experience
        </button>
      </div>
    </div>
  )
}

