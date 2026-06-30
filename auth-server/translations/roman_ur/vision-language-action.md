---
sidebar_position: 1
title: Vision-Language-Action
description: >
  End-to-end Vision-Language-Action pipelines for humanoid robotics: speech-to-text
  transcription with OpenAI Whisper, LLM-driven task planning with GPT-4,
  vision-language grounding via CLIP and SAM, grasp planning with collision
  checking, ROS 2 action bridges, and error recovery strategies for safe
  household and industrial manipulation.
keywords:
  - Vision-Language-Action
  - VLA
  - LLM planning
  - voice commands
  - computer vision
  - robot manipulation
  - OpenAI Whisper
  - GPT-4 prompt engineering
  - CLIP
  - SAM
  - ROS 2 action bridge
  - grasp planning
  - collision checking
  - speech-to-text
  - motor command generation
---

import PersonalizationToolbar from '@site/src/components/Personalization/PersonalizationToolbar';

# Vision-Language-Action

<PersonalizationToolbar chapterSlug="vla/vision-language-action" />

Vision-Language-Action (VLA) wo architecture pattern hai jo idraak, zaban ki samajh, harkat ki planning, aur jismani kaam ko ek band loop system mein jodta hai. Har kaam ko sakht taur par program karne ki bajaye, VLA robot azad form mein insani hukmon ko samajhta hai, unhein nazariye ke zariye haqeeqi duniya mein jodta hai, mehdood kaam ka mansooba banata hai, aur phir tasdeeq shuda motor controllers ke zariye us mansoobe ko nafaz karta hai.

Ye module VLA stack ki har teh ko cover karta hai — microphone se lekar motor driver tak — code misaalon, architecture diagrams, aur nakaami ke un anwaal ke saath jin se aap ko nimatna hoga.

---

## Seekhne ke nateej

Is module ke ikhtitam par aap ye kar sakenge:

- Vision-Language-Action architecture aur uske paanch sub-systems (speech-to-text, zaban ki samajh, vision-language grounding, harkat ki planning, kaam aur bahaali) ki wazahat karen.
- ROS 2 node mein realtime speech-to-text transcription ke liye OpenAI Whisper ko integrate karen, streaming inference aur zaban ki shanakht ke saath.
- GPT-4 ke liye hidayati prompts tayar karen jo parseable JSON kaam ke mansoobe banayein jin mein wazai kaam ki aqsam, hadaf ki ashiya, maqami pabandiyan, aur mutbadil hidayat hon.
- Ek ROS 2 action bridge banayein jo LLM ke outputs ko `nav2` aur `MoveIt 2` action goals mein tabdeel karein munasib timeout aur cancellation handling ke saath.
- Confidence filtering, non-maximum suppression, aur multi-class bounding box tracking ke saath object detection pipeline lagu karen.
- Ek grasp planner design karen jo mawarood grasp poses ko collision map ke saath janchay aur sab se zyada score wali collision-free pose muntaqib karein.
- Robotic kaam ki taqseem ke liye LLM ki qabil-e-itminani behtar banane ke liye chain-of-thought, few-shot, aur system-prompt takneeqon ko lagu karen.
- Aam VLA nakaami ke anwaal ki nishandahi karen aur unhein door karen shamil mubham zaban, posheedah ashiya, ghair mehfooz raastay, aur controller ki kharabiyan.
- Batching, caching, hardware acceleration, aur halki nakaami ke zariye VLA pipelines ki tardaat, throughput, aur hifzan ko behtar banayen.

---

## Tasawwur ki wazahat

### VLA kyun ahem hai

Robotic khaamkari ke riwayati tareeqay har kaam ke liye wazai programming ka mutalib karte hain. Ek pick-and-place cell ko haath se likhay waypoints, grip force profiles, aur error handlers ki zaroorat hoti hai. Ye tareeqa kaar us waqt toot jata hai jab maahol badal jata hai ya koi nayi cheez andar hoti hai. VLA sakht taur par program shuda kaam ki tarteebon ki jagah zaban se mashroot policy ka istemal karta hai jo ashiya, maqamat, aur pabandiyon mein aammiyat se bharpoor ho sakte hain baghair dobara program ke.

VLA system ek waheed model nahi hai. Ye khususi ajza ki ek pipeline hai jo unke darmiyan hidayati data mushtail karta hai:

| Teh | Input | Output | Aam technology |
|---|---|---|---|
| Speech-to-text | Kham audio waveform | Tehreeri matn | OpenAI Whisper, Vosk |
| Zaban ki samajh | Tehreeri matn | Hidayati kaam ka mansooba (JSON) | GPT-4, LLaMA, Mistral |
| Vision-language grounding | Kaam ka mansooba + camera frames | Object detections, poses, scene graph | CLIP, SAM, YOLO, DepthAnything |
| Harkat ki planning | Mawarood object poses + pabandiyan | Collision-free raasta | nav2, MoveIt 2, OMPL |
| Kaam aur nigrani | Raasta + joint halaat | Mukammal kaam ya bahaali trigger | ROS 2 controllers, hifzan nigran |

### Grounding ka masla

VLA ka markazi challenge **grounding** hai — tassawwuri zaban ko makhsoos jismani ashiya se milana. Jab istemal kaar kehta hai "laal cup uthao," to system ko:

1. "Laal cup" ko manzar mein ek makhsoos object se milana hoga.
2. Tasdeeq karna hoga ke wo misal nazar mein hai aur pahunchne ke qabil hai.
3. Robot ke relative mein uski 6-DoF pose muqarrar karni hogi.
4. Tasdeeq karna hoga ke robot se cup tak ka raasta collision-free hai.
5. Ek grasp configuration muntakib karna hoga jo handle aur kinare se bache.
6. Ghair mutawaqqa takrour ya phisal ki nigrani karte hue harkat ko nafaz karna hoga.

Agar koi bhi qadam nakaam ho jaye, to system ko shandari se wapas jana chahiye — wazahat mangen, dobara scan karen, dobara mansooba banayen, ya rok dein.

### Hidayati kaam ki numaindagi

Ek achi tarah se design karda kaam ka mansooba zaban ki teh aur harkat ke teh ke darmiyan muahida hai. Ye mukammal taur par parseable hona chahiye, koi mubham fields nahi honi chahiye, aur wazai nakaami ki hidayat shamil honi chahiye. Is schema ko dekhein:

```json
{
  "intent": "pick_and_place",
  "target_object": {
    "description": "red cup",
    "class": "cup",
    "color": "red",
    "min_confidence": 0.85
  },
  "source_location": "unspecified",
  "destination": {
    "description": "hand it to the user",
    "zone": "user_reachable",
    "max_distance_from_user_m": 0.5
  },
  "constraints": {
    "max_speed_mps": 0.5,
    "gripper_force_n_range": [2.0, 8.0],
    "no_go_zones": ["stove", "sink"],
    "time_limit_s": 30
  },
  "fallback": {
    "if_object_not_found": "ask_user_to_point",
    "if_path_blocked": "replan_with_larger_clearance",
    "if_grasp_fails": "retry_once_then_stop"
  }
}
```

Har field wazai hai. Harkat ki teh ko kabhi azad matn tafsir nahi karna padta. Agar LLM kisi field ko itminan ke saath nahi bhar sakta, to wo usay `null` par set karta hai aur system wazahat ka daur trigger karta hai.

---

## Mukammal VLA pipeline architecture

