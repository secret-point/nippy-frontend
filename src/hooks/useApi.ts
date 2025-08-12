import { useState, useEffect } from 'react'

interface ApiState<T> {
  data: T | null
  loading: boolean
  error: string | null
}

export function useApi<T>(
  apiFunction: () => Promise<T>,
  dependencies: any[] = []
) {
  const [state, setState] = useState<ApiState<T>>({
    data: null,
    loading: true,
    error: null
  })

  useEffect(() => {
    let isMounted = true

    const fetchData = async () => {
      setState(prev => ({ ...prev, loading: true, error: null }))
      
      try {
        const result = await apiFunction()
        if (isMounted) {
          setState({ data: result, loading: false, error: null })
        }
      } catch (error) {
        if (isMounted) {
          setState({
            data: null,
            loading: false,
            error: error instanceof Error ? error.message : 'An error occurred'
          })
        }
      }
    }

    fetchData()

    return () => {
      isMounted = false
    }
  }, dependencies)

  const refetch = () => {
    setState(prev => ({ ...prev, loading: true, error: null }))
    apiFunction()
      .then(data => setState({ data, loading: false, error: null }))
      .catch(error => setState({
        data: null,
        loading: false,
        error: error instanceof Error ? error.message : 'An error occurred'
      }))
  }

  return { ...state, refetch }
}
