import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useAuth } from '@/context/AuthContext'
import { useToast } from '@/context/ToastContext'
import { authService } from '@/services/auth'
import { APP_SHORT_NAME } from '@/utils/constants'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

export function BasicCheckout() {
  const { user, refresh } = useAuth()
  const { push } = useToast()
  const navigate = useNavigate()
  const [baazexId, setBaazexId] = useState('')
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    setBaazexId(user?.baazexId ?? '')
  }, [user?.baazexId])

  async function save() {
    if (!user) {
      navigate('/login', { state: { from: '/engine' } })
      return
    }
    const trimmed = baazexId.trim()
    if (!trimmed) {
      push('error', `Enter your ${APP_SHORT_NAME} ID.`)
      return
    }
    setBusy(true)
    try {
      const saved = await authService.updateProfile(user.id, { baazexId: trimmed })
      if (!saved) throw new Error(`Could not save the ${APP_SHORT_NAME} ID.`)
      await refresh()
      push('success', `${APP_SHORT_NAME} ID saved`)
    } catch (error) {
      push('error', error instanceof Error ? error.message : `Could not save the ${APP_SHORT_NAME} ID.`)
    } finally {
      setBusy(false)
    }
  }

  if (!user) {
    return (
      <div className="space-y-4">
        <p className="text-sm leading-6 text-ink/80">Sign in to save a {APP_SHORT_NAME} ID. Five engine questions are included.</p>
        <Button className="w-full" onClick={() => navigate('/login', { state: { from: '/engine' } })}>
          Sign in
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <p className="text-sm leading-6 text-ink/80">
        Five engine questions are included. A {APP_SHORT_NAME} deposit adds 15% of the amount as questions. A $100 deposit adds 15 questions.
      </p>
      <div className="rounded-2xl bg-white p-3 ring-1 ring-line">
        <Input
          label={`${APP_SHORT_NAME} ID`}
          placeholder={`Your ${APP_SHORT_NAME} client ID`}
          value={baazexId}
          autoComplete="off"
          className="bg-canvas"
          onChange={(event) => setBaazexId(event.target.value)}
        />
        <Button className="mt-3 w-full" loading={busy} onClick={() => void save()}>
          Save {APP_SHORT_NAME} ID
        </Button>
      </div>
    </div>
  )
}
