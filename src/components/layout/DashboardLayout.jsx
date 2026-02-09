export default function DashboardLayout({ topbar, sidebar, children }) {
  return (
    <div className="w-full min-h-dvh bg-[#F2F3F5] flex flex-col lg:justify-center">
      
      <div className="w-full max-w-360 mx-auto flex flex-col lg:flex-row-reverse">

        {/* MAIN */}
        <div className="flex-1 flex flex-col">

          {/* TOP BAR */}
          <div className="h-24 flex items-center px-4 sm:px-6">
            {topbar}
          </div>

          {/* CONTENT */}
          <div className="flex-1 px-4 sm:px-6 pb-8">
            <div className="w-full max-w-7xl mx-auto">
              {children}
            </div>
          </div>

        </div>

        {/* SIDEBAR */}
        <div className="lg:w-65 pt-6 pr-6">
          {sidebar}
        </div>

      </div>
    </div>
  );
}
