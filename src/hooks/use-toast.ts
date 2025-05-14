
// This file re-exports the toast functionality from the UI components
import { 
  ToastProvider,
  ToastViewport, 
  ToastClose,
  Toast,
  ToastTitle,
  ToastDescription,
} from "@/components/ui/toast"

import { 
  useToast as useToastOriginal, 
  toast 
} from "@/components/ui/use-toast"

// Re-export the toast UI components
export { 
  ToastProvider,
  ToastViewport, 
  ToastClose,
  Toast,
  ToastTitle,
  ToastDescription
}

// Re-export the toast hook and function
export const useToast = useToastOriginal
export { toast }
