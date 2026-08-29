            {/* BOTTOM 3-CARD GRID */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Card 1: Reconstruction status */}
              <div className="rounded-2xl border border-[#DDD7CB] bg-[#FBF8F2] p-5 shadow-sm flex flex-col justify-between">
                <div>
                  <h3 className="text-[15px] font-bold text-stone-900 pb-3">
                    Reconstruction status
                  </h3>
                  
                  <div className="relative overflow-hidden rounded-xl border border-[#DDD7CB] bg-stone-900 aspect-[16/10]">
                    <img
                      src={propKitchenImg}
                      alt="Kitchen to dining connection"
                      className="h-full w-full object-cover opacity-85"
                    />
                    <div className="absolute top-2.5 left-2.5">
                      <span className="rounded-md bg-black/60 backdrop-blur-md px-2 py-0.5 text-[10.5px] font-medium text-white border border-white/20">
                        Kitchen-to-dining connection
                      </span>
                    </div>
                    <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center gap-2 rounded-lg bg-black/70 backdrop-blur-md px-2.5 py-1.5 text-[11px] text-white">
                      <span className="h-2 w-2 rounded-full bg-emerald-400 shrink-0 animate-pulse" />
                      <span className="truncate font-medium">Connecting living room to balcony</span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 text-[12px] text-stone-500">
                  Reconstruction underway
                </div>
              </div>

              {/* Card 2: Property evidence */}
              <div className="rounded-2xl border border-[#DDD7CB] bg-[#FBF8F2] p-5 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between pb-3">
                    <h3 className="text-[15px] font-bold text-stone-900">
                      Property evidence
                    </h3>
                    <div className="flex items-center gap-2 font-mono text-[11px] text-stone-500">
                      <span><strong>7</strong> Exp</span>
                      <span><strong>7</strong> Cap</span>
                      <span><strong>1</strong> Res</span>
                    </div>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="flex items-center justify-between py-1 border-b border-[#DDD7CB]/40">
                      <span className="font-medium text-stone-800">Entrance</span>
                      <div className="flex items-center gap-2">
                        <span className="text-emerald-700 font-medium text-[11px]">✓ Captured</span>
                        <span className="text-stone-500 text-[11px]">Phone capture</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between py-1 border-b border-[#DDD7CB]/40">
                      <span className="font-medium text-stone-800">Living room</span>
                      <div className="flex items-center gap-2">
                        <span className="text-emerald-700 font-medium text-[11px]">✓ Captured</span>
                        <span className="text-stone-500 text-[11px]">Phone capture</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between py-1 border-b border-[#DDD7CB]/40">
                      <span className="font-medium text-stone-800">Kitchen</span>
                      <div className="flex items-center gap-2">
                        <span className="text-emerald-700 font-medium text-[11px]">✓ Captured</span>
                        <span className="text-stone-500 text-[11px]">Phone capture</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between py-1 border-b border-[#DDD7CB]/40">
                      <span className="font-medium text-stone-800">Main bedroom</span>
                      <div className="flex items-center gap-2">
                        <span className="text-emerald-700 font-medium text-[11px]">✓ Captured</span>
                        <span className="text-stone-500 text-[11px]">Phone capture</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between py-1 border-b border-[#DDD7CB]/40">
                      <span className="font-medium text-stone-800">Bedroom 2</span>
                      <div className="flex items-center gap-2">
                        <span className="text-emerald-700 font-medium text-[11px]">✓ Captured</span>
                        <span className="text-stone-500 text-[11px]">Phone capture</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between py-1">
                      <span className="font-medium text-stone-800">Balcony</span>
                      <div className="flex items-center gap-2">
                        <span className="text-emerald-700 font-medium text-[11px]">✓ Recaptured</span>
                        <span className="text-emerald-700 font-medium text-[11px]">Verified</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 3: Recent activity */}
              <div className="rounded-2xl border border-[#DDD7CB] bg-[#FBF8F2] p-5 shadow-sm flex flex-col justify-between">
                <div>
                  <h3 className="text-[15px] font-bold text-stone-900 pb-3">
                    Recent activity
                  </h3>

                  <div className="space-y-2.5 text-xs">
                    <div className="space-y-0.5">
                      <div className="flex items-start justify-between">
                        <span className="font-semibold text-stone-900 truncate max-w-[220px]">
                          <span className="text-stone-500 font-mono text-[11px] mr-1.5">14:02</span>
                          Additional balcony footage receiv...
                        </span>
                      </div>
                      <p className="text-[11px] text-stone-500 pl-11">New media uploaded</p>
                    </div>

                    <div className="space-y-0.5">
                      <div className="flex items-start justify-between">
                        <span className="font-semibold text-stone-900">
                          <span className="text-stone-500 font-mono text-[11px] mr-1.5">14:03</span>
                          Capture quality passed
                        </span>
                      </div>
                      <p className="text-[11px] text-stone-500 pl-11">All footage verified</p>
                    </div>

                    <div className="space-y-0.5">
                      <div className="flex items-start justify-between">
                        <span className="font-semibold text-stone-900">
                          <span className="text-stone-500 font-mono text-[11px] mr-1.5">14:04</span>
                          Reconstruction resumed
                        </span>
                      </div>
                      <p className="text-[11px] text-stone-500 pl-11">Building connected experience</p>
                    </div>

                    <div className="space-y-0.5">
                      <div className="flex items-start justify-between">
                        <span className="font-semibold text-stone-900">
                          <span className="text-stone-500 font-mono text-[11px] mr-1.5">14:08</span>
                          Living room & balcony connected
                        </span>
                      </div>
                      <p className="text-[11px] text-stone-500 pl-11">Spatial connection established</p>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-[#DDD7CB]/50">
                  <button
                    type="button"
                    onClick={() => setShowActivityModal(true)}
                    className="w-full py-2 px-3 text-center text-xs font-semibold text-stone-800 bg-white border border-[#DDD7CB] rounded-xl hover:bg-[#F2EEE5] transition-colors"
                  >
                    View all activity
                  </button>
                </div>
              </div>

            </div>