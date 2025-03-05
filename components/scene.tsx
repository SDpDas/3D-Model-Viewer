// scene.tsx
"use client"

import { Dispatch, SetStateAction, useRef, useState, useEffect } from "react"
import { useThree } from "@react-three/fiber"
import { TransformControls, Html } from "@react-three/drei"
import type { TransformControls as TransformControlsImpl } from "three-stdlib"
import { Object3D } from "three"
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js"
import { BaseObject, ObjectType } from '../types/types'

interface ObjectProps extends BaseObject {
    id: string
    type: "model" | "image" | "video" | "audio"
    url?: string
}

interface ModelProps {
    object: ObjectProps
    isSelected: boolean
    onSelect: (id: string) => void
    transformMode: string
}

function Model({ object, onSelect }: ModelProps) {
    const ref = useRef<Object3D>(null)
    const gltf = useRef<Object3D | null>(null)
    const [loaded, setLoaded] = useState<boolean>(false)
    const [error, setError] = useState<Error | null>(null)

    useEffect(() => {
        if (object.url) {
            setLoaded(false)
            setError(null)
            const loader = new GLTFLoader()
            loader.load(
                object.url,
                (loadedGltf) => {
                    gltf.current = loadedGltf.scene.clone()
                    setLoaded(true)
                },
                undefined,
                (err) => {
                    console.error("Error loading model:", err)
                    setError(err as unknown as Error)
                },
            )
        }
    }, [object.url])

    if (!loaded && !error) {
        return (
            <mesh
                position={object.position}
                rotation={object.rotation.map((r) => (r * Math.PI) / 180) as [number, number, number]}
                scale={object.scale}
                onClick={(e) => {
                    e.stopPropagation()
                    onSelect(object.id)
                }}
            >
                <boxGeometry args={[1, 1, 1]} />
                <meshStandardMaterial color="gray" wireframe />
            </mesh>
        )
    }

    if (error) {
        return (
            <mesh
                position={object.position}
                rotation={object.rotation.map((r) => (r * Math.PI) / 180) as [number, number, number]}
                scale={object.scale}
                onClick={(e) => {
                    e.stopPropagation()
                    onSelect(object.id)
                }}
            >
                <boxGeometry args={[1, 1, 1]} />
                <meshStandardMaterial color="red" />
                <Html>
                    <div style={{ color: "red", background: "white", padding: "5px" }}>Error loading model</div>
                </Html>
            </mesh>
        )
    }

    return (
        <primitive
            ref={ref}
            object={gltf.current as Object3D}
            position={object.position}
            rotation={object.rotation.map((r) => (r * Math.PI) / 180) as [number, number, number]}
            scale={object.scale}
            onClick={() => {
                onSelect(object.id)
            }}
        />
    )
}

interface MediaProps {
    object: ObjectProps
    isSelected: boolean
    onSelect: (id: string) => void
}

function Image({ object, onSelect }: MediaProps) {
    return (
        <mesh
            position={object.position}
            rotation={object.rotation.map((r) => (r * Math.PI) / 180) as [number, number, number]}
            scale={object.scale}
            onClick={(e) => {
                e.stopPropagation()
                onSelect(object.id)
            }}
        >
            <planeGeometry args={[1, 1]} />
            <meshBasicMaterial />
            <Html transform>
                <img
                    src={object.url || "/placeholder.svg"}
                    alt={object.name}
                    style={{ width: "100px", height: "100px", objectFit: "contain" }}
                />
            </Html>
        </mesh>
    )
}

function Video({ object, onSelect }: MediaProps) {
    const videoRef = useRef<HTMLVideoElement | null>(null)

    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.src = object.url ?? ""
            videoRef.current.load()
            videoRef.current.autoplay = true
        }
    }, [object.url])

    return (
        <mesh
            position={object.position}
            rotation={object.rotation.map((r) => (r * Math.PI) / 180) as [number, number, number]}
            scale={object.scale}
            onClick={(e) => {
                e.stopPropagation()
                onSelect(object.id)
            }}
        >
            <planeGeometry args={[1.6, 1]} />
            <meshBasicMaterial />
            <Html transform>
                <video ref={videoRef} controls style={{ width: "160px", height: "100px" }} />
            </Html>
        </mesh>
    )
}