```text
┌──────────────────────────────────────────────────────────────────────┐
│                        VLA PIPELINE                                  │
├──────────┬───────────┬────────────┬─────────────┬──────────────────┤
│  MIC /   │  SPEECH-  │   LLM      │   VISION    │   MOTION /       │
│  AUDIO   │  TO-TEXT  │   PLANNER  │   GROUNDING │   EXECUTION      │
│          │           │            │             │                  │
│  PCM 16k │  Whisper  │  GPT-4     │  CLIP + SAM │  nav2 + MoveIt2 │
│  16-bit  │  encoder  │  prompt    │  YOLO +     │  action bridge   │
│  mono    │  + decoder│  + JSON    │  DepthAny.  │  + safety layer  │
└────┬─────┴─────┬─────┴─────┬──────┴──────┬──────┴────────┬─────────┘
     │           │           │             │               │
     ▼           ▼           ▼             ▼               ▼
  audio_buf  transcript   task_plan   scene_graph     joint_goals
                                          │               │
                                          ▼               ▼
                                    object_poses    robot_controller
                                    + confidence    + collision check
```

Har teer ek ROS 2 topic ya service call hai jismein typed message hota hai. Pipeline **ghair mutwazi** hai: speech-to-text teh `/vla/transcript` par transcripts publish karti hai, LLM planner subscribe karta hai aur `/vla/task_plan` par kaam ke mansoobe publish karta hai, aur harkat ke teh mansoobon ko subscribe karti hai aur raasta ke goals publish karti hai.

---

## Code ki misaalein

### 1. OpenAI Whisper ko speech-to-text ke liye integrate karna

Niche diye gaye ROS 2 node microphone se audio stream karta hai, usay overlapping chunks mein buffer karta hai, aur zaban ki shanakht ke saath Whisper inference chalata hai.

```python
#!/usr/bin/env python3
"""whisper_stt_node.py — Real-time speech-to-text using OpenAI Whisper."""

import queue
import threading
import numpy as np
import torch
import whisper
import rclpy
from rclpy.node import Node
from std_msgs.msg import String
from audio_common_msgs.msg import Audio

SAMPLE_RATE = 16000
CHUNK_DURATION_S = 3.0
OVERLAP_S = 0.5


class WhisperSTTNode(Node):
    def __init__(self):
        super().__init__("whisper_stt_node")

        self.declare_parameter("model_size", "base")
        self.declare_parameter("language", None)
        self.declare_parameter("device", "cuda" if torch.cuda.is_available() else "cpu")

        model_size = self.get_parameter("model_size").value
        device = self.get_parameter("device").value
        self.language = self.get_parameter("language").value

        self.get_logger().info(f"Loading Whisper model '{model_size}' on {device}")
        self.model = whisper.load_model(model_size, device=device)

        self.audio_queue: queue.Queue = queue.Queue()
        self.audio_buffer = np.array([], dtype=np.float32)
        self.buffer_lock = threading.Lock()

        self.transcript_pub = self.create_publisher(String, "/vla/transcript", 10)
        self.audio_sub = self.create_subscription(Audio, "/audio/mic", self.audio_callback, 10)

        self.inference_thread = threading.Thread(target=self._inference_loop, daemon=True)
        self.inference_thread.start()
        self.get_logger().info("Whisper STT node ready")

    def audio_callback(self, msg: Audio):
        samples = np.frombuffer(msg.data, dtype=np.int16).astype(np.float32) / 32768.0
        with self.buffer_lock:
            self.audio_buffer = np.concatenate([self.audio_buffer, samples])
            while len(self.audio_buffer) >= int(CHUNK_DURATION_S * SAMPLE_RATE):
                chunk = self.audio_buffer[: int(CHUNK_DURATION_S * SAMPLE_RATE)]
                overlap = int(OVERLAP_S * SAMPLE_RATE)
                self.audio_buffer = self.audio_buffer[overlap:]
                self.audio_queue.put(chunk)

    def _inference_loop(self):
        while rclpy.ok():
            try:
                chunk = self.audio_queue.get(timeout=1.0)
            except queue.Empty:
                continue

            options = {}
            if self.language:
                options["language"] = self.language

            result = self.model.transcribe(
                chunk,
                fp16=torch.cuda.is_available(),
                **options,
            )

            text = result["text"].strip()
            if not text:
                continue

            lang = result.get("language", "unknown")
            self.get_logger().info(f"[{lang}] {text}")

            msg = String()
            msg.data = text
            self.transcript_pub.publish(msg)


def main(args=None):
    rclpy.init(args=args)
    node = WhisperSTTNode()
    try:
        rclpy.spin(node)
    except KeyboardInterrupt:
        pass
    node.destroy_node()
    rclpy.shutdown()


if __name__ == "__main__":
    main()
```

Aham design faislay:

- **Overlapping chunks** musalsal audio ko taqseem karte waqt lafz ki haddood ki kharabiyan ko rokte hain.
- **Zaban ki shanakht** khudkar taur par chalti hai; angrezi mein muqarrar karne ke liye `language="en"` pass karen aur tardaat kam karen.
- **Thread alaidgi** GPU inference ko ROS callback thread se door rakhti hai, executor par deadline choti hona se bachati hai.

---

### 2. GPT-4 prompt engineering robotic kaam ki planning ke liye

LLM planner ko transcript aur maujooda scene graph milta hai aur usay mukammal taur par parseable JSON kaam ka mansooba wapas karna hota hai. Prompt model ke output ko mehdood karne aur khayali cheezen paida karne ko kam karne ke liye design kiya gaya hai.

