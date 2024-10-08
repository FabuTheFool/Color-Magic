

import { ColorMagicComponent } from "@/app/Colors/color-magic"
import { ToastProvider, ToastViewport } from "@/components/ui/toast"

export default function Page() {
  return (
    <ToastProvider>
      <ColorMagicComponent />
      <ToastViewport />
    </ToastProvider>
  )
}


