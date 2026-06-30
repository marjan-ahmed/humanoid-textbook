import BrowserOnly from '@docusaurus/BrowserOnly';
import {useEffect, type ReactNode} from 'react';

import ChatAssistant from '../components/ChatAssistant';
import NavbarAuth from '../components/NavbarAuth';
import {AuthProvider} from '../components/Auth/AuthContext';
import {PersonalizationProvider} from '../components/Personalization/PersonalizationContext';
import {initAuth} from '../lib/auth-store';

function Providers({children}: {children: ReactNode}) {
  useEffect(() => {
    initAuth();
  }, []);

  return (
    <AuthProvider>
      <PersonalizationProvider>
        {children}
      </PersonalizationProvider>
    </AuthProvider>
  );
}

export default function Root({children}: {children: ReactNode}) {
  return (
    <BrowserOnly fallback={<>{children}</>}>
      {() => (
        <Providers>
          <NavbarAuth />
          {children}
          <ChatAssistant />
        </Providers>
      )}
    </BrowserOnly>
  );
}
