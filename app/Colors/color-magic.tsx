"use client"

/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable prefer-const */

import { useState, useCallback } from 'react'
import { useToast } from "@/components/ui/use-toast"
import { ToastProvider, ToastViewport } from "@/components/ui/toast"
import { Paintbrush, Plus, Minus, Copy, RefreshCw ,WandSparkles } from 'lucide-react'
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"

export function ColorMagicComponent() {
  const { toast } = useToast()

  // Gradient state
  const [gradientColors, setGradientColors] = useState(['#10b981', '#0ea5e9'])
  const [gradientType, setGradientType] = useState('linear')
  const [angle, setAngle] = useState(90)
  const [stops, setStops] = useState([0, 100])
  const [isRepeating, setIsRepeating] = useState(false)

  // Enhanced Palette state
  const [baseColors, setBaseColors] = useState(['#10b981', '#0ea5e9'])
  const [paletteType, setPaletteType] = useState('monochromatic')
  const [paletteColors, setPaletteColors] = useState([
    ['#10b981', '#2980b9', '#1abc9c', '#16a085', '#2ecc71'],
    ['#0ea5e9', '#c0392b', '#e67e22', '#d35400', '#f39c12']
  ])

  // Gradient functions
  const addGradientColor = () => {
    if (gradientColors.length < 5) {
      setGradientColors([...gradientColors, '#ffffff'])
      setStops([...stops, 100])
    }
  }

  const removeGradientColor = (index: number) => {
    if (gradientColors.length > 2) {
      const newColors = gradientColors.filter((_, i) => i !== index)
      const newStops = stops.filter((_, i) => i !== index)
      setGradientColors(newColors)
      setStops(newStops)
    }
  }

  const updateGradientColor = (index: number, color: string) => {
    const newColors = [...gradientColors]
    newColors[index] = color
    setGradientColors(newColors)
  }

  const updateStop = (index: number, value: number) => {
    const newStops = [...stops]
    newStops[index] = value
    setStops(newStops)
  }

  const gradientStyle = {
    background: `${isRepeating ? 'repeating-' : ''}${gradientType}-gradient(${
      gradientType === 'linear' ? `${angle}deg` : 'circle'
    }, ${gradientColors.map((color, index) => `${color} ${stops[index]}%`).join(', ')})`,
  }

  const gradientCSS = `background: ${isRepeating ? 'repeating-' : ''}${gradientType}-gradient(${
    gradientType === 'linear' ? `${angle}deg` : 'circle'
  }, ${gradientColors.map((color, index) => `${color} ${stops[index]}%`).join(', ')});`

  const gradientTailwind = `bg-gradient-to-r from-[${gradientColors[0]}] to-[${gradientColors[gradientColors.length - 1]}]`

  const copyGradientCSS = useCallback(() => {
    navigator.clipboard.writeText(gradientCSS)
    toast({
      title: "Gradient CSS Copied",
      description: "The gradient CSS has been copied to your clipboard.",
    })
  }, [gradientCSS, toast])

  const copyGradientTailwind = useCallback(() => {
    navigator.clipboard.writeText(gradientTailwind)
    toast({
      title: "Gradient Tailwind Copied",
      description: "The gradient Tailwind classes have been copied to your clipboard.",
    })
  }, [gradientTailwind, toast])

  const randomizeGradient = () => {
    const newColors = gradientColors.map(() => `#${Math.floor(Math.random()*16777215).toString(16)}`)
    setGradientColors(newColors)
    setAngle(Math.floor(Math.random() * 360))
  }

  // Enhanced Palette functions
  const addBaseColor = () => {
    if (baseColors.length < 5) {
      setBaseColors([...baseColors, '#ffffff'])
      setPaletteColors([...paletteColors, ['#ffffff', '#e6e6e6', '#cccccc', '#b3b3b3', '#999999']])
    }
  }

  const removeBaseColor = (index: number) => {
    if (baseColors.length > 1) {
      setBaseColors(baseColors.filter((_, i) => i !== index))
      setPaletteColors(paletteColors.filter((_, i) => i !== index))
    }
  }

  const updateBaseColor = (index: number, color: string) => {
    const newBaseColors = [...baseColors]
    newBaseColors[index] = color
    setBaseColors(newBaseColors)
    generatePalette(newBaseColors)
  }

  const generatePalette = (colors = baseColors) => {
    const newPaletteColors = colors.map(color => {
      switch (paletteType) {
        case 'monochromatic':
          return generateMonochromatic(color)
        case 'analogous':
          return generateAnalogous(color)
        case 'complementary':
          return generateComplementary(color)
        case 'triadic':
          return generateTriadic(color)
        default:
          return generateMonochromatic(color)
      }
    })
    setPaletteColors(newPaletteColors)
  }

  const generateMonochromatic = (baseColor: string) => {
    const hsl = hexToHSL(baseColor)
    return [
      baseColor,
      hslToHex(hsl.h, hsl.s, Math.max(0, hsl.l - 20)),
      hslToHex(hsl.h, Math.max(0, hsl.s - 20), hsl.l),
      hslToHex(hsl.h, Math.min(100, hsl.s + 20), hsl.l),
      hslToHex(hsl.h, hsl.s, Math.min(100, hsl.l + 20)),
    ]
  }

  const generateAnalogous = (baseColor: string) => {
    const hsl = hexToHSL(baseColor)
    return [
      baseColor,
      hslToHex((hsl.h - 30 + 360) % 360, hsl.s, hsl.l),
      hslToHex((hsl.h + 30) % 360, hsl.s, hsl.l),
      hslToHex((hsl.h - 60 + 360) % 360, hsl.s, hsl.l),
      hslToHex((hsl.h + 60) % 360, hsl.s, hsl.l),
    ]
  }

  const generateComplementary = (baseColor: string) => {
    const hsl = hexToHSL(baseColor)
    return [
      baseColor,
      hslToHex((hsl.h + 180) % 360, hsl.s, hsl.l),
      hslToHex(hsl.h, Math.max(0, hsl.s - 30), hsl.l),
      hslToHex((hsl.h + 180) % 360, Math.max(0, hsl.s - 30), hsl.l),
      hslToHex(hsl.h, Math.min(100, hsl.s + 30), hsl.l),
    ]
  }

  const generateTriadic = (baseColor: string) => {
    const hsl = hexToHSL(baseColor)
    return [
      baseColor,
      hslToHex((hsl.h + 120) % 360, hsl.s, hsl.l),
      hslToHex((hsl.h + 240) % 360, hsl.s, hsl.l),
      hslToHex(hsl.h, Math.max(0, hsl.s - 30), hsl.l),
      hslToHex(hsl.h, Math.min(100, hsl.s + 30), hsl.l),
    ]
  }

  const hexToHSL = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    if (!result) return { h: 0, s: 0, l: 0 }
    let r = parseInt(result[1], 16)
    let g = parseInt(result[2], 16)
    let b = parseInt(result[3], 16)
    r /= 255, g /= 255, b /= 255
    const max = Math.max(r, g, b), min = Math.min(r, g, b)
    let h = 0, s = 0, l = (max + min) / 2
    if (max !== min) {
      const d = max - min
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break
        case g: h = (b - r) / d + 2; break
        case b: h = (r - g) / d + 4; break
      }
      h /= 6
    }
    return { h: h * 360, s: s * 100, l: l * 100 }
  }

  const hslToHex = (h: number, s: number, l: number) => {
    l /= 100
    const a = s * Math.min(l, 1 - l) / 100
    const f = (n: number) => {
      const k = (n + h / 30) % 12
      const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1)
      return Math.round(255 * color).toString(16).padStart(2, '0')
    }
    return `#${f(0)}${f(8)}${f(4)}`
  }

  const copyPaletteColors = useCallback(() => {
    const paletteCSS = paletteColors.flat().map(color => `color: ${color};`).join('\n')
    navigator.clipboard.writeText(paletteCSS)
    toast({
      title: "Palette Colors Copied",
      description: "The palette colors CSS has been copied to your clipboard.",
    })
  }, [paletteColors, toast])

  const copyPaletteTailwind = useCallback(() => {
    const paletteTailwind = paletteColors.flat().map(color => `text-[${color}]`).join(' ')
    navigator.clipboard.writeText(paletteTailwind)
    toast({
      title: "Palette Tailwind Copied",
      description: "The palette Tailwind classes have been copied to your clipboard.",
    })
  }, [paletteColors, toast])

  return (
    <ToastProvider>
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white font-mono text-center">
        <header className="bg-white dark:bg-gray-800 py-4 shadow-md ">
          <div className="container mx-auto px-4 flex items-center justify-between">
            <h1 className="text-3xl font-bold flex items-center">
              <WandSparkles className="w-8 h-8 mr-2 inline-block text-emerald-500"  />
              <span className="bg-gradient-to-r from-emerald-500 to-sky-500 text-transparent bg-clip-text">
                Color Magic
              </span>
              <Paintbrush className="w-8 h-8 ml-2 inline-block text-sky-500" />
            </h1>
            <ThemeToggle />
          </div>
        </header>
        
        <main className="container mx-auto px-4 py-8">
          <Tabs defaultValue="gradient" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-gray-100 rounded-lg p-0.5 border border-gray-200">
              <TabsTrigger 
                value="gradient" 
                className="rounded-md py-1.5 px-2 font-semibold text-sm text-gray-600 data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm transition-all flex items-center justify-center h-8"
              >
                Gradient
              </TabsTrigger>
              <TabsTrigger 
                value="palette" 
                className="rounded-md py-1.5 px-2 font-semibold text-sm text-gray-600 data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm transition-all flex items-center justify-center h-8"
              >
                Palette
              </TabsTrigger>
            </TabsList>
            <TabsContent value="gradient" className="mt-6 bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
              <div className="h-40 rounded-lg" style={gradientStyle}></div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-4">
                  <Label htmlFor="gradient-colors" className="block font-semibold mt-4 mb-2">Colors</Label>
                  {gradientColors.map((color, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Input
                        type="color"
                        value={color}
                        onChange={(e) => updateGradientColor(index, e.target.value)}
                        className="w-12 h-12 p-1 rounded bg-transparent"
                      />
                      <Input
                        type="text"
                        value={color}
                        onChange={(e) => updateGradientColor(index, e.target.value)}
                        className="flex-grow bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-700"
                      />
                      <Slider
                        value={[stops[index]]}
                        onValueChange={(value) => updateStop(index, value[0])}
                        max={100}
                        step={1}
                        className="w-24 cursor-pointer hover:scale-105 transition-all duration-300"
                      />
                      {gradientColors.length > 2 && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeGradientColor(index)}
                          className="text-red-500 bg-white p-3 rounded hover:text-crimson hover:scale-105 transition-all duration-300"
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                  {gradientColors.length < 5 && (
                    <Button 
                      onClick={addGradientColor} 
                      className="w-full flex items-center justify-center bg-white text-gray-900 hover:bg-gray-100 hover:text-gray-900 border border-gray-300 transition-colors duration-200"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Color
                    </Button>
                  )}
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="gradient-type" className="block font-semibold mt-4 mb-2">Gradient Type</Label>
                    <Select value={gradientType} onValueChange={setGradientType}>
                      <SelectTrigger id="gradient-type" className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-700">
                        <SelectValue placeholder="Select gradient type" />
                      </SelectTrigger>
                      <SelectContent className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
                        <SelectItem value="linear">Linear</SelectItem>
                        <SelectItem value="radial">Radial</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {gradientType === 'linear' && (
                    <div className="space-y-2">
                      <Label htmlFor="angle">Angle (degrees)</Label>
                      <div className="flex items-center space-x-2">
                        <Input
                          id="angle"
                          type="number"
                          value={angle}
                          onChange={(e) => setAngle(Number(e.target.value))}
                          min="0"
                          max="360"
                          className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white w-20 border border-gray-300 dark:border-gray-700"
                        />
                        <div className="relative w-full h-2 bg-gray-300 rounded-full ">
                          <Slider
                            value={[angle]}
                            onValueChange={(value) => setAngle(value[0])}
                            max={360}
                            step={1}
                            className="absolute inset-0 cursor-pointer "
                            style={{
                              
                              // Estilos para el track del slider
                              '--slider-track-background': '#D1D5DB', // Gris claro
                              '--slider-range-background': '#f4f4f4 ', // Gris claro para la parte activa
                            } as React.CSSProperties}
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center space-x-2 mt-4">
                    <Switch
                      id="repeating-gradient"
                      checked={isRepeating}
                      onCheckedChange={setIsRepeating}
                      className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-white focus:outline-none"
                      style={{
                        backgroundColor: isRepeating ? 'rgb(16, 185, 129)' : 'rgb(229, 231, 235)'
                      }}
                    >
                      <span
                        className={`${
                          isRepeating ? 'translate-x-6' : 'translate-x-1'
                        } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                      />
                    </Switch>
                    <Label htmlFor="repeating-gradient" className="font-semibold text-sm">
                      Repeating Gradient
                    </Label>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="css-output" className="block font-semibold mt-6 mb-2">CSS Output</Label>
                <div className="flex space-x-2">
                  <Input id="css-output"
                    value={gradientCSS}
                    readOnly
                    className="flex-grow bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-100"
                  />
                  <Button onClick={copyGradientCSS} className="flex items-center justify-center bg-white text-gray-900 hover:bg-gray-100 hover:text-gray-900 border border-gray-300 transition-colors duration-200">
                    <Copy className="w-4 h-4 mr-2" />
                    Copy CSS
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="tailwind-output" className="block font-semibold mt-6 mb-2">Tailwind Output</Label>
                <div className="flex space-x-2">
                  <Input id="tailwind-output"
                    value={gradientTailwind}
                    readOnly
                    className="flex-grow bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-100"
                  />
                  <Button onClick={copyGradientTailwind} className="flex items-center justify-center bg-white text-gray-900 hover:bg-gray-100 hover:text-gray-900 border border-gray-300 transition-colors duration-200">
                    <Copy className="w-4 h-4 mr-2" />
                    Copy Tailwind
                  </Button>
                </div>
              </div>

              <Button 
                onClick={randomizeGradient} 
                className="w-full flex items-center justify-center bg-white text-gray-900 hover:bg-gray-100 hover:text-gray-900 border border-gray-300 py-3 px-4 group transition-colors duration-200 mt-4"
              >
                <RefreshCw className="w-5 h-5 mr-2 group-hover:text-emerald-500 group-hover:animate-spin transition-all duration-300" />
                Randomize Gradient
              </Button>
            </TabsContent>

            <TabsContent value="palette" className="mt-6 bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
              <div className="space-y-4">
                <div className="flex flex-col space-y-2">
                  <Label>Base Colors</Label>
                  {baseColors.map((color, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Input
                        type="color"
                        value={color}
                        onChange={(e) => updateBaseColor(index, e.target.value)}
                        className="w-12 h-12 p-1 rounded bg-transparent"
                      />
                      <Input
                        type="text"
                        value={color}
                        onChange={(e) => updateBaseColor(index, e.target.value)}
                        className="flex-grow bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-700"
                      />
                      {baseColors.length > 1 && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeBaseColor(index)}
                          className="text-red-500 hover:text-red-600 bg-white hover:bg-gray-100 rounded-full p-2 transition-all duration-300"
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                  {baseColors.length < 5 && (
                    <Button 
                      onClick={addBaseColor} 
                      className="w-full flex items-center justify-center bg-white text-gray-900 hover:bg-gray-100 hover:text-gray-900 border border-gray-300 transition-colors duration-200"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Color
                    </Button>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="palette-type">Palette Type</Label>
                  <Select value={paletteType} onValueChange={setPaletteType}>
                    <SelectTrigger id="palette-type" className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-700">
                      <SelectValue placeholder="Select palette type" />
                    </SelectTrigger>
                    <SelectContent className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
                      <SelectItem value="monochromatic">Monochromatic</SelectItem>
                      <SelectItem value="analogous">Analogous</SelectItem>
                      <SelectItem value="complementary">Complementary</SelectItem>
                      <SelectItem value="triadic">Triadic</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button 
                  onClick={() => generatePalette()} 
                  className="w-full bg-white text-gray-900 hover:bg-gray-100 hover:text-gray-900 border border-gray-300 transition-colors duration-200 mb-6"
                >
                  Generate Palette
                </Button>
                <div className="space-y-4">
                  {paletteColors.map((palette, index) => (
                    <div key={index} className="grid grid-cols-5 gap-2">
                      {palette.map((color, colorIndex) => (
                        <div key={colorIndex} className="flex flex-col items-center">
                          <div
                            className="w-16 h-16 rounded-full"
                            style={{ backgroundColor: color }}
                          ></div>
                          <span className="mt-1 text-xs text-gray-700 dark:text-gray-300">{color}</span>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
                <div className="flex space-x-2">
                  <Button onClick={copyPaletteColors} className="flex-1 flex items-center justify-center bg-white text-gray-900 hover:bg-gray-200">
                    <Copy className="w-4 h-4 mr-2" />
                    Copy CSS
                  </Button>
                  <Button onClick={copyPaletteTailwind} className="flex-1 flex items-center justify-center bg-white text-gray-900 hover:bg-gray-200">
                    <Copy className="w-4 h-4 mr-2" />
                    Copy Tailwind
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </main>
        <ToastViewport />
      </div>
    </ToastProvider>
  )
}