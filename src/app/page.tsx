import ZenithCalendar from "@/components/widgets/ZenithCalendar";

/**
 * Zenith Smart Home Dashboard - Full Screen 7-Day Calendar
 * Minimalist UI focused entirely on schedule visibility.
 */
export default function Home() {
  return (
    <main className="h-screen w-screen overflow-hidden bg-black text-white font-sans">
      <ZenithCalendar />

      {/* Global TV Vignette for depth */}
      <div className="pointer-events-none fixed inset-0 z-50 bg-radial-[circle_at_center,_transparent_70%,_rgba(0,0,0,0.3)_100%]" />
    </main>
  );
}