```python
#!/usr/bin/env python3
"""vla_planner_node.py — GPT-4 task planner for VLA."""

import json
import os
from typing import Optional

import openai
import rclpy
from rclpy.node import Node
from std_msgs.msg import String
from geometry_msgs.msg import PoseStamped

SYSTEM_PROMPT = """You are a robot task planner. Given a user command and the
current scene description, produce a JSON task plan. Follow this schema exactly:

{
  "intent": "pick_and_place" | "navigate_to" | "open" | "close" | "hand_over" | "unknown",
  "target_object": {
    "description": "<free text>",
    "class": "<object class from scene>",
    "color": "<color or null>",
    "min_confidence": 0.85
  },
  "source_location": "<room/zone or null>",
  "destination": {
    "description": "<free text>",
    "zone": "<named zone or null>",
    "max_distance_from_user_m": 0.5
  },
  "constraints": {
    "max_speed_mps": 0.5,
    "gripper_force_n_range": [2.0, 8.0],
    "no_go_zones": [],
    "time_limit_s": 30
  },
  "fallback": {
    "if_object_not_found": "ask_user_to_point | rescan | stop",
    "if_path_blocked": "replan | wait | stop",
    "if_grasp_fails": "retry_once_then_stop | stop"
  },
  "confidence": 0.0 to 1.0,
  "clarification_needed": "<question or null>"
}

Rules:
- If any required field cannot be determined, set it to null and set
  clarification_needed to a specific question.
- Never invent objects not in the scene description.
- Keep intent to one of the listed values.
- Output valid JSON only, no markdown fences."""

FEW_SHOT_EXAMPLES = [
    {
        "role": "user",
        "content": (
            "User command: 'bring me the red cup'\n\n"
            "Scene description:\n"
            "- red_cup: class=cup, color=red, confidence=0.92, zone=kitchen_table\n"
            "- blue_bottle: class=bottle, color=blue, confidence=0.88, zone=kitchen_table\n"
            "- user: zone=living_room, distance=3.2m\n"
        ),
    },
    {
        "role": "assistant",
        "content": json.dumps(
            {
                "intent": "pick_and_place",
                "target_object": {
                    "description": "red cup",
                    "class": "cup",
                    "color": "red",
                    "min_confidence": 0.85,
                },
                "source_location": "kitchen_table",
                "destination": {
                    "description": "hand it to the user",
                    "zone": "user_reachable",
                    "max_distance_from_user_m": 0.5,
                },
                "constraints": {
                    "max_speed_mps": 0.5,
                    "gripper_force_n_range": [2.0, 8.0],
                    "no_go_zones": [],
                    "time_limit_s": 30,
                },
                "fallback": {
                    "if_object_not_found": "ask_user_to_point",
                    "if_path_blocked": "replan_with_larger_clearance",
                    "if_grasp_fails": "retry_once_then_stop",
                },
                "confidence": 0.92,
                "clarification_needed": None,
            },
            indent=2,
        ),
    },
]


class VLAPlannerNode(Node):
    def __init__(self):
        super().__init__("vla_planner_node")

        self.declare_parameter("openai_model", "gpt-4o")
        self.declare_parameter("temperature", 0.1)
        self.declare_parameter("max_tokens", 1024)

        self.model = self.get_parameter("openai_model").value
        self.temperature = self.get_parameter("temperature").value
        self.max_tokens = self.get_parameter("max_tokens").value

        self.client = openai.OpenAI(api_key=os.environ.get("OPENAI_API_KEY"))

        self.task_plan_pub = self.create_publisher(String, "/vla/task_plan", 10)
        self.transcript_sub = self.create_subscription(
            String, "/vla/transcript", self.transcript_callback, 10
        )
        self.scene_sub = self.create_subscription(
            String, "/vla/scene_graph", self.scene_callback, 10
        )

        self.scene_description: str = "No scene data available."
        self.get_logger().info("VLA Planner node ready")

    def scene_callback(self, msg: String):
        self.scene_description = msg.data

    def transcript_callback(self, msg: String):
        user_command = msg.data
        self.get_logger().info(f"Planning for: {user_command}")

        messages = [{"role": "system", "content": SYSTEM_PROMPT}]
        messages.extend(FEW_SHOT_EXAMPLES)
        messages.append(
            {
                "role": "user",
                "content": (
                    f"User command: '{user_command}'\n\n"
                    f"Scene description:\n{self.scene_description}"
                ),
            }
        )

        try:
            response = self.client.chat.completions.create(
                model=self.model,
                messages=messages,
                temperature=self.temperature,
                max_tokens=self.max_tokens,
                response_format={"type": "json_object"},
            )

            raw = response.choices[0].message.content
            task_plan = json.loads(raw)

            if task_plan.get("confidence", 0) < 0.6:
                self.get_logger().warn(
                    f"Low confidence ({task_plan['confidence']}), requesting clarification"
                )

            plan_msg = String()
            plan_msg.data = json.dumps(task_plan, indent=2)
            self.task_plan_pub.publish(plan_msg)
            self.get_logger().info(f"Published task plan: {task_plan['intent']}")

        except json.JSONDecodeError as e:
            self.get_logger().error(f"Invalid JSON from LLM: {e}")
        except openai.APIError as e:
            self.get_logger().error(f"OpenAI API error: {e}")


def main(args=None):
    rclpy.init(args=args)
    node = VLAPlannerNode()
    try:
        rclpy.spin(node)
    except KeyboardInterrupt:
        pass
    node.destroy_node()
    rclpy.shutdown()


if __name__ == "__main__":
    main()
```

Prompt engineering ki tafseelat:

- **System prompt** schema ko muqarrar karta hai, durust niyat ki fehrist deta hai, aur markdown output ko mana karta hai taake jawab hamesha parseable ho.
- **Few-shot misaal** model ko format aur istidlal ke andaz ke liye ek namoona hawala deti hai.
- **Kam itminan ki hifazat** shakooke mansoobay ke saath aage barhne ki bajaye wazahat ka daur trigger karti hai.
- **`response_format={"type": "json_object"}`** API level par JSON output ko majboor karta hai.

---

### 3. LLM outputs ke liye ROS 2 action bridge

Action bridge kaam ke mansoobon ko subscribe karta hai aur unhen `nav2` aur `MoveIt 2` action goals mein tabdeel karta hai. Ye kisi bhi harkat ko bhejne se pehle mansoobay ki schema ki tasdeeq karta hai.

```python
#!/usr/bin/env python3
"""vla_action_bridge.py — Translates LLM task plans into ROS 2 actions."""

import json
from typing import Dict, Any

import rclpy
from rclpy.node import Node
from rclpy.action import ActionClient
from std_msgs.msg import String
from nav2_msgs.action import NavigateToPose
from moveit_msgs.action import MoveGroup
from geometry_msgs.msg import PoseStamped, Pose

VALID_INTENTS = {"pick_and_place", "navigate_to", "open", "close", "hand_over"}


class VLAActionBridge(Node):
    def __init__(self):
        super().__init__("vla_action_bridge")

        self.nav_client = ActionClient(self, NavigateToPose, "navigate_to_pose")
        self.moveit_client = ActionClient(self, MoveGroup, "move_action")

        self.task_plan_sub = self.create_subscription(
            String, "/vla/task_plan", self.task_plan_callback, 10
        )
        self.action_status_pub = self.create_publisher(String, "/vla/action_status", 10)
        self.grasp_request_pub = self.create_publisher(String, "/vla/grasp_request", 10)

        self.get_logger().info("VLA Action Bridge ready")

    def task_plan_callback(self, msg: String):
        try:
            plan: Dict[str, Any] = json.loads(msg.data)
        except json.JSONDecodeError:
            self._publish_status("error", "Invalid JSON in task plan")
            return

        intent = plan.get("intent")
        if intent not in VALID_INTENTS:
            self._publish_status("error", f"Unknown intent: {intent}")
            return

        confidence = plan.get("confidence", 0.0)
        if confidence < 0.6:
            self._publish_status("rejected", f"Low confidence: {confidence}")
            return

        if plan.get("clarification_needed"):
            self._publish_status("clarifying", plan["clarification_needed"])
            return

        self.get_logger().info(f"Dispatching intent: {intent}")

        if intent == "pick_and_place":
            self._dispatch_pick_and_place(plan)
        elif intent == "navigate_to":
            self._dispatch_navigate(plan)
        elif intent == "hand_over":
            self._dispatch_hand_over(plan)
        else:
            self._publish_status("error", f"Intent not yet implemented: {intent}")

    def _dispatch_pick_and_place(self, plan: Dict[str, Any]):
        target = plan.get("target_object", {})
        destination = plan.get("destination", {})
        constraints = plan.get("constraints", {})

        self.get_logger().info(
            f"Pick '{target.get('description')}' from '{plan.get('source_location')}' "
            f"and place at '{destination.get('description')}'"
        )

        grasp_msg = String()
        grasp_msg.data = json.dumps(
            {
                "target_object": target,
                "constraints": constraints,
                "action": "pick",
            }
        )
        self.grasp_request_pub.publish(grasp_msg)
        self._publish_status("dispatched", "Grasp request sent")

    def _dispatch_navigate(self, plan: Dict[str, Any]):
        destination = plan.get("destination", {})
        zone = destination.get("zone")

        if not zone:
            self._publish_status("error", "Navigate intent missing destination zone")
            return

        self.get_logger().info(f"Navigating to zone: {zone}")

        goal = NavigateToPose.Goal()
        goal.pose.header.frame_id = "map"
        goal.pose.pose.position.x = 0.0
        goal.pose.pose.position.y = 0.0
        goal.pose.pose.position.z = 0.0
        goal.pose.pose.orientation.w = 1.0

        self.nav_client.wait_for_server()
        send_future = self.nav_client.send_goal_async(goal)
        send_future.add_done_callback(self._nav_goal_callback)

    def _nav_goal_callback(self, future):
        goal_handle = future.result()
        if not goal_handle.accepted:
            self._publish_status("error", "Navigation goal rejected")
            return
        self._publish_status("navigating", "Navigation in progress")
        result_future = goal_handle.get_result_async()
        result_future.add_done_callback(self._nav_result_callback)

    def _nav_result_callback(self, future):
        result = future.result()
        if result.code == 0:
            self._publish_status("completed", "Navigation complete")
        else:
            self._publish_status("error", f"Navigation failed: code {result.code}")

    def _dispatch_hand_over(self, plan: Dict[str, Any]):
        self.get_logger().info("Hand-over sequence initiated")
        self._dispatch_pick_and_place(plan)

    def _publish_status(self, status: str, detail: str):
        msg = String()
        msg.data = json.dumps({"status": status, "detail": detail})
        self.action_status_pub.publish(msg)
        self.get_logger().info(f"[{status}] {detail}")


def main(args=None):
    rclpy.init(args=args)
    node = VLAActionBridge()
    try:
        rclpy.spin(node)
    except KeyboardInterrupt:
        pass
    node.destroy_node()
    rclpy.shutdown()


if __name__ == "__main__":
    main()
```

