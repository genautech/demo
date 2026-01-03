"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Camera, RotateCcw, Maximize2, X, Scan, Box } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ResponsiveModal } from "@/components/ui/responsive-modal"
import { cn } from "@/lib/utils"

interface ARPreviewProps {
  productId: string
  productName: string
  productImages?: string[]
  className?: string
}

interface ARModel {
  id: string
  name: string
  url: string
  scale: number
  rotation: { x: number; y: number; z: number }
}

export function ARPreview({ 
  productId, 
  productName, 
  productImages = [], 
  className 
}: ARPreviewProps) {
  const [isARSupported, setIsARSupported] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [selectedModel, setSelectedModel] = useState<ARModel | null>(null)
  const [arMode, setArMode] = useState<"view" | "ar">("view")
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    checkARSupport()
  }, [])

  const checkARSupport = async () => {
    if (navigator.xr) {
      try {
        const isVRSupported = await navigator.xr.isSessionSupported('immersive-vr')
        const isARSupported = await navigator.xr.isSessionSupported('immersive-ar')
        setIsARSupported(isARSupported || isVRSupported)
      } catch {
        setIsARSupported(false)
      }
    } else {
      setIsARSupported(false)
    }
  }

  const simulateARModels = (): ARModel[] => {
    return [
      {
        id: `${productId}_model_1`,
        name: "Standard View",
        url: productImages[0] || "/placeholder.jpg",
        scale: 1.0,
        rotation: { x: 0, y: 0, z: 0 }
      },
      {
        id: `${productId}_model_2`,
        name: "Detailed View",
        url: productImages[1] || productImages[0] || "/placeholder.jpg",
        scale: 1.2,
        rotation: { x: 0, y: 90, z: 0 }
      },
      {
        id: `${productId}_model_3`,
        name: "Top View",
        url: productImages[2] || productImages[0] || "/placeholder.jpg",
        scale: 0.8,
        rotation: { x: 90, y: 0, z: 0 }
      }
    ]
  }

  const handleARView = async () => {
    setIsModalOpen(true)
    setIsLoading(true)

    const models = simulateARModels()
    
    await new Promise(resolve => setTimeout(resolve, 1500))
    setSelectedModel(models[0])
    setIsLoading(false)
  }

  const handleStartAR = async () => {
    if (!isARSupported) {
      alert("AR is not supported on this device. This is a demo simulation.")
      return
    }

    setArMode("ar")
    
    try {
      if (navigator.xr) {
        const session = await navigator.xr.requestSession('immersive-ar', {
          requiredFeatures: ['local', 'hit-test']
        })
        
        session.requestReferenceSpace('local').then((referenceSpace) => {
          
        })
      }
    } catch (error) {
      console.log("AR session started in demo mode")
    }
  }

  const rotateModel = (axis: 'x' | 'y' | 'z', degrees: number) => {
    if (!selectedModel) return
    
    setSelectedModel(prev => prev ? {
      ...prev,
      rotation: {
        ...prev.rotation,
        [axis]: prev.rotation[axis] + degrees
      }
    } : null)
  }

  const resetRotation = () => {
    if (!selectedModel) return
    setSelectedModel(prev => prev ? {
      ...prev,
      rotation: { x: 0, y: 0, z: 0 }
    } : null)
  }

  const handleModelSelect = (model: ARModel) => {
    setSelectedModel(model)
    setArMode("view")
  }

  return (
    <div className={cn("relative", className)}>
      <AnimatePresence>
        {isModalOpen && (
          <ResponsiveModal
            open={isModalOpen}
            onOpenChange={setIsModalOpen}
            title="AR Product Preview"
            description={productName}
            maxWidth="2xl"
            className="ar-preview-modal"
          >
            <div className="space-y-4">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-16 space-y-4">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="h-16 w-16 rounded-full border-4 border-primary border-t-transparent"
                  />
                  <p className="text-muted-foreground">Loading AR model...</p>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between">
                    <div className="flex gap-2">
                      {simulateARModels().map((model, index) => (
                        <Button
                          key={model.id}
                          variant={selectedModel?.id === model.id ? "default" : "outline"}
                          size="sm"
                          onClick={() => handleModelSelect(model)}
                        >
                          View {index + 1}
                        </Button>
                      ))}
                    </div>
                    <Badge 
                      variant={arMode === "ar" ? "default" : "secondary"}
                      className="gap-1"
                    >
                      <Box className="h-3 w-3" />
                      {arMode === "ar" ? "AR Mode" : "View Mode"}
                    </Badge>
                  </div>

                  <div className="relative aspect-video bg-muted rounded-lg overflow-hidden">
                    {selectedModel && (
                      <motion.div
                        className="w-full h-full flex items-center justify-center"
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        key={selectedModel.id}
                      >
                        <motion.img
                          src={selectedModel.url}
                          alt={selectedModel.name}
                          className="max-w-full max-h-full object-contain"
                          animate={{
                            rotateX: selectedModel.rotation.x,
                            rotateY: selectedModel.rotation.y,
                            rotateZ: selectedModel.rotation.z,
                            scale: selectedModel.scale
                          }}
                          transition={{ type: "spring", damping: 20 }}
                          style={{
                            transformStyle: 'preserve-3d',
                            transform: `perspective(1000px) rotateX(${selectedModel.rotation.x}deg) rotateY(${selectedModel.rotation.y}deg) rotateZ(${selectedModel.rotation.z}deg) scale(${selectedModel.scale})`
                          }}
                        />
                      </motion.div>
                    )}
                    
                    {arMode === "ar" && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                          <Scan className="h-16 w-16 mx-auto mb-4 animate-pulse" />
                          <p className="text-lg font-medium">AR Camera View</p>
                          <p className="text-sm text-muted-foreground">Point camera at a flat surface</p>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => rotateModel('y', -45)}
                    >
                      <RotateCcw className="h-4 w-4" />
                      Rotate Left
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={resetRotation}
                    >
                      Reset
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => rotateModel('y', 45)}
                    >
                      Rotate Right
                    </Button>
                    {isARSupported && (
                      <Button
                        onClick={handleStartAR}
                        className="gap-1"
                      >
                        <Camera className="h-4 w-4" />
                        Start AR
                      </Button>
                    )}
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => rotateModel('x', -15)}
                    >
                      Tilt Up
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => selectedModel && setSelectedModel({
                        ...selectedModel,
                        scale: selectedModel.scale === 1 ? 1.5 : 1
                      })}
                    >
                      <Maximize2 className="h-4 w-4" />
                      Zoom
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => rotateModel('x', 15)}
                    >
                      Tilt Down
                    </Button>
                  </div>
                </>
              )}
            </div>
          </ResponsiveModal>
        )}
      </AnimatePresence>

      <Button
        onClick={handleARView}
        variant="outline"
        size="sm"
        className="w-full gap-1"
        disabled={!productImages || productImages.length === 0}
      >
        <Box className="h-4 w-4" />
        AR Preview
      </Button>
    </div>
  )
}