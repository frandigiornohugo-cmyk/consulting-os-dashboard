import { Menu, PanelLeftClose } from 'lucide-react';
import { UserButton } from '@clerk/clerk-react';

export default function Header({ onToggleCollapse, onOpenMobile }) {
  return (
    <header className="sticky top-0 z-20 flex h-14 flex-none items-center gap-3 px-4 sm:px-6"
            style={{ background: 'var(--bg-primary)', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
      <button
        type="button"
        onClick={onOpenMobile}
        className="rounded-md p-2 text-neutral-500 hover:text-neutral-300 md:hidden"
        aria-label="Open navigation"
      >
        <Menu size={20} />
      </button>

      <button
        type="button"
        onClick={onToggleCollapse}
        className="hidden rounded-md p-2 text-neutral-600 hover:text-neutral-400 md:inline-flex"
        aria-label="Toggle sidebar"
      >
        <PanelLeftClose size={20} />
      </button>

      <div className="ml-auto flex items-center gap-2">
        <UserButton
          afterSignOutUrl="/"
          appearance={{
            elements: {
              avatarBox: 'w-8 h-8',
            },
          }}
        />
      </div>
    </header>
  );
}