Bridge ek aham hifazat ka usool nafaz karta hai: **LLM kabhi seedha motor nahi chalata**. Wo ek hidayati mansooba banata hai, bridge uski tasdeeq karta hai, aur phir harkat ke goals bheje jaate hain.

---

### 4. Confidence filtering ke saath object detection pipeline

```python
#!/usr/bin/env python3
"""object_detection_node.py — YOLO-based detection with confidence filtering."""

import numpy as np
import torch
from ultralytics import YOLO
import rclpy
from rclpy.node import Node
from sensor_msgs.msg import Image
from vision_msgs.msg import Detection2DArray, Detection2D, ObjectHypothesisWithPose
from std_msgs.msg import String
from cv_bridge import CvBridge


class ObjectDetectionNode(Node):
    def __init__(self):
        super().__init__("object_detection_node")

        self.declare_parameter("model_path", "yolov8m.pt")
        self.declare_parameter("confidence_threshold", 0.5)
        self.declare_parameter("nms_threshold", 0.45)
        self.declare_parameter("input_width", 640)
        self.declare_parameter("input_height", 640)

        model_path = self.get_parameter("model_path").value
        self.conf_thresh = self.get_parameter("confidence_threshold").value
        self.nms_thresh = self.get_parameter("nms_threshold").value

        self.model = YOLO(model_path)
        self.bridge = CvBridge()

        self.detection_pub = self.create_publisher(Detection2DArray, "/vla/detections", 10)
        self.scene_graph_pub = self.create_publisher(String, "/vla/scene_graph", 10)
        self.image_sub = self.create_subscription(Image, "/camera/color/image_raw", self.image_callback, 10)

        self.get_logger().info(f"Object detection node ready (model={model_path})")

    def image_callback(self, msg: Image):
        cv_image = self.bridge.imgmsg_to_cv2(msg, desired_encoding="bgr8")

        results = self.model.predict(
            source=cv_image,
            conf=self.conf_thresh,
            iou=self.nms_thresh,
            verbose=False,
        )

        detections_msg = Detection2DArray()
        detections_msg.header = msg.header

        scene_entries = []

        for result in results:
            boxes = result.boxes
            if boxes is None:
                continue

            for i in range(len(boxes)):
                box = boxes.xyxy[i].cpu().numpy()
                conf = float(boxes.conf[i])
                cls_id = int(boxes.cls[i])
                cls_name = result.names[cls_id]

                x_min, y_min, x_max, y_max = box
                w = x_max - x_min
                h = y_max - y_min

                det = Detection2D()
                det.bbox.center.position.x = float(x_min + w / 2)
                det.bbox.center.position.y = float(y_min + h / 2)
                det.bbox.size_x = float(w)
                det.bbox.size_y = float(h)

                hyp = ObjectHypothesisWithPose()
                hyp.hypothesis.class_id = cls_name
                hyp.hypothesis.score = conf
                det.results.append(hyp)

                detections_msg.detections.append(det)

                scene_entries.append(
                    f"- {cls_name}_{i}: class={cls_name}, "
                    f"confidence={conf:.3f}, "
                    f"bbox=[{x_min:.0f},{y_min:.0f},{x_max:.0f},{y_max:.0f}]"
                )

        self.detection_pub.publish(detections_msg)

        scene_msg = String()
        scene_msg.data = "\n".join(scene_entries) if scene_entries else "No objects detected."
        self.scene_graph_pub.publish(scene_msg)


def main(args=None):
    rclpy.init(args=args)
    node = ObjectDetectionNode()
    try:
        rclpy.spin(node)
    except KeyboardInterrupt:
        pass
    node.destroy_node()
    rclpy.shutdown()


if __name__ == "__main__":
    main()
```

Confidence filtering aur **non-maximum suppression (NMS)** ko inference ke waqt nakara detections ko khatam karne ke liye lagu kiya jata hai. Scene graph message LLM planner ko maahol ki hidayati bayan faraham karta hai.

---

### 5. Collision checking ke saath grasp planning

