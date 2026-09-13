  const executeLiveStart = async () => {
    setIsStartingLive(true);
    try {
      // 1. Verify Camera stream is active
      const activeStream = mediaStreamRef.current;
      const activeVideoTrack = activeStream?.getVideoTracks?.()?.find(t => t.readyState === 'live');
      if (!activeStream || !activeVideoTrack) {
        throw new Error('دوربین فعال نیست. لطفاً ابتدا دوربین را فعال کنید.');
      }

      // 2. Create Stream in Supabase (with status: starting)
      const newStreamPayload = {
        host: currentUser?.name || currentUsername || 'Verified Streamer',
        host_id: currentUser?.id,
        avatar: currentUser?.avatar || '',
        title: liveTitle.trim(),
        category: liveCategory,
        live_type: liveType,
        description: liveDesc,
        thumbnail: thumbnailUrl,
        is_ticketed: isTicketedLive,
        ticket_price: isTicketedLive ? Number(ticketPrice) : 0,
        is_vip: isTicketedLive,
        entry_fee: isTicketedLive ? Number(ticketPrice) : 0,
        status: 'starting'
      };
      
      let createdStream = null;
      try {
        const res = await apiLive.createLiveStream(newStreamPayload);
        if (res && res.success && res.data) {
          createdStream = res.data;
        } else {
          throw new Error('Failed to create stream record');
        }
      } catch (dbErr) {
        throw new Error(`خطا در ایجاد رکورد لایو: ${dbErr.message}`);
      }

      // 3. Generate Canonical Room and fetch Token
      const canonicalRoom = `room_${createdStream.id}`;
      let tokenRes = null;
      try {
        tokenRes = await fetchLiveKitToken({
          roomName: canonicalRoom,
          identity: currentUser?.id,
          name: currentUser?.name || currentUsername || 'Host',
          role: 'host'
        });
      } catch (tokErr) {
        await apiLive.endLiveStream(createdStream.id);
        throw new Error('دریافت توکن ارتباطی سرور لایو شکست خورد.');
      }

      if (!tokenRes || !tokenRes.success || !tokenRes.token || !tokenRes.token.trim()) {
        await apiLive.endLiveStream(createdStream.id);
        throw new Error('دریافت توکن معتبر از سرور ناموفق بود.');
      }

      const authenticToken = tokenRes.token.trim();
      const effectiveServerUrl = tokenRes.serverUrl || 'wss://livekit.vlive.app';
      
      // 4. Connect to LiveKit and Publish
      try {
        await livekitManager.connect({
          roomName: canonicalRoom,
          token: authenticToken,
          serverUrl: effectiveServerUrl,
          identity: currentUser?.id,
          name: currentUser?.name || currentUsername || 'Host',
          role: 'host',
          mediaStream: activeStream,
          stream: activeStream
        });
      } catch (lkErr) {
        await apiLive.endLiveStream(createdStream.id);
        throw new Error(`خطا در اتصال به سرور لایو: ${lkErr.message}`);
      }

      // Check if tracks are published
      const videoPubs = Array.from(livekitManager.room?.localParticipant?.videoTrackPublications?.values() || []);
      if (videoPubs.length === 0) {
        await apiLive.endLiveStream(createdStream.id);
        await livekitManager.disconnect();
        throw new Error('خطا: تصویر دوربین روی سرور منتشر نشد.');
      }

      setIsLiveKitConnected(true);

      // 5. Activate Stream in Supabase
      await apiLive.activateLiveStream(createdStream.id);
      createdStream.status = 'active';
      createdStream.livekit_room = canonicalRoom;

      // 6. Success - Set state & transition UI to LIVE
      setLivekitToken(authenticToken);
      setLivekitRoom(canonicalRoom);
      setLivekitServerUrl(effectiveServerUrl);
      setBroadcasterAuthorized(true);
      setActiveStreamRecord(createdStream);

      if (setStreamsList) setStreamsList(prev => [createdStream, ...(prev || []).filter(x => x.id !== createdStream.id)]);
      if (setViewingStream) setViewingStream(null);

      // Initialize real-time Supabase presence and room sync for live stats & interactions
      try {
        if (roomServiceRef.current) {
          roomServiceRef.current.unsubscribe();
        }
        const roomService = new LiveStreamRoomService(createdStream.id, {
          onViewerUpdate: (count) => {
            setViewerCount(Math.max(0, count));
          },
          onLikeUpdate: (count) => {
            setLikeCount(prev => prev + (count || 1));
          },
          onGiftReceived: (giftData) => {
            const coins = giftData.coins || 0;
            setGiftCoinsEarned(prev => prev + coins);
            if (setUserCoins) setUserCoins(prev => prev + coins);
            setActiveLuxuryGift(giftData);
          },
          onChatMessage: (chatData) => {
            setChatMessages(prev => [...prev, {
              id: Date.now() + Math.random(),
              user: chatData.username || 'Viewer',
              text: chatData.text,
              isVip: chatData.isVip,
              isHost: false
            }]);
          },
          onFollowerGained: (followerData) => {
            setFollowersGained(prev => prev + 1);
          }
        }, currentUser?.id);
        roomService.setLocalMediaStream(activeStream);
        roomService.subscribe({ ...currentUser, isBroadcaster: true, isHost: true });
        roomServiceRef.current = roomService;
      } catch (roomErr) {
        console.warn('Live room real-time sync warning:', roomErr);
      }

      // Switch studio phase to LIVE broadcast
      setStudioPhase('LIVE');
      setIsStartingLive(false);
      if (cameraVideoRef.current) {
        cameraVideoRef.current.play().catch(() => {});
      }
      showToast(window.loc(`🎥 پخش زنده استودیو با موفقیت شروع شد!`, `🎥 Live broadcast started successfully!`));
    } catch (globalErr) {
      console.error('executeLiveStart error:', globalErr);
      setStudioPhase('PRE_LIVE');
      setIsStartingLive(false);
      showToast(globalErr.message);
    }
  };
