from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Depends
from sqlalchemy.orm import Session
from typing import Dict, List
import json

from app.database import SessionLocal
from app.models import User, LiveStream, ChatMessage, Transaction

router = APIRouter(prefix="/ws", tags=["Real-time Chat & WebSockets"])

class ConnectionManager:
    def __init__(self):
        # Map stream_id to list of active WebSockets
        self.active_connections: Dict[int, List[WebSocket]] = {}

    async def connect(self, stream_id: int, websocket: WebSocket):
        await websocket.accept()
        if stream_id not in self.active_connections:
            self.active_connections[stream_id] = []
        self.active_connections[stream_id].append(websocket)

    def disconnect(self, stream_id: int, websocket: WebSocket):
        if stream_id in self.active_connections:
            if websocket in self.active_connections[stream_id]:
                self.active_connections[stream_id].remove(websocket)

    async def broadcast(self, stream_id: int, message: dict):
        if stream_id in self.active_connections:
            for connection in self.active_connections[stream_id]:
                try:
                    await connection.send_json(message)
                except Exception:
                    pass

manager = ConnectionManager()

@router.websocket("/chat/{stream_id}")
async def websocket_chat_endpoint(websocket: WebSocket, stream_id: int):
    await manager.connect(stream_id, websocket)
    db: Session = SessionLocal()
    try:
        while True:
            data_str = await websocket.receive_text()
            data = json.loads(data_str)

            action_type = data.get("type") # "MESSAGE", "GIFT", "AR_FILTER"
            sender_username = data.get("sender_username", "کاربر VIP")
            content = data.get("content", "")

            if action_type == "GIFT":
                gift_title = data.get("gift_title", "👑 تاج طلایی")
                stars_spent = data.get("stars", 200)

                # Persist gift message
                msg = ChatMessage(
                    stream_id=stream_id,
                    sender_username=sender_username,
                    gift_type=gift_title,
                    stars_spent=stars_spent
                )
                db.add(msg)
                db.commit()

                await manager.broadcast(stream_id, {
                    "type": "GIFT_ANIMATION",
                    "sender": sender_username,
                    "gift_title": gift_title,
                    "stars": stars_spent
                })

            elif action_type == "AR_FILTER":
                filter_name = data.get("filter_name", "Studio Glow 💖")
                stream = db.query(LiveStream).filter(LiveStream.id == stream_id).first()
                if stream:
                    stream.active_ar_filter = filter_name
                    db.commit()

                await manager.broadcast(stream_id, {
                    "type": "AR_FILTER_CHANGED",
                    "filter_name": filter_name
                })

            else:
                msg = ChatMessage(
                    stream_id=stream_id,
                    sender_username=sender_username,
                    message=content
                )
                db.add(msg)
                db.commit()

                await manager.broadcast(stream_id, {
                    "type": "CHAT_MESSAGE",
                    "sender": sender_username,
                    "message": content,
                    "timestamp": "هم‌اکنون"
                })

    except WebSocketDisconnect:
        manager.disconnect(stream_id, websocket)
    finally:
        db.close()
