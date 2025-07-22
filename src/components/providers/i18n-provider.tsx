'use client'

import { I18nProviderClient } from '@/lib/i18n/client'
import type { ReactNode } from 'react'

export function I18nProvider({
  locale,
  children
}: {
  locale: string
  children: ReactNode
}) {
  return (
    <I18nProviderClient locale={locale} fallback={<p>Loading...</p>}>
      {children}
    </I18nProviderClient>
  )
}