function Audio({ object, onSelect }: MediaProps) {
    return (
        <mesh
            position={object.position}
            rotation={object.rotation.map((r) => (r * Math.PI) / 180) as [number, number, number]}
            scale={object.scale}
            onClick={(e) => {
                e.stopPropagation()
                onSelect(object.id)
            }}
        >
            <sphereGeometry args={[0.5, 16, 16]} />
            <meshStandardMaterial color="purple" />
            <Html transform>
                <audio controls src={object.url} style={{ width: "200px" }} />
            </Html>
        </mesh>
    )
}

interface SceneProps {
    objects: ObjectType[]
    selectedObject: string | null
    setSelectedObject: Dispatch<SetStateAction<string | null>>
    updateObject: (id: string, data: Partial<ObjectType>) => void
    activeTool: "position" | "rotate" | "scale" | "select"
}

type TransformControlsWithChangeEvent = TransformControlsImpl & {
    addEventListener(type: "change", listener: (event: Event) => void): void;
    removeEventListener(type: "change", listener: (event: Event) => void): void;
};

export default function Scene({
    objects,
    selectedObject,
    setSelectedObject,
    updateObject,
    activeTool
}: SceneProps) {
    const { scene } = useThree()
    const transformRef = useRef<TransformControlsWithChangeEvent | null>(null)

    const handleBackgroundClick = (e: { object: Object3D }) => {
        if (e.object === scene || e.object.name === "grid") {
            setSelectedObject(null)
        }
    }

    useEffect(() => {
        const handleChange = () => {
            if (!selectedObject) return

            const object = scene.getObjectByName(selectedObject) as Object3D || null
            if (object) {
                const position: [number, number, number] = object.position.toArray().slice(0, 3) as [number, number, number]
                const rotation: [number, number, number] = object.rotation
                    .toArray()
                    .slice(0, 3)
                    .map((r) => ((r as number || 0) * 180) / Math.PI) as [number, number, number]
                const scale: [number, number, number] = object.scale.toArray().slice(0, 3) as [number, number, number]

                updateObject(selectedObject, { position, rotation, scale })
            }
        }

        if (transformRef.current) {
            (transformRef.current as TransformControlsWithChangeEvent).addEventListener("change", handleChange);
        }

        return () => {
            if (transformRef.current) {
                (transformRef.current as TransformControlsWithChangeEvent).removeEventListener("change", handleChange);
            }
        }
    }, [selectedObject, scene, updateObject])

    const getTransformMode = () => {
        switch (activeTool) {
            case "position":
                return "translate"
            case "rotate":
                return "rotate"
            case "scale":
                return "scale"
            default:
                return "translate"
        }
    }

    return (
        <>
            <group onClick={handleBackgroundClick}>
                {objects.map((obj) => {
                    const isSelected = obj.id === selectedObject

                    const objectProps = {
                        ...obj,
                        rotation: obj.rotation || [0, 0, 0],
                        scale: obj.scale || [1, 1, 1]
                    }

                    if (obj.type === "model") {
                        return (
                            <Model
                                key={obj.id}
                                object={objectProps}
                                isSelected={isSelected}
                                onSelect={setSelectedObject}
                                transformMode={getTransformMode()}
                            />
                        )
                    } else if (obj.type === "image") {
                        return <Image key={obj.id} object={objectProps} isSelected={isSelected} onSelect={setSelectedObject} />
                    } else if (obj.type === "video") {
                        return <Video key={obj.id} object={objectProps} isSelected={isSelected} onSelect={setSelectedObject} />
                    } else if (obj.type === "audio") {
                        return <Audio key={obj.id} object={objectProps} isSelected={isSelected} onSelect={setSelectedObject} />
                    }

                    return null
                })}
            </group>

            {selectedObject && activeTool !== "select" && (
                <TransformControls
                    ref={transformRef}
                    object={scene.getObjectByName(selectedObject)}
                    mode={getTransformMode()}
                    size={1}
                />
            )}
        </>
    )
}