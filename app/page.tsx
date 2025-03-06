"use client"

import { useEffect, useState } from "react"
import { initializeApp, FirebaseApp } from "firebase/app"
import { getStorage, FirebaseStorage } from "firebase/storage"
import AREditor from "../components/ar-editor"
import "../styles/globals.css"

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDT6Dd49VhGjMn6VuYEg8uv7SVJ5_HpveY",
  authDomain: "visiarisestudio-3813e.firebaseapp.com",
  projectId: "visiarisestudio-3813e",
  storageBucket: "visiarisestudio-3813e.firebasestorage.app",
  messagingSenderId: "808663717080",
  appId: "1:808663717080:web:c3264e47c1afde7ced73ad",
  measurementId: "G-49P84LJS0G",
}

export default function Home() {
  const [storage, setStorage] = useState<FirebaseStorage | null>(null) // Corrected type

  useEffect(() => {
    // Initialize Firebase only if it hasn't been initialized
    const app: FirebaseApp = initializeApp(firebaseConfig)

    // Initialize Firebase Storage
    const storageInstance: FirebaseStorage = getStorage(app)
    setStorage(storageInstance)
  }, [])

  return (
    <main>
      <h1>VisiARise Studio</h1>
      {storage && <AREditor storage={storage} />}
    </main>
  )
}