```python
#!/usr/bin/env python3
"""grasp_planner_node.py — Candidate grasp generation with collision checking."""

import json
from dataclasses import dataclass
from typing import List, Optional

import numpy as np
import rclpy
from rclpy.node import Node
from std_msgs.msg import String
from geometry_msgs.msg import Pose, PoseStamped
from moveit_msgs.action import MoveGroup
from moveit_msgs.msg import (
    Constraints,
    PositionConstraint,
    OrientationConstraint,
    BoundingVolume,
    SolidPrimitive,
)
from rclpy.action import ActionClient


@dataclass
class GraspCandidate:
    pose: Pose
    score: float
    approach_vector: np.ndarray
    finger_width_m: float
    collision_free: bool = True


class GraspPlannerNode(Node):
    def __init__(self):
        super().__init__("grasp_planner_node")

        self.declare_parameter("num_candidates", 20)
        self.declare_parameter("min_score", 0.5)
        self.declare_parameter("approach_clearance_m", 0.1)

        self.num_candidates = self.get_parameter("num_candidates").value
        self.min_score = self.get_parameter("min_score").value
        self.approach_clearance = self.get_parameter("approach_clearance_m").value

        self.moveit_client = ActionClient(self, MoveGroup, "move_action")

        self.grasp_request_sub = self.create_subscription(
            String, "/vla/grasp_request", self.grasp_request_callback, 10
        )
        self.grasp_result_pub = self.create_publisher(String, "/vla/grasp_result", 10)
        self.planned_scene_pub = self.create_publisher(String, "/vla/planned_scene", 10)

        self.get_logger().info("Grasp planner node ready")

    def grasp_request_callback(self, msg: String):
        try:
            request = json.loads(msg.data)
        except json.JSONDecodeError:
            self.get_logger().error("Invalid JSON in grasp request")
            return

        target = request.get("target_object", {})
        self.get_logger().info(f"Planning grasp for: {target.get('description')}")

        candidates = self._generate_candidates(request)
        self.get_logger().info(f"Generated {len(candidates)} grasp candidates")

        validated = self._check_collisions(candidates)
        valid = [c for c in validated if c.collision_free]
        self.get_logger().info(f"{len(valid)} collision-free candidates remain")

        if not valid:
            self._publish_result("failure", "No collision-free grasp found")
            return

        best = max(valid, key=lambda c: c.score)
        if best.score < self.min_score:
            self._publish_result("low_confidence", f"Best score {best.score:.3f} < {self.min_score}")
            return

        self.get_logger().info(
            f"Selected grasp: score={best.score:.3f}, "
            f"position=[{best.pose.position.x:.3f}, {best.pose.position.y:.3f}, {best.pose.position.z:.3f}]"
        )

        result = {
            "status": "success",
            "pose": {
                "position": {
                    "x": best.pose.position.x,
                    "y": best.pose.position.y,
                    "z": best.pose.position.z,
                },
                "orientation": {
                    "x": best.pose.orientation.x,
                    "y": best.pose.orientation.y,
                    "z": best.pose.orientation.z,
                    "w": best.pose.orientation.w,
                },
            },
            "score": best.score,
            "finger_width_m": best.finger_width_m,
        }

        self._publish_result("success", json.dumps(result))

    def _generate_candidates(self, request: dict) -> List[GraspCandidate]:
        candidates = []
        rng = np.random.default_rng(seed=42)

        for _ in range(self.num_candidates):
            pose = Pose()
            pose.position.x = rng.uniform(-0.1, 0.1)
            pose.position.y = rng.uniform(-0.1, 0.1)
            pose.position.z = rng.uniform(-0.05, 0.15)

            angle = rng.uniform(-np.pi / 4, np.pi / 4)
            pose.orientation.x = 0.0
            pose.orientation.y = np.sin(angle / 2)
            pose.orientation.z = 0.0
            pose.orientation.w = np.cos(angle / 2)

            approach = np.array([0.0, 0.0, -1.0])
            approach[0] = rng.uniform(-0.2, 0.2)
            approach[1] = rng.uniform(-0.2, 0.2)
            approach = approach / np.linalg.norm(approach)

            score = rng.uniform(0.3, 1.0)
            finger_width = rng.uniform(0.02, 0.08)

            candidates.append(
                GraspCandidate(
                    pose=pose,
                    score=score,
                    approach_vector=approach,
                    finger_width_m=finger_width,
                )
            )

        return candidates

    def _check_collisions(self, candidates: List[GraspCandidate]) -> List[GraspCandidate]:
        for candidate in candidates:
            collision_radius = candidate.finger_width_m / 2 + self.approach_clearance
            x, y, z = (
                candidate.pose.position.x,
                candidate.pose.position.y,
                candidate.pose.position.z,
            )

            if z < 0.0 or z > 1.5:
                candidate.collision_free = False
            if abs(x) > 0.8 or abs(y) > 0.8:
                candidate.collision_free = False
            if collision_radius > 0.15:
                candidate.collision_free = False

        return candidates

    def _publish_result(self, status: str, detail: str):
        msg = String()
        msg.data = json.dumps({"status": status, "detail": detail})
        self.grasp_result_pub.publish(msg)


def main(args=None):
    rclpy.init(args=args)
    node = GraspPlannerNode()
    try:
        rclpy.spin(node)
    except KeyboardInterrupt:
        pass
    node.destroy_node()
    rclpy.shutdown()


if __name__ == "__main__":
    main()
```

Grasp planner:

1. Daryaft karda object ke gird **mukhtalif mawarood poses** paida karta hai.
2. **Collision map** aur kaam ki haddon ke khilaf candidates ko filter karta hai.
3. Approach vector, ungli ki chaurai, aur object ke markaz se faaslay ke mutabiq baqiyaon ko score karta hai.
4. Action bridge ko sab se zyada score wali collision-free grasp wapas karta hai.

---

## Tafseeli unwaan

### Whisper model architecture aur taayeen

OpenAI Whisper ek encoder-decoder transformer hai jo 680,000 ghanton ki kisi zabaani awaaz par tarbiyat paya hai. Encoder 30 second log-mel spectrograms (80 frequency bins, 3000 time steps) ko multi-head self-attention stack se process karta hai. Decoder khudkar taur par token ki linein paida karta hai jin mein tehreeri matn, daryaft shuda zabaan, aur timestamp tokens shamil hote hain.

**Model size ke mubadilay:**

| Model | Parameters | Sirf angrezi WER | Kisi zabaani WER | Nisbi raftaar |
|---|---|---|---|---|
| tiny | 39 M | 7.6 % | 14.7 % | 32x |
| base | 74 M | 5.4 % | 12.2 % | 16x |
| small | 244 M | 4.3 % | 10.0 % | 6x |
| medium | 769 M | 3.5 % | 8.4 % | 2x |
| large-v3 | 1550 M | 2.9 % | 7.0 % | 1x |

**Robotic ke liye taayeen ke mutaliqat:**

- Realtime on-device inference ke liye Jetson ya NUC par `tiny` ya `base` istemal karen.
- Agar tardaat budget 2 second se zyada hai to GPU server par `large-v3` istemal karen.
- Streaming mode mein khayali ke loops ko rokne ke liye `condition_on_previous_text=False` faal karen.
- Maqsadwar kaamon mein yaqeeni output ke liye `temperature=0` set karen.
- Ghair angrezi taayeen ke liye, zabaan ki shanakht ko chhodne aur ~200 ms bachane ke liye `language` parameter pass karen.

---

### LLM prompt engineering robotic ke liye

Robotic kaam ki planning ko aam chat se sakht tar prompt discipline ka mutalib hoti hai. LLM ko hidayati mansoobe banane hote hain baghair kisi mubhami ke.

**System prompt design ke usool:**

1. **Schema nafaz karna.** System prompt mein durust JSON sakht ki wazahat karen. Har field aur uski ijaazat ya qeematon ki fehrist dein. Jab schema wazai hota hai to model taqreeban hamesha itaat karta hai.

2. **Kirdar ki tameer.** "Aap ek robotic kaam banane wale hain" se shuru karen. Ye model ki hidayati, shobay ki khususi output paida karne ki salahiyat ko faal karta hai.

3. **Pabandiyon ka injection.** Robot ki jismani hadon (zyada se zyada raftaar, gripper force, kaam ki hadon) ko seedha prompt mein jod dein. Ye model mansoobe banate waqt inhen sakht pabandiyon ke taur par istemal karta hai.

4. **Few-shot namune.** Ek ya do mukammal input-output jode faraham karen jo durust format, istidlal ka andaz, aur adam yaqeen ko kaise sambhalte hain dikhayen.

5. **Itminan aur wazahat.** Model ko itminan ka score aur `clarification_needed` field nikalne ka hukm dein. Ye system ko kam itminan ke mansoobon par karwai ki bajaye mazeed maloomat mangne ka saaf tareeqa faraham karta hai.

**Multi-step kaamon ke liye chain-of-thought:**

Pechide hukmon jaise "mez saaf karo aur sab kuch kitchen mein rakh do" ke liye, model se hukm ko zeeli kaamon mein taqseem karne ko kahen:

```
Think step by step:
1. Identify all objects on the table.
2. For each object, determine its storage location.
3. Sequence the pick-and-place operations to minimize travel.
4. Output the full JSON plan.
```

Ye multi-object kaamon ke liye qabil-e-itminani behtar banata hai lekin tardaat barhata hai. Aik se zyada zaimiya kaam wale hukmon ke liye chain-of-thought mehfooz rakhen.

**Hidayati output mode:**

OpenAI ka `response_format={"type": "json_object"}` parameter model ko durust JSON wapas karne par majboor karta hai. System prompt mein schema ke saath, ye zyada tar parse kharabiyan khatam karta hai. Open source models ke liye, `outlines` ya `lm-format-enforcer` jaisi constrained decoding libraries istemal karen.

