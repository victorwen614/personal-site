export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 text-gray-900 px-6 py-12">
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Header */}
        <section className="flex flex-col md:flex-row items-center gap-6">
          <div className="w-28 h-28 rounded-full bg-gray-200 flex items-center justify-center text-2xl font-bold">
            HW
          </div>
          <div>
            <h1 className="text-3xl font-bold">Hanyao Wen</h1>
            <p className="text-gray-600 mt-1">
              Computer Science Undergraduate · University of Waterloo
            </p>
            <p className="mt-3 text-sm max-w-xl">
              CS student interested in software engineering, systems programming,
              and building reliable, well-structured software.
            </p>
          </div>
        </section>

        {/* Skills */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Skills</h2>
          <ul className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
            <li>• C++ (OOP, Big-5, STL)</li>
            <li>• Python</li>
            <li>• Git / Linux</li>
            <li>• Object-Oriented Design</li>
            <li>• Design Patterns</li>
            <li>• React / Next.js (Basic)</li>
          </ul>
        </section>

        {/* Projects */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Projects</h2>
          <div className="space-y-4 text-sm">
            <div>
              <p className="font-medium">Biquadris (C++)</p>
              <p className="text-gray-600">
                Large-scale object-oriented C++ project using Observer pattern,
                dynamic memory management, and modular design.
              </p>
            </div>
            <div>
              <p className="font-medium">Wordle Clone</p>
              <p className="text-gray-600">
                Terminal-based game with clean separation of logic and I/O.
              </p>
            </div>
            <div>
              <p className="font-medium">Minecraft Modded Server Setup</p>
              <p className="text-gray-600">
                Configuration, optimization, and troubleshooting of modded
                Minecraft servers.
              </p>
            </div>
          </div>
        </section>

        {/* Education */}
        <section>
          <h2 className="text-xl font-semibold mb-2">Education</h2>
          <p className="text-sm">
            <strong>University of Waterloo</strong><br />
            Relevant Coursework: CS 245, CS 246, STAT 231
          </p>
        </section>

        {/* Footer */}
        <footer className="pt-8 text-xs text-gray-500">
          © 2026 Hanyao Wen
        </footer>
      </div>
    </main>
  );
}

