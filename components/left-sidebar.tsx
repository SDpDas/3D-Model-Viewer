"use client"

import { useState } from "react"
import "../styles/left-sidebar.css"
import { ObjectType } from "../types/types";

interface LeftSidebarProps {
  objects: ObjectType[];
  selectedObject: string | null;
  setSelectedObject: (id: string) => void;
  handleFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
}

const LeftSidebar: React.FC<LeftSidebarProps> = ({ objects, selectedObject, setSelectedObject, handleFileUpload, fileInputRef }) => {
    const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({})
  
    const toggleExpand = (id: string) => {
      setExpandedItems((prev) => ({
        ...prev,
        [id]: !prev[id],
      }))
    }
  
    return (
      <div className="left-sidebar">
        {/* Hierarchy View */}
        <div className="hierarchy-section">
          <h3>Scene Hierarchy</h3>
          <div className="hierarchy-list">
              {objects.length === 0 ? (
              <div className="empty-message">No objects in scene</div>
            ) : (
              objects.map((obj) => (
                <div
                  key={obj.id}
                  className={`hierarchy-item ${selectedObject === obj.id ? "selected" : ""}`}
                  onClick={() => setSelectedObject(obj.id)}
                >
                  <span className="item-icon">
                    {obj.type === "model"
                      ? "📦"
                      : obj.type === "image"
                      ? "🖼️"
                      : obj.type === "video"
                      ? "🎬"
                      : obj.type === "audio"
                      ? "🔊"
                      : "⚪"}
                  </span>
                  <span className="item-name">{obj.name}</span>
                  <button onClick={(e) => { e.stopPropagation(); toggleExpand(obj.id); }}>
                    {expandedItems[obj.id] ? "🔽" : "▶️"}
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
  
        {/* Upload Section */}
        <div className="upload-section">
          <h3>Upload Media</h3>
          <div className="upload-buttons">
            <button className="upload-button" onClick={() => fileInputRef.current?.click()}>
              Upload File
            </button>
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: "none" }}
              onChange={handleFileUpload}
              accept=".glb,.gltf,.jpg,.jpeg,.png,.mp4,.mp3,.wav"
            />
          </div>
          <div className="upload-info">
            <p>Supported formats:</p>
            <ul>
              <li>3D Models: .glb, .gltf</li>
              <li>Images: .jpg, .png</li>
              <li>Video: .mp4</li>
              <li>Audio: .mp3, .wav</li>
            </ul>
          </div>
        </div>
      </div>
    )
  }
  
  export default LeftSidebar
  