            {/* TAB CONTENT: POSTS */}
            {activeTab === 'posts' && (
              <div className="space-y-4 animate-fadeIn pb-6">
                {fetchedPosts.length === 0 ? (
                  <div className="text-center p-6 space-y-2">
                    <div className="text-4xl">📭</div>
                    <p className="text-xs text-slate-400 font-bold">{window.loc('پستی وجود ندارد', 'No posts available')}</p>
                  </div>
                ) : (
                  fetchedPosts.map(post => (
                    <div key={post.id} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 relative">
                      <div className="flex items-center gap-2">
                        <img src={post.userAvatar || user.avatar || ''} alt={post.username} className="w-8 h-8 rounded-full border border-slate-700" />
                        <div>
                          <div className="font-bold text-white text-xs">{post.username}</div>
                          <div className="text-[10px] text-slate-400">{post.time}</div>
                        </div>
                      </div>
                      
                      {post.caption && (
                        <p className="text-xs text-slate-300 leading-relaxed dir-rtl">{post.caption}</p>
                      )}
                      
                      {post.imageUrl && (
                        <div className="rounded-xl overflow-hidden max-h-64 mt-2">
                          <img src={post.imageUrl} alt="post" className="w-full h-full object-cover" />
                        </div>
                      )}
                      
                      {post.videoUrl && (
                        <div className="rounded-xl overflow-hidden max-h-64 mt-2">
                          <video src={post.videoUrl} controls className="w-full h-full object-cover" />
                        </div>
                      )}

                      <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                         <div className="flex items-center gap-4 text-slate-400 text-xs">
                           <button className="flex items-center gap-1.5 hover:text-pink-400 transition">
                             <Heart className="w-4 h-4" />
                             <span>{post.likes}</span>
                           </button>
                           <button className="flex items-center gap-1.5 hover:text-cyan-400 transition">
                             <MessageSquare className="w-4 h-4" />
                             <span>{post.comments}</span>
                           </button>
                         </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
