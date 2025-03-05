// ar-editor.tsx
"use client"

import { useState, useRef, useEffect } from "react"
import { Canvas } from "@react-three/fiber"
import { OrbitControls, Grid, PerspectiveCamera, OrthographicCamera } from "@react-three/drei"
import { FirebaseStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage"
import { v4 as uuidv4 } from "uuid"
import LeftSidebar from "./left-sidebar"
import RightSidebar from "./right-sidebar"
import Toolbar from "./toolbar"
import Scene from "./scene"
import "../styles/ar-editor.css"
import { ObjectType } from '../types/types'

interface AREditorProps {
  storage: FirebaseStorage;
}

export default function AREditor({ storage }: AREditorProps) {
  const [objects, setObjects] = useState<ObjectType[]>([])
  const [selectedObject, setSelectedObject] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<string>("perspective")
  const [activeTool, setActiveTool] = useState<"position" | "rotate" | "scale" | "select">("select");
  const [history, setHistory] = useState<string[]>([])
  const [historyIndex, setHistoryIndex] = useState<number>(-1)
  const fileInputRef = useRef<HTMLInputElement>(null!)

  const addObject = async (type: "model" | "image" | "video" | "audio", file: File | null = null) => {
    let url = ""

    if (file) {
      const fileId = uuidv4()
      const fileExtension = file.name.split(".").pop()
      const storageRef = ref(storage, `models/${fileId}.${fileExtension}`)

      await uploadBytes(storageRef, file)
      url = await getDownloadURL(storageRef)
    }

    const newObject: ObjectType = {
      id: uuidv4(),
      type,
      position: [0, 0, 0],
      rotation: [0, 0, 0],
      scale: [1, 1, 1],
      url: url || "",
      name: file ? file.name : `${type}-${objects.length + 1}`,
    }

    const newObjects = [...objects, newObject]
    setObjects(newObjects)
    addToHistory(newObjects)
    setSelectedObject(newObject.id)
  }

  const updateObject = (id: string, properties: Partial<ObjectType>) => {
    const newObjects = objects.map((obj) => (obj.id === id ? { ...obj, ...properties } : obj))
    setObjects(newObjects)
    addToHistory(newObjects)
  }

  const deleteObject = () => {
    if (selectedObject) {
      const newObjects = objects.filter((obj) => obj.id !== selectedObject)
      setObjects(newObjects)
      setSelectedObject(null)
      addToHistory(newObjects)
    }
  }

  const addToHistory = (newState: ObjectType[]) => {
    const newHistory = history.slice(0, historyIndex + 1)
    newHistory.push(JSON.stringify(newState))
    setHistory(newHistory)
    setHistoryIndex(newHistory.length - 1)
  }

  const undo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1)
      setObjects(JSON.parse(history[historyIndex - 1]))
    }
  }

  const redo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1)
      setObjects(JSON.parse(history[historyIndex + 1]))
    }
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const fileType = file.type.split("/")[0]
    const fileExtension = file.name.includes(".") ? file.name.split(".").pop()?.toLowerCase() : "";
    if (!fileExtension) return;

    if (fileExtension === "glb" || fileExtension === "gltf") {
      await addObject("model", file)
    } else if (fileType === "image") {
      await addObject("image", file)
    } else if (fileType === "video") {
      await addObject("video", file)
    } else if (fileType === "audio") {
      await addObject("audio", file)
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const publishScene = () => {
    console.log("Publishing AR scene:", objects)
    alert("AR scene published! In a real implementation, this would generate a WebXR experience.")
  }

  const handleSetActiveTool = (tool: string) => {
    if (tool === "position" || tool === "rotate" || tool === "scale" || tool === "select") {
      setActiveTool(tool);
    }
  };

  useEffect(() => {
    if (objects.length > 0 && history.length === 0) {
      addToHistory(objects)
    }
  }, [objects, history.length])

  return (
    <div className="ar-editor">
      <LeftSidebar
        objects={objects}
        selectedObject={selectedObject}
        setSelectedObject={setSelectedObject}
        handleFileUpload={handleFileUpload}
        fileInputRef={fileInputRef}
      />

      <div className="editor-main">
        <Toolbar
          activeTool={activeTool}
          setActiveTool={handleSetActiveTool}
          undo={undo}
          redo={redo}
          deleteObject={deleteObject}
          canUndo={historyIndex > 0}
          canRedo={historyIndex < history.length - 1}
        />
        <div className="canvas-container">
          <Canvas shadows>
            {viewMode === "perspective" ? (
              <PerspectiveCamera makeDefault position={[5, 5, 5]} />
            ) : viewMode === "top" ? (
              <OrthographicCamera makeDefault position={[0, 10, 0]} zoom={50} />
            ) : viewMode === "front" ? (
              <OrthographicCamera makeDefault position={[0, 0, 10]} zoom={50} />
            ) : (
              <OrthographicCamera makeDefault position={[10, 0, 0]} zoom={50} />
            )}
            <ambientLight intensity={0.5} />
            <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
            <Grid infiniteGrid fadeDistance={50} fadeStrength={5} />
            <Scene
              objects={objects}
              selectedObject={selectedObject}
              setSelectedObject={setSelectedObject}
              updateObject={updateObject}
              activeTool={activeTool}
            />
            <OrbitControls />
          </Canvas>
        </div>
        <div className="view-mode-selector">
          <button className={viewMode === "perspective" ? "active" : ""} onClick={() => setViewMode("perspective")}>
            Perspective
          </button>
          <button className={viewMode === "top" ? "active" : ""} onClick={() => setViewMode("top")}>
            Top (Y)
          </button>
          <button className={viewMode === "front" ? "active" : ""} onClick={() => setViewMode("front")}>
            Front (Z)
          </button>
          <button className={viewMode === "side" ? "active" : ""} onClick={() => setViewMode("side")}>
            Side (X)
          </button>
        </div>
      </div>

      <RightSidebar
        selectedObject={selectedObject ? objects.find((obj) => obj.id === selectedObject) || null : null}
        updateObject={updateObject}
        publishScene={publishScene}
      />
    </div>
  )
}