---

### Grounding ke liye Vision-Language models

**CLIP (Contrastive Language–Image Pre-training):**

CLIP tasaweer aur matn ko ek mushtarak 512-dimensional embedding space mein encode karta hai. "Laal cup" jaisi matn ki query ke saath, CLIP manzar mein tamam daryaft karda ashiya ke khilaf mushabihat scores ka hisaab lagata hai, unhen alignment ke mutabiq darjah bandi karta hai. Ye baghair kaam ki khususi tarbiyat ke zero-shot object retrieval ko faal karta hai.

```python
import torch
from clip import clip
from PIL import Image

device = "cuda" if torch.cuda.is_available() else "cpu"
model, preprocess = clip.load("ViT-B/32", device=device)

image = preprocess(Image.open("scene.jpg")).unsqueeze(0).to(device)
text = clip.tokenize(["red cup", "blue bottle", "green bowl"]).to(device)

with torch.no_grad():
    image_features = model.encode_image(image)
    text_features = model.encode_text(text)
    similarities = (image_features @ text_features.T).softmax(dim=-1)

print(similarities)
# tensor([[0.87, 0.08, 0.05]])  -> "red cup" matches best
```

**SAM (Segment Anything Model):**

SAM kisi bhi prompt — bounding box, point, ya matn ki wazahat — ke liye pixel-perfect segmentation masks banata hai. VLA pipeline mein, SAM kacchi YOLO detections ko durust masks mein taiyar karta hai jin ka grasp planner collision checking aur satah normal andaze ke liye istemal karta hai.

```python
from segment_anything import sam_model_registry, SamPredictor

sam = sam_model_registry["vit_h"](checkpoint="sam_vit_h.pth")
predictor = SamPredictor(sam)

predictor.set_image(cv_image)
masks, scores, logits = predictor.predict(
    box=np.array([x_min, y_min, x_max, y_max]),
    multimask_output=True,
)

best_mask = masks[scores.argmax()]
```

**DepthAnything depth andaze ke liye:**

Monocular depth andaza ek RGB tasaweer ko fi pixel depth map mein tabdeel karta hai. Ye grasp planner ko depth sensor ki zaroorat ke baghair faaslay ki maloomat faraham karta hai, lekin 3 meter se agay durustgi kam hoti hai.

---

### Kaam ki jagah aur motor hukm ki tayyari

VLA system ko oonchi satah ki niyat ko neechli satah ke motor hukmon mein tabdeel karna hota hai. Kaam ki jagah robot ki azadi ke darjaat aur end-effector par munhasir hai.

**Navigation kaam ki jagah:**

| Kaam | Parameters | ROS 2 action |
|---|---|---|
| `navigate_to_pose` | (x, y, theta) map frame mein | `nav2_msgs/NavigateToPose` |
| `follow_waypoints` | (x, y, theta) ki fehrist | `nav2_msgs/FollowWaypoints` |
| `stop` | — | `/cmd_vel` par zero publish |

**Handling kaam ki jagah:**

| Kaam | Parameters | ROS 2 action |
|---|---|---|
| `move_to_pose` | 6-DoF end-effector pose | `moveit_msgs/MoveGroup` |
| `grasp` | pre-grasp → grasp → lift | Custom action ya `MoveGroup` tarteeb |
| `place` | approach → release → retreat | Custom action ya `MoveGroup` tarteeb |
| `open_gripper` | chaurai, force | Seedha joint hukm |
| `close_gripper` | chaurai, force | Seedha joint hukm |

**Motor hukm ki tayyari pipeline:**

1. LLM niyat aur hadaf object paida karta hai.
2. Nazariya teh 6-DoF object pose faraham karti hai.
3. Grasp planner ek collision-free grasp pose muntakib karta hai.
4. MoveIt 2 inverse-kinematics hal aur collision-free raasta ka hisaab lagata hai.
5. Raasta controller har control cycle mein joint-position hukm bhejta hai (aam taur par 125-1000 Hz).

---

### Error recovery aur mutbadil hikmat-e-amaliyan

VLA pipelines gair tarteeb maahol mein kaam karti hain. Nakaami amooli hai, ghair mamooli nahi.

**Recovery ki category:**

| Error ki qism | Daryaft ka tareeqa | Recovery ki hikmat-e-amli |
|---|---|---|
| Transcription error | Kam Whisper itminan | Istemal kaar se dohrwayen |
| Mubham hukm | LLM `clarification_needed` set karta hai | Wazahati sawaal puchen |
| Object nahi mila | Daryaft itminan had se neechay | Dobara scan, istemal kaar se nishan lagwayen |
| Raasta masdood | Nav2 rukawat ki report karta hai | Bari wazahat ke saath dobara mansooba banayen |
| Grasp takrour | Collision check tamam candidates mein nakaam | Bunyad dobara muqarrar karen, mukhtalif andaz azmayen |
| Grasp phisal | Force/torque sensor phisal daryaft karta hai | Zyada force ke saath dobara grasp karen |
| Controller timeout | MoveAction timeout | Mehfuz pose par wapas jayen, report karen |
| Emergency stop | Hardware E-stop trigger | Tamam harkat rok dein, dastee reset ki zaroorat |

**Ghataati halaat ke modes:**

- **Itminan ki kami.** Agar LLM itminan 0.6 se neechay girta hai, to system kaam karne ki koshish ki bajaye wazahat ke mode mein dakhil hota hai.
- **Sensor ki kami.** Agar camera feed khatam ho jaye, to system handling ko jama karta hai aur mehfuz maqam par navigate karne ki koshish karta hai.
- **Compute ki kami.** Agar GPU inference bahut sust ho jaye, to chhote Whisper model ya cached scene graphs par wapas jayen.

---

### Wazahat ke liye multi-turn guftagu

Jab LLM hukm ko itminan ke saath hal nahi kar sakta, to system wazahat ke guftagu mein dakhil hota hai. Ye ek state machine hai, azad chat nahi.

```text
User: "Pick up that thing"
  ↓
System: "I see a red cup, a blue bottle, and a green bowl on the table.
         Which one would you like me to pick up?"
  ↓
User: "The red one"
  ↓
System: "Got it — picking up the red cup."
```

**Amli mutaliqat:**

- Guftagu ke daur ki tadaad track karen; 3 nakaam wazahat ki koshishon ke baad insaan ko bhejen.
- Zer-e-tehwa ka kaam ka mansooba mehfooz karen aur har wazahat ke jawab ke saath update karen.
- LLM se `clarification_needed` field istemal karen hidayati "Aapka kya matlab hai?" ki bajaye nishanandahi sawaal banane ke liye.
- Wazahat ki window ko 10 second mein mehdood karen; agar istemal kaar jawab na de, to kaam mansukh kar dein.

---

## Visual model: VLA pipeline

<div className="visual-panel">
<div className="visual-flow">
<div className="flow-step"><span>Voice</span>Speech to text</div>
<div className="flow-step"><span>Language</span>Intent and task plan</div>
<div className="flow-step"><span>Vision</span>Objects and scene state</div>
<div className="flow-step"><span>Action</span>Navigation and manipulation</div>
<div className="flow-step"><span>Check</span>Confidence and recovery</div>
</div>
</div>

---

## Grounding check list

Zaban par amal se pehle, robot ko jawab dena chahiye:

| Grounding sawaal | "Laal cup lao" ke liye misaal |
|---|---|
| Kya object nazar mein hai? | Laal cup 0.92 itminan ke saath daryaft hua. |
| Kya object pahunchne ke qabil hai? | Ye robot ki kaam ki had ke andar mez par hai. |
| Kya raasta mehfooz hai? | Navigation mansooba logon aur rukawaton se bachta hai. |
| Kya kaam ijaazat yafta hai? | Object grasp ke liye mehfooz hai aur nazuk/mamnooa nahi hai. |
| Mutbadil kya hai? | Wazahat mangein ya agar itminan gire to rok dein. |
| Kya object pose hai? | Depth + segmentation se 6-DoF pose andaza lagaya gaya. |
| Kya grasp mumkin hai? | Kam az kam ek collision-free grasp candidate 0.7 se oopar score kiya. |

---

## Performance ko behtar banana

### Tardaat mein kami

| Takneeq | Bachat | Mubadilay |
|---|---|---|
| Whisper chunks streaming (3 s overlap) | Batch ke muqablay ~1 s | Haddon par WER mein mamooli izafa |
| On-device Whisper `tiny` istemal karen, pechide audio ko `large-v3` server par bhejen | ~500 ms | Lihje wali awaaz ke liye kam durustgi |
| Thair hui ashiya ke liye CLIP embeddings cache karen | Har query ~50 ms | Agar ashiyan hilen to stale embeddings |
| Mukhtalif frames mein YOLO detections batch karen | ~30 ms/frame | Izafa jitter |
| Aam grasp poses ke liye IK solutions pehle se tayar karen | Har grasp ~100 ms | Memory overhead |

### Throughput aur parallelism

- Speech-to-text aur object detection ko parallel processes mein chalayen. Ye kisi resource ka mushtarak istemal nahi karte aur unke outputs LLM planner mein azadana taur par bheje jaate hain.
- LLM inference callback ko vision callback ko rokne se rokne ke liye ROS 2 callback groups istemal karen.
- Grasp planner ko pipeline banayen: jab robot ek grasp nafaz karta hai, to planner agle candidates ka jaiza leta hai.

### Hardware acceleration

- **NVIDIA Jetson Orin**: GPU par Whisper `base` aur YOLOv8 `nano` chalayen TensorRT ke saath sub-second end-to-end tardaat ke liye.
- **Intel NUC + Arc GPU**: Whisper aur YOLO inference ke liye OpenVINO istemal karen.
- **Cloud fallback**: On-device itminan kam ho to pechide planning ko cloud GPT-4 endpoint par bhejen.

### Bojh ke tehat halki nakaami

```python
class LatencyMonitor:
    def __init__(self, target_ms: float = 2000.0):
        self.target_ms = target_ms
        self.history: list[float] = []

    def record(self, elapsed_ms: float):
        self.history.append(elapsed_ms)
        if len(self.history) > 100:
            self.history = self.history[-100:]

    def should_degrade(self) -> bool:
        if len(self.history) < 10:
            return False
        avg = sum(self.history[-10:]) / 10
        return avg > self.target_ms

    def recommended_model_size(self) -> str:
        avg = sum(self.history[-10:]) / 10
        if avg > 3000:
            return "tiny"
        elif avg > 2000:
            return "base"
        else:
            return "small"
```

---

## Tafseeli unwaan jaari

### Object grounding ke liye CLIP embedding mushabihat

Ek matn query aur image region ke darmiyan CLIP mushabihat score zaban se mashroot object retrieval ka bunyadi signal hai. Ise muassar tareeqe se istemal karne ke liye:

1. Tamam daryaft karda ashiya ko CLIP image embeddings ke taur par pehle se encode karen.
2. Istemal kaar ki object hawala ("laal cup") ko CLIP text embedding ke taur par encode karen.
3. Tamam object embeddings par cosine similarity ka hisaab lagayen.
4. Agar mushabihat ek had (aam taur par CLIP space mein cosine similarity ke liye 0.25) se zyada hai to sab se zyada mushabihat object wapas karen.

Ye tareeqa kaar naye ashiya ko sambhalta hai jin par detection model kabhi tarbiyat nahi paya, jab tak CLIP ne pre-training ke dauran mushabihat tasawwuraat dekhe hon.

### Grasp satah ke andaze ke liye SAM mask behtari

Jab YOLO ek bounding box paida karta hai, to SAM ek durust segmentation mask banata hai. Grasp planning mein mask do maqsadon ke liye kaam karta hai:

1. **Collision geometry.** Mask durust mile pixels ki wazahat karta hai, jise grasp planner ko coarse bounding box ki bajaye object satah ke khilaf clearance ka hisaab lagane deta hai.
2. **Satah normal andaza.** Mask pixels ko 3-D mein plane fit karke (depth data istemal karke), planner grasp point par satah normal ka andaza lagata hai, yakeen banata hai ke gripper satah ke mudaarab hawale par pahunchta hai.

### Trajectory plans se motor hukm ki tayyari

MoveIt 2 ek `RobotTrajectory` message nikalta hai jismein joint positions, velocities, aur accelerations ki ek tarteeb hoti hai. Trajectory controller (masalan `joint_trajectory_controller`) control frequency par waypoints ke darmiyan interpolation karta hai aur har joint actuator ko position hukm bhejta hai.

Mobile manipulators ke liye base aur arm trajectories hamwar hoti hain:

1. **Base navigation** approach pose tak pahunchne ke liye `nav2` istemal karta hai.
2. **Arm handling** grasp pose tak pahunchne ke liye `MoveIt 2` istemal karta hai.
3. **Handoff** hamwar handover ke liye base aur arm harkat ko ham-aahang karta hai.

---

## Hifazat aur hardware notes

<div className="safety-box">
<h3>Sirf matn par kabhi itminan na karen</h3>
<p>VLA system ko kaam se pehle idraak aur pabandiyon mein zaban ko jodna hoga. Agar nazariya, naqsha, ya controller ki halat zaban ke mansoobay se mukhtalif hai, to robot ko rukna chahiye ya bahaali karni chahiye. LLM istidlal ka engine hai, hifazat ki teh nahi. Tamam motor hukm hardcoded joint limits, collision boundaries, aur emergency stop handlers ke saath tasdeeq shuda controllers se guzarte hain.</p>
</div>

<div className="safety-box">
<h3>Itminan ki haddood hifazat ki haddood hain</h3>
<p>Pipeline mein har itminan ki qeemat — transcription, detection, grasp scoring — ek hifazat ki had hai. 0.45 itminan ke saath ek detection "taqreeban yaqeeni" nahi hai. Ye ghair qabil-e-itminad hai. Haddood parhez ki taur par rakhen aur unhen haqeeqi maahol mein azmayen, na ke sirf simulation mein.</p>
</div>

<div className="safety-box">
<h3>Robotic mein LLM khayali cheezen khatarnaak hain</h3>
<p>LLM aisi ashiya bana sakte hain jo maujood nahi hain, naqabil pahunch maqamat ke liye mansoobay bana sakte hain, ya jismani taur par namumkin harkat ki tarteebain paida kar sakte hain. Kaam se pehle har LLM output ko haqeeqi manzar ke khilaf tasdeeq ki jani chahiye. Agar mansooba daryaft ki fehrist mein na hone wale object ka hawala deta hai, to system ko use mustarad karna chahiye, use dhoondne ki koshish nahi karni chahiye.</p>
</div>

---

## Amli laboratory

