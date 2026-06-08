import { getApiDocs } from "@/lib/swagger";
import ReactSwagger from "./ReactSwagger";

export default async function IndexPage() {
  const spec = await getApiDocs();
  return (
    <div className="min-h-screen bg-gray-50 py-10 md:py-20">
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
          <div className="px-6 py-8 border-b border-gray-100 bg-white">
            <h1 className="text-3xl font-extrabold text-[#193D66] tracking-tight">API Documentation</h1>
            <p className="mt-2 text-gray-500">Explore and test our API endpoints</p>
          </div>
          <div className="p-0 md:p-4">
            <ReactSwagger spec={spec} />
          </div>
        </div>
      </section>
    </div>
  );
}
