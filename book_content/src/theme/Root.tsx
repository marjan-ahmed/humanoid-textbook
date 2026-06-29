import BrowserOnly from '@docusaurus/BrowserOnly';
import type {ReactNode} from 'react';

import ChatAssistant from '../components/ChatAssistant';

export default function Root({children}: {children: ReactNode}) {
  return (
    <>
      {children}
      <BrowserOnly fallback={null}>{() => <ChatAssistant />}</BrowserOnly>
    </>
  );
}
