import Image from "next/image";

/**
 * Global loading state — branded.
 * Same composition as the intro sequence (logo + rule, same position),
 * so loading → intro reads as one continuous motion.
 */
export default function Loading() {
  return (
    <div className="fixed inset-0 z-[190] flex items-center justify-center bg-white" role="status" aria-live="polite">
      <div className="flex flex-col items-center">
        <Image
          src="/atalitixlogo.png"
          alt="Atalitix"
          width={260}
          height={70}
          priority
          className="loader-logo h-12 md:h-14 w-auto"
        />
        {/* Track with a light gliding along it */}
        <span className="relative mt-6 block h-px w-48 overflow-hidden bg-[var(--rule)]">
          <span className="loader-glide absolute inset-y-0 left-0 w-1/3 bg-[var(--brand-navy)]" />
        </span>
        <span className="sr-only">Yükleniyor</span>
      </div>
    </div>
  );
}