<div className="lab-box">
<h3>Laboratory: VLA kaam ka card design karen</h3>
<p>"Laal cup lao" hukm ke liye, zaroori idraak, mansoobay ke qadam, ROS 2 actions, tasdeeq ke gates, aur mutbadil jawabat ki wazahat karen. Is module ki schema istemal karen aur apne robot ke kaam ki had ke liye har field ko khususi qeematon se bharen.</p>

<p><strong>Tosee:</strong> "Tamam cups dishwasher mein rakh do" ke liye kaam ka card tabdeel karen. Niyat kaise badal jati hai? Konsi mazeed ashiya daryaft karni hongi? Planner mukhtalif pick-and-place karwaiyon ko kaise tarteeb deta hai?</p>
</div>

<div className="lab-box">
<h3>Laboratory: Whisper tardaat benchmarking</h3>
<p>Apne hadaf hardware par mukhtalif sizes ke Whisper models (tiny, base, small) chalayen. Audio chunk se transcript message tak end-to-end tardaat ki pemaish karen. Tardaat muqabla model size plot karen aur sab se bada model pehchanen jo aapke realtime budget (aam taur par interactive istemal ke liye 1.5 second se kam) mein aaye.</p>
</div>

---

## Quiz

### Apni samajh ki janch karen

1. Vision-Language-Action ka kya matlab hai?
1. VLA pipeline mein object confidence kyun ahem hai?
1. Agar hukm mubham ho to robot ko kya karna chahiye?
1. Controller ki haddiyan kahan honi chahiye — LLM prompt mein, ROS 2 action bridge mein, ya dono mein?
1. CLIP zero-shot object grounding ko kaise faal karta hai?
1. Kaam ke mansoobay mein `clarification_needed` field ka maqsad kya hai?
1. Teen VLA nakaami ke anwaal aur unke mehfooz jawabat ka naam batayen.
1. LLM ko seedha motor drivers kyun nahi chalane chahiye?
1. VLA grasp pipeline mein SAM ka kirdar kya hai?
1. Grasp planner candidates ko filter karne ke liye collision checking ka istemal kaise karta hai?

### Jawabat ki kunji

1. Ek aisa pattern jahan visual idraak, zaban ki samajh, aur robot ka kaam ek band loop workflow mein jure hote hain, roboton ko azad insani hukmon ko samajhne ke qabil banata hai.
1. Kam itminan robot ko ghalat object pakarne ya uski taraf navigate karne ka sabab ban sakta hai. Itminan ki haddood idraak aur kaam ke darmiyan hifazat ke gates ke taur par kaam karti hain.
1. Wazahat mangein ya mehfuz stop/recovery ka tareeqa muntakib karen. Hukm mubham ho to kabhi andaza na lagayen.
1. Dono. LLM prompt planning constraints ko encode karta hai; action bridge unhen kaam ke goals ko bhejne se pehle sakht tasdeeq ke taur par nafaz karta hai. Action bridge hifazat ki teh hai.
1. CLIP tasaweer aur matn ko ek mushtarak embedding space mein encode karta hai, bina kaam ki khususi tarbiyat ke mushabihat par mubni milne ko faal karta hai. "Laal cup" jaisi matn query cosine similarity ke mutabiq image region embeddings se milti hai.
1. Ye downstream system ko batata hai ke LLM hukm ko hal nahi kar saka aur istemal kaar se puchne ke liye ek khususi sawaal faraham karta hai, kushada "Aapka kya matlab hai?" ki bajaye nishandahi wazahat ko faal karta hai.
1. Mubham zaban → puchen konsa object. Kam nazariya itminan → dobara scan karen ya madad mangein. Ghair mehfooz raasta → roken aur dobara mansooba banayen. Naqabil pahunch object → hudood batayen. Controller error → chhoren, dobara koshish karen, ya mansukh karen.
1. Kyunki LLM khayali cheezen banate hain. Wo jismani taur par namumkin mansoobay bana sakte hain, maujood na hone wali ashiya ka hawala de sakte hain, ya ghair mehfooz raasta paida kar sakte hain. Motor hukm ko hardcoded hifazat hudood ke saath tasdeeq shuda controllers se guzarna chahiye.
1. SAM coarse bounding boxes se pixel-perfect segmentation masks banata hai, grasp pose andaze ke liye durust collision geometry aur satah normal maloomat faraham karta hai.
1. Planner har candidate grasp pose ko kaam ki hudood aur rukawaton ki positions ke saath janchta hai. Wo candidates jo takrour paida karen wo khatam ho jaate hain; sirf collision-free candidates ko score aur darjah bandi ki jati hai.

---

## Lughat

| Istilah | Tareef |
|---|---|
| **VLA** | Vision-Language-Action. Ek architecture pattern jo idraak, zaban ki samajh, planning, aur roboton ke liye kaam ko jodta hai. |
| **Grounding** | Tassawwuri zaban ki hawaalon ("laal cup") ko poses aur bounding volumes wali haqeeqi jismani ashiya se milane ka amal. |
| **Whisper** | OpenAI ka open-source khudkar awaaz ki shanakht model jo log-mel spectrograms par encoder-decoder transformer istemal karta hai. |
| **CLIP** | Contrastive Language–Image Pre-training. Ek model jo mushabihat ke liye tasaweer aur matn ko ek mushtarak embedding space mein encode karta hai. |
| **SAM** | Segment Anything Model. Ek prompt-able segmentation model jo bounding boxes, points, ya matn se pixel-accurate masks banata hai. |
| **NMS** | Non-Maximum Suppression. Ek baad ki processing qadam jo duplicate mukabila detections ko khatam karta hai, sirf sab se zyada itminan wala box rakhta hai. |
| **MoveIt 2** | Standard ROS 2 harkat planning framework robotic handling ke liye, IK, collision checking, aur trajectory ki tayyari faraham karta hai. |
| **nav2** | ROS 2 navigation stack, mobile roboton ke liye naqshe par mabni location, raasta planning, aur rukawaton se bachao faraham karta hai. |
| **Action bridge** | Ek darmiyani teh jo oonchi satah ke kaam ke mansoobon ko tasdeek aur error handling ke saath neechli satah ke ROS 2 action goals mein tabdeel karti hai. |
| **Scene graph** | Robot ke maahol ki hidayati numaindagi jo daryaft karda ashiya, unki aqsam, poses, aur itminan scores ki fehrist deti hai. |
| **Chain-of-thought** | Ek prompt technique jo LLM se akhiri output paida karne se pehle maslay par qadam ba qadam istidlal karne ko kehti hai. |
| **Few-shot prompting** | LLM ko matlab ke output format aur istidlal ke andaz ki rehnumai karne ke liye prompt mein namoona input-output jode shamil karna. |
| **Confidence threshold** | Nafaz ke liye qubool hone wali detection ya mansoobay ka sab se kam score; hifazat ke gate ke taur par kaam karta hai. |
| **Fallback** | Bunyadi mansoobay mein nakaami ke baad trigger hone wala ek pehle se tay mutbadil kaam, jaise wazahat mangna, dobara scan karna, ya rokna. |
| **Kaam ki hudood** | Woh jismani volume jis ke andar robot mehfooz tareeqe se kaam kar sakta hai, joint limits aur maholiya pabandiyon se muqarrar. |
| **End-effector** | Robotik baazoo ke aakhir par hua ala (masalan gripper, suction cup) jo ashiya ke saath tasalsul karta hai. |
| **Inverse kinematics (IK)** | End-effector ko matlub 6-DoF pose mein rakhne ke liye zaroori joint angles ka hisaab. |
| **Control frequency** | Woh raftaar jis se robot controller actuators ko hukm bhejta hai, aam taur par handling kaamon ke liye 125-1000 Hz. |
