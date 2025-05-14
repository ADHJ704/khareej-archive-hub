
import * as React from "react"
import { 
  Toast,
  ToastClose, 
  ToastDescription, 
  ToastProvider, 
  ToastTitle, 
  ToastViewport 
} from "@/components/ui/toast"
import { useToast as useToastPrimitive } from "@/components/ui/use-toast"

export const ToastProvider = ToastProvider
export const ToastViewport = ToastViewport
export const ToastClose = ToastClose
export const Toast = Toast
export const ToastTitle = ToastTitle
export const ToastDescription = ToastDescription

export { useToastPrimitive as useToast, toast }
