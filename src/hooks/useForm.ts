import { useState, useCallback } from 'react'

interface UseFormOptions<T> {
  initialValues: T
  validate?: (values: T) => Partial<Record<keyof T, string>>
  onSubmit?: (values: T) => void | Promise<void>
}

interface UseFormReturn<T> {
  values: T
  errors: Partial<Record<keyof T, string>>
  isLoading: boolean
  updateField: (field: keyof T, value: any) => void
  handleSubmit: (e: React.FormEvent) => void
  clearErrors: () => void
  setFieldError: (field: keyof T, error: string) => void
  resetForm: () => void
}

export function useForm<T extends Record<string, any>>({
  initialValues,
  validate,
  onSubmit
}: UseFormOptions<T>): UseFormReturn<T> {
  const [values, setValues] = useState<T>(initialValues)
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({})
  const [isLoading, setIsLoading] = useState(false)

  const updateField = useCallback((field: keyof T, value: any) => {
    setValues(prev => ({ ...prev, [field]: value }))
    // Clear error when field is updated
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }, [errors])

  const clearErrors = useCallback(() => {
    setErrors({})
  }, [])

  const setFieldError = useCallback((field: keyof T, error: string) => {
    setErrors(prev => ({ ...prev, [field]: error }))
  }, [])

  const resetForm = useCallback(() => {
    setValues(initialValues)
    setErrors({})
    setIsLoading(false)
  }, [initialValues])

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Run validation if provided
    if (validate) {
      const validationErrors = validate(values)
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors)
        return
      }
    }

    // Clear any existing errors
    setErrors({})

    // Run submit handler if provided
    if (onSubmit) {
      try {
        setIsLoading(true)
        await onSubmit(values)
      } catch (error) {
        console.error('Form submission error:', error)
      } finally {
        setIsLoading(false)
      }
    }
  }, [values, validate, onSubmit])

  return {
    values,
    errors,
    isLoading,
    updateField,
    handleSubmit,
    clearErrors,
    setFieldError,
    resetForm
  }
}
