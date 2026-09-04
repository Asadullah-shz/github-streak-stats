export default function DeployGuide() {
  return (
    <main className="flex flex-col items-center p-6 sm:p-12 max-w-4xl mx-auto">
      <div className="mb-12 text-center space-y-4">
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-slate-900">
          Deploy Your Own Instance
        </h1>
        <p className="text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
          Take control of your GitHub stats by deploying this API to your own Vercel account. 
          Guarantee 100% uptime with a dedicated GitHub token and Redis caching.
        </p>
      </div>

      <div className="w-full space-y-8 text-slate-800">
        <section className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-700 text-sm">1</span>
            Get a GitHub Personal Access Token
          </h2>
          <div className="pl-11 space-y-3 text-slate-600">
            <p>You need a GitHub PAT to allow the API to securely read contribution data without hitting global rate limits.</p>
            <ol className="list-decimal pl-5 space-y-2">
              <li>Go to <a href="https://github.com/settings/tokens/new" target="_blank" className="text-blue-600 hover:underline">GitHub Developer Settings</a>.</li>
              <li>Name the token (e.g., &quot;Streak Stats Generator&quot;).</li>
              <li>You <strong>do not</strong> need to select any scopes (no permissions required for public profiles). If you want to include private commits, select the <code>repo</code> scope.</li>
              <li>Click <strong>Generate token</strong> and copy it.</li>
            </ol>
          </div>
        </section>

        <section className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-100 text-orange-700 text-sm">2</span>
            Set Up Upstash Redis
          </h2>
          <div className="pl-11 space-y-3 text-slate-600">
            <p>Redis caching ensures your API doesn&apos;t get blocked if your README gets thousands of views in a single day.</p>
            <ol className="list-decimal pl-5 space-y-2">
              <li>Go to <a href="https://upstash.com/" target="_blank" className="text-blue-600 hover:underline">Upstash.com</a> and sign in with GitHub.</li>
              <li>Click <strong>Create Database</strong> (name it whatever you like, e.g., &quot;streak-cache&quot;).</li>
              <li>Once created, scroll down to the <strong>REST API</strong> section.</li>
              <li>Copy the <code>UPSTASH_REDIS_REST_URL</code> and <code>UPSTASH_REDIS_REST_TOKEN</code>.</li>
            </ol>
          </div>
        </section>

        <section className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 text-green-700 text-sm">3</span>
            Deploy to Vercel
          </h2>
          <div className="pl-11 space-y-3 text-slate-600">
            <p>Deploying this codebase to Vercel is free and takes less than 2 minutes.</p>
            <ol className="list-decimal pl-5 space-y-2">
              <li>Push this project to a new repository on your GitHub account.</li>
              <li>Log into <a href="https://vercel.com/new" target="_blank" className="text-blue-600 hover:underline">Vercel</a> and click <strong>Import Project</strong>.</li>
              <li>Select your newly pushed repository.</li>
              <li>In the <strong>Environment Variables</strong> section before deploying, add the following three variables:</li>
            </ol>
            
            <div className="bg-slate-900 rounded-lg p-4 mt-4 text-sm font-mono text-slate-300 overflow-x-auto">
              <div className="mb-2"><span className="text-purple-400">GITHUB_TOKEN</span>=&quot;ghp_your_token_here&quot;</div>
              <div className="mb-2"><span className="text-purple-400">UPSTASH_REDIS_REST_URL</span>=&quot;https://your-database.upstash.io&quot;</div>
              <div><span className="text-purple-400">UPSTASH_REDIS_REST_TOKEN</span>=&quot;your_redis_token_here&quot;</div>
            </div>
            
            <p className="pt-2">Click <strong>Deploy</strong> and you&apos;re done! You now have a 100% uptime, zero-maintenance API.</p>
          </div>
        </section>
      </div>
    </main>
  );
}